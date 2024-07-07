import { Request, Response, NextFunction } from "express";
import { getConnection } from "../../db/db-manager";
import { User } from "../../db/entity/user";
import { InternalServerError } from "../../middleware/exception";
import { HttpStatusCode } from "axios";

export async function getUsers(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const conn = await getConnection();
    const data: { id: number; name: string }[] = await conn
      .getRepository(User)
      .createQueryBuilder("user")
      .select([
        "user.id as id",
        "CONCAT(user.first_name, ' ', user.last_name) as name",
      ])
      .getRawMany();
    response.status(HttpStatusCode.Ok).send({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new InternalServerError());
  }
}
