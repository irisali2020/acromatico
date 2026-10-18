'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Home,
  Layers,
  Building2,
  UtensilsCrossed,
  FileCheck,
  MapPin,
  Ruler,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Calendar,
  DollarSign,
  Send,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';

export const ProjectWizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingResult, setTrackingResult] = useState<{
    code: string;
    project: any;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const wizardHeaderRef = useRef<HTMLDivElement>(null);
  const wizardBoxRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const successCardRef = useRef<HTMLDivElement>(null);

  // Entrada por scroll visible en viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

          if (wizardHeaderRef.current) {
            tl.fromTo(
              wizardHeaderRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6 }
            );
          }

          if (wizardBoxRef.current) {
            tl.fromTo(
              wizardBoxRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.7, clearProps: 'transform' },
              '-=0.3'
            );
          }

          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animación fluida y delicada al cambiar de paso
  useEffect(() => {
    if (stepContentRef.current) {
      gsap.fromTo(
        stepContentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
      );
    }
  }, [step]);

  // Animación suave al confirmar expediente
  useEffect(() => {
    if (submitted && successCardRef.current) {
      gsap.fromTo(
        successCardRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [submitted]);

  // Escuchar selección directa desde la sección de Servicios Arquitectónicos
  useEffect(() => {
    const handleDirectServiceSelection = (event: any) => {
      if (event.detail?.serviceType) {
        setFormData((prev) => ({
          ...prev,
          serviceType: event.detail.serviceType,
        }));
        setStep(2); // Salta directo al paso 2 sin tener que volver a elegir
        setErrorMsg('');
      }
    };

    window.addEventListener('acromatico:select-service', handleDirectServiceSelection);
    return () => {
      window.removeEventListener('acromatico:select-service', handleDirectServiceSelection);
    };
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    serviceType: 'obra_nueva',
    municipality: 'Pilar',
    isGatedCommunity: true,
    neighborhood: '',
    lotNumber: '',
    lotSizeM2: 800,
    coveredM2: 220,
    semiCoveredM2: 40,
    budgetRange: 'USD 150,000 - 200,000',
    estimatedTimeframe: 'Dentro de los próximos 3 meses',
    selectedEnvironments: [
      'Master Suite con Vestidor',
      'Cocina con Isla Integrada',
      'Galería con Parrilla',
      'Piscina',
    ] as string[],
    architecturalStyle: 'Hormigón Visto & Minimalismo Acromático',
    documentsAvailable: ['Escritura / Boleto', 'Plano de Mensura'] as string[],
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientNotes: '',
  });

  const municipalities = [
    'Tigre',
    'San Isidro',
    'Vicente López',
    'Pilar',
    'Escobar',
    'San Fernando',
    'CABA / Otro',
  ];

  const serviceOptions = [
    {
      id: 'obra_nueva',
      title: 'Vivienda Residencial desde Cero',
      subtitle: 'Diseño integral en lote de barrio cerrado o zona urbana',
      icon: Home,
    },
    {
      id: 'interior_mobiliario',
      title: 'Arquitectura Interior & Mobiliario',
      subtitle: 'Carpintería técnica de autor, cocinas, vestidores y estructuras',
      icon: Layers,
    },
    {
      id: 'oficinas',
      title: 'Espacios Corporativos & Oficinas',
      subtitle: 'Layouts de trabajo, tabiques vidriados, acústica e iluminación',
      icon: Building2,
    },
    {
      id: 'gastronomia',
      title: 'Local Gastronómico / Bar / Café',
      subtitle: 'Barras monolíticas, salón, cocinas y habilitación comercial',
      icon: UtensilsCrossed,
    },
    {
      id: 'regularizacion',
      title: 'Habilitación & Trámite Municipal',
      subtitle: 'Aprobación de planos, liquidación CAPBA y obras particulares',
      icon: FileCheck,
    },
  ];

  // Opciones de ambientes según el tipo de servicio
  const getEnvironmentOptions = () => {
    if (formData.serviceType === 'interior_mobiliario') {
      return [
        'Muebles de Cocina a Medida con Isla',
        'Vestidor de Piso a Techo sin Tiradores',
        'Muebles de Baño Suspendidos en Roble/Hierro',
        'Panelado de Madera / Revestimiento Acústico',
        'Cielorrasos con Fajas de Iluminación Indirecta LED',
        'Puertas Corredizas de Embutir con Perfil Oculto',
        'Bibliotecas y Estanterías en Herrería Técnica',
      ];
    }
    if (formData.serviceType === 'oficinas') {
      return [
        'Puestos de Trabajo Operativos (Open Space)',
        'Sala de Directorio / Reuniones Formal',
        'Phone Booths / Cabinas Insonorizadas',
        'Recepción & Front Desk de Imagen Corporativa',
        'Kitchenette / Área de Coffee Break',
        'Tabiques Vidriados con Perfilería Negra',
        'Cableado Estructurado y Tomas Ocultas',
      ];
    }
    if (formData.serviceType === 'gastronomia') {
      return [
        'Barra Principal Monolítica en Terrazo / Microcemento',
        'Salón de Comensales con Puestos Fijos y Móviles',
        'Cocina Gastronómica con Normativa Sanitaria',
        'Extracción Forzada y Conductos a los 4 Vientos',
        'Barra de Café de Especialidad / Coctelería',
        'Sanitarios Reglamentarios Accesibles',
        'Terraza / Expansión Exterior con Toldos Técnicos',
      ];
    }
    // Residencial por defecto
    return [
      'Master Suite con Vestidor Privado',
      'Dormitorios Secundarios en Suite',
      'Cocina con Isla Central y Despensa',
      'Living-Comedor Apaisado Doble Altura',
      'Galería Semicubierta con Parrilla',
      'Piscina (Infinity / Espejo de Agua)',
      'Cava Subterránea de Vinos',
      'Home Office / Estudio Independiente',
      'Cochera Doble Cubierta',
      'Terraza Accesible / Mirador Verde',
    ];
  };

  const toggleEnvironment = (item: string) => {
    if (formData.selectedEnvironments.includes(item)) {
      setFormData({
        ...formData,
        selectedEnvironments: formData.selectedEnvironments.filter((e) => e !== item),
      });
    } else {
      setFormData({
        ...formData,
        selectedEnvironments: [...formData.selectedEnvironments, item],
      });
    }
  };

  const toggleDocument = (doc: string) => {
    if (formData.documentsAvailable.includes(doc)) {
      setFormData({
        ...formData,
        documentsAvailable: formData.documentsAvailable.filter((d) => d !== doc),
      });
    } else {
      setFormData({
        ...formData,
        documentsAvailable: [...formData.documentsAvailable, doc],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      setErrorMsg('Por favor completa nombre, email y teléfono para registrar tu proyecto.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        client: {
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          notes: formData.clientNotes,
        },
        serviceType: formData.serviceType,
        location: {
          municipality: formData.municipality,
          neighborhood: formData.neighborhood,
          lotNumber: formData.lotNumber,
          isGatedCommunity: formData.isGatedCommunity,
        },
        technicalData: {
          lotSizeM2: Number(formData.lotSizeM2) || 0,
          coveredM2: Number(formData.coveredM2) || 0,
          semiCoveredM2: Number(formData.semiCoveredM2) || 0,
          fos: 0.35,
          fot: 0.7,
        },
        scopeDetails: {
          environments: formData.selectedEnvironments,
          architecturalStyle: formData.architecturalStyle,
          budgetRange: formData.budgetRange,
          estimatedTimeframe: formData.estimatedTimeframe,
          clientComments: `Documentación declarada: ${formData.documentsAvailable.join(', ')}. ${formData.clientNotes}`,
        },
      };

      const res = await api.submitProjectIntake(payload);

      setTrackingResult({
        code: res.trackingCode,
        project: res.project,
      });
      setSubmitted(true);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#888888', '#222222', '#d6d3cd'],
        });
      } catch (err) {}
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al enviar el proyecto. Verifique los datos.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (trackingResult?.code) {
      navigator.clipboard.writeText(trackingResult.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section ref={sectionRef} id="recorrido" className="py-24 bg-neutral-950 text-white relative dot-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={wizardHeaderRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-[11px] font-mono uppercase tracking-widest text-neutral-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span>Configurador Técnico & Briefing Guiado</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight uppercase mb-4">
            Inicia tu Proyecto <span className="font-semibold text-neutral-200">con Acromático</span>
          </h2>
          <p className="text-neutral-400 text-sm max-w-2xl mx-auto font-light leading-relaxed">
            Completa los detalles de tu terreno o espacio en Zona Norte para estructurar tu
            anteproyecto y verificar la viabilidad técnica y municipal de forma inmediata.
          </p>
        </div>

        {/* Wizard Container */}
        <div ref={wizardBoxRef} className="glass-panel p-6 sm:p-12 border border-neutral-800 shadow-2xl relative w-full">
          {!submitted ? (
            <div>
              {/* Stepper Progress Bar */}
              <div className="mb-10">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-neutral-400 mb-3">
                  <span>Paso 0{step} de 06</span>
                  <span className="text-neutral-200">
                    {step === 1 && 'Tipología de Proyecto'}
                    {step === 2 && 'Ubicación & Terreno en Zona Norte'}
                    {step === 3 && 'Escala & Metros Cuadrados'}
                    {step === 4 && 'Programa de Necesidades'}
                    {step === 5 && 'Materialidad & Documentación'}
                    {step === 6 && 'Datos de Contacto & Envío'}
                  </span>
                </div>
                {/* Visual architectural progress bar */}
                <div className="w-full h-1 bg-neutral-900 overflow-hidden relative">
                  <div
                    className="h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${(step / 6) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs font-mono">
                  {errorMsg}
                </div>
              )}

              {/* Contenedor animado con rebote GSAP */}
              <div ref={stepContentRef}>
                {/* STEP 1: Tipo de Proyecto */}
                {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-light text-white uppercase tracking-tight">
                    ¿Qué tipo de proyecto deseas desarrollar?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = formData.serviceType === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setFormData({ ...formData, serviceType: opt.id });
                            setStep(2);
                          }}
                          className={`p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-white bg-neutral-900 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                              : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-600 hover:bg-neutral-900/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`w-9 h-9 flex items-center justify-center border ${
                                isSelected
                                  ? 'border-white bg-white text-neutral-950'
                                  : 'border-neutral-700 bg-neutral-900 text-neutral-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white mb-1">{opt.title}</h4>
                            <p className="text-xs text-neutral-400 font-light leading-relaxed">
                              {opt.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Ubicación & Terreno */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-light text-white uppercase tracking-tight">
                    Ubicación & Datos del Terreno en Zona Norte
                  </h3>

                  {/* Selector de Partido */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Partido / Municipio:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {municipalities.map((mun) => (
                        <button
                          key={mun}
                          type="button"
                          onClick={() => setFormData({ ...formData, municipality: mun })}
                          className={`py-2 px-3 text-xs font-mono border transition-all text-left flex items-center justify-between ${
                            formData.municipality === mun
                              ? 'border-white bg-neutral-900 text-white font-medium'
                              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span>{mun}</span>
                          {formData.municipality === mun && <Check className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Barrio Cerrado */}
                  <div className="p-4 bg-neutral-900/40 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-white block">
                          ¿El terreno está dentro de un Barrio Cerrado o Country?
                        </span>
                        <span className="text-[11px] text-neutral-400 font-light">
                          (Requiere visado previo de la Comisión de Arquitectura interna)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, isGatedCommunity: true })}
                          className={`px-3 py-1 text-xs font-mono border ${
                            formData.isGatedCommunity
                              ? 'bg-white text-neutral-950 border-white'
                              : 'border-neutral-800 text-neutral-400'
                          }`}
                        >
                          SÍ
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, isGatedCommunity: false })}
                          className={`px-3 py-1 text-xs font-mono border ${
                            !formData.isGatedCommunity
                              ? 'bg-white text-neutral-950 border-white'
                              : 'border-neutral-800 text-neutral-400'
                          }`}
                        >
                          NO (Lote Urbano)
                        </button>
                      </div>
                    </div>

                    {formData.isGatedCommunity && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Nombre del Barrio Cerrado (ej: San Sebastián, Lagoon, Nordelta):
                          </label>
                          <input
                            type="text"
                            value={formData.neighborhood}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            placeholder="Ej: San Sebastián Área 10"
                            className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                            Nro. de Lote / Unidad Funcional:
                          </label>
                          <input
                            type="text"
                            value={formData.lotNumber}
                            onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                            placeholder="Ej: Lote 269"
                            className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Superficie del lote */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-neutral-400">Superficie del Terreno / Local:</span>
                      <span className="text-white font-medium">{formData.lotSizeM2} m²</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="25"
                      value={formData.lotSizeM2}
                      onChange={(e) => setFormData({ ...formData, lotSizeM2: Number(e.target.value) })}
                      className="w-full accent-white bg-neutral-800 h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                      <span>50 m²</span>
                      <span>500 m²</span>
                      <span>1.000 m²</span>
                      <span>2.000 m²</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Escala & Metros Cuadrados */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-light text-white uppercase tracking-tight">
                    Superficie Deseada y Plazos Estimados
                  </h3>

                  {/* Metros cubiertos */}
                  <div className="p-5 bg-neutral-900/40 border border-neutral-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-mono text-neutral-300 block">
                          Metros Cuadrados Cubiertos Deseados:
                        </span>
                        <span className="text-[11px] text-neutral-500 font-light">
                          (Superficie de interiores habitable)
                        </span>
                      </div>
                      <span className="text-xl font-light font-mono text-white">
                        {formData.coveredM2} m²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="600"
                      step="10"
                      value={formData.coveredM2}
                      onChange={(e) => setFormData({ ...formData, coveredM2: Number(e.target.value) })}
                      className="w-full accent-white bg-neutral-800 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Metros semicubiertos */}
                  <div className="p-5 bg-neutral-900/40 border border-neutral-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-mono text-neutral-300 block">
                          Galerías y Cocheras Semicubiertas:
                        </span>
                        <span className="text-[11px] text-neutral-500 font-light">
                          (Cómputo municipal al 50%)
                        </span>
                      </div>
                      <span className="text-xl font-light font-mono text-white">
                        {formData.semiCoveredM2} m²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      step="5"
                      value={formData.semiCoveredM2}
                      onChange={(e) => setFormData({ ...formData, semiCoveredM2: Number(e.target.value) })}
                      className="w-full accent-white bg-neutral-800 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Presupuesto y Plazos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Presupuesto Objetivo Estimado:
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-500"
                      >
                        <option value="USD 50,000 - 100,000">USD 50,000 - 100,000</option>
                        <option value="USD 100,000 - 150,000">USD 100,000 - 150,000</option>
                        <option value="USD 150,000 - 200,000">USD 150,000 - 200,000</option>
                        <option value="USD 200,000 - 300,000">USD 200,000 - 300,000</option>
                        <option value="Más de USD 300,000">Más de USD 300,000</option>
                        <option value="A definir según proyecto">A definir según anteproyecto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Plazo para Iniciar el Anteproyecto:
                      </label>
                      <select
                        value={formData.estimatedTimeframe}
                        onChange={(e) => setFormData({ ...formData, estimatedTimeframe: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-500"
                      >
                        <option value="Inmediato / En curso">Inmediato / En curso</option>
                        <option value="Dentro de los próximos 3 meses">Dentro de los próximos 3 meses</option>
                        <option value="Entre 3 y 6 meses">Entre 3 y 6 meses</option>
                        <option value="Explorando factibilidad">Explorando factibilidad</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Programa de Necesidades */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-light text-white uppercase tracking-tight mb-1">
                      Programa de Necesidades & Espacios Clave
                    </h3>
                    <p className="text-xs text-neutral-400 font-light">
                      Selecciona los ambientes y elementos que deben formar parte obligatoria del
                      proyecto.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {getEnvironmentOptions().map((env) => {
                      const isSelected = formData.selectedEnvironments.includes(env);
                      return (
                        <div
                          key={env}
                          onClick={() => toggleEnvironment(env)}
                          className={`p-3 border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'border-white bg-neutral-900 text-white font-medium'
                              : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span>{env}</span>
                          <div
                            className={`w-4 h-4 border flex items-center justify-center shrink-0 ml-2 ${
                              isSelected ? 'border-white bg-white text-neutral-950' : 'border-neutral-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Materialidad & Documentos */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-light text-white uppercase tracking-tight mb-1">
                      Identidad Arquitectónica & Documentación
                    </h3>
                    <p className="text-xs text-neutral-400 font-light">
                      Línea material y estado de la documentación técnica disponible.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Estilo & Materialidad Predominante:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Hormigón Visto & Minimalismo Acromático',
                        'Contemporáneo Puro en Blanco & Madera Natural',
                        'Vidrio, Perfiles de Acero Negro & Piedra',
                        'Racionalismo Rígido con Grandes Paños DVH',
                      ].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setFormData({ ...formData, architecturalStyle: style })}
                          className={`p-3 text-xs font-mono border text-left flex items-center justify-between ${
                            formData.architecturalStyle === style
                              ? 'border-white bg-neutral-900 text-white'
                              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span>{style}</span>
                          {formData.architecturalStyle === style && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      ¿Qué documentación tienes actualmente?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Escritura / Boleto de Compraventa',
                        'Plano de Mensura y Subdivisión',
                        'Reglamento de Construcción del Barrio',
                        'Estudio de Suelos / Geotécnico',
                        'En búsqueda de lote o local',
                      ].map((doc) => {
                        const isChecked = formData.documentsAvailable.includes(doc);
                        return (
                          <div
                            key={doc}
                            onClick={() => toggleDocument(doc)}
                            className={`p-2.5 border cursor-pointer text-xs flex items-center justify-between ${
                              isChecked
                                ? 'border-neutral-400 bg-neutral-900 text-neutral-200'
                                : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            <span>{doc}</span>
                            <div
                              className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                                isChecked ? 'border-white bg-white text-neutral-950' : 'border-neutral-700'
                              }`}
                            >
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Contacto & Enviar */}
              {step === 6 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-light text-white uppercase tracking-tight mb-1">
                      Tus Datos para Generar el Expediente
                    </h3>
                    <p className="text-xs text-neutral-400 font-light">
                      El sistema asignará un código único de seguimiento confidencial.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Ej: Marcos Delgado"
                        className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        WhatsApp / Celular *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        placeholder="Ej: +54 9 11 4455-6677"
                        className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        placeholder="tu-correo@ejemplo.com"
                        className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Detalles o requerimientos adicionales (Opcional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.clientNotes}
                        onChange={(e) => setFormData({ ...formData, clientNotes: e.target.value })}
                        placeholder="Ej: Queremos que la piscina se integre visualmente con el estar. Tenemos fotos de referencia en Pinterest."
                        className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs text-white focus:outline-none focus:border-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/50 border border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Tus datos son tratados bajo estricta confidencialidad profesional. No compartimos
                      tu información con terceros.
                    </span>
                  </div>
                </form>
              )}
              </div>

              {/* Navigation Controls */}
              <div className="mt-10 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 6 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(200,168,130,0.3)]"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#262626]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-2.5 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] disabled:opacity-50 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(200,168,130,0.35)] cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#262626]" />
                        <span>Generando Expediente...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#262626]" />
                        <span>Generar Ficha de Proyecto</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Pantalla de Éxito y Código de Seguimiento */
            <div ref={successCardRef} className="py-6 text-center space-y-6">
              <div className="w-16 h-16 border border-white bg-neutral-900 mx-auto flex items-center justify-center text-white">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block mb-1">
                  Expediente Ingresado con Éxito
                </span>
                <h3 className="text-2xl sm:text-3xl font-light uppercase text-white tracking-tight">
                  Tu Proyecto Ya Está en Marcha
                </h3>
                <p className="text-neutral-400 text-xs max-w-md mx-auto mt-2 font-light">
                  Se ha generado la ficha técnica de anteproyecto para el equipo de Acromático
                  Estudio. Guarda tu código único para consultar el estado en cualquier momento.
                </p>
              </div>

              {/* Box de Código */}
              <div className="p-6 bg-neutral-900 border border-neutral-700 max-w-md mx-auto relative group">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Código de Seguimiento Oficial:
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white">
                  {trackingResult?.code || 'ACR-2025-XXXX'}
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-[11px] font-mono text-neutral-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>¡Código Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href={`/seguimiento?codigo=${trackingResult?.code}`}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(200,168,130,0.3)] cursor-pointer"
                >
                  <span>Ver Portal de Seguimiento</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#262626]" />
                </a>

                <a
                  href={`https://wa.me/5491158249912?text=${encodeURIComponent(
                    `Hola Acromático Estudio, acabo de completar el recorrido interactivo para mi proyecto con el código de seguimiento: ${trackingResult?.code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Avisar por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
