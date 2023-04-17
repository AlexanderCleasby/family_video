import AWS from "aws-sdk";

import { env } from "~/env.mjs";

const s3 = new AWS.S3();

async function getS3Url(key: string) {
  return await s3.getSignedUrlPromise("getObject", {
    Key: key,
    Bucket: env.S3_BUCKET,
  });
}

export default getS3Url;
