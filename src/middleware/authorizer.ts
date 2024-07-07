import { NextFunction, Request, Response } from "express";
import { UnauthoriseException } from "./exception";

export async function isManager(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers.is_manager === "true") return next();
  else {
    next(
      new UnauthoriseException(
        "You are not a manager, Only manager can assign or delete todos"
      )
    );
  }
}