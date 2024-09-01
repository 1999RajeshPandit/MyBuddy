import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user";
import {
  BadRequestException,
  InternalServerError,
} from "../../middleware/exception";

export async function logout(req: Request, res: Response, next: NextFunction) {
  const id = req.headers?.user_id as string;
  let data;
  try {
    data = await User.updateOne({ _id: id }, { $unset: { token: "" } });
  } catch (err: any) {
    console.error(err);
    return next(new InternalServerError());
  }
  if (data.modifiedCount === 0) {
    next(new BadRequestException("Error occured while logout"));
  } else {
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  }
}
