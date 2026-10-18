import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Debe ingresar un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(80),
  email: z.string().email('Debe ingresar un correo electrónico válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'architect', 'client']).default('admin'),
});
