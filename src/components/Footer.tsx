import React from 'react';
import Link from 'next/link';
import { Hammer, ShieldCheck, Phone, Mail, Award, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust banner strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-500 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Artisans Qualifiés & Vérifiés</p>
              <p className="mt-0.5 leading-relaxed">Vérification systématique de l&apos;identité, du registre professionnel et des compétences techniques.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-500 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Tarification Directe & Transparente</p>
              <p className="mt-0.5 leading-relaxed">Prix affichés en Dinars Algériens (DZD). Aucun frais caché ni commission abusive sur le client.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-500 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Proximité & Réactivité</p>
              <p className="mt-0.5 leading-relaxed">Calcul précis de distance par rayon kilométrique pour des interventions rapides sur site.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-slate-950 font-bold">
                <Hammer className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Proxi<span className="text-amber-500">Service</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              La place de marché locale des artisans de proximité : mécanique, plomberie, électricité, travaux et entretien à domicile.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Réseau opérationnel en Algérie
              </span>
            </div>
          </div>

          {/* Popular Trades */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Corps de Métier
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/search?category=mecanicien" className="hover:text-amber-400 transition-colors">
                  Mécaniciens & Dépannage Auto
                </Link>
              </li>
              <li>
                <Link href="/search?category=plombier" className="hover:text-amber-400 transition-colors">
                  Plombiers & Chauffagistes
                </Link>
              </li>
              <li>
                <Link href="/search?category=electricien" className="hover:text-amber-400 transition-colors">
                  Électriciens Bâtiment & Tableau
                </Link>
              </li>
              <li>
                <Link href="/search?category=femme-de-menage" className="hover:text-amber-400 transition-colors">
                  Aide Ménagère & Entretien
                </Link>
              </li>
              <li>
                <Link href="/search?category=peintre" className="hover:text-amber-400 transition-colors">
                  Peintres & Finitions Intérieures
                </Link>
              </li>
            </ul>
          </div>

          {/* Zones & Communes */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Zones d&apos;Intervention
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/search?query=Alger+Centre" className="hover:text-amber-400 transition-colors">
                  Alger Centre & Bab El Oued
                </Link>
              </li>
              <li>
                <Link href="/search?query=Hydra" className="hover:text-amber-400 transition-colors">
                  Hydra, El Biar, Ben Aknoun
                </Link>
              </li>
              <li>
                <Link href="/search?query=Kouba" className="hover:text-amber-400 transition-colors">
                  Kouba, Hussein Dey, Bir Mourad Raïs
                </Link>
              </li>
              <li>
                <Link href="/search?query=Blida" className="hover:text-amber-400 transition-colors">
                  Blida & Région Mitidja
                </Link>
              </li>
              <li>
                <Link href="/search?query=Boumerdes" className="hover:text-amber-400 transition-colors">
                  Boumerdès & Rouiba
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Direct Line */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Permanence & Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono text-slate-300">+213 (0) 550 12 34 56</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>contact@proxiservice.dz</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 leading-normal">
                Standard technique ouvert aux particuliers et artisans du Dimanche au Jeudi, 08h00 - 18h00.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 ProxiService DZ. Tous droits réservés.</p>
          <p className="font-mono text-slate-600">
            Algorithmes géospatiaux Haversine &bull; Norme RBAC
          </p>
        </div>
      </div>
    </footer>
  );
}
