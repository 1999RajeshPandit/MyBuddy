import { Request, Response, NextFunction } from "express";
import {
  InternalServerError,
  NotFoundException,
} from "../../middleware/exception";
import { User } from "../../models/user";
import { HttpStatusCode } from "axios";

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    let deleteRes;
    try {
      deleteRes = await User.deleteOne({ _id: userId });
    } catch (err: any) {
      console.error(err);
      throw new InternalServerError();
    }
    if (deleteRes.deletedCount === 0) {
      throw new NotFoundException("Invalid user id");
    }

    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return next(error);
  }
}
