import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contacto@acromaticoestudio.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AcromaticoAdmin2025!';
const JWT_SECRET = process.env.JWT_SECRET || 'acromatico_studio_ultra_secure_jwt_secret_token_key_ba_2025';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Comparar con credenciales de administración
    const isEmailMatch = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isPassMatch = password === ADMIN_PASSWORD;

    if (!isEmailMatch || !isPassMatch) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas. Verifique correo y contraseña.',
      });
      return;
    }

    const payload = {
      userId: 'admin-acromatico-01',
      email: ADMIN_EMAIL,
      role: 'admin' as const,
      name: 'Arquitecto Titular - Acromático Estudio',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Configurar cookie segura HttpOnly
    res.cookie('acromatico_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso en Acromático OS',
      token,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al procesar el inicio de sesión',
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'No autenticado' });
    return;
  }

  res.json({
    success: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
      name: 'Arquitecto Titular - Acromático Estudio',
    },
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('acromatico_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
};
