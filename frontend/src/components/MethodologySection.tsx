'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  FileCode2,
  Scale,
  ShieldCheck,
  HardHat,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { gsap } from 'gsap';

interface Step {
  step: string;
  tag: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  deliverable: string;
}

export const MethodologySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopLineRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeHover, setActiveHover] = useState<number | null>(null);

  const steps: Step[] = [
    {
      step: '01',
      tag: 'Normativa & Factibilidad',
      title: 'Factibilidad & Briefing',
      desc: 'Análisis minucioso de zonificación urbana municipal, índices FOS/FOT, retiros reglamentarios y código de edificación del barrio cerrado o municipio.',
      icon: Compass,
      deliverable: 'Informe Urbanístico & Programa',
    },
    {
      step: '02',
      tag: 'Diseño & Espacialidad',
      title: 'Anteproyecto & 3D',
      desc: 'Exploración volumétrica formal, plantas funcionales a escala, asoleamiento bioclimático y renders fotorrealistas de alta definición.',
      icon: FileCode2,
      deliverable: 'Modelado 3D & Renders 4K',
    },
    {
      step: '03',
      tag: 'Documentación Técnica',
      title: 'Proyecto Ejecutivo',
      desc: 'Planos de replanteo milimétrico, cálculo estructural (hormigón armado / metálico), ingeniería sanitaria, eléctrica y pliegos de especificaciones.',
      icon: Scale,
      deliverable: 'Legajo Técnico Completo',
    },
    {
      step: '04',
      tag: 'Gestión Legal CAPBA',
      title: 'Habilitación Municipal',
      desc: 'Ingreso formal en Obras Particulares del municipio correspondiente, liquidación arancelaria CAPBA D4, visados y obtención del permiso de obra.',
      icon: ShieldCheck,
      deliverable: 'Plano Aprobado & Permiso',
    },
    {
      step: '05',
      tag: 'Control en Territorio',
      title: 'Dirección de Obra',
      desc: 'Supervisión técnica rigurosa en el terreno, control de plomos y tolerancias constructivas, certificación de certificaciones y recepción final.',
      icon: HardHat,
      deliverable: 'Acta de Final de Obra',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

          // 1. Trazado de la Línea Verde Esmeralda (Horizontal en Desktop)
          if (desktopLineRef.current) {
            tl.fromTo(
              desktopLineRef.current,
              { scaleX: 0 },
              { scaleX: 1, duration: 1.4, transformOrigin: 'left center' }
            );
          }

          // 1.b Trazado de la Línea Verde Esmeralda (Vertical en Mobile)
          if (mobileLineRef.current) {
            tl.fromTo(
              mobileLineRef.current,
              { scaleY: 0 },
              { scaleY: 1, duration: 1.4, transformOrigin: 'top center' },
              '<'
            );
          }

          // 2. Aparición elástica de los nodos verdes en la línea de tiempo
          const validNodes = nodesRef.current.filter(Boolean);
          if (validNodes.length > 0) {
            tl.fromTo(
              validNodes,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.22,
                ease: 'back.out(2)',
              },
              '-=1.2'
            );
          }

          // 3. Aparición secuencial de las tarjetas de cada etapa
          const validCards = cardsRef.current.filter(Boolean);
          if (validCards.length > 0) {
            tl.fromTo(
              validCards,
              { y: 35, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.2,
                clearProps: 'transform',
              },
              '-=1.1'
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

  return (
    <section
      ref={sectionRef}
      id="metodologia"
      className="py-24 border-t border-neutral-900 bg-neutral-950 relative overflow-hidden"
    >
      {/* Blueprint grid sutil de fondo */}
      <div className="absolute inset-0 architectural-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3 px-3 py-1 bg-neutral-900 border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Línea de Tiempo Metódica · 5 Etapas</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase">
            El Método <span className="font-semibold text-[#121212] dark:text-neutral-200 title-accent-dark">Acromático</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-3 font-light leading-relaxed max-w-2xl mx-auto">
            Un proceso secuencial y documentado que elimina la incertidumbre, reduce tiempos y
            asegura que cada obra se ejecute exactamente según lo proyectado.
          </p>
        </div>

        {/* LÍNEA DE TIEMPO HORIZONTAL (DESKTOP / TABLET >= MD) */}
        <div className="hidden md:block mb-6 relative">
          {/* Pista base neutra */}
          <div className="absolute top-5 left-8 right-8 h-[2px] bg-neutral-800/80 -translate-y-1/2 z-0" />

          {/* Línea Verde Esmeralda Animada con Resplandor */}
          <div
            ref={desktopLineRef}
            className="absolute top-5 left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 -translate-y-1/2 z-10 shadow-[0_0_14px_rgba(200,168,130,0.9)] origin-left"
            style={{ transform: 'scaleX(0)' }}
          />

          {/* Marcadores / Nodos Interactivos sobre la Línea */}
          <div className="relative z-20 grid grid-cols-5 gap-4">
            {steps.map((s, idx) => {
              const isHovered = activeHover === idx;
              return (
                <div
                  key={`node-${idx}`}
                  ref={(el) => {
                    nodesRef.current[idx] = el;
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                  onMouseEnter={() => setActiveHover(idx)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {/* Nodo Circular con Resplandor Champagne */}
                  <div className="relative flex items-center justify-center w-10 h-10">
                    {/* Anillo de Pulso */}
                    <span
                      className={`absolute w-7 h-7 rounded-full bg-emerald-400/40 transition-all duration-300 ${
                        isHovered ? 'scale-150 opacity-100 animate-ping' : 'opacity-0 group-hover:opacity-60'
                      }`}
                    />

                    {/* Contenedor del Nodo */}
                    <div
                      className={`w-6 h-6 rounded-full bg-neutral-950 border-2 transition-all duration-300 flex items-center justify-center shadow-lg ${
                        isHovered
                          ? 'border-white scale-125 shadow-[0_0_16px_rgba(200,168,130,1)]'
                          : 'border-emerald-400 group-hover:border-white shadow-[0_0_8px_rgba(200,168,130,0.6)]'
                      }`}
                    >
                      {/* Punto Centro Verde Esmeralda */}
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Etiqueta de la Etapa sobre la línea */}
                  <span
                    className={`mt-2 font-mono text-[11px] tracking-widest uppercase transition-colors duration-200 ${
                      isHovered ? 'text-emerald-400 font-bold' : 'text-neutral-400 group-hover:text-white'
                    }`}
                  >
                    Etapa {s.step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TARJETAS DE LAS ETAPAS (DESKTOP EN GRILLA DE 5 COLUMNAS) */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isHovered = activeHover === idx;
            return (
              <div
                key={`card-${idx}`}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onMouseEnter={() => setActiveHover(idx)}
                onMouseLeave={() => setActiveHover(null)}
                className={`p-6 bg-neutral-900/40 border transition-all duration-300 flex flex-col justify-between group relative ${
                  isHovered
                    ? 'border-emerald-400/80 bg-neutral-900/80 -translate-y-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(52,211,153,0.15)]'
                    : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Borde sutil superior en verde cuando hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs px-2 py-0.5 bg-neutral-950 border border-neutral-800 text-emerald-400">
                      {s.step}
                    </span>
                    <Icon
                      className={`w-4 h-4 transition-colors duration-300 ${
                        isHovered ? 'text-emerald-400' : 'text-neutral-400 group-hover:text-neutral-200'
                      }`}
                    />
                  </div>

                  <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block mb-1.5">
                    {s.tag}
                  </span>

                  <h3 className="text-sm font-medium text-white mb-2.5 uppercase tracking-wide">
                    {s.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed font-light mb-4">
                    {s.desc}
                  </p>
                </div>

                {/* Entregable clave */}
                <div className="pt-3 border-t border-neutral-800/80 mt-auto">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Entregable Clave:
                  </span>
                  <span className="text-[11px] font-mono text-neutral-300 group-hover:text-white transition-colors block">
                    {s.deliverable}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* LÍNEA DE TIEMPO VERTICAL (MOBILE < MD) */}
        <div className="md:hidden relative pl-6">
          {/* Línea vertical neutra base */}
          <div className="absolute top-4 bottom-4 left-3 w-[2px] bg-neutral-800 -translate-x-1/2 z-0" />

          {/* Línea vertical champagne animada */}
          <div
            ref={mobileLineRef}
            className="absolute top-4 bottom-4 left-3 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-300 -translate-x-1/2 z-10 shadow-[0_0_12px_rgba(200,168,130,0.9)] origin-top"
            style={{ transform: 'scaleY(0)' }}
          />

          <div className="space-y-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={`mobile-step-${idx}`} className="relative pl-6">
                  {/* Nodo champagne posicionado en la línea vertical */}
                  <div className="absolute left-[-17px] top-4 z-20 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-neutral-950 border-2 border-emerald-400 shadow-[0_0_10px_rgba(200,168,130,0.9)] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </span>
                  </div>

                  {/* Tarjeta de la etapa */}
                  <div className="p-5 bg-neutral-900/50 border border-neutral-800 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                        Fase {s.step} · {s.tag}
                      </span>
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>

                    <h3 className="text-base font-medium text-white mb-2 uppercase">
                      {s.title}
                    </h3>

                    <p className="text-xs text-neutral-300 font-light leading-relaxed mb-3">
                      {s.desc}
                    </p>

                    <div className="pt-2 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{s.deliverable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
