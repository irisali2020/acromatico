'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Compass, Lock, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

export const Navbar = () => {
  const { isLight } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animación de apertura/cierre de menú móvil con rebote
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20, scaleY: 0.92, transformOrigin: 'top center' },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.45, ease: 'back.out(1.4)' }
      );
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isLight
            ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200/90 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : isLight
            ? 'bg-gradient-to-b from-white/95 via-white/80 to-transparent py-5 border-b border-transparent'
            : 'bg-gradient-to-b from-neutral-950/80 to-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side: Brand Logo Oficial + Links de Navegación Alineados a la Izquierda */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link
            href="/"
            className="flex items-center focus:outline-none shrink-0"
          >
            <div className="flex items-center py-1">
              <img
                src={isLight ? '/logo-acromatico-dark.png' : '/logo-acromatico.png'}
                alt="Acromático Estudio"
                className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-200"
              />
            </div>
          </Link>

          {/* Desktop Navigation - Alineada a la izquierda junto al logo */}
          <nav
            className={`hidden lg:flex items-center gap-7 text-xs font-mono uppercase tracking-widest ${
              isLight ? 'text-neutral-800' : 'text-neutral-400'
            }`}
          >
            <a
              href="/#servicios"
              className={`transition-colors py-1 hover:border-b-2 ${
                isLight
                  ? 'hover:text-black hover:border-black font-semibold'
                  : 'hover:text-white hover:border-white'
              }`}
            >
              Servicios
            </a>
            <a
              href="/#proyectos"
              className={`transition-colors py-1 hover:border-b-2 ${
                isLight
                  ? 'hover:text-black hover:border-black font-semibold'
                  : 'hover:text-white hover:border-white'
              }`}
            >
              Proyectos
            </a>
            <a
              href="/#metodologia"
              className={`transition-colors py-1 hover:border-b-2 ${
                isLight
                  ? 'hover:text-black hover:border-black font-semibold'
                  : 'hover:text-white hover:border-white'
              }`}
            >
              Metodología
            </a>
            <a
              href="/#cobertura"
              className={`transition-colors py-1 hover:border-b-2 ${
                isLight
                  ? 'hover:text-black hover:border-black font-semibold'
                  : 'hover:text-white hover:border-white'
              }`}
            >
              Cobertura
            </a>
            <Link
              href="/seguimiento"
              className={`transition-colors py-1 hover:border-b-2 ${
                isLight
                  ? 'text-neutral-800 hover:text-black hover:border-black font-semibold'
                  : 'text-neutral-300 hover:text-white hover:border-white'
              }`}
            >
              Seguimiento
            </Link>
            <Link
              href="/contacto"
              className={`transition-colors py-1 hover:border-b-2 ${
                isLight
                  ? 'text-neutral-800 hover:text-black hover:border-black font-semibold'
                  : 'text-neutral-300 hover:text-white hover:border-white'
              }`}
            >
              Contacto
            </Link>
          </nav>
        </div>

        {/* Right CTA / Admin Access + Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3.5">
          <ThemeToggle />

          <Link
            href="/admin"
            className={`text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 px-3.5 py-2 rounded border hover:scale-105 active:scale-95 ${
              isLight
                ? 'text-neutral-800 hover:text-black border-neutral-300 hover:border-neutral-500 bg-white/90 shadow-xs'
                : 'text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-600 bg-neutral-900/60'
            }`}
          >
            <Lock className={`w-3.5 h-3.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`} />
            <span>Acceso Estudio</span>
          </Link>

          <a
            href="#recorrido"
            className="text-xs font-mono uppercase tracking-wider font-bold bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] px-4 py-2 transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(200,168,130,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Iniciar Proyecto</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#262626]" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 border ${
            isLight
              ? 'text-neutral-800 hover:text-black border-neutral-300 bg-white shadow-xs'
              : 'text-neutral-300 hover:text-white border-neutral-800 bg-neutral-900'
          }`}
          aria-label="Alternar menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown con rebote elástico */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800 px-6 py-6 space-y-4 text-xs font-mono uppercase tracking-widest shadow-2xl"
        >
          <a
            href="#servicios"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-2 border-b border-neutral-900"
          >
            Servicios
          </a>
          <a
            href="#proyectos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-2 border-b border-neutral-900"
          >
            Proyectos
          </a>
          <a
            href="#metodologia"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-2 border-b border-neutral-900"
          >
            Metodología Zona Norte
          </a>
          <a
            href="#cobertura"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-2 border-b border-neutral-900"
          >
            Cobertura
          </a>
          <Link
            href="/seguimiento"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-2 border-b border-neutral-900"
          >
            Seguimiento
          </Link>
          <Link
            href="/contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-2 border-b border-neutral-900"
          >
            Contacto
          </Link>

          {/* Selector de Tema en Móvil */}
          <div className="flex items-center justify-between py-2.5 border-b border-neutral-900 text-neutral-300">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Modo de Vista</span>
            <ThemeToggle />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-4 text-center border border-neutral-700 text-neutral-300 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Acceso Estudio (Admin)
            </Link>
            <a
              href="#recorrido"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 text-center bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-bold shadow-[0_0_15px_rgba(200,168,130,0.3)]"
            >
              Iniciar Recorrido Interactivo
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
