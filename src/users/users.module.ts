import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [],
  imports: [AuthModule],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
