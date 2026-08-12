import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  replaceStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";

const router = Router();

router.get("/", asyncHandler(getAllStudents));
router.get("/:id", asyncHandler(getStudentById));
router.post("/", asyncHandler(createStudent));
router.put("/:id", asyncHandler(replaceStudent));
router.patch("/:id", asyncHandler(updateStudent));
router.delete("/:id", asyncHandler(deleteStudent));

export default router;
