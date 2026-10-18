import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService.js';

export const createProjectIntake = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProject = await ProjectService.createFromIntake(req.body);

    res.status(201).json({
      success: true,
      message: 'Ficha de proyecto generada exitosamente. El equipo de Acromático Estudio revisará la factibilidad.',
      trackingCode: newProject.trackingCode,
      project: {
        trackingCode: newProject.trackingCode,
        serviceType: newProject.serviceType,
        location: newProject.location,
        stage: newProject.stage,
        createdAt: newProject.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al procesar el ingreso del proyecto arquitectónico.',
    });
  }
};

export const getPublicProjectStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const project = await ProjectService.getByIdOrCode(code);

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Expediente no encontrado con el código provisto.',
      });
      return;
    }

    // Retornamos vista sanitizada para el cliente (sin revelar datos confidenciales o notas internas)
    res.json({
      success: true,
      project: {
        trackingCode: project.trackingCode,
        clientName: project.client.name,
        serviceType: project.serviceType,
        stage: project.stage,
        progressPercentage: project.progressPercentage,
        location: {
          municipality: project.location.municipality,
          neighborhood: project.location.neighborhood,
        },
        scopeDetails: {
          architecturalStyle: project.scopeDetails.architecturalStyle,
          environments: project.scopeDetails.environments,
        },
        checklistSummary: {
          total: project.municipalChecklist?.length || 0,
          completed: project.municipalChecklist?.filter((i: any) => i.status === 'completado').length || 0,
        },
        updatedAt: project.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al consultar el estado del expediente.',
    });
  }
};

export const getAllProjectsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stage, serviceType, status } = req.query;
    const filter: Record<string, any> = {};
    if (stage) filter.stage = stage;
    if (serviceType) filter.serviceType = serviceType;
    if (status) filter.status = status;

    const projects = await ProjectService.getAll(filter);

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los proyectos.',
    });
  }
};

export const getProjectDetailAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await ProjectService.getByIdOrCode(id);

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado.',
      });
      return;
    }

    res.json({
      success: true,
      project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al cargar los detalles del proyecto.',
    });
  }
};

export const updateProjectStage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await ProjectService.updateStage(id, req.body);

    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Proyecto actualizado correctamente.',
      project: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el proyecto.',
    });
  }
};

export const updateChecklistItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, itemId } = req.params;
    const { status, notes } = req.body;

    const updated = await ProjectService.updateChecklistItem(id, itemId, status, notes);

    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Proyecto o ítem de checklist no encontrado.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Ítem de checklist actualizado.',
      project: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar ítem de checklist.',
    });
  }
};

export const addProjectNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    const updated = await ProjectService.addNote(id, text, author);

    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Nota agregada al expediente.',
      project: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al registrar la nota técnica.',
    });
  }
};
