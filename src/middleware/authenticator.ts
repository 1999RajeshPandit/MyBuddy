import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InternalServerError, UnauthoriseException } from "./exception";
import { IUser, User } from "../models/user";

const SECRET = process.env.SECRET || "your jwt secret key";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new UnauthoriseException("No token provided"));
  }
  const token = authHeader.split(" ")[1];
  try {
    if (!token) {
      throw new UnauthoriseException("No token provided");
    }
    const data = jwt.verify(token, SECRET) as JwtPayload;
    const user = await User.findOne({
      token: token,
    });

    if (user === null) {
      throw new UnauthoriseException();
    }

    req.headers.user_id = user._id.toString();
    next();
  } catch (err) {
    console.error(err);
    if (err instanceof UnauthoriseException) {
      next(err);
    } else {
      next(new InternalServerError());
    }
  }
}
