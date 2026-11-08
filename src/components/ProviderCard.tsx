'use client';

import React from 'react';
import Link from 'next/link';
import { ProviderProfile } from '@/types';
import { formatDistance } from '@/lib/geo';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Wrench,
  Check
} from 'lucide-react';

interface ProviderCardProps {
  provider: ProviderProfile;
  onBookClick?: (provider: ProviderProfile) => void;
  isHighlighted?: boolean;
}

export default function ProviderCard({
  provider,
  onBookClick,
  isHighlighted = false,
}: ProviderCardProps) {
  const minPrice = provider.services.length > 0
    ? Math.min(...provider.services.map((s) => s.price))
    : 0;

  return (
    <article
      className={`group relative bg-white rounded-lg border transition-all duration-200 p-5 ${
        isHighlighted
          ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-elevated'
          : 'border-stone-200/90 hover:border-stone-400 shadow-card hover:shadow-elevated'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Artisan Avatar & Verification Badge */}
        <div className="relative shrink-0">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover border border-stone-200 bg-stone-100"
          />
          {provider.isVerified && (
            <div
              title="Artisan vérifié par ProxiService"
              className="absolute -bottom-1 -right-1 bg-emerald-700 text-white p-0.5 rounded border border-white shadow-sm flex items-center justify-center"
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Core Profile Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <Link
                href={`/providers/${provider.id}`}
                className="text-base font-bold text-slate-950 hover:text-amber-800 transition-colors truncate font-display"
              >
                {provider.name}
              </Link>
              {provider.isVerified && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Vérifié
                </span>
              )}
            </div>

            {/* Distance calculation */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium bg-stone-100 text-slate-800 border border-stone-200">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{formatDistance(provider.distanceKm)}</span>
            </div>
          </div>

          {/* Trade Category Tags & Experience */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {provider.categories.map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-slate-800 border border-stone-200"
              >
                {cat.name}
              </span>
            ))}
            <span className="text-xs text-slate-500">
              &bull; {provider.experienceYears} ans de métier
            </span>
          </div>

          {/* Rating, Reviews & Address */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mb-2.5">
            <div className="flex items-center gap-1 text-amber-600 font-bold tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-slate-900">{provider.ratingAverage.toFixed(1)}</span>
            </div>
            <span className="text-slate-500">({provider.reviewCount} avis clients)</span>
            <span className="text-stone-300 hidden sm:inline">&bull;</span>
            <span className="text-slate-600 truncate">{provider.addressText}</span>
          </div>

          {/* Bio statement */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-sans">
            {provider.bio}
          </p>

          {/* Tariff Block & Immediate Actions */}
          <div className="pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block font-mono">
                Grille d&apos;intervention
              </span>
              <span className="text-sm font-bold text-slate-950 font-mono tabular-nums">
                Dès {minPrice.toLocaleString()} DZD
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/providers/${provider.id}`}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-300/80 transition-colors"
              >
                Vitrine & Avis
              </Link>

              <button
                type="button"
                onClick={() => onBookClick && onBookClick(provider)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 shadow-subtle transition-all"
              >
                <span>Demander intervention</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
