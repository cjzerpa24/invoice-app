import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PersonalDataModule } from './modules/personal-data/personal-data.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Client } from './entities/client.entity';
import { Invoice } from './entities/invoice.entity';
import { PersonalData } from './entities/personal-data.entity';
import { User } from './entities/user.entity';

const getDatabaseConfig = () => {
  const entities = [User, Client, Invoice, PersonalData];
  const synchronize = process.env.NODE_ENV !== 'production';

  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      entities,
      synchronize,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    type: 'sqlite' as const,
    database: 'invoice_app.db',
    entities,
    synchronize,
  };
};

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    UsersModule,
    ClientsModule,
    InvoicesModule,
    PersonalDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 