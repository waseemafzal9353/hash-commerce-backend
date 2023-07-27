export class UserInterface{
    user_firstName!: string;
    user_lastName!: string;
    user_email!: string;
    user_password!: string;
    user_city!: string;
    user_deliveryAddress!: string;
    user_phone!: string;
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