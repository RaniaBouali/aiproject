'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Star,
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare
} from 'lucide-react';
import { Booking } from '@/types';
import ReviewModal from '@/components/ReviewModal';
import RoleGuard from '@/components/RoleGuard';
import { getStoredSession } from '@/lib/auth-client';

export default function ClientDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const session = getStoredSession();
      const clientId = session?.user?.id;

      const res = await fetch('/api/bookings');
      const data = await res.json();

      if (data.success) {
        const myBookings = clientId
          ? data.data.filter((b: Booking) => b.clientId === clientId)
          : [];
        setBookings(myBookings);
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock3 className="w-3 h-3 text-amber-700" />
            En attente de confirmation
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Confirmé par l&apos;artisan
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 text-slate-700" />
            Prestation Réalisée
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Indisponible / Décliné
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-stone-100 text-slate-800 border border-stone-200">
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
      <div className="bg-[#F9F9F7] min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200/90 shadow-card">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Espace Particulier
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-display mt-0.5">
                Mes Ordres d&apos;Intervention
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-sans">
                Suivez en direct l&apos;état d&apos;avancement de vos demandes auprès des artisans locaux.
              </p>
            </div>

            <Link
              href="/search"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-subtle flex items-center gap-1.5 transition"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Trouver un autre artisan</span>
            </Link>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-stone-200 font-mono text-xs">
            {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`pb-2.5 px-3 font-bold border-b-2 transition ${
                  filterStatus === st
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'ALL'
                  ? `Toutes (${bookings.length})`
                  : st === 'PENDING'
                  ? `En attente (${bookings.filter(b => b.status === 'PENDING').length})`
                  : st === 'ACCEPTED'
                  ? `Confirmées (${bookings.filter(b => b.status === 'ACCEPTED').length})`
                  : `Terminées (${bookings.filter(b => b.status === 'COMPLETED').length})`}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-7 h-7 border-2 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
              <p className="text-slate-500 text-xs font-mono">Synchronisation des interventions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 bg-white rounded-lg border border-stone-200 text-center space-y-3 shadow-card">
              <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 font-display">Aucune réservation trouvée</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filterStatus === 'ALL'
                  ? "Vous n'avez pas encore transmis de demande d'intervention."
                  : 'Aucune commande ne correspond à ce filtre pour le moment.'}
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded shadow-subtle"
              >
                <span>Explorer les artisans à proximité</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filtered.map((b) => (
                <article
                  key={b.id}
                  className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-card space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        RÉF. #{b.id.slice(0, 8).toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-slate-950 font-display">{b.serviceTitle}</h3>
                      <p className="text-xs text-slate-600">
                        Artisan : <strong className="text-slate-900">{b.providerName}</strong>
                      </p>
                    </div>

                    <div>{getStatusBadge(b.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Prévu le :{' '}
                        <strong>
                          {new Date(b.scheduledAt).toLocaleDateString('fr-FR')} à{' '}
                          {new Date(b.scheduledAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Lieu : {b.clientAddress || 'À convenir'}</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-slate-500 block text-[10px] uppercase">Tarif indicatif :</span>
                      <span className="text-sm font-bold text-slate-950 tabular-nums">
                        {b.servicePrice.toLocaleString()} DZD
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="p-2.5 bg-stone-50 rounded border border-stone-200 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900 font-mono text-[11px]">Instructions transmises : </span>
                      {b.notes}
                    </div>
                  )}

                  {/* Actions Strip */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-stone-100">
                    <div className="text-[11px] font-mono text-slate-400">
                      Demande transmise le {new Date(b.createdAt).toLocaleDateString('fr-FR')}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/providers/${b.providerId}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded border border-stone-200 transition"
                      >
                        Consulter la fiche artisan
                      </Link>

                      {(b.status === 'ACCEPTED' || b.status === 'COMPLETED') && (
                        <button
                          onClick={() => setReviewingBooking(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-subtle transition"
                        >
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>Noter la prestation</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
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
    </RoleGuard>
  );
}
