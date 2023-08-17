import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatuses } from '../enums/user-status.enum';
@Entity({ name: 'users' })
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ length: 99 })
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: UserStatuses.NOT_ACTIVE })
  status: string;

  @Column()
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
