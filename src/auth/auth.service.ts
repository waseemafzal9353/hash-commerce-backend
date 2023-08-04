import { HttpStatus, Inject, Injectable, Res, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  {Types, Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/app.dto';
import { BusinessException } from 'src/Exceptions/business.exception';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { GlobalServices } from 'src/assistantServices/global.service';
import { EmailServices } from 'src/email/email.service';
import { userEmailInterface } from 'src/interfaces/utility.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=> EmailServices))
        private emailServices: EmailServices,
        @InjectModel('User') private userModel: Model<User>, 
        private globalServices: GlobalServices,
        ) { }
    private readonly saltRound = 10;

    async createUser(createUserDto: CreateUserDto) {

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
        {user_id: userCreated._id, user_email: userCreated.user_email})
        await this.emailServices.createUserEmail(userEmailData)
        
        
        return {
            user: userCreated,
            success: true,
        }
    }

     getUserByEmail = async(user_email: string) => {
        return await this.userModel.findOne({
            user_email
        })   
    }

    
}
