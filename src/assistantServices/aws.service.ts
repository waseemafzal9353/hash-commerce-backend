import { Injectable, HttpStatus } from '@nestjs/common';
import { FileInterface } from "src/interfaces/utility.interface";
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { BusinessException } from "src/Exceptions/business.exception";

@Injectable()
export class UploadFileService {

    private s3: AWS.S3;

    constructor(private readonly configService: ConfigService) {

        this.s3 = new AWS.S3({
            accessKeyId: this.configService.get('ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
            region: this.configService.get('REGION'),
        });
    };
    uploadFile = async (file: FileInterface): Promise<string> => {
        if (!file) {
            throw new BusinessException(
                'AWS',
                'No file chosen!',
                'File could not be uploaded',
                HttpStatus.BAD_REQUEST,
            );
        }
        const params = {
            Bucket: this.configService.get('S3_BUCKET_NAME'),
            Key: file.originalname,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
            ContentDisposition: 'inline',
        };
        try {
            const data = await this.s3.upload(params).promise();
            return data.Location;
        } catch (err) {
            throw new BusinessException(
                'AWS',
                `Could not upload file due to ${err.message}.`,
                'File could not be uploaded',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    };


}
