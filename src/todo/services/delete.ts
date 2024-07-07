import { Request, Response, NextFunction } from "express";
import { getConnection } from "../../db/db-manager";
import {
  InternalServerError,
  NotFoundException,
} from "../../middleware/exception";
import { DeleteResult } from "typeorm";
import { TODO } from "../../db/entity/todo";
import { HttpStatusCode } from "axios";

export async function deleteTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todoId = req.params.id;
    let deleteRes: DeleteResult;
    try {
      const conn = await getConnection();
      deleteRes = await conn.getRepository(TODO).delete(+todoId);
    } catch (err: any) {
      console.error(err);
      throw new InternalServerError();
    }
    if (deleteRes.affected === 0) {
      throw new NotFoundException("Invalid todo id");
    }

    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error: any) {
    return next(error);
  }
}
