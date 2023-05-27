import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import getFileUrl from "~/server/getFileUrl";
import uploadFile from "~/server/uploadThumbail";

export const tagRouter = createTRPCRouter({
  addEvent: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        desc: z.string(),
        tapeId: z.string(),
        time: z.number(),
        thumbnail: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: tagId } = await ctx.prisma.tag.create({
        data: {
          name: input.name,
          target: "SECTION",
          desc: input.desc,
        },
      });

      const { id: totId } = await ctx.prisma.tagsOnTapes.create({
        data: {
          tagId,
          tapeId: input.tapeId,
          time: input.time,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await uploadFile(totId, input.thumbnail);
    }),
  getEventsByTapeId: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const tagsOnTapes = await ctx.prisma.tagsOnTapes.findMany({
        where: {
          tapeId: input,
          tag: {
            target: "SECTION",
          },
        },
        orderBy: { time: "desc" },
        include: {
          tag: true,
        },
      });
      const tagsOnTapesWithUrls = Promise.all(
        tagsOnTapes.map(async (tot) => {
          return {
            thumnailUrl: await getFileUrl(`thumbnail/${tot.id}.png`),
            ...tot,
          };
        })
      );

      return tagsOnTapesWithUrls;
    }),
});
