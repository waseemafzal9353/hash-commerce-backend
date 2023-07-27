import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/DTOs/user.dto';

@Injectable()
export class AuthService {
    
    async createUser (createUserDto: CreateUserDto){
        console.log("createUserDto", createUserDto)
    }
}
