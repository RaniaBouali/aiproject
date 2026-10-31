'use client';

import React from 'react';
import Link from 'next/link';
import { ProviderProfile } from '@/types';
import { formatDistance } from '@/lib/geo';
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Briefcase
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
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 p-5 shadow-sm hover:shadow-xl ${
        isHighlighted
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
          : 'border-slate-200/80 hover:border-blue-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          {provider.isVerified && (
            <div
              title="Profil vérifié"
              className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <Link
              href={`/providers/${provider.id}`}
              className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate"
            >
              {provider.name}
            </Link>

            {/* Distance badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{formatDistance(provider.distanceKm)}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {provider.categories.map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {cat.name}
              </span>
            ))}
            <span className="text-xs text-slate-400">• {provider.experienceYears} ans d'expérience</span>
          </div>

          {/* Ratings & reviews */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-slate-800 text-sm">{provider.ratingAverage.toFixed(1)}</span>
            </div>
            <span>({provider.reviewCount} avis certifiés)</span>
            <span>•</span>
            <span className="text-slate-600 truncate">{provider.addressText}</span>
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {provider.bio}
          </p>

          {/* Pricing & Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                Tarif indicatif
              </span>
              <span className="text-base font-bold text-slate-900">
                À partir de {minPrice.toLocaleString()} DA
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/providers/${provider.id}`}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Profil & avis
              </Link>

              <button
                type="button"
                onClick={() => onBookClick && onBookClick(provider)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-500/20 transition-all"
              >
                <span>Réserver</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
