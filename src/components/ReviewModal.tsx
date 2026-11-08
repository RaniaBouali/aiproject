'use client';

import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { getStoredSession } from '@/lib/auth-client';

interface ReviewModalProps {
  providerId: string;
  providerName: string;
  bookingId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({
  providerId,
  providerName,
  bookingId,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  // All hooks at the top (Rules of Hooks)
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const session = getStoredSession();
      if (session?.user?.name) {
        setClientName(session.user.name);
      }
      setRating(5);
      setComment('');
      setError(null);
      setIsDone(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Veuillez formuler un avis sur la prestation.');
      return;
    }
    if (!clientName.trim()) {
      setError('Votre nom est obligatoire.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const session = getStoredSession();
      const clientId = session?.user?.id || 'cli-guest';

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          bookingId,
          clientId,
          clientName,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la publication de l'avis");
      }

      setIsDone(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Impossible d'enregistrer l'avis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-elevated border border-stone-300 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">Évaluation de prestation</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-950 font-display">Avis enregistré avec succès</h4>
            <p className="text-xs text-slate-600">
              Votre retour d&apos;expérience permet de certifier la fiabilité de <strong>{providerName}</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800 transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating */}
            <div className="text-center py-1 bg-stone-50 rounded-md border border-stone-200">
              <p className="text-xs text-slate-600 mb-1">
                Note attribuée à <strong>{providerName}</strong> :
              </p>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-amber-800">
                {rating === 5 ? '5/5 — Prestation exemplaire' : rating === 4 ? '4/5 — Très satisfaisant' : rating === 3 ? '3/5 — Conforme aux attentes' : `${rating}/5`}
              </span>
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-[11px] font-mono text-slate-700 mb-1">Votre Nom complet *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-[11px] font-mono text-slate-700 mb-1">
                Commentaire détaillé *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Qualité de la réparation ou prestation, ponctualité, propreté du chantier, respect du prix convenu..."
                className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-stone-50 focus:bg-white focus:border-slate-900 outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-subtle transition disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi...' : 'Valider l’évaluation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
