import { PersonalDataController } from './personal-data.controller';
import { PersonalDataService } from './personal-data.service';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { User } from '../../entities/user.entity';

describe('PersonalDataController', () => {
  let controller: PersonalDataController;
  let service: jest.Mocked<PersonalDataService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getDefault: jest.fn(),
      createOrUpdate: jest.fn(),
    } as any;
    controller = new PersonalDataController(service);
  });

  it('should create personal data', async () => {
    const dto = { businessName: 'biz' } as CreatePersonalDataDto;
    const user = { id: 'u1' } as User;
    service.create.mockResolvedValue('pd' as any);
    const result = await controller.create(dto, user);
    expect(result).toBe('pd');
    expect(service.create).toHaveBeenCalledWith(dto, user.id);
  });

  it('should create or update personal data', async () => {
    const dto = { businessName: 'biz' } as CreatePersonalDataDto;
    const user = { id: 'u1' } as User;
    service.createOrUpdate.mockResolvedValue('pd' as any);
    const result = await controller.createOrUpdate(dto, user);
    expect(result).toBe('pd');
    expect(service.createOrUpdate).toHaveBeenCalledWith(dto, user.id);
  });

  it('should return all personal data', async () => {
    const user = { id: 'u1' } as User;
    service.findAll.mockResolvedValue(['pd'] as any);
    const result = await controller.findAll(user);
    expect(result).toEqual(['pd']);
    expect(service.findAll).toHaveBeenCalledWith(user.id);
  });

  it('should get default personal data', async () => {
    const user = { id: 'u1' } as User;
    service.getDefault.mockResolvedValue('pd' as any);
    const result = await controller.getDefault(user);
    expect(result).toBe('pd');
    expect(service.getDefault).toHaveBeenCalledWith(user.id);
  });

  it('should find one personal data', async () => {
    const user = { id: 'u1' } as User;
    service.findOne.mockResolvedValue('pd' as any);
    const result = await controller.findOne('1', user);
    expect(result).toBe('pd');
    expect(service.findOne).toHaveBeenCalledWith('1', user.id);
  });

  it('should update personal data', async () => {
    const user = { id: 'u1' } as User;
    const dto = { businessName: 'new' } as UpdatePersonalDataDto;
    service.update.mockResolvedValue('pd' as any);
    const result = await controller.update('1', dto, user);
    expect(result).toBe('pd');
    expect(service.update).toHaveBeenCalledWith('1', dto, user.id);
  });

  it('should remove personal data', async () => {
    const user = { id: 'u1' } as User;
    service.remove.mockResolvedValue(undefined);
    await controller.remove('1', user);
    expect(service.remove).toHaveBeenCalledWith('1', user.id);
  });
});
