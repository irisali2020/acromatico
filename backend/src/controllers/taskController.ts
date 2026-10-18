import { Request, Response } from 'express';
import { TaskService } from '../services/taskService.js';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority, category } = req.query;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tasks = await TaskService.getAll(filter);
    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la lista de tareas.',
    });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTask = await TaskService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tarea metódica creada exitosamente.',
      task: newTask,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al crear la tarea.',
    });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await TaskService.update(id, req.body);

    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Tarea no encontrada.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Tarea actualizada.',
      task: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar la tarea.',
    });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await TaskService.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Tarea no encontrada.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la tarea.',
    });
  }
};
