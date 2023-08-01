import { HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk'
import fs from 'fs'
import { BusinessException } from 'src/Exceptions/business.exception';
import { FileInterface } from 'src/interfaces/utility.interface';
// Configure AWS credentials
// AWS.config.update({
  
// });

// Create an instance of the S3 service
const s3 = new AWS.S3({
  accessKeyId: `${process.env.ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
  region: `${process.env.REGION}`
});

const fileUpload = (file: FileInterface) => {
  
  // var base64data = new Buffer.from(file.buffer, 'binary');
  // const fileContent = fs.readFileSync(file.path);

  let fileLocation = ""
  const params = {
    Bucket: `${process.env.S3_BUCKET_NAME}`,
    Key: file.originalname,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType:file.mimetype,
    ContentDisposition: 'inline',
  };
  return new Promise((resolve, reject) => {
    if (!file) {
        return reject("No file chosen!");
      }
s3.upload(params, (err: Error, data: { Location: string; }) => {
  if (err) {
          throw new BusinessException(
            'AWS',                                 // Error domain
            `Could not upload file due to ${err.message}.`, // Internal message
            'File could not be uploaded',                        // API message
            HttpStatus.INTERNAL_SERVER_ERROR,
        )
  } else {
    fileLocation = data.Location
  }
  resolve(fileLocation);
  })})
  
};

export default fileUpload

