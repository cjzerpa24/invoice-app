import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Res, HttpException, UseGuards, Put  } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { PdfService } from './pdf.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { Language } from './translation.service';

@ApiTags('invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully', type: Invoice })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @CurrentUser() user: User): Promise<Invoice> {
    return await this.invoicesService.create(createInvoiceDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'status', enum: InvoiceStatus, required: false, description: 'Filter by invoice status' })
  @ApiQuery({ name: 'clientId', type: 'string', required: false, description: 'Filter by client ID' })
  @ApiResponse({ status: 200, description: 'List of invoices', type: [Invoice] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('status') status?: InvoiceStatus,
    @Query('clientId') clientId?: string,
    @CurrentUser() user?: User
  ): Promise<Invoice[]> {
    if (status) {
      return await this.invoicesService.findByStatus(status, user.id);
    }
    if (clientId) {
      return await this.invoicesService.findByClient(clientId, user.id);
    }
    return await this.invoicesService.findAll(user.id);
  }

  @Get('generate-number')
  @ApiOperation({ summary: 'Generate a new invoice number' })
  @ApiResponse({ status: 200, description: 'Generated invoice number' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateInvoiceNumber(@CurrentUser() user: User): Promise<{ invoiceNumber: string }> {
    const invoiceNumber = await this.invoicesService.generateInvoiceNumber(user.id);
    return { invoiceNumber };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Invoice ID' })
  @ApiResponse({ status: 200, description: 'Invoice found', type: Invoice })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<Invoice> {
    return await this.invoicesService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiParam({ name: 'id', type: 'string', description: 'Invoice ID' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully', type: Invoice })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto, @CurrentUser() user: User): Promise<Invoice> {
    return await this.invoicesService.update(id, updateInvoiceDto, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiParam({ name: 'id', type: 'string', description: 'Invoice ID' })
  @ApiResponse({ status: 200, description: 'Invoice status updated successfully', type: Invoice })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: InvoiceStatus,
    @CurrentUser() user: User
  ): Promise<Invoice> {
    return await this.invoicesService.updateStatus(id, status, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiParam({ name: 'id', type: 'string', description: 'Invoice ID' })
  @ApiResponse({ status: 204, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.invoicesService.remove(id, user.id);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Get invoice HTML preview' })
  @ApiParam({ name: 'id', type: 'string', description: 'Invoice ID' })
  @ApiQuery({ name: 'lang', enum: ['en', 'es'], required: false, description: 'Language for the invoice (en or es)' })
  @ApiResponse({ status: 200, description: 'Invoice preview HTML returned successfully.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInvoicePreview(
    @Param('id') id: string, 
    @Query('lang') lang: Language = 'en',
    @CurrentUser() user: User
  ) {
    try {
      const html = await this.invoicesService.generateInvoicePreview(id, user.id, lang);
      return { html };
    } catch (error) {
      throw new HttpException('Invoice not found or preview generation failed', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Download invoice as PDF' })
  @ApiParam({ name: 'id', type: 'string', description: 'Invoice ID' })
  @ApiQuery({ name: 'lang', enum: ['en', 'es'], required: false, description: 'Language for the invoice (en or es)' })
  @ApiResponse({ status: 200, description: 'Invoice PDF generated successfully.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async downloadInvoicePdf(
    @Param('id') id: string, 
    @Query('lang') lang: Language = 'en',
    @Res() res: Response, 
    @CurrentUser() user: User
  ) {
    try {
      const { pdfBuffer, invoice } = await this.invoicesService.generateInvoicePdf(id, user.id, lang);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.end(pdfBuffer);
    } catch (error) {
      throw new HttpException('Invoice not found or PDF generation failed', HttpStatus.NOT_FOUND);
    }
  }
} 