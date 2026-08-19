import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { ApiError } from "./utils/ApiError";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/students", studentRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: process.env.DATABASE_URL ? "connected" : "not configured"
    });
});

app.get("/", (req, res) => {
    res.json({
        name: "Student Management API",
        version: "1.0.0",
        status: "online",
        endpoints: {
            "GET /": "API Information",
            "GET /health": "Health check",
            "GET /students": "Get all students",
            "GET /students/:id": "Get student by ID",
            "POST /students": "Create a new student",
            "PUT /students/:id": "Replace a student",
            "PATCH /students/:id": "Update a student",
            "DELETE /students/:id": "Delete a student",
            "GET /students/search?q=term": "Search students",
            "GET /students/pagination": "Get students with pagination",
            "GET /students/statistics": "Get student statistics"
        }
    });
});

app.use(notFound);

app.use(errorHandler);

export default app;