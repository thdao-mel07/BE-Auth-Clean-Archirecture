import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        name: err.name,
        message: err.message,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      name: 'InternalServerError',
      message: 'Something went wrong',
    },
  });
};