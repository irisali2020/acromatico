import { z } from 'zod';

export const createProjectIntakeSchema = z.object({
  client: z.object({
    name: z.string().min(2, 'El nombre es obligatorio').max(80),
    email: z.string().email('Email no válido'),
    phone: z.string().min(6, 'Teléfono o WhatsApp obligatorio'),
    notes: z.string().optional(),
  }),
  serviceType: z.enum(['obra_nueva', 'interior_mobiliario', 'oficinas', 'gastronomia', 'regularizacion']),
  location: z.object({
    municipality: z.string().min(2, 'Municipio obligatorio'),
    neighborhood: z.string().optional(),
    lotNumber: z.string().optional(),
    address: z.string().optional(),
    isGatedCommunity: z.boolean().default(false),
  }),
  technicalData: z
    .object({
      lotSizeM2: z.number().nonnegative().optional(),
      coveredM2: z.number().nonnegative().optional(),
      semiCoveredM2: z.number().nonnegative().optional(),
      fos: z.number().min(0).max(1).optional(),
      fot: z.number().min(0).max(5).optional(),
    })
    .optional(),
  scopeDetails: z
    .object({
      environments: z.array(z.string()).optional(),
      interiorModules: z.array(z.string()).optional(),
      commercialCapacity: z.string().optional(),
      architecturalStyle: z.string().optional(),
      budgetRange: z.string().optional(),
      estimatedTimeframe: z.string().optional(),
      clientComments: z.string().optional(),
    })
    .optional(),
});

export const updateProjectStageSchema = z.object({
  stage: z.enum(['briefing', 'anteproyecto', 'proyecto_ejecutivo', 'tramite_municipal', 'licitacion_computo', 'direccion_obra', 'finalizado']).optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  priority: z.enum(['baja', 'media', 'alta', 'critica']).optional(),
  status: z.enum(['activo', 'pausado', 'archivado']).optional(),
});

export const updateChecklistItemSchema = z.object({
  status: z.enum(['pendiente', 'en_progreso', 'completado', 'observado', 'no_aplica']),
  notes: z.string().optional(),
});

export const addProjectNoteSchema = z.object({
  text: z.string().min(1, 'El texto de la nota no puede estar vacío').max(1000),
  author: z.string().default('Arquitecto Acromático'),
});
