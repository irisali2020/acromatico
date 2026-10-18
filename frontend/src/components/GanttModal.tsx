'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  X,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  ShieldCheck,
  Building,
  Layers,
  MapPin,
  ExternalLink,
  Sparkles,
  Milestone,
} from 'lucide-react';

interface GanttPhase {
  id: string;
  name: string;
  category: string;
  startWeek: number;
  durationWeeks: number;
  status: 'completado' | 'en_progreso' | 'pendiente';
  progress: number;
  deliverables: string[];
  subtasks: { name: string; done: boolean }[];
  milestone?: string;
}

interface GanttModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  isClientView?: boolean;
}

export const GanttModal: React.FC<GanttModalProps> = ({
  isOpen,
  onClose,
  project,
  isClientView = false,
}) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const currentStage = project.stage || 'briefing';
  const stageWeights: Record<string, number> = {
    briefing: 1,
    anteproyecto: 2,
    proyecto_ejecutivo: 3,
    tramite_municipal: 4,
    licitacion_computo: 5,
    direccion_obra: 6,
    finalizado: 7,
  };
  const currentStageWeight = stageWeights[currentStage] || 1;

  // Total de semanas del cronograma arquitectónico estándar (40 semanas)
  const TOTAL_WEEKS = 40;

  // Fases dinámicas sincronizadas con el expediente
  const phases: GanttPhase[] = [
    {
      id: 'fase-1',
      name: '01. Factibilidad & Briefing Inicial',
      category: 'Zonificación',
      startWeek: 1,
      durationWeeks: 2,
      status: currentStageWeight > 1 ? 'completado' : currentStageWeight === 1 ? 'en_progreso' : 'pendiente',
      progress: currentStageWeight > 1 ? 100 : Math.min(100, (project.progressPercentage || 15) * 4),
      deliverables: [
        'Relevamiento y dimensiones del lote',
        'Informe urbanístico de FOS / FOT y retiros reglamentarios',
        'Briefing espacial y programa de necesidades',
      ],
      subtasks: [
        { name: 'Visita técnica a lote / análisis de asoleamiento', done: currentStageWeight >= 1 },
        { name: 'Consulta del código de edificación municipal', done: currentStageWeight >= 1 },
        { name: 'Validación de reglamento interno del barrio cerrado', done: currentStageWeight > 1 },
      ],
      milestone: 'Briefing Aprobado',
    },
    {
      id: 'fase-2',
      name: '02. Anteproyecto & Modelado 3D',
      category: 'Diseño',
      startWeek: 3,
      durationWeeks: 5,
      status: currentStageWeight > 2 ? 'completado' : currentStageWeight === 2 ? 'en_progreso' : 'pendiente',
      progress: currentStageWeight > 2 ? 100 : currentStageWeight === 2 ? 65 : 0,
      deliverables: [
        'Croquis y distribución funcional en plantas 1:100',
        'Estudio bioclimático y morfología volumétrica',
        'Renders fotorrealistas 4K y maqueta 3D interactiva',
      ],
      subtasks: [
        { name: 'Propuesta volumétrica v01 presentada al cliente', done: currentStageWeight >= 2 },
        { name: 'Ajustes finos de distribución y aberturas', done: currentStageWeight > 2 },
        { name: 'Renders exteriores e interiores definitivos', done: currentStageWeight > 2 },
      ],
      milestone: 'Diseño 3D Congelado',
    },
    {
      id: 'fase-3',
      name: '03. Proyecto Ejecutivo & Ingeniería',
      category: 'Ingeniería',
      startWeek: 8,
      durationWeeks: 6,
      status: currentStageWeight > 3 ? 'completado' : currentStageWeight === 3 ? 'en_progreso' : 'pendiente',
      progress: currentStageWeight > 3 ? 100 : currentStageWeight === 3 ? 45 : 0,
      deliverables: [
        'Planos de replanteo milimétrico de arquitectura',
        'Cálculo de estructuras de hormigón armado y metal',
        'Planos de instalaciones (sanitaria, gas, electricidad, clima)',
        'Detalles constructivos y carpinterías a escala 1:20',
      ],
      subtasks: [
        { name: 'Estudio de suelos y cálculo de fundaciones', done: currentStageWeight >= 3 },
        { name: 'Coordinación con calculista estructural', done: currentStageWeight >= 3 },
        { name: 'Despieces de carpintería y muebles a medida', done: currentStageWeight > 3 },
      ],
    },
    {
      id: 'fase-4',
      name: '04. Visados CAPBA & Aprobación Municipal',
      category: 'Gestión Legal',
      startWeek: 14,
      durationWeeks: 6,
      status: currentStageWeight > 4 ? 'completado' : currentStageWeight === 4 ? 'en_progreso' : 'pendiente',
      progress: currentStageWeight > 4 ? 100 : currentStageWeight === 4 ? 50 : 0,
      deliverables: [
        'Liquidación y visado en Colegio de Arquitectos (CAPBA D4)',
        'Visado de planos en Comisión de Arquitectura del Barrio',
        'Carátula y Plano Municipal Único reglamentario',
        'Permiso de Obra Definitivo otorgado',
      ],
      subtasks: [
        { name: 'Presentación formal en Obras Particulares', done: currentStageWeight >= 4 },
        { name: 'Pago de derechos de construcción municipal', done: currentStageWeight >= 4 },
        { name: 'Retiro de Plano Aprobado con sello municipal', done: currentStageWeight > 4 },
      ],
      milestone: 'Permiso de Obra Otorgado',
    },
    {
      id: 'fase-5',
      name: '05. Cómputo Métrico & Licitación de Gremios',
      category: 'Licitación',
      startWeek: 20,
      durationWeeks: 3,
      status: currentStageWeight > 5 ? 'completado' : currentStageWeight === 5 ? 'en_progreso' : 'pendiente',
      progress: currentStageWeight > 5 ? 100 : currentStageWeight === 5 ? 30 : 0,
      deliverables: [
        'Planilla de cómputo métrico y cantidades de obra',
        'Pliego de condiciones particulares y contratos',
        'Comparativa de cotizaciones de constructores y gremios',
      ],
      subtasks: [
        { name: 'Cómputo de hormigón, hierro y mampostería', done: currentStageWeight >= 5 },
        { name: 'Recepción y apertura de presupuestos', done: currentStageWeight >= 5 },
        { name: 'Adjudicación y firma de contrato de obra', done: currentStageWeight > 5 },
      ],
    },
    {
      id: 'fase-6',
      name: '06. Dirección de Obra & Certificaciones',
      category: 'Construcción',
      startWeek: 23,
      durationWeeks: 18,
      status: currentStageWeight >= 6 ? (currentStageWeight === 7 ? 'completado' : 'en_progreso') : 'pendiente',
      progress: currentStageWeight === 7 ? 100 : currentStageWeight === 6 ? Math.max(10, project.progressPercentage || 25) : 0,
      deliverables: [
        'Actas de replanteo y Libro de Órdenes',
        'Supervisión técnica de hormigonado y plomos',
        'Certificaciones quincenales por avance real',
        'Inspección final municipal y Certificado de Final de Obra',
      ],
      subtasks: [
        { name: 'Replanteo en terreno y excavación de bases', done: currentStageWeight >= 6 },
        { name: 'Llenado de losas y verificación de probetas', done: currentStageWeight >= 6 },
        { name: 'Supervisión de instalaciones embutidas y pruebas hidráulicas', done: currentStageWeight >= 6 },
        { name: 'Recepción de obra y entrega de llaves', done: currentStageWeight === 7 },
      ],
      milestone: 'Acta de Final de Obra',
    },
  ];

  // Cálculo de semanas transcurridas aproximadas
  const completedPhasesCount = phases.filter((p) => p.status === 'completado').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl bg-neutral-900 border border-neutral-700/80 gantt-modal-panel shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-white relative"
      >
        {/* Cabecera del Modal de Gantt */}
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                  Diagrama de Gantt Dinámico
                </span>
                <span className="text-neutral-500 text-xs">·</span>
                <span className="font-mono text-xs text-neutral-300">
                  {project.trackingCode}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-light uppercase text-white tracking-wide">
                Cronograma de Obra & Trámites Municipales
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                Avance Registrado
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {project.progressPercentage || 10}%
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs transition-colors cursor-pointer"
              title="Imprimir o guardar como PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resumen de Proyecto */}
        <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div>
              <span className="text-neutral-500 mr-1.5">Cliente:</span>
              <strong className="text-white font-medium">{project.client?.name || 'Cliente Acromático'}</strong>
            </div>
            <div>
              <span className="text-neutral-500 mr-1.5">Ubicación:</span>
              <span className="text-neutral-200">
                {project.location?.municipality} · {project.location?.neighborhood || 'Urbano'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1.5">Duración Estimada:</span>
              <span className="text-emerald-400 font-semibold">{TOTAL_WEEKS} Semanas (~9 Meses)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300">
              Fase Actual: <strong className="text-white capitalize">{currentStage.replace('_', ' ')}</strong>
            </span>
          </div>
        </div>

        {/* Contenido Principal con Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Timeline Visual Gantt Container */}
          <div className="bg-neutral-950/90 border border-neutral-800 p-4 sm:p-6 shadow-inner overflow-x-auto">
            <div className="min-w-[760px]">
              {/* Eje Horizontal de Tiempo (Semanas y Meses) */}
              <div className="grid grid-cols-12 gap-0 border-b border-neutral-800 pb-2 mb-4 text-[10px] font-mono text-neutral-400">
                <div className="col-span-4 uppercase tracking-wider text-neutral-500">
                  Etapa Proyectual & Ejecutiva
                </div>
                <div className="col-span-8 grid grid-cols-10 gap-1 text-center">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} className="border-l border-neutral-800/60 pl-1">
                      <span className="text-neutral-300 font-semibold block">M{idx + 1}</span>
                      <span className="text-[9px] text-neutral-500 block">Sem {(idx * 4) + 1}-{(idx + 1) * 4}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filas de Fases en el Gantt */}
              <div className="space-y-4">
                {phases.map((phase) => {
                  const isExpanded = expandedPhase === phase.id;
                  const leftPercent = ((phase.startWeek - 1) / TOTAL_WEEKS) * 100;
                  const widthPercent = (phase.durationWeeks / TOTAL_WEEKS) * 100;

                  return (
                    <div
                      key={phase.id}
                      className="group border border-neutral-800/80 hover:border-neutral-700 bg-neutral-900/40 transition-colors"
                    >
                      {/* Fila Principal de la Barra Gantt */}
                      <div className="grid grid-cols-12 gap-2 items-center p-3">
                        {/* Nombre y Estado */}
                        <div
                          className="col-span-4 flex items-center justify-between pr-2 cursor-pointer select-none"
                          onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {phase.status === 'completado' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : phase.status === 'en_progreso' ? (
                              <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                                <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                                <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400" />
                              </div>
                            ) : (
                              <Clock className="w-4 h-4 text-neutral-600 shrink-0" />
                            )}
                            <span className="text-xs font-mono font-medium text-white truncate group-hover:text-emerald-300 transition-colors">
                              {phase.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-wider ${
                                phase.status === 'completado'
                                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                                  : phase.status === 'en_progreso'
                                  ? 'bg-neutral-800 border border-emerald-400 text-white font-bold'
                                  : 'bg-neutral-950 border border-neutral-800 text-neutral-500'
                              }`}
                            >
                              {phase.status.replace('_', ' ')}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                            )}
                          </div>
                        </div>

                        {/* Barra Visual Gantt en el Canvas */}
                        <div className="col-span-8 relative h-7 bg-neutral-950/80 border border-neutral-800/80 flex items-center px-1">
                          {/* Grid sutil de fondo */}
                          <div className="absolute inset-0 grid grid-cols-10 divide-x divide-neutral-900 pointer-events-none" />

                          {/* Barra Horizontal Proporcional */}
                          <div
                            style={{
                              marginLeft: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`h-5 rounded-xs transition-all duration-300 relative flex items-center justify-between px-2 text-[10px] font-mono shadow-sm ${
                              phase.status === 'completado'
                                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                                : phase.status === 'en_progreso'
                                ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 text-neutral-950 font-extrabold animate-pulse'
                                : 'bg-neutral-800/60 border border-neutral-700/60 text-neutral-400'
                            }`}
                          >
                            <span className="truncate text-[9px] font-bold">
                              {phase.durationWeeks} sem
                            </span>
                            <span className="text-[9px] hidden sm:inline">
                              {phase.progress}%
                            </span>

                            {/* Hito / Milestone Flag */}
                            {phase.milestone && (
                              <div
                                className="absolute -top-6 right-0 -translate-x-1/2 flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-emerald-300 bg-neutral-950 px-1.5 py-0.5 border border-emerald-500/60 shadow-lg whitespace-nowrap z-10"
                                title={`Hito: ${phase.milestone}`}
                              >
                                <Milestone className="w-2.5 h-2.5 text-emerald-400" />
                                <span>{phase.milestone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Detalle Desplegable con Tareas y Entregables */}
                      {isExpanded && (
                        <div className="p-4 bg-neutral-950 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in slide-in-from-top-2 duration-150">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider block mb-2 font-semibold">
                              Entregables Oficiales de la Fase:
                            </span>
                            <ul className="space-y-1.5 text-neutral-300 font-light">
                              {phase.deliverables.map((del, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                  <span>{del}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block mb-2 font-semibold">
                              Subtareas de Supervisión Técnica:
                            </span>
                            <div className="space-y-1.5">
                              {phase.subtasks.map((task, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="flex items-center gap-2 text-xs font-mono"
                                >
                                  {task.done ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <span className="w-3.5 h-3.5 border border-neutral-700 shrink-0" />
                                  )}
                                  <span className={task.done ? 'text-neutral-300 line-through' : 'text-neutral-400'}>
                                    {task.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leyenda y Notas Técnicas */}
          <div className="p-4 bg-neutral-950/60 border border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-neutral-500 uppercase text-[10px]">Referencias:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-500 rounded-xs" />
                <span className="text-neutral-300">Completada (100%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-300 rounded-xs animate-pulse" />
                <span className="text-white font-medium">Fase Activa en Curso</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-neutral-800 border border-neutral-700 rounded-xs" />
                <span className="text-neutral-500">Próxima Etapa</span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500">
              Cálculo estimado basado en plazos reales de visado CAPBA D4 y Obras Particulares en Zona Norte.
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs font-mono text-neutral-400">
          <div>
            Acromático Estudio · Gestión de Proyectos de Arquitectura & Dirección de Obra
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-bold uppercase transition-colors cursor-pointer shadow-[0_0_12px_rgba(200,168,130,0.3)]"
          >
            Cerrar Cronograma
          </button>
        </div>
      </div>
    </div>
  );
};
