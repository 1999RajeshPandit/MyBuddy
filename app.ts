import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { handleErrors } from "./src/middleware/error-handler";
import authRouter from "./src/auth/routes";
import { userRouter } from "./src/User/routes";
import connectToDB from "./connectDB";

dotenv.config();

const APP_PORT = process.env.APP_PORT;

export const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to My-POC",
    data:[]
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);


app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    errors: [
      {
        msg: "Route not found",
      },
    ],
  });
});

app.use(handleErrors);

// connectToDB().then(() => {
  app.listen(APP_PORT, () => {
    console.log(`SERVER :  http://localhost:${APP_PORT}`);
  });
// }).catch((error) => {
//   console.error("Failed to connect to database:", error);
//   process.exit(1);
// });
