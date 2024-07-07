import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../db/entity/user";
import { getConnection } from "../../db/db-manager";
import {
  BadRequestException,
  InternalServerError,
} from "../../middleware/exception";
import { HttpStatusCode } from "axios";
import { profile } from "console";

import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: string = process.env.SECRET || "your jwt secret key";
const JWT_EXPIRY = +(process.env.JWT_EXPIRY || 36000000);

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestException("Please provide email and password"));
  }
  let user: User | null = null;

  try {
    const conn = await getConnection();
    user = await conn.getRepository(User).findOne({ where: { email } });
  } catch (error: any) {
    console.error("Error occured while login", error.message);
    return next(new InternalServerError());
  }
  if (!user) {
    return next(new BadRequestException("Either email/password is wrong"));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new BadRequestException("Either email/password is wrong"));
  }

  const options = {
    expiresIn: JWT_EXPIRY,
  };

  const payload = {
    id: user.id,
    email: user.email,
    name: user.firstName + " " + user.lastName,
    isManager: user.isManager,
  };

  const token = jwt.sign(payload, SECRET_KEY, options);
  const conn = await getConnection();
  await conn.getRepository(User).update(user.id, { token });
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: "User logged in successfully",
    data: {
      user: {
        id: user.id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        isManager: user.isManager,
        profileImage: user.profileImage,
      },
      token,
      expireIn: JWT_EXPIRY,
    },
  });
}
