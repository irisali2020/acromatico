import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  projectId?: mongoose.Types.ObjectId;
  projectTrackingCode?: string;
  category: 'tramite_municipal' | 'dibujo_cad' | 'renders_3d' | 'reunion_cliente' | 'visita_obra' | 'capba' | 'proveedores_gremios' | 'gestion_personal';
  priority: 'urgente' | 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'en_proceso' | 'completado';
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  checklistSubitems: Array<{
    id: string;
    text: string;
    isDone: boolean;
  }>;
  notes?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'El título de la tarea es obligatorio'],
      trim: true,
      maxlength: 140,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    projectTrackingCode: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['tramite_municipal', 'dibujo_cad', 'renders_3d', 'reunion_cliente', 'visita_obra', 'capba', 'proveedores_gremios', 'gestion_personal'],
      default: 'gestion_personal',
      index: true,
    },
    priority: {
      type: String,
      enum: ['urgente', 'alta', 'media', 'baja'],
      default: 'media',
      index: true,
    },
    status: {
      type: String,
      enum: ['pendiente', 'en_proceso', 'completado'],
      default: 'pendiente',
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
    },
    estimatedHours: {
      type: Number,
      default: 1,
    },
    actualHours: {
      type: Number,
      default: 0,
    },
    checklistSubitems: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        isDone: { type: Boolean, default: false },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
