import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './config/db.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { sanitizeNoSql } from './middleware/sanitize.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// 1. Capa de Seguridad: Cabeceras HTTP estrictas con Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", CORS_ORIGIN],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Control de Acceso CORS Seguro
app.use(
  cors({
    origin: [CORS_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Middlewares de parseo con límites de tamaño
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Sanitización NoSQL activa contra inyecciones de base de datos
app.use(sanitizeNoSql);

// 5. Rate Limiting general para mitigar ataques DDoS y scraping
app.use('/api', generalLimiter);

// 6. Logs en desarrollo
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 7. Endpoint de Salud del Sistema
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'Acromático OS - Architecture Management Suite',
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    version: '1.0.0',
    securityProtocols: [
      'Helmet HTTP Security Headers',
      'NoSQL Injection Sanitization',
      'Rate Limiting Protection',
      'Strict Zod Input Validation',
      'JWT HttpOnly Cookie Auth',
    ],
  });
});

// 8. Registro de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', serviceRoutes);

// 9. Manejador de rutas no encontradas 404
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Recurso API no encontrado en Acromático OS',
  });
});

// 10. Manejador Global de Errores
app.use(errorHandler);

// Inicializar Servidor y Base de Datos
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[Acromático OS API] Servidor activo en puerto ${PORT}`);
    console.log(`[Seguridad] Protocolos de protección activos.`);
    console.log(`[Healthcheck] http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
};

startServer();

export default app;
