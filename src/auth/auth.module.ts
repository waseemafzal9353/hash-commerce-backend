import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/infrastructure/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailServices } from 'src/email/email.service';
import { EmailConfirmationModel, EmailConfirmationSchema } from 'src/infrastructure/schemas/user-email.schema';
import { EmailModule } from 'src/email/email.module';
import { LocalStrategy } from 'src/infrastructure/strategies/local.strategy';
import { JwtStrategy } from 'src/infrastructure/strategies/jwt.strategy';
import { GlobalService } from 'src/global/global.service';
import { GlobalModule } from 'src/global/global.module';

@Module({
  imports:[MongooseModule.forFeature([{name:'User', schema: UserSchema}, 
  {name:"EmailConfirmation", schema:EmailConfirmationSchema}]), forwardRef(()=> EmailModule), forwardRef(()=> GlobalModule),
],
  controllers: [AuthController],
  providers: [AuthService, User, GlobalService,
  EmailServices, LocalStrategy, JwtStrategy, EmailConfirmationModel],
  exports: [AuthService],
})
export class AuthModule {}
