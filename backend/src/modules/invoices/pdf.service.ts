import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PdfTemplateService } from './pdf-template.service';
import { Invoice } from '../../entities/invoice.entity';
import { PersonalData } from '../../entities/personal-data.entity';
import { Language } from './translation.service';

@Injectable()
export class PdfService {
  constructor(private readonly pdfTemplateService: PdfTemplateService) {}

  async generateInvoicePdf(invoice: Invoice, personalData: PersonalData, language: Language = 'en'): Promise<Buffer> {
    const html = this.pdfTemplateService.generateInvoiceHtml(invoice, personalData, language);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  async generateInvoicePreview(invoice: Invoice, personalData: PersonalData, language: Language = 'en'): Promise<string> {
    return this.pdfTemplateService.generateInvoiceHtml(invoice, personalData, language);
  }
} 