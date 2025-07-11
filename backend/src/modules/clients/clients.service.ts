import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    const client = this.clientsRepository.create({
      ...createClientDto,
      userId,
    });
    return await this.clientsRepository.save(client);
  }

  async findAll(userId: string): Promise<Client[]> {
    return await this.clientsRepository.find({
      where: { userId },
      relations: ['invoices'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id, userId },
      relations: ['invoices']
    });
    
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, userId: string): Promise<Client> {
    const client = await this.findOne(id, userId);
    Object.assign(client, updateClientDto);
    return await this.clientsRepository.save(client);
  }

  async remove(id: string, userId: string): Promise<void> {
    const client = await this.findOne(id, userId);
    await this.clientsRepository.remove(client);
  }

  async findByEmail(email: string, userId: string): Promise<Client | null> {
    return await this.clientsRepository.findOne({ 
      where: { email, userId } 
    });
  }
} 