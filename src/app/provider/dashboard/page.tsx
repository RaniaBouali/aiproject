'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Star, 
  DollarSign, 
  ShieldCheck, 
  Eye, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { Booking, ProviderProfile } from '@/types';
import { INITIAL_PROVIDERS } from '@/lib/data-store';

export default function ProviderDashboardPage() {
  // We simulate logged in as Karim Benali (the mechanic) or allow switching to Fatima (femme de ménage)
  const [currentProviderId, setCurrentProviderId] = useState<string>('prov-karim-meca');
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch provider profile
      const provRes = await fetch(`/api/providers/${currentProviderId}`);
      const provData = await provRes.json();
      if (provData.success) {
        setProvider(provData.data);
      }

      // Fetch bookings
      const bookRes = await fetch('/api/bookings');
      const bookData = await bookRes.json();
      if (bookData.success) {
        // Filter bookings belonging to this provider or all for testing
        const myBookings = bookData.data.filter(
          (b: Booking) => b.providerId === currentProviderId
        );
        setBookings(myBookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentProviderId]);

  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`Statut mis à jour : ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
        loadData();
      }
    } catch (err) {
      console.error('Update status failed', err);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const acceptedBookings = bookings.filter((b) => b.status === 'ACCEPTED');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  const totalRevenue = bookings
    .filter((b) => b.status === 'ACCEPTED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.servicePrice || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar with Demo Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Espace Professionnel (Artisan Cockpit)
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Connecté en tant que : {provider?.name || 'Artisan'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Changer de compte test :</span>
            <select
              value={currentProviderId}
              onChange={(e) => setCurrentProviderId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer outline-none"
            >
              <option value="prov-karim-meca">Karim Benali (Mécanicien)</option>
              <option value="prov-fatima-menage">Fatima-Zahra Cherif (Femme de ménage)</option>
              <option value="prov-ahmed-elec">Ahmed Mansour (Électricien)</option>
              <option value="prov-youssef-plombier">Youssef Daoud (Plombier)</option>
            </select>
          </div>
        </div>

        {/* Action toast */}
        {actionMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Demandes à traiter
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-600">
                {pendingBookings.length}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                Action requise
              </span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Missions confirmées
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-blue-600">
                {acceptedBookings.length}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                À réaliser
              </span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Note moyenne
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 flex items-center gap-1">
                {provider?.ratingAverage.toFixed(1) || '5.0'}
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs text-slate-400">
                {provider?.reviewCount || 0} avis
              </span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Chiffre d'affaires estimé
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-600">
                {totalRevenue.toLocaleString()} DA
              </span>
              <span className="text-xs text-slate-400">
                Sur missions actives
              </span>
            </div>
          </div>
        </div>

        {/* Incoming Requests Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Demandes d'intervention en attente ({pendingBookings.length})
              </h3>
              <p className="text-xs text-slate-500">
                Confirmez vos disponibilités ou proposez un autre créneau à vos clients.
              </p>
            </div>

            {provider && (
              <Link
                href={`/providers/${provider.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Voir ma vitrine publique</span>
              </Link>
            )}
          </div>

          {pendingBookings.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Aucune nouvelle demande en attente</p>
              <p className="text-[11px] text-slate-400">Toutes vos demandes ont été traitées.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 bg-amber-50/40 rounded-2xl border border-amber-200/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{b.clientName}</span>
                      <a
                        href={`tel:${b.clientPhone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{b.clientPhone}</span>
                      </a>
                    </div>

                    <div className="text-xs text-slate-700 font-semibold">
                      Service demandé : {b.serviceTitle} ({b.servicePrice.toLocaleString()} DA)
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(b.scheduledAt).toLocaleDateString('fr-FR')} à {new Date(b.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.clientAddress}</span>
                      </div>
                    </div>

                    {b.notes && (
                      <p className="text-xs text-slate-600 italic bg-white/70 p-2 rounded-lg border border-amber-100">
                        "{b.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-amber-200">
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accepter le RDV</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition"
                    >
                      <X className="w-4 h-4" />
                      <span>Refuser</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmed / Ongoing Missions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Missions confirmées en cours ({acceptedBookings.length})
          </h3>

          {acceptedBookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">Aucune mission en cours actuellement.</p>
          ) : (
            <div className="space-y-3">
              {acceptedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{b.serviceTitle}</span>
                      <span className="text-xs font-bold text-emerald-600">
                        {b.servicePrice.toLocaleString()} DA
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Client : <strong>{b.clientName}</strong> ({b.clientPhone}) • {b.clientAddress}
                    </div>
                    <div className="text-[11px] text-blue-600">
                      Rendez-vous fixé au : {new Date(b.scheduledAt).toLocaleDateString('fr-FR')} à {new Date(b.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                    className="shrink-0 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                  >
                    Marquer comme terminé
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
