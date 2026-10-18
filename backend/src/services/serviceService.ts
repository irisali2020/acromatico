import mongoose from 'mongoose';
import { ServiceModel, IServiceItem } from '../models/Service.js';

// Semilla inicial con los 5 servicios reales del estudio
let memoryServices: any[] = [
  {
    _id: '675dd0011111111111111111',
    id: 'residencial',
    num: '01',
    icon: 'Home',
    title: 'Proyectos Residenciales desde Cero',
    subtitle: 'Viviendas Unifamiliares en Barrios Cerrados & Zonas Urbanas',
    desc: 'Desarrollamos el proyecto arquitectónico integral adaptado a la morfología de tu terreno y estilo de vida. Desde los primeros croquis de zonificación y anteproyecto hasta el proyecto ejecutivo con detalles constructivos.',
    features: [
      'Implantación bioclimática y asoleamiento en el lote',
      'Modelado 3D fotorrealista y recorridos virtuales',
      'Planos de replanteo, carpinterías, electricidad y sanitarias',
      'Supervisión y Dirección de Obra personalizada',
    ],
    badge: 'Llave en Mano / Desde Cero',
    isVisible: true,
    order: 1,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    _id: '675dd0022222222222222222',
    id: 'municipal',
    num: '02',
    icon: 'FileCheck',
    title: 'Habilitación & Trámites Municipales',
    subtitle: 'Gestión Integral en Zona Norte (Tigre, San Isidro, Pilar, Escobar, etc.)',
    desc: 'Nos encargamos de toda la burocracia técnica para que tu proyecto no se detenga. Verificación rigurosa de códigos urbanísticos, cálculo de FOS/FOT, visados colegiales y expedientes de obras particulares.',
    features: [
      'Liquidación y Aportes en Colegio de Arquitectos (CAPBA D4)',
      'Visado previo en Comisión de Arquitectura de Barrios Privados',
      'Confección de Plano Municipal reglamentario en escala 1:100',
      'Estudio de suelos, cálculo estructural y ley 13059 (térmico)',
    ],
    badge: 'Aprobación Garantizada',
    isVisible: true,
    order: 2,
    createdAt: new Date('2024-11-02'),
    updatedAt: new Date('2025-01-02'),
  },
  {
    _id: '675dd0033333333333333333',
    id: 'interiores',
    num: '03',
    icon: 'Layers',
    title: 'Arquitectura de Interiores & Mobiliario',
    subtitle: 'Equipamiento a Medida, Carpintería Técnica & Estructuras Interiores',
    desc: 'Diseñamos cada milímetro interior para complementar la pureza arquitectónica. Muebles fijos, islas de cocina monolíticas, panelados de madera, fajas de iluminación técnica embutida y herrería de autor.',
    features: [
      'Planos de despiece en escala 1:10 para carpinteros y herreros',
      'Islas de cocina en microcemento, granito o Dekton',
      'Placares y vestidores de piso a techo con perfiles ocultos',
      'Cielorrasos suspendidos y fajas de luz indirecta 3000K',
    ],
    badge: 'Detalle de Autor',
    isVisible: true,
    order: 3,
    createdAt: new Date('2024-11-03'),
    updatedAt: new Date('2025-01-03'),
  },
  {
    _id: '675dd0044444444444444444',
    id: 'corporativo',
    num: '04',
    icon: 'Building2',
    title: 'Espacios Corporativos & Oficinas',
    subtitle: 'Transformación de Pisos de Oficina & Espacios de Trabajo',
    desc: 'Proyectamos oficinas sobrias, funcionales y de alta imagen corporativa. Optimizamos los puestos de trabajo, salas de reuniones, phone booths y áreas de relax con un criterio visual acromático contemporáneo.',
    features: [
      'Layouts ergonómicos y distribución de densidad de puestos',
      'Divisiones vidriadas con perfilería de aluminio negro',
      'Acondicionamiento acústico y cableado estructurado bajo piso/cielorraso',
      'Áreas de coffee y recepción con identidad de marca',
    ],
    badge: 'Productividad & Diseño',
    isVisible: true,
    order: 4,
    createdAt: new Date('2024-11-04'),
    updatedAt: new Date('2025-01-04'),
  },
  {
    _id: '675dd0055555555555555555',
    id: 'gastronomia',
    num: '05',
    icon: 'UtensilsCrossed',
    title: 'Gastronomía & Locales Comerciales',
    subtitle: 'Cafés de Especialidad, Restaurantes & Bares en Zona Norte',
    desc: 'Diseñamos la experiencia espacial completa para emprendimientos gastronómicos. Desde la barra central imponente y el salón de comensales, hasta el cumplimiento estricto de normativas de evacuación, bomberos y cocina sanitaria.',
    features: [
      'Factibilidad urbanística para habilitación gastronómica comercial',
      'Diseño de barras monolíticas y contrabarras técnicas',
      'Planos de evacuación, cálculo de capacidad y salidas reglamentarias',
      'Diseño de ventilación y extracción forzada a los 4 vientos',
    ],
    badge: 'Experiencia Comercial',
    isVisible: true,
    order: 5,
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2025-01-05'),
  },
];

export class ServiceService {
  static async getAll(filter: Record<string, any> = {}): Promise<any[]> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query: any = {};
        if (!filter.includeHidden) {
          query.isVisible = { $ne: false };
        }
        return await ServiceModel.find(query).sort({ order: 1, createdAt: 1 }).lean();
      } catch (err) {
        console.warn('[ServiceService] Fallo consulta Mongo, usando memoria:', err);
      }
    }

    let results = [...memoryServices];
    if (!filter.includeHidden) {
      results = results.filter((s) => s.isVisible !== false);
    }
    return results.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  static async getById(id: string): Promise<any | null> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
        return await ServiceModel.findOne(query).lean();
      } catch (err) {
        console.warn('[ServiceService] Fallo Mongo byId, usando memoria:', err);
      }
    }

    return memoryServices.find((s) => s._id === id || s.id === id) || null;
  }

  static async create(data: any): Promise<any> {
    const slugId =
      data.id ||
      data.title
        ?.toLowerCase()
        ?.replace(/[^a-z0-9]+/g, '-')
        ?.replace(/^-|-$/g, '') || `servicio-${Date.now()}`;

    const newService = {
      ...data,
      id: slugId,
      num: data.num || String(memoryServices.length + 1).padStart(2, '0'),
      icon: data.icon || 'Home',
      isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
      features: Array.isArray(data.features) ? data.features : [],
      order: data.order !== undefined ? Number(data.order) : memoryServices.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = new ServiceModel(newService);
        await created.save();
        return created.toObject();
      } catch (err) {
        console.warn('[ServiceService] Error al guardar en Mongo, guardando en memoria:', err);
      }
    }

    const memoryItem = {
      ...newService,
      _id: new mongoose.Types.ObjectId().toString(),
    };
    memoryServices.push(memoryItem);
    return memoryItem;
  }

  static async update(id: string, data: any): Promise<any | null> {
    const updateData: any = { ...data, updatedAt: new Date() };
    delete updateData._id;

    if (data.features && typeof data.features === 'string') {
      updateData.features = data.features
        .split('\n')
        .map((f: string) => f.trim())
        .filter(Boolean);
    }
    if (data.isVisible !== undefined) {
      updateData.isVisible = Boolean(data.isVisible);
    }
    if (data.order !== undefined) {
      updateData.order = Number(data.order);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
        const updated = await ServiceModel.findOneAndUpdate(
          query,
          { $set: updateData },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (err) {
        console.warn('[ServiceService] Fallo update Mongo, usando memoria:', err);
      }
    }

    const index = memoryServices.findIndex((s) => s._id === id || s.id === id);
    if (index !== -1) {
      memoryServices[index] = {
        ...memoryServices[index],
        ...updateData,
      };
      return memoryServices[index];
    }
    return null;
  }

  static async delete(id: string): Promise<boolean> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
        await ServiceModel.deleteOne(query);
        return true;
      } catch (err) {
        console.warn('[ServiceService] Fallo delete Mongo:', err);
      }
    }

    const initialLen = memoryServices.length;
    memoryServices = memoryServices.filter((s) => s._id !== id && s.id !== id);
    return memoryServices.length < initialLen;
  }
}
