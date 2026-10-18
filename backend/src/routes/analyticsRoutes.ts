import { Router } from 'express';
import { getStudioAnalytics } from '../controllers/analyticsController.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJwt, requireAdmin, getStudioAnalytics);

export default router;
