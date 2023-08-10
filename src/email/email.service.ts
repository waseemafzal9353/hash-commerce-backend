import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessException } from 'src/infrastructure/Exceptions/business.exception';
import { AuthService } from 'src/auth/auth.service';
import { confirmNewUserEmailInterface, jwtPayloadInterface, userEmailInterface } from 'src/infrastructure/interfaces/utility.interface';
import { EmailConfirmationModel } from 'src/infrastructure/schemas/user-email.schema';
import { GlobalService } from 'src/global/global.service';


@Injectable()
export class EmailServices {

    private userFromEmailSchema: userEmailInterface;

    constructor(
        @Inject(forwardRef(() => AuthService))
        private authServices: AuthService,
        @InjectModel('EmailConfirmation') private emailConfirmationModel: Model<EmailConfirmationModel>,
        @Inject(ConfigService) private configService: ConfigService,
        @Inject(forwardRef(() => GlobalService))
        private globalServices: GlobalService,
        ) { };

    createUserEmail = async (userEmailData: userEmailInterface) => {
        return await this.emailConfirmationModel.create(userEmailData)
    };

    getUserByEmail = async(user_email: string) => {
        return await this.emailConfirmationModel.findOne({
            user_email
        })   
    }

    sendConfirmationLink = async (emailConfirmationOptions: confirmNewUserEmailInterface) => {
        try {
            if (emailConfirmationOptions.user_id) {
                this.userFromEmailSchema = await this.emailConfirmationModel.findById(emailConfirmationOptions.user_id)
            }
            if (emailConfirmationOptions.user_email) {
                this.userFromEmailSchema = await this.emailConfirmationModel.findOne({ email: emailConfirmationOptions.user_email })
            }
            if (this.userFromEmailSchema.is_user_email_confirmed) {
                throw new BusinessException(
                    'users',
                    `User email already confirmed`,
                    `User email already confirmed`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const payload: jwtPayloadInterface = {
                sub: this.userFromEmailSchema.user_email
            }
            const token = this.globalServices.createJWTToken(payload)
            const url = `${this.configService.get<string>('EMAIL_CONFIRMATION_URL')}?token=${token}`
            const text = `Welcome to hashCommerce. To confirm the email address, click here: ${url}`;
            return await this.globalServices.sendMail({
                to: this.userFromEmailSchema.user_email,
                subject: 'Email Confirmation',
                text
            })

        } catch (error) {
            throw new BusinessException(
                'users',
                `Could send email due to: ${error.message}.`,
                `Could not send confirmation email to: ${this.userFromEmailSchema.user_email}.`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
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
