import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService.js';
import { TaskService } from '../services/taskService.js';

export const getStudioAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await ProjectService.getAll();
    const tasks = await TaskService.getAll();

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'activo').length;
    const municipalPermitsInProcess = projects.filter((p) => p.stage === 'tramite_municipal').length;
    const underConstruction = projects.filter((p) => p.stage === 'direccion_obra').length;

    // Suma de m² proyectados
    const totalProjectedM2 = projects.reduce((acc, p) => {
      const cov = p.technicalData?.coveredM2 || 0;
      const semi = (p.technicalData?.semiCoveredM2 || 0) * 0.5; // Coeficiente estándar FOS/FOT para semicubierto
      return acc + cov + semi;
    }, 0);

    // Distribución por partido / municipio de Zona Norte
    const locationStats: Record<string, number> = {};
    projects.forEach((p) => {
      const mun = p.location?.municipality || 'Otros';
      locationStats[mun] = (locationStats[mun] || 0) + 1;
    });

    // Distribución por servicio
    const serviceStats: Record<string, number> = {};
    projects.forEach((p) => {
      const s = p.serviceType || 'obra_nueva';
      serviceStats[s] = (serviceStats[s] || 0) + 1;
    });

    // Tareas pendientes urgentes
    const urgentTasks = tasks.filter((t) => t.priority === 'urgente' && t.status !== 'completado').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'completado').length;

    res.json({
      success: true,
      analytics: {
        totalProjects,
        activeProjects,
        municipalPermitsInProcess,
        underConstruction,
        totalProjectedM2: Math.round(totalProjectedM2),
        urgentTasks,
        pendingTasks,
        locationStats,
        serviceStats,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Error al compilar métricas del estudio.',
    });
  }
};
