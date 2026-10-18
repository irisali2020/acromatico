'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { api } from '@/lib/api';
import {
  Layers,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Ruler,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Building,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Pencil,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'todos' | 'vivienda' | 'interior' | 'comercial'>('todos');
  const [visibilityFilter, setVisibilityFilter] = useState<'todos' | 'visibles' | 'ocultos'>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Formulario inicial de obra
  const initialFormState = {
    title: '',
    category: 'vivienda',
    location: '',
    municipality: 'Pilar',
    m2: '',
    year: '2025',
    image: '',
    description: '',
    approval: 'Plano Aprobado Obras Particulares & CAPBA D4',
    highlightsStr:
      'Hormigón visto fenólico con buñas milimétricas\nGrandes paños vidriados con DVH y protección solar\nGalería con parrilla orientada al asoleamiento óptimo',
    tagsStr: 'Hormigón Visto, Doble Altura, Piscina, Plano Aprobado',
    isVisible: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Presets de imágenes de Acromático Estudio para carga rápida
  const imagePresets = [
    {
      label: 'Hormigón & Doble Altura (San Sebastián)',
      url: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000094-135791357b/700/UF%20SS%20A01%20L108%20-%20Render%20v02%2001-0.jpeg',
    },
    {
      label: 'Residencia Frente a Laguna (Lagoon Pilar)',
      url: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000490-ba995ba997/700/UF%20Lagoon%20L038%20-%20Fotos%20%2836%29-3.jpeg',
    },
    {
      label: 'Cocina & Mobiliario de Autor (San Sebastián)',
      url: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000501-b063cb063e/700/UF%20SS%20A06%20L188%20-%20Fotos%20%281%29-9.jpeg',
    },
    {
      label: 'Racionalismo en Lote Central (CVC Tigre)',
      url: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000076-116c3116c5/700/UF%20CVC%20L340%20-%20R02%20-%20Render%2003-9.jpeg',
    },
    {
      label: 'Oficinas & Tabiquería Vidriada (Libertador)',
      url: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000518-251f3251f5/700/UF%20SS%20A06%20L243%20-%20Fotos%20%281%29-7.jpeg',
    },
    {
      label: 'Gastronomía & Barra Monolítica (San Isidro)',
      url: 'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000451-3a3383a33a/700/UF%20SS%20A02%20L148%20-%20Fotos%20%288%29-8.jpeg',
    },
  ];

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      try {
        await api.getMe();
      } catch (authErr) {
        router.push('/admin');
        return;
      }
      // Incluir también las obras ocultas para que el admin pueda gestionarlas
      const res = await api.getPortfolio({ includeHidden: 'true' });
      setProjects(res.projects || []);
    } catch (err: any) {
      console.warn('Error al cargar portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [router]);

  // Abrir modal en modo crear
  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData(initialFormState);
    setErrorMsg('');
    setModalOpen(true);
  };

  // Abrir modal en modo edición con datos precargados
  const handleOpenEdit = (proj: any) => {
    setEditingProject(proj);
    setErrorMsg('');
    setFormData({
      title: proj.title || '',
      category: proj.category || 'vivienda',
      location: proj.location || '',
      municipality: proj.municipality || 'Pilar',
      m2: proj.m2 || '',
      year: proj.year || '2025',
      image: proj.image || '',
      description: proj.description || '',
      approval: proj.approval || 'Plano Aprobado Obras Particulares & CAPBA D4',
      highlightsStr: Array.isArray(proj.highlights) ? proj.highlights.join('\n') : '',
      tagsStr: Array.isArray(proj.tags) ? proj.tags.join(', ') : '',
      isVisible: proj.isVisible !== false,
    });
    setModalOpen(true);
  };

  // Guardar creación o actualización
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const highlights = formData.highlightsStr
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const tags = formData.tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        location: formData.location.trim(),
        municipality: formData.municipality.trim(),
        m2: formData.m2.trim(),
        year: formData.year.trim(),
        image: formData.image.trim(),
        description: formData.description.trim(),
        approval: formData.approval.trim(),
        highlights,
        tags,
        isVisible: Boolean(formData.isVisible),
      };

      if (editingProject) {
        // Actualizar obra existente
        const targetId = editingProject._id || editingProject.id;
        const res = await api.updatePortfolio(targetId, payload);
        if (res.success) {
          setSuccessToast(`¡Obra "${formData.title}" actualizada con éxito!`);
          setTimeout(() => setSuccessToast(''), 4500);

          setProjects((prev) =>
            prev.map((p) =>
              (p._id || p.id) === targetId ? { ...p, ...payload, updatedAt: new Date() } : p
            )
          );
          setModalOpen(false);
          setEditingProject(null);
        }
      } else {
        // Crear nueva obra
        const res = await api.createPortfolio(payload);
        if (res.success) {
          setSuccessToast(`¡Obra "${formData.title}" publicada con éxito en la web!`);
          setTimeout(() => setSuccessToast(''), 4500);

          setFormData(initialFormState);
          setModalOpen(false);
          fetchPortfolio();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar la obra. Verifica los datos.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle rápido de visibilidad mediante switch en la card
  const handleToggleVisibility = async (proj: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetId = proj._id || proj.id;
    const currentVis = proj.isVisible !== false;
    const nextVis = !currentVis;

    setTogglingId(targetId);

    // Actualización optimista de interfaz
    setProjects((prev) =>
      prev.map((p) => ((p._id || p.id) === targetId ? { ...p, isVisible: nextVis } : p))
    );

    try {
      const res = await api.updatePortfolio(targetId, { isVisible: nextVis });
      if (res.success) {
        setSuccessToast(
          nextVis
            ? `✓ Obra "${proj.title}" visible ahora en la web pública.`
            : `⊘ Obra "${proj.title}" ocultada del portafolio público.`
        );
        setTimeout(() => setSuccessToast(''), 3500);
      }
    } catch (err: any) {
      // Revertir en caso de error
      setProjects((prev) =>
        prev.map((p) => ((p._id || p.id) === targetId ? { ...p, isVisible: currentVis } : p))
      );
      alert('Error al modificar visibilidad: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la obra "${title}" del portafolio web?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deletePortfolio(id);
      setSuccessToast(`Obra eliminada del catálogo.`);
      setTimeout(() => setSuccessToast(''), 3000);
      setProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
    } catch (err: any) {
      alert('Error al eliminar obra: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const autofillExample = () => {
    setFormData({
      title: 'UF Puertos del Lago - Marinas L210',
      category: 'vivienda',
      location: 'Escobar · Puertos del Lago (Barrio Marinas)',
      municipality: 'Escobar',
      m2: '280 m² Cubiertos + 55 m² Galería',
      year: '2025',
      image:
        'https://8086d31b76.clvaw-cdnwnd.com/6b74ca02d1b4210c9f35415e9ecc5114/200000490-ba995ba997/700/UF%20Lagoon%20L038%20-%20Fotos%20%2836%29-3.jpeg',
      description:
        'Vivienda unifamiliar con amarra propia al canal navegable. Diseño apaisado con estructura en hormigón visto, suite principal con balcón terraza y piscina climatizada sinfín.',
      approval: 'Plano Aprobado Municipalidad de Escobar & CAPBA D4',
      highlightsStr:
        'Lote con salida náutica directa y muelle privado\nCarpinterías A40 con vidrio DVH de piso a techo\nPiso radiante con caldera dual de alta eficiencia\nGalería quincho integrada a la cocina por cerramiento plegable',
      tagsStr: 'Hormigón Visto, Salida Náutica, Master Suite, En Construcción',
      isVisible: true,
    });
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeTab === 'todos' || p.category === activeTab;
    const isVis = p.isVisible !== false;
    const matchesVisibility =
      visibilityFilter === 'todos' ||
      (visibilityFilter === 'visibles' && isVis) ||
      (visibilityFilter === 'ocultos' && !isVis);
    return matchesCategory && matchesVisibility;
  });

  const visibleCount = projects.filter((p) => p.isVisible !== false).length;
  const hiddenCount = projects.filter((p) => p.isVisible === false).length;

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
              <span className="text-emerald-400">Proyectos Seleccionados</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-white">
              Obras en <span className="font-semibold text-neutral-200">Portafolio Web</span>
            </h1>
            <p className="text-xs text-neutral-400 font-light mt-1 max-w-xl">
              Carga, actualiza y gestiona la visibilidad de tus proyectos arquitectónicos en la sección pública "Proyectos Seleccionados".
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchPortfolio}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Actualizar listado"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              href="/#proyectos"
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
              className="px-5 py-2.5 bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-950" />
              <span>Cargar Nueva Obra</span>
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

        {/* Métricas del Catálogo con Visibilidad */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-8">
          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
              Total Catálogo
            </span>
            <span className="text-2xl font-light font-mono text-white">
              {projects.length}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Obras registradas</span>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-emerald-950/70 shadow-[inset_0_0_15px_rgba(16,185,129,0.06)]">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
              Visibles en Web
            </span>
            <span className="text-2xl font-light font-mono text-emerald-400">
              {visibleCount}
            </span>
            <span className="text-[10px] text-emerald-500/80 block mt-0.5">Activas en portada</span>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
              Ocultas
            </span>
            <span className="text-2xl font-light font-mono text-neutral-300">
              {hiddenCount}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Fuera de portada</span>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
              Viviendas
            </span>
            <span className="text-2xl font-light font-mono text-neutral-200">
              {projects.filter((p) => p.category === 'vivienda').length}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Barrios cerrados</span>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
              Interior & Comercial
            </span>
            <span className="text-2xl font-light font-mono text-neutral-200">
              {projects.filter((p) => p.category === 'interior' || p.category === 'comercial').length}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Mobiliario & oficinas</span>
          </div>
        </div>

        {/* Pestañas de Filtrado (Categoría + Visibilidad) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-3.5 py-2 border transition-all cursor-pointer ${
                activeTab === 'todos'
                  ? 'border-white bg-white text-neutral-950 font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white'
              }`}
            >
              Todas ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('vivienda')}
              className={`px-3.5 py-2 border transition-all cursor-pointer ${
                activeTab === 'vivienda'
                  ? 'border-white bg-white text-neutral-950 font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white'
              }`}
            >
              Viviendas ({projects.filter((p) => p.category === 'vivienda').length})
            </button>
            <button
              onClick={() => setActiveTab('interior')}
              className={`px-3.5 py-2 border transition-all cursor-pointer ${
                activeTab === 'interior'
                  ? 'border-white bg-white text-neutral-950 font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white'
              }`}
            >
              Interiores ({projects.filter((p) => p.category === 'interior').length})
            </button>
            <button
              onClick={() => setActiveTab('comercial')}
              className={`px-3.5 py-2 border transition-all cursor-pointer ${
                activeTab === 'comercial'
                  ? 'border-white bg-white text-neutral-950 font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white'
              }`}
            >
              Comercial ({projects.filter((p) => p.category === 'comercial').length})
            </button>
          </div>

          {/* Filtro rápido por estado de visibilidad */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500 text-[11px] uppercase mr-1">Visibilidad:</span>
            <button
              onClick={() => setVisibilityFilter('todos')}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                visibilityFilter === 'todos'
                  ? 'bg-neutral-800 border-neutral-600 text-white'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Todos ({projects.length})
            </button>
            <button
              onClick={() => setVisibilityFilter('visibles')}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer flex items-center gap-1.5 ${
                visibilityFilter === 'visibles'
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-emerald-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Visibles ({visibleCount})</span>
            </button>
            <button
              onClick={() => setVisibilityFilter('ocultos')}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer flex items-center gap-1.5 ${
                visibilityFilter === 'ocultos'
                  ? 'bg-neutral-800 border-neutral-600 text-white'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <EyeOff className="w-3 h-3 text-neutral-400" />
              <span>Ocultos ({hiddenCount})</span>
            </button>
          </div>
        </div>

        {/* Grilla de Obras */}
        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Cargando obras del portafolio...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center p-8 border border-neutral-800 bg-neutral-900/20 max-w-md mx-auto space-y-4">
            <Layers className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs font-mono text-neutral-400">
              No hay obras que coincidan con los filtros seleccionados.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-white text-neutral-950 font-mono text-xs uppercase font-bold cursor-pointer"
            >
              Cargar Nueva Obra
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const isVis = proj.isVisible !== false;
              const projId = proj._id || proj.id;

              return (
                <div
                  key={projId}
                  className={`bg-neutral-900/40 border transition-all flex flex-col justify-between overflow-hidden group shadow-lg ${
                    isVis
                      ? 'border-neutral-800 hover:border-neutral-600'
                      : 'border-neutral-800/60 bg-neutral-950/60 opacity-90'
                  }`}
                >
                  <div>
                    {/* Foto con Badges y estado de visibilidad */}
                    <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                          !isVis ? 'opacity-70 grayscale-[30%]' : ''
                        }`}
                      />
                      <div className="absolute top-3 left-3 bg-neutral-950/90 border border-neutral-800 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                        {proj.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-neutral-950/90 border border-neutral-800 px-2 py-0.5 text-[10px] font-mono uppercase text-white tracking-wider">
                        {proj.year}
                      </div>

                      {/* Badge de Oculto si aplica */}
                      {!isVis && (
                        <div className="absolute bottom-3 left-3 bg-neutral-950/95 border border-amber-600/50 px-2.5 py-1 text-[10px] font-mono uppercase text-amber-400 tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                          <EyeOff className="w-3 h-3 text-amber-400" />
                          <span>Oculto en portada web</span>
                        </div>
                      )}
                    </div>

                    {/* Datos del Proyecto */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{proj.location}</span>
                      </div>

                      <h3 className="text-base font-medium text-white uppercase tracking-tight">
                        {proj.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
                        <Ruler className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{proj.m2}</span>
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-3">
                        {proj.description}
                      </p>

                      <div className="pt-2 border-t border-neutral-800/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{proj.approval}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.tags?.map((tag: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 bg-neutral-950 border border-neutral-800 text-[10px] font-mono uppercase text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Card con Switch de Visibilidad y Acciones */}
                  <div className="p-4 bg-neutral-950/90 border-t border-neutral-800 flex items-center justify-between gap-3 text-xs font-mono">
                    {/* Switch de Visibilidad */}
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isVis}
                        onClick={(e) => handleToggleVisibility(proj, e)}
                        disabled={togglingId === projId}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                          isVis
                            ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                            : 'bg-neutral-800 border-neutral-700'
                        }`}
                        title={isVis ? 'Clic para ocultar de la web' : 'Clic para hacer visible en la web'}
                      >
                        <span className="sr-only">Visibilidad web</span>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                            isVis ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        >
                          {togglingId === projId && (
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
                          {isVis ? 'Visible' : 'Oculto'}
                        </span>
                        <span className="text-[9px] text-neutral-500 font-mono">
                          {isVis ? 'En portada web' : 'Oculto a clientes'}
                        </span>
                      </div>
                    </div>

                    {/* Botones de Editar y Eliminar */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 px-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-mono"
                        title="Editar información de la obra"
                      >
                        <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(projId, proj.title)}
                        disabled={deletingId === projId}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors cursor-pointer"
                        title="Eliminar obra del catálogo"
                      >
                        {deletingId === projId ? (
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

      {/* MODAL / FORMULARIO AMIGABLE (CREAR O EDITAR OBRA) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col overflow-hidden text-white relative"
          >
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  {editingProject ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-light uppercase text-white tracking-wide">
                    {editingProject ? `Editar Obra: ${editingProject.title}` : 'Cargar Nueva Obra para la Web'}
                  </h2>
                  <p className="text-[11px] font-mono text-neutral-400">
                    {editingProject
                      ? 'Actualiza los datos técnicos, imagen o visibilidad en tiempo real'
                      : 'Se publicará inmediatamente en la sección "Proyectos Seleccionados"'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!editingProject && (
                  <button
                    type="button"
                    onClick={autofillExample}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-[11px] transition-colors cursor-pointer"
                    title="Autocompletar con ejemplo de obra de Acromático"
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

            {/* Contenido del Formulario */}
            <form onSubmit={handleSubmitProject} className="p-6 overflow-y-auto flex-1 space-y-6">
              {errorMsg && (
                <div className="p-3.5 bg-red-950/50 border border-red-800 text-red-200 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Fila 0: Switch de visibilidad en el modal */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white block">
                    Visibilidad en la Web Principal
                  </span>
                  <span className="text-[11px] text-neutral-400 font-light">
                    {formData.isVisible
                      ? 'La obra está activa y visible para cualquier visitante en "Proyectos Seleccionados".'
                      : 'La obra está oculta temporalmente de la portada web.'}
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
                        ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
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

              {/* Fila 1: Título, Categoría y Año */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Título de la Obra *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: UF San Sebastián A02 L145"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors cursor-pointer font-mono"
                  >
                    <option value="vivienda">Vivienda Unifamiliar</option>
                    <option value="interior">Arquitectura Interior & Mobiliario</option>
                    <option value="comercial">Oficinas / Gastronomía</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Año de Proyecto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="Ej: 2024 - 2025"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Fila 2: Ubicación, Municipio y Metros Cuadrados */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Municipio en Zona Norte *
                  </label>
                  <select
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors cursor-pointer font-mono"
                  >
                    <option value="Pilar">Pilar</option>
                    <option value="Tigre">Tigre</option>
                    <option value="Escobar">Escobar</option>
                    <option value="San Isidro">San Isidro</option>
                    <option value="Vicente López">Vicente López</option>
                    <option value="San Fernando">San Fernando</option>
                    <option value="Pilar / Escobar">Pilar / Escobar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Ubicación Específica *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ej: Pilar · Barrio San Sebastián Área 01"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Superficie / Metros Cuadrados *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.m2}
                    onChange={(e) => setFormData({ ...formData, m2: e.target.value })}
                    placeholder="Ej: 240 m² Cubiertos + 45 m² Galería"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Fila 3: Imagen (URL + Presets de Acromático Estudio) */}
              <div className="space-y-3 p-4 bg-neutral-950 border border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
                    URL de Fotografía / Render de la Obra *
                  </label>
                  <span className="text-[10px] font-mono text-neutral-500">
                    O selecciona un preset de obra real
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Botones de Presets de Imágenes Oficiales */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5">
                    Fotografías Oficiales de Acromático Estudio (1 Clic):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`p-2 text-left border text-[10px] font-mono transition-all cursor-pointer flex items-center justify-between gap-1 truncate ${
                          formData.image === preset.url
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700'
                        }`}
                      >
                        <span className="truncate">{preset.label}</span>
                        {formData.image === preset.url && (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Previsualización en vivo */}
                {formData.image && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[10px] font-mono text-neutral-400">Vista previa:</span>
                    <div className="w-20 h-12 bg-neutral-900 border border-neutral-700 overflow-hidden relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fila 4: Descripción y Aprobación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Descripción Arquitectónica *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Vivienda unifamiliar de arquitectura contemporánea pura. Volumetría en hormigón visto y amplios paños vidriados..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 p-3 text-xs text-white focus:outline-none transition-colors resize-none font-light leading-relaxed"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Estado Normativo / Aprobación Municipal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.approval}
                      onChange={(e) => setFormData({ ...formData, approval: e.target.value })}
                      placeholder="Plano Aprobado Obras Particulares & CAPBA D4"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Tags de Materialidad (separados por coma)
                    </label>
                    <input
                      type="text"
                      value={formData.tagsStr}
                      onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                      placeholder="Hormigón Visto, Doble Altura, Dekton, Piscina"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Fila 5: Particularidades (Highlights en lista) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Particularidades de la Obra (1 por línea, se verán con tilde verde en el pop-up)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlightsStr}
                  onChange={(e) => setFormData({ ...formData, highlightsStr: e.target.value })}
                  placeholder="Hormigón visto fenólico con buñas milimétricas&#10;Doble altura en área social con visuales al parque&#10;Piscina sinfín con solárium atérmico"
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
                      <span>{editingProject ? 'Guardando cambios...' : 'Publicando obra...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{editingProject ? 'Guardar Cambios' : 'Publicar Obra en la Web'}</span>
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
