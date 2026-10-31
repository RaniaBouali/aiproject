'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle } from 'lucide-react';

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
  if (!isOpen) return null;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [clientName, setClientName] = useState<string>('Sarah B.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          bookingId,
          clientName,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la publication de l’avis');
      }

      setIsDone(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Impossible d’enregistrer l’avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-base font-bold">Donner votre avis</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Merci pour votre retour !</h4>
            <p className="text-xs text-slate-600">
              Votre évaluation aide la communauté à identifier les meilleurs artisans de confiance.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              Terminer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">
                Comment évaluez-vous le travail de <strong>{providerName}</strong> ?
              </p>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600">
                {rating === 5 ? 'Excellent (5/5)' : rating === 4 ? 'Très bien (4/5)' : rating === 3 ? 'Correct (3/5)' : `${rating}/5`}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Votre Nom</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Votre commentaire</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Qualité du travail, ponctualité, propreté, respect des tarifs..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Publication...' : 'Publier mon avis'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
