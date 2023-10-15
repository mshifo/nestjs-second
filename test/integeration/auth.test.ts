import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';

describe('AuthController', () => {
  let app: INestApplication;
  let accessToken;

  const userToAdd: User = {
    name: 'Mahmoud',
    username: 'test89*5',
    password: '123456789',
    email: 'test89@test.com',
    phone: '896522',
    avatar_url: '',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.setGlobalPrefix('api');
  });

  afterAll(() => {
    app.close();
  });

  it('POST /auth/sign-up - should create a new user', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(userToAdd)
      .expect(200);
  });

  it('POST /auth/sign-in - should return access token', async () => {
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
