'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { getStoredSession, AuthSession } from '@/lib/auth-client';
import { Role } from '@/types';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkAuth = () => {
    const s = getStoredSession();
    setSession(s);
    setIsChecking(false);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth_change', checkAuth);
    return () => window.removeEventListener('auth_change', checkAuth);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-2">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Contrôle des accréditations...</p>
      </div>
    );
  }

  // 1. Not Authenticated
  if (!session) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4 py-12 bg-[#F9F9F7]">
        <div className="max-w-md w-full bg-white p-7 rounded-lg border border-stone-300 shadow-card text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-700 border border-amber-200 rounded-md flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 font-display">Authentification Requise</h2>
            <p className="text-xs text-slate-600 mt-1">
              Vous devez être connecté pour accéder à cet espace protégé.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs text-slate-600 text-left font-mono">
            <p className="font-semibold text-slate-800 mb-1 text-[11px]">Rôles habilités pour cette section :</p>
            <div className="flex flex-wrap gap-1.5">
              {allowedRoles.map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded bg-stone-200 text-slate-800 text-[10px] font-bold"
                >
                  {r === 'PROVIDER' ? 'Artisan Pro' : r === 'CLIENT' ? 'Particulier' : r}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs rounded shadow-subtle transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Se connecter</span>
            </Link>
            <Link
              href="/register"
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-xs rounded border border-stone-300 transition"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated but Wrong Role (RBAC Rejection)
  const userRole = session.user.role;
  if (!allowedRoles.includes(userRole)) {
    const isProvider = userRole === 'PROVIDER';

    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4 py-12 bg-[#F9F9F7]">
        <div className="max-w-md w-full bg-white p-7 rounded-lg border border-rose-200 shadow-card text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-700 border border-rose-200 rounded-md flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-rose-700 tracking-wider">
              Contrôle d&apos;accès RBAC
            </span>
            <h2 className="text-base font-bold text-slate-950 font-display mt-0.5">Accès Non Autorisé</h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Votre compte est identifié comme{' '}
              <strong className="text-slate-950">
                {isProvider ? 'Artisan / Prestataire' : 'Client Particulier'}
              </strong>
              . Cette page requiert les prérogatives du rôle{' '}
              <strong className="text-slate-950 font-mono">{allowedRoles.join(', ')}</strong>.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded text-xs text-slate-600 text-left border border-stone-200 space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Rôle actif :</span>
              <span className="font-bold text-slate-950">{userRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rôle(s) attendu(s) :</span>
              <span className="font-bold text-slate-950">{allowedRoles.join(', ')}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={isProvider ? '/provider/dashboard' : '/client/dashboard'}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs rounded shadow-subtle transition flex items-center justify-center gap-1.5"
            >
              <span>{isProvider ? 'Ouvrir mon Cockpit Artisan' : 'Ouvrir mes Réservations'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            <Link
              href="/login"
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-xs rounded border border-stone-300 transition"
            >
              Changer de compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized
  return <>{children}</>;
}
