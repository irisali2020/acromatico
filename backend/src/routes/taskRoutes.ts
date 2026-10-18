import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchemas.js';

const router = Router();

// Todas las rutas de tareas están protegidas para el arquitecto
router.use(authenticateJwt, requireAdmin);

router.get('/', getTasks);
router.post('/', validateBody(createTaskSchema), createTask);
router.patch('/:id', validateBody(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
