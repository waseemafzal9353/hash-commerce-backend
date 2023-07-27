import { Body, Controller, Post, UseInterceptors, 
  HttpStatus, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { CreateUserDto } from 'src/DTOs/user.dto';
import { FileInterface, UserInterface } from 'src/interfaces/utility.interface';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createUser(@UploadedFile(
    new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'jpeg',
    })
    .addMaxSizeValidator({
      maxSize: 1000
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
  ) file: FileInterface, @Body() createUserDto: CreateUserDto){
    return await this.authService.createUser(createUserDto);
  }
}
