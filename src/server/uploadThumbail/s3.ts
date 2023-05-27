import AWS from "aws-sdk";

import { env } from "~/env.mjs";

const s3 = new AWS.S3();

async function uploadS3(id: string, base64File: string) {
  const buf = Buffer.from(
    base64File.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  if (!env.S3_BUCKET) throw Error("S3_BUCKET is not defined in env.mjs");

  const uploadResult = await s3
    .upload({
      Bucket: env.S3_BUCKET,
      Key: "thumbnail/" + id + ".png",
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/png",
    })
    .promise();

  return uploadResult.Location;
}

export default uploadS3;
