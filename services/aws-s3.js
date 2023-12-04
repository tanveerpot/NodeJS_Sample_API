/* eslint-disable no-await-in-loop */
import fs from 'fs';
import path from 'path';
import Axios from 'axios';

import Lead from '../models/lead';
import { uploadToS3Bucket } from '../config/aws';

const { AWS_BUCKET_NAME } = process.env;

const downloadImage = async ({ url, filepath }) => {
  try {
    const response = await Axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('error', reject)
        .once('close', () => resolve(filepath));
    });
  } catch (err) {
    return err;
  }
};

const saveToS3Bucket = async ({ leadDocs }) => {
  try {
    const imagesData = [];
    for (let i = 0; i < leadDocs.length; i += 1) {
      const { image, _id: leadId } = leadDocs[i];

      const filePath = path.join(__dirname, '..', 'images', `${leadId}.jpeg`);

      await downloadImage({
        url: image,
        filepath: filePath
      });

      const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: '',
        Body: '',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      };

      const fileStream = fs.createReadStream(filePath);
      uploadParams.Body = fileStream;
      uploadParams.Key = `${leadId}.jpeg`;

      const imageUrl = await uploadToS3Bucket({ uploadParams });

      imagesData.push({
        updateOne: {
          filter: {
            _id: leadId
          },
          update: {
            $set: {
              image: imageUrl
            }
          }
        }
      });

      fs.unlinkSync(filePath);
    }

    await Lead.bulkWrite(imagesData);
  } catch (err) {
    console.log('\n\n Error While Uploading Image', err);
  }
};

export {
  downloadImage,
  saveToS3Bucket
};
