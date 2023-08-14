import { Types } from "mongoose";
import { User } from "../schemas/user.schema";
import { Role } from "../enums/gloabal.enum";

export interface UserInterface {
  _id: Types.ObjectId;
  user_firstName: string;
  user_lastName: string;
  user_email: string;
  user_password: string;
  user_city: string;
  user_deliveryAddress: string;
  user_phone: string;
  // user_avatar: string
  success?: boolean;
  role?:Role
};

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
};

export interface jwtPayloadInterface {
  sub: any;
  roles?:Role[]
};

export interface jwtDecodePayloadInterface{
  sub: any;
  token: string;
};

export interface userEmailInterface{
  user_id: Types.ObjectId;
  user_email: string;
  is_user_email_confirmed?: boolean;
};

export interface confirmNewUserEmailInterface{
  user_id?: Types.ObjectId;
  user_email?: string;
};

export interface validateUserInterface{
  email: string;
  password: string;
};

export interface loginInterface{
  user: User;
  success: boolean
}
 
