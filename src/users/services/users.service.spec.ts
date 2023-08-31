import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Repository, UpdateResult } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: UserRepository;

  const updateResult: UpdateResult = {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useClass: Repository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<UserRepository>(UserRepository);
  });

  it('should create a new user', async () => {
    const dto = {
      username: 'test',
      email: 'test@email.com',
    } as CreateUserDto;

    jest.spyOn(repo, 'create').mockReturnValue({ ...dto } as User);
    jest.spyOn(repo, 'save').mockResolvedValue(undefined);

    await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith({
      ...dto,
      salt: expect.any(String),
    });

    expect(repo.save).toHaveBeenCalled();
  });

  it('should find all users', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([]);
    const users = await service.findAll();
    expect(users).toEqual([]);
  });

  it('should find user by id', async () => {
    const user = new User();
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(user);
    const fetched = await service.findOne(1);
    expect(fetched).toEqual(user);
  });

  it('should throw not found error', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
  });

  it('should update user', async () => {
    const dto = {
      username: 'updated',
    } as UpdateUserDto;

    jest.spyOn(repo, 'update').mockResolvedValue(updateResult); // rows affected
    await service.update(1, dto);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
  });

  it('should throw conflict exception on update', async () => {
    jest.spyOn(repo, 'update').mockRejectedValue({ code: 'ER_DUP_ENTRY' });

    const dto = {
      username: 'test',
    } as UpdateUserDto;

    await expect(service.update(1, dto)).rejects.toThrowError(
      ConflictException,
    );
  });

  it('should delete user', async () => {
    jest.spyOn(repo, 'softDelete').mockResolvedValue(updateResult); // rows affected
    await service.remove(1);
    expect(repo.softDelete).toHaveBeenCalledWith(1);
  });
});
