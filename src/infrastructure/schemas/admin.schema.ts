import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import * as mongoose from 'mongoose'
import { Role } from '../enums/gloabal.enum';

export type AdminDocument = mongoose.HydratedDocument<AdminModel>;

@Schema({timestamps: true})
export class AdminModel {

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  admin_firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  admin_lastName!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  admin_email!: string;  

  @IsString()
  @IsNotEmpty()
  @Prop({type: String, enum: Role, default: [Role.Admin]})
  admin_role!: Role[];

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  admin_password!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  admin_city!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  admin_phone!: string;

  @IsString()
  @IsNotEmpty()
  @Prop(String)
  uploadAvatarLink!: string;
}

export const AdminSchema = SchemaFactory.createForClass(AdminModel);