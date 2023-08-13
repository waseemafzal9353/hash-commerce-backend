import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './infrastructure/Exceptions/exception.filter';
import { ClassSerializerInterceptor } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );
  app.enableCors()
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(8080);

}
bootstrap();
