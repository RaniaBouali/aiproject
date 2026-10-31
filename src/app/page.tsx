'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Wrench, 
  Sparkles, 
  Zap, 
  Droplet, 
  Paintbrush, 
  Hammer, 
  ShieldCheck, 
  Star, 
  Clock, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { INITIAL_CATEGORIES, INITIAL_PROVIDERS } from '@/lib/data-store';
import ProviderCard from '@/components/ProviderCard';
import BookingModal from '@/components/BookingModal';
import { ProviderProfile } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchRadius, setSearchRadius] = useState<number>(25);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ProviderProfile | null>(null);

  // Quick category icons mapper
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'mecanicien':
        return <Wrench className="w-6 h-6 text-blue-600" />;
      case 'femme-de-menage':
        return <Sparkles className="w-6 h-6 text-pink-600" />;
      case 'electricien':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'plombier':
        return <Droplet className="w-6 h-6 text-cyan-600" />;
      case 'peintre':
        return <Paintbrush className="w-6 h-6 text-emerald-600" />;
      case 'menuisier':
        return <Hammer className="w-6 h-6 text-orange-600" />;
      default:
        return <Wrench className="w-6 h-6 text-blue-600" />;
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
        // Default to Algiers center
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Artisans & Professionnels vérifiés de proximité</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Besoin d'un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">mécanicien</span>, d'une <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">femme de ménage</span> ou d'un artisan près de chez vous ?
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light">
            Découvrez instantanément les professionnels disponibles dans votre quartier. Consultez leurs profils complets, avis vérifiés, tarifs transparents et réservez en direct.
          </p>

          {/* Search Box Card */}
          <div className="pt-4 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white text-slate-800 p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-lg flex flex-col md:flex-row items-stretch gap-3 text-left"
            >
              {/* Category selector */}
              <div className="flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Quel service recherchez-vous ?
                </label>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600 shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent font-medium text-slate-900 text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="all">Toutes les spécialités</option>
                    {INITIAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & GPS */}
              <div className="flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Localisation
                </label>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-800 truncate">
                      {userCoords ? 'Position GPS détectée' : 'Alger Centre (par défaut)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoLocate}
                    title="Me géolocaliser automatiquement"
                    className="px-2 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg flex items-center gap-1 shrink-0 transition"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Localisation...' : 'GPS'}</span>
                  </button>
                </div>
              </div>

              {/* Radius slider */}
              <div className="w-full md:w-44 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  <span>Rayon</span>
                  <span className="text-blue-600 font-bold">{searchRadius} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4" />
                <span>Trouver</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explorez les métiers par catégorie
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Des spécialistes qualifiés prêts à intervenir à votre domicile ou sur votre lieu de travail.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="group p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex items-start gap-4"
            >
              <div className="p-3.5 rounded-2xl bg-slate-50 group-hover:bg-blue-50 border border-slate-100 group-hover:border-blue-100 transition-colors shrink-0">
                {getCategoryIcon(cat.slug)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base truncate">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700">
                    {cat.badgeCount} pros
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Verified Providers */}
      <section className="py-16 bg-slate-100/60 border-y border-slate-200/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Les mieux notés</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Artisans recommandés autour de vous
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>Voir tous les artisans sur la carte</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Comment fonctionne ProxiService ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-xl flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Localisez à proximité</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Activez votre GPS ou indiquez votre quartier. Notre moteur spatial PostGIS calcule les artisans les plus proches de vous en temps réel.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-xl flex items-center justify-center mx-auto border border-indigo-100 shadow-inner">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Consultez les profils & tarifs</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Photos de réalisations antérieures, tarifs fixes ou horaires détaillés et évaluations 100% certifiées laissées par de vrais clients.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-xl flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Prenez rendez-vous en direct</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Choisissez votre créneau et vos besoins. L’artisan reçoit votre demande instantanément et confirme son intervention sans commission abusive.
            </p>
          </div>
        </div>
      </section>

      {/* Pro CTA Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider">
              Vous êtes artisan ou prestataire ?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Développez votre clientèle locale dès aujourd'hui
            </h3>
            <p className="text-blue-100 text-sm max-w-xl">
              Créez votre vitrine professionnelle, définissez votre zone de chalandise kilométrique et recevez directement les demandes des particuliers de votre secteur.
            </p>
          </div>

          <Link
            href="/provider/dashboard"
            className="shrink-0 px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-xl transition-transform active:scale-95"
          >
            Accéder à l'espace Pro
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
