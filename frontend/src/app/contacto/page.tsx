'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import confetti from 'canvas-confetti';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'obra_nueva',
    municipality: 'Pilar',
    neighborhood: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Manejo de parámetros de URL si viene desde una card de obra
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const zoneParam = params.get('zona');
      if (zoneParam) {
        setFormData((prev) => ({
          ...prev,
          neighborhood: zoneParam,
          message: `Hola, me comunico para cotizar un proyecto en la zona de ${zoneParam}.`,
        }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        client: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          notes: formData.message.trim(),
        },
        serviceType: formData.serviceType,
        location: {
          municipality: formData.municipality,
          neighborhood: formData.neighborhood.trim() || undefined,
          isGatedCommunity: Boolean(formData.neighborhood.trim()),
        },
        scopeDetails: {
          clientComments: formData.message.trim(),
        },
      };

      const res = await api.submitProjectIntake(payload);

      setTrackingCode(res.trackingCode);
      setSubmitted(true);

      // Lanzar confeti arquitectónico
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#c8a882', '#ffffff', '#a3a3a3'],
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'Ocurrió un error al enviar tu consulta. Por favor verifica tus datos o contáctanos por WhatsApp.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyTracking = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 architectural-grid relative flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-[11px] font-mono uppercase tracking-widest text-neutral-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Canal Oficial de Consultas · Zona Norte Buenos Aires</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight uppercase text-white mb-4">
              Contacto & <strong className="font-semibold text-neutral-100">Estudio</strong>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
              Inicia el diálogo sobre tu lote, vivienda o proyecto comercial. Analizamos la viabilidad
              urbanística y respondemos en menos de 24 horas hábiles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Columna Izquierda: Datos del Estudio (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card de Atención Directa */}
              <div className="p-6 sm:p-8 bg-neutral-900/40 border border-neutral-800 shadow-xl space-y-6">
                <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Canales Directos</span>
                </h2>

                <div className="space-y-4 text-xs font-mono">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/5491158249912?text=Hola%20Acrom%C3%A1tico%20Estudio%2C%20quisiera%20hacer%20una%20consulta%20sobre%20un%20proyecto."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3.5 p-3.5 bg-neutral-950/80 border border-neutral-800 hover:border-emerald-400/80 transition-colors group"
                  >
                    <div className="p-2 bg-emerald-950/50 border border-emerald-500/40 text-emerald-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        WhatsApp Arquitectura
                      </span>
                      <span className="text-white text-xs font-medium group-hover:text-emerald-300 transition-colors">
                        +54 9 11 5824-9912
                      </span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">
                        Respuesta inmediata · Clic para chatear
                      </span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:contacto@acromaticoestudio.com"
                    className="flex items-start gap-3.5 p-3.5 bg-neutral-950/80 border border-neutral-800 hover:border-neutral-600 transition-colors group"
                  >
                    <div className="p-2 bg-neutral-900 border border-neutral-700 text-neutral-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Correo Oficial
                      </span>
                      <span className="text-white text-xs font-medium group-hover:text-neutral-200 transition-colors">
                        contacto@acromaticoestudio.com
                      </span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        Documentación técnica y planos
                      </span>
                    </div>
                  </a>

                  {/* Cobertura */}
                  <div className="flex items-start gap-3.5 p-3.5 bg-neutral-950/80 border border-neutral-800">
                    <div className="p-2 bg-neutral-900 border border-neutral-700 text-neutral-300">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Zona de Intervención
                      </span>
                      <span className="text-neutral-200 text-xs font-medium">
                        Zona Norte GBA & CABA
                      </span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        Pilar · Tigre · San Isidro · Vicente López · Escobar
                      </span>
                    </div>
                  </div>

                  {/* Horarios */}
                  <div className="flex items-start gap-3.5 p-3.5 bg-neutral-950/80 border border-neutral-800">
                    <div className="p-2 bg-neutral-900 border border-neutral-700 text-neutral-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        Horario de Atención
                      </span>
                      <span className="text-neutral-200 text-xs font-medium">
                        Lunes a Viernes · 09:00 a 19:00 hs
                      </span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        Reuniones en terreno o videollamadas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card de Garantías & Método */}
              <div className="p-6 bg-neutral-900/30 border border-neutral-800/80 space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 block font-semibold">
                  Compromiso Acromático:
                </span>
                <div className="space-y-2 text-xs text-neutral-400 font-light">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Todas las consultas son revisadas directamente por el arquitecto titular.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Se asigna un número de expediente oficial registrado en el sistema.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Recibes un correo automático de confirmación con el detalle de tu solicitud.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Contacto (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-10 bg-neutral-900/40 border border-neutral-800 shadow-2xl relative">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-neutral-800 pb-4">
                      <h2 className="text-lg font-light uppercase text-white tracking-wide">
                        Formulario de Consulta Técnica
                      </h2>
                      <p className="text-xs text-neutral-400 font-light mt-1">
                        Ingresa los detalles para que podamos evaluar la normativa del lote antes de llamarte.
                      </p>
                    </div>

                    {/* Alerta de Error si ocurre */}
                    {errorMsg && (
                      <div className="p-4 bg-red-950/50 border border-red-800 text-red-200 text-xs font-mono flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold mb-1">No se pudo enviar la consulta</p>
                          <p>{errorMsg}</p>
                          <a
                            href="https://wa.me/5491158249912"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 underline text-white hover:text-emerald-300"
                          >
                            O envíanos un mensaje directo por WhatsApp →
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nombre */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Nombre & Apellido *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej: Marcelo Rossi"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@correo.com"
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Teléfono */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          WhatsApp / Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+54 9 11 ...."
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Tipo de Servicio */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Tipo de Proyecto *
                        </label>
                        <select
                          value={formData.serviceType}
                          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="obra_nueva">Vivienda Unifamiliar (Obra Nueva)</option>
                          <option value="interior_mobiliario">Arquitectura Interior & Mobiliario</option>
                          <option value="oficinas">Espacios Corporativos & Oficinas</option>
                          <option value="gastronomia">Locales Comerciales & Gastronomía</option>
                          <option value="regularizacion">Planos Municipales & Trámites CAPBA</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Municipio */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Municipio en Zona Norte *
                        </label>
                        <select
                          value={formData.municipality}
                          onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="Pilar">Pilar</option>
                          <option value="Tigre">Tigre</option>
                          <option value="San Isidro">San Isidro</option>
                          <option value="Vicente López">Vicente López</option>
                          <option value="Escobar">Escobar</option>
                          <option value="San Fernando">San Fernando</option>
                          <option value="Otra Zona">Otra Zona</option>
                        </select>
                      </div>

                      {/* Barrio o Ubicación */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Barrio / Lote / Calle (Opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                          placeholder="Ej: San Sebastián, Lagoon, etc."
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Mensaje */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        Descripción o Idea del Proyecto *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Cuéntanos sobre los metros cuadrados estimados, necesidades espaciales, estilo deseado o dudas reglamentarias..."
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 p-3.5 text-xs text-white focus:outline-none transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* Botón de Envío */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#c8a882] hover:bg-[#b8956c] text-[#262626] font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(200,168,130,0.3)] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#262626]" />
                          <span>Transmitiendo consulta al estudio...</span>
                        </>
                      ) : (
                        <>
                          <span>Enviar Consulta Técnica</span>
                          <Send className="w-3.5 h-3.5 text-[#262626]" />
                        </>
                      )}
                    </button>

                    <div className="text-[10px] font-mono text-neutral-500 text-center">
                      Tus datos se gestionan con protocolos de privacidad y se registran en el panel privado del estudio.
                    </div>
                  </form>
                ) : (
                  /* ESTADO DE ENVÍO REALIZADO CON ÉXITO */
                  <div className="py-8 text-center space-y-6 animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-emerald-950/60 border-2 border-emerald-400 text-emerald-400 rounded-full mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(52,211,153,0.4)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">
                        Consulta Registrada en Acromático OS
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-light uppercase text-white">
                        ¡Gracias, {formData.name}!
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed mt-2">
                        Tu solicitud ha sido transmitida exitosamente al panel de administración del arquitecto.
                        También enviamos un resumen de los datos a tu correo electrónico ({formData.email}).
                      </p>
                    </div>

                    {/* Código de Seguimiento */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 max-w-sm mx-auto text-center space-y-2">
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        Código de Expediente Asignado:
                      </span>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-base font-bold text-white tracking-widest">
                          {trackingCode}
                        </span>
                        <button
                          onClick={copyTracking}
                          className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Copiar código"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {copied && (
                        <span className="text-[10px] font-mono text-emerald-400 block">
                          ¡Código copiado al portapapeles!
                        </span>
                      )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={`https://wa.me/5491158249912?text=${encodeURIComponent(
                          `Hola Acromático Estudio, recién envié una consulta por la web con el código ${trackingCode}. Mi nombre es ${formData.name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Acelerar por WhatsApp</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            serviceType: 'obra_nueva',
                            municipality: 'Pilar',
                            neighborhood: '',
                            message: '',
                          });
                        }}
                        className="w-full sm:w-auto px-6 py-3 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Enviar Otra Consulta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
