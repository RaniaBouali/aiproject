'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  Briefcase, 
  CalendarCheck, 
  Menu, 
  X, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  LogOut, 
  LayoutDashboard, 
  DollarSign, 
  Eye, 
  Wrench,
  User
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

  // Dynamic Navigation Links strictly segregated by RBAC role
  const getNavLinks = () => {
    if (isProvider) {
      // Prestataire / Artisan: strictly professional management tools
      const providerProfileId =
        session?.providerProfile?.id || session?.user.providerProfileId || 'prov-karim-meca';

      return [
        { name: 'Mon Cockpit Pro', href: '/provider/dashboard', icon: LayoutDashboard },
        { name: 'Gestion des Tarifs', href: '/provider/dashboard#services', icon: DollarSign },
        { name: 'Ma Vitrine Publique', href: `/providers/${providerProfileId}`, icon: Eye },
      ];
    }

    if (isClient) {
      // Client Particulier: search and client tracking only
      return [
        { name: 'Trouver un artisan', href: '/search', icon: Search },
        { name: 'Mes Réservations', href: '/client/dashboard', icon: CalendarCheck },
      ];
    }

    // Guest / Unauthenticated
    return [
      { name: 'Trouver un service', href: '/search', icon: Search },
      { name: 'Catégories', href: '/#categories', icon: Wrench },
      { name: 'Devenir Artisan', href: '/register?role=provider', icon: Briefcase },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - links to dashboard if logged in, else home */}
          <Link
            href={isProvider ? '/provider/dashboard' : '/'}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Proxi<span className="text-blue-600">Service</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium uppercase tracking-wider text-slate-400 ml-1.5 px-1.5 py-0.5 rounded bg-slate-100">
                {isProvider ? 'Espace Artisan' : isClient ? 'Espace Particulier' : 'Services de proximité'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Filtered by RBAC */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                {/* User Role Pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                    isProvider ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {session.user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{session.user.name}</span>
                  <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                    isProvider
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isProvider ? 'Artisan Pro' : 'Client'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Déconnexion sécurisée"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Inscription</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 text-blue-600" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {session ? (
              <>
                <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{session.user.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isProvider ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isProvider ? 'Artisan Pro' : 'Client'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl flex items-center justify-center gap-1.5"
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
                  className="py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold text-white bg-blue-600 rounded-xl"
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
