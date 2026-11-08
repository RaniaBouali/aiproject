'use client';

import React, { useState, useEffect } from 'react';
import { ProviderProfile } from '@/types';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, AlertCircle, Hammer } from 'lucide-react';
import { getStoredSession } from '@/lib/auth-client';

interface BookingModalProps {
  provider: ProviderProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingId: string) => void;
}

export default function BookingModal({
  provider,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) {
  // All hooks at the top (Rules of Hooks)
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>('09:30');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const session = getStoredSession();
      if (session?.user) {
        setClientName(session.user.name || '');
        setClientPhone(session.user.phone || '');
        setClientAddress(session.user.addressText || '');
      }
      setSubmittedBookingId(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (provider?.services?.length) {
      setSelectedServiceId(provider.services[0].id);
    }
  }, [provider]);

  if (!isOpen || !provider) return null;

  const selectedService =
    provider.services.find((s) => s.id === selectedServiceId) || provider.services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMessage('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      const session = getStoredSession();
      const clientId = session?.user?.id || 'cli-guest';

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          clientName,
          clientPhone,
          clientAddress,
          providerId: provider.id,
          providerName: provider.name,
          serviceId: selectedService?.id,
          serviceTitle: selectedService?.title,
          servicePrice: selectedService?.price,
          servicePriceType: selectedService?.priceType,
          scheduledAt: scheduledDateTime,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'enregistrement de l'intervention");
      }

      setSubmittedBookingId(data.data.id);
      if (onSuccess) onSuccess(data.data.id);
    } catch (err: any) {
      setErrorMessage(err.message || "Impossible d'enregistrer la demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-elevated border border-stone-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center text-slate-950 font-bold">
              <Hammer className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display">Demande d&apos;intervention</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Artisan : <span className="text-amber-400 font-semibold">{provider.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success screen */}
        {submittedBookingId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-950 font-display">Demande transmise à l&apos;artisan</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Votre ordre d&apos;intervention a été enregistré. <strong>{provider.name}</strong> va examiner votre demande et vous contacter par téléphone.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-md text-left text-xs space-y-1.5 border border-stone-200 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Réf. dossier :</span>
                <span className="font-bold text-slate-950">{submittedBookingId.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prestation :</span>
                <span className="font-semibold text-slate-800">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarif indicatif :</span>
                <span className="font-bold text-amber-700">{selectedService?.price.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date prévue :</span>
                <span className="text-slate-800">{scheduledDate} à {scheduledTime}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href="/client/dashboard"
                className="flex-1 py-2 px-3 bg-slate-900 text-white font-semibold rounded-md text-xs hover:bg-slate-800 transition text-center shadow-subtle"
              >
                Ouvrir mes réservations
              </a>
              <button
                onClick={onClose}
                className="py-2 px-3 bg-stone-100 text-slate-800 font-semibold rounded-md text-xs hover:bg-stone-200 border border-stone-300 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left">
            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-1.5">
                1. Sélectionner la prestation
              </label>
              <div className="space-y-1.5">
                {provider.services.map((srv) => (
                  <label
                    key={srv.id}
                    className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer transition ${
                      selectedServiceId === srv.id
                        ? 'border-slate-900 bg-stone-100 ring-1 ring-slate-900/10'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="serviceSelect"
                        value={srv.id}
                        checked={selectedServiceId === srv.id}
                        onChange={() => setSelectedServiceId(srv.id)}
                        className="text-slate-900 accent-slate-900"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-950">{srv.title}</div>
                        <div className="text-[11px] text-slate-500 leading-tight">{srv.description}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2 font-mono">
                      <span className="text-xs font-bold text-slate-950 tabular-nums">
                        {srv.price.toLocaleString()} DZD
                      </span>
                      <span className="block text-[10px] text-slate-500 uppercase">
                        {srv.priceType === 'HOURLY' ? '/ heure' : srv.priceType === 'ESTIMATE' ? 'sur devis' : 'forfait'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Date souhaitée *
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Heure souhaitée *
                </label>
                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Client Info */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1 font-mono">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Nom complet du demandeur *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Sarah Belhadj"
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+213 550..."
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Adresse / Commune
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Quartier, Alger..."
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1 font-mono">
                  Détails / Précisions techniques (facultatif)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Description de la panne, modèle de l'équipement, numéro d'appartement..."
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none resize-none"
                />
              </div>
            </div>

            {/* Modal Action Bar */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Tarif estimé</span>
                <span className="text-sm font-bold text-slate-950 font-mono tabular-nums">
                  {selectedService?.price.toLocaleString()} DZD
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-stone-100 rounded border border-stone-300 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-subtle transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Validation...' : 'Valider la demande'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
