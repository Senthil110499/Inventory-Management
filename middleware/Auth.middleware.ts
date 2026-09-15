import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../src/config/prisma.js";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["x-auth-token"] as string;

    if (!token) {
      return res.status(400).json({ error: "Token is missing!" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const userId = decode.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(401).json({ error: "User not found!" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
