import AWS from 'aws-sdk'
import fs from 'fs'
// Configure AWS credentials
AWS.config.update({
    accessKeyId: `${process.env.ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
    region: `${process.env.REGION}`
});

// Create an instance of the S3 service
const s3 = new AWS.S3();

const fileUpload = (file) => {
  // var base64data = new Buffer.from(file.buffer, 'binary');
  const fileContent = fs.readFileSync(file.path);
  let fileLocation = ""
  const params = {
    Bucket: `${process.env.S3_BUCKET_NAME}`,
    Key: file.originalFilename,
    Body: fileContent
  };
  return new Promise((resolve, reject) => {
    if (!file) {
        return reject("No file chosen!");
      }
s3.upload(params, (err, data) => {
  if (err) {
    console.error('Error uploading file:', err);
  } else {
    fileLocation = data.Location
  }
  resolve(fileLocation);
  })})
  
};

export default fileUpload

