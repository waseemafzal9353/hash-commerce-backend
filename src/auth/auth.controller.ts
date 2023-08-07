import {
  Body, Controller, Post, UseInterceptors,
  HttpStatus, Request, UploadedFile, ParseFilePipeBuilder, Res, UseGuards, Get
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/dto/app.dto';
import { FileInterface, UserInterface } from 'src/interfaces/utility.interface';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import fileUpload from 'src/assistantServices/aws-file-upload.service';
import { GlobalServices } from 'src/assistantServices/global.service';
import { Response } from 'express';
import { EmailServices } from 'src/email/email.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { BusinessException } from 'src/Exceptions/business.exception';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private globalServices: GlobalServices, private emailServices: EmailServices) { }

  @Post('/register')
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
  ) avatar: FileInterface, @Body() createUserDto: CreateUserDto) {
    // const uploadAvatarLink: unknown = await fileUpload(avatar)  

    const userCreated = await this.authService.createUser(createUserDto);
    const { user, success } = userCreated
    const { user_email } = user

    if (success) {
      await this.emailServices.sendConfirmationLink({ user_email: `${user_email}` })
    }

    await this.authService.setAccessToken(response, user_email)

    return response.status(HttpStatus.OK).send({
      user: userCreated
    })
  };

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
      const accessToken = await this.authService.login(req.body.user_email)    
    return {
      accessToken,
      // validUser
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
  const user = await this.authService.getUserByEmail(req.user)
  delete user.user_password

    return {
      success: true,
      user
    }
  }
}