import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/auth.service";
import { validateUserInterface } from "../interfaces/utility.interface";
import { Inject, HttpStatus } from "@nestjs/common";
import { BusinessException } from "../Exceptions/business.exception";


export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AuthService) private authServices: AuthService) {
        super({'usernameField': 'email', 'passwordField': 'password'})
    }

    validate = async (email: string, password: string) => {       
        const payload: validateUserInterface = {
            email: email.toLowerCase(),
            password
        }
        const validUser = await this.authServices.validateUser(payload);
        if (!validUser) {
            throw new BusinessException(
                'users',
                'Invalid user creadentials',
                'User credentials do not match.',
                HttpStatus.BAD_REQUEST,
            );
        }
        return validUser
    }
}