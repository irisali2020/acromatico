import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolioService.js';

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const { category, includeHidden } = req.query;
    const filter: Record<string, any> = {};
    if (category) filter.category = category;
    if (includeHidden === 'true') {
      filter.includeHidden = true;
    }

    const projects = await PortfolioService.getAll(filter);
    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener obras de portfolio: ' + err.message,
    });
  }
};

export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      location,
      municipality,
      m2,
      year,
      image,
      description,
      approval,
      highlights,
      tags,
      isVisible,
    } = req.body;

    if (!title || !location || !m2 || !image) {
      return res.status(400).json({
        success: false,
        error: 'Los campos título, ubicación, m² e imagen son obligatorios.',
      });
    }

    const created = await PortfolioService.create({
      title,
      category: category || 'vivienda',
      location,
      municipality: municipality || 'Zona Norte',
      m2,
      year: year || new Date().getFullYear().toString(),
      image,
      description: description || 'Proyecto arquitectónico desarrollado por Acromático Estudio.',
      approval: approval || 'Plano Aprobado Obras Particulares & CAPBA D4',
      highlights: highlights || [],
      tags: tags || [],
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Obra agregada exitosamente al portafolio de Proyectos Seleccionados',
      project: created,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al registrar obra en portfolio: ' + err.message,
    });
  }
};

export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await PortfolioService.update(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Obra no encontrada en el portafolio',
      });
    }

    res.json({
      success: true,
      message: 'Obra actualizada exitosamente',
      project: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar obra: ' + err.message,
    });
  }
};

export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await PortfolioService.delete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Obra no encontrada en el portafolio',
      });
    }

    res.json({
      success: true,
      message: 'Obra eliminada del portafolio',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar obra: ' + err.message,
    });
  }
};
