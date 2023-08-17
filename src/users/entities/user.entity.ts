import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  status: string;

  @Column()
  salt: string;

  @Column()
  createdAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
