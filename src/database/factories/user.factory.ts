import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

define(User, (myFaker: typeof faker, settings: { roles: string[] }) => {
  const user = new User();
  user.email = myFaker.internet.email();
  user.name = faker.person.fullName();
  user.username = myFaker.internet.userName();
  user.phone = faker.phone.number();
  const salt = bcrypt.genSaltSync(10);
  user.salt = salt;
  user.password = bcrypt.hashSync('12345678', salt);
  return user;
});
