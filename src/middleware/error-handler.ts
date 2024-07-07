import { HttpStatusCode } from "axios";
import { Request, Response, NextFunction } from "express";
import {
  NotFoundException,
  InternalServerError,
  BadRequestException,
  UnauthoriseException,
  TooManyRequestsException,
  InValidBodyException,
} from "./exception";
export const handleErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NotFoundException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err instanceof InternalServerError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err instanceof BadRequestException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err instanceof UnauthoriseException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err instanceof TooManyRequestsException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err instanceof InValidBodyException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.error,
    });
  } else {
    return res.status(HttpStatusCode.InternalServerError).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
