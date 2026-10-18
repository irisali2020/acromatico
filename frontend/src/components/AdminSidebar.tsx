'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Compass,
  User,
  Layers,
  Briefcase,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

export const AdminSidebar = () => {
  const { isLight } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {}
    router.push('/admin');
  };

  const navItems = [
    {
      name: 'Panel & Pipeline',
      shortName: 'Pipeline',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Agenda & Calendario',
      shortName: 'Agenda',
      href: '/admin/calendario',
      icon: Calendar,
    },
    {
      name: 'Gestión de Tareas',
      shortName: 'Tareas',
      href: '/admin/tareas',
      icon: CheckSquare,
    },
    {
      name: 'Obras en Portafolio',
      shortName: 'Portfolio',
      href: '/admin/portfolio',
      icon: Layers,
    },
    {
      name: 'Servicios del Estudio',
      shortName: 'Servicios',
      href: '/admin/servicios',
      icon: Briefcase,
    },
  ];

  return (
    <>
      {/* 1. Mobile Top Bar (Solo visible en pantallas móviles < 768px) */}
      <div className="md:hidden sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between w-full">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <img
            src={isLight ? '/logo-acromatico-dark.png' : '/logo-acromatico.png'}
            alt="Acromático Estudio"
            className="h-7 w-auto object-contain transition-opacity duration-200"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-widest text-white uppercase">
              ACROMÁTICO OS
            </span>
            <span className="text-[9px] text-neutral-500 font-mono">Panel Móvil</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin</span>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            aria-label="Abrir menú"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. Mobile Drawer Overlay & Panel */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 bg-neutral-950 border-r border-neutral-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-900 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={isLight ? '/logo-acromatico-dark.png' : '/logo-acromatico.png'}
                    alt="Acromático Estudio"
                    className="h-8 w-auto object-contain transition-opacity duration-200"
                  />
                  <div>
                    <span className="font-bold text-xs tracking-widest text-white uppercase block">
                      ACROMÁTICO OS
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">Zona Norte BA</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 px-3 py-1">
                  Módulos de Gestión
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 text-xs font-mono transition-colors ${
                        isActive
                          ? 'bg-neutral-900 text-white border-l-2 border-white font-semibold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Enlaces Rápidos Adicionales */}
              <div className="mt-8 pt-6 border-t border-neutral-900 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 px-3 py-1">
                  Accesos Públicos
                </div>
                <Link
                  href="/seguimiento"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Portal de Seguimiento</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>Ver Sitio Web Público</span>
                </Link>

                <div className="flex items-center justify-between px-3.5 py-2 text-xs font-mono text-neutral-400">
                  <span>Modo de Vista</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Footer con info de sesión y logout */}
            <div className="pt-6 border-t border-neutral-900 space-y-3">
              <div className="px-3 py-2 bg-neutral-900/70 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sesión Segura JWT</span>
                </div>
                <div className="text-[11px] text-neutral-200 font-medium">Arq. Titular</div>
                <div className="text-[10px] text-neutral-500 truncate">
                  contacto@acromaticoestudio.com
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 border border-red-950/80 bg-red-950/20 text-red-400 hover:bg-red-950/40 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Sticky Sidebar (Visible en pantallas >= 768px) */}
      <aside className="hidden md:flex md:w-64 bg-neutral-950 border-r border-neutral-800 flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <img
                src={isLight ? '/logo-acromatico-dark.png' : '/logo-acromatico.png'}
                alt="Acromático Estudio"
                className="h-8 w-auto object-contain transition-opacity duration-200"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-xs tracking-[0.2em] text-white uppercase">
                  ACROMÁTICO OS
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Panel de Estudio</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 px-3 py-2">
              Módulos Principales
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white border-l-2 border-white font-medium'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Info & Actions */}
        <div className="p-4 border-t border-neutral-900 space-y-3">
          <div className="px-3 py-2 bg-neutral-900/50 border border-neutral-800/80 rounded">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sesión Protegida JWT</span>
            </div>
            <div className="text-[11px] text-neutral-300 truncate font-medium">
              Arq. Titular
            </div>
            <div className="text-[10px] text-neutral-500 truncate">
              contacto@acromaticoestudio.com
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Web</span>
            </Link>

            <ThemeToggle compact />

            <button
              onClick={handleLogout}
              className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 4. Mobile Bottom Navigation Bar (Barra fija para pulgar en móviles) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-mono transition-colors ${
                isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
              <span>{item.shortName}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-mono text-neutral-400 hover:text-white"
        >
          <Menu className="w-4 h-4 mb-0.5 text-neutral-500" />
          <span>Menú</span>
        </button>
      </nav>
    </>
  );
};
