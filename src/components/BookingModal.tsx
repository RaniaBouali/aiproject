'use client';

import React, { useState } from 'react';
import { ProviderProfile, ServiceItem } from '@/types';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

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
  if (!isOpen || !provider) return null;

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    provider.services[0]?.id || ''
  );
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>('09:30');
  const [clientName, setClientName] = useState<string>('Sarah Belhadj');
  const [clientPhone, setClientPhone] = useState<string>('+213 550 99 88 11');
  const [clientAddress, setClientAddress] = useState<string>('Didouche Mourad, Alger');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedService = provider.services.find((s) => s.id === selectedServiceId) || provider.services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      setSubmittedBookingId(data.data.id);
      if (onSuccess) onSuccess(data.data.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible d’enregistrer la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Demande de prestation</h3>
            <p className="text-xs text-blue-100">
              Réservation directe avec <span className="font-semibold text-white">{provider.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedBookingId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Demande envoyée avec succès !</h4>
            <p className="text-sm text-slate-600">
              Votre demande a été transmise à <strong>{provider.name}</strong>. L’artisan examinera votre créneau et vous confirmera le rendez-vous.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl text-left text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Service :</span>
                <span className="font-semibold text-slate-800">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Montant indicatif :</span>
                <span className="font-bold text-blue-600">{selectedService?.price.toLocaleString()} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Créneau demandé :</span>
                <span className="font-medium text-slate-800">{scheduledDate} à {scheduledTime}</span>
              </div>
            </div>
            <div className="pt-2 flex gap-3">
              <a
                href="/client/dashboard"
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 transition"
              >
                Voir dans mes réservations
              </a>
              <button
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Choisir la prestation souhaitée
              </label>
              <div className="space-y-2">
                {provider.services.map((srv) => (
                  <label
                    key={srv.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedServiceId === srv.id
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="serviceSelect"
                        value={srv.id}
                        checked={selectedServiceId === srv.id}
                        onChange={() => setSelectedServiceId(srv.id)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{srv.title}</div>
                        <div className="text-[11px] text-slate-500">{srv.description}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-blue-700">
                        {srv.price.toLocaleString()} DA
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {srv.priceType === 'HOURLY' ? '/ heure' : srv.priceType === 'ESTIMATE' ? 'sur devis' : 'forfait'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Date souhaitée
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Heure estimée
                </label>
                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Client Coordinates / Address */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Votre Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Sarah Belhadj"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+213 550..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Adresse d'intervention
                  </label>
                  <input
                    type="text"
                    required
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Quartier, Ville"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instructions / Détails supplémentaires (facultatif)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Précisez le problème, le modèle du véhicule, l'étage..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total estimé</span>
                <span className="text-lg font-bold text-slate-900">
                  {selectedService?.price.toLocaleString()} DA
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Confirmer la réservation'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
