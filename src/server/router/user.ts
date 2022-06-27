import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const userRouter = createRouter()
  .query("get-all-users", {
    async resolve() {
      return await prisma.user.findMany();
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string().min(5).max(500),
    }),
    async resolve({ input }) {
      return await prisma.user.create({
        data: {
          name: input.name,
        },
      });
    },
  });
