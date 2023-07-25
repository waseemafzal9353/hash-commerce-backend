/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop(String)
  user_firstName!: string;
 
  @Prop(String)
  user_lastName!: string;

  @Prop(String)
  user_email!: string;
  
  @Prop(String)
  user_password!: string;

  @Prop(String)
  user_city!: string;

  @Prop(String)
  user_deliveryAddress!: string;
  
  @Prop(String)
  user_phone!: string;
}

export const CatSchema = SchemaFactory.createForClass(User);