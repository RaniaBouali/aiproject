'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Wrench, 
  Sparkles, 
  Zap, 
  Droplets, 
  Paintbrush, 
  Hammer, 
  ShieldCheck, 
  Star, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { INITIAL_CATEGORIES, INITIAL_PROVIDERS } from '@/lib/data-store';
import ProviderCard from '@/components/ProviderCard';
import BookingModal from '@/components/BookingModal';
import { ProviderProfile } from '@/types';
import { getStoredSession, AuthSession } from '@/lib/auth-client';

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchRadius, setSearchRadius] = useState<number>(25);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ProviderProfile | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  // Purposeful trade icons
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'mecanicien':
        return <Wrench className="w-5 h-5 text-amber-700" />;
      case 'femme-de-menage':
        return <Sparkles className="w-5 h-5 text-amber-700" />;
      case 'electricien':
        return <Zap className="w-5 h-5 text-amber-700" />;
      case 'plombier':
        return <Droplets className="w-5 h-5 text-amber-700" />;
      case 'peintre':
        return <Paintbrush className="w-5 h-5 text-amber-700" />;
      case 'menuisier':
        return <Hammer className="w-5 h-5 text-amber-700" />;
      default:
        return <Wrench className="w-5 h-5 text-amber-700" />;
    }
  };

  // Browser GPS auto-locate
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par votre navigateur');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied or failed, using defaults', err);
        setIsLocating(false);
        setUserCoords({ lat: 36.7538, lng: 3.0588 });
      }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    params.set('radius', searchRadius.toString());
    if (userCoords) {
      params.set('lat', userCoords.lat.toString());
      params.set('lng', userCoords.lng.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F7]">
      {/* Editorial Workbench Hero */}
      <section className="relative bg-slate-950 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="max-w-3xl space-y-5">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Réseau d&apos;artisans certifiés et vérifiés à l&apos;adresse</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-display">
              Trouvez l&apos;artisan compétent qui intervient dans votre quartier.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl font-sans">
              Mécanique mobile, plomberie d&apos;urgence, électricité, travaux et services à domicile. Tarifs fixes en Dinars Algériens, avis clients authentifiés et mise en relation directe.
            </p>
          </div>

          {/* Provider Cockpit Jump (If logged in as provider) */}
          {session?.user.role === 'PROVIDER' && (
            <div className="mt-8 p-3.5 bg-slate-900/90 border border-amber-600/40 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-amber-600 text-slate-950 font-bold shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Session Artisan active &mdash; {session.user.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Accédez directement à vos demandes d&apos;intervention en attente et à votre grille tarifaire.
                  </p>
                </div>
              </div>
              <Link
                href="/provider/dashboard"
                className="shrink-0 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded transition flex items-center gap-1.5"
              >
                <span>Mon Cockpit Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Search Workbench */}
          <div className="mt-8">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white text-slate-900 p-2 sm:p-2.5 rounded-lg border border-stone-300 shadow-elevated flex flex-col md:flex-row items-stretch gap-2"
            >
              {/* Category selector */}
              <div className="flex-1 min-w-[220px] px-3 py-2 border-b md:border-b-0 md:border-r border-stone-200">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  1. Métier / Prestation
                </label>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-700 shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-900 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="all">Tous les corps d&apos;état</option>
                    {INITIAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & GPS */}
              <div className="flex-1 min-w-[220px] px-3 py-2 border-b md:border-b-0 md:border-r border-stone-200">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  2. Secteur d&apos;intervention
                </label>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {userCoords ? 'Coordonnées GPS actives' : 'Alger Centre (par défaut)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoLocate}
                    title="Détecter ma position exacte"
                    className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:text-slate-950 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 flex items-center gap-1 shrink-0 transition"
                  >
                    <Crosshair className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Scan...' : 'GPS'}</span>
                  </button>
                </div>
              </div>

              {/* Radius slider */}
              <div className="w-full md:w-44 px-3 py-2 border-b md:border-b-0 md:border-r border-stone-200">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  <span>Rayon</span>
                  <span className="text-slate-900 font-bold tabular-nums">{searchRadius} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded"
                />
              </div>

              {/* Action */}
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 active:bg-slate-950 text-white font-semibold text-xs rounded-md shadow-subtle flex items-center justify-center gap-2 transition"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Rechercher</span>
              </button>
            </form>
          </div>

          {/* Quick stats strip */}
          <div className="mt-8 pt-6 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="block text-slate-200 font-bold text-base tabular-nums">100%</span>
              <span>Identités vérifiées</span>
            </div>
            <div>
              <span className="block text-slate-200 font-bold text-base tabular-nums">0 DZD</span>
              <span>Frais pour le particulier</span>
            </div>
            <div>
              <span className="block text-slate-200 font-bold text-base tabular-nums">&lt; 15 min</span>
              <span>Temps de réponse moyen</span>
            </div>
            <div>
              <span className="block text-slate-200 font-bold text-base tabular-nums">4.9 / 5</span>
              <span>Satisfaction globale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Categories Directory */}
      <section id="categories" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Spécialités professionnelles
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight font-display mt-0.5">
              Sélectionnez un corps de métier
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md">
            Chaque artisan dispose d&apos;une fiche technique complète avec zone d&apos;intervention et grille tarifaire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="group p-4 bg-white rounded-lg border border-stone-200/90 hover:border-stone-400 shadow-card hover:shadow-elevated transition-all flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded bg-stone-100 group-hover:bg-amber-50 border border-stone-200 group-hover:border-amber-200 transition-colors shrink-0">
                {getCategoryIcon(cat.slug)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-950 group-hover:text-amber-800 transition-colors text-sm truncate font-display">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-slate-700 border border-stone-200 group-hover:border-stone-300">
                    {cat.badgeCount} pros
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Verified Artisans */}
      <section className="py-14 bg-stone-100/70 border-y border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-amber-800 mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Recommandés par les clients</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
                Artisans prêts à intervenir dans le secteur
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-amber-800 hover:underline"
            >
              <span>Consulter la carte complète</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_PROVIDERS.slice(0, 4).map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onBookClick={(p) => setSelectedProviderForBooking(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works: Architectural Step Blueprint */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-xl mb-12">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Méthodologie ProxiService
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight font-display mt-0.5">
            Processus d&apos;intervention en 3 étapes
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Une mise en relation directe, sans intermédiaires inutiles ni commissions occultes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-3">
            <div className="w-8 h-8 rounded bg-slate-950 text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-950 font-display">Localisation du périmètre</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Définissez votre adresse ou activez le GPS. Notre algorithme géodésique Haversine calcule en direct les artisans situés dans votre rayon kilométrique.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-3">
            <div className="w-8 h-8 rounded bg-slate-950 text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-950 font-display">Consultation de la grille tarifaire</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vérifiez les tarifs déclarés à l&apos;avance (au forfait ou à l&apos;heure), les antécédents professionnels et les avis vérifiés des précédents clients.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-3">
            <div className="w-8 h-8 rounded bg-slate-950 text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-950 font-display">Demande & Intervention directe</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sélectionnez la date, transmettez vos coordonnées et le descriptif du besoin. L&apos;artisan prend directement contact pour valider l&apos;intervention.
            </p>
          </div>
        </div>
      </section>

      {/* Pro Registration Callout */}
      <section className="bg-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
        <div className="max-w-5xl mx-auto rounded-lg bg-slate-900 border border-stone-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase font-bold">
              <Wrench className="w-3.5 h-3.5" />
              <span>Espace Prestataires & Artisans</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              Vous exercez un métier de terrain ? Rejoignez le réseau ProxiService.
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Recevez des demandes d&apos;intervention qualifiées dans votre secteur d&apos;activité sans commission abusive sur vos prestations.
            </p>
          </div>

          <Link
            href="/register?role=provider"
            className="shrink-0 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded transition flex items-center gap-1.5 shadow-subtle"
          >
            <span>Créer ma fiche Artisan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        provider={selectedProviderForBooking}
        isOpen={!!selectedProviderForBooking}
        onClose={() => setSelectedProviderForBooking(null)}
      />
    </div>
  );
}
