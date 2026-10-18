import { Request, Response } from 'express';
import { ServiceService } from '../services/serviceService.js';

export const getServices = async (req: Request, res: Response) => {
  try {
    const { includeHidden } = req.query;
    const filter: Record<string, any> = {};
    if (includeHidden === 'true') {
      filter.includeHidden = true;
    }

    const services = await ServiceService.getAll(filter);
    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener servicios: ' + err.message,
    });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { id, num, icon, title, subtitle, desc, features, badge, isVisible, order } = req.body;

    if (!title || !subtitle || !desc) {
      return res.status(400).json({
        success: false,
        error: 'Los campos título, subtítulo y descripción son obligatorios.',
      });
    }

    const created = await ServiceService.create({
      id,
      num,
      icon: icon || 'Home',
      title,
      subtitle,
      desc,
      features: features || [],
      badge: badge || 'Especialidad',
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      service: created,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al crear servicio: ' + err.message,
    });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await ServiceService.update(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      service: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar servicio: ' + err.message,
    });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ServiceService.delete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Servicio no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Servicio eliminado exitosamente',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar servicio: ' + err.message,
    });
  }
};
