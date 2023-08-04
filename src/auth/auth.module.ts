import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalServices } from 'src/assistantServices/global.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailServices } from 'src/email/email.service';
import { EmailConfirmationSchema } from 'src/schemas/email.schema';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[MongooseModule.forFeature([{name:'User', schema: UserSchema}, 
  {name:"EmailConfirmation", schema:EmailConfirmationSchema}]), 
  forwardRef(()=> EmailModule) ],
  controllers: [AuthController],
  providers: [AuthService,User, GlobalServices, EmailServices],
})
export class AuthModule {}
