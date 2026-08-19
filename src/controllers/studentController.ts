import { Request, Response, NextFunction } from "express";
import studentService from "../services/studentService";
import statisticsService from "../services/statisticsService";
import { ApiError } from "../utils/ApiError";


export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json({ success: true, data: students, count: students.length });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format");
    }
    const student = await studentService.getStudentById(id);
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { last_name, first_name, email, major, date_of_birth } = req.body;
    if (!last_name || !first_name || !email) {
      throw new ApiError(400, "last_name, first_name and email are required");
    }
    const newStudent = await studentService.createStudent({
      last_name,
      first_name,
      email,
      major,
      date_of_birth,
    });
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    next(error);
  }
};

export const replaceStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format");
    }

    const { last_name, first_name, email, major, date_of_birth } = req.body;

    if (!last_name || !first_name || !email || !major || !date_of_birth) {
      throw new ApiError(
        400,
        "PUT requires all fields (last_name, first_name, email, major, date_of_birth)"
      );
    }

    const student = await studentService.replaceStudent(id, {
      last_name,
      first_name,
      email,
      major,
      date_of_birth,
    });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format");
    }

    const student = await studentService.updateStudent(id, req.body);
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format");
    }

    await studentService.deleteStudent(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const searchStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      throw new ApiError(400, "Search term 'q' is required");
    }
    const students = await studentService.searchStudents(q);
    res.status(200).json({ success: true, data: students, count: students.length });
  } catch (error) {
    next(error);
  }
};

export const getStudentsWithPagination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const filter: any = {};

    if (req.query.major) {
      filter.major = req.query.major;
    }
    if (req.query.search) {
      filter.search = req.query.search;
    }

    const result = await studentService.getStudentsWithPagination(page, limit, filter);
    res.status(200).json({
      success: true,
      data: result.students,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await statisticsService.getStudentStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
