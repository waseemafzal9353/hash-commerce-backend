import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalServices } from 'src/assistantServices/global.service';
import { EmailServices } from 'src/email/email.service';
import { EmailConfirmationSchema } from 'src/schemas/email.schema';
import { EmailModule } from 'src/email/email.module';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';


@Module({
  imports:[MongooseModule.forFeature([{name:'User', schema: UserSchema}, 
  {name:"EmailConfirmation", schema:EmailConfirmationSchema}]), 
  forwardRef(()=> EmailModule) ],
  controllers: [AuthController],
  providers: [AuthService,User, GlobalServices, EmailServices, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
