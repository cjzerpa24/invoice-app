import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalData } from '../../entities/personal-data.entity';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';

@Injectable()
export class PersonalDataService {
  constructor(
    @InjectRepository(PersonalData)
    private personalDataRepository: Repository<PersonalData>,
  ) {}

  async create(createPersonalDataDto: CreatePersonalDataDto, userId: string): Promise<PersonalData> {
    const personalData = this.personalDataRepository.create({
      ...createPersonalDataDto,
      userId,
    });
    return await this.personalDataRepository.save(personalData);
  }

  async findAll(userId: string): Promise<PersonalData[]> {
    return await this.personalDataRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<PersonalData> {
    const personalData = await this.personalDataRepository.findOne({
      where: { id, userId }
    });
    
    if (!personalData) {
      throw new NotFoundException(`Personal data with ID ${id} not found`);
    }
    
    return personalData;
  }

  async update(id: string, updatePersonalDataDto: UpdatePersonalDataDto, userId: string): Promise<PersonalData> {
    const personalData = await this.findOne(id, userId);
    Object.assign(personalData, updatePersonalDataDto);
    return await this.personalDataRepository.save(personalData);
  }

  async remove(id: string, userId: string): Promise<void> {
    const personalData = await this.findOne(id, userId);
    await this.personalDataRepository.remove(personalData);
  }

  async getDefault(userId: string): Promise<PersonalData | null> {
    // Get the most recently created personal data record for this user
    const personalDataList = await this.personalDataRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 1
    });
    
    return personalDataList.length > 0 ? personalDataList[0] : null;
  }

  async createOrUpdate(personalDataDto: CreatePersonalDataDto | UpdatePersonalDataDto, userId: string): Promise<PersonalData> {
    const existingData = await this.getDefault(userId);
    
    if (existingData) {
      return await this.update(existingData.id, personalDataDto, userId);
    } else {
      return await this.create(personalDataDto as CreatePersonalDataDto, userId);
    }
  }
} 