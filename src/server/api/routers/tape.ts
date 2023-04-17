import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import getFileUrl from "~/server/getFileUrl";

export const tapeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      process.cwd();
      return {
        greeting: `Hello ${process.cwd()}`,
      };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const ormTapes = await ctx.prisma.tape.findMany();

    const res = await Promise.all(
      ormTapes.map(async (tape) => ({
        ...tape,
        url: await getFileUrl(tape.key),
      }))
    );

    return res;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
