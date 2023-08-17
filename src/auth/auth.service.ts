import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) { }

  async validateUser(signInDto: SignInDto): Promise<User> {
    const { username, password } = signInDto;
    const user = await this.userRepository.findOneBy({ username });
    if (user && user.validatePassword(password)) {
      return user;
    }
    throw new UnauthorizedException('User with given credentials not found!');
  }

  async login(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(signInDto);

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
