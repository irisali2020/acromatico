'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ArrowLeft,
  X,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Ruler,
  Building,
  Layers,
} from 'lucide-react';
import { gsap } from 'gsap';

interface RealProjectLocation {
  id: string;
  name: string;
  municipality: string;
  x: number; // Porcentaje SVG X
  y: number; // Porcentaje SVG Y
  title: string;
  category: string;
  m2: string;
  year: string;
  approvalStatus: string;
  image: string;
  description: string;
  tags: string[];
}

export const CoverageMapSection = () => {
  // Ninguna card abierta por defecto (requisito explícito del usuario)
  const [selectedProject, setSelectedProject] = useState<RealProjectLocation | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<RealProjectLocation | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Proyectos 100% REALES de la web oficial acromaticoestudio.com
  const realProjects: RealProjectLocation[] = [
    {
      id: 'ss-108',
      name: 'Pilar / Escobar · San Sebastián',
      municipality: 'Pilar / Escobar',
      x: 30,
      y: 35,
      title: 'UF San Sebastián A01 L108',
      category: 'Vivienda Unifamiliar',
      m2: '240 m² Cubiertos + 45 m² Galería',
      year: '2024 - 2025',
      approvalStatus: 'Plano Aprobado Obras Particulares & CAPBA D4',
      image:
        'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000094-135791357b/700/UF%20SS%20A01%20L108%20-%20Render%20v02%2001-0.jpeg',
      description:
        'Vivienda unifamiliar de arquitectura contemporánea pura. Volumetría en hormigón visto, amplios paños vidriados con DVH y galería con parrilla orientada hacia el asoleamiento óptimo.',
      tags: ['Hormigón Visto', 'Doble Altura', 'Piscina', 'Plano Aprobado'],
    },
    {
      id: 'lagoon-038',
      name: 'Pilar · Lagoon Pilar',
      municipality: 'Pilar',
      x: 22,
      y: 48,
      title: 'UF Lagoon Pilar L038',
      category: 'Vivienda Unifamiliar',
      m2: '310 m² Cubiertos + 60 m² Semicubiertos',
      year: '2024 - 2025',
      approvalStatus: 'Proyecto Ejecutivo & Trámite Municipal Pilar',
      image:
        'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000490-ba995ba997/700/UF%20Lagoon%20L038%20-%20Fotos%20%2836%29-3.jpeg',
      description:
        'Residencia implantada frente al espejo de agua de la laguna cristalina. Planta libre apaisada, suites privadas en planta alta y terraza mirador con remate arquitectónico.',
      tags: ['Frente a Laguna', 'Master Suite', 'Cava Subterránea', 'Ejecutivo'],
    },
    {
      id: 'ss-188',
      name: 'Pilar · San Sebastián Área 06',
      municipality: 'Pilar',
      x: 36,
      y: 45,
      title: 'UF San Sebastián A06 L188 (Interiores)',
      category: 'Arquitectura Interior & Mobiliario',
      m2: '160 m² Interiores & Mobiliario a Medida',
      year: '2024',
      approvalStatus: 'Obra Finalizada & Equipamiento Colocado',
      image:
        'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000501-b063cb063e/700/UF%20SS%20A06%20L188%20-%20Fotos%20%281%29-9.jpeg',
      description:
        'Diseño y fabricación de equipamiento interior a medida. Cocina con isla monolítica, muebles de piso a techo sin tiradores visibles, detalles en madera noble y perfiles de iluminación rasante.',
      tags: ['Mobiliario a Medida', 'Isla Cocina', 'Perfiles LED', 'Finalizado'],
    },
    {
      id: 'cvc-340',
      name: 'Tigre · Club de Campo CVC',
      municipality: 'Tigre',
      x: 54,
      y: 44,
      title: 'UF CVC L340',
      category: 'Vivienda Unifamiliar',
      m2: '210 m² Cubiertos',
      year: '2024',
      approvalStatus: 'Aprobación Municipal Tigre Obras Particulares',
      image:
        'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000076-116c3116c5/700/UF%20CVC%20L340%20-%20R02%20-%20Render%2003-9.jpeg',
      description:
        'Proyecto racionalista en lote central. Retiros reglamentarios ajustados a la normativa interna del barrio privado, núcleo húmedo central y fluidez entre interior y jardín posterior.',
      tags: ['Racionalismo', 'Galería Cubierta', 'Aprobación Tigre'],
    },
    {
      id: 'gas-si',
      name: 'San Isidro · Bajo de San Isidro',
      municipality: 'San Isidro',
      x: 68,
      y: 62,
      title: 'Café & Bistro Monocromo',
      category: 'Espacio Gastronómico Comercial',
      m2: '135 m² Gastronomía',
      year: '2025',
      approvalStatus: 'Plano Único San Isidro & Habilitación Comercial',
      image:
        'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000451-3a3383a33a/700/UF%20SS%20A02%20L148%20-%20Fotos%20%288%29-8.jpeg',
      description:
        'Espacio gastronómico con barra monolítica de terrazo gris y microcemento. Habilitación comercial y cálculo de capacidad para 48 comensales con extracción forzada a los 4 vientos.',
      tags: ['Gastronomía', 'Barra Monolítica', 'Habilitación Comercial'],
    },
    {
      id: 'corp-vl',
      name: 'Vicente López · Av. del Libertador',
      municipality: 'Vicente López',
      x: 79,
      y: 77,
      title: 'Piso Corporativo Libertador',
      category: 'Oficinas & Espacio Corporativo',
      m2: '180 m² Corporativo',
      year: '2024 - 2025',
      approvalStatus: 'Habilitación Municipal Vicente López',
      image:
        'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000518-251f3251f5/700/UF%20SS%20A06%20L243%20-%20Fotos%20%281%29-7.jpeg',
      description:
        'Arquitectura interior para estudio profesional. Puestos operativos modulares, tabiquería vidriada con marco negro, cielorraso fonoabsorbente y diseño de iluminación lineal 3000K.',
      tags: ['Oficinas', 'Vidrio y Acero', 'Cableado Oculto', 'En Obra'],
    },
  ];

  // Efecto de trazado SVG de líneas
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && svgRef.current) {
          const paths = svgRef.current.querySelectorAll('.trace-path');
          paths.forEach((p) => {
            (p as SVGPathElement).style.strokeDasharray = '1000';
          });
          gsap.fromTo(
            paths,
            { strokeDashoffset: 1000 },
            {
              strokeDashoffset: 0,
              duration: 2.0,
              stagger: 0.1,
              ease: 'power2.out',
            }
          );
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animación suave al abrir card
  useEffect(() => {
    if (selectedProject && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [selectedProject]);

  return (
    <section
      ref={sectionRef}
      id="cobertura"
      className="py-24 border-t border-neutral-900 bg-neutral-950 relative"
    >
      {/* Blueprint grid sutil de fondo */}
      <div className="absolute inset-0 architectural-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Área de Cobertura & Trámites Municipales</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase">
              Obras Reales en <span className="font-semibold text-[#121212] dark:text-neutral-200 title-accent-dark">Zona Norte</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-light leading-relaxed">
            Gestión documental, visados CAPBA y dirección técnica en Pilar, Tigre, San Isidro,
            Vicente López y Escobar. Haz clic en los puntos verdes para explorar los proyectos reales del estudio.
          </p>
        </div>

        {/* CONTENEDOR DEL MAPA (SIN overflow-hidden que corte las cards) */}
        <div className="relative bg-neutral-900/40 border border-neutral-800 p-4 sm:p-8 shadow-2xl">
          {/* Barra superior de instrucciones */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                {selectedProject ? (
                  <>
                    <span className="text-neutral-500 mr-1.5">Proyecto Seleccionado:</span>
                    <span className="text-white font-medium text-sm tracking-wide">{selectedProject.title}</span>
                  </>
                ) : (
                  'Toca un punto verde para ver la ficha del proyecto'
                )}
              </span>
            </div>

            {selectedProject && (
              <button
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase font-bold transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#262626]" />
                <span>Volver al Mapa</span>
              </button>
            )}
          </div>

          {/* VISTA A: MAPA VECTORIAL SVG TRANSPARENTE CON TRAZO BLANCO */}
          <div className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[500px] flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 1000 600"
              className="w-full h-full select-none"
              style={{ background: 'transparent' }}
            >
              <defs>
                <pattern id="deltaWavePattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 0,10 Q 5,5 10,10 T 20,10"
                    fill="none"
                    className="map-sub"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              {/* Costa del Río de la Plata y Delta */}
              <path
                d="M 350,20 Q 420,120 520,160 T 680,260 T 840,420 T 980,540 L 1000,600 L 1000,0 L 350,0 Z"
                fill="url(#deltaWavePattern)"
                className="opacity-40"
              />
              <path
                d="M 350,20 Q 420,120 520,160 T 680,260 T 840,420 T 980,540"
                fill="none"
                className="map-branch trace-path"
                strokeWidth="1.8"
              />

              {/* Islas del Delta */}
              <path
                d="M 450,40 Q 480,90 530,70 T 500,120"
                fill="none"
                className="map-sub trace-path"
                strokeWidth="1"
              />
              <path
                d="M 520,110 Q 580,140 600,100"
                fill="none"
                className="map-sub trace-path"
                strokeWidth="1"
              />

              {/* Red Troncal Panamericana Acceso Norte */}
              <path
                d="M 850,580 L 760,460 L 680,360 L 580,280 L 460,220"
                fill="none"
                className="map-artery trace-path"
                strokeWidth="2.2"
              />

              {/* Ramal Tigre */}
              <path
                d="M 680,360 Q 640,300 540,240 L 510,210"
                fill="none"
                className="map-branch trace-path"
                strokeWidth="1.6"
              />

              {/* Ramal Pilar */}
              <path
                d="M 580,280 Q 440,260 300,240 L 160,240"
                fill="none"
                className="map-artery trace-path"
                strokeWidth="2"
              />

              {/* Ramal Escobar / Campana */}
              <path
                d="M 580,280 Q 480,190 400,120 L 320,60"
                fill="none"
                className="map-branch trace-path"
                strokeWidth="1.8"
              />

              {/* Rutas Secundarias */}
              <path
                d="M 540,240 Q 420,220 380,180"
                fill="none"
                className="map-sub trace-path"
                strokeWidth="1"
              />
              <path
                d="M 300,240 Q 320,180 380,120"
                fill="none"
                className="map-sub trace-path"
                strokeWidth="1"
              />

              {/* Límites Municipales Discretos */}
              <path
                d="M 220,160 Q 340,320 280,440"
                fill="none"
                className="map-boundary"
                strokeWidth="1"
                strokeDasharray="4,6"
              />
              <path
                d="M 460,80 Q 480,260 480,380"
                fill="none"
                className="map-boundary"
                strokeWidth="1"
                strokeDasharray="4,6"
              />
              <path
                d="M 640,160 Q 660,340 680,480"
                fill="none"
                className="map-boundary"
                strokeWidth="1"
                strokeDasharray="4,6"
              />

              {/* Rótulos Geográficos - Reubicados para no colisionar con los puntos interactivos */}
              <text x="160" y="215" className="map-text-label" fontSize="11" fontFamily="monospace" letterSpacing="3">
                PILAR
              </text>
              <text x="320" y="75" className="map-text-label" fontSize="11" fontFamily="monospace" letterSpacing="3">
                ESCOBAR
              </text>
              <text x="485" y="195" className="map-text-label" fontSize="11" fontFamily="monospace" letterSpacing="3">
                TIGRE
              </text>
              <text x="560" y="430" className="map-text-label" fontSize="11" fontFamily="monospace" letterSpacing="3">
                SAN ISIDRO
              </text>
              <text x="670" y="535" className="map-text-label" fontSize="11" fontFamily="monospace" letterSpacing="3">
                VICENTE LÓPEZ
              </text>
              <text x="780" y="300" className="map-text-label" fontSize="11" fontFamily="monospace" letterSpacing="4">
                RÍO DE LA PLATA
              </text>
            </svg>

            {/* PUNTOS VERDES ESMERALDA INTERACTIVOS */}
            {realProjects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              const isHovered = hoveredPoint?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  style={{ left: `${proj.x}%`, top: `${proj.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
                  onClick={() => setSelectedProject(proj)}
                  onMouseEnter={() => setHoveredPoint(proj)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div className="relative flex items-center justify-center w-10 h-10 group">
                    {/* Anillo Pulsante Radar */}
                    <span className="absolute w-7 h-7 rounded-full bg-emerald-400 opacity-60 animate-ping pointer-events-none" />

                    {/* Halo de Resplandor Verde */}
                    <span className="absolute w-5 h-5 rounded-full bg-emerald-400/40 blur-xs transition-transform group-hover:scale-150" />

                    {/* Punto Central Verde Esmeralda */}
                    <span
                      className={`relative block w-3.5 h-3.5 rounded-full bg-emerald-400 transition-all duration-300 shadow-[0_0_14px_rgba(200,168,130,0.9)] ${
                        isSelected ? 'scale-150 ring-2 ring-white' : 'group-hover:scale-125'
                      }`}
                    />

                    {/* Tooltip sutil en hover (si no hay card abierta) */}
                    {!selectedProject && isHovered && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-neutral-950/95 border border-neutral-700 px-3 py-1.5 whitespace-nowrap z-40 pointer-events-none shadow-xl">
                        <span className="text-[10px] font-mono text-white font-medium block">
                          {proj.title}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 block">
                          {proj.municipality} · Clic para abrir ficha
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* VISTA B: CARD COMPLETA AL HACER CLICK */}
            {selectedProject && (
              <div
                ref={cardRef}
                className="absolute inset-0 z-40 bg-neutral-950/90 backdrop-blur-md map-detail-card p-4 sm:p-8 flex flex-col justify-between overflow-y-auto"
              >
                {/* Contenido Principal de la Obra Real */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-4">
                  {/* Foto Real de la Obra en Alta Definición y Color Pleno */}
                  <div className="relative aspect-[16/10] overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-950/90 border border-neutral-800 text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                      {selectedProject.category}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-neutral-950/90 border border-neutral-800 text-[10px] font-mono uppercase text-white tracking-wider">
                      {selectedProject.year}
                    </div>
                  </div>

                  {/* Datos Técnicos y Normativa de la Obra */}
                  <div className="flex flex-col justify-between space-y-4 text-left">
                    <div>
                      {/* Ubicación y Zona */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium">
                          {selectedProject.name}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 font-light leading-relaxed mb-4">
                        {selectedProject.description}
                      </p>

                      <div className="space-y-2 border-t border-neutral-800/80 pt-4 text-xs font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500 uppercase">Superficie:</span>
                          <span className="text-white font-medium">{selectedProject.m2}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500 uppercase">Estado Normativo:</span>
                          <span className="text-emerald-400 font-medium text-right">
                            {selectedProject.approvalStatus}
                          </span>
                        </div>
                      </div>

                      {/* Tags de Materialidad */}
                      <div className="flex flex-wrap gap-1.5 pt-4">
                        {selectedProject.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] font-mono uppercase text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
                      <a
                        href="#recorrido"
                        className="px-6 py-2.5 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase font-bold transition-colors cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(200,168,130,0.3)]"
                      >
                        Pedir Cotización →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-500 text-center pt-2 border-t border-neutral-900">
                  Acromático Estudio · Proyecto documentado bajo normativa municipal de Zona Norte
                </div>
              </div>
            )}
          </div>

          {/* Selector de Proyectos Reales Abajo del Mapa */}
          <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono uppercase text-neutral-400 mr-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Obras Reales:</span>
            </span>
            {realProjects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProject(selectedProject?.id === proj.id ? null : proj)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                  selectedProject?.id === proj.id
                    ? 'border-emerald-400 bg-neutral-900 text-white shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                    : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:text-white hover:border-neutral-600'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5" />
                {proj.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
