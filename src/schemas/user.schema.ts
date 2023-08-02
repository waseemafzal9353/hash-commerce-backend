import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import * as mongoose from 'mongoose'

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  user_firstName!: string;
  
  @IsString()  
  @IsNotEmpty()
  @Prop(String)
  user_lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  @Prop(String)
  user_email!: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Prop(String)
  user_password!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  user_phone!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  user_city!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  user_deliveryAddress!: string;
 
  @IsString()
  @IsNotEmpty()
  @Prop(String)
  user_avatar!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);