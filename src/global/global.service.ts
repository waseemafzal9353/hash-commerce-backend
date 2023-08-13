import { JwtService } from "@nestjs/jwt";
import { Injectable, OnModuleInit, forwardRef, Inject } from '@nestjs/common';
import { jwtDecodePayloadInterface, jwtPayloadInterface } from "src/infrastructure/interfaces/utility.interface";
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { HttpStatus } from '@nestjs/common';
import { BusinessException } from "src/infrastructure/Exceptions/business.exception";
import { EmailServices } from "src/email/email.service";
import { Response } from 'express';
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class GlobalService {
    private readonly nodeMailerTransport: Mail;
    constructor(private jwtService: JwtService, 
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => EmailServices))
    private readonly emailServices: EmailServices,
    @Inject(forwardRef(() => AuthService))
    private readonly authServices: AuthService,
    ) {
      this.nodeMailerTransport = createTransport({
        service: this.configService.get('EMAIL_SERVICE'),
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASSWORD')
        }
      })
    };
  
    isValidPakistaniMobileNumber = (phoneNumber: string): boolean => {
      phoneNumber = phoneNumber.trim();
      const pakistaniMobilePattern = /^03[0-9]{2}-[0-9]{7}$/;
      return pakistaniMobilePattern.test(phoneNumber);
    };
  
  
    createJWTToken =  async (payload: jwtPayloadInterface): Promise<string> => {            
      const {sub} = payload
      return this.jwtService.sign({sub}, 
      {secret: this.configService.get<string>('JWT_SECRET_KEY')});   
    };
  
    setAccessToken = async (response: Response, sub: string) => {
 
      const userFromEmailSchema = await this.emailServices.getUserByEmail(sub)
      if (userFromEmailSchema.is_user_email_confirmed) {
          const payload: jwtPayloadInterface = {
              sub: userFromEmailSchema.user_email
          }
          const accessToken = await this.createJWTToken(payload)          
          response.cookie("token", accessToken, {
            httpOnly: true, 
            // secure: process.env.NODE_ENV === 'production',
            path: "/"
          })
          return {
              success: true
          }
  
      }
      throw new BusinessException(
          'users',
          'Email not confirmed',
          `${sub} is not confirmed. Please confirm your email to keep session!`,
          HttpStatus.BAD_REQUEST,
      )
  
  };
  
    sendMail = async (options: Mail.Options) => {
      return await this.nodeMailerTransport.sendMail(options)
    };
  
    decodeJWTToken = async (payload: jwtDecodePayloadInterface) => {
      try {
        const {token, sub} = payload
        const verifiedToken = await this.jwtService.verify(token, {
          secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        });
  
        if (typeof payload === 'object' && sub in verifiedToken) {
          return payload.sub;
        }
        throw new BusinessException(
          'auth',
          `Bad Request.`,
          'Bad Request',
          HttpStatus.BAD_REQUEST,
        );
      } catch (error) {
        if (error?.name === 'TokenExpiredError') {
          throw new BusinessException(
            'auth',
            `Token Expired`,
            'Email confirmation token expired',
            HttpStatus.BAD_REQUEST,
          );
        }
        throw new BusinessException(
          'auth',
          `Bad confirmation token`,
          'Bad confirmation token',
          HttpStatus.BAD_REQUEST,
        );
      }
    };
}
