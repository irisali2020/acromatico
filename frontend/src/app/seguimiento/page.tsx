'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { GanttModal } from '@/components/GanttModal';
import {
  Search,
  Compass,
  FileCheck2,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('codigo') || '';

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [ganttOpen, setGanttOpen] = useState(false);

  const fetchTracking = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.trackProject(codeToSearch.trim());
      setProjectData(res.project);
    } catch (err: any) {
      setProjectData(null);
      setError(
        err.message ||
          'No se encontró ningún expediente activo con el código provisto. Verifique el código e intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchTracking(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(code);
  };

  const getStageDisplay = (stage: string) => {
    switch (stage) {
      case 'briefing':
        return { label: 'Briefing & Factibilidad Inicial', step: 1, total: 6 };
      case 'anteproyecto':
        return { label: 'Anteproyecto & Modelado 3D', step: 2, total: 6 };
      case 'proyecto_ejecutivo':
        return { label: 'Proyecto Ejecutivo & Planos Técnicos', step: 3, total: 6 };
      case 'tramite_municipal':
        return { label: 'Gestión Municipal & Visados CAPBA', step: 4, total: 6 };
      case 'direccion_obra':
        return { label: 'En Obra / Construcción Activa', step: 5, total: 6 };
      case 'finalizado':
        return { label: 'Proyecto & Obra Finalizada', step: 6, total: 6 };
      default:
        return { label: 'En Evaluación Técnica', step: 1, total: 6 };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Bar Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-[11px] font-mono uppercase tracking-widest text-neutral-300 mb-3">
          <Compass className="w-3.5 h-3.5 text-neutral-400" />
          <span>Portal de Transparencia de Obra</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-tight text-white mb-3">
          Seguimiento de <span className="font-semibold text-neutral-200">Expediente</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-light leading-relaxed">
          Ingresa el código oficial de tu proyecto (ej: <span className="font-mono text-neutral-200">ACR-2025-0108</span>) para verificar el estado de avance en tiempo real.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: ACR-2025-0108"
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-4 py-3 text-xs font-mono uppercase text-white tracking-widest focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(200,168,130,0.3)] cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#262626]" /> : <Search className="w-4 h-4 text-[#262626]" />}
            <span>Consultar</span>
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs font-mono mb-8 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <div>{error}</div>
        </div>
      )}

      {/* Project Status View */}
      {projectData && (
        <div className="glass-panel p-6 sm:p-8 border border-neutral-800 shadow-2xl space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                Expediente Oficial
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold tracking-wider text-white">
                  {projectData.trackingCode}
                </span>
                <span className="px-2.5 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-[10px] uppercase">
                  {projectData.serviceType?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                Cliente Registrado
              </span>
              <span className="text-sm font-medium text-neutral-200 block">
                {projectData.clientName}
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {projectData.location?.municipality}{' '}
                {projectData.location?.neighborhood ? `· ${projectData.location.neighborhood}` : ''}
              </span>
            </div>
          </div>

          {/* Current Stage Indicator */}
          <div className="p-5 bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Estado de Avance General:</span>
              <span className="text-white font-semibold">
                {projectData.progressPercentage || 10}% Completado
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-neutral-950 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-700 ease-out"
                style={{ width: `${projectData.progressPercentage || 10}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-300" />
                <span className="text-white font-medium">
                  {getStageDisplay(projectData.stage).label}
                </span>
              </div>
              <span>
                Fase {getStageDisplay(projectData.stage).step} de {getStageDisplay(projectData.stage).total}
              </span>
            </div>
          </div>

          {/* Checklist Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-neutral-900/40 border border-neutral-800">
              <span className="text-neutral-500 block mb-1">Trámites Realizados</span>
              <span className="text-xl font-light text-white">
                {projectData.checklistSummary?.completed} / {projectData.checklistSummary?.total}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Requisitos validados</span>
            </div>
            <div className="p-4 bg-neutral-900/40 border border-neutral-800">
              <span className="text-neutral-500 block mb-1">Identidad de Diseño</span>
              <span className="text-xs text-white truncate block">
                {projectData.scopeDetails?.architecturalStyle || 'Acromático'}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Línea material</span>
            </div>
            <div className="p-4 bg-neutral-900/40 border border-neutral-800">
              <span className="text-neutral-500 block mb-1">Última Actualización</span>
              <span className="text-xs text-white block">
                {new Date(projectData.updatedAt).toLocaleDateString('es-AR')}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">Verificado en sistema</span>
            </div>
          </div>

          {/* CTA Cronograma Gantt Dinámico */}
          <div className="pt-2">
            <button
              onClick={() => setGanttOpen(true)}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Calendar className="w-4 h-4 text-neutral-950" />
              <span>Ver Cronograma Gantt de mi Proyecto</span>
            </button>
          </div>

          {/* Direct Support */}
          <div className="p-4 bg-neutral-900/20 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-neutral-400 font-light text-center sm:text-left">
              ¿Tienes dudas sobre los avances de obra o trámites en la municipalidad?
            </div>
            <a
              href={`https://wa.me/5491158249912?text=${encodeURIComponent(
                `Hola Acromático Estudio, consulto por mi expediente ${projectData.trackingCode}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[11px] uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0"
            >
              <span>Consultar al Arquitecto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Modal de Gantt Dinámico para el Cliente */}
          <GanttModal
            isOpen={ganttOpen}
            onClose={() => setGanttOpen(false)}
            project={projectData}
            isClientView={true}
          />
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between pt-24 architectural-grid">
      <Navbar />
      <Suspense
        fallback={
          <div className="py-24 text-center text-xs font-mono text-neutral-400">
            Cargando portal de seguimiento...
          </div>
        }
      >
        <TrackingContent />
      </Suspense>
      <Footer />
    </div>
  );
}
