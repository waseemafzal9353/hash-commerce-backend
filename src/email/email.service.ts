import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessException } from 'src/Exceptions/business.exception';
import { GlobalServices } from 'src/assistantServices/global.service';
import { AuthService } from 'src/auth/auth.service';
import { jwtPayloadInterface, userEmailInterface } from 'src/interfaces/utility.interface';
import { EmailConfirmationModel } from 'src/schemas/email.schema';


@Injectable()
export class EmailServices {

    constructor(
        @Inject(forwardRef(() => AuthService))
        private authServices: AuthService,
        @InjectModel('EmailConfirmation') private emailConfirmationModel: Model<EmailConfirmationModel>,
        @Inject(ConfigService) private configService: ConfigService,
        private globalServices: GlobalServices) { };

    sendConfirmationLink = async (email: string) => {

        try {
            const payload: jwtPayloadInterface = {
                sub: email
            }
            const token = this.globalServices.createJWTToken(payload)
            const url = `${this.configService.get<string>('EMAIL_CONFIRMATION_URL')}?token=${token}`
            const text = `Welcome to hashCommerce. To confirm the email address, click here: ${url}`;
            return await this.globalServices.sendMail({
                to: email,
                subject: 'Email Confirmation',
                text
            })

        } catch (error) {
            throw new BusinessException(
                'users',
                `Could send email due to: ${error.message}.`,
                `Could not send confirmation email to: ${email}.`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    };


    createUserEmail = async (userEmailData: userEmailInterface) => {
        return await this.emailConfirmationModel.create(userEmailData)
    };

    confirmNewUserEmail = async (email: string) => {
        const user = await this.emailConfirmationModel.findOne({ email })
        if (user.is_user_email_confirmed) {
            throw new BusinessException(
                'users',
                'Email already confirmed!',
                'Email confirmed already!',
                HttpStatus.BAD_REQUEST,
            );
        }
        await this.markEmailAsCofirmed(email)
    };
    markEmailAsCofirmed = async (email: string) => {
        return await this.emailConfirmationModel.updateOne({ email },
            { is_user_email_confirmed: true }
        )
    }
}
