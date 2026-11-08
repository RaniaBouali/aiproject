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
  Save,
  Hammer,
  SlidersHorizontal,
  ChevronRight
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
        setActionMessage(`Intervention mise à jour : ${newStatus}`);
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
        setActionMessage('Grille tarifaire et périmètre enregistrés avec succès.');
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
        description: 'Descriptif de la prestation...',
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
      <div className="bg-[#F9F9F7] min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Artisan Workbench Header */}
          <div className="bg-white rounded-lg p-5 border border-stone-200/90 shadow-card">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={provider?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                    alt="Avatar"
                    className="w-14 h-14 rounded-md object-cover border border-stone-300 bg-stone-100"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-600 w-3.5 h-3.5 rounded border-2 border-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-slate-950 font-display">
                      {provider?.name || 'Cockpit Artisan'}
                    </h1>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {provider?.categories[0]?.name || 'Artisan'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      En service
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">
                    {provider?.addressText} &bull; Périmètre actif : {provider?.operationalRadiusKm} km
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {provider && (
                  <Link
                    href={`/providers/${provider.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded border border-stone-300 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Vitrine publique</span>
                  </Link>
                )}

                <div className="flex items-center gap-1 text-xs text-slate-600 pl-2 border-l border-stone-200">
                  <span className="font-mono text-[11px]">Compte :</span>
                  <select
                    value={currentProviderId}
                    onChange={(e) => setCurrentProviderId(e.target.value)}
                    className="px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded font-semibold text-slate-800 cursor-pointer outline-none font-mono"
                  >
                    <option value="prov-karim-meca">Karim (Mécanicien)</option>
                    <option value="prov-fatima-menage">Fatima-Zahra (Ménage)</option>
                    <option value="prov-ahmed-elec">Ahmed (Électricien)</option>
                    <option value="prov-youssef-plombier">Youssef (Plombier)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action notification */}
          {actionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {/* Workbench KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Demandes entrantes
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
                  {pendingBookings.length}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                  À arbitrer
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Missions confirmées
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {acceptedBookings.length}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-slate-800 border border-stone-200 font-semibold">
                  À réaliser
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Satisfaction vérifiée
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-950 font-mono tabular-nums flex items-center gap-1">
                  {provider?.ratingAverage.toFixed(1) || '5.0'}
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {provider?.reviewCount || 0} avis
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-stone-200/90 shadow-card space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Volume facturé estimé
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-950 font-mono tabular-nums">
                  {totalRevenue.toLocaleString()} DZD
                </span>
                <span className="text-[11px] font-mono text-slate-500">Total</span>
              </div>
            </div>
          </div>

          {/* Workbench Tabs */}
          <div className="flex items-center gap-1 border-b border-stone-200 font-mono text-xs">
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-2.5 px-3.5 font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'border-slate-950 text-slate-950'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Demandes & Interventions ({bookings.length})</span>
            </button>

            <button
              id="services"
              onClick={() => setActiveTab('services')}
              className={`pb-2.5 px-3.5 font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'services'
                  ? 'border-slate-950 text-slate-950'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-700" />
              <span>Grille Tarifaire ({editServices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('zone')}
              className={`pb-2.5 px-3.5 font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'zone'
                  ? 'border-slate-950 text-slate-950'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>Périmètre & Présentation</span>
            </button>
          </div>

          {/* TAB 1: Demandes & Interventions */}
          {activeTab === 'requests' && (
            <div className="space-y-5">
              {/* Incoming Requests Triage */}
              <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-card space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 font-display">
                      File de triage &mdash; Demandes en attente ({pendingBookings.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Prenez contact avec le demandeur ou confirmez directement le créneau.
                    </p>
                  </div>
                </div>

                {pendingBookings.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-md border border-dashed border-stone-300 space-y-1.5">
                    <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">Aucune demande en attente</p>
                    <p className="text-[11px] text-slate-500 font-mono">Toutes les demandes ont été traitées.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 bg-amber-50/40 rounded-md border border-amber-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-950 font-display">{b.clientName}</span>
                            <a
                              href={`tel:${b.clientPhone}`}
                              className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-900 hover:text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200"
                            >
                              <Phone className="w-3 h-3 text-amber-700" />
                              <span>{b.clientPhone}</span>
                            </a>
                          </div>

                          <div className="text-xs text-slate-900 font-medium">
                            Prestation : <strong>{b.serviceTitle}</strong> &mdash; <span className="font-mono font-bold">{b.servicePrice.toLocaleString()} DZD</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-mono">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{new Date(b.scheduledAt).toLocaleDateString('fr-FR')} à {new Date(b.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <span className="text-stone-300">&bull;</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{b.clientAddress}</span>
                            </div>
                          </div>

                          {b.notes && (
                            <p className="text-xs text-slate-700 italic bg-white p-2 rounded border border-amber-200/60 font-sans">
                              &laquo; {b.notes} &raquo;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-amber-200">
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-subtle transition"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Accepter l&apos;intervention</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-stone-300 hover:border-rose-300 text-xs font-semibold rounded transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Décliner</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmed missions */}
              <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-card space-y-3.5">
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  Missions confirmées en cours ({acceptedBookings.length})
                </h3>

                {acceptedBookings.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2 font-mono">Aucun chantier en cours actuellement.</p>
                ) : (
                  <div className="space-y-2.5">
                    {acceptedBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 bg-stone-50 rounded-md border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-950">{b.serviceTitle}</span>
                            <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                              {b.servicePrice.toLocaleString()} DZD
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            Client : <strong>{b.clientName}</strong> ({b.clientPhone}) &bull; {b.clientAddress}
                          </div>
                          <div className="text-[11px] font-mono text-slate-700">
                            Rendez-vous planifié le : {new Date(b.scheduledAt).toLocaleDateString('fr-FR')} à {new Date(b.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <button
                          onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                          className="shrink-0 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-subtle transition"
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

          {/* TAB 2: Grille Tarifaire & Prestations */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-card space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 font-display">
                    Édition de la Grille Tarifaire
                  </h3>
                  <p className="text-xs text-slate-500">
                    Déclarez vos tarifs officiels pour garantir la confiance des particuliers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddService}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-slate-900 font-semibold text-xs rounded border border-stone-300 hover:bg-stone-200 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ajouter une prestation</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {editServices.map((srv, idx) => (
                  <div
                    key={srv.id}
                    className="p-4 bg-stone-50 rounded-md border border-stone-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-700">Ligne #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(srv.id)}
                        className="text-rose-700 hover:text-rose-900 p-1 text-xs flex items-center gap-1 font-mono"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Supprimer</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-slate-600 mb-1">
                          Intitulé de la prestation
                        </label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => handleUpdateServiceField(srv.id, 'title', e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none focus:border-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 mb-1">
                          Mode de calcul
                        </label>
                        <select
                          value={srv.priceType}
                          onChange={(e) => handleUpdateServiceField(srv.id, 'priceType', e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none focus:border-slate-900 cursor-pointer"
                        >
                          <option value="FIXED">Forfaitaire</option>
                          <option value="HOURLY">Par heure</option>
                          <option value="ESTIMATE">Sur devis</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 mb-1">
                          Tarif en DZD
                        </label>
                        <input
                          type="number"
                          value={srv.price}
                          onChange={(e) => handleUpdateServiceField(srv.id, 'price', Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none font-bold font-mono text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 mb-1">
                          Durée indicative (minutes)
                        </label>
                        <input
                          type="number"
                          value={srv.durationMinutes || 60}
                          onChange={(e) => handleUpdateServiceField(srv.id, 'durationMinutes', Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Détails & fournitures incluses
                      </label>
                      <textarea
                        rows={2}
                        value={srv.description}
                        onChange={(e) => handleUpdateServiceField(srv.id, 'description', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfileChanges}
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded shadow-subtle transition disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSavingProfile ? 'Enregistrement...' : 'Enregistrer la grille'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Périmètre & Présentation */}
          {activeTab === 'zone' && (
            <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-card space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-950 font-display">
                  Périmètre d&apos;intervention & Présentation
                </h3>
                <p className="text-xs text-slate-500">
                  Définissez votre rayon maximal de déplacement pour les calculs géodésiques.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-slate-600">Rayon d&apos;action kilométrique :</span>
                    <span className="font-bold text-slate-950 tabular-nums">{editRadius} km autour de votre base</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={editRadius}
                    onChange={(e) => setEditRadius(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1">
                    Présentation de l&apos;artisan / Description de l&apos;activité
                  </label>
                  <textarea
                    rows={4}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveProfileChanges}
                    disabled={isSavingProfile}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded shadow-subtle transition disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSavingProfile ? 'Enregistrement...' : 'Mettre à jour le profil'}</span>
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
