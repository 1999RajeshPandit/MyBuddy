import { NextFunction, Request, Response } from "express";
import { getConnection } from "../../db/db-manager";
import { InternalServerError } from "../../middleware/exception";
import { HttpStatusCode } from "axios";
import { TODO } from "../../db/entity/todo";
import { User } from "../../db/entity/user";

export async function getTodos(req: Request, res: Response, next: NextFunction) {
  try {
    const conn = await getConnection();
    const [data, count] = await conn
      .getRepository(TODO)
      .createQueryBuilder()
      .getManyAndCount();

    return res.status(HttpStatusCode.Ok).json({
      success: true,
      data,
      count,
    });
  } catch (error: any) {
    return next(new InternalServerError());
  }
}
