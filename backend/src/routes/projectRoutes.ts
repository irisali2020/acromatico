import { Router } from 'express';
import {
  createProjectIntake,
  getPublicProjectStatus,
  getAllProjectsAdmin,
  getProjectDetailAdmin,
  updateProjectStage,
  updateChecklistItem,
  addProjectNote,
} from '../controllers/projectController.js';
import { intakeLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import {
  createProjectIntakeSchema,
  updateProjectStageSchema,
  updateChecklistItemSchema,
  addProjectNoteSchema,
} from '../schemas/projectSchemas.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';

const router = Router();

// 1. Rutas Públicas (Vista de cara al cliente)
// Envío del Wizard de captación con rate limiting y validación de esquema
router.post('/intake', intakeLimiter, validateBody(createProjectIntakeSchema), createProjectIntake);
// Consulta de estado por código de seguimiento (ej: /api/projects/track/ACR-2025-0108)
router.get('/track/:code', getPublicProjectStatus);

// 2. Rutas Privadas de Administración (Panel del Arquitecto)
router.get('/', authenticateJwt, requireAdmin, getAllProjectsAdmin);
router.get('/:id', authenticateJwt, requireAdmin, getProjectDetailAdmin);
router.patch('/:id/stage', authenticateJwt, requireAdmin, validateBody(updateProjectStageSchema), updateProjectStage);
router.patch('/:id/checklist/:itemId', authenticateJwt, requireAdmin, validateBody(updateChecklistItemSchema), updateChecklistItem);
router.post('/:id/notes', authenticateJwt, requireAdmin, validateBody(addProjectNoteSchema), addProjectNote);

export default router;
