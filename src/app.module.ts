/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb+srv://waseekhan9353:was33khan@hashcommerce.ulqb3lu.mongodb.net/hashcommerce?retryWrites=true&w=majority'), ProductModule,
  ConfigModule.forRoot({
    isGlobal: true, 
    // envFilePath: '.env',
  }), JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_KEY,
    signOptions: { expiresIn: '60s' },
  }), EmailModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
