import { Injectable } from '@nestjs/common';

export type Language = 'en' | 'es';

export interface InvoiceTranslations {
  invoice: string;
  billTo: string;
  details: string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
  subtotal: string;
  tax: string;
  notes: string;
  termsAndConditions: string;
  paymentInstructions: string;
  bankDetails: string;
  issueDate: string;
  dueDate: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  generatedOn: string;
  status: {
    draft: string;
    sent: string;
    paid: string;
    overdue: string;
    cancelled: string;
  };
}

@Injectable()
export class TranslationService {
  private translations: Record<Language, InvoiceTranslations> = {
    en: {
      invoice: 'INVOICE',
      billTo: 'Bill To',
      details: 'Details',
      description: 'Description',
      quantity: 'Quantity',
      unitPrice: 'Unit Price',
      total: 'Total',
      subtotal: 'Subtotal',
      tax: 'Tax',
      notes: 'Notes',
      termsAndConditions: 'Terms & Conditions',
      paymentInstructions: 'Payment Instructions',
      bankDetails: 'Bank Details',
      issueDate: 'Issue Date',
      dueDate: 'Due Date',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      taxId: 'Tax ID',
      generatedOn: 'This invoice was generated on',
      status: {
        draft: 'Draft',
        sent: 'Sent',
        paid: 'Paid',
        overdue: 'Overdue',
        cancelled: 'Cancelled'
      }
    },
    es: {
      invoice: 'ORDEN DE COBRO',
      billTo: 'Cobrar A',
      details: 'Detalles',
      description: 'Descripción',
      quantity: 'Cantidad',
      unitPrice: 'Precio Unitario',
      total: 'Total',
      subtotal: 'Subtotal',
      tax: 'Impuesto',
      notes: 'Notas',
      termsAndConditions: 'Términos y Condiciones',
      paymentInstructions: 'Instrucciones de Pago',
      bankDetails: 'Datos Bancarios',
      issueDate: 'Fecha de Emisión',
      dueDate: 'Fecha de Vencimiento',
      phone: 'Teléfono',
      email: 'Correo Electrónico',
      website: 'Sitio Web',
      taxId: 'R.I.F.',
      generatedOn: 'Esta factura fue generada el',
      status: {
        draft: 'Borrador',
        sent: 'Enviado',
        paid: 'Pagado',
        overdue: 'Vencido',
        cancelled: 'Cancelado'
      }
    }
  };

  getTranslations(language: Language = 'en'): InvoiceTranslations {
    return this.translations[language] || this.translations.en;
  }

  translate(key: keyof InvoiceTranslations | string, language: Language = 'en'): string {
    const translations = this.getTranslations(language);
    
    if (key.includes('.')) {
      // Handle nested keys like 'status.paid'
      const keys = key.split('.');
      let value: any = translations;
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    }
    
    return (translations as any)[key] || key;
  }

  formatDate(date: Date, language: Language = 'en'): string {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number, language: Language = 'en'): string {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    const currency = language === 'es' ? 'EUR' : 'USD';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }
} 