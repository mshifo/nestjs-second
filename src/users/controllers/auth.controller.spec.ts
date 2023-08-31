import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { User } from '../entities/user.entity';
import { SignInDto } from '../dto/signIn.dto';
import { SignUpDto } from '../dto/SignUp.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should call signIn and return access token', async () => {
    const signInDto = new SignInDto();
    const accessToken = 'token123';

    jest
      .spyOn(service, 'signIn')
      .mockResolvedValue({ access_token: accessToken });

    expect(await controller.signIn(signInDto)).toEqual({
      access_token: accessToken,
    });
    expect(service.signIn).toHaveBeenCalledWith(signInDto);
  });

  it('should call signUp', async () => {
    const signUpDto = new SignUpDto();

    controller.signUp(signUpDto);

    expect(service.signUp).toHaveBeenCalledWith(signUpDto);
  });

  it('should get user profile', async () => {
    const user = new User();
    const req = { user };

    const result = controller.getProfile(req);

    expect(result).toEqual(user);
  });
});
