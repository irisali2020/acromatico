'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { api } from '@/lib/api';
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Loader2,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Pencil,
  Check,
  AlertCircle,
  Home,
  FileCheck,
  Layers,
  Building2,
  UtensilsCrossed,
  Compass,
  Wrench,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

// Mapeo dinámico de iconos disponibles para servicios
const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  FileCheck,
  Layers,
  Building2,
  UtensilsCrossed,
  Compass,
  Briefcase,
  Wrench,
  Sparkles,
  ShieldCheck,
};

const AVAILABLE_ICONS = [
  { id: 'Home', label: 'Residencial', Icon: Home },
  { id: 'FileCheck', label: 'Trámites / Planos', Icon: FileCheck },
  { id: 'Layers', label: 'Interiores / Mobiliario', Icon: Layers },
  { id: 'Building2', label: 'Corporativo / Oficinas', Icon: Building2 },
  { id: 'UtensilsCrossed', label: 'Gastronomía / Locales', Icon: UtensilsCrossed },
  { id: 'Compass', label: 'Urbanismo / Factibilidad', Icon: Compass },
  { id: 'Briefcase', label: 'Gestión / Asesoría', Icon: Briefcase },
  { id: 'Wrench', label: 'Dirección de Obra', Icon: Wrench },
  { id: 'Sparkles', label: 'Diseño de Autor', Icon: Sparkles },
];

export default function AdminServicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [visibilityFilter, setVisibilityFilter] = useState<'todos' | 'visibles' | 'ocultos'>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Formulario inicial de servicio
  const initialFormState = {
    num: '06',
    icon: 'Compass',
    title: '',
    subtitle: '',
    desc: '',
    badge: 'Nuevo Servicio',
    featuresStr:
      'Estudio de asoleamiento y balance de superficies\nVerificación técnica ante código municipal\nInforme de factibilidad y costos preliminares\nAcompañamiento en la compra del lote',
    isVisible: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchServices = async () => {
    setLoading(true);
    try {
      try {
        await api.getMe();
      } catch (authErr) {
        router.push('/admin');
        return;
      }
      // Traer todos los servicios incluyendo los ocultos
      const res = await api.getServices({ includeHidden: 'true' });
      setServices(res.services || []);
    } catch (err: any) {
      console.warn('Error al cargar servicios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [router]);

  // Abrir modal en modo creación
  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      ...initialFormState,
      num: String(services.length + 1).padStart(2, '0'),
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  // Abrir modal en modo edición
  const handleOpenEdit = (srv: any) => {
    setEditingService(srv);
    setErrorMsg('');
    setFormData({
      num: srv.num || '01',
      icon: srv.icon || 'Home',
      title: srv.title || '',
      subtitle: srv.subtitle || '',
      desc: srv.desc || '',
      badge: srv.badge || '',
      featuresStr: Array.isArray(srv.features) ? srv.features.join('\n') : '',
      isVisible: srv.isVisible !== false,
    });
    setModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const features = formData.featuresStr
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        num: formData.num.trim(),
        icon: formData.icon,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        desc: formData.desc.trim(),
        badge: formData.badge.trim(),
        features,
        isVisible: Boolean(formData.isVisible),
      };

      if (editingService) {
        const targetId = editingService._id || editingService.id;
        const res = await api.updateService(targetId, payload);
        if (res.success) {
          setSuccessToast(`¡Servicio "${formData.title}" actualizado con éxito!`);
          setTimeout(() => setSuccessToast(''), 4500);

          setServices((prev) =>
            prev.map((s) =>
              (s._id || s.id) === targetId ? { ...s, ...payload, updatedAt: new Date() } : s
            )
          );
          setModalOpen(false);
          setEditingService(null);
        }
      } else {
        const res = await api.createService(payload);
        if (res.success) {
          setSuccessToast(`¡Servicio "${formData.title}" creado y publicado en la web!`);
          setTimeout(() => setSuccessToast(''), 4500);

          setModalOpen(false);
          fetchServices();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el servicio. Verifica los datos.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle rápido de visibilidad mediante switch
  const handleToggleVisibility = async (srv: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetId = srv._id || srv.id;
    const currentVis = srv.isVisible !== false;
    const nextVis = !currentVis;

    setTogglingId(targetId);

    // Actualización optimista de interfaz
    setServices((prev) =>
      prev.map((s) => ((s._id || s.id) === targetId ? { ...s, isVisible: nextVis } : s))
    );

    try {
      const res = await api.updateService(targetId, { isVisible: nextVis });
      if (res.success) {
        setSuccessToast(
          nextVis
            ? `✓ Servicio "${srv.title}" ahora está visible en la web.`
            : `⊘ Servicio "${srv.title}" ocultado de la web pública.`
        );
        setTimeout(() => setSuccessToast(''), 3500);
      }
    } catch (err: any) {
      // Revertir estado si falló
      setServices((prev) =>
        prev.map((s) => ((s._id || s.id) === targetId ? { ...s, isVisible: currentVis } : s))
      );
      alert('Error al modificar visibilidad: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el servicio "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteService(id);
      setSuccessToast(`Servicio eliminado del catálogo.`);
      setTimeout(() => setSuccessToast(''), 3000);
      setServices((prev) => prev.filter((s) => s._id !== id && s.id !== id));
    } catch (err: any) {
      alert('Error al eliminar servicio: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const autofillExample = () => {
    setFormData({
      num: String(services.length + 1).padStart(2, '0'),
      icon: 'Compass',
      title: 'Consultoría de Factibilidad & Elección de Terreno',
      subtitle: 'Evaluación Técnica Previa a la Compra en Barrios Cerrados',
      desc: 'Acompañamos tu decisión de inversión antes de comprar. Analizamos el asoleamiento óptimo, restricciones hídricas, pendientes naturales y retiros de edificación reglamentarios.',
      badge: 'Asesoría Integral',
      featuresStr:
        'Inspección ocular del lote y estudio preliminar de suelo\nRevisión minuciosa del reglamento interno de edificación\nEvaluación de retiros de frente, fondo y linderos\nEstimación volumétrica y presupuesto orientativo de obra',
      isVisible: true,
    });
  };

  const filteredServices = services.filter((s) => {
    const isVis = s.isVisible !== false;
    if (visibilityFilter === 'visibles') return isVis;
    if (visibilityFilter === 'ocultos') return !isVis;
    return true;
  });

  const visibleCount = services.filter((s) => s.isVisible !== false).length;
  const hiddenCount = services.filter((s) => s.isVisible === false).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 md:pb-10 overflow-y-auto w-full max-w-full overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-neutral-900 gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">
              <span>Gestión de Contenido Web</span>
              <span>·</span>
              <span className="text-emerald-400">Servicios Arquitectónicos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-white">
              Servicios del <span className="font-semibold text-neutral-200">Estudio</span>
            </h1>
            <p className="text-xs text-neutral-400 font-light mt-1 max-w-xl">
              Crea, modifica y activa/desactiva la publicación de las especialidades del estudio mostradas a los clientes en la sección "Servicios Arquitectónicos".
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchServices}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Actualizar listado"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              href="/#servicios"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Ver en la Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(200,168,130,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-950" />
              <span>Cargar Nuevo Servicio</span>
            </button>
          </div>
        </div>

        {/* Notificación Toast */}
        {successToast && (
          <div className="my-6 p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center justify-between shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Métricas del Módulo de Servicios */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 my-8">
          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
              Total Servicios
            </span>
            <span className="text-2xl font-light font-mono text-white">
              {services.length}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Especialidades registradas</span>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-emerald-950/70 shadow-[inset_0_0_15px_rgba(200,168,130,0.06)]">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
              Activos en la Web
            </span>
            <span className="text-2xl font-light font-mono text-emerald-400">
              {visibleCount}
            </span>
            <span className="text-[10px] text-emerald-500/80 block mt-0.5">Publicados para cotizar</span>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
              Ocultos
            </span>
            <span className="text-2xl font-light font-mono text-neutral-300">
              {hiddenCount}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Fuera de la portada</span>
          </div>
        </div>

        {/* Filtros de Visibilidad */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <button
              onClick={() => setVisibilityFilter('todos')}
              className={`px-3.5 py-2 border transition-all cursor-pointer ${
                visibilityFilter === 'todos'
                  ? 'border-white bg-white text-neutral-950 font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white'
              }`}
            >
              Todos ({services.length})
            </button>
            <button
              onClick={() => setVisibilityFilter('visibles')}
              className={`px-3.5 py-2 border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibilityFilter === 'visibles'
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-emerald-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Activos ({visibleCount})</span>
            </button>
            <button
              onClick={() => setVisibilityFilter('ocultos')}
              className={`px-3.5 py-2 border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibilityFilter === 'ocultos'
                  ? 'border-neutral-500 bg-neutral-800 text-white font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
              <span>Ocultos ({hiddenCount})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            Mostrando {filteredServices.length} servicios
          </span>
        </div>

        {/* Grilla de Servicios */}
        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Cargando servicios del estudio...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-20 text-center p-8 border border-neutral-800 bg-neutral-900/20 max-w-md mx-auto space-y-4">
            <Briefcase className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs font-mono text-neutral-400">
              No hay servicios que coincidan con los filtros seleccionados.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-white text-neutral-950 font-mono text-xs uppercase font-bold cursor-pointer"
            >
              Cargar Nuevo Servicio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => {
              const isVis = srv.isVisible !== false;
              const srvId = srv._id || srv.id;
              const IconComponent = ICON_MAP[srv.icon] || Briefcase;

              return (
                <div
                  key={srvId}
                  className={`border transition-all flex flex-col justify-between overflow-hidden shadow-lg ${
                    isVis
                      ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-600'
                      : 'bg-neutral-950/60 border-neutral-800/60 opacity-85'
                  }`}
                >
                  <div className="p-6">
                    {/* Header de Card: Número y Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-xs text-neutral-400 tracking-wider">
                        [{srv.num}]
                      </span>
                      <div className="flex items-center gap-2">
                        {srv.badge && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase tracking-widest font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{srv.badge}</span>
                          </span>
                        )}
                        {!isVis && (
                          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-neutral-900 text-amber-400 border border-amber-600/40 flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Oculto</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Icono del servicio */}
                    <div className="w-10 h-10 border border-neutral-700 bg-neutral-950 flex items-center justify-center mb-4 text-emerald-400">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Título y Subtítulo */}
                    <h3 className="text-base font-medium text-white mb-1.5 uppercase tracking-tight">
                      {srv.title}
                    </h3>
                    <h4 className="text-xs font-mono text-emerald-400/90 mb-3 tracking-normal">
                      {srv.subtitle}
                    </h4>

                    {/* Descripción */}
                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-5 line-clamp-3">
                      {srv.desc}
                    </p>

                    {/* Características / Entregables */}
                    <div className="space-y-1.5 pt-4 border-t border-neutral-800/80">
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-2">
                        Entregables Clave:
                      </span>
                      {srv.features?.slice(0, 4).map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Card con Switch y Acciones */}
                  <div className="p-4 bg-neutral-950/90 border-t border-neutral-800 flex items-center justify-between gap-3 text-xs font-mono">
                    {/* Switch de Publicación en Web */}
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isVis}
                        onClick={(e) => handleToggleVisibility(srv, e)}
                        disabled={togglingId === srvId}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                          isVis
                            ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_12px_rgba(200,168,130,0.35)]'
                            : 'bg-neutral-800 border-neutral-700'
                        }`}
                        title={isVis ? 'Clic para ocultar de la web' : 'Clic para activar en la web'}
                      >
                        <span className="sr-only">Visibilidad web</span>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                            isVis ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        >
                          {togglingId === srvId && (
                            <Loader2 className="w-3 h-3 text-neutral-800 animate-spin" />
                          )}
                        </span>
                      </button>

                      <div className="flex flex-col">
                        <span className="text-[11px] font-mono font-medium leading-tight text-white flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isVis ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
                            }`}
                          />
                          {isVis ? 'Publicado' : 'Oculto'}
                        </span>
                        <span className="text-[9px] text-neutral-500 font-mono">
                          {isVis ? 'Visible en portada' : 'No se muestra'}
                        </span>
                      </div>
                    </div>

                    {/* Botones de Editar y Eliminar */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 px-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-mono"
                        title="Editar información del servicio"
                      >
                        <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(srvId, srv.title)}
                        disabled={deletingId === srvId}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors cursor-pointer"
                        title="Eliminar servicio"
                      >
                        {deletingId === srvId ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL PARA CREAR O EDITAR SERVICIO */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col overflow-hidden text-white relative"
          >
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  {editingService ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-light uppercase text-white tracking-wide">
                    {editingService ? `Editar Servicio: ${editingService.title}` : 'Cargar Nuevo Servicio Arquitectónico'}
                  </h2>
                  <p className="text-[11px] font-mono text-neutral-400">
                    {editingService
                      ? 'Actualiza los textos, entregables o activa/desactiva la publicación'
                      : 'Se publicará en la sección "Servicios Arquitectónicos" de la web'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!editingService && (
                  <button
                    type="button"
                    onClick={autofillExample}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-[11px] transition-colors cursor-pointer"
                    title="Autocompletar con ejemplo de servicio"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Autocompletar Ejemplo</span>
                  </button>
                )}

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  aria-label="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitService} className="p-6 overflow-y-auto flex-1 space-y-6">
              {errorMsg && (
                <div className="p-3.5 bg-red-950/50 border border-red-800 text-red-200 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Fila 0: Switch de Publicación en el Modal */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white block">
                    Publicación en la Web
                  </span>
                  <span className="text-[11px] text-neutral-400 font-light">
                    {formData.isVisible
                      ? 'El servicio está activo y visible para los clientes en la portada principal.'
                      : 'El servicio está oculto temporalmente y no se mostrará a los visitantes.'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.isVisible}
                    onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.isVisible
                        ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(200,168,130,0.4)]'
                        : 'bg-neutral-800 border-neutral-700'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        formData.isVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="font-mono text-xs text-neutral-300">
                    {formData.isVisible ? 'Visible' : 'Oculto'}
                  </span>
                </div>
              </div>

              {/* Fila 1: Número, Título y Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.num}
                    onChange={(e) => setFormData({ ...formData, num: e.target.value })}
                    placeholder="06"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Título del Servicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Dirección Técnica de Obra & Certificaciones"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Badge / Tag Destacado
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ej: Llave en Mano"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Fila 2: Subtítulo */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Subtítulo Descriptivo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Ej: Control de Calidad en Hormigón, Certificaciones Quincenales & Gremios"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Fila 3: Selector de Icono Arquitectónico */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Icono Representativo *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {AVAILABLE_ICONS.map(({ id, label, Icon }) => {
                    const isSelected = formData.icon === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: id })}
                        className={`p-2.5 border text-left flex items-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : ''}`} />
                        <span className="truncate text-[11px]">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fila 4: Descripción */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Descripción Conceptual del Servicio *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Explica qué incluye este servicio y cómo resuelve las necesidades del cliente..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 p-3 text-xs text-white focus:outline-none transition-colors resize-none font-light leading-relaxed"
                />
              </div>

              {/* Fila 5: Entregables / Características (1 por línea) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Entregables / Puntos Clave (1 por línea, se verán con tilde en la tarjeta)
                </label>
                <textarea
                  rows={4}
                  value={formData.featuresStr}
                  onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                  placeholder="Planos de replanteo y carpinterías&#10;Modelado 3D fotorrealista&#10;Gestión ante municipio y CAPBA&#10;Supervisión en obra semanal"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 p-3 text-xs text-white focus:outline-none transition-colors resize-none font-light leading-relaxed"
                />
              </div>

              {/* Botón de Submit */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-800 text-neutral-400 hover:text-white font-mono text-xs uppercase cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-white text-neutral-950 hover:bg-neutral-200 font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                      <span>{editingService ? 'Guardando cambios...' : 'Publicando servicio...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{editingService ? 'Guardar Cambios' : 'Publicar Servicio en la Web'}</span>
                      <Check className="w-4 h-4 text-neutral-950" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
