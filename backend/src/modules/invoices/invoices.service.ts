import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { PersonalData } from '../../entities/personal-data.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ClientsService } from '../clients/clients.service';
import { PdfService } from './pdf.service';
import { Language } from './translation.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(PersonalData)
    private personalDataRepository: Repository<PersonalData>,
    private clientsService: ClientsService,
    private pdfService: PdfService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, userId: string): Promise<Invoice> {
    // Verify client exists and belongs to user
    await this.clientsService.findOne(createInvoiceDto.clientId, userId);
    
    // Check if invoice number already exists for this user
    const existingInvoice = await this.invoicesRepository.findOne({
      where: { invoiceNumber: createInvoiceDto.invoiceNumber, userId }
    });
    
    if (existingInvoice) {
      throw new BadRequestException(`Invoice number ${createInvoiceDto.invoiceNumber} already exists`);
    }

    const invoice = this.invoicesRepository.create({
      ...createInvoiceDto,
      userId,
      issueDate: new Date(createInvoiceDto.issueDate),
      dueDate: new Date(createInvoiceDto.dueDate),
    });
    
    return await this.invoicesRepository.save(invoice);
  }

  async findAll(userId: string): Promise<Invoice[]> {
    return await this.invoicesRepository.find({
      where: { userId },
      relations: ['client'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id, userId },
      relations: ['client']
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, userId: string): Promise<Invoice> {
    const invoice = await this.findOne(id, userId);
    
    // If clientId is being updated, verify the new client exists and belongs to user
    if (updateInvoiceDto.clientId && updateInvoiceDto.clientId !== invoice.clientId) {
      await this.clientsService.findOne(updateInvoiceDto.clientId, userId);
    }
    
    // If invoice number is being updated, check for uniqueness within user's invoices
    if (updateInvoiceDto.invoiceNumber && updateInvoiceDto.invoiceNumber !== invoice.invoiceNumber) {
      const existingInvoice = await this.invoicesRepository.findOne({
        where: { invoiceNumber: updateInvoiceDto.invoiceNumber, userId }
      });
      
      if (existingInvoice) {
        throw new BadRequestException(`Invoice number ${updateInvoiceDto.invoiceNumber} already exists`);
      }
    }

    // Convert date strings to Date objects if provided
    const updateData = { ...updateInvoiceDto };
    if (updateData.issueDate) {
      updateData.issueDate = new Date(updateData.issueDate) as any;
    }
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate) as any;
    }
    
    Object.assign(invoice, updateData);
    return await this.invoicesRepository.save(invoice);
  }

  async remove(id: string, userId: string): Promise<void> {
    const invoice = await this.findOne(id, userId);
    await this.invoicesRepository.remove(invoice);
  }

  async updateStatus(id: string, status: InvoiceStatus, userId: string): Promise<Invoice> {
    const invoice = await this.findOne(id, userId);
    invoice.status = status;
    return await this.invoicesRepository.save(invoice);
  }

  async findByClient(clientId: string, userId: string): Promise<Invoice[]> {
    return await this.invoicesRepository.find({
      where: { clientId, userId },
      relations: ['client'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: InvoiceStatus, userId: string): Promise<Invoice[]> {
    return await this.invoicesRepository.find({
      where: { status, userId },
      relations: ['client'],
      order: { createdAt: 'DESC' }
    });
  }

  async generateInvoiceNumber(userId: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Find the latest invoice for this month for this user
    const latestInvoice = await this.invoicesRepository
      .createQueryBuilder('invoice')
      .where('invoice.invoiceNumber LIKE :pattern', { pattern: `INV-${year}${month}-%` })
      .andWhere('invoice.userId = :userId', { userId })
      .orderBy('invoice.invoiceNumber', 'DESC')
      .getOne();
    
    let nextNumber = 1;
    if (latestInvoice) {
      const parts = latestInvoice.invoiceNumber.split('-');
      if (parts.length === 3) {
        nextNumber = parseInt(parts[2]) + 1;
      }
    }
    
    return `INV-${year}${month}-${String(nextNumber).padStart(4, '0')}`;
  }

  async generateInvoicePreview(id: string, userId: string, language: Language = 'en'): Promise<string> {
    const invoice = await this.findOne(id, userId);
    const personalData = await this.getDefaultPersonalData(userId);
    return await this.pdfService.generateInvoicePreview(invoice, personalData, language);
  }

  async generateInvoicePdf(id: string, userId: string, language: Language = 'en'): Promise<{ pdfBuffer: Buffer; invoice: Invoice }> {
    const invoice = await this.findOne(id, userId);
    const personalData = await this.getDefaultPersonalData(userId);
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice, personalData, language);
    return { pdfBuffer, invoice };
  }

  private async getDefaultPersonalData(userId: string): Promise<PersonalData> {
    const personalDataList = await this.personalDataRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 1
    });
    
    const personalData = personalDataList.length > 0 ? personalDataList[0] : null;
    
    if (!personalData) {
      // Return default personal data if none exists
      return {
        id: '',
        userId,
        businessName: 'Your Business Name',
        fullName: 'Your Full Name',
        email: 'your@email.com',
        phone: 'Your Phone',
        address: 'Your Address',
        city: 'Your City',
        state: 'Your State',
        zipCode: 'Your ZIP',
        country: 'Your Country',
        website: 'Your Website',
        taxId: 'Your Tax ID',
        bankDetails: '',
        paymentInstructions: 'Payment instructions here',
        logo: '',
        signature: '',
        createdAt: new Date(),
        updatedAt: new Date()
      } as PersonalData;
    }
    
    return personalData;
  }
} 