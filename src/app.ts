import express from "express";
import cors from "cors";
import studentRoutes from "./routes/student.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { ApiError } from "./utils/ApiError";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);

// Any unknown route ends up here -> turned into a 404 ApiError,
// handled by the same centralized middleware.
app.use((req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Error-handling middleware: MUST be declared last.
app.use(errorHandler);

export default app;
