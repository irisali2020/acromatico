import { Router } from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Endpoint público para que la web cliente consuma los servicios activos
router.get('/', getServices);

// Endpoints protegidos para administración del estudio
router.post('/', authenticateJwt, requireAdmin, createService);
router.patch('/:id', authenticateJwt, requireAdmin, updateService);
router.put('/:id', authenticateJwt, requireAdmin, updateService);
router.delete('/:id', authenticateJwt, requireAdmin, deleteService);

export default router;
