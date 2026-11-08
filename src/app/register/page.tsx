'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Hammer
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/data-store';
import { saveSession } from '@/lib/auth-client';
import { PriceType } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CLIENT' | 'PROVIDER'>('PROVIDER');

  // Common fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [addressText, setAddressText] = useState<string>('Alger Centre');

  // Provider specific fields
  const [categorySlug, setCategorySlug] = useState<string>('mecanicien');
  const [bio, setBio] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [operationalRadiusKm, setOperationalRadiusKm] = useState<number>(20);

  // Dynamic services list
  const [services, setServices] = useState<
    { title: string; description: string; price: number; priceType: PriceType; durationMinutes: number }[]
  >([
    {
      title: 'Prestation Principale',
      description: 'Intervention soignée avec outillage professionnel et garantie de travail.',
      price: 3500,
      priceType: 'FIXED',
      durationMinutes: 60,
    },
  ]);

  // Dynamic portfolio items
  const [portfolio, setPortfolio] = useState<
    { title: string; imageUrl: string; description: string }[]
  >([
    {
      title: 'Exemple de réalisation récente',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
      description: 'Chantier réalisé avec succès pour un client résidentiel.',
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Service helpers
  const handleAddService = () => {
    setServices([
      ...services,
      {
        title: '',
        description: '',
        price: 2500,
        priceType: 'FIXED',
        durationMinutes: 60,
      },
    ]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleUpdateService = (index: number, field: string, val: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: val };
    setServices(updated);
  };

  // Portfolio helpers
  const handleAddPortfolio = () => {
    setPortfolio([
      ...portfolio,
      {
        title: '',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
        description: '',
      },
    ]);
  };

  const handleRemovePortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handleUpdatePortfolio = (index: number, field: string, val: string) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: val };
    setPortfolio(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        name,
        email,
        phone,
        password,
        role,
        addressText,
      };

      if (role === 'PROVIDER') {
        payload.categorySlug = categorySlug;
        payload.bio = bio || `Artisan professionnel qualifié spécialisé en ${categorySlug}.`;
        payload.experienceYears = Number(experienceYears);
        payload.operationalRadiusKm = Number(operationalRadiusKm);
        payload.services = services.filter((s) => s.title.trim().length > 0);
        payload.portfolio = portfolio.filter((p) => p.title.trim().length > 0);
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l’inscription');
      }

      saveSession({
        user: data.data.user,
        token: data.data.token,
        providerProfile: data.data.providerProfile,
      });

      if (role === 'PROVIDER') {
        router.push('/provider/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-slate-950 text-amber-500 border border-slate-800 shadow-subtle mx-auto">
            <Hammer className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
            Inscription au Réseau ProxiService
          </h1>
          <p className="text-xs text-slate-500">
            Rejoignez notre réseau de proximité en tant que particulier ou artisan qualifié
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200 rounded-md max-w-md mx-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setRole('PROVIDER')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded font-bold transition ${
              role === 'PROVIDER'
                ? 'bg-slate-950 text-white shadow-subtle'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Je suis Artisan Pro</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('CLIENT')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded font-bold transition ${
              role === 'CLIENT'
                ? 'bg-slate-950 text-white shadow-subtle'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Je cherche un service</span>
          </button>
        </div>

        {/* Main Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-300 shadow-card space-y-5">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Identification */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-stone-200 pb-1.5 font-mono">
                1. Identification & Coordonnées
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Karim Benali"
                    className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">
                    Téléphone direct *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+213 550..."
                    className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">
                    Adresse électronique *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1">
                  Adresse / Commune de base *
                </label>
                <input
                  type="text"
                  required
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="Quartier, Ville (Ex: Bab El Oued, Alger)"
                  className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Provider Section */}
            {role === 'PROVIDER' && (
              <>
                {/* Section 2: Spécialité & Périmètre */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-stone-200 pb-1.5 font-mono">
                    2. Corps d&apos;état & Zone d&apos;intervention
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Corps de métier *
                      </label>
                      <select
                        value={categorySlug}
                        onChange={(e) => setCategorySlug(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none cursor-pointer"
                      >
                        {INITIAL_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Années d&apos;expérience *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="text-slate-600">Rayon d&apos;intervention kilométrique :</span>
                      <span className="font-bold text-slate-950 tabular-nums">{operationalRadiusKm} km</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={operationalRadiusKm}
                      onChange={(e) => setOperationalRadiusKm(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1">
                      Présentation de vos compétences & garanties
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Décrivez vos compétences, votre outillage, vos garanties de travail..."
                      className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-slate-900 outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 3: Catalogue Initial des Tarifs */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                      3. Prestations & Tarifs Déclarés (DZD)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-slate-800 text-[11px] font-semibold rounded border border-stone-300 transition font-mono"
                    >
                      <Plus className="w-3 h-3 text-amber-700" />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-stone-50 rounded-md border border-stone-200 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-slate-700">Prestation #{idx + 1}</span>
                          {services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveService(idx)}
                              className="text-rose-600 hover:text-rose-800 p-0.5 text-xs font-mono"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              required
                              placeholder="Intitulé de la prestation"
                              value={srv.title}
                              onChange={(e) => handleUpdateService(idx, 'title', e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none font-medium"
                            />
                          </div>
                          <div>
                            <select
                              value={srv.priceType}
                              onChange={(e) => handleUpdateService(idx, 'priceType', e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none font-mono"
                            >
                              <option value="FIXED">Forfaitaire</option>
                              <option value="HOURLY">Par Heure</option>
                              <option value="ESTIMATE">Sur Devis</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 mb-0.5">Prix en DZD</label>
                            <input
                              type="number"
                              required
                              value={srv.price}
                              onChange={(e) => handleUpdateService(idx, 'price', Number(e.target.value))}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none font-bold font-mono text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 mb-0.5">Durée (min)</label>
                            <input
                              type="number"
                              value={srv.durationMinutes}
                              onChange={(e) => handleUpdateService(idx, 'durationMinutes', Number(e.target.value))}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Description des tâches et pièces incluses..."
                            value={srv.description}
                            onChange={(e) => handleUpdateService(idx, 'description', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Réalisations */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                      4. Portfolio & Photos de Chantiers
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddPortfolio}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-slate-800 text-[11px] font-semibold rounded border border-stone-300 transition font-mono"
                    >
                      <Plus className="w-3 h-3 text-amber-700" />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {portfolio.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-stone-50 rounded-md border border-stone-200 flex flex-col sm:flex-row gap-3 items-start"
                      >
                        <div className="w-16 h-16 rounded bg-stone-200 overflow-hidden shrink-0 border border-stone-300">
                          <img
                            src={item.imageUrl}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 w-full space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-slate-700">Photo #{idx + 1}</span>
                            {portfolio.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePortfolio(idx)}
                                className="text-rose-600 hover:text-rose-800 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            placeholder="Titre de la réalisation (ex: Réfection armoire électrique)"
                            value={item.title}
                            onChange={(e) => handleUpdatePortfolio(idx, 'title', e.target.value)}
                            className="w-full text-xs px-2.5 py-1 bg-white border border-stone-300 rounded outline-none"
                          />

                          <input
                            type="url"
                            placeholder="URL de l'image"
                            value={item.imageUrl}
                            onChange={(e) => handleUpdatePortfolio(idx, 'imageUrl', e.target.value)}
                            className="w-full text-xs px-2.5 py-1 bg-white border border-stone-300 rounded outline-none font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-stone-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded text-xs shadow-subtle transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {loading
                    ? 'Création du compte...'
                    : role === 'PROVIDER'
                    ? 'Valider mon inscription Artisan & Ouvrir le Cockpit'
                    : 'Créer mon compte Particulier'}
                </span>
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Vous possédez déjà un compte ?{' '}
              <Link href="/login" className="font-semibold text-slate-950 hover:text-amber-800 underline">
                Connexion directe
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
