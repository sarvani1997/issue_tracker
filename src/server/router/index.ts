// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { userRouter } from "./user";
import { issueRouter } from "./issue";
import { commentRouter } from "./comment";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("issue.", issueRouter)
  .merge("comment.", commentRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
