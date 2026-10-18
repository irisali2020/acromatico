import { Router } from 'express';
import {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../controllers/portfolioController.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Endpoint público para que la web cliente consuma las obras seleccionadas
router.get('/', getPortfolio);

// Endpoints protegidos para que el arquitecto cargue y gestione proyectos
router.post('/', authenticateJwt, requireAdmin, createPortfolio);
router.patch('/:id', authenticateJwt, requireAdmin, updatePortfolio);
router.put('/:id', authenticateJwt, requireAdmin, updatePortfolio);
router.delete('/:id', authenticateJwt, requireAdmin, deletePortfolio);

export default router;
