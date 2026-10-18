'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { api } from '@/lib/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  FileCheck2,
  HardHat,
  Ruler,
  Users,
  Compass,
  Filter,
  X,
  ExternalLink,
  MapPin,
  CalendarDays,
  Sparkles,
  Loader2,
} from 'lucide-react';

function CalendarContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [today, setTodayDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2025, 0, 1));
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingTask, setSubmittingTask] = useState(false);

  useEffect(() => {
    const now = new Date();
    setTodayDate(now);
    setCurrentDate(now);
    setSelectedDate(now);
  }, []);

  // Form para nueva tarea/compromiso
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    category: 'tramite_municipal',
    priority: 'alta',
    projectTrackingCode: '',
    dueDate: '',
    estimatedHours: 2,
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      await api.getMe();
      const [tasksRes, projRes] = await Promise.all([
        api.getTasks(),
        api.getAdminProjects(),
      ]);

      setTasks(tasksRes.tasks || []);
      setProjects(projRes.projects || []);
    } catch (e) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // Manejo de mes anterior y siguiente
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const setToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Nombres de meses y días en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Días en el mes
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Día de la semana en que comienza (0: domingo -> ajustar a lun: 0, dom: 6)
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  // Días del mes previo para rellenar
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays: number[] = [];
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i);
  }

  // Días del mes actual
  const currentMonthDays: number[] = [];
  for (let d = 1; d <= totalDays; d++) {
    currentMonthDays.push(d);
  }

  // Días del mes siguiente para completar la grilla
  const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays: number[] = [];
  for (let d = 1; d <= remainingCells; d++) {
    nextMonthDays.push(d);
  }

  // Normalizar fecha a string YYYY-MM-DD
  const formatDateKey = (d: Date | string) => {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(
      dateObj.getDate()
    ).padStart(2, '0')}`;
  };

  // Agrupar tareas por fecha
  const tasksByDate: Record<string, any[]> = {};
  tasks.forEach((t) => {
    if (t.dueDate) {
      const key = formatDateKey(t.dueDate);
      if (!tasksByDate[key]) tasksByDate[key] = [];
      tasksByDate[key].push(t);
    }
  });

  // Tareas del día seleccionado
  const selectedKey = formatDateKey(selectedDate);
  const selectedDayTasks = (tasksByDate[selectedKey] || []).filter((t) => {
    if (selectedCategory === 'todos') return true;
    return t.category === selectedCategory;
  });

  // Toggle estado de tarea
  const toggleTaskStatus = async (task: any) => {
    const newStatus = task.status === 'completado' ? 'pendiente' : 'completado';
    try {
      await api.updateTask(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
    } catch (e) {
      alert('Error al actualizar el estado de la tarea');
    }
  };

  // Crear nueva tarea desde el calendario
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    setSubmittingTask(true);
    try {
      const res = await api.createTask({
        title: newTaskForm.title,
        category: newTaskForm.category,
        priority: newTaskForm.priority,
        projectTrackingCode: newTaskForm.projectTrackingCode || undefined,
        dueDate: newTaskForm.dueDate ? new Date(newTaskForm.dueDate) : selectedDate,
        estimatedHours: Number(newTaskForm.estimatedHours) || 1,
        notes: newTaskForm.notes,
        status: 'pendiente',
        checklistSubitems: [],
      });

      if (res.task) {
        setTasks((prev) => [...prev, res.task]);
        setShowAddModal(false);
        setNewTaskForm({
          title: '',
          category: 'tramite_municipal',
          priority: 'alta',
          projectTrackingCode: '',
          dueDate: '',
          estimatedHours: 2,
          notes: '',
        });
      }
    } catch (e) {
      alert('Error al crear el compromiso en el calendario');
    } finally {
      setSubmittingTask(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'tramite_municipal':
        return 'bg-[#ede2d2] dark:bg-stone-900 border-[#a6825a] text-[#4d3215] dark:text-[#ebd6be] font-medium';
      case 'capba':
        return 'bg-[#f0e7dc] dark:bg-neutral-900 border-[#b58f62] text-[#5e3d1c] dark:text-[#dfc29f] font-medium';
      case 'visita_obra':
        return 'bg-[#f4ece1] dark:bg-amber-950/60 border-[#c8a882] text-[#6b4721] dark:text-[#f3e7d3] font-medium';
      case 'renders_3d':
      case 'dibujo_cad':
        return 'bg-[#e8decb] dark:bg-neutral-900 border-[#8a6842] text-[#3f2b15] dark:text-[#eedac0] font-medium';
      case 'reunion_cliente':
        return 'bg-[#f9f3eb] dark:bg-neutral-900 border-[#9e7a50] text-[#553617] dark:text-[#f8ecdc] font-medium';
      default:
        return 'bg-[#eee8de] dark:bg-neutral-900 border-[#7d5d37] text-[#3b2711] dark:text-[#e4cfb7] font-medium';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tramite_municipal':
        return 'Trámite Municipal';
      case 'capba':
        return 'Colegio CAPBA D4';
      case 'visita_obra':
        return 'Inspección en Obra';
      case 'renders_3d':
        return 'Render 3D';
      case 'dibujo_cad':
        return 'Plano CAD';
      case 'reunion_cliente':
        return 'Reunión con Cliente';
      default:
        return 'Gestión Técnica';
    }
  };

  const todayKey = today ? formatDateKey(today) : '';

  // Conteo de tareas pendientes del mes
  const pendingMonthCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'completado') return false;
    const d = new Date(t.dueDate);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const urgentCount = tasks.filter((t) => t.priority === 'urgente' && t.status !== 'completado').length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-neutral-950">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 md:pb-10 overflow-y-auto w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header con Controles y Métricas Rápidas */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gestión Metódica & Control Temporal</span>
              </div>
              <h1 className="text-3xl font-light tracking-tight text-white uppercase">
                Agenda & <strong className="font-semibold text-neutral-100">Calendario de Estudio</strong>
              </h1>
              <p className="text-neutral-400 text-xs font-mono mt-1">
                Visualización día por día de trámites municipales, inspecciones en lote y entregas técnicas.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-neutral-900/60 border border-neutral-800 text-left">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block">Pendientes Mes</span>
                <span className="font-mono text-xl font-bold text-white">{pendingMonthCount}</span>
              </div>

              <div className="px-4 py-2 bg-neutral-900/60 border border-neutral-800 text-left">
                <span className="text-[10px] font-mono uppercase text-red-400 block">Urgentes</span>
                <span className="font-mono text-xl font-bold text-red-300">{urgentCount}</span>
              </div>

              <button
                onClick={() => {
                  setNewTaskForm((prev) => ({
                    ...prev,
                    dueDate: formatDateKey(selectedDate),
                  }));
                  setShowAddModal(true);
                }}
                className="px-5 py-3 bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Compromiso</span>
              </button>
            </div>
          </div>

          {/* Selector de Mes & Filtros */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-neutral-900 border border-neutral-800">
                <button
                  onClick={prevMonth}
                  className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm font-mono uppercase tracking-wider text-white font-medium min-w-[170px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={setToday}
                className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono uppercase text-neutral-300 transition-colors"
              >
                Hoy
              </button>
            </div>

            {/* Categorías Filtro */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-900/60 border border-neutral-800/80 text-xs font-mono uppercase tracking-wider">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'tramite_municipal', label: 'Municipal' },
                { id: 'visita_obra', label: 'Obra' },
                { id: 'renders_3d', label: '3D & CAD' },
                { id: 'capba', label: 'CAPBA' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-white text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grilla Principal: Calendario Mensual + Inspector de Día Seleccionado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grilla Calendario (2 columnas en desktop) */}
            <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 p-4 sm:p-6 shadow-xl">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 mb-2 border-b border-neutral-800/80 pb-3">
                {dayNames.map((day, idx) => (
                  <div
                    key={day}
                    className={`text-center font-mono text-xs uppercase tracking-widest ${
                      idx >= 5 ? 'text-neutral-600' : 'text-neutral-400'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Días previos de mes anterior */}
                {prevMonthDays.map((d) => (
                  <div
                    key={`prev-${d}`}
                    className="min-h-[75px] sm:min-h-[90px] p-1.5 border border-neutral-900 bg-neutral-950/30 text-neutral-700 font-mono text-xs flex flex-col justify-between opacity-40 cursor-not-allowed"
                  >
                    <span>{d}</span>
                  </div>
                ))}

                {/* Días del mes actual */}
                {currentMonthDays.map((d) => {
                  const thisDate = new Date(year, month, d);
                  const dateKey = formatDateKey(thisDate);
                  const isToday = dateKey === todayKey;
                  const isSelected = dateKey === selectedKey;
                  const dayTasks = (tasksByDate[dateKey] || []).filter((t) => {
                    if (selectedCategory === 'todos') return true;
                    return t.category === selectedCategory;
                  });

                  const hasPending = dayTasks.some((t) => t.status !== 'completado');
                  const hasUrgent = dayTasks.some((t) => t.priority === 'urgente' && t.status !== 'completado');

                  return (
                    <div
                      key={`curr-${d}`}
                      onClick={() => setSelectedDate(thisDate)}
                      className={`min-h-[85px] sm:min-h-[105px] p-2 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected
                          ? 'border-white bg-neutral-900 shadow-[0_0_15px_rgba(255,255,255,0.08)] ring-1 ring-white'
                          : isToday
                          ? 'border-neutral-600 bg-neutral-900/40 hover:border-neutral-400'
                          : 'border-neutral-900 hover:border-neutral-700 bg-neutral-950/60 hover:bg-neutral-900/20'
                      }`}
                    >
                      {/* Cabecera del día */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-xs font-medium ${
                            isToday
                              ? 'w-6 h-6 rounded-full bg-white text-neutral-950 flex items-center justify-center font-bold'
                              : isSelected
                              ? 'text-white font-bold'
                              : 'text-neutral-300'
                          }`}
                        >
                          {d}
                        </span>

                        {hasUrgent && (
                          <span
                            className="w-2 h-2 rounded-full bg-red-400 animate-pulse"
                            title="Compromiso urgente"
                          />
                        )}
                      </div>

                      {/* Chips de tareas del día */}
                      <div className="space-y-1 my-1 overflow-hidden">
                        {dayTasks.slice(0, 2).map((t) => (
                          <div
                            key={t._id}
                            className={`px-1.5 py-0.5 text-[9px] font-mono truncate border rounded-xs ${getCategoryColor(
                              t.category
                            )} ${t.status === 'completado' ? 'line-through opacity-50' : ''}`}
                            title={t.title}
                          >
                            {t.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <span className="text-[9px] font-mono text-neutral-400 block px-1">
                            +{dayTasks.length - 2} más
                          </span>
                        )}
                      </div>

                      {/* Footer indicador sutil */}
                      <div className="text-[9px] font-mono text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-900">
                        {dayTasks.length > 0 ? (
                          <span className={hasPending ? 'text-[#785633] dark:text-[#deb88f] font-semibold' : 'text-[#a6825a] dark:text-[#c8a882] font-semibold'}>
                            {dayTasks.length} {dayTasks.length === 1 ? 'actividad' : 'actividades'}
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400">
                            + Añadir
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Días del mes siguiente */}
                {nextMonthDays.map((d) => (
                  <div
                    key={`next-${d}`}
                    className="min-h-[75px] sm:min-h-[90px] p-1.5 border border-neutral-900 bg-neutral-950/30 text-neutral-700 font-mono text-xs flex flex-col justify-between opacity-40 cursor-not-allowed"
                  >
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspector Lateral: Agenda del Día Seleccionado */}
            <div className="bg-neutral-950 border border-neutral-800 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                      Agenda del Día
                    </span>
                    <h2 className="text-xl font-light text-white uppercase mt-0.5">
                      {selectedDate.toLocaleDateString('es-AR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setNewTaskForm((prev) => ({
                        ...prev,
                        dueDate: selectedKey,
                      }));
                      setShowAddModal(true);
                    }}
                    className="p-2 border border-neutral-700 hover:border-white bg-neutral-900 text-white transition-colors"
                    title="Añadir tarea a este día"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Lista de tareas del día */}
                {selectedDayTasks.length === 0 ? (
                  <div className="py-12 text-center space-y-3 border border-dashed border-neutral-800 p-6">
                    <CalendarDays className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Sin actividades para este día
                    </p>
                    <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                      Haz clic en el botón superior para programar una visita a obra, visado o trámite.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDayTasks.map((t) => (
                      <div
                        key={t._id}
                        className={`p-4 border transition-all ${
                          t.status === 'completado'
                            ? 'bg-neutral-950/50 border-neutral-900 opacity-60'
                            : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTaskStatus(t)}
                            className="mt-0.5 text-neutral-400 hover:text-white transition-colors shrink-0"
                          >
                            {t.status === 'completado' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-neutral-500" />
                            )}
                          </button>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-xs font-medium text-white ${
                                  t.status === 'completado' ? 'line-through text-neutral-500' : ''
                                }`}
                              >
                                {t.title}
                              </span>
                              <span
                                className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${getCategoryColor(
                                  t.category
                                )}`}
                              >
                                {getCategoryLabel(t.category)}
                              </span>
                            </div>

                            {t.projectTrackingCode && (
                              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                                <Link
                                  href={`/admin/proyectos/${t.projectTrackingCode}`}
                                  className="text-neutral-300 hover:text-white underline flex items-center gap-1"
                                >
                                  <span>{t.projectTrackingCode}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </Link>
                              </div>
                            )}

                            {t.notes && (
                              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                                {t.notes}
                              </p>
                            )}

                            {/* Subitems checklist */}
                            {t.checklistSubitems && t.checklistSubitems.length > 0 && (
                              <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                                {t.checklistSubitems.map((sub: any) => (
                                  <div
                                    key={sub.id}
                                    className="flex items-center gap-2 text-[10px] font-mono text-neutral-400"
                                  >
                                    <span className={sub.isDone ? 'text-emerald-400' : 'text-neutral-600'}>
                                      {sub.isDone ? '✓' : '○'}
                                    </span>
                                    <span className={sub.isDone ? 'line-through' : ''}>{sub.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4 pt-1 text-[10px] font-mono text-neutral-400">
                              {t.estimatedHours && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{t.estimatedHours} hs estimadas</span>
                                </span>
                              )}
                              <span
                                className={`uppercase tracking-wider font-medium ${
                                  t.priority === 'urgente'
                                    ? 'text-red-500 dark:text-red-400 font-bold'
                                    : t.priority === 'alta'
                                    ? 'text-[#8f683d] dark:text-[#deb88f]'
                                    : 'text-neutral-500 dark:text-neutral-400'
                                }`}
                              >
                                Prioridad {t.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tips de gestión para el arquitecto */}
              <div className="pt-6 border-t border-neutral-900 mt-6 text-neutral-400 text-[11px] font-mono space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Criterio Metódico Acromático</span>
                </div>
                <p className="font-light">
                  Los trámites municipales en Tigre y Pilar tienen tiempos de resolución de 15 a 20 días hábiles.
                  Programa los recordatorios con antelación para evitar pausas en obra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal para Crear Nueva Tarea / Compromiso */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-white" />
                <h3 className="text-base font-medium text-white uppercase tracking-tight">
                  Nuevo Compromiso en Agenda
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Título de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Inspección de armaduras de losa en San Sebastián"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:border-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newTaskForm.category}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:border-white focus:outline-hidden"
                  >
                    <option value="tramite_municipal">Trámite Municipal</option>
                    <option value="capba">Colegio CAPBA D4</option>
                    <option value="visita_obra">Inspección / Visita de Obra</option>
                    <option value="renders_3d">Renders 3D</option>
                    <option value="dibujo_cad">Planos CAD / Ejecutivo</option>
                    <option value="reunion_cliente">Reunión con Cliente</option>
                    <option value="gestion_personal">Gestión Técnica Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:border-white focus:outline-hidden"
                  >
                    <option value="urgente">Urgente (Bloqueante)</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:border-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Proyecto Asociado
                  </label>
                  <select
                    value={newTaskForm.projectTrackingCode}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, projectTrackingCode: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:border-white focus:outline-hidden"
                  >
                    <option value="">(Ninguno / Tarea General)</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p.trackingCode}>
                        {p.trackingCode} - {p.client?.name || p.location?.neighborhood || 'Proyecto'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Notas / Recordatorios Técnicos
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre documentación requerida, personas de contacto o planos..."
                  value={newTaskForm.notes}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:border-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-mono uppercase transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submittingTask}
                  className="px-6 py-2 bg-white text-neutral-950 font-mono text-xs uppercase font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingTask && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar en Agenda</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCalendarioPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-mono text-xs">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
            <span>Cargando Agenda & Calendario Acromático...</span>
          </div>
        </div>
      }
    >
      <CalendarContent />
    </React.Suspense>
  );
}
