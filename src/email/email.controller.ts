import { Body, Controller, Post } from '@nestjs/common';
import { EmailServices } from './email.service';
import { ConfirmEmailDto } from 'src/infrastructure/DTOs/email.dto';
import { GlobalService } from 'src/global/global.service';

@Controller('email')
export class EmailController {
  
    constructor(private readonly emailServices: EmailServices, 
    private readonly gloabalServices: GlobalService){}
    
    @Post('confirm')
    async confirm(@Body() confirmationEmailDto: ConfirmEmailDto) {
      const {token, email} = confirmationEmailDto
      const decodedEmail = await this.gloabalServices.decodeJWTToken({token, sub: email});
      await this.emailServices.confirmNewUserEmail(decodedEmail);
    }
}
