import { Request, Response } from "express";
import * as StudentModel from "../models/student.model";
import { ApiError } from "../utils/ApiError";

export const getAllStudents = async (_req: Request, res: Response) => {
  const students = await StudentModel.findAll();
  res.status(200).json({ success: true, data: students });
};

export const getStudentById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const student = await StudentModel.findById(id);

  if (!student) {
    throw new ApiError(404, `Student with id ${id} not found`);
  }

  res.status(200).json({ success: true, data: student });
};

export const createStudent = async (req: Request, res: Response) => {
  const { last_name, first_name, email, major, date_of_birth } = req.body;

  if (!last_name || !first_name || !email) {
    throw new ApiError(400, "last_name, first_name and email are required");
  }

  const newStudent = await StudentModel.create({
    last_name,
    first_name,
    email,
    major,
    date_of_birth,
  });

  res.status(201).json({ success: true, data: newStudent });
};

export const replaceStudent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { last_name, first_name, email, major, date_of_birth } = req.body;

  if (!last_name || !first_name || !email || !major || !date_of_birth) {
    throw new ApiError(
      400,
      "PUT requires all fields (last_name, first_name, email, major, date_of_birth)"
    );
  }

  const student = await StudentModel.replace(id, {
    last_name,
    first_name,
    email,
    major,
    date_of_birth,
  });

  if (!student) {
    throw new ApiError(404, `Student with id ${id} not found`);
  }

  res.status(200).json({ success: true, data: student });
};

export const updateStudent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const student = await StudentModel.update(id, req.body);

  if (!student) {
    throw new ApiError(404, `Student with id ${id} not found`);
  }

  res.status(200).json({ success: true, data: student });
};

export const deleteStudent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await StudentModel.remove(id);

  if (!deleted) {
    throw new ApiError(404, `Student with id ${id} not found`);
  }

  res.status(204).send();
};
