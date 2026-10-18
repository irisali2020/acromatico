'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Home, Layers, Sparkles, ArrowUpRight, Search } from 'lucide-react';
import { gsap } from 'gsap';

export default function NotFound() {
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animación de trazado lineal SVG con GSAP similar al mapa
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('.trace-line');
      gsap.fromTo(
        paths,
        { strokeDashoffset: 600 },
        {
          strokeDashoffset: 0,
          duration: 2.4,
          stagger: 0.15,
          ease: 'power2.out',
        }
      );
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-neutral-950 flex flex-col justify-between architectural-grid relative overflow-hidden">
      {/* Navbar simplificada */}
      <header className="py-6 px-4 sm:px-8 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md relative z-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo-acromatico.png"
            alt="Acromático Estudio"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </Link>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10 my-auto">
        <div
          ref={contentRef}
          className="max-w-3xl w-full mx-auto text-center space-y-8 py-8"
        >
          {/* Badge de coordenadas */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Error 404 · Coordenada Fuera de Legajo</span>
          </div>

          {/* SVG Lineal Animado Arquitectónico */}
          <div className="w-full max-w-md mx-auto aspect-[16/9] relative flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 500 280"
              className="w-full h-full select-none"
              style={{ background: 'transparent' }}
            >
              <defs>
                <pattern id="grid404" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
                </pattern>
              </defs>

              <rect width="500" height="280" fill="url(#grid404)" />

              {/* Trazos de Croquis / Planta Isométrica Ficticia */}
              {/* Ejes perimetrales */}
              <rect
                x="60"
                y="40"
                width="380"
                height="200"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="600"
                className="trace-line"
              />

              {/* Retiro municipal punteado */}
              <rect
                x="85"
                y="65"
                width="330"
                height="150"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
                strokeDasharray="4,6"
              />

              {/* Líneas diagonales de corte arquitectónico */}
              <path
                d="M 60,40 L 440,240"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                strokeDasharray="600"
                className="trace-line"
              />
              <path
                d="M 60,240 L 440,40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                strokeDasharray="600"
                className="trace-line"
              />

              {/* Trazos volumétricos centrales */}
              <path
                d="M 140,80 L 360,80 L 360,200 L 140,200 Z"
                fill="rgba(255, 255, 255, 0.02)"
                stroke="rgba(52, 211, 153, 0.8)"
                strokeWidth="1.5"
                strokeDasharray="600"
                className="trace-line"
              />

              {/* Subdivisión de ambientes */}
              <path
                d="M 230,80 L 230,200 M 140,140 L 360,140"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="600"
                className="trace-line"
              />

              {/* Cotas lineales */}
              <path
                d="M 40,40 L 40,240 M 35,40 L 45,40 M 35,240 L 45,240"
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
                strokeDasharray="600"
                className="trace-line"
              />

              {/* Textos técnicos de plano */}
              <text x="18" y="145" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace" transform="rotate(-90 18 145)">
                LÍNEA MUNICIPAL
              </text>
              <text x="250" y="260" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace" textAnchor="middle">
                RETIRO DE FONDO · CAPBA D4
              </text>

              {/* Punto de extravío tono arena / champagne con radar */}
              <circle cx="230" cy="140" r="16" fill="rgba(200, 168, 130, 0.2)" />
              <circle cx="230" cy="140" r="5" fill="#c8a882" />
              <circle cx="230" cy="140" r="10" fill="none" stroke="#c8a882" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="5;22" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Mensaje Principal */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extralight tracking-tight uppercase text-white">
              404 <span className="text-neutral-500 font-light">·</span>{' '}
              <strong className="font-semibold text-neutral-100">Sin Replanteo</strong>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
              El documento, plano o sección que buscas no forma parte del legajo actual o ha sido
              reubicado bajo una nueva cota de nivel.
            </p>

            <p className="text-xs text-neutral-500 font-mono">
              Coordenada: [Zona Norte · Buenos Aires] · Te invitamos a continuar navegando:
            </p>
          </div>

          {/* CTAs para seguir navegando */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3.5 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(200,168,130,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#262626]" />
              <span>Volver a la Portada</span>
            </Link>

            <Link
              href="/#proyectos"
              className="px-6 py-3.5 border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Explorar Obras Reales</span>
            </Link>

            <Link
              href="/#recorrido"
              className="px-6 py-3.5 border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Iniciar Proyecto</span>
            </Link>

            <Link
              href="/contacto"
              className="px-6 py-3.5 border border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Contacto Directo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer simplificado */}
      <footer className="py-6 px-4 sm:px-8 border-t border-neutral-900 bg-neutral-950/80 text-center text-xs font-mono text-neutral-500 relative z-20">
        Acromático Estudio · Arquitectura & Gestión Municipal en Zona Norte Buenos Aires
      </footer>
    </div>
  );
}
