import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { GetUsersDto } from 'src/users/dto/get-users.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let accessToken: string;
  let userId;
  const salt = bcrypt.genSaltSync(10);

  const userToAdd: User = {
    name: 'Mahmoud',
    username: 'test89*5',
    password: bcrypt.hashSync('12345678', salt),
    salt,
    email: 'test89@test.com',
    phone: '896522',
    avatar_url: '',
  };

  const anotherUserToAdd: User = {
    name: 'Mahmoud',
    username: 'test7893#',
    password: bcrypt.hashSync('12345678', salt),
    salt,
    email: 'test7893@test.com',
    phone: '896522',
    avatar_url: '',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userRepo = moduleFixture.get(UserRepository);

    app = moduleFixture.createNestApplication();
    await app.init();
    app.setGlobalPrefix('api');

    accessToken = await getAccessToken();
  });

  const AddUser = async () => {
    const newUser = userRepo.create(anotherUserToAdd);
    await userRepo.save(newUser);
  };

  const getAccessToken = async () => {
    AddUser();
    const { username, password } = anotherUserToAdd;
    const { body } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username,
        password,
      });
    return body.access_token;
  };

  const deleteUser = async () => {
    await userRepo.delete({
      username: In([userToAdd.username, anotherUserToAdd.username]),
    });
  };

  afterAll(() => {
    deleteUser();
    app.close();
  });

  it('POST /users - should create a new user', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(userToAdd)
      .expect(201);

    userId = body.id;
    expect(userId).toBeDefined();
    expect(body.username).toEqual(userToAdd.username);
  });

  it('GET /users - should get all users', async () => {
    const getUsersDto = new GetUsersDto();
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query(getUsersDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.users.length).toBeGreaterThan(0);
      });
  });

  it('GET /users/:id - should get user by id', async () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(userId);
      });
  });

  it('PATCH /users/:id - should update user by id', async () => {
    const { phone, name } = userToAdd;
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ phone, name })
      .expect(200)
      .expect((res) => {
        expect(res.body.affected).toEqual(1);
      });
  });

  it('DELETE /users/:id - should delete user by id', async () => {
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.affected).toEqual(1);
      });
  });
});
