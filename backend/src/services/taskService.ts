import mongoose from 'mongoose';
import { Task, ITask } from '../models/Task.js';

let memoryTasks: any[] = [
  {
    _id: '675bb0011111111111111111',
    title: 'Presentar plano de estructura ante Obras Particulares Tigre',
    projectTrackingCode: 'ACR-2025-0108',
    category: 'tramite_municipal',
    priority: 'urgente',
    status: 'en_proceso',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
    estimatedHours: 3,
    actualHours: 1.5,
    checklistSubitems: [
      { id: 'sub-1', text: 'Firmar carátula digital con token criptográfico', isDone: true },
      { id: 'sub-2', text: 'Adjuntar comprobante de liquidación CAPBA D4', isDone: true },
      { id: 'sub-3', text: 'Ingresar por ventanilla única web de Tigre', isDone: false },
    ],
    notes: 'Verificar que la memoria de cálculo incluya la verificación sísmica y de viento según CIRSOC.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '675bb0022222222222222222',
    title: 'Modelado 3D de iluminación en galería y remate de hormigón',
    projectTrackingCode: 'ACR-2025-0038',
    category: 'renders_3d',
    priority: 'alta',
    status: 'en_proceso',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estimatedHours: 4,
    actualHours: 2,
    checklistSubitems: [
      { id: 'sub-4', text: 'Ajustar mapa de textura de encofrado fenólico', isDone: true },
      { id: 'sub-5', text: 'Configurar luminarias rasantes 3000K', isDone: false },
    ],
    notes: 'El cliente pidió ver cómo luce el atardecer sobre la laguna artificial de Lagoon Pilar.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '675bb0033333333333333333',
    title: 'Inspección de avance de herrería y carpintería técnica en obra',
    projectTrackingCode: 'ACR-2025-0188',
    category: 'visita_obra',
    priority: 'alta',
    status: 'pendiente',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    estimatedHours: 2.5,
    actualHours: 0,
    checklistSubitems: [
      { id: 'sub-6', text: 'Revisar escuadras de las divisiones de oficinas', isDone: false },
      { id: 'sub-7', text: 'Firmar libro de órdenes de obra', isDone: false },
    ],
    notes: 'Llevar cinta métrica láser y plano de replanteo v03 impreso en A3.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '675bb0044444444444444444',
    title: 'Liquidación de aportes colegiales CAAITBA en San Isidro',
    projectTrackingCode: 'ACR-2025-0512',
    category: 'capba',
    priority: 'media',
    status: 'pendiente',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    estimatedHours: 1.5,
    actualHours: 0,
    checklistSubitems: [],
    notes: 'Calcular sobre tabla arancelaria de proyecto comercial gastronómico.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '675bb0055555555555555555',
    title: 'Actualizar plantilla de cómputo métrico paramétrico en Excel / BIM',
    category: 'gestion_personal',
    priority: 'media',
    status: 'pendiente',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedHours: 2,
    actualHours: 0,
    checklistSubitems: [],
    notes: 'Incorporar desglose de rubros de equipamiento para oficinas y locales gastronómicos.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class TaskService {
  static async getAll(filter: Record<string, any> = {}): Promise<any[]> {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Task.find(filter).sort({ dueDate: 1, priority: 1 }).lean();
      } catch (e) {
        console.warn('[TaskService] Error en consulta MongoDB, usando memoria:', e);
      }
    }

    let results = [...memoryTasks];
    if (filter.status) results = results.filter((t) => t.status === filter.status);
    if (filter.priority) results = results.filter((t) => t.priority === filter.priority);
    if (filter.category) results = results.filter((t) => t.category === filter.category);
    return results;
  }

  static async create(data: any): Promise<any> {
    if (mongoose.connection.readyState === 1) {
      try {
        const newTask = new Task(data);
        await newTask.save();
        return newTask.toObject();
      } catch (e) {
        console.warn('[TaskService] Error al guardar en MongoDB, usando memoria:', e);
      }
    }

    const memoryItem = {
      ...data,
      _id: new mongoose.Types.ObjectId().toString(),
      status: 'pendiente',
      actualHours: 0,
      checklistSubitems: data.checklistSubitems || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryTasks.unshift(memoryItem);
    return memoryItem;
  }

  static async update(id: string, updateData: any): Promise<any | null> {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Task.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean();
      } catch (e) {
        console.warn('[TaskService] Error al actualizar en MongoDB, usando memoria:', e);
      }
    }

    const index = memoryTasks.findIndex((t) => t._id.toString() === id);
    if (index === -1) return null;

    if (updateData.status === 'completado' && memoryTasks[index].status !== 'completado') {
      updateData.completedAt = new Date();
    }

    memoryTasks[index] = {
      ...memoryTasks[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return memoryTasks[index];
  }

  static async delete(id: string): Promise<boolean> {
    if (mongoose.connection.readyState === 1) {
      try {
        const res = await Task.findByIdAndDelete(id);
        return !!res;
      } catch (e) {
        console.warn('[TaskService] Error al eliminar en MongoDB, usando memoria:', e);
      }
    }

    const initialLen = memoryTasks.length;
    memoryTasks = memoryTasks.filter((t) => t._id.toString() !== id);
    return memoryTasks.length < initialLen;
  }
}
