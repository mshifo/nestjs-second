import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatuses } from '../enums/user-status.enum';
import { Exclude, Expose } from 'class-transformer';
import { MinLength } from 'class-validator';
@Entity({ name: 'users' })
export class User {
  static passwordMinLength = 8;

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ unique: true })
  username: string;

  @MinLength(User.passwordMinLength)
  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ length: 99 })
  name: string;

  @Exclude()
  @Column()
  avatar?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ default: UserStatuses.NOT_ACTIVE })
  status?: string;

  @Exclude()
  @Column()
  salt?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Expose()
  get avatar_url(): string | null {
    return this.avatar ? `${process.env.APP_URL}/${this.avatar}` : null;
  }

  async validatePassword?(password: string): Promise<boolean> {
    const hash = bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
