'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LogIn, 
  Mail, 
  Lock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Briefcase,
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
        throw new Error(data.error || 'Échec de la connexion');
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
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
          <MapPin className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Connexion à ProxiService
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Accédez à votre espace client ou à votre tableau de bord artisan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Quick Demo Switcher */}
        <div className="mb-4 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-blue-900 space-y-2">
          <span className="font-bold flex items-center gap-1.5 text-blue-800">
            <UserCheck className="w-4 h-4" />
            Comptes de test pré-remplis (1 clic) :
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('client@proxiservice.com')}
              className="p-2 bg-white rounded-xl border border-blue-200 text-left hover:border-blue-500 transition text-[11px] font-semibold text-slate-800 shadow-sm"
            >
              🙋‍♀️ Client (Sarah B.)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('karim.meca@proxiservice.com')}
              className="p-2 bg-white rounded-xl border border-blue-200 text-left hover:border-blue-500 transition text-[11px] font-semibold text-slate-800 shadow-sm"
            >
              🔧 Mécanicien (Karim)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('fatima.menage@proxiservice.com')}
              className="p-2 bg-white rounded-xl border border-blue-200 text-left hover:border-blue-500 transition text-[11px] font-semibold text-slate-800 shadow-sm"
            >
              ✨ Femme de ménage (Fatima)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ahmed.elec@proxiservice.com')}
              className="p-2 bg-white rounded-xl border border-blue-200 text-left hover:border-blue-500 transition text-[11px] font-semibold text-slate-800 shadow-sm"
            >
              ⚡ Électricien (Ahmed)
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl border border-slate-200/80 rounded-3xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Pas encore inscrit ?{' '}
              <Link href="/register" className="font-bold text-blue-600 hover:underline">
                Créer un compte (Client ou Artisan)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
