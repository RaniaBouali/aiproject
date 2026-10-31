'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Vérification des droits d'accès...</p>
      </div>
    );
  }

  // 1. Not Authenticated
  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Connexion Requise</h2>
            <p className="text-xs text-slate-500 mt-1">
              Vous devez être connecté pour accéder à cet espace sécurisé.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left">
            <p className="font-semibold text-slate-800 mb-1">Rôles autorisés pour cette page :</p>
            <div className="flex gap-2">
              {allowedRoles.map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold"
                >
                  {r === 'PROVIDER' ? 'Artisan / Prestataire' : r === 'CLIENT' ? 'Client Particulier' : r}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Se connecter</span>
            </Link>
            <Link
              href="/register"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
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
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
              Contrôle d'accès (RBAC)
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">Accès Non Autorisé</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Vous êtes actuellement connecté en tant que{' '}
              <strong className="text-slate-900">
                {isProvider ? 'Prestataire Professionnel' : 'Client Particulier'}
              </strong>
              . Cette page est strictement réservée au rôle{' '}
              <strong className="text-blue-600">{allowedRoles.join(', ')}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 text-left border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Votre rôle actuel :</span>
              <span className="font-bold text-slate-900">{userRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rôle(s) requis :</span>
              <span className="font-bold text-blue-600">{allowedRoles.join(', ')}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={isProvider ? '/provider/dashboard' : '/client/dashboard'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{isProvider ? 'Aller à mon Cockpit Artisan' : 'Aller à mes Réservations'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
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
