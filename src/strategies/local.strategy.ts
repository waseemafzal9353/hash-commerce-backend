import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth/auth.service";
import { validateUserInterface } from "src/interfaces/utility.interface";
import { Inject, HttpStatus } from "@nestjs/common";
import { BusinessException } from "src/Exceptions/business.exception";


export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AuthService) private authServices: AuthService) {
        super({'usernameField': 'user_email', 'passwordField': 'user_password'})
    }

    validate = async (user_email: string, user_password: string) => {
        const payload: validateUserInterface = {
            user_email,
            user_password
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