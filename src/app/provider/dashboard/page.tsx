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
  AlertCircle,
  Edit,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { Booking, ProviderProfile, ServiceItem, PriceType } from '@/types';
import { getStoredSession } from '@/lib/auth-client';
import RoleGuard from '@/components/RoleGuard';

export default function ProviderDashboardPage() {
  const [currentProviderId, setCurrentProviderId] = useState<string>('prov-karim-meca');
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'services' | 'zone'>('requests');

  // Edit Services & Prices state
  const [editServices, setEditServices] = useState<ServiceItem[]>([]);
  const [editRadius, setEditRadius] = useState<number>(25);
  const [editBio, setEditBio] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Auto-detect logged in provider from session
  useEffect(() => {
    const session = getStoredSession();
    if (session && session.user.role === 'PROVIDER' && session.providerProfile) {
      setCurrentProviderId(session.providerProfile.id);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const provRes = await fetch(`/api/providers/${currentProviderId}`);
      const provData = await provRes.json();
      if (provData.success) {
        setProvider(provData.data);
        setEditServices(provData.data.services || []);
        setEditRadius(provData.data.operationalRadiusKm || 20);
        setEditBio(provData.data.bio || '');
      }

      const bookRes = await fetch('/api/bookings');
      const bookData = await bookRes.json();
      if (bookData.success) {
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

  const handleSaveProfileChanges = async () => {
    if (!provider) return;
    setIsSavingProfile(true);
    try {
      const res = await fetch(`/api/providers/${provider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: editServices,
          operationalRadiusKm: editRadius,
          bio: editBio,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage('Vos tarifs et informations ont été mis à jour avec succès !');
        setTimeout(() => setActionMessage(null), 4000);
        loadData();
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddService = () => {
    setEditServices([
      ...editServices,
      {
        id: `srv-${Date.now()}`,
        title: 'Nouvelle Prestation',
        description: 'Description du service...',
        price: 3000,
        priceType: 'FIXED',
        durationMinutes: 60,
      },
    ]);
  };

  const handleRemoveService = (id: string) => {
    setEditServices(editServices.filter((s) => s.id !== id));
  };

  const handleUpdateServiceField = (id: string, field: string, val: any) => {
    setEditServices(
      editServices.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const acceptedBookings = bookings.filter((b) => b.status === 'ACCEPTED');

  const totalRevenue = bookings
    .filter((b) => b.status === 'ACCEPTED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.servicePrice || 0), 0);

  return (
    <RoleGuard allowedRoles={['PROVIDER']}>
      <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={provider?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900">
                  {provider?.name || 'Tableau de bord Pro'}
                </h1>
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {provider?.categories[0]?.name || 'Artisan'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {provider?.addressText} • Couverture {provider?.operationalRadiusKm} km
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {provider && (
              <Link
                href={`/providers/${provider.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Voir ma vitrine client</span>
              </Link>
            )}

            <div className="flex items-center gap-1 text-xs text-slate-500 pl-2 border-l border-slate-200">
              <span>Compte test :</span>
              <select
                value={currentProviderId}
                onChange={(e) => setCurrentProviderId(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-800 cursor-pointer outline-none"
              >
                <option value="prov-karim-meca">Karim Benali (Mécanicien)</option>
                <option value="prov-fatima-menage">Fatima-Zahra (Femme de ménage)</option>
                <option value="prov-ahmed-elec">Ahmed Mansour (Électricien)</option>
                <option value="prov-youssef-plombier">Youssef Daoud (Plombier)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action toast */}
        {actionMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
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

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
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

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Note moyenne clients
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 flex items-center gap-1">
                {provider?.ratingAverage.toFixed(1) || '5.0'}
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs text-slate-400">
                {provider?.reviewCount || 0} avis certifiés
              </span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              CA missions validées
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-600">
                {totalRevenue.toLocaleString()} DA
              </span>
              <span className="text-xs text-slate-400">Total estimé</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Demandes & Missions ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Gestion de mes Tarifs & Prestations ({editServices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('zone')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'zone'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Zone de couverture & Présentation</span>
          </button>
        </div>

        {/* TAB 1: Demandes & Missions */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Pending Requests Queue */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Demandes en attente d'acceptation ({pendingBookings.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ces clients attendent votre confirmation pour convenir de la prestation.
                  </p>
                </div>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Aucune demande en attente</p>
                  <p className="text-[11px] text-slate-400">Toutes vos demandes ont été traitées.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
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

                        <div className="text-xs text-slate-800 font-semibold">
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
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accepter le RDV</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition"
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

            {/* Confirmed missions */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Missions confirmées ({acceptedBookings.length})
              </h3>

              {acceptedBookings.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">Aucune mission en cours.</p>
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
        )}

        {/* TAB 2: Tarifs & Services Editor */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Définir vos prestations et vos prix
                </h3>
                <p className="text-xs text-slate-500">
                  Ces prestations s'affichent directement sur votre vitrine publique pour permettre la réservation en ligne.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddService}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une prestation</span>
              </button>
            </div>

            <div className="space-y-4">
              {editServices.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Prestation #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(srv.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Intitulé de la prestation
                      </label>
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => handleUpdateServiceField(srv.id, 'title', e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Type de tarification
                      </label>
                      <select
                        value={srv.priceType}
                        onChange={(e) => handleUpdateServiceField(srv.id, 'priceType', e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="FIXED">Tarif Forfaitaire</option>
                        <option value="HOURLY">Par Heure</option>
                        <option value="ESTIMATE">Sur Devis</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tarif en Dinars Algériens (DA)
                      </label>
                      <input
                        type="number"
                        value={srv.price}
                        onChange={(e) => handleUpdateServiceField(srv.id, 'price', Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none font-bold text-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Durée estimée (minutes)
                      </label>
                      <input
                        type="number"
                        value={srv.durationMinutes || 60}
                        onChange={(e) => handleUpdateServiceField(srv.id, 'durationMinutes', Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Détails de ce qui est inclus
                    </label>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => handleUpdateServiceField(srv.id, 'description', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfileChanges}
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Enregistrement...' : 'Enregistrer mes tarifs'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Zone & Bio */}
        {activeTab === 'zone' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Zone d'intervention & Présentation
              </h3>
              <p className="text-xs text-slate-500">
                Ajustez le rayon kilométrique dans lequel vous acceptez de vous déplacer.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Rayon d'action maximal :</span>
                  <span className="font-bold text-blue-600">{editRadius} km autour de votre atelier / base</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={editRadius}
                  onChange={(e) => setEditRadius(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Présentation / Bio
                </label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfileChanges}
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Enregistrement...' : 'Mettre à jour la zone'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </RoleGuard>
  );
}
