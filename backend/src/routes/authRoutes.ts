import { Router } from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../schemas/authSchemas.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

// Rutas de autenticación con rate limiting estricto y validación Zod
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.get('/me', authenticateJwt, getMe);
router.post('/logout', logout);

export default router;
