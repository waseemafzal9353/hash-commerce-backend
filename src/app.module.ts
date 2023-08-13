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
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { GlobalModule } from './global/global.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [AuthModule, MongooseModule.forRoot("mongodb+srv://waseekhan9353:was33khan@commerce.8yekcls.mongodb.net/commerce?retryWrites=true&w=majority"), ProductModule,
  ConfigModule.forRoot({
    isGlobal: true, 
    envFilePath: '.env',  
  }), 
  PassportModule.register({ defaultStrategy: 'local' }), 
  JwtModule.register({
    global: true,
    secret: `${process.env.JWT_SECRET_KEY}`,
    signOptions: { expiresIn: '1h' },
  }), EmailModule, GlobalModule, AdminModule,],
  controllers: [AppController],
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
