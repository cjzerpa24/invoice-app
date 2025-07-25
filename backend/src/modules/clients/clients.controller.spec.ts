import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { User } from '../../entities/user.entity';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: jest.Mocked<ClientsService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByEmail: jest.fn(),
    } as any;
    controller = new ClientsController(service);
  });

  it('should create a client', async () => {
    const dto = { name: 'John' } as CreateClientDto;
    const user = { id: 'u1' } as User;
    service.create.mockResolvedValue('result' as any);
    const result = await controller.create(dto, user);
    expect(result).toBe('result');
    expect(service.create).toHaveBeenCalledWith(dto, user.id);
  });

  it('should return all clients', async () => {
    const user = { id: 'u1' } as User;
    service.findAll.mockResolvedValue(['c1'] as any);
    const result = await controller.findAll(user);
    expect(result).toEqual(['c1']);
    expect(service.findAll).toHaveBeenCalledWith(user.id);
  });

  it('should get a client by id', async () => {
    const user = { id: 'u1' } as User;
    service.findOne.mockResolvedValue('client' as any);
    const result = await controller.findOne('123', user);
    expect(result).toBe('client');
    expect(service.findOne).toHaveBeenCalledWith('123', user.id);
  });

  it('should update a client', async () => {
    const user = { id: 'u1' } as User;
    const dto = { name: 'Jane' } as UpdateClientDto;
    service.update.mockResolvedValue('updated' as any);
    const result = await controller.update('1', dto, user);
    expect(result).toBe('updated');
    expect(service.update).toHaveBeenCalledWith('1', dto, user.id);
  });

  it('should remove a client', async () => {
    const user = { id: 'u1' } as User;
    service.remove.mockResolvedValue(undefined);
    await controller.remove('1', user);
    expect(service.remove).toHaveBeenCalledWith('1', user.id);
  });
});
