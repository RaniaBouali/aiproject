'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  AlertCircle,
  Star,
  ArrowRight
} from 'lucide-react';
import { Booking } from '@/types';
import ReviewModal from '@/components/ReviewModal';
import RoleGuard from '@/components/RoleGuard';

export default function ClientDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock3 className="w-3.5 h-3.5" />
            En attente de confirmation
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmé par l'artisan
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Prestation Réalisée
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Indisponible / Refusé
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  return (
    <RoleGuard allowedRoles={['CLIENT']}>
      <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Mes Réservations & Rendez-vous
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Suivez l'état d'avancement de vos demandes de prestations avec vos artisans locaux.
            </p>
          </div>

          <Link
            href="/search"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Nouvelle demande
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === st
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL'
                ? 'Toutes les demandes'
                : st === 'PENDING'
                ? 'En attente'
                : st === 'ACCEPTED'
                ? 'Confirmées'
                : 'Terminées'}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            Chargement de vos demandes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Aucune réservation trouvée</h3>
            <p className="text-xs text-slate-500">
              Vous n'avez pas encore passé de commande ou aucune demande ne correspond à ce filtre.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              <span>Parcourir les artisans disponibles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Réf: #{b.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{b.serviceTitle}</h3>
                    <p className="text-xs text-blue-600 font-semibold">Avec {b.providerName}</p>
                  </div>

                  <div>{getStatusBadge(b.status)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Prévu le : <strong>{new Date(b.scheduledAt).toLocaleDateString('fr-FR')} à {new Date(b.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Lieu : {b.clientAddress || 'À convenir'}</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-slate-400 block text-[10px]">Tarif convenu :</span>
                    <span className="text-base font-bold text-slate-900">
                      {b.servicePrice.toLocaleString()} DA
                    </span>
                  </div>
                </div>

                {b.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700">Vos instructions : </span>
                    {b.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="text-xs text-slate-400">
                    Créée le {new Date(b.createdAt).toLocaleDateString('fr-FR')}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/providers/${b.providerId}`}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                      Voir profil pro
                    </Link>

                    {b.status === 'ACCEPTED' || b.status === 'COMPLETED' ? (
                      <button
                        onClick={() => setReviewingBooking(b)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Noter la prestation</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingBooking && (
        <ReviewModal
          providerId={reviewingBooking.providerId}
          providerName={reviewingBooking.providerName}
          bookingId={reviewingBooking.id}
          isOpen={!!reviewingBooking}
          onClose={() => setReviewingBooking(null)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
    </RoleGuard>
  );
}
