import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'El título de la tarea es obligatorio').max(140),
  projectId: z.string().optional(),
  projectTrackingCode: z.string().optional(),
  category: z.enum([
    'tramite_municipal',
    'dibujo_cad',
    'renders_3d',
    'reunion_cliente',
    'visita_obra',
    'capba',
    'proveedores_gremios',
    'gestion_personal',
  ]).default('gestion_personal'),
  priority: z.enum(['urgente', 'alta', 'media', 'baja']).default('media'),
  dueDate: z.string().or(z.date()).optional(),
  estimatedHours: z.number().min(0.25).max(100).default(1),
  checklistSubitems: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        isDone: z.boolean().default(false),
      })
    )
    .optional(),
  notes: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).max(140).optional(),
  status: z.enum(['pendiente', 'en_proceso', 'completado']).optional(),
  priority: z.enum(['urgente', 'alta', 'media', 'baja']).optional(),
  actualHours: z.number().min(0).optional(),
  dueDate: z.string().or(z.date()).optional(),
  checklistSubitems: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        isDone: z.boolean(),
      })
    )
    .optional(),
  notes: z.string().optional(),
});
