import rateLimit from 'express-rate-limit';

// Limitador general para navegación y consultas estándar
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Máximo 300 peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Demasiadas solicitudes desde esta dirección IP. Por favor intente más tarde.',
  },
});

// Limitador estricto para autenticación (prevención de ataques de fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Máximo 10 intentos de login en 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Demasiados intentos de inicio de sesión. Por motivos de seguridad, espere 15 minutos.',
  },
});

// Limitador para el wizard interactivo de clientes (prevención de spam y saturación)
export const intakeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Máximo 20 envíos de proyectos por IP en 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Límite de envíos alcanzado. Por favor, comuníquese directamente si requiere enviar más consultas.',
  },
});
