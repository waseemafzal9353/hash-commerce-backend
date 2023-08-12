import {
  Body, Controller, Post, UseInterceptors,
  HttpStatus, Request, UploadedFile, ParseFilePipeBuilder, Res, UseGuards, 
  Get
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/infrastructure/DTOs/user.dto';
import { FileInterface, UserInterface } from 'src/infrastructure/interfaces/utility.interface';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import fileUpload from 'src/assistantServices/aws-file-upload.service';
import { Response } from 'express';
import { EmailServices } from 'src/email/email.service';
import { LocalAuthGuard } from 'src/infrastructure/guards/local-auth.guard';
import { BusinessException } from 'src/infrastructure/Exceptions/business.exception';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';
import { GlobalService } from 'src/global/global.service';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, 
  private globalServices: GlobalService, 
  private emailServices: EmailServices) { }

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

    try {
      const userCreated = await this.authService.createUser(createUserDto);
      const { user, success } = userCreated
      const { user_email } = user

      if (success) {
        await this.emailServices.sendConfirmationLink({ user_email: `${user_email}` })
      }

      await this.globalServices.setAccessToken(response, user_email)

      return response.status(HttpStatus.OK).send({
        user: userCreated
      })
    } catch (error) {
      throw new BusinessException(
        'users',
        `${error.message}`,
        `${error.message}!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  };

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    try {
      const { user } = req
      if (await this.globalServices.setAccessToken(response, user.user_email)) {
        return {
          user,
          success: true
        }
      }
    } catch (error) {

      throw new BusinessException(
        'users',
        `${error.message}`,
        `${error.message}!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    const {user} = req
    delete user.user_password
    return {
      success: true,
      user
    }
  }

}