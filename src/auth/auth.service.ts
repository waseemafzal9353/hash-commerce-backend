import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/DTOs/user.dto';
import { BusinessException } from 'src/Exceptions/business.exception';
@Injectable()
export class AuthService {

    async createUser(createUserDto: CreateUserDto) {
        throw new BusinessException(
            'users',                                 // Error domain
            `User with was not found.`, // Internal message
            'User not found',                        // API message
            HttpStatus.NOT_FOUND,
        )
        console.log("createUserDto", createUserDto)
    }
}
