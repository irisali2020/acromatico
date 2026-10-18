import mongoose, { Schema, Document } from 'mongoose';
import { IChecklistItem } from '../utils/checklistGenerator.js';

export interface IProject extends Document {
  trackingCode: string;
  client: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
  serviceType: 'obra_nueva' | 'interior_mobiliario' | 'oficinas' | 'gastronomia' | 'regularizacion';
  stage: 'briefing' | 'anteproyecto' | 'proyecto_ejecutivo' | 'tramite_municipal' | 'licitacion_computo' | 'direccion_obra' | 'finalizado';
  location: {
    municipality: string;
    neighborhood?: string;
    lotNumber?: string;
    address?: string;
    isGatedCommunity: boolean;
  };
  technicalData: {
    lotSizeM2?: number;
    coveredM2?: number;
    semiCoveredM2?: number;
    fos?: number;
    fot?: number;
    maxFootprintM2?: number;
    maxTotalM2?: number;
  };
  scopeDetails: {
    environments?: string[];
    interiorModules?: string[];
    commercialCapacity?: string;
    architecturalStyle?: string;
    budgetRange?: string;
    estimatedTimeframe?: string;
    clientComments?: string;
  };
  municipalChecklist: IChecklistItem[];
  status: 'activo' | 'pausado' | 'archivado';
  priority: 'baja' | 'media' | 'alta' | 'critica';
  progressPercentage: number;
  notes: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: Date;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    fileType: string;
    sizeBytes?: number;
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema({
  id: { type: String, required: true },
  category: {
    type: String,
    enum: ['legal_dominio', 'preliminar', 'proyecto_tecnico', 'colegio_capba', 'municipal', 'obra'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pendiente', 'en_progreso', 'completado', 'observado', 'no_aplica'],
    default: 'pendiente',
  },
  priority: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media',
  },
  dueDate: { type: Date },
  completedAt: { type: Date },
});

const ProjectSchema = new Schema<IProject>(
  {
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    client: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      notes: { type: String, default: '' },
    },
    serviceType: {
      type: String,
      enum: ['obra_nueva', 'interior_mobiliario', 'oficinas', 'gastronomia', 'regularizacion'],
      required: true,
      default: 'obra_nueva',
    },
    stage: {
      type: String,
      enum: ['briefing', 'anteproyecto', 'proyecto_ejecutivo', 'tramite_municipal', 'licitacion_computo', 'direccion_obra', 'finalizado'],
      default: 'briefing',
      index: true,
    },
    location: {
      municipality: { type: String, required: true, default: 'Tigre' },
      neighborhood: { type: String, default: '' },
      lotNumber: { type: String, default: '' },
      address: { type: String, default: '' },
      isGatedCommunity: { type: Boolean, default: false },
    },
    technicalData: {
      lotSizeM2: { type: Number, default: 0 },
      coveredM2: { type: Number, default: 0 },
      semiCoveredM2: { type: Number, default: 0 },
      fos: { type: Number, default: 0.6 },
      fot: { type: Number, default: 1.2 },
      maxFootprintM2: { type: Number, default: 0 },
      maxTotalM2: { type: Number, default: 0 },
    },
    scopeDetails: {
      environments: { type: [String], default: [] },
      interiorModules: { type: [String], default: [] },
      commercialCapacity: { type: String, default: '' },
      architecturalStyle: { type: String, default: 'Minimalismo Acromático' },
      budgetRange: { type: String, default: '' },
      estimatedTimeframe: { type: String, default: '' },
      clientComments: { type: String, default: '' },
    },
    municipalChecklist: {
      type: [ChecklistItemSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['activo', 'pausado', 'archivado'],
      default: 'activo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['baja', 'media', 'alta', 'critica'],
      default: 'media',
    },
    progressPercentage: {
      type: Number,
      default: 5,
      min: 0,
      max: 100,
    },
    notes: [
      {
        id: { type: String, required: true },
        author: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        url: { type: String, required: true },
        fileType: { type: String, required: true },
        sizeBytes: { type: Number },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Cálculo previo a guardar para FOS y FOT
ProjectSchema.pre('save', function (next) {
  if (this.technicalData.lotSizeM2 && this.technicalData.lotSizeM2 > 0) {
    if (this.technicalData.fos) {
      this.technicalData.maxFootprintM2 = Math.round(this.technicalData.lotSizeM2 * this.technicalData.fos);
    }
    if (this.technicalData.fot) {
      this.technicalData.maxTotalM2 = Math.round(this.technicalData.lotSizeM2 * this.technicalData.fot);
    }
  }
  next();
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
