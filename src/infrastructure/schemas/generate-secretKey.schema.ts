import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import * as mongoose from 'mongoose'

export type SecretKeyDocument = mongoose.HydratedDocument<SecretKeyModel>;

@Schema({timestamps: true})
export class SecretKeyModel {

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  admin_name!: string;


  @IsString()
  @IsNotEmpty()
  @Prop(String)
  secretKey!: string;


}

export const SecretKeySchema = SchemaFactory.createForClass(SecretKeyModel);