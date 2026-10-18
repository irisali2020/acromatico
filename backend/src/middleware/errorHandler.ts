import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[Error] ${err.name || 'Error'}: ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(isDev && { stack: err.stack }),
  });
};
