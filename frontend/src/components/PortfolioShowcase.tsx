'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Maximize2,
  MapPin,
  Ruler,
  Check,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { gsap } from 'gsap';
import { api } from '@/lib/api';

export const PortfolioShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'vivienda' | 'interior' | 'comercial'>('todos');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

const DEFAULT_PROJECTS = [
    {
      id: 'ss-108',
      category: 'vivienda',
      title: 'UF San Sebastián A01 L108',
      location: 'Pilar / Escobar · Barrio San Sebastián',
      municipality: 'Pilar / Escobar',
      m2: '240 m² Cubiertos + 45 m² Galería',
      year: '2024 - 2025',
      image: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000094-135791357b/700/UF%20SS%20A01%20L108%20-%20Render%20v02%2001-0.jpeg',
      description: 'Vivienda unifamiliar de arquitectura contemporánea pura. Volumetría en hormigón visto, amplios paños vidriados con DVH y galería con parrilla orientada hacia el asoleamiento óptimo.',
      approval: 'Plano Aprobado Obras Particulares & CAPBA D4',
      highlights: [
        'Hormigón visto fenólico con buñas milimétricas',
        'Doble altura en área social con visuales al parque',
        'Piscina sinfín con solárium atérmico',
        'Alineación solar bioclimática noroeste',
      ],
      tags: ['Hormigón Visto', 'Doble Altura', 'Piscina', 'Plano Aprobado'],
    },
    {
      id: 'lagoon-038',
      category: 'vivienda',
      title: 'UF Lagoon Pilar L038',
      location: 'Pilar · Barrio Cerrado Lagoon',
      municipality: 'Pilar',
      m2: '310 m² Cubiertos + 60 m² Semicubiertos',
      year: '2024 - 2025',
      image: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000490-ba995ba997/700/UF%20Lagoon%20L038%20-%20Fotos%20%2836%29-3.jpeg',
      description: 'Residencia implantada frente al espejo de agua de la laguna cristalina. Planta libre apaisada, suites privadas en planta alta y terraza mirador con remate arquitectónico.',
      approval: 'Proyecto Ejecutivo & Permiso de Obra Pilar',
      highlights: [
        'Implantación en lote preferencial sobre espejo de agua',
        'Master Suite con vestidor pasante y baño compartimentado',
        'Cava subterránea para guarda de vinos',
        'Terraza panorámica con baranda de vidrio templado',
      ],
      tags: ['Frente a Laguna', 'Master Suite', 'Cava Subterránea', 'Ejecutivo'],
    },
    {
      id: 'ss-188',
      category: 'interior',
      title: 'UF San Sebastián A06 L188 (Interiores)',
      location: 'Pilar · San Sebastián Área 06',
      municipality: 'Pilar',
      m2: '160 m² Interiores & Mobiliario de Autor',
      year: '2024',
      image: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000501-b063cb063e/700/UF%20SS%20A06%20L188%20-%20Fotos%20%281%29-9.jpeg',
      description: 'Diseño y fabricación de equipamiento interior a medida. Cocina con isla monolítica, muebles de piso a techo sin tiradores visibles, detalles en madera noble y perfiles de iluminación rasante.',
      approval: 'Obra Finalizada & Equipamiento Instalado',
      highlights: [
        'Isla central monolítica en microcemento texturado',
        'Muebles de guardado de piso a techo con apertura push',
        'Perfiles de iluminación indirecta LED cálida 3000K',
        'Terminaciones en enchapado de paraíso seleccionado',
      ],
      tags: ['Mobiliario a Medida', 'Isla Cocina', 'Perfiles LED', 'Finalizado'],
    },
    {
      id: 'cvc-340',
      category: 'vivienda',
      title: 'UF CVC L340',
      location: 'Tigre · Club de Campo CVC',
      municipality: 'Tigre',
      m2: '210 m² Cubiertos',
      year: '2024',
      image: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000076-116c3116c5/700/UF%20CVC%20L340%20-%20R02%20-%20Render%2003-9.jpeg',
      description: 'Proyecto racionalista en lote central. Retiros reglamentarios ajustados a la normativa interna del barrio privado, núcleo húmedo central y fluidez entre interior y jardín posterior.',
      approval: 'Aprobación Municipal Tigre Obras Particulares',
      highlights: [
        'Racionalismo constructivo de bajo mantenimiento',
        'Galería cubierta integrada al estar-comedor',
        'Estudio de asoleamiento para retención térmica invernal',
        'Presentación digital de expediente Tigre aprobada',
      ],
      tags: ['Racionalismo', 'Galería Cubierta', 'Aprobación Tigre'],
    },
    {
      id: 'corp-vl',
      category: 'comercial',
      title: 'Piso Corporativo Libertador',
      location: 'Vicente López · Av. del Libertador',
      municipality: 'Vicente López',
      m2: '180 m² Corporativo',
      year: '2024 - 2025',
      image: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000518-251f3251f5/700/UF%20SS%20A06%20L243%20-%20Fotos%20%281%29-7.jpeg',
      description: 'Arquitectura interior para estudio profesional. Puestos operativos modulares, tabiquería vidriada con marco negro, cielorraso fonoabsorbente y diseño de iluminación lineal 3000K.',
      approval: 'Habilitación Comercial Vicente López',
      highlights: [
        'Tabiquería acústica de doble vidrio con perfilería de aluminio negro',
        'Puestos de trabajo modulares con conectividad oculta',
        'Sala de conferencias equipada con absorción acústica',
        'Acceso biométrico e iluminación inteligente programable',
      ],
      tags: ['Oficinas', 'Vidrio y Acero', 'Cableado Oculto', 'En Obra'],
    },
    {
      id: 'gas-si',
      category: 'comercial',
      title: 'Café & Bistro Monocromo',
      location: 'San Isidro · Bajo de San Isidro',
      municipality: 'San Isidro',
      m2: '135 m² Gastronomía',
      year: '2025',
      image: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000451-3a3383a33a/700/UF%20SS%20A02%20L148%20-%20Fotos%20%288%29-8.jpeg',
      description: 'Espacio gastronómico con barra monolítica de terrazo gris y microcemento. Habilitación comercial y cálculo de capacidad para 48 comensales con extracción forzada a los 4 vientos.',
      approval: 'Plano Único San Isidro & Habilitación Comercial',
      highlights: [
        'Barra principal continua en terrazo y hierro macizo',
        'Capacidad calculada para 48 cubiertos y rotación de clientes',
        'Sistema de extracción técnica a los 4 vientos bajo norma',
        'Baños reglamentarios accesibles y plano de evacuación',
      ],
      tags: ['Gastronomía', 'Barra Monolítica', 'Habilitación Comercial'],
    },
  ];

  const [projects, setProjects] = useState<any[]>(DEFAULT_PROJECTS);

  // Carga dinámica de proyectos sincronizados con el panel de administración
  useEffect(() => {
    api
      .getPortfolio()
      .then((res) => {
        if (res.success && res.projects && res.projects.length > 0) {
          const visibleOnly = res.projects.filter((p: any) => p.isVisible !== false);
          setProjects(visibleOnly);
        }
      })
      .catch((err) => {
        console.warn('[PortfolioShowcase] Usando proyectos locales:', err);
      });
  }, []);

  // Entrada por scroll visible en viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

          if (headerRef.current) {
            tl.fromTo(
              headerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6 }
            );
          }

          if (gridRef.current) {
            tl.fromTo(
              gridRef.current.children,
              { opacity: 0, y: 45 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.12,
                clearProps: 'transform',
              },
              '-=0.35'
            );
          }

          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animación del modal de detalle
  useEffect(() => {
    if (selectedProject && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }, [selectedProject]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = projects.filter((p) => {
    if (p.isVisible === false) return false;
    if (activeCategory === 'todos') return true;
    return p.category === activeCategory;
  });

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      className="py-24 border-t border-neutral-900 bg-neutral-950/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
              <span className="w-8 h-px bg-neutral-500"></span>
              <span>Obras & Anteproyectos</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white uppercase">
              Proyectos <span className="font-semibold text-neutral-200">Seleccionados</span>
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-neutral-900 border border-neutral-800 text-xs font-mono uppercase tracking-wider">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                activeCategory === 'todos' ? 'bg-[#c8a882] text-[#262626] font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todos ({projects.length})
            </button>
            <button
              onClick={() => setActiveCategory('vivienda')}
              className={`px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                activeCategory === 'vivienda' ? 'bg-[#c8a882] text-[#262626] font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Viviendas
            </button>
            <button
              onClick={() => setActiveCategory('interior')}
              className={`px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                activeCategory === 'interior' ? 'bg-[#c8a882] text-[#262626] font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interiores
            </button>
            <button
              onClick={() => setActiveCategory('comercial')}
              className={`px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                activeCategory === 'comercial' ? 'bg-[#c8a882] text-[#262626] font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Oficinas / Gastronomía
            </button>
          </div>
        </div>

        {/* Projects Grid optimizado para rendimiento fluido */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 will-change-transform"
        >
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group bg-neutral-900/30 border border-neutral-800/80 hover:border-emerald-400/80 transition-all duration-300 transform-gpu hover:-translate-y-1.5 flex flex-col overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(52,211,153,0.15)] relative"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-sm border border-neutral-800 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-300">
                  {proj.year}
                </div>
                {/* Badge flotante verde para invitar al clic */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-950/90 border border-emerald-400/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-3 h-3" />
                  <span>Ver Ficha</span>
                </div>
              </div>

              {/* Info Frame */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono mb-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{proj.location}</span>
                  </div>

                  <h3 className="text-base font-medium text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {proj.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 mb-3">
                    <Ruler className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{proj.m2}</span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed font-light mb-4 line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
                  {proj.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POP-UP MODAL TRASLÚCIDO SEMIGLASS CON DETALLES DE LA OBRA */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md project-modal-backdrop animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 project-modal-panel shadow-2xl max-h-[90vh] overflow-y-auto relative flex flex-col"
          >
            {/* Header del Pop-up */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70 project-modal-header sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium">
                  {selectedProject.location}
                </span>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido en 2 Columnas */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna Izquierda: Imagen + Badges */}
              <div className="space-y-4">
                <div className="relative aspect-[16/11] overflow-hidden border border-neutral-800 bg-neutral-950 shadow-xl">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-950/90 border border-neutral-800 text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                    {selectedProject.year}
                  </div>
                </div>

                {/* Tags de Materialidad */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-[10px] font-mono uppercase text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Columna Derecha: Detalles Arquitectónicos y CTA */}
              <div className="flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-light text-white uppercase tracking-tight mb-2">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Tabla de Ficha Técnica */}
                  <div className="border-t border-neutral-800/80 pt-4 space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 uppercase">Superficie Total:</span>
                      <span className="text-white font-medium">{selectedProject.m2}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 uppercase">Zona / Municipio:</span>
                      <span className="text-neutral-200 font-medium">{selectedProject.municipality}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 uppercase">Estado Normativo:</span>
                      <span className="text-emerald-400 font-medium text-right">
                        {selectedProject.approval}
                      </span>
                    </div>
                  </div>

                  {/* Aspectos Destacados de la Obra */}
                  <div className="border-t border-neutral-800/80 pt-4 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                      Particularidades del Proyecto:
                    </span>
                    {selectedProject.highlights.map((h: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones & CTA hacia Cotización en tono arena #c8a882 con texto gris */}
                <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="#recorrido"
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase font-bold transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,168,130,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span className="whitespace-nowrap">Pedir Cotización</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#262626] shrink-0" />
                  </a>

                  <a
                    href={`https://wa.me/5491158249912?text=${encodeURIComponent(
                      `Hola Acromático Estudio, vi la obra "${selectedProject.title}" en la web y me gustaría consultar por un proyecto similar en ${selectedProject.municipality}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3.5 border border-emerald-400/50 bg-emerald-950/20 text-emerald-300 hover:text-white hover:bg-emerald-900/40 font-mono text-xs uppercase tracking-wider transition-colors text-center cursor-pointer"
                  >
                    Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Pie del modal */}
            <div className="px-6 py-3 border-t border-neutral-800/80 bg-neutral-950 project-modal-footer text-[10px] font-mono text-neutral-500 text-center">
              Acromático Estudio · Arquitectura de Autor y Gestión Municipal en Zona Norte Buenos Aires
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
