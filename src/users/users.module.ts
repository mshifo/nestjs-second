import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController, AuthController],
  providers: [UsersService, UserRepository, AuthService, JwtStrategy],
  exports: [
    /*JwtStrategy, PassportModule*/
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET,
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
})
export class UsersModule {}
