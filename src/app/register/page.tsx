'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Image as ImageIcon,
  DollarSign,
  Clock
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
        payload.bio = bio || `Artisan professionnel spécialisé en ${categorySlug}.`;
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Créer un compte ProxiService
          </h1>
          <p className="text-sm text-slate-500">
            Rejoignez notre communauté de confiance en tant que client ou prestataire qualifié
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200/80 rounded-2xl max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setRole('PROVIDER')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              role === 'PROVIDER'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Je suis Prestataire / Artisan</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('CLIENT')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              role === 'CLIENT'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Je cherche un service (Client)</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Coordonnées de base */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                1. Vos coordonnées & Identifiants
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Karim Benali"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+213 550..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse / Ville de résidence *
                </label>
                <input
                  type="text"
                  required
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="Quartier, Ville (Ex: Bab El Oued, Alger)"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Provider Section */}
            {role === 'PROVIDER' && (
              <>
                {/* Section 2: Métier & Zone de chalandise */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                    2. Spécialité & Zone d'intervention
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Votre métier principal *
                      </label>
                      <select
                        value={categorySlug}
                        onChange={(e) => setCategorySlug(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                      >
                        {INITIAL_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Années d'expérience *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                      <span>Rayon d'intervention maximal :</span>
                      <span className="font-bold text-blue-600">{operationalRadiusKm} km autour de votre base</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={operationalRadiusKm}
                      onChange={(e) => setOperationalRadiusKm(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Les clients situés dans ce périmètre verront automatiquement votre profil en tête des résultats.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bio / Présentation de votre savoir-faire
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Décrivez vos compétences, votre outillage, vos garanties..."
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Section 3: Catalogue des Prestations & Tarifs */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      3. Vos Prestations & Tarifs (Fixes ou Horaires)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Prestation #{idx + 1}</span>
                          {services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveService(idx)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Supprimer ce service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              required
                              placeholder="Intitulé du service (ex: Vidange moteur, Nettoyage vitre)"
                              value={srv.title}
                              onChange={(e) => handleUpdateService(idx, 'title', e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                            />
                          </div>
                          <div>
                            <select
                              value={srv.priceType}
                              onChange={(e) => handleUpdateService(idx, 'priceType', e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                            >
                              <option value="FIXED">Tarif Forfaitaire</option>
                              <option value="HOURLY">Tarif par Heure</option>
                              <option value="ESTIMATE">Sur Devis</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-500 mb-0.5">Prix (en DA)</label>
                            <input
                              type="number"
                              required
                              value={srv.price}
                              onChange={(e) => handleUpdateService(idx, 'price', Number(e.target.value))}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none font-bold text-blue-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-500 mb-0.5">Durée estimée (minutes)</label>
                            <input
                              type="number"
                              value={srv.durationMinutes}
                              onChange={(e) => handleUpdateService(idx, 'durationMinutes', Number(e.target.value))}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Description courte de ce qui est inclus..."
                            value={srv.description}
                            onChange={(e) => handleUpdateService(idx, 'description', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Anciennes Réalisations / Portfolio */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      4. Anciens Travaux & Portfolio (Photos)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddPortfolio}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une réalisation</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {portfolio.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-start"
                      >
                        <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                          <img
                            src={item.imageUrl}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Photo #{idx + 1}</span>
                            {portfolio.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePortfolio(idx)}
                                className="text-rose-500 hover:text-rose-700 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            placeholder="Titre du travail (ex: Rénovation salle de bain, Révision Golf 7)"
                            value={item.title}
                            onChange={(e) => handleUpdatePortfolio(idx, 'title', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                          />

                          <input
                            type="url"
                            placeholder="URL de l'image (Unsplash ou hébergée)"
                            value={item.imageUrl}
                            onChange={(e) => handleUpdatePortfolio(idx, 'imageUrl', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {loading
                    ? 'Création du compte en cours...'
                    : role === 'PROVIDER'
                    ? 'Publier ma vitrine artisan & Créer mon compte'
                    : 'Créer mon compte Client'}
                </span>
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
