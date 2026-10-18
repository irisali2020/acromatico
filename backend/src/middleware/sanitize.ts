import { Request, Response, NextFunction } from 'express';

// Función recursiva para sanitizar objetos y eliminar operadores de inyección NoSQL ($where, $gt, etc.)
const sanitizeObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const cleanObj: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    // Si la clave empieza con $ o contiene punto, se descarta para evitar inyección en MongoDB
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleanObj[key] = sanitizeObject(obj[key]);
  }

  return cleanObj;
};

export const sanitizeNoSql = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};
