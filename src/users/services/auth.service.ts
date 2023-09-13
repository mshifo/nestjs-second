import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { SignInDto } from '../dto/signIn.dto';
import { SignUpDto } from '../dto/SignUp.dto';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailService,
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

  async signUp(
    signUpDto: SignUpDto,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const { name, username, email, password, phone } = signUpDto;
    const user = new User();
    user.name = name;
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.avatar = avatar?.path;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Username or Email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const sent = await this.mailService.sendUserConfirmation(user, token);
    this.logger.verbose(`Email Sent to ${user.email} and response is`, sent);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
