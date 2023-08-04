import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose'

export type EmailVerificationModelDocument = mongoose.HydratedDocument<EmailConfirmationModel>;

@Schema()
export class EmailConfirmationModel {

    @IsString()
    @IsNotEmpty()
    @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
    user_id!: mongoose.Types.ObjectId;

    @IsEmail()
    @IsNotEmpty()
    @Prop(String)
    user_email!: {
        type: string;
        unique: true
    }

    @IsNotEmpty()
    @Prop({type: Boolean, default: false})
    is_user_email_confirmed!: boolean;
       

}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmationModel);