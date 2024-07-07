import { NextFunction, Request, Response } from "express";
import { getConnection } from "../../db/db-manager";
import {
  BadRequestException,
  InternalServerError,
  NotFoundException,
} from "../../middleware/exception";
import { UpdateResult } from "typeorm";
import { TODO, TODOStatus } from "../../db/entity/todo";
import { HttpStatusCode } from "axios";

export async function updateStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todoId = req.params.id;
    let updateRes: UpdateResult;
    const { status, assigned } = req.body;
    if (
      !status ||
      status !== TODOStatus.NOTASSIGNED.toString() &&
      status !== TODOStatus.ASSIGNED.toString() &&
      status !== TODOStatus.COMPLETED.toString() &&
      status !== TODOStatus.INPROGRESS.toString()
    ) {
      throw new BadRequestException("Please provide valid status");
    }
    
    try {
      const conn = await getConnection();
      updateRes = await conn
        .getRepository(TODO)
        .update(+todoId, { status: status });
    } catch (err: any) {
      console.error(err);
      throw new InternalServerError();
    }
    if (updateRes.affected === 0) {
      throw new NotFoundException("Invalid todo id");
    }

    return res.status(HttpStatusCode.Ok).json({
      success: true,
      message: "Todo updated successfully",
    });
  } catch (error: any) {
    return next(error);
  }
}
