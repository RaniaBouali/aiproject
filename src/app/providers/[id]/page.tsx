'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft, 
  Wrench, 
  Check, 
  CalendarCheck,
  CheckCircle2,
  FileText,
  Camera,
  MessageSquare
} from 'lucide-react';
import { ProviderProfile } from '@/types';
import { formatDistance } from '@/lib/geo';
import BookingModal from '@/components/BookingModal';
import ReviewModal from '@/components/ReviewModal';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'reviews' | 'about'>('services');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/providers/${providerId}`);
      const data = await res.json();
      if (data.success) {
        setProvider(data.data);
      }
    } catch (err) {
      console.error('Failed to load provider', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchProfile();
    }
  }, [providerId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-500">Chargement de la fiche artisan...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-display">Artisan introuvable</h2>
        <p className="text-xs text-slate-500">Cette fiche artisan n&apos;existe pas ou a été retirée du répertoire.</p>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold shadow-subtle"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au répertoire
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F7] min-h-screen pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-stone-200 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux artisans</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Disponible pour intervention
            </span>
          </div>
        </div>
      </div>

      {/* Profile Header Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-lg p-5 sm:p-7 border border-stone-200/90 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border border-stone-300 shadow-subtle bg-stone-100"
                />
                {provider.isVerified && (
                  <div
                    title="Identité vérifiée par ProxiService"
                    className="absolute -bottom-1 -right-1 bg-emerald-700 text-white p-0.5 rounded border border-white shadow-sm flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
                    {provider.name}
                  </h1>
                  {provider.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      Artisan Vérifié
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1 text-amber-600 font-bold tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-slate-900">{provider.ratingAverage.toFixed(1)}</span>
                  </div>
                  <span className="text-slate-500 font-mono">({provider.reviewCount} avis certifiés)</span>
                  <span className="text-stone-300 hidden sm:inline">&bull;</span>
                  <div className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{provider.addressText}</span>
                  </div>
                  <span className="text-stone-300 hidden sm:inline">&bull;</span>
                  <span className="text-slate-700 font-mono text-[11px]">
                    Rayon d&apos;intervention: {provider.operationalRadiusKm} km
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {provider.categories.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-slate-800 border border-stone-200"
                    >
                      {c.name}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded text-xs font-medium text-slate-600 bg-stone-50 border border-stone-200">
                    {provider.experienceYears} ans de métier
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Column */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
              <button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs rounded-md shadow-subtle flex items-center justify-center gap-2 transition"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Demander une intervention</span>
              </button>

              <a
                href={`tel:${provider.phone}`}
                className="w-full sm:w-auto px-5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-xs rounded-md border border-stone-300 flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-mono">{provider.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-stone-200 mt-6 font-mono text-xs">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-3.5 font-bold border-b-2 transition ${
              activeTab === 'services'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Grille Tarifaire ({provider.services.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 px-3.5 font-bold border-b-2 transition ${
              activeTab === 'portfolio'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Chantiers & Travaux ({provider.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-3.5 font-bold border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Avis Clients ({provider.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-3.5 font-bold border-b-2 transition ${
              activeTab === 'about'
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Fiche & Périmètre
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* TAB: Services */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  Catalogue des prestations déclarées
                </h3>
                <span className="text-xs font-mono text-slate-500">Tarification directe en DZD</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {provider.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 bg-white rounded-lg border border-stone-200/90 shadow-card hover:border-stone-400 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h4 className="font-bold text-slate-950 text-sm">{srv.title}</h4>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-slate-950 font-mono tabular-nums">
                            {srv.price.toLocaleString()} DZD
                          </span>
                          <span className="block text-[10px] text-slate-500 uppercase font-mono font-semibold">
                            {srv.priceType === 'HOURLY' ? '/ heure' : srv.priceType === 'ESTIMATE' ? 'sur devis' : 'forfait'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      {srv.durationMinutes && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          ~{srv.durationMinutes} min
                        </span>
                      )}
                      <button
                        onClick={() => setBookingModalOpen(true)}
                        className="ml-auto px-3 py-1.5 bg-stone-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-semibold rounded border border-stone-200 transition"
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-950 font-display">
                Galerie de travaux récents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {provider.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden border border-stone-200 shadow-card"
                  >
                    <div className="relative h-44 overflow-hidden bg-stone-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-slate-950 text-xs mb-0.5">{item.title}</h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-500">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-lg border border-stone-200/90 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-slate-950 font-mono tabular-nums">
                    {provider.ratingAverage.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(provider.ratingAverage)
                              ? 'fill-amber-500'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      Basé sur {provider.reviewCount} avis authentifiés
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-subtle transition"
                >
                  Laisser un avis vérifié
                </button>
              </div>

              <div className="space-y-2.5">
                {provider.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-stone-100 border border-stone-200 text-slate-800 font-bold text-xs flex items-center justify-center font-mono">
                          {rev.clientName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-950 block">
                            {rev.clientName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{rev.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? 'fill-amber-500' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: About */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-2">
                  <h3 className="text-sm font-bold text-slate-950 font-display">Présentation de l&apos;artisan</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{provider.bio}</p>
                </div>

                <div className="p-5 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-2.5">
                  <h3 className="text-sm font-bold text-slate-950 font-display">Garanties & Engagements de service</h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Identité et inscription au registre des métiers validées par ProxiService</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Respect strict de la grille tarifaire déclarée sans majoration imprévue</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Intervention ponctuelle sur site avec outillage adapté</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-2">
                  <h3 className="text-xs font-bold text-slate-950 font-mono uppercase tracking-wider">Zone d&apos;activité</h3>
                  <div className="text-xs text-slate-700 space-y-1.5">
                    <p>
                      <strong>Atelier / Base :</strong> {provider.addressText}
                    </p>
                    <p>
                      <strong>Rayon d&apos;action :</strong> {provider.operationalRadiusKm} km
                    </p>
                    <p className="text-slate-500 text-[11px] pt-1">
                      Déplacement possible à domicile ou sur lieu de travail dans l&apos;ensemble de cette circonscription.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        provider={provider}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        providerId={provider.id}
        providerName={provider.name}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={fetchProfile}
      />
    </div>
  );
}
