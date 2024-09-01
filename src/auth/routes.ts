import express from "express";
import { login } from "./services/login";
import { logout } from "./services/logout";
import { authenticate } from "../middleware/authenticator";
const authRouter = express.Router();

// login not protected
authRouter.post("/login", login);
//logout is protected
authRouter.get("/logout", authenticate, logout);

export default authRouter;
