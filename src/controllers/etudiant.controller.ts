import { Request, Response } from "express";
import * as EtudiantModel from "../models/etudiant.model";
import { ApiError } from "../utils/ApiError";

export const getAllEtudiants = async (_req: Request, res: Response) => {
  const etudiants = await EtudiantModel.findAll();
  res.status(200).json({ success: true, data: etudiants });
};

export const getEtudiantById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const etudiant = await EtudiantModel.findById(id);

  if (!etudiant) {
    throw new ApiError(404, `Étudiant avec l'id ${id} introuvable`);
  }

  res.status(200).json({ success: true, data: etudiant });
};

export const createEtudiant = async (req: Request, res: Response) => {
  const { nom, prenom, email, filiere, date_naissance } = req.body;

  if (!nom || !prenom || !email) {
    throw new ApiError(400, "Les champs nom, prenom et email sont obligatoires");
  }

  const nouvelEtudiant = await EtudiantModel.create({
    nom,
    prenom,
    email,
    filiere,
    date_naissance,
  });

  res.status(201).json({ success: true, data: nouvelEtudiant });
};

// PUT : remplacement complet -> tous les champs sont exigés
export const replaceEtudiant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nom, prenom, email, filiere, date_naissance } = req.body;

  if (!nom || !prenom || !email || !filiere || !date_naissance) {
    throw new ApiError(
      400,
      "PUT nécessite tous les champs (nom, prenom, email, filiere, date_naissance)"
    );
  }

  const etudiant = await EtudiantModel.replace(id, {
    nom,
    prenom,
    email,
    filiere,
    date_naissance,
  });

  if (!etudiant) {
    throw new ApiError(404, `Étudiant avec l'id ${id} introuvable`);
  }

  res.status(200).json({ success: true, data: etudiant });
};

export const updateEtudiant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const etudiant = await EtudiantModel.update(id, req.body);

  if (!etudiant) {
    throw new ApiError(404, `Étudiant avec l'id ${id} introuvable`);
  }

  res.status(200).json({ success: true, data: etudiant });
};

export const deleteEtudiant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const supprime = await EtudiantModel.remove(id);

  if (!supprime) {
    throw new ApiError(404, `Étudiant avec l'id ${id} introuvable`);
  }

  res.status(204).send();
};
