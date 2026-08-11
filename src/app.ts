import express from "express";
import cors from "cors";
import etudiantRoutes from "./routes/etudiant.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { ApiError } from "./utils/ApiError";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/etudiants", etudiantRoutes);

app.use((req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} introuvable`));
});

app.use(errorHandler);

export default app;
