import AWS from "aws-sdk";
import { readdir } from "node:fs/promises";
import { extname, basename } from "path";
import { getVideoDurationInSeconds } from "get-video-duration";
import { PrismaClient } from "@prisma/client";
import { env } from "../env.mjs";
const prisma = new PrismaClient();
const s3 = new AWS.S3();

async function createByFS() {
  const tapesDir = env.TAPES_DIR;

  const files = await readdir(tapesDir);

  await Promise.all(
    files
      .filter((file) => extname(file) === ".mp4")
      .map(async (file) => {
        const length = Math.ceil(
          Math.ceil(await getVideoDurationInSeconds(`${tapesDir}/${file}`))
        );

        await prisma.tape.upsert({
          where: { key: `${file}` },
          create: { key: `${file}`, name: basename(file), length },
          update: { key: `${file}`, name: basename(file), length },
        });
      })
  );
}

async function createFromS3Bucket() {
  if (!env.S3_BUCKET) {
    throw Error(
      "S3_BUCKET is not defined in env.mjs. Please define it and try again."
    );
  }

  const listObjectsResponse = await s3
    .listObjects({
      Bucket: env.S3_BUCKET,
    })
    .promise();

  if (!listObjectsResponse.Contents) {
    return;
  }

  await Promise.all(
    listObjectsResponse.Contents.map(async (object) => {
      if (!object.Key) {
        return;
      }

      const key = object.Key;

      if (extname(key) !== ".mp4") {
        return;
      }

      const length = 0;

      await prisma.tape.upsert({
        where: { key },
        create: { key, name: basename(key), length },
        update: { key, name: basename(key), length },
      });
    })
  );
}

function main() {
  const i = process.argv.findIndex((f) => f === "-s");
  if (i === -1) {
    throw Error("please use -s flag to specify the source of the tapes");
  }
  const source = process.argv[i + 1];
  switch (source) {
    case "fs":
      return createByFS;
    case "s3":
      return createFromS3Bucket;
    default:
      throw Error("not a supported source");
  }
}

main()()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
