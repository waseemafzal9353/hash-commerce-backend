/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'

export type AdminDocument = mongoose.HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop(String)
  admin_name!: string;  
}

export const CatSchema = SchemaFactory.createForClass(Admin);