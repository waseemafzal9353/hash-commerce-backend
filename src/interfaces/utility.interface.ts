import { Types } from "mongoose";

export interface UserInterface {
  _id: Types.ObjectId;
  user_firstName: string;
  user_lastName: string;
  user_email: string;
  user_password: string;
  user_city: string;
  user_deliveryAddress: string;
  user_phone: string;
}

export interface FileInterface {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface jwtPayloadInterface {
  sub: string;
}

export interface jwtDecodePayloadInterface{
  sub: string;
  token: string;
}

export interface userEmailInterface{
  user_id: Types.ObjectId;
  user_email: string;
  is_user_email_confirmed?: boolean;
} 

 
