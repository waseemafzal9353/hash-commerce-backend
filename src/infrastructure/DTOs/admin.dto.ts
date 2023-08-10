import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";
import { Role } from "../enums/gloabal.enum";

export class AdminDto{
   
    @IsString()
    @IsNotEmpty()
    admin_id!: ObjectId;

    @IsString()
    @IsNotEmpty()
    admin_firstName!: string;

    @IsString()
    @IsNotEmpty()
    admin_lastName!: string;

    @IsString()
    @IsNotEmpty()
    admin_email!: string;

    @IsString()
    @IsNotEmpty()
    admin_password!: string;

    @IsEnum(Role)
    @IsNotEmpty()
    admin_role!: {
        type: Role,
        default: Role.Admin
    };

    @IsString()
    @IsNotEmpty()
    admin_city!: string;

    @IsString()
    @IsNotEmpty()
    admin_phone!: string;

    @IsString()
    @IsNotEmpty()
    uploadAvatarLink!: string;
};

export class LoginAdminDto{

    @IsString()
    @IsNotEmpty()
    admin_email!: string;

    @IsString()
    @IsNotEmpty()
    admin_password!: string;

};