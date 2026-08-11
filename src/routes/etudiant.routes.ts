import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  getAllEtudiants,
  getEtudiantById,
  createEtudiant,
  replaceEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from "../controllers/etudiant.controller";

const router = Router();

router.get("/", asyncHandler(getAllEtudiants));
router.get("/:id", asyncHandler(getEtudiantById));
router.post("/", asyncHandler(createEtudiant));
router.put("/:id", asyncHandler(replaceEtudiant));
router.patch("/:id", asyncHandler(updateEtudiant));
router.delete("/:id", asyncHandler(deleteEtudiant));

export default router;
