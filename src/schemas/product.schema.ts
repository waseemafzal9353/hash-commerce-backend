/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Review } from './review.schema';
import { Admin } from './admin.schema';

export type ProductDocument = mongoose.HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Admin'})
  admin!: Admin;

  @Prop(String)
  product_name!: string;

  @Prop(Number)
  product_price!: number;

  @Prop(String)
  product_brand!: string;

  @Prop([Number])
  product_ratings!:[number];

  @Prop([{type: mongoose.Schema.Types.ObjectId, ref:"Review"}])
  product_reviews!:[Review];

  @Prop(Number)
  product_stock!: number;

  @Prop(String)
  product_discount!: {
    default:''
  }
  
  @Prop([String])
  product_size!:[string];

  @Prop([String])
  product_color!:[string];

  @Prop(String)
  product_description!: string;

  @Prop(String)
  product_category!: string;

  @Prop(Number)
  products_sold!:number;

  @Prop(String)
  product_image_link!: string
}

export const CatSchema = SchemaFactory.createForClass(Product);