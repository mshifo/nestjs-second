import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatuses } from '../enums/user-status.enum';
import { Exclude } from 'class-transformer';
import { MinLength } from 'class-validator';
@Entity({ name: 'users' })
export class User {
  static passwordMinLength = 8;

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  username: string;

  @MinLength(User.passwordMinLength)
  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @Column({ length: 99 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ default: UserStatuses.NOT_ACTIVE })
  status: string;

  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
