import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { UserStatuses } from '../enums/user-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  /**
   * User Full Name
   */
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @ApiPropertyOptional()
  status: UserStatuses;
}
