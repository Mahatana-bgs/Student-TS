//app.ts
import express from "express";
import cors from "cors";
import studentRoutes from "./routes/student.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { ApiError } from "./utils/ApiError";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);

app.use((req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
