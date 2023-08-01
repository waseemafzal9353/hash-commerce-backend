import { Body, Controller, Post, UseInterceptors, 
  HttpStatus, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { CreateUserDto } from 'src/DTOs/user.dto';
import { FileInterface, UserInterface } from 'src/interfaces/utility.interface';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import fileUpload from 'src/assistantServices/aws-file-upload.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post("/register")
  @UseInterceptors(FileInterceptor("file"))
  async createUser(@UploadedFile(
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
    console.log("createUserDto", createUserDto)
    // const uploadAvatarLink: unknown = await fileUpload(avatar)  
   

    return await this.authService.createUser(createUserDto);
  }
}
