import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsEmail } from 'class-validator';
import * as mongoose from 'mongoose'

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {

  @IsString()
  @Prop(String)
  user_firstName!: string;
  
  @IsString()  
  @Prop(String)
  user_lastName!: string;

  @IsEmail()
  @Prop(String)
  user_email!: string;
  
  @IsString()
  @Prop(String)
  user_password!: string;

  @IsString()
  @Prop(String)
  user_phone!: string;

  @IsString()
  @Prop(String)
  user_city!: string;

  @IsString()
  @Prop(String)
  user_deliveryAddress!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);