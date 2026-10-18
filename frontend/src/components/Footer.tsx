'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ShieldCheck, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Columna 1: Identidad */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-neutral-700 bg-neutral-900 flex items-center justify-center font-mono text-xs text-neutral-200">
              A
            </div>
            <span className="font-semibold tracking-[0.25em] text-neutral-200 uppercase">
              ACROMÁTICO
            </span>
          </div>
          <p className="text-neutral-500 leading-relaxed text-xs">
            Estudio de arquitectura joven y metódico con sede en Buenos Aires. Diseño, anteproyecto,
            gestión municipal en Zona Norte, dirección de obra y arquitectura de interiores con
            mobiliario de precisión.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <a
              href="https://www.instagram.com/acromatico.estudio/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-neutral-800 hover:border-neutral-600 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@acromatico.estudio</span>
            </a>
            <a
              href="https://www.acromaticoestudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-neutral-800 hover:border-neutral-600 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Sitio Oficial</span>
            </a>
          </div>
        </div>

        {/* Columna 2: Servicios */}
        <div className="space-y-3">
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-neutral-200">
            Servicios Principales
          </h4>
          <ul className="space-y-2 text-neutral-500 text-xs">
            <li>
              <a href="#servicios" className="hover:text-neutral-300 transition-colors">
                Proyectos Residenciales desde Cero
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-neutral-300 transition-colors">
                Habilitaciones y Trámites Municipales
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-neutral-300 transition-colors">
                Liquidaciones y Visados CAPBA D4
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-neutral-300 transition-colors">
                Arquitectura de Interiores y Mobiliario
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-neutral-300 transition-colors">
                Espacios Corporativos y Oficinas
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-neutral-300 transition-colors">
                Arquitectura Gastronómica y Retail
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Proyectos & Obras */}
        <div className="space-y-3">
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-neutral-200">
            Proyectos de Referencia
          </h4>
          <ul className="space-y-2 text-neutral-500 text-xs">
            <li>UF San Sebastián A01 L108 (240 m²)</li>
            <li>UF Lagoon Pilar L038 (310 m²)</li>
            <li>UF San Sebastián A06 L188 (Interiores)</li>
            <li>UF Club de Campo CVC L340</li>
            <li>Piso Corporativo Libertador (Vicente López)</li>
            <li>Espacio Gastronómico Bajo San Isidro</li>
          </ul>
        </div>

        {/* Columna 4: Seguridad & Contacto */}
        <div className="space-y-4">
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-neutral-200">
            Protocolo y Seguridad
          </h4>
          <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Acromático OS Seguro</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Datos protegidos bajo cifrado JWT HttpOnly, validación estricta de esquemas Zod y
              sanitización NoSQL de expedientes.
            </p>
          </div>
          <div className="space-y-1.5 text-neutral-500 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>contacto@acromaticoestudio.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>+54 9 11 5824-9912 (Zona Norte)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-600 text-[11px]">
        <p>© 2025 ACROMÁTICO ESTUDIO. Todos los derechos reservados.</p>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-neutral-400 transition-colors flex items-center gap-1">
            <span>Portal del Arquitecto</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <Link href="/seguimiento" className="hover:text-neutral-400 transition-colors">
            Consulta de Expedientes
          </Link>
          <Link href="/contacto" className="hover:text-neutral-400 transition-colors">
            Contacto Directo
          </Link>
        </div>
      </div>
    </footer>
  );
};
