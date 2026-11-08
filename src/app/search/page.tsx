'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Star, 
  List, 
  Map as MapIcon,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ProviderProfile, Category } from '@/types';
import ProviderCard from '@/components/ProviderCard';
import MapComponent from '@/components/MapComponent';
import BookingModal from '@/components/BookingModal';
import { DEFAULT_COORDINATES } from '@/lib/geo';

function SearchPageContent() {
  const searchParams = useSearchParams();

  // URL query params
  const initialCat = searchParams.get('category') || 'all';
  const initialRadius = searchParams.get('radius') ? Number(searchParams.get('radius')) : 25;
  const initialLat = searchParams.get('lat') ? Number(searchParams.get('lat')) : DEFAULT_COORDINATES.latitude;
  const initialLng = searchParams.get('lng') ? Number(searchParams.get('lng')) : DEFAULT_COORDINATES.longitude;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [radiusKm, setRadiusKm] = useState<number>(initialRadius);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price_asc' | 'reviews'>('distance');
  const [query, setQuery] = useState<string>('');
  
  const [center, setCenter] = useState<{ latitude: number; longitude: number }>({
    latitude: initialLat,
    longitude: initialLng,
  });

  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [bookingProvider, setBookingProvider] = useState<ProviderProfile | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch(console.error);
  }, []);

  // Fetch providers with geo filters
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: center.latitude.toString(),
        lng: center.longitude.toString(),
        radius: radiusKm.toString(),
        sortBy,
      });

      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (minRating > 0) {
        params.set('minRating', minRating.toString());
      }
      if (query.trim()) {
        params.set('query', query.trim());
      }

      const res = await fetch(`/api/providers/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProviders(data.data);
      }
    } catch (err) {
      console.error('Error fetching providers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory, radiusKm, minRating, sortBy, center]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Géolocalisation indisponible');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed', err);
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#F9F9F7]">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Mot-clé (ex: vidange, fuite d'eau, repassage...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:border-slate-800 outline-none transition-colors"
              />
            </div>

            {/* Category Select */}
            <div className="shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md font-medium text-slate-800 focus:bg-white focus:border-slate-800 outline-none cursor-pointer"
              >
                <option value="all">Tous les corps d&apos;état</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Radius Control */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-stone-50 rounded-md border border-stone-200 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Rayon:</span>
              <span className="font-bold text-slate-900 font-mono text-[11px] tabular-nums">{radiusKm} km</span>
              <input
                type="range"
                min="2"
                max="50"
                step="2"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-20 accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded"
              />
            </div>

            {/* Rating Filter */}
            <div className="hidden sm:block shrink-0">
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md font-medium text-slate-800 focus:bg-white focus:border-slate-800 outline-none cursor-pointer"
              >
                <option value="0">Toutes évaluations</option>
                <option value="4">★ 4.0 et plus</option>
                <option value="4.5">★ 4.5 et plus</option>
                <option value="4.8">★ 4.8 et plus</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md font-medium text-slate-800 focus:bg-white focus:border-slate-800 outline-none cursor-pointer"
              >
                <option value="distance">Trier par proximité</option>
                <option value="rating">Trier par avis client</option>
                <option value="reviews">Trier par volume d&apos;avis</option>
                <option value="price_asc">Tarif le plus bas</option>
              </select>
            </div>

            {/* GPS Locate */}
            <button
              type="button"
              onClick={handleLocateMe}
              title="Centrer la recherche sur ma position"
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-md flex items-center gap-1.5 transition shrink-0"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Autour de moi</span>
            </button>

            {/* Apply Button */}
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold rounded-md shadow-subtle transition shrink-0"
            >
              Filtrer
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Switcher (List vs Map) */}
      <div className="lg:hidden flex items-center justify-center p-2 bg-white border-b border-stone-200">
        <div className="inline-flex rounded-md bg-stone-100 p-0.5 border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition ${
              mobileView === 'list'
                ? 'bg-white text-slate-900 shadow-subtle'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Fiches ({providers.length})</span>
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition ${
              mobileView === 'map'
                ? 'bg-white text-slate-900 shadow-subtle'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Carte</span>
          </button>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full items-start">
          {/* Left Column: Provider Cards List */}
          <div
            className={`lg:col-span-7 space-y-3.5 ${
              mobileView === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div>
                <h1 className="text-base font-bold text-slate-950 font-display">
                  {selectedCategory !== 'all'
                    ? categories.find((c) => c.slug === selectedCategory)?.name || 'Artisans'
                    : 'Artisans & Prestataires disponibles'}
                </h1>
                <p className="text-xs text-slate-500 font-mono">
                  {providers.length} professionnel(s) identifié(s) dans le rayon de {radiusKm} km
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-mono font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calcul spatial...</span>
                </div>
              )}
            </div>

            {providers.length === 0 && !loading && (
              <div className="bg-white rounded-lg border border-stone-200 p-8 text-center space-y-3 shadow-subtle">
                <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Aucun professionnel dans ce secteur</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Aucun artisan ne couvre actuellement ce périmètre exact. Élargissez le rayon ou changez de spécialité.
                </p>
                <button
                  onClick={() => {
                    setRadiusKm(45);
                    setSelectedCategory('all');
                    setMinRating(0);
                  }}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-900 font-semibold text-xs rounded border border-stone-300 transition"
                >
                  Élargir le périmètre à 45 km
                </button>
              </div>
            )}

            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onMouseEnter={() => setSelectedProviderId(provider.id)}
                  onMouseLeave={() => setSelectedProviderId(null)}
                >
                  <ProviderCard
                    provider={provider}
                    isHighlighted={selectedProviderId === provider.id}
                    onBookClick={(p) => setBookingProvider(p)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-36 h-[480px] lg:h-[calc(100vh-160px)] ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-stone-300 shadow-card flex flex-col">
              <div className="px-3.5 py-2 bg-slate-950 text-white flex items-center justify-between text-xs font-semibold font-mono">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Couverture Géodésique</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {providers.length} repères actifs
                </span>
              </div>
              <div className="flex-1 relative">
                <MapComponent
                  center={center}
                  radiusKm={radiusKm}
                  providers={providers}
                  selectedProviderId={selectedProviderId}
                  onSelectProvider={(id) => setSelectedProviderId(id)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        provider={bookingProvider}
        isOpen={!!bookingProvider}
        onClose={() => setBookingProvider(null)}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs font-mono">Initialisation du moteur cartographique...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
