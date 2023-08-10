import { HttpStatus, Inject, Injectable, Res, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { CreateUserDto } from 'src/infrastructure/DTOs/user.dto';
import { BusinessException } from 'src/infrastructure/Exceptions/business.exception';
import { User } from 'src/infrastructure/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { EmailServices } from 'src/email/email.service';
import { UserInterface, jwtPayloadInterface, userEmailInterface, validateUserInterface } from 'src/infrastructure/interfaces/utility.interface';
import { GlobalService } from 'src/global/global.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => EmailServices))
        private emailServices: EmailServices,
        @InjectModel('User') private userModel: Model<User>,
        @Inject(forwardRef(() => GlobalService))
        private globalServices: GlobalService,
    ) { }
    private readonly saltRound = 10;
    // need to define return types of all the methods

    getUserByEmail = async (user_email: string) => {
        const user: UserInterface = await this.userModel.findOne({
            user_email
        }).lean()
        return user
    };

    getUserById = async (user_id: string) => {
        const user: UserInterface = await this.userModel.findOne({
            _id: user_id
        }).lean()
        return user
    };
    createUser = async (createUserDto: CreateUserDto) => {

        const { user_email, user_password, user_phone } = createUserDto
        const findUserByEmail = await this.getUserByEmail(user_email)

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

        const userEmailData: userEmailInterface = Object.assign({},
            { user_id: userCreated._id, user_email: userCreated.user_email })
        await this.emailServices.createUserEmail(userEmailData)


        return {
            user: userCreated,
            success: true,
        }
    };

    validateUser = async (payload: validateUserInterface) => {        
        const userByEmail = (await this.getUserByEmail(payload.email));
        if (!userByEmail) {
            throw new BusinessException(
                'users',
                'User credentials do not match.',
                `User Credentials do not match!`,
                HttpStatus.UNAUTHORIZED,
            )
        }
        const comparedPasswords = await bcrypt.compare(payload.password,
            userByEmail.user_password)
        if (!comparedPasswords) {
            throw new BusinessException(
                'users',
                'User credentials do not match.',
                `User Credentials do not match!`,
                HttpStatus.UNAUTHORIZED,
            )
        }
        const { user_password, ...user } = userByEmail
        return user
    }

    login = async (email: string) => {
        const token = await this.globalServices.createJWTToken(email)
        return token
    }


}
