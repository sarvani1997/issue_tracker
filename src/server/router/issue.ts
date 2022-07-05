import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const issueRouter = createRouter()
  .query("get-all-issues", {
    async resolve() {
      return await prisma.issue.findMany();
    },
  })
  .query("get-all-your-issues", {
    input: z.object({ userId: z.any() }),
    async resolve({ input }) {
      return await prisma.issue.findMany({
        where: {
          userId: input.userId,
        },
      });
    },
  })
  .query("get-issue", {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      return await prisma.issue.findMany({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("create-issue", {
    input: z.object({
      title: z.string().min(5).max(5000),
      description: z.string().min(5).max(5000),
      userId: z.any(),
    }),
    async resolve({ input }) {
      return await prisma.issue.create({
        data: {
          title: input.title,
          userId: input.userId,
          description: input.description,
        },
      });
    },
  });
