import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(signInDto: SignInDto): Promise<User | null> {
    const { username, password } = signInDto;
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(signInDto);
    if (user) {
      const payload = { username: user.username, sub: user.userId };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException();
  }
}
