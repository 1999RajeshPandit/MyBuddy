import { NextFunction, Request, Response } from "express";
import {
  BadRequestException,
  InternalServerError,
} from "../../middleware/exception";
import { IUser, User } from "../../models/user";
import { HttpStatusCode } from "axios";

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.id;
  let isExist;
  try{
    isExist = await User.exists({ _id: userId });
  }
  catch(err: any) {
    console.error("error occured while checking if user exists", err.message);
    return next(new InternalServerError());
  }
  if(!isExist) {
    return next(new BadRequestException("Invalid user id"));
  }

  const user: IUser = req.body;
  if (
    !user.name ||
    user.email ||
    user.password ||
    user.phoneNo ||
    user.profession
  ) {
    return next(new BadRequestException("Please provide mandatory fields"));
  }
  try {
    const newUser = new User(user);
    await newUser.updateOne({ _id: userId });
    return res.status(HttpStatusCode.Created).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Error occured while registering todo", error.message);
    next(new InternalServerError());
  }
}
