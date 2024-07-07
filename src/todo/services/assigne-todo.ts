import { Request, Response, NextFunction } from "express";
import { getConnection } from "../../db/db-manager";
import {
  BadRequestException,
  InValidBodyException,
  InternalServerError,
} from "../../middleware/exception";
import { UpdateResult } from "typeorm";
import { TODO, TODOStatus } from "../../db/entity/todo";
import { validate } from "class-validator";
import { HttpStatusCode } from "axios";

export async function updateAssignee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const todoId = req.params.id;
  let updateRes: UpdateResult;
  const { assignedTo } = req.body;
  try {
    if (!assignedTo) {
      throw new BadRequestException("Please provide valid assignee");
    }

    let existingTodo = null;

    try {
      const conn = await getConnection();
      existingTodo = await conn
        .getRepository(TODO)
        .createQueryBuilder()
        .where("id = :id", { id: todoId })
        .getOne();
    } catch (err: any) {
      console.error(err);
      throw new InternalServerError();
    }
    if (!existingTodo) {
      throw new BadRequestException("Invalid todo id");
    }

    const todo = new TODO();
    todo.id = existingTodo.id;
    todo.title = existingTodo.title;
    todo.description = existingTodo.description;
    todo.status =
      assignedTo === 0
        ? TODOStatus.NOTASSIGNED.toString()
        : existingTodo.status === TODOStatus.NOTASSIGNED.toString()
        ? TODOStatus.ASSIGNED.toString()
        : existingTodo.status;

    todo.assignedTo = assignedTo;
    todo.createdAt = existingTodo.createdAt;

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
    } catch (err: any) {
      console.error(err);
      if (err instanceof InValidBodyException) {
        throw err;
      }
      throw new InternalServerError();
    }

    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "Todo updated successfully",
    });
  } catch (error: any) {
    return next(error);
  }
}
