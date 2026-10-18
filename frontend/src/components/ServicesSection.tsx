'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Home,
  FileCheck,
  Layers,
  Building2,
  UtensilsCrossed,
  Compass,
  Briefcase,
  Wrench,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { gsap } from 'gsap';
import { api } from '@/lib/api';

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  FileCheck,
  Layers,
  Building2,
  UtensilsCrossed,
  Compass,
  Briefcase,
  Wrench,
  Sparkles,
  ShieldCheck,
};

const DEFAULT_SERVICES = [
  {
    id: 'residencial',
    icon: 'Home',
    num: '01',
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
  },
  {
    id: 'municipal',
    icon: 'FileCheck',
    num: '02',
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
  },
  {
    id: 'interiores',
    icon: 'Layers',
    num: '03',
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
  },
  {
    id: 'corporativo',
    icon: 'Building2',
    num: '04',
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
  },
  {
    id: 'gastronomia',
    icon: 'UtensilsCrossed',
    num: '05',
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
  },
];

export const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);

  // Sincronización en tiempo real con los servicios publicados en el Admin
  useEffect(() => {
    api
      .getServices()
      .then((res) => {
        if (res.success && res.services && res.services.length > 0) {
          const visibleOnly = res.services.filter((s: any) => s.isVisible !== false);
          setServices(visibleOnly);
        }
      })
      .catch((err) => {
        console.warn('[ServicesSection] Usando servicios locales:', err);
      });
  }, []);

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
                stagger: 0.1,
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
  }, [services]);

  const handleSelectService = (serviceId: string) => {
    const serviceMap: Record<string, string> = {
      residencial: 'obra_nueva',
      municipal: 'regularizacion',
      interiores: 'interior_mobiliario',
      corporativo: 'oficinas',
      gastronomia: 'gastronomia',
    };
    const mapped = serviceMap[serviceId] || 'obra_nueva';

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('acromatico:select-service', {
          detail: { serviceType: mapped },
        })
      );
      const wizardEl = document.getElementById('recorrido');
      if (wizardEl) {
        wizardEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={sectionRef} id="servicios" className="py-24 border-t border-neutral-900 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
              <span className="w-8 h-px bg-neutral-500"></span>
              <span>Áreas de Especialización</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white uppercase">
              Servicios <span className="font-semibold text-neutral-200">Arquitectónicos</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md leading-relaxed font-light">
            Un método riguroso que une el trazo creativo con la ingeniería documental y el rigor de
            gestión en Zona Norte Buenos Aires.
          </p>
        </div>

        {/* Services Grid sincronizada */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon =
              typeof item.icon === 'string'
                ? ICON_MAP[item.icon] || Home
                : item.icon || Home;

            return (
              <div
                key={item._id || item.id}
                onClick={() => handleSelectService(item.id)}
                className="group p-8 bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-500 transition-all duration-300 hover:-translate-y-1.5 transform-gpu flex flex-col justify-between relative overflow-hidden cursor-pointer"
              >
                {/* Accent top line on hover con el color champagne #c8a882 */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-neutral-400 tracking-wider">
                      [{item.num}]
                    </span>
                    {item.badge && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase tracking-widest font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{item.badge}</span>
                      </span>
                    )}
                  </div>

                  <div className="w-10 h-10 border border-neutral-700 group-hover:border-emerald-400 bg-neutral-950 flex items-center justify-center mb-5 text-emerald-400 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-medium text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <h4 className="text-xs font-mono text-neutral-400 mb-4 tracking-normal">
                    {item.subtitle}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-light">
                    {item.desc}
                  </p>

                  <div className="space-y-2 mb-8 pt-4 border-t border-neutral-800/80">
                    {item.features?.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectService(item.id);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300 group-hover:text-white group-hover:translate-x-1.5 transition-all text-left"
                  >
                    <span>Cotizar Proyecto</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
