import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const gitRouter = createRouter().query("get-all-users", {
  async resolve() {
    return await prisma.user.findMany();
  },
});
