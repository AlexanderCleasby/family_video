import { readdir } from "node:fs/promises";
import { extname, basename } from "path";
import { getVideoDurationInSeconds } from "get-video-duration";
import { PrismaClient } from "@prisma/client";
import { env } from "../env.mjs";
const prisma = new PrismaClient();

async function main() {
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
