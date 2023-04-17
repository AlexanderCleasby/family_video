import { env } from "~/env.mjs";
import getS3Url from "./s3";

async function getFileUrl(key: string) {
  switch (env.FILE_STORAGE_SOURCE) {
    case "S3":
      return getS3Url(key);
  }
  throw Error(`File Stoage Not Configured`);
}

export default getFileUrl;
