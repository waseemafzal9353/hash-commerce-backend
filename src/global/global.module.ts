import { Module, forwardRef } from '@nestjs/common';
import { EmailServices } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailConfirmationModel, EmailConfirmationSchema } from 'src/infrastructure/schemas/user-email.schema';
import { User, UserSchema } from 'src/infrastructure/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalService } from 'src/global/global.service';
import { EmailModule } from 'src/email/email.module';
@Module({
  imports:[MongooseModule.forFeature([{name:'User', schema: UserSchema}, 
  {name:"EmailConfirmation", schema:EmailConfirmationSchema}]), 
  forwardRef(()=>AuthModule),
  forwardRef(()=>EmailModule)
],
  providers: [AuthService, GlobalService, 
  EmailServices, EmailConfirmationModel, User]
})
export class GlobalModule {}
