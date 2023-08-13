import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose'

export type AdminEmailVerificationModelDocument = mongoose.HydratedDocument<AdminEmailConfirmationModel>;

@Schema()
export class AdminEmailConfirmationModel {

    @IsString()
    @IsNotEmpty()
    @Prop({ type: mongoose.Types.ObjectId, ref: 'AdminModel' })
    admin_id!: mongoose.Types.ObjectId;

    @IsEmail()
    @IsNotEmpty()
    @Prop({type: String, unique: true})
    admin_email!: string

    @IsNotEmpty()
    @Prop({type: Boolean, default: false})
    is_admin_email_confirmed!: boolean;
       

}

export const AdminEmailConfirmationSchema = SchemaFactory.createForClass(AdminEmailConfirmationModel);