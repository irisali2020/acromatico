import mongoose from 'mongoose';
import { Project, IProject } from '../models/Project.js';
import { generateMunicipalChecklist, IChecklistItem } from '../utils/checklistGenerator.js';
import { EmailService } from './emailService.js';

// Memoria volátil para desarrollo resiliente
let memoryProjects: any[] = [
  {
    _id: '675aa1081111111111111111',
    trackingCode: 'ACR-2025-0108',
    client: {
      name: 'Gonzalo & Florencia Ramos',
      email: 'gonzalo.ramos@gmail.com',
      phone: '+54 9 11 5824-9912',
      notes: 'Buscaban arquitectura minimalista con hormigón visto y grandes paños vidriados.',
    },
    serviceType: 'obra_nueva',
    stage: 'tramite_municipal',
    location: {
      municipality: 'Pilar',
      neighborhood: 'San Sebastián - Área 01',
      lotNumber: 'Lote 108',
      address: 'Calle Los Sauces 108',
      isGatedCommunity: true,
    },
    technicalData: {
      lotSizeM2: 850,
      coveredM2: 240,
      semiCoveredM2: 45,
      fos: 0.35,
      fot: 0.7,
      maxFootprintM2: 297,
      maxTotalM2: 595,
    },
    scopeDetails: {
      environments: ['Master Suite', '2 Dormitorios hijos', 'Living-Comedor apaisado', 'Cocina con Isla', 'Galería con Parrilla', 'Piscina Infinity'],
      architecturalStyle: 'Hormigón Visto & Minimalismo Acromático',
      budgetRange: '$180,000 - $220,000 USD',
      estimatedTimeframe: '12 a 14 meses',
      clientComments: 'Prioridad máxima a la orientación solar noroeste en el estar y galería.',
    },
    municipalChecklist: generateMunicipalChecklist('obra_nueva', 'Pilar', true),
    status: 'activo',
    priority: 'alta',
    progressPercentage: 65,
    notes: [
      {
        id: 'n-1',
        author: 'Arq. Acromático',
        text: 'Visado preliminar del barrio cerrado San Sebastián aprobado sin objeciones. Ingresado al CAPBA D4.',
        createdAt: new Date('2025-01-10'),
      },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Plano-Municipal-v02-San-Sebastian.pdf',
        url: 'https://www.acromaticoestudio.com/_files/plano_ejemplo.pdf',
        fileType: 'application/pdf',
        uploadedAt: new Date('2025-01-12'),
      },
    ],
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    _id: '675aa0382222222222222222',
    trackingCode: 'ACR-2025-0038',
    client: {
      name: 'Martín y Julieta Beltrán',
      email: 'mbeltran@studio-design.com',
      phone: '+54 9 11 6311-4400',
      notes: 'Lote sobre la laguna cristalina. Importante terraza y visuales abiertas.',
    },
    serviceType: 'obra_nueva',
    stage: 'proyecto_ejecutivo',
    location: {
      municipality: 'Pilar',
      neighborhood: 'Lagoon Pilar',
      lotNumber: 'Lote 038',
      address: 'Ribera Central 038',
      isGatedCommunity: true,
    },
    technicalData: {
      lotSizeM2: 920,
      coveredM2: 310,
      semiCoveredM2: 60,
      fos: 0.35,
      fot: 0.7,
      maxFootprintM2: 322,
      maxTotalM2: 644,
    },
    scopeDetails: {
      environments: ['Master Suite con terraza', '3 Dormitorios', 'Cava subterránea', 'Doble cochera cubierta', 'Galería doble altura', 'Piscina hacia laguna'],
      architecturalStyle: 'Contemporáneo puro, líneas horizontales y hormigón',
      budgetRange: '$260,000 USD',
      estimatedTimeframe: '14 meses',
      clientComments: 'Renders fotorrealistas aprobados.',
    },
    municipalChecklist: generateMunicipalChecklist('obra_nueva', 'Pilar', true),
    status: 'activo',
    priority: 'alta',
    progressPercentage: 45,
    notes: [],
    attachments: [],
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2025-01-14'),
  },
  {
    _id: '675aa1883333333333333333',
    trackingCode: 'ACR-2025-0188',
    client: {
      name: 'Estudio Jurídico & Notarial Vicente López',
      email: 'contacto@notarialvl.com.ar',
      phone: '+54 9 11 4791-2299',
      notes: 'Remodelación integral de piso de oficinas y mobiliario a medida.',
    },
    serviceType: 'oficinas',
    stage: 'direccion_obra',
    location: {
      municipality: 'Vicente López',
      neighborhood: 'Olivos / Puerto de Olivos',
      address: 'Av. del Libertador 2450 Piso 6',
      isGatedCommunity: false,
    },
    technicalData: {
      coveredM2: 180,
    },
    scopeDetails: {
      environments: ['Recepción', 'Sala de Directorio', '4 Despachos privados', 'Área de Coworking 12 puestos', 'Kitchenette / Coffee', 'Phone Booths'],
      interiorModules: ['Muebles de guardado embutidos', 'Divisores acústicos con marco de aluminio negro', 'Cielorraso suspendido con fajas LED'],
      architecturalStyle: 'Acromático Corporativo: Negro mate, roble natural y vidrio laminado',
      budgetRange: '$65,000 USD',
      estimatedTimeframe: '3 meses',
    },
    municipalChecklist: generateMunicipalChecklist('oficinas', 'Vicente López', false),
    status: 'activo',
    priority: 'critica',
    progressPercentage: 80,
    notes: [
      {
        id: 'n-2',
        author: 'Arq. Acromático',
        text: 'Instalación de perfiles de carpintería y cableado completado. Inicia colocación de mobiliario fijo.',
        createdAt: new Date('2025-01-12'),
      },
    ],
    attachments: [],
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2025-01-16'),
  },
  {
    _id: '675aa5124444444444444444',
    trackingCode: 'ACR-2025-0512',
    client: {
      name: 'Café & Bistro Monocromo (San Isidro)',
      email: 'hola@bistromonocromo.com',
      phone: '+54 9 11 3290-8811',
      notes: 'Local gastronómico de especialidad. Barra monolítica en microcemento y estructura metálica suspendida.',
    },
    serviceType: 'gastronomia',
    stage: 'anteproyecto',
    location: {
      municipality: 'San Isidro',
      neighborhood: 'Bajo de San Isidro',
      address: 'Primera Junta 850',
      isGatedCommunity: false,
    },
    technicalData: {
      coveredM2: 135,
      semiCoveredM2: 30,
    },
    scopeDetails: {
      commercialCapacity: '48 cubiertos sentados + barra para 8',
      interiorModules: ['Barra principal de 6.5m', 'Estructura aérea portacopas en hierro', 'Bancos perimetrales en madera maciza'],
      architecturalStyle: 'Industrial minimalista, hormigón, terrazo gris y hierro negro',
      budgetRange: '$50,000 USD',
      estimatedTimeframe: '4 meses',
    },
    municipalChecklist: generateMunicipalChecklist('gastronomia', 'San Isidro', false),
    status: 'activo',
    priority: 'alta',
    progressPercentage: 25,
    notes: [],
    attachments: [],
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-14'),
  },
];

export class ProjectService {
  static async getAll(filter: Record<string, any> = {}): Promise<any[]> {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Project.find(filter).sort({ updatedAt: -1 }).lean();
      } catch (e) {
        console.warn('[ProjectService] Error en consulta MongoDB, usando memoria:', e);
      }
    }

    let results = [...memoryProjects];
    if (filter.stage) results = results.filter((p) => p.stage === filter.stage);
    if (filter.serviceType) results = results.filter((p) => p.serviceType === filter.serviceType);
    if (filter.status) results = results.filter((p) => p.status === filter.status);

    return results;
  }

  static async getByIdOrCode(idOrCode: string): Promise<any | null> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(idOrCode)
          ? { $or: [{ _id: idOrCode }, { trackingCode: idOrCode.toUpperCase() }] }
          : { trackingCode: idOrCode.toUpperCase() };
        return await Project.findOne(query).lean();
      } catch (e) {
        console.warn('[ProjectService] Error en búsqueda MongoDB, usando memoria:', e);
      }
    }

    return (
      memoryProjects.find(
        (p) => p._id.toString() === idOrCode || p.trackingCode === idOrCode.toUpperCase()
      ) || null
    );
  }

  static async createFromIntake(data: any): Promise<any> {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `ACR-${year}-${randomSuffix}`;

    const isGated = data.location?.isGatedCommunity || false;
    const checklist = generateMunicipalChecklist(data.serviceType, data.location?.municipality || 'Zona Norte', isGated);

    const projectData = {
      ...data,
      trackingCode,
      stage: 'briefing',
      status: 'activo',
      priority: 'alta',
      progressPercentage: 10,
      municipalChecklist: checklist,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Sistema Acromático OS',
          text: `Proyecto ingresado a través del Recorrido Interactivo. Código asignado: ${trackingCode}.`,
          createdAt: new Date(),
        },
      ],
      attachments: [],
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const newProj = new Project(projectData);
        await newProj.save();
        const savedObject = newProj.toObject();

        // Enviar correo de confirmación con el resumen de la solicitud al cliente
        EmailService.sendProjectIntakeConfirmation(savedObject).catch((err) => {
          console.warn('[ProjectService] Error no bloqueante al enviar correo:', err);
        });

        return savedObject;
      } catch (e) {
        console.warn('[ProjectService] Error al guardar en MongoDB, persistiendo en memoria:', e);
      }
    }

    const memoryItem = {
      ...projectData,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryProjects.unshift(memoryItem);

    // Enviar correo de confirmación con el resumen de la solicitud al cliente
    EmailService.sendProjectIntakeConfirmation(memoryItem).catch((err) => {
      console.warn('[ProjectService] Error no bloqueante al enviar correo:', err);
    });

    return memoryItem;
  }

  static async updateStage(idOrCode: string, updateData: any): Promise<any | null> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(idOrCode)
          ? { $or: [{ _id: idOrCode }, { trackingCode: idOrCode.toUpperCase() }] }
          : { trackingCode: idOrCode.toUpperCase() };

        return await Project.findOneAndUpdate(query, { $set: updateData }, { new: true }).lean();
      } catch (e) {
        console.warn('[ProjectService] Error al actualizar en MongoDB, usando memoria:', e);
      }
    }

    const index = memoryProjects.findIndex(
      (p) => p._id.toString() === idOrCode || p.trackingCode === idOrCode.toUpperCase()
    );
    if (index === -1) return null;

    memoryProjects[index] = {
      ...memoryProjects[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return memoryProjects[index];
  }

  static async updateChecklistItem(idOrCode: string, itemId: string, status: string, notes?: string): Promise<any | null> {
    const project = await this.getByIdOrCode(idOrCode);
    if (!project) return null;

    const checklist = [...project.municipalChecklist];
    const itemIdx = checklist.findIndex((it: IChecklistItem) => it.id === itemId);
    if (itemIdx === -1) return null;

    checklist[itemIdx] = {
      ...checklist[itemIdx],
      status: status as any,
      ...(notes !== undefined && { description: notes }),
      ...(status === 'completado' && { completedAt: new Date() }),
    };

    // Calcular progreso
    const total = checklist.filter((it: IChecklistItem) => it.status !== 'no_aplica').length;
    const completed = checklist.filter((it: IChecklistItem) => it.status === 'completado').length;
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : project.progressPercentage;

    return await this.updateStage(idOrCode, { municipalChecklist: checklist, progressPercentage });
  }

  static async addNote(idOrCode: string, text: string, author: string = 'Arq. Acromático'): Promise<any | null> {
    const project = await this.getByIdOrCode(idOrCode);
    if (!project) return null;

    const newNote = {
      id: `note-${Date.now()}`,
      author,
      text,
      createdAt: new Date(),
    };

    const notes = [newNote, ...(project.notes || [])];
    return await this.updateStage(idOrCode, { notes });
  }
}
