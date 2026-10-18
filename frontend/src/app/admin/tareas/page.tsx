'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { api } from '@/lib/api';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  AlertTriangle,
  FolderGit2,
  Trash2,
  CheckCircle2,
  Filter,
  Check,
  ChevronDown,
  X,
  Loader2,
} from 'lucide-react';

export default function AdminTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State para nueva tarea
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'tramite_municipal',
    priority: 'alta',
    projectTrackingCode: '',
    estimatedHours: 2,
    dueDate: '',
    notes: '',
    subitemsText: '',
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      await api.getMe();
      const res = await api.getTasks();
      setTasks(res.tasks || []);
    } catch (e) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [router]);

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completado' ? 'pendiente' : 'completado';
    try {
      await api.updateTask(taskId, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t))
      );
    } catch (e) {
      alert('Error al actualizar el estado de la tarea');
    }
  };

  const handleToggleSubitem = async (taskId: string, subitemId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const updatedSubitems = task.checklistSubitems?.map((sub: any) =>
      sub.id === subitemId ? { ...sub, isDone: !sub.isDone } : sub
    );

    try {
      await api.updateTask(taskId, { checklistSubitems: updatedSubitems });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, checklistSubitems: updatedSubitems } : t
        )
      );
    } catch (e) {
      alert('Error al actualizar subtarea');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('¿Eliminar esta tarea del planificador?')) return;
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (e) {
      alert('Error al eliminar la tarea');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setSubmitting(true);
    try {
      // Parsear subtareas por salto de línea
      const subitems = newTask.subitemsText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((text, idx) => ({
          id: `sub-${Date.now()}-${idx}`,
          text,
          isDone: false,
        }));

      const payload = {
        title: newTask.title.trim(),
        category: newTask.category,
        priority: newTask.priority,
        projectTrackingCode: newTask.projectTrackingCode.trim() || undefined,
        estimatedHours: Number(newTask.estimatedHours) || 1,
        dueDate: newTask.dueDate || undefined,
        notes: newTask.notes.trim() || undefined,
        checklistSubitems: subitems,
      };

      const res = await api.createTask(payload);
      if (res.task) {
        setTasks([res.task, ...tasks]);
        setModalOpen(false);
        setNewTask({
          title: '',
          category: 'tramite_municipal',
          priority: 'alta',
          projectTrackingCode: '',
          estimatedHours: 2,
          dueDate: '',
          notes: '',
          subitemsText: '',
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error al crear tarea');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'todas', label: 'Todas las Categorías' },
    { id: 'tramite_municipal', label: 'Trámite Municipal' },
    { id: 'dibujo_cad', label: 'Dibujo CAD / BIM' },
    { id: 'renders_3d', label: 'Renders 3D' },
    { id: 'capba', label: 'Liquidación CAPBA D4' },
    { id: 'visita_obra', label: 'Visita de Obra' },
    { id: 'gestion_personal', label: 'Gestión Personal' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory === 'todas') return true;
    return t.category === selectedCategory;
  });

  // Agrupadas por prioridad
  const urgentTasks = filteredTasks.filter((t) => t.priority === 'urgente');
  const highTasks = filteredTasks.filter((t) => t.priority === 'alta');
  const mediumTasks = filteredTasks.filter((t) => t.priority === 'media' || t.priority === 'baja');

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 md:pb-10 overflow-y-auto w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-neutral-900 gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">
              <span>Organización Personal & Metódica</span>
              <span>·</span>
              <span className="text-emerald-400">Planificador del Arquitecto</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-white">
              Gestión de <span className="font-semibold text-neutral-200">Tareas & Prioridades</span>
            </h1>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Tarea Metódica</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 my-8 p-4 bg-neutral-900/30 border border-neutral-800/80">
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 transition-colors border ${
                  selectedCategory === c.id
                    ? 'border-white bg-neutral-800 text-white font-medium'
                    : 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-neutral-400">
            Total: <strong className="text-white">{filteredTasks.length}</strong> tareas
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Cargando tareas del arquitecto...</span>
          </div>
        ) : (
          <div className="space-y-10">
            {/* 1. SECCIÓN URGENTE */}
            {urgentTasks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Prioridad Urgente · Resolver Hoy ({urgentTasks.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {urgentTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleTaskStatus}
                      onToggleSubitem={handleToggleSubitem}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. SECCIÓN ALTA */}
            {highTasks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Prioridad Alta · Esta Semana ({highTasks.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleTaskStatus}
                      onToggleSubitem={handleToggleSubitem}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. SECCIÓN MEDIA Y PLANIFICACIÓN */}
            {mediumTasks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
                  <span>Prioridad Media & Seguimiento ({mediumTasks.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleTaskStatus}
                      onToggleSubitem={handleToggleSubitem}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredTasks.length === 0 && (
              <div className="py-20 text-center text-xs font-mono text-neutral-500 border border-neutral-900">
                No hay tareas en esta categoría. Puedes crear una nueva tarea con el botón superior.
              </div>
            )}
          </div>
        )}

        {/* Modal Crear Tarea */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <h3 className="text-base font-light uppercase tracking-tight text-white">
                  Nueva Tarea Metódica
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Título de la Tarea *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Ej: Ajustar memoria técnica para expediente Tigre"
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Categoría:
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none"
                    >
                      <option value="tramite_municipal">Trámite Municipal</option>
                      <option value="dibujo_cad">Dibujo CAD / BIM</option>
                      <option value="renders_3d">Renders 3D</option>
                      <option value="capba">Liquidación CAPBA D4</option>
                      <option value="visita_obra">Visita de Obra</option>
                      <option value="gestion_personal">Gestión Personal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Prioridad:
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none"
                    >
                      <option value="urgente">Urgente (Hoy)</option>
                      <option value="alta">Alta (Esta Semana)</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Código Proyecto (Opcional):
                    </label>
                    <input
                      type="text"
                      value={newTask.projectTrackingCode}
                      onChange={(e) => setNewTask({ ...newTask, projectTrackingCode: e.target.value })}
                      placeholder="Ej: ACR-2025-0108"
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Horas Estimadas:
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={newTask.estimatedHours}
                      onChange={(e) => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Subtareas / Pasos de Verificación (Un paso por línea):
                  </label>
                  <textarea
                    rows={3}
                    value={newTask.subitemsText}
                    onChange={(e) => setNewTask({ ...newTask, subitemsText: e.target.value })}
                    placeholder="Paso 1: Verificar balance de superficies&#10;Paso 2: Firmar carátula digital&#10;Paso 3: Notificar al cliente"
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white font-mono text-xs focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Notas adicionales (Opcional):
                  </label>
                  <input
                    type="text"
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    placeholder="Detalles técnicos o números de expediente..."
                    className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 font-mono">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-white text-neutral-950 font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Guardar Tarea</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getTaskCategoryBadge(cat: string) {
  switch (cat) {
    case 'tramite_municipal':
      return 'bg-[#ede2d2] dark:bg-stone-900 border-[#a6825a] text-[#4d3215] dark:text-[#ebd6be]';
    case 'capba':
      return 'bg-[#f0e7dc] dark:bg-neutral-900 border-[#b58f62] text-[#5e3d1c] dark:text-[#dfc29f]';
    case 'visita_obra':
      return 'bg-[#f4ece1] dark:bg-amber-950/60 border-[#c8a882] text-[#6b4721] dark:text-[#f3e7d3]';
    case 'renders_3d':
    case 'dibujo_cad':
      return 'bg-[#e8decb] dark:bg-neutral-900 border-[#8a6842] text-[#3f2b15] dark:text-[#eedac0]';
    case 'reunion_cliente':
      return 'bg-[#f9f3eb] dark:bg-neutral-900 border-[#9e7a50] text-[#553617] dark:text-[#f8ecdc]';
    default:
      return 'bg-[#eee8de] dark:bg-neutral-900 border-[#7d5d37] text-[#3b2711] dark:text-[#e4cfb7]';
  }
}

function TaskCard({
  task,
  onToggleStatus,
  onToggleSubitem,
  onDelete,
}: {
  task: any;
  onToggleStatus: (id: string, st: string) => void;
  onToggleSubitem: (taskId: string, subId: string) => void;
  onDelete: (id: string) => void;
}) {
  const isDone = task.status === 'completado';

  return (
    <div
      className={`p-5 bg-neutral-900/50 border transition-all space-y-4 ${
        isDone
          ? 'border-neutral-900 opacity-60'
          : task.priority === 'urgente'
          ? 'border-red-900/60 hover:border-red-600'
          : 'border-neutral-800 hover:border-neutral-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleStatus(task._id, task.status)}
            className={`w-5 h-5 border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
              isDone
                ? 'bg-emerald-500 border-emerald-500 text-black'
                : 'border-neutral-700 hover:border-white'
            }`}
          >
            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase font-medium ${getTaskCategoryBadge(task.category)}`}>
                {task.category?.replace('_', ' ')}
              </span>
              {task.projectTrackingCode && (
                <span className="text-[10px] font-mono text-neutral-300 font-semibold">
                  {task.projectTrackingCode}
                </span>
              )}
            </div>

            <h3
              className={`text-sm font-medium ${
                isDone ? 'line-through text-neutral-500' : 'text-white'
              }`}
            >
              {task.title}
            </h3>
          </div>
        </div>

        <button
          onClick={() => onDelete(task._id)}
          className="text-neutral-600 hover:text-red-400 transition-colors p-1"
          title="Eliminar tarea"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtasks checklist */}
      {task.checklistSubitems?.length > 0 && (
        <div className="space-y-1.5 pl-8 pt-1 border-t border-neutral-900">
          {task.checklistSubitems.map((sub: any) => (
            <div
              key={sub.id}
              onClick={() => onToggleSubitem(task._id, sub.id)}
              className="flex items-center gap-2 text-xs font-mono text-neutral-400 cursor-pointer hover:text-white"
            >
              <div
                className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                  sub.isDone ? 'bg-white border-white text-black' : 'border-neutral-700'
                }`}
              >
                {sub.isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span className={sub.isDone ? 'line-through text-neutral-600' : ''}>
                {sub.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-900">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>{task.estimatedHours}h est.</span>
        </div>

        {task.notes && <span className="truncate max-w-[200px]">{task.notes}</span>}
      </div>
    </div>
  );
}
