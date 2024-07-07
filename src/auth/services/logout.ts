import { NextFunction, Request, Response } from "express";
import { User } from "../../db/entity/user";
import { getConnection } from "../../db/db-manager";
import {
  BadRequestException,
  InternalServerError,
} from "../../middleware/exception";
import { UpdateResult } from "typeorm";

export async function logout(req: Request, res: Response, next: NextFunction) {
  const id = req.headers?.user_id as string;
  
  let updateRes: UpdateResult | undefined;
  try {
    const conn = await getConnection();
    updateRes = await conn.getRepository(User).update(+id, { token: "" });
  } catch (err: any) {
    console.error(err);
    return next(new InternalServerError());
  }
  if (updateRes && updateRes.affected === 0) {
    next(new BadRequestException("Error occured while logout"));
  } else {
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  }
}
