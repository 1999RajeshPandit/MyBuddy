import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InternalServerError, UnauthoriseException } from "./exception";
import { get } from "http";
import { getConnection } from "../db/db-manager";
import { User } from "../db/entity/user";

const SECRET = process.env.SECRET || 'your jwt secret key';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next( new UnauthoriseException("No token provided"));
  }
  const token = authHeader.split(" ")[1];
  try {
    if (!token) {
      throw new UnauthoriseException("No token provided");
    }
    const data = jwt.verify(token, SECRET) as JwtPayload;
    const conn = await getConnection();
    const isLoggedIn = await conn
      .getRepository(User)
      .createQueryBuilder()
      .where("token = :token", { token: token })
      .getExists();

    if (!isLoggedIn) {
      throw new UnauthoriseException();
    }
    
    req.headers.user_id = data.id;
    req.headers.is_manager = data.isManager === true ? "true" : "false";
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
