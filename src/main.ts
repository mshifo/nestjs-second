import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      //disableErrorMessages: true,
      whitelist: true, //automatically remove those without any decorator in the validation class
    }),
  ); //set globally to every route
  await app.listen(3000);
}
bootstrap();
