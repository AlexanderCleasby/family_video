import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { tapeRouter } from "~/server/api/routers/tape";
import { tagRouter } from "./routers/tag";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  tape: tapeRouter,
  tag: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
