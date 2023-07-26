/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { User } from './user.schema';

export type ReviewDocument = mongoose.HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop(String)
  review!: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref:'User'})
  user!: User;

  
}

export const CatSchema = SchemaFactory.createForClass(Review);