'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  SlidersHorizontal, 
  Star, 
  List, 
  Map as MapIcon,
  RefreshCw,
  AlertCircle
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
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ex: Révision frein, vidange, repassage..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-100/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="all">Toutes spécialités</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Radius Control */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Rayon:</span>
              <span className="font-bold text-blue-600">{radiusKm} km</span>
              <input
                type="range"
                min="2"
                max="50"
                step="2"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-20 accent-blue-600 cursor-pointer h-1.5 bg-slate-300 rounded"
              />
            </div>

            {/* Rating Filter */}
            <div className="hidden sm:block shrink-0">
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-100/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="0">Toutes les notes</option>
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
                className="px-3 py-2 text-xs sm:text-sm bg-slate-100/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="distance">Trier par proximité</option>
                <option value="rating">Trier par note</option>
                <option value="reviews">Trier par nombre d'avis</option>
                <option value="price_asc">Prix croissant</option>
              </select>
            </div>

            {/* Locate Me Button */}
            <button
              type="button"
              onClick={handleLocateMe}
              title="Centrer la recherche sur mon GPS"
              className="px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition shrink-0"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Autour de moi</span>
            </button>

            {/* Search Submit */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
            >
              Actualiser
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Switcher (List vs Map) */}
      <div className="lg:hidden flex items-center justify-center p-2 bg-white border-b border-slate-200">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition ${
              mobileView === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Liste ({providers.length})</span>
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition ${
              mobileView === 'map'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Carte</span>
          </button>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
          {/* Left Column: Provider Cards List */}
          <div
            className={`lg:col-span-7 space-y-4 ${
              mobileView === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  {selectedCategory !== 'all'
                    ? categories.find((c) => c.slug === selectedCategory)?.name || 'Artisans'
                    : 'Tous les services de proximité'}
                </h1>
                <p className="text-xs text-slate-500">
                  {providers.length} professionnel(s) trouvé(s) dans un rayon de {radiusKm} km
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-1 text-xs text-blue-600 animate-pulse font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calcul spatial...</span>
                </div>
              )}
            </div>

            {providers.length === 0 && !loading && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Aucun prestataire dans ce périmètre</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Essayez d'élargir votre rayon de recherche (ex: 35 ou 50 km) ou de réinitialiser vos filtres.
                </p>
                <button
                  onClick={() => {
                    setRadiusKm(45);
                    setSelectedCategory('all');
                    setMinRating(0);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl hover:bg-blue-100 transition"
                >
                  Élargir à 45 km
                </button>
              </div>
            )}

            <div className="space-y-4">
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
            className={`lg:col-span-5 lg:sticky lg:top-36 h-[500px] lg:h-[calc(100vh-170px)] ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="w-full h-full bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md flex flex-col">
              <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Visualisation Géographique & Rayon de Couverture</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">
                  {providers.length} repères
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
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-sm">Chargement du moteur spatial...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
