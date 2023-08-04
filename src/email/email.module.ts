import { Module, forwardRef } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailServices } from './email.service';
import { GlobalServices } from 'src/assistantServices/global.service';
import { AuthService } from 'src/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailConfirmationSchema } from 'src/schemas/email.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports:[MongooseModule.forFeature([{name:'EmailConfirmation', schema: EmailConfirmationSchema},
  {name:'User', schema:UserSchema}]), 
  forwardRef(()=>AuthModule)],
  controllers: [EmailController],
  providers: [EmailServices, GlobalServices, AuthService]
})
export class EmailModule {}
