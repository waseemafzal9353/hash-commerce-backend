import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/DTOs/user.dto';
import { BusinessException } from 'src/Exceptions/business.exception';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class AuthService {
constructor(@InjectModel('User') private userModel: Model<User>){}
    async createUser(createUserDto: CreateUserDto) {
        
        
        const userCreated = await this.userModel.create(createUserDto)
        // throw new BusinessException(
        //     'users',                                 // Error domain
        //     `User with was not found.`, // Internal message
        //     'User not found',                        // API message
        //     HttpStatus.NOT_FOUND,
        // )
        console.log("createUserDto", userCreated)
        return userCreated
    }
}
