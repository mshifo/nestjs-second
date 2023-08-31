import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users.repository';
import { User } from '../entities/user.entity';
import { SignInDto } from '../dto/signIn.dto';
import { SignUpDto } from '../dto/SignUp.dto';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useClass: Repository,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate user and return user entity', async () => {
    const user = new User();
    user.validatePassword = jest.fn().mockResolvedValue(true);

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

    const result = await service.validateUser({
      username: 'test',
      password: '1234',
    } as SignInDto);

    expect(result).toEqual(user);
    expect(user.validatePassword).toHaveBeenCalledWith('1234');
  });

  it('should throw unauthorized exception if user not found', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

    await expect(
      service.validateUser({
        username: 'test',
        password: '1234',
      } as SignInDto),
    ).rejects.toThrowError(UnauthorizedException);
  });

  it('should sign JWT token', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValue({
      id: 1,
      username: 'test',
    } as User);

    const result = await service.signIn({
      username: 'test',
      password: '1234',
    } as SignInDto);

    expect(jwtService.sign).toHaveBeenCalledWith({
      username: 'test',
      sub: 1,
    });
    expect(result).toEqual({ access_token: 'token' });
  });

  it('should hash password', async () => {
    const hashPasswordSpy = jest.spyOn(
      Object.getPrototypeOf(service),
      'hashPassword',
    );
    hashPasswordSpy.mockResolvedValue('mockedHash');

    const hash = await service['hashPassword']('1234', 'salt');

    expect(hash).toBe('mockedHash');
  });

  it('should sign up user', async () => {
    bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    jest.spyOn(userRepository, 'save').mockResolvedValue(undefined);

    const signUpDto = {
      name: 'John',
      username: 'john',
      email: 'john@mail.com',
      password: '1234',
      phone: '1234567890',
    } as SignUpDto;

    await service.signUp(signUpDto);

    expect(userRepository.save).toHaveBeenCalledWith({
      name: 'John',
      username: 'john',
      email: 'john@mail.com',
      phone: '1234567890',
      salt: 'salt',
      password: 'mockedHash',
    });
  });

  it('should throw conflict exception if username/email exists', async () => {
    jest
      .spyOn(userRepository, 'save')
      .mockRejectedValue({ code: 'ER_DUP_ENTRY' });

    const signUpDto = {
      name: 'John',
      username: 'john',
      email: 'john@mail.com',
      password: '1234',
      phone: '1234567890',
    } as SignUpDto;

    await expect(service.signUp(signUpDto)).rejects.toThrowError(
      ConflictException,
    );
  });
});
