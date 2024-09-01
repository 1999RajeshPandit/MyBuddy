import { NextFunction, Request, Response } from "express";
import {
  BadRequestException,
  InternalServerError,
} from "../../middleware/exception";
import { IUser, User } from "../../models/user";
import { HttpStatusCode } from "axios";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  const user: IUser = req.body;
  if (
    !user.name ||
    !user.email ||
    !user.password ||
    !user.phoneNo ||
    !user.profession
  ) {
    return next(new BadRequestException("Please provide mandatory fields"));
  }
  try {
    const newUser = new User(user);
    const data = await newUser.save();
    return res.status(HttpStatusCode.Created).json({
      success: true,
      message: "User registered successfully",
      data: newUser.toJSON(),
    });
  } catch (error: any) {
    console.error("Error occured while registering todo", error.message);
    next(new InternalServerError());
  }
}
