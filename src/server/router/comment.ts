import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const commentRouter = createRouter()
  .query("get-all-comments", {
    input: z.object({ issueId: z.string() }),
    async resolve({ input }) {
      return await prisma.comment.findMany({
        where: {
          issueId: input.issueId,
        },
      });
    },
  })
  .mutation("create-comment", {
    input: z.object({
      comment: z.string().min(5).max(5000),
      issueId: z.string(),
      userId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.comment.create({
        data: {
          comment: input.comment,
          issueId: input.issueId,
          userId: input.userId,
        },
      });
    },
  });
