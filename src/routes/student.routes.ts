//student.route.ts
import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  replaceStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
  getStudentsWithPagination,
  getStatistics,
} from "../controllers/student.controller";

const router = Router();

router.get("/", asyncHandler(getAllStudents));
router.get("/:id", asyncHandler(getStudentById));
router.post("/", asyncHandler(createStudent));
router.put("/:id", asyncHandler(replaceStudent));
router.patch("/:id", asyncHandler(updateStudent));
router.delete("/:id", asyncHandler(deleteStudent));
router.get("/search", asyncHandler(searchStudents));
router.get("/pagination", asyncHandler(getStudentsWithPagination));
router.get("/statistics", asyncHandler(getStatistics));

export default router;
