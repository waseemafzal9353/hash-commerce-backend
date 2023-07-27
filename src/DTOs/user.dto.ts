import { FileInterface } from "src/interfaces/utility.interface";

export class CreateUserDto{
    user_firstName!: string;
    user_lastName!: string;
    user_email!: string;
    user_password!: string;
    user_city!: string;
    user_deliveryAddress!: string;
    user_phone!: string;
    file!: FileInterface;
}