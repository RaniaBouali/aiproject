'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  Hammer,
  UserCheck
} from 'lucide-react';
import { saveSession } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('client@proxiservice.com');
  const [password, setPassword] = useState<string>('password123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Identifiants invalides');
      }

      saveSession({
        user: data.data.user,
        token: data.data.token,
        providerProfile: data.data.providerProfile,
      });

      if (data.data.user.role === 'PROVIDER') {
        router.push('/provider/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F9F9F7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-slate-950 text-amber-500 border border-slate-800 shadow-subtle mx-auto">
          <Hammer className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
          Connexion à ProxiService
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          Accédez à votre espace particulier ou à votre cockpit d&apos;artisan
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick Demo Switcher */}
        <div className="mb-4 p-3 bg-white rounded-lg border border-stone-300 shadow-card text-xs space-y-2 font-mono">
          <span className="font-semibold flex items-center gap-1.5 text-slate-800 text-[11px]">
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            Comptes de test rapides (1 clic) :
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('client@proxiservice.com')}
              className="p-1.5 bg-stone-50 rounded border border-stone-200 text-left hover:border-slate-800 hover:bg-white transition text-[11px] font-semibold text-slate-800 truncate"
            >
              Particulier (Sarah B.)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('karim.meca@proxiservice.com')}
              className="p-1.5 bg-stone-50 rounded border border-stone-200 text-left hover:border-slate-800 hover:bg-white transition text-[11px] font-semibold text-slate-800 truncate"
            >
              Mécanicien (Karim)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('fatima.menage@proxiservice.com')}
              className="p-1.5 bg-stone-50 rounded border border-stone-200 text-left hover:border-slate-800 hover:bg-white transition text-[11px] font-semibold text-slate-800 truncate"
            >
              Ménage (Fatima)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ahmed.elec@proxiservice.com')}
              className="p-1.5 bg-stone-50 rounded border border-stone-200 text-left hover:border-slate-800 hover:bg-white transition text-[11px] font-semibold text-slate-800 truncate"
            >
              Électricien (Ahmed)
            </button>
          </div>
        </div>

        <div className="bg-white py-6 px-6 sm:px-8 border border-stone-300 rounded-lg shadow-card space-y-5">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1">
                Adresse électronique
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded text-xs shadow-subtle transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>{loading ? 'Authentification...' : 'Se connecter'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-stone-200 text-center">
            <p className="text-xs text-slate-600">
              Pas encore inscrit ?{' '}
              <Link href="/register" className="font-semibold text-slate-950 hover:text-amber-800 underline">
                Créer un compte Particulier ou Artisan
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
