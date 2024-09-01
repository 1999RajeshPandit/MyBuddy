import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import {
  BadRequestException,
  InternalServerError,
} from "../../middleware/exception";
import { HttpStatusCode } from "axios";

import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: string = process.env.SECRET || "your jwt secret key";
const JWT_EXPIRY = +(process.env.JWT_EXPIRY || 36000000);

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestException("Please provide email and password"));
  }
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error: any) {
    console.error("Error occured while login", error.message);
    return next(new InternalServerError());
  }
  if (user === null) {
    return next(new BadRequestException("Invalid email/password is wrong"));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new BadRequestException("Invalid email/password is wrong"));
  }

  const options = {
    expiresIn: JWT_EXPIRY,
  };

  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(payload, SECRET_KEY, options);
  await User.updateOne({ _id: user._id }, { $set: { token: token } });
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: "User logged in successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      expireIn: JWT_EXPIRY,
    },
  });
}
