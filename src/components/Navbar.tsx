'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  Briefcase, 
  CalendarCheck, 
  Menu, 
  X, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Trouver un service', href: '/search', icon: Search },
    { name: 'Mes Réservations', href: '/client/dashboard', icon: CalendarCheck },
    { name: 'Espace Artisan', href: '/provider/dashboard', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Proxi<span className="text-blue-600">Service</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium uppercase tracking-wider text-slate-400 ml-1.5 px-1.5 py-0.5 rounded bg-slate-100">
                Services de proximité
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
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

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-600/30 transition-all hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Services à proximité</span>
            </Link>
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
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
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
          <div className="pt-2">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-medium text-white bg-blue-600 rounded-lg shadow-sm"
            >
              <Search className="w-5 h-5" />
              <span>Trouver un artisan</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
