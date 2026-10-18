'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Ruler,
  Calculator,
  Plus,
  Send,
  Loader2,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { GanttModal } from '@/components/GanttModal';

function ProjectDetailContent() {
  const router = useRouter();
  const routeParams = useParams();
  const projectId = (routeParams?.id as string) || '';

  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [ganttOpen, setGanttOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingChecklistId, setUpdatingChecklistId] = useState<string | null>(null);

  // FOS / FOT inputs locales para cálculo en vivo
  const [fosValue, setFosValue] = useState(0.35);
  const [fotValue, setFotValue] = useState(0.7);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminProjectDetail(projectId);
      if (res.project) {
        setProject(res.project);
        if (res.project.technicalData?.fos) setFosValue(res.project.technicalData.fos);
        if (res.project.technicalData?.fot) setFotValue(res.project.technicalData.fot);
      }
    } catch (err: any) {
      alert('Error al cargar expediente: ' + err.message);
      router.push('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleChecklistStatusChange = async (itemId: string, newStatus: string) => {
    setUpdatingChecklistId(itemId);
    try {
      const res = await api.updateChecklistItem(project._id || project.trackingCode, itemId, newStatus);
      if (res.project) {
        setProject(res.project);
      }
    } catch (err) {
      alert('Error al actualizar ítem de checklist');
    } finally {
      setUpdatingChecklistId(null);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await api.addProjectNote(project._id || project.trackingCode, newNote.trim());
      if (res.project) {
        setProject(res.project);
        setNewNote('');
      }
    } catch (err) {
      alert('Error al agregar nota');
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Cargando expediente técnico...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  // Cálculos de ocupación de suelo
  const lotSize = project.technicalData?.lotSizeM2 || 0;
  const coveredM2 = project.technicalData?.coveredM2 || 0;
  const maxFootprintAllowed = Math.round(lotSize * fosValue);
  const maxTotalAllowed = Math.round(lotSize * fotValue);
  const fosExceeded = coveredM2 > maxFootprintAllowed && maxFootprintAllowed > 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 md:pb-10 overflow-y-auto w-full max-w-full overflow-x-hidden">
        {/* Back Link */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Pipeline</span>
        </Link>

        {/* Project Header */}
        <div className="p-6 bg-neutral-900/40 border border-neutral-800 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-2xl font-bold tracking-wider text-white">
                  {project.trackingCode}
                </span>
                <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[11px] uppercase">
                  {project.serviceType?.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-[11px] uppercase">
                  {project.status}
                </span>
              </div>
              <h2 className="text-xl font-light text-neutral-200">
                Cliente: <strong className="font-semibold text-white">{project.client?.name}</strong>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setGanttOpen(true)}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(52,211,153,0.3)] cursor-pointer hover:scale-105 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Cronograma Gantt</span>
              </button>

              <Link
                href={`/seguimiento?codigo=${project.trackingCode}`}
                target="_blank"
                className="px-3.5 py-2 border border-neutral-700 hover:border-neutral-500 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Vista Cliente</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-neutral-400">
            <div>
              <span className="text-neutral-500 block text-[10px]">Partido / Municipio:</span>
              <span className="text-white">{project.location?.municipality}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Barrio / Lote:</span>
              <span className="text-white truncate block">
                {project.location?.neighborhood || 'Urbano'}{' '}
                {project.location?.lotNumber ? `(${project.location.lotNumber})` : ''}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Superficie Lote:</span>
              <span className="text-white">{project.technicalData?.lotSizeM2 || 0} m²</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Metros Cubiertos:</span>
              <span className="text-white">{project.technicalData?.coveredM2 || 0} m²</span>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Municipal Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light uppercase tracking-tight text-white">
                  Checklist Técnico & Municipal de Zona Norte
                </h3>
                <p className="text-xs text-neutral-400 font-light">
                  Procedimientos reglamentarios para {project.location?.municipality} y CAPBA D4.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {project.municipalChecklist?.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase">
                        {item.category?.replace('_', ' ')}
                      </span>
                      <h4 className="text-xs font-medium text-white">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {['pendiente', 'en_progreso', 'completado'].map((st) => (
                      <button
                        key={st}
                        disabled={updatingChecklistId === item.id}
                        onClick={() => handleChecklistStatusChange(item.id, st)}
                        className={`px-2.5 py-1 text-[10px] font-mono uppercase transition-colors border ${
                          item.status === st
                            ? st === 'completado'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 font-medium'
                              : st === 'en_progreso'
                              ? 'bg-blue-100 dark:bg-blue-950/80 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-300 font-medium'
                              : 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 font-medium'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                      >
                        {st === 'en_progreso' ? 'En Progreso' : st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bitácora de Notas Técnicas */}
            <div className="pt-8 border-t border-neutral-900 space-y-4">
              <h3 className="text-lg font-light uppercase tracking-tight text-white">
                Bitácora de Notas Técnicas
              </h3>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Escribir registro de visita de obra, llamado municipal o acuerdo técnico..."
                  className="w-full bg-neutral-900 border border-neutral-800 p-3 text-xs text-white focus:outline-none focus:border-neutral-600 resize-none font-light"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingNote || !newNote.trim()}
                    className="px-4 py-2 bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {submittingNote ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Registrar en Bitácora</span>
                  </button>
                </div>
              </form>

              {/* Lista de Notas */}
              <div className="space-y-2.5 pt-2">
                {project.notes?.length === 0 ? (
                  <div className="text-xs font-mono text-neutral-600 py-4 text-center">
                    Aún no hay notas registradas para este expediente.
                  </div>
                ) : (
                  project.notes?.map((n: any) => (
                    <div key={n.id} className="p-3 bg-neutral-900/60 border border-neutral-800/80 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                        <span className="text-neutral-300 font-medium">{n.author}</span>
                        <span>{new Date(n.createdAt).toLocaleString('es-AR')}</span>
                      </div>
                      <p className="text-neutral-300 font-light leading-relaxed">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Calculador FOS/FOT y Brief */}
          <div className="space-y-6">
            {/* Calculador FOS / FOT */}
            <div className="p-5 bg-neutral-900/40 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300">
                <Calculator className="w-4 h-4 text-neutral-400" />
                <span>Calculador FOS / FOT</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>FOS (Factor Ocupación Suelo):</span>
                    <span className="text-white font-medium">{fosValue}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={fosValue}
                    onChange={(e) => setFosValue(Number(e.target.value))}
                    className="w-full accent-white bg-neutral-800 h-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>FOT (Factor Ocupación Total):</span>
                    <span className="text-white font-medium">{fotValue}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.05"
                    value={fotValue}
                    onChange={(e) => setFotValue(Number(e.target.value))}
                    className="w-full accent-white bg-neutral-800 h-1"
                  />
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-2 mt-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Pisada Máxima en Planta:</span>
                    <span className="text-white font-medium">{maxFootprintAllowed} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Superficie Total Máxima:</span>
                    <span className="text-white font-medium">{maxTotalAllowed} m²</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-neutral-800">
                    <span className="text-neutral-500">Superficie Proyectada:</span>
                    <span className={fosExceeded ? 'text-red-400 font-semibold' : 'text-emerald-400'}>
                      {coveredM2} m²
                    </span>
                  </div>
                </div>

                {fosExceeded ? (
                  <div className="p-2.5 bg-red-950/40 border border-red-800 text-[11px] text-red-300 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>¡Atención! La superficie supera el FOS permitido para este terreno.</span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 text-[11px] text-emerald-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Dentro de los parámetros urbanísticos reglamentarios.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ficha de Briefing Original del Cliente */}
            <div className="p-5 bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Programa & Requerimientos
              </h4>

              <div className="space-y-3 text-xs font-light">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Ambientes Solicitados:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.scopeDetails?.environments?.map((env: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 text-[11px]"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Estilo Arquitectónico:
                  </span>
                  <span className="text-white text-xs font-mono">
                    {project.scopeDetails?.architecturalStyle}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Presupuesto Objetivo:
                  </span>
                  <span className="text-white text-xs font-mono">
                    {project.scopeDetails?.budgetRange || 'A coordinar'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Contacto:
                  </span>
                  <span className="text-neutral-300 block text-xs">{project.client?.email}</span>
                  <span className="text-neutral-300 block text-xs">{project.client?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Gantt Dinámico */}
        <GanttModal
          isOpen={ganttOpen}
          onClose={() => setGanttOpen(false)}
          project={project}
        />
      </main>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Cargando expediente técnico...</span>
          </div>
        </div>
      }
    >
      <ProjectDetailContent />
    </Suspense>
  );
}
