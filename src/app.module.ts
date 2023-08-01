/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [AuthModule, MongooseModule.forRoot(`mongodb://0.0.0.0:27017/hashcommerce` ), ProductModule,
  ConfigModule.forRoot({
    isGlobal: true, 
    envFilePath: '.env',
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
