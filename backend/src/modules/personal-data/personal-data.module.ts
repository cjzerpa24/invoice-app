import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalDataService } from './personal-data.service';
import { PersonalDataController } from './personal-data.controller';
import { PersonalData } from '../../entities/personal-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalData])],
  controllers: [PersonalDataController],
  providers: [PersonalDataService],
  exports: [PersonalDataService],
})
export class PersonalDataModule {} 