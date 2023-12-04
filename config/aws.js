import AWS from 'aws-sdk';

const {
  AWS_CONFIG_ACCESS_KEY_ID,
  AWS_CONFIG_SECRET_KEY,
  AWS_CONFIG_REGION,
  AWS_BUCKET_NAME
} = process.env;

AWS.config.update({
  accessKeyId: AWS_CONFIG_ACCESS_KEY_ID,
  secretAccessKey: AWS_CONFIG_SECRET_KEY,
  region: AWS_CONFIG_REGION
});

const s3 = new AWS.S3();

const getBucketsList = async () => {
  try {
    const bucketList = await s3.listBuckets().promise();
    return bucketList;
  } catch (err) {
    return err.message;
  }
};

const getListObjectsOfBucket = async () => {
  try {
    const listS3Objects = await s3.listObjects({ Bucket: AWS_BUCKET_NAME }).promise();
    return listS3Objects;
  } catch (err) {
    return err;
  }
};

const uploadToS3Bucket = async ({ uploadParams }) => {
  try {
    const data = await s3.upload(uploadParams).promise();
    return data.Location;
  } catch (err) {
    return err.message;
  }
};

const getS3Object = async ({ Key }) => {
  try {
    const s3Object = await s3.getObject({ Bucket: AWS_BUCKET_NAME, Key }).promise();
    return s3Object.Location;
  } catch (err) {
    return err.message;
  }
};

const deleteFileFromS3 = async ({ Key }) => {
  try {
    const data = s3.deleteObject({ Bucket: AWS_BUCKET_NAME, Key }).promise();
    return data;
  } catch (err) {
    return err.message;
  }
};

export {
  getBucketsList,
  getListObjectsOfBucket,
  uploadToS3Bucket,
  getS3Object,
  deleteFileFromS3
};
