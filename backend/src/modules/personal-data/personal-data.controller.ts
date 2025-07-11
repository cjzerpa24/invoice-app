import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PersonalDataService } from './personal-data.service';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { PersonalData } from '../../entities/personal-data.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('personal-data')
@Controller('personal-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create new personal data record' })
  @ApiResponse({ status: 201, description: 'Personal data created successfully', type: PersonalData })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createPersonalDataDto: CreatePersonalDataDto, @CurrentUser() user: User): Promise<PersonalData> {
    return await this.personalDataService.create(createPersonalDataDto, user.id);
  }

  @Post('create-or-update')
  @ApiOperation({ summary: 'Create new personal data or update existing default record' })
  @ApiResponse({ status: 201, description: 'Personal data created or updated successfully', type: PersonalData })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrUpdate(@Body() personalDataDto: CreatePersonalDataDto, @CurrentUser() user: User): Promise<PersonalData> {
    return await this.personalDataService.createOrUpdate(personalDataDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all personal data records' })
  @ApiResponse({ status: 200, description: 'List of personal data records', type: [PersonalData] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: User): Promise<PersonalData[]> {
    return await this.personalDataService.findAll(user.id);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get the default personal data record' })
  @ApiResponse({ status: 200, description: 'Default personal data record', type: PersonalData })
  @ApiResponse({ status: 404, description: 'No personal data found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDefault(@CurrentUser() user: User): Promise<PersonalData | null> {
    return await this.personalDataService.getDefault(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get personal data by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Personal data ID' })
  @ApiResponse({ status: 200, description: 'Personal data found', type: PersonalData })
  @ApiResponse({ status: 404, description: 'Personal data not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<PersonalData> {
    return await this.personalDataService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update personal data' })
  @ApiParam({ name: 'id', type: 'string', description: 'Personal data ID' })
  @ApiResponse({ status: 200, description: 'Personal data updated successfully', type: PersonalData })
  @ApiResponse({ status: 404, description: 'Personal data not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() updatePersonalDataDto: UpdatePersonalDataDto, @CurrentUser() user: User): Promise<PersonalData> {
    return await this.personalDataService.update(id, updatePersonalDataDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete personal data' })
  @ApiParam({ name: 'id', type: 'string', description: 'Personal data ID' })
  @ApiResponse({ status: 204, description: 'Personal data deleted successfully' })
  @ApiResponse({ status: 404, description: 'Personal data not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.personalDataService.remove(id, user.id);
  }
} 