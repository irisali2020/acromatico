import mongoose from 'mongoose';
import { PortfolioProject, IPortfolioProject } from '../models/Portfolio.js';

// Semilla inicial con las obras 100% reales de Acromático Estudio
let memoryPortfolio: any[] = [
  {
    _id: '675cc0011111111111111111',
    id: 'ss-108',
    title: 'UF San Sebastián A01 L108',
    category: 'vivienda',
    location: 'Pilar / Escobar · Barrio San Sebastián',
    municipality: 'Pilar / Escobar',
    m2: '240 m² Cubiertos + 45 m² Galería',
    year: '2024 - 2025',
    image:
      'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000094-135791357b/700/UF%20SS%20A01%20L108%20-%20Render%20v02%2001-0.jpeg',
    description:
      'Vivienda unifamiliar de arquitectura contemporánea pura. Volumetría en hormigón visto, amplios paños vidriados con DVH y galería con parrilla orientada hacia el asoleamiento óptimo.',
    approval: 'Plano Aprobado Obras Particulares & CAPBA D4',
    highlights: [
      'Hormigón visto fenólico con buñas milimétricas',
      'Doble altura en área social con visuales al parque',
      'Piscina sinfín con solárium atérmico',
      'Alineación solar bioclimática noroeste',
    ],
    tags: ['Hormigón Visto', 'Doble Altura', 'Piscina', 'Plano Aprobado'],
    isFeatured: true,
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    _id: '675cc0022222222222222222',
    id: 'lagoon-038',
    title: 'UF Lagoon Pilar L038',
    category: 'vivienda',
    location: 'Pilar · Barrio Cerrado Lagoon',
    municipality: 'Pilar',
    m2: '310 m² Cubiertos + 60 m² Semicubiertos',
    year: '2024 - 2025',
    image:
      'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000490-ba995ba997/700/UF%20Lagoon%20L038%20-%20Fotos%20%2836%29-3.jpeg',
    description:
      'Residencia implantada frente al espejo de agua de la laguna cristalina. Planta libre apaisada, suites privadas en planta alta y terraza mirador con remate arquitectónico.',
    approval: 'Proyecto Ejecutivo & Permiso de Obra Pilar',
    highlights: [
      'Implantación en lote preferencial sobre espejo de agua',
      'Master Suite con vestidor pasante y baño compartimentado',
      'Cava subterránea para guarda de vinos',
      'Terraza panorámica con baranda de vidrio templado',
    ],
    tags: ['Frente a Laguna', 'Master Suite', 'Cava Subterránea', 'Ejecutivo'],
    isFeatured: true,
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    _id: '675cc0033333333333333333',
    id: 'ss-188',
    title: 'UF San Sebastián A06 L188 (Interiores)',
    category: 'interior',
    location: 'Pilar · San Sebastián Área 06',
    municipality: 'Pilar',
    m2: '160 m² Interiores & Mobiliario de Autor',
    year: '2024',
    image:
      'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000501-b063cb063e/700/UF%20SS%20A06%20L188%20-%20Fotos%20%281%29-9.jpeg',
    description:
      'Diseño y fabricación de equipamiento interior a medida. Cocina con isla monolítica, muebles de piso a techo sin tiradores visibles, detalles en madera noble y perfiles de iluminación rasante.',
    approval: 'Obra Finalizada & Equipamiento Instalado',
    highlights: [
      'Isla central monolítica en microcemento texturado',
      'Muebles de guardado de piso a techo con apertura push',
      'Perfiles de iluminación indirecta LED cálida 3000K',
      'Terminaciones en enchapado de paraíso seleccionado',
    ],
    tags: ['Mobiliario a Medida', 'Isla Cocina', 'Perfiles LED', 'Finalizado'],
    isFeatured: true,
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    _id: '675cc0044444444444444444',
    id: 'cvc-340',
    title: 'UF CVC L340',
    category: 'vivienda',
    location: 'Tigre · Club de Campo CVC',
    municipality: 'Tigre',
    m2: '210 m² Cubiertos',
    year: '2024',
    image:
      'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000076-116c3116c5/700/UF%20CVC%20L340%20-%20R02%20-%20Render%2003-9.jpeg',
    description:
      'Proyecto racionalista en lote central. Retiros reglamentarios ajustados a la normativa interna del barrio privado, núcleo húmedo central y fluidez entre interior y jardín posterior.',
    approval: 'Aprobación Municipal Tigre Obras Particulares',
    highlights: [
      'Racionalismo constructivo de bajo mantenimiento',
      'Galería cubierta integrada al estar-comedor',
      'Estudio de asoleamiento para retención térmica invernal',
      'Presentación digital de expediente Tigre aprobada',
    ],
    tags: ['Racionalismo', 'Galería Cubierta', 'Aprobación Tigre'],
    isFeatured: true,
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-11-25'),
  },
  {
    _id: '675cc0055555555555555555',
    id: 'corp-vl',
    title: 'Piso Corporativo Libertador',
    category: 'comercial',
    location: 'Vicente López · Av. del Libertador',
    municipality: 'Vicente López',
    m2: '180 m² Corporativo',
    year: '2024 - 2025',
    image:
      'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000518-251f3251f5/700/UF%20SS%20A06%20L243%20-%20Fotos%20%281%29-7.jpeg',
    description:
      'Arquitectura interior para estudio profesional. Puestos operativos modulares, tabiquería vidriada con marco negro, cielorraso fonoabsorbente y diseño de iluminación lineal 3000K.',
    approval: 'Habilitación Comercial Vicente López',
    highlights: [
      'Tabiquería acústica de doble vidrio con perfilería de aluminio negro',
      'Puestos de trabajo modulares con conectividad oculta',
      'Sala de conferencias equipada con absorción acústica',
      'Acceso biométrico e iluminación inteligente programable',
    ],
    tags: ['Oficinas', 'Vidrio y Acero', 'Cableado Oculto', 'En Obra'],
    isFeatured: true,
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    _id: '675cc0066666666666666666',
    id: 'gas-si',
    title: 'Café & Bistro Monocromo',
    category: 'comercial',
    location: 'San Isidro · Bajo de San Isidro',
    municipality: 'San Isidro',
    m2: '135 m² Gastronomía',
    year: '2025',
    image:
      'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000451-3a3383a33a/700/UF%20SS%20A02%20L148%20-%20Fotos%20%288%29-8.jpeg',
    description:
      'Espacio gastronómico con barra monolítica de terrazo gris y microcemento. Habilitación comercial y cálculo de capacidad para 48 comensales con extracción forzada a los 4 vientos.',
    approval: 'Plano Único San Isidro & Habilitación Comercial',
    highlights: [
      'Barra principal continua en terrazo y hierro macizo',
      'Capacidad calculada para 48 cubiertos y rotación de clientes',
      'Sistema de extracción técnica a los 4 vientos bajo norma',
      'Baños reglamentarios accesibles y plano de evacuación',
    ],
    tags: ['Gastronomía', 'Barra Monolítica', 'Habilitación Comercial'],
    isFeatured: true,
    isVisible: true,
    createdAt: new Date('2024-07-02'),
    updatedAt: new Date('2025-01-14'),
  },
].map((item) => ({ ...item, isVisible: item.isVisible !== false }));

export class PortfolioService {
  static async getAll(filter: Record<string, any> = {}): Promise<any[]> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query: any = {};
        if (filter.category && filter.category !== 'todos') {
          query.category = filter.category;
        }
        if (!filter.includeHidden) {
          query.isVisible = { $ne: false };
        }
        return await PortfolioProject.find(query).sort({ createdAt: -1 }).lean();
      } catch (err) {
        console.warn('[PortfolioService] Fallo consulta Mongo, usando memoria:', err);
      }
    }

    let results = [...memoryPortfolio];
    if (filter.category && filter.category !== 'todos') {
      results = results.filter((p) => p.category === filter.category);
    }
    if (!filter.includeHidden) {
      results = results.filter((p) => p.isVisible !== false);
    }
    return results;
  }

  static async getById(id: string): Promise<any | null> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
        return await PortfolioProject.findOne(query).lean();
      } catch (err) {
        console.warn('[PortfolioService] Fallo Mongo byId, usando memoria:', err);
      }
    }

    return memoryPortfolio.find((p) => p._id === id || p.id === id) || null;
  }

  static async create(data: any): Promise<any> {
    const slugId =
      data.title
        ?.toLowerCase()
        ?.replace(/[^a-z0-9]+/g, '-')
        ?.replace(/^-|-$/g, '') || `obra-${Date.now()}`;

    const newProject = {
      ...data,
      id: slugId,
      isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : true,
      isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = new PortfolioProject(newProject);
        await created.save();
        return created.toObject();
      } catch (err) {
        console.warn('[PortfolioService] Error al guardar en Mongo, guardando en memoria:', err);
      }
    }

    const memoryItem = {
      ...newProject,
      _id: new mongoose.Types.ObjectId().toString(),
    };
    memoryPortfolio.unshift(memoryItem);
    return memoryItem;
  }

  static async update(id: string, data: any): Promise<any | null> {
    const updateData: any = { ...data, updatedAt: new Date() };
    delete updateData._id;

    if (data.highlights && typeof data.highlights === 'string') {
      updateData.highlights = data.highlights
        .split('\n')
        .map((h: string) => h.trim())
        .filter(Boolean);
    }
    if (data.tags && typeof data.tags === 'string') {
      updateData.tags = data.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
    }
    if (data.isVisible !== undefined) {
      updateData.isVisible = Boolean(data.isVisible);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
        const updated = await PortfolioProject.findOneAndUpdate(
          query,
          { $set: updateData },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (err) {
        console.warn('[PortfolioService] Fallo update Mongo, usando memoria:', err);
      }
    }

    const index = memoryPortfolio.findIndex((p) => p._id === id || p.id === id);
    if (index !== -1) {
      memoryPortfolio[index] = {
        ...memoryPortfolio[index],
        ...updateData,
      };
      return memoryPortfolio[index];
    }
    return null;
  }

  static async delete(id: string): Promise<boolean> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
        await PortfolioProject.deleteOne(query);
        return true;
      } catch (err) {
        console.warn('[PortfolioService] Fallo delete Mongo:', err);
      }
    }

    const initialLen = memoryPortfolio.length;
    memoryPortfolio = memoryPortfolio.filter((p) => p._id !== id && p.id !== id);
    return memoryPortfolio.length < initialLen;
  }
}
