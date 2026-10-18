'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ServicesSection } from '@/components/ServicesSection';
import { PortfolioShowcase } from '@/components/PortfolioShowcase';
import { MethodologySection } from '@/components/MethodologySection';
import { CoverageMapSection } from '@/components/CoverageMapSection';
import { ProjectWizard } from '@/components/ProjectWizard';
import { Footer } from '@/components/Footer';
import { ArrowDown, ArrowUpRight, Compass, Search, CheckCircle2, ShieldCheck, Ruler, Building, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

export default function Home() {
  const [typedTitle, setTypedTitle] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);
  const heroCtasRef = useRef<HTMLDivElement>(null);
  const heroMetricsRef = useRef<HTMLDivElement>(null);

  // Efecto máquina de escribir (Typewriter) para "ACROMÁTICO ESTUDIO"
  useEffect(() => {
    const fullText = 'ACROMÁTICO ESTUDIO';
    let currentIndex = 0;

    // Pequeño retardo inicial para elegancia
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedTitle(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTypingComplete(true);
        }
      }, 130); // Velocidad pausada y elegante (130ms por letra)

      return () => clearInterval(interval);
    }, 350);

    return () => clearTimeout(startTimeout);
  }, []);

  // Animación delicada y fluida con GSAP para el badge inicial
  useEffect(() => {
    if (heroBadgeRef.current) {
      gsap.fromTo(
        heroBadgeRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, []);

  // Cuando termina de escribir el título, se despliegan suavemente los subtítulos, CTAs y métricas SIN saltos bruscos
  useEffect(() => {
    if (typingComplete) {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (heroSubRef.current) {
        tl.to(heroSubRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
        });
      }

      if (heroCtasRef.current) {
        tl.to(
          heroCtasRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            clearProps: 'transform', // Limpia transform inline para que no interfiera con el hover
          },
          '-=0.25'
        );
      }

      if (heroMetricsRef.current) {
        tl.to(
          heroMetricsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            clearProps: 'transform',
          },
          '-=0.2'
        );
      }
    }
  }, [typingComplete]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-neutral-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden architectural-grid border-b border-neutral-900">
        {/* Subtle glow / gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c8a882]/18 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Top Tag Delicado con estilo idéntico a Línea de Tiempo Metódica */}
            <div
              ref={heroBadgeRef}
              className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zona Norte Buenos Aires · San Isidro · Tigre · Pilar · Vicente López · Escobar</span>
            </div>

            {/* Main Headline con Typewriter dinámico y cursor pulsante */}
            <div className="space-y-3">
              {/* Título en simulación de escritura en UNA SOLA LÍNEA ESTRICTA */}
              <h1 className="font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white inline-flex items-center justify-center whitespace-nowrap flex-nowrap leading-none select-none max-w-full">
                <span>{typedTitle}</span>
                {/* Cursor tipográfico arquitectónico */}
                <span className="inline-block w-1.5 sm:w-2 md:w-2.5 h-[0.75em] bg-white ml-2 sm:ml-3 align-baseline animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
              </h1>

              {/* Subtítulos en pura tipografía SANS SERIF arquitectónica */}
              <div
                ref={heroSubRef}
                className="space-y-2 pt-2 opacity-0 translate-y-3"
              >
                <h2 className="font-sans font-light text-xl sm:text-3xl lg:text-4xl tracking-tight text-neutral-200 uppercase">
                  Arquitectura de Autor desde el Boceto
                </h2>

                <p className="font-sans font-normal text-sm sm:text-lg lg:text-xl text-neutral-400 tracking-[0.06em] uppercase">
                  hasta la aprobación municipal definitiva
                </p>

                <p className="text-neutral-400 text-xs sm:text-base max-w-2xl mx-auto font-light leading-relaxed pt-3">
                  Desarrollamos proyectos integrales de <strong className="text-white font-medium">Viviendas Unifamiliares</strong>,{' '}
                  <strong className="text-white font-medium">Arquitectura de Interiores con Mobiliario a Medida</strong>,{' '}
                  <strong className="text-white font-medium">Oficinas Corporativas</strong> y{' '}
                  <strong className="text-white font-medium">Espacios Gastronómicos</strong>, resolviendo cada plano municipal
                  y visado colegial con precisión milimétrica.
                </p>
              </div>
            </div>

            {/* CTAs fluidos sin salto ni conflicto de transform */}
            <div
              ref={heroCtasRef}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 translate-y-3"
            >
              <a
                href="#recorrido"
                className="w-full sm:w-auto px-8 py-4 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(200,168,130,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Configurar Mi Proyecto en 6 Pasos</span>
                <ArrowUpRight className="w-4 h-4 text-[#262626]" />
              </a>

              <Link
                href="/seguimiento"
                className="w-full sm:w-auto px-8 py-4 border border-neutral-700 hover:border-neutral-400 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Seguimiento de Expediente & Obra</span>
              </Link>
            </div>

            {/* Quick Metrics ampliados y legibles sin cortes de texto */}
            <div
              ref={heroMetricsRef}
              className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto opacity-0 translate-y-3"
            >
              <div className="p-6 sm:p-7 bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-500 transition-colors flex flex-col justify-center items-center text-center min-h-[125px]">
                <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white block whitespace-nowrap">
                  100%
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 mt-2 block whitespace-nowrap">
                  Aprobación Municipal
                </span>
              </div>

              {/* CUADRO AMPLIADO: +1.200 m² 100% VISIBLE Y LEGIBLE */}
              <div className="p-6 sm:p-7 bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-500 transition-colors flex flex-col justify-center items-center text-center min-h-[125px]">
                <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white flex items-baseline justify-center gap-1.5 whitespace-nowrap">
                  <span>+1.200</span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-light text-neutral-300">m²</span>
                </div>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 mt-2 block whitespace-nowrap">
                  Proyectados en Obra
                </span>
              </div>

              <div className="p-6 sm:p-7 bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-500 transition-colors flex flex-col justify-center items-center text-center min-h-[125px]">
                <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white block whitespace-nowrap">
                  CAPBA D4
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 mt-2 block whitespace-nowrap">
                  Visados Colegiales
                </span>
              </div>

              <div className="p-6 sm:p-7 bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-500 transition-colors flex flex-col justify-center items-center text-center min-h-[125px]">
                <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white block whitespace-nowrap">
                  5 Fases
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 mt-2 block whitespace-nowrap">
                  Método Documentado
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Portfolio Showcase */}
      <PortfolioShowcase />

      {/* Methodology Section */}
      <MethodologySection />

      {/* Área de Cobertura & Trámites Municipales con Mapa SVG Trazado */}
      <CoverageMapSection />

      {/* Dynamic Project Wizard */}
      <ProjectWizard />

      <Footer />
    </div>
  );
}
