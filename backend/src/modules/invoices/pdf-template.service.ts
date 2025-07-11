import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { Invoice } from '../../entities/invoice.entity';
import { PersonalData } from '../../entities/personal-data.entity';
import { TranslationService, Language } from './translation.service';

@Injectable()
export class PdfTemplateService {
  constructor(private readonly translationService: TranslationService) {}

  private getInvoiceTemplate(): string {
    const openBrace = '{{';
    const closeBrace = '}}';
    
    return `
<!DOCTYPE html>
<html lang="${openBrace}language${closeBrace}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${openBrace}t.invoice${closeBrace} ${openBrace}invoiceNumber${closeBrace}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            background: white;
            direction: ltr;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 10px;
        }
        
        .company-details {
            color: #666;
            line-height: 1.4;
        }
        
        .invoice-title {
            text-align: right;
            flex: 1;
        }
        
        .invoice-title h1 {
            font-size: 36px;
            color: #1e3a8a;
            margin-bottom: 10px;
        }
        
        .invoice-number {
            font-size: 18px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        
        .client-info, .invoice-details {
            flex: 1;
        }
        
        .client-info {
            margin-right: 40px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .client-details, .invoice-meta {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .items-table th {
            background: #3b82f6;
            color: white;
            padding: 15px 10px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .items-table tr:hover {
            background: #f3f4f6;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .totals {
            margin-left: auto;
            width: 300px;
        }
        
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .totals-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .totals-table .label {
            font-weight: bold;
            text-align: right;
        }
        
        .totals-table .amount {
            text-align: right;
            width: 100px;
        }
        
        .total-row {
            background: #1e3a8a;
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        
        .total-row td {
            border-bottom: none;
        }
        
        .notes-section {
            margin-top: 40px;
        }
        
        .notes, .terms {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #10b981;
        }
        
        .terms {
            border-left-color: #f59e0b;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #666;
            font-size: 12px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .status-draft { background: #f3f4f6; color: #374151; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .status-cancelled { background: #f3f4f6; color: #374151; }
        
        @media print {
            .container {
                padding: 20px;
            }
            
            body {
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                <div class="company-name">${openBrace}personalData.businessName${closeBrace}</div>
                <div class="company-details">
                    ${openBrace}#if personalData.address${closeBrace}${openBrace}personalData.address${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if personalData.city${closeBrace}${openBrace}personalData.city${closeBrace}${openBrace}#if personalData.state${closeBrace}, ${openBrace}personalData.state${closeBrace}${openBrace}/if${closeBrace} ${openBrace}personalData.zipCode${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if personalData.country${closeBrace}${openBrace}personalData.country${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if personalData.phone${closeBrace}<strong>${openBrace}t.phone${closeBrace}:</strong> ${openBrace}personalData.phone${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if personalData.email${closeBrace}<strong>${openBrace}t.email${closeBrace}:</strong> ${openBrace}personalData.email${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if personalData.taxId${closeBrace}<strong>${openBrace}t.taxId${closeBrace}:</strong> ${openBrace}personalData.taxId${closeBrace}${openBrace}/if${closeBrace}
                </div>
            </div>
            <div class="invoice-title">
                <h2>${openBrace}t.invoice${closeBrace}</h2>
                <div class="invoice-number"># ${openBrace}invoiceNumber${closeBrace}</div>
            </div>
        </div>

        <!-- Invoice Info -->
        <div class="invoice-info">
            <div class="client-info">
                <div class="section-title">${openBrace}t.billTo${closeBrace}</div>
                <div class="client-details">
                    <strong>${openBrace}client.name${closeBrace}</strong><br>
                    ${openBrace}#if client.address${closeBrace}${openBrace}client.address${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if client.city${closeBrace}${openBrace}client.city${closeBrace}${openBrace}#if client.state${closeBrace}, ${openBrace}client.state${closeBrace}${openBrace}/if${closeBrace} ${openBrace}client.zipCode${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if client.country${closeBrace}${openBrace}client.country${closeBrace}<br>${openBrace}/if${closeBrace}
                    ${openBrace}#if client.phone${closeBrace}<strong>${openBrace}t.phone${closeBrace}:</strong> ${openBrace}client.phone${closeBrace}<br>${openBrace}/if${closeBrace}
                    <strong>${openBrace}t.email${closeBrace}:</strong> ${openBrace}client.email${closeBrace}<br>
                    ${openBrace}#if client.taxId${closeBrace}<strong>${openBrace}t.taxId${closeBrace}:</strong> ${openBrace}client.taxId${closeBrace}${openBrace}/if${closeBrace}
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="section-title">${openBrace}t.details${closeBrace}</div>
                <div class="invoice-meta">
                    <strong>${openBrace}t.issueDate${closeBrace}:</strong> ${openBrace}issueDateFormatted${closeBrace}<br>
                    <strong>${openBrace}t.dueDate${closeBrace}:</strong> ${openBrace}dueDateFormatted${closeBrace}<br>
                    <!-- ${openBrace}#if description${closeBrace}<strong>${openBrace}t.description${closeBrace}:</strong> ${openBrace}description${closeBrace}${openBrace}/if${closeBrace} -->
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%;">${openBrace}t.description${closeBrace}</th>
                    <th style="width: 15%;" class="text-center">${openBrace}t.quantity${closeBrace}</th>
                    <th style="width: 15%;" class="text-right">${openBrace}t.unitPrice${closeBrace}</th>
                    <th style="width: 20%;" class="text-right">${openBrace}t.total${closeBrace}</th>
                </tr>
            </thead>
            <tbody>
                ${openBrace}#each items${closeBrace}
                <tr>
                    <td>${openBrace}description${closeBrace}</td>
                    <td class="text-center">${openBrace}quantity${closeBrace}</td>
                    <td class="text-right">${openBrace}unitPriceFormatted${closeBrace}</td>
                    <td class="text-right">${openBrace}totalFormatted${closeBrace}</td>
                </tr>
                ${openBrace}/each${closeBrace}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td class="label">${openBrace}t.subtotal${closeBrace}:</td>
                    <td class="amount">${openBrace}subtotalFormatted${closeBrace}</td>
                </tr>
                ${openBrace}#if taxRate${closeBrace}
                <tr>
                    <td class="label">${openBrace}t.tax${closeBrace} (${openBrace}taxRate${closeBrace}%):</td>
                    <td class="amount">${openBrace}taxAmountFormatted${closeBrace}</td>
                </tr>
                ${openBrace}/if${closeBrace}
                <tr class="total-row">
                    <td class="label">${openBrace}t.total${closeBrace}:</td>
                    <td class="amount">${openBrace}totalFormatted${closeBrace}</td>
                </tr>
            </table>
        </div>

        <!-- Notes and Terms -->
        <div class="notes-section">
            ${openBrace}#if notes${closeBrace}
            <div class="section-title">${openBrace}t.notes${closeBrace}</div>
            <div class="notes">${openBrace}notes${closeBrace}</div>
            ${openBrace}/if${closeBrace}
            
            ${openBrace}#if terms${closeBrace}
            <div class="section-title">${openBrace}t.termsAndConditions${closeBrace}</div>
            <div class="terms">${openBrace}terms${closeBrace}</div>
            ${openBrace}/if${closeBrace}
            
            ${openBrace}#if personalData.paymentInstructions${closeBrace}
            <div class="section-title">${openBrace}t.paymentInstructions${closeBrace}</div>
            <div class="notes">${openBrace}personalData.paymentInstructions${closeBrace}</div>
            ${openBrace}/if${closeBrace}
            
            ${openBrace}#if personalData.bankDetails${closeBrace}
            <div class="section-title">${openBrace}t.bankDetails${closeBrace}</div>
            <div class="notes">${openBrace}personalData.bankDetails${closeBrace}</div>
            ${openBrace}/if${closeBrace}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>${openBrace}t.generatedOn${closeBrace} ${openBrace}generatedDate${closeBrace}</p>
        </div>
    </div>
</body>
</html>`;
  }

  generateInvoiceHtml(invoice: Invoice, personalData: PersonalData, language: Language = 'en'): string {
    const template = Handlebars.compile(this.getInvoiceTemplate());
    const translations = this.translationService.getTranslations(language);
    
    // Format the data for the template
    const data = {
      ...invoice,
      personalData,
      language,
      t: translations,
      issueDateFormatted: this.translationService.formatDate(new Date(invoice.issueDate), language),
      dueDateFormatted: this.translationService.formatDate(new Date(invoice.dueDate), language),
      statusDisplay: this.translationService.translate(`status.${invoice.status}`, language),
      subtotalFormatted: this.formatCurrency(invoice.subtotal, language),
      taxAmountFormatted: this.formatCurrency(invoice.taxAmount, language),
      totalFormatted: this.formatCurrency(invoice.total, language),
      items: invoice.items.map(item => ({
        ...item,
        unitPriceFormatted: this.formatCurrency(item.unitPrice, language),
        totalFormatted: this.formatCurrency(item.total, language)
      })),
      generatedDate: this.translationService.formatDate(new Date(), language)
    };

    return template(data);
  }

  private formatCurrency(amount: number, language: Language): string {
    // For now, use simple formatting without currency symbol since we removed the complex formatting
    return amount.toFixed(2);
  }
} 