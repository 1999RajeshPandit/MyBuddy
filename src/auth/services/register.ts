import { NextFunction, Request, Response } from "express";
import { User } from "../../db/entity/user";
import { getConnection } from "../../db/db-manager";
import {
  BadRequestException,
  InValidBodyException,
  InternalServerError,
} from "../../middleware/exception";
import fs, { unlink } from "fs";

import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { HttpStatusCode } from "axios";

import dotenv from "dotenv";
dotenv.config();

const SALT_ROUND = process.env.SALT_ROUND || 10;
export async function register(req: Request, res: Response, next: NextFunction) {
  const user: User = req.body;
  if (!user.email || !user.password || !user.firstName || !user.lastName) {
    return next(new BadRequestException("Please provide mandatory fields"));
  }

  user.createdAt = new Date();

  try {
    // const errors = await validate(user);
    // if (errors.length > 0) {
    //   const errorMessages = errors
    //     .map((error) => Object.values(error.constraints || {}))
    //     .flat();
    //   throw new InValidBodyException(errorMessages);
    // }
    user.password = await bcrypt.hash(user.password, SALT_ROUND);
    const conn = await getConnection();
    user.isManager = req?.body?.isManager === 'true';
    user.profileImage = req?.body?.profileImage || 'default.jpg';
    await conn.getRepository(User).save(user);
    return res.status(HttpStatusCode.Created).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.error("Error occurred while registering", error.message);
    unlinkProfileImage(user);
    if (error instanceof InValidBodyException) {
      next(error);
    }
    next(new InternalServerError(error.message));
  }
}

async function unlinkProfileImage(user: User) {
  const profileImagePath = `uploads/${user.profileImage}`;
  if (fs.existsSync(profileImagePath)) {
    fs.unlinkSync(profileImagePath);
  }
}
