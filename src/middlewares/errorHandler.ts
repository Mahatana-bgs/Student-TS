import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    console.error({
      message: err instanceof Error ? err.message : 'Unknown error',
      statusCode: err instanceof ApiError ? err.statusCode : 500,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
  } else {
    console.error('Error:', err);
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(isProduction ? {} : { stack: err.stack })
    });
    return;
  }

  if (err instanceof Error && (err as any).code === '23505') {
    res.status(409).json({
      success: false,
      message: 'Duplicate entry: This value already exists',
    });
    return;
  }

  if (err instanceof Error && (err as any).code === '23503') {
    res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
    });
    return;
  }

  if (err instanceof Error && err.message === 'Invalid or expired token') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: isProduction ? 'Internal server error' : (err instanceof Error ? err.message : 'Unknown error')
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};