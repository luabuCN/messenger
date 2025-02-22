import bcrypt from "bcryptjs";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "@/app/libs/prismadb";

const app = new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string(),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");
    const { email, name, password } = body;


    if (!email || !name || !password) {
      return c.text("注册失败", 401);
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserEmail) {
      return c.text("邮箱已被注册", 401);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });
    if (!user) {
      return c.text("注册失败", 401);
    }
    return c.json(user);
  }
);

export default app;
