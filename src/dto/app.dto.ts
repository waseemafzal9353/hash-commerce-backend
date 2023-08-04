import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateUserDto{
   
    @IsString()
    @IsNotEmpty()
    user_firstName!: string;

    @IsString()
    @IsNotEmpty()
    user_lastName!: string;

    @IsString()
    @IsNotEmpty()
    user_email!: string;

    @IsString()
    @IsNotEmpty()
    user_password!: string;

    @IsString()
    @IsNotEmpty()
    user_city!: string;

    @IsString()
    @IsNotEmpty()
    user_deliveryAddress!: string;

    @IsString()
    @IsNotEmpty()
    user_phone!: string;

    @IsString()
    @IsNotEmpty()
    uploadAvatarLink!: string;
}

export class ConfirmEmailDto {
    
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    email: string;
  }