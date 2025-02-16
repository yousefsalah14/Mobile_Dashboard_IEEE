import express from "express";
import dotev from "dotenv";
import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.routes.js";
import taskRouter from "./src/modules/task/task.routes.js"
import { logger } from "./src/config/logger.js";
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotev.config();

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use((req, res, next) => {
  logger.info(`Request URL: ${req.url}, Method: ${req.method}`)
  next()
})


// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Private-Network", true);
  return next();
});


// routers
app.use("/auth", authRouter);
app.use("/task", taskRouter)

// page not found handle
app.all("*", (req, res, next) => {
  return next(new Error("page not Found", { cause: 404 }));
});

// global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    sucess: false,
    message: error.message,
    stack: error.stack,
  });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    logger.error("Database connection failed:", error);
    process.exit(1)
  });
