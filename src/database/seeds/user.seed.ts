import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Seeder as SeederEntity } from '../seeder.entity';
export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const seederName = 'CreateUsers';
    // Check if the seeder has been run
    const seeder = await connection
      .getRepository(SeederEntity)
      .findOne({ where: { name: seederName } });
    if (seeder) {
      console.log(`The seeder ${seederName} has been run before, skipping...`);
      return;
    }

    // If the seeder has not been run, run it and mark it as run
    await factory(User)().createMany(15);
    await connection.getRepository(SeederEntity).save({ name: seederName });
    // When all seeding is done, close the connection
    await connection.close();
  }
}
