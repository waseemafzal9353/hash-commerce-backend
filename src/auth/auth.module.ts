import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalServices } from 'src/assistantServices/global.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[MongooseModule.forFeature([{name:'User', schema: UserSchema}]), 
 ],
  controllers: [AuthController],
  providers: [AuthService,User, GlobalServices],
})
export class AuthModule {}
