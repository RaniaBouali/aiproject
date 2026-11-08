'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Briefcase, 
  CalendarCheck, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  LogOut, 
  LayoutDashboard, 
  DollarSign, 
  Eye, 
  Wrench,
  Hammer
} from 'lucide-react';
import { getStoredSession, clearSession, AuthSession } from '@/lib/auth-client';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const syncAuth = () => {
    setSession(getStoredSession());
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener('auth_change', syncAuth);
    return () => window.removeEventListener('auth_change', syncAuth);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const userRole = session?.user.role;
  const isProvider = userRole === 'PROVIDER';
  const isClient = userRole === 'CLIENT';

  // Dynamic Navigation Links strictly segregated by RBAC role (tested in rbac-security.test.ts)
  const getNavLinks = () => {
    if (isProvider) {
      const providerProfileId =
        session?.providerProfile?.id || session?.user.providerProfileId || 'prov-karim-meca';

      return [
        { name: 'Mon Cockpit Pro', href: '/provider/dashboard', icon: LayoutDashboard },
        { name: 'Gestion des Tarifs', href: '/provider/dashboard#services', icon: DollarSign },
        { name: 'Ma Vitrine Publique', href: `/providers/${providerProfileId}`, icon: Eye },
      ];
    }

    if (isClient) {
      return [
        { name: 'Trouver un artisan', href: '/search', icon: Search },
        { name: 'Mes Réservations', href: '/client/dashboard', icon: CalendarCheck },
      ];
    }

    return [
      { name: 'Trouver un service', href: '/search', icon: Search },
      { name: 'Catégories', href: '/#categories', icon: Wrench },
      { name: 'Devenir Artisan', href: '/register?role=provider', icon: Briefcase },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-[#F9F9F7]/95 backdrop-blur-md border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Mark */}
          <Link
            href={isProvider ? '/provider/dashboard' : '/'}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-sm transition-colors group-hover:bg-slate-800">
              <Hammer className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-950 font-display">
                  Proxi<span className="text-amber-700">Service</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-semibold px-1 py-0.5 rounded bg-stone-200">
                  DZ
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-700 tracking-wide">
                {isProvider ? 'Atelier Prestataire' : isClient ? 'Espace Particulier' : 'Réseau d’artisans qualifiés'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('#'));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-normal transition-colors ${
                    isActive
                      ? 'bg-stone-200/90 text-slate-950 shadow-subtle border border-stone-300/80'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-slate-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Desktop Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-md text-xs border border-stone-200 shadow-subtle">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${
                    isProvider ? 'bg-amber-700' : 'bg-slate-800'
                  }`}>
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate font-medium text-slate-800">{session.user.name}</span>
                  <span className={`text-[10px] font-mono uppercase font-semibold px-1.5 py-0.2 rounded border ${
                    isProvider
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {isProvider ? 'PRO' : 'CLIENT'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md border border-transparent hover:border-rose-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-stone-200/70 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-900 rounded-md shadow-subtle transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inscription</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-stone-200/70 border border-stone-200 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#F9F9F7] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold ${
                  isActive
                    ? 'bg-stone-200 text-slate-900 border border-stone-300'
                    : 'text-slate-700 hover:bg-stone-200/50'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-700" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            {session ? (
              <>
                <div className="p-2.5 bg-white rounded-md border border-stone-200 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{session.user.name}</span>
                  <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${
                    isProvider ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {isProvider ? 'PRO' : 'CLIENT'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold text-slate-800 bg-white border border-stone-300 rounded-md shadow-subtle"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold text-white bg-slate-900 rounded-md shadow-subtle"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
