import { NextFunction, Request, Response } from "express";
import { InternalServerError } from "../../middleware/exception";
import { HttpStatusCode } from "axios";
import { User } from "../../models/user";

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await User.find();
    console.log(data);
    return res.status(HttpStatusCode.Ok).json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error occured while getting users", error.message);
    return next(new InternalServerError());
  }
}
