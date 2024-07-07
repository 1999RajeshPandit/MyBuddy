import { NextFunction, Request, Response } from "express";
import { getConnection } from "../../db/db-manager";
import {
  BadRequestException,
  InValidBodyException,
  InternalServerError,
} from "../../middleware/exception";
import { TODO, TODOStatus } from "../../db/entity/todo";
import { validate } from "class-validator";
import { HttpStatusCode } from "axios";

export async function create(req: Request, res: Response, next:NextFunction) {
  const todo: TODO = req.body;
  if (!todo.title) {
    return next(new BadRequestException("Please provide todo title"));
  }

  if (todo.assignedTo && !todo.status) {
    todo.status = TODOStatus.ASSIGNED.toString();
  } else {
    todo.status = TODOStatus.NOTASSIGNED.toString();
  }

  todo.createdAt = new Date();
  try {
    const errors = await validate(todo);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new InValidBodyException(errorMessages);
    }
    const conn = await getConnection();
    await conn.getRepository(TODO).save(todo);
    return res.status(HttpStatusCode.Created).json({
      success: true,
      message: "Todo created successfully",
    });
  } catch (error: any) {
    console.error("Error occured while saving todo", error.message);
    if (error instanceof InValidBodyException) {
      return next(error);
    }
    return next(new InternalServerError());
  }
}
