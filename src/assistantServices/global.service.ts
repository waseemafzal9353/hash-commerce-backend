import { JwtService } from "@nestjs/jwt";
import { Injectable, OnModuleInit } from '@nestjs/common';
import { jwtDecodePayloadInterface, jwtPayloadInterface } from "src/interfaces/utility.interface";
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { HttpStatus } from '@nestjs/common';
import { BusinessException } from "src/Exceptions/business.exception";


@Injectable()
export class GlobalServices {

  private readonly nodeMailerTransport: Mail;
  constructor(private jwtService: JwtService, private readonly configService: ConfigService) {
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
    return this.jwtService.sign({payload});   
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
        'AWS',
        `Bad Request.`,
        'Bad Request',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BusinessException(
          'AWS',
          `Could not upload file due to ${error.message}.`,
          'Email confirmation token expired',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new BusinessException(
        'AWS',
        `Could not upload file due to ${error.message}.`,
        'Bad confirmation token',
        HttpStatus.BAD_REQUEST,
      );
    }
  };


}
