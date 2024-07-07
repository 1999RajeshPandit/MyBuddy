import express from "express";
import { authenticate } from "../middleware/authenticator";
import { create } from "./services/create";
import { updateStatus } from "./services/update-status";
import { updateAssignee } from "./services/assigne-todo";
import { isManager } from "../middleware/authorizer";
import { getTodos } from "./services/get-todos";
import { deleteTodo } from "./services/delete";

export const todoRouter = express.Router();

// all routes are protected
todoRouter.use(authenticate);

// only manager has access to create, delete & assignee todo
todoRouter.post("/", isManager, create);
todoRouter.get("/",  getTodos);
todoRouter.put("/:id/change-status", updateStatus);
todoRouter.put("/:id/change-assignee", isManager, updateAssignee);
todoRouter.delete("/:id", isManager, deleteTodo);
