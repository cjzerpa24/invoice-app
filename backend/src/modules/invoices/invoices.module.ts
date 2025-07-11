import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PdfService } from './pdf.service';
import { PdfTemplateService } from './pdf-template.service';
import { TranslationService } from './translation.service';
import { Invoice } from '../../entities/invoice.entity';
import { PersonalData } from '../../entities/personal-data.entity';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, PersonalData]),
    ClientsModule
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, PdfService, PdfTemplateService, TranslationService],
  exports: [InvoicesService],
})
export class InvoicesModule {} 