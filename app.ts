import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { handleErrors } from "./src/middleware/error-handler";
import authRouter from "./src/auth/routes";
import { todoRouter } from "./src/todo/routes";
import app_status from "express-status-monitor";
import "reflect-metadata"

dotenv.config();

const APP_PORT = process.env.APP_PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  app_status({
    title: "Express Status Monitor",
    path: "/status",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to My-POC",
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

//public folder are available on
app.use("/api/v1/public", express.static("public"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/todo", todoRouter);

app.use("/api/v1/images", express.static("uploads"));

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

app.listen(APP_PORT, async () => {
  console.log(
    `SERVER :  http://localhost:${APP_PORT} 
    APP STATUS : http://localhost:${APP_PORT}/status
    API DOC: http://localhost:${APP_PORT}/api/v1/public/api-doc.json`
  );
});
