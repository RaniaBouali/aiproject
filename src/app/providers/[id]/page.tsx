'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft, 
  Share2, 
  MessageSquare,
  Sparkles,
  Wrench,
  ThumbsUp
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
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Chargement du profil professionnel...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Prestataire introuvable</h2>
        <p className="text-sm text-slate-500">Ce profil n'existe pas ou a été désactivé.</p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la recherche
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux résultats</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Disponible aujourd'hui
            </span>
          </div>
        </div>
      </div>

      {/* Profile Header Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-white shadow-lg"
                />
                {provider.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {provider.name}
                  </h1>
                  {provider.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Artisan Vérifié
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{provider.ratingAverage.toFixed(1)}</span>
                  </div>
                  <span>({provider.reviewCount} avis clients)</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{provider.addressText}</span>
                  </div>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Intervention dans un rayon de {provider.operationalRadiusKm} km
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {provider.categories.map((c) => (
                    <span
                      key={c.id}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                    >
                      {c.name}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 bg-slate-50">
                    {provider.experienceYears} ans de métier
                  </span>
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Prendre Rendez-vous</span>
              </button>

              <a
                href={`tel:${provider.phone}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{provider.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'services'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Prestations & Tarifs ({provider.services.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'portfolio'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Photos de Réalisations ({provider.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Avis Clients ({provider.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            À propos & Zone
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* TAB: Services */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Catalogue des prestations</h3>
                <span className="text-xs text-slate-400">Tarifs en Dinars Algériens (DA)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {provider.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-bold text-slate-900 text-base">{srv.title}</h4>
                        <div className="text-right shrink-0">
                          <span className="text-base font-extrabold text-blue-600">
                            {srv.price.toLocaleString()} DA
                          </span>
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                            {srv.priceType === 'HOURLY' ? 'par heure' : srv.priceType === 'ESTIMATE' ? 'sur devis' : 'forfait'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {srv.durationMinutes && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Durée estimée: ~{srv.durationMinutes} min
                        </span>
                      )}
                      <button
                        onClick={() => setBookingModalOpen(true)}
                        className="ml-auto px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-semibold rounded-xl transition"
                      >
                        Sélectionner ce service
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
              <h3 className="text-lg font-bold text-slate-900">Galerie de travaux récents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {provider.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-slate-500">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="text-4xl font-extrabold text-slate-900">
                    {provider.ratingAverage.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${
                            s <= Math.round(provider.ratingAverage)
                              ? 'fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Basé sur {provider.reviewCount} évaluations certifiées
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-2xl transition"
                >
                  Laisser un avis sur cet artisan
                </button>
              </div>

              <div className="space-y-3">
                {provider.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {rev.clientName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {rev.clientName}
                          </span>
                          <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: About */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Présentation du professionnel</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{provider.bio}</p>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Garanties & Engagements</h3>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Identité & carte artisanale vérifiées par les équipes ProxiService</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Respect des devis et tarifs annoncés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Intervention rapide à domicile dans sa zone de chalandise</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Zone d'intervention</h3>
                  <div className="text-xs text-slate-600 space-y-2">
                    <p>
                      <strong>Point d'attache :</strong> {provider.addressText}
                    </p>
                    <p>
                      <strong>Rayon opérationnel :</strong> {provider.operationalRadiusKm} km autour de sa base
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
