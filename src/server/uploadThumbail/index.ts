import { env } from "~/env.mjs";
import uploadS3 from "./s3";

async function uploadFile(id: string, base64File: string) {
  switch (env.FILE_STORAGE_SOURCE) {
    case "S3":
      return uploadS3(id, base64File);
  }
  throw Error(`File Stoage Not Configured`);
}

export default uploadFile;
