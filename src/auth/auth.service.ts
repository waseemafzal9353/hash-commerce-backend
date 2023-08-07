import { HttpStatus, Inject, Injectable, Res, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/app.dto';
import { BusinessException } from 'src/Exceptions/business.exception';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { GlobalServices } from 'src/assistantServices/global.service';
import { EmailServices } from 'src/email/email.service';
import { UserInterface, jwtPayloadInterface, userEmailInterface, validateUserInterface } from 'src/interfaces/utility.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => EmailServices))
        private emailServices: EmailServices,
        @InjectModel('User') private userModel: Model<User>,
        private globalServices: GlobalServices,
    ) { }
    private readonly saltRound = 10;
        public salt=10
    // need to define return types of all the methods

    getUserByEmail = async (user_email: string) => {
        const user: UserInterface = await this.userModel.findOne({
            user_email
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

    setAccessToken = async (response: Response, email: string): Promise<void> => {

        const userFromEmailSchema = await this.emailServices.getUserByEmail(email)

        if (userFromEmailSchema.is_user_email_confirmed) {
            const payload: jwtPayloadInterface = {
                sub: userFromEmailSchema.user_id
            }
            const accessToken = this.globalServices.createJWTToken(payload)
            response.cookie('access-token', accessToken, {
                httpOnly: true,
                maxAge: 86400000
            })
        }
        throw new BusinessException(
            'users',
            'Email not confirmed',
            `${email} is not confirmed. Please confirm your email to keep session!`,
            HttpStatus.BAD_REQUEST,
        )
    };

    validateUser = async (payload: validateUserInterface) => {       
        const userByEmail = (await this.getUserByEmail(payload.user_email));
        const comparedPasswords = await bcrypt.compare(payload.user_password,
            userByEmail.user_password)

        if (!userByEmail || !comparedPasswords) {
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

    login =  async (email: string) => {      
        return await this.globalServices.createJWTToken(email)
    }


}
