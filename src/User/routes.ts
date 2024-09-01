import express from "express";
import { authenticate } from "../middleware/authenticator";
import { registerUser } from "./services/register";
import { updateUser } from "./services/update";
import { getUsers } from "./services/get-all";
import { deleteUser } from "./services/delete";
import { getUser } from "./services/get-user";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);

// all routes are protected
userRouter.use(authenticate);

// only manager has access to create, delete & assignee todo
userRouter.get("/",  getUsers);
userRouter.get("/:id",  getUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
