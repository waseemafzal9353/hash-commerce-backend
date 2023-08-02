import { JwtService } from "@nestjs/jwt";
import { Injectable, OnModuleInit } from '@nestjs/common';
import { jwtPayload } from "src/interfaces/utility.interface";

@Injectable()
export class GlobalServices implements OnModuleInit {

    private jwt_secret_key: string;

    onModuleInit(): void {
        this.jwt_secret_key = process.env.JWT_SECRET_KEY;
    }

    constructor(private jwtService: JwtService) { }

    isValidPakistaniMobileNumber = (phoneNumber: string): boolean => {
        phoneNumber = phoneNumber.trim();
        const pakistaniMobilePattern = /^03[0-9]{2}-[0-9]{7}$/;
        return pakistaniMobilePattern.test(phoneNumber);
    }

    createJWTAccessToken = async (payload: jwtPayload): Promise<string> => {
        return await this.jwtService.signAsync(payload, { secret: this.jwt_secret_key });
    }
}
