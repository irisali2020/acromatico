'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-7 w-14 bg-neutral-900 border border-neutral-800 rounded-full ${className}`} />
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        className={`p-2 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-700 text-emerald-400 hover:text-white hover:border-neutral-500'
            : 'bg-neutral-100 border-neutral-300 text-amber-600 hover:text-amber-700'
        } ${className}`}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-emerald-400" />
        ) : (
          <Moon className="w-4 h-4 text-neutral-700" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'light'}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full p-0.5 border transition-all duration-300 focus:outline-none ${
        theme === 'light'
          ? 'bg-neutral-200 border-neutral-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]'
          : 'bg-neutral-900 border-neutral-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]'
      } ${className}`}
    >
      <span className="sr-only">Alternar modo claro u oscuro</span>

      {/* Indicador pasivo del lado opuesto perfectamente centrado */}
      <span className="absolute left-1.5 flex items-center justify-center w-4 h-4 pointer-events-none text-neutral-500">
        <Moon className={`w-3 h-3 transition-opacity ${theme === 'light' ? 'opacity-40 text-neutral-600' : 'opacity-0'}`} />
      </span>
      <span className="absolute right-1.5 flex items-center justify-center w-4 h-4 pointer-events-none text-neutral-500">
        <Sun className={`w-3 h-3 transition-opacity ${theme === 'dark' ? 'opacity-40 text-neutral-500' : 'opacity-0'}`} />
      </span>

      {/* Perilla deslizante con icono activo centrado */}
      <span
        className={`pointer-events-none z-10 inline-flex h-5.5 w-5.5 transform items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out ${
          theme === 'light'
            ? 'translate-x-7 bg-white text-amber-600'
            : 'translate-x-0.5 bg-neutral-950 border border-neutral-700 text-emerald-400'
        }`}
      >
        {theme === 'light' ? (
          <Sun className="w-3.5 h-3.5 text-amber-600" />
        ) : (
          <Moon className="w-3 h-3 text-emerald-400" />
        )}
      </span>
    </button>
  );
};
