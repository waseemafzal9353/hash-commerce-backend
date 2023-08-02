import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/DTOs/user.dto';
import { BusinessException } from 'src/Exceptions/business.exception';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { GlobalServices } from 'src/assistantServices/global.service';
@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private userModel: Model<User>, private globalServices: GlobalServices) { }
    private readonly saltRound = 10;

    async createUser(createUserDto: CreateUserDto) {
        const { user_email, user_password, user_phone } = createUserDto

        const findUserByEmail = await this.userModel.findOne({ user_email })
        if (findUserByEmail) {
            throw new BusinessException(
                'users',
                'User already exists',
                `User with ${user_email} already exists!`,
                HttpStatus.CONFLICT,
            )
        }
        if (!this.globalServices.isValidPakistaniMobileNumber(user_phone)) {
            throw new BusinessException(
                'users',
                'Incorrect Mobile Pattern',
                `${user_phone} is incorrect phone number!`,
                HttpStatus.BAD_REQUEST,
            )
        }
        const encryptedPassword = await bcrypt.hash(user_password, this.saltRound)
        const emailToLowerCase = user_email.toLowerCase()
        const userCreated = await this.userModel.create({
            ...createUserDto,
            user_password: encryptedPassword, user_email: emailToLowerCase
        })
       
        return {
            user: userCreated,
            success: true,
        }
    }
}
