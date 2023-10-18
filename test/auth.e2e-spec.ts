import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { In } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let accessToken;
  const salt = bcrypt.genSaltSync(10);

  const userToAdd: User = {
    name: 'Mahmoud',
    username: 'test89*5',
    password: bcrypt.hashSync('12345678', salt),
    email: 'test89@test.com',
    phone: '896522',
    avatar_url: '',
    salt,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userRepo = moduleFixture.get(UserRepository);

    app = moduleFixture.createNestApplication();
    await app.init();
    app.setGlobalPrefix('api');
  });

  const deleteUser = async () => {
    await userRepo.delete({
      username: In([userToAdd.username]),
    });
  };

  const addUser = async () => {
    const newUser = userRepo.create(userToAdd);
    await userRepo.save(newUser);
  };

  afterAll(() => {
    deleteUser();
    app.close();
  });

  it('POST /auth/sign-up - should create a new user', async () => {
    request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(userToAdd)
      .expect(200);
  });

  it('POST /auth/sign-in - should return access token', async () => {
    addUser();
    const { username, password } = userToAdd;
    const { body } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username,
        password,
      })
      .expect(200);

    accessToken = body.access_token;
    expect(accessToken).toBeDefined();
  });

  it('GET /auth/profile - should get user profile', async () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.username).toEqual(userToAdd.username);
      });
  });
});
