import { Body, Controller, Post, UseInterceptors, 
  HttpStatus, UploadedFile, ParseFilePipeBuilder, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/app.dto';
import { FileInterface, UserInterface } from 'src/interfaces/utility.interface';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { jwtPayloadInterface } from 'src/interfaces/utility.interface';
// import fileUpload from 'src/assistantServices/aws-file-upload.service';
import { GlobalServices } from 'src/assistantServices/global.service';
import { Response } from 'express';
import { EmailServices } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private globalServices: GlobalServices, private emailServices: EmailServices){}

  @Post("/register")
  @UseInterceptors(FileInterceptor("file"))
  async createUser(@Res() response: Response, @UploadedFile(
    new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'jpeg',
    })
    // .addMaxSizeValidator({
    //   maxSize: 1000
    // })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
  ) avatar: FileInterface, @Body() createUserDto: CreateUserDto){
    // const uploadAvatarLink: unknown = await fileUpload(avatar)  
   
    const userCreated = await this.authService.createUser(createUserDto);
    
    const {user, success} = userCreated
    const payload: jwtPayloadInterface = {
      sub: user._id.toString()
  }

  const {user_email} = user

  if(success) {
    await this.emailServices.sendConfirmationLink({email: `${user_email}`})
    // const accessToken = await this.globalServices.createJWTAccessToken(payload)
    // response.cookie('access-token', accessToken, {
    //     httpOnly: true,
    //     maxAge: 86400000
    // })
  }
     return response.status(HttpStatus.OK).send({
      user: userCreated
     })
  }
}
