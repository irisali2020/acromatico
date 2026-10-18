import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: 'admin' | 'architect' | 'client';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Buscar en cookie HttpOnly primero
    let token = req.cookies?.acromatico_token;

    // 2. Si no está en cookie, buscar en Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Acceso no autorizado. Debe iniciar sesión.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'acromatico_studio_ultra_secure_jwt_secret_token_key_ba_2025';
    const decoded = jwt.verify(token, secret) as AuthUserPayload;

    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado. Por favor ingrese nuevamente.',
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'architect')) {
    res.status(403).json({
      success: false,
      error: 'Permisos insuficientes. Requiere perfil de administración arquitectónica.',
    });
    return;
  }
  next();
};
