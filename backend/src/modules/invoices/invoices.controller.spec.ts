import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PdfService } from './pdf.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus } from '../../entities/invoice.entity';
import { User } from '../../entities/user.entity';
import { Response } from 'express';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: jest.Mocked<InvoicesService>;
  let pdfService: jest.Mocked<PdfService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      remove: jest.fn(),
      findByClient: jest.fn(),
      findByStatus: jest.fn(),
      generateInvoiceNumber: jest.fn(),
      generateInvoicePreview: jest.fn(),
      generateInvoicePdf: jest.fn(),
    } as any;
    pdfService = {} as any;
    controller = new InvoicesController(service, pdfService);
  });

  it('should create an invoice', async () => {
    const dto = { invoiceNumber: 'INV-1' } as CreateInvoiceDto;
    const user = { id: 'u1' } as User;
    service.create.mockResolvedValue('invoice' as any);
    const result = await controller.create(dto, user);
    expect(result).toBe('invoice');
    expect(service.create).toHaveBeenCalledWith(dto, user.id);
  });

  it('should return invoices', async () => {
    const user = { id: 'u1' } as User;
    service.findAll.mockResolvedValue(['i1'] as any);
    const result = await controller.findAll(undefined, undefined, user);
    expect(result).toEqual(['i1']);
    expect(service.findAll).toHaveBeenCalledWith(user.id);
  });

  it('should return invoices by status', async () => {
    const user = { id: 'u1' } as User;
    service.findByStatus.mockResolvedValue(['i1'] as any);
    const result = await controller.findAll(InvoiceStatus.DRAFT, undefined, user);
    expect(result).toEqual(['i1']);
    expect(service.findByStatus).toHaveBeenCalledWith(InvoiceStatus.DRAFT, user.id);
  });

  it('should return invoices by client', async () => {
    const user = { id: 'u1' } as User;
    service.findByClient.mockResolvedValue(['i1'] as any);
    const result = await controller.findAll(undefined, 'c1', user);
    expect(result).toEqual(['i1']);
    expect(service.findByClient).toHaveBeenCalledWith('c1', user.id);
  });

  it('should generate invoice number', async () => {
    const user = { id: 'u1' } as User;
    service.generateInvoiceNumber.mockResolvedValue('INV-2');
    const result = await controller.generateInvoiceNumber(user);
    expect(result).toEqual({ invoiceNumber: 'INV-2' });
    expect(service.generateInvoiceNumber).toHaveBeenCalledWith(user.id);
  });

  it('should get one invoice', async () => {
    const user = { id: 'u1' } as User;
    service.findOne.mockResolvedValue('inv' as any);
    const result = await controller.findOne('1', user);
    expect(result).toBe('inv');
    expect(service.findOne).toHaveBeenCalledWith('1', user.id);
  });

  it('should update an invoice', async () => {
    const user = { id: 'u1' } as User;
    const dto = { description: 'u' } as UpdateInvoiceDto;
    service.update.mockResolvedValue('updated' as any);
    const result = await controller.update('1', dto, user);
    expect(result).toBe('updated');
    expect(service.update).toHaveBeenCalledWith('1', dto, user.id);
  });

  it('should update invoice status', async () => {
    const user = { id: 'u1' } as User;
    service.updateStatus.mockResolvedValue('updated' as any);
    const result = await controller.updateStatus('1', InvoiceStatus.PAID, user);
    expect(result).toBe('updated');
    expect(service.updateStatus).toHaveBeenCalledWith('1', InvoiceStatus.PAID, user.id);
  });

  it('should remove an invoice', async () => {
    const user = { id: 'u1' } as User;
    service.remove.mockResolvedValue(undefined);
    await controller.remove('1', user);
    expect(service.remove).toHaveBeenCalledWith('1', user.id);
  });

  it('should get invoice preview', async () => {
    const user = { id: 'u1' } as User;
    service.generateInvoicePreview.mockResolvedValue('html');
    const result = await controller.getInvoicePreview('1', 'en', user);
    expect(result).toEqual({ html: 'html' });
    expect(service.generateInvoicePreview).toHaveBeenCalledWith('1', user.id, 'en');
  });

  it('should download invoice pdf', async () => {
    const user = { id: 'u1' } as User;
    const pdfBuffer = Buffer.from('pdf');
    service.generateInvoicePdf.mockResolvedValue({ pdfBuffer, invoice: { invoiceNumber: '1' } } as any);
    const headers: Record<string, string> = {};
    const res = {
      setHeader: (k: string, v: string) => {
        headers[k] = v;
      },
      end: jest.fn(),
    } as unknown as Response;
    await controller.downloadInvoicePdf('1', 'en', res, user);
    expect(service.generateInvoicePdf).toHaveBeenCalledWith('1', user.id, 'en');
    expect(headers['Content-Type']).toBe('application/pdf');
    expect(res.end).toHaveBeenCalledWith(pdfBuffer);
  });
});
