import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUsersDto } from '../dto/get-users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue([[], 0]),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create method', async () => {
      const dto = new CreateUserDto();
      await controller.create(dto);
      expect(service.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call findAll method', async () => {
      const dto = new GetUsersDto();
      const { page, limit } = await controller.findAll(dto);
      expect(service.findAll).toBeCalledWith(limit, page);
    });
  });

  describe('findOne', () => {
    it('should call findOne method', async () => {
      const id = 1;
      await controller.findOne(id);
      expect(service.findOne).toBeCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call update method', async () => {
      const id = 1;
      const dto = new UpdateUserDto();
      await controller.update(id, dto);
      expect(service.update).toBeCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call remove method', async () => {
      const id = 1;
      await controller.remove(id);
      expect(service.remove).toBeCalledWith(id);
    });
  });
});
