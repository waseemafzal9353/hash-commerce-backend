import { Module, forwardRef } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailServices } from './email.service';
import { AuthService } from 'src/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailConfirmationSchema } from 'src/infrastructure/schemas/user-email.schema';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalModule } from 'src/global/global.module';
import { GlobalService } from 'src/global/global.service';


@Module({
  imports:[MongooseModule.forFeature([{name:'EmailConfirmation', 
  schema: EmailConfirmationSchema},
  {name:'User', schema:UserSchema}]), 
  forwardRef(()=>AuthModule),
  forwardRef(()=>GlobalModule)
],
  controllers: [EmailController],
  providers: [EmailServices, AuthService, GlobalService]
})
export class EmailModule {}
