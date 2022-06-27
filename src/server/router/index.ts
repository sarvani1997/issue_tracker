// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { gitRouter } from "./git";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("git.", gitRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
