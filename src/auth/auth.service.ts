import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInDto } from './dto/signIn.dto';
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

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(signInDto);

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { name, username, email, password, phone } = signUpDto;
    const user = new User();
    user.name = name;
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Username or Email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
