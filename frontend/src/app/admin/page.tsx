'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Comprobar si ya está logueado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.getMe();
        if (res.success) {
          router.push('/admin/dashboard');
        }
      } catch (err) {}
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(email, password);
      if (res.success) {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setEmail('contacto@acromaticoestudio.com');
    setPassword('AcromaticoAdmin2025!');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 architectural-grid relative">
      <div className="w-full max-w-md p-8 glass-panel border border-neutral-800 shadow-2xl relative z-10 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border border-neutral-700 bg-neutral-900 mx-auto flex items-center justify-center font-mono text-sm text-white">
            A
          </div>
          <h1 className="text-xl font-medium tracking-[0.2em] uppercase text-white">
            ACROMÁTICO OS
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Acceso Privado para el Arquitecto Titular
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contacto@acromaticoestudio.com"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-white pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-white pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando Credenciales...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Estudio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Credenciales de Prueba Rápidas */}
        <div className="p-3 bg-neutral-900/60 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Credenciales del Administrador:</span>
            <button
              type="button"
              onClick={autofillDemo}
              className="text-white underline hover:text-neutral-300"
            >
              Completar automáticamente
            </button>
          </div>
          <div className="text-[10px] text-neutral-500">
            Usuario: <span className="text-neutral-300">contacto@acromaticoestudio.com</span> <br />
            Clave: <span className="text-neutral-300">AcromaticoAdmin2025!</span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}
