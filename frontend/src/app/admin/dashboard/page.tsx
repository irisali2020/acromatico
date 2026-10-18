'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { api } from '@/lib/api';
import {
  FolderGit2,
  Layers,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  HardHat,
  Ruler,
  MapPin,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('todos');
  const [selectedMun, setSelectedMun] = useState('todos');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Verificar auth
      await api.getMe();

      // Cargar proyectos y métricas en paralelo
      const [projRes, anaRes] = await Promise.all([
        api.getAdminProjects(),
        api.getAnalytics(),
      ]);

      setProjects(projRes.projects || []);
      setAnalytics(anaRes.analytics || null);
    } catch (err: any) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const stages = [
    { id: 'briefing', label: 'Briefing & Factibilidad', color: 'border-amber-500/50' },
    { id: 'anteproyecto', label: 'Anteproyecto & 3D', color: 'border-blue-500/50' },
    { id: 'proyecto_ejecutivo', label: 'Proyecto Ejecutivo', color: 'border-indigo-500/50' },
    { id: 'tramite_municipal', label: 'Trámite Municipal & CAPBA', color: 'border-purple-500/50' },
    { id: 'direccion_obra', label: 'En Obra / Construcción', color: 'border-emerald-500/50' },
    { id: 'finalizado', label: 'Finalizado', color: 'border-neutral-500/50' },
  ];

  const handleStageChange = async (projectId: string, newStage: string) => {
    setUpdatingId(projectId);
    try {
      await api.updateProjectStage(projectId, { stage: newStage });
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, stage: newStage } : p))
      );
    } catch (e) {
      alert('Error al actualizar la etapa del proyecto');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrado de proyectos
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = selectedService === 'todos' || p.serviceType === selectedService;
    const matchesMun = selectedMun === 'todos' || p.location?.municipality === selectedMun;

    return matchesSearch && matchesService && matchesMun;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 md:pb-10 overflow-y-auto w-full max-w-full overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-neutral-900 gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">
              <span>Gestión Integral de Estudio</span>
              <span>·</span>
              <span className="text-emerald-400">Zona Norte Buenos Aires</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-white">
              Pipeline de <span className="font-semibold text-neutral-200">Proyectos & Obras</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Actualizar datos"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/#recorrido"
              target="_blank"
              className="px-4 py-2.5 bg-[#c8a882] text-[#262626] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#b8956c] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(200,168,130,0.25)]"
            >
              <Plus className="w-4 h-4 text-[#262626]" />
              <span>Nuevo Proyecto</span>
            </Link>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
            <div className="p-5 bg-neutral-900/50 border border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                Superficie Total
              </span>
              <span className="text-2xl sm:text-3xl font-light font-mono text-white">
                {analytics.totalProjectedM2} m²
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Proyectados en curso</span>
            </div>

            <div className="p-5 bg-neutral-900/50 border border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                Expedientes Municipales
              </span>
              <span className="text-2xl sm:text-3xl font-light font-mono text-[#a6825a] dark:text-[#c8a882] font-medium">
                {analytics.municipalPermitsInProcess}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">En trámite / visado</span>
            </div>

            <div className="p-5 bg-neutral-900/50 border border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                Obras en Supervisión
              </span>
              <span className="text-2xl sm:text-3xl font-light font-mono text-[#785633] dark:text-[#deb88f] font-medium">
                {analytics.underConstruction}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Dirección activa</span>
            </div>

            <div className="p-5 bg-neutral-900/50 border border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                Tareas Urgentes
              </span>
              <span className="text-2xl sm:text-3xl font-light font-mono text-[#8f683d] dark:text-[#e4c9a8] font-medium">
                {analytics.urgentTasks}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Prioridad máxima hoy</span>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="p-4 bg-neutral-900/30 border border-neutral-800/80 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, cliente o barrio..."
              className="w-full bg-neutral-950 border border-neutral-800 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Filter Service */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-neutral-300 font-mono focus:outline-none"
            >
              <option value="todos">Todos los Servicios</option>
              <option value="obra_nueva">Vivienda Nueva</option>
              <option value="interior_mobiliario">Interiores / Mobiliario</option>
              <option value="oficinas">Corporativo / Oficinas</option>
              <option value="gastronomia">Gastronomía</option>
              <option value="regularizacion">Planos Municipales / CAPBA</option>
            </select>

            {/* Filter Municipality */}
            <select
              value={selectedMun}
              onChange={(e) => setSelectedMun(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-neutral-300 font-mono focus:outline-none"
            >
              <option value="todos">Todos los Municipios</option>
              <option value="Pilar">Pilar</option>
              <option value="Tigre">Tigre</option>
              <option value="San Isidro">San Isidro</option>
              <option value="Vicente López">Vicente López</option>
              <option value="Escobar">Escobar</option>
              <option value="San Fernando">San Fernando</option>
            </select>
          </div>
        </div>

        {/* Visual Pipeline (Kanban Board) */}
        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Cargando proyectos del estudio...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 items-start">
            {stages.map((stg) => {
              const stageProjects = filteredProjects.filter((p) => p.stage === stg.id);
              return (
                <div
                  key={stg.id}
                  className="bg-neutral-900/30 border border-neutral-800 flex flex-col min-h-[420px]"
                >
                  {/* Column Header */}
                  <div className={`p-3 border-b border-neutral-800 border-t-2 ${stg.color}`}>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-white uppercase truncate">
                        {stg.label}
                      </span>
                      <span className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-300">
                        {stageProjects.length}
                      </span>
                    </div>
                  </div>

                  {/* Project Cards in this column */}
                  <div className="p-2 space-y-2.5 flex-1 overflow-y-auto max-h-[700px]">
                    {stageProjects.length === 0 ? (
                      <div className="py-8 text-center text-[11px] font-mono text-neutral-600">
                        Sin proyectos en esta fase
                      </div>
                    ) : (
                      stageProjects.map((proj) => (
                        <div
                          key={proj._id}
                          className="p-3.5 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-600 transition-all space-y-3 group"
                        >
                          {/* Card Top */}
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-white font-semibold tracking-wider">
                              {proj.trackingCode}
                            </span>
                            <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 uppercase">
                              {proj.location?.municipality}
                            </span>
                          </div>

                          {/* Client & Neighborhood */}
                          <div>
                            <Link
                              href={`/admin/proyectos/${proj._id}`}
                              className="text-xs font-medium text-neutral-200 group-hover:text-white block truncate hover:underline"
                            >
                              {proj.client?.name}
                            </Link>
                            <span className="text-[11px] text-neutral-500 font-mono block truncate">
                              {proj.location?.neighborhood || proj.location?.address || 'Zona Urbana'}
                            </span>
                          </div>

                          {/* Metric & Progress */}
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800/60">
                            <span>{proj.technicalData?.coveredM2 ? `${proj.technicalData.coveredM2} m²` : 'A definir'}</span>
                            <span className="text-white">{proj.progressPercentage || 10}%</span>
                          </div>

                          {/* Fast Stage Changer Dropdown */}
                          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-1">
                            <select
                              value={proj.stage}
                              disabled={updatingId === proj._id}
                              onChange={(e) => handleStageChange(proj._id, e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-400 px-2 py-1 focus:outline-none"
                            >
                              {stages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Mover a: {s.label}
                                </option>
                              ))}
                            </select>

                            <Link
                              href={`/admin/proyectos/${proj._id}`}
                              className="p-1 hover:text-white text-neutral-400 shrink-0"
                              title="Ver expediente técnico completo"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
