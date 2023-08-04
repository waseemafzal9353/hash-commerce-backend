import { Body, Controller, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailServices } from './email.service';
import { ConfirmEmailDto } from 'src/dto/app.dto';
import { GlobalServices } from 'src/assistantServices/global.service';

@Controller('email')
export class EmailController {
  
    constructor(private readonly emailServices: EmailServices, 
    private readonly gloabalServices: GlobalServices){}
    
    @Post('confirm')
    async confirm(@Body() confirmationEmailDto: ConfirmEmailDto) {
      const {token, email} = confirmationEmailDto
      const decodedEmail = await this.gloabalServices.decodeJWTToken({token, sub: email});
      await this.emailServices.confirmNewUserEmail(decodedEmail);
    }
}
