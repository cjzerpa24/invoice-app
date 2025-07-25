import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../../entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(() => {
    service = {
      register: jest.fn(),
      login: jest.fn(),
    } as any;
    controller = new AuthController(service);
  });

  it('should register a user', async () => {
    const dto = { email: 'a', password: 'b' } as RegisterDto;
    service.register.mockResolvedValue('user' as any);
    const result = await controller.register(dto);
    expect(result).toBe('user');
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const dto = { email: 'a', password: 'b' } as LoginDto;
    service.login.mockResolvedValue('token' as any);
    const result = await controller.login(dto);
    expect(result).toBe('token');
    expect(service.login).toHaveBeenCalledWith(dto);
  });

  it('should return profile', () => {
    const user = { id: 'u1', email: 'e', firstName: 'f', lastName: 'l', fullName: 'f l' } as User;
    const result = controller.getProfile(user);
    expect(result).toEqual({
      id: 'u1',
      email: 'e',
      firstName: 'f',
      lastName: 'l',
      fullName: 'f l',
    });
  });
});
