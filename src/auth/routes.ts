import express from "express";
import { login } from "./services/login";
import { logout } from "./services/logout";
import multer from "multer";
import fs from "fs";
import { authenticate } from "../middleware/authenticator";
import { register } from "./services/register";
import path from "path";
import { getUsers } from "./services/get-users";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    if (path.basename(file.originalname) === "default.png") {
      req.body.profileImage = file.originalname;
      return;
    }
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    req.body.profileImage = uniqueSuffix;
    cb(null, uniqueSuffix);
  },
});

const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const upload = multer({ storage: storage });

const authRouter = express.Router();

// login & registration in not protected
authRouter.post("/login", login);

//only manager can add manager
authRouter.post("/register", upload.single("file"), register);

// protecting logout & register api
authRouter.use(authenticate);

authRouter.get("/logout", logout);
authRouter.get("/users", getUsers);

export default authRouter;
