import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './Exceptions/exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(8080);

}
bootstrap();
