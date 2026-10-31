import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Heart, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Proxi<span className="text-blue-400">Service</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              La plateforme de mise en relation directe avec les artisans et professionnels qualifiés près de chez vous.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Profils et identités vérifiés par notre équipe</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Métiers populaires
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search?category=mecanicien" className="hover:text-white transition-colors">
                  Mécaniciens auto & moto
                </Link>
              </li>
              <li>
                <Link href="/search?category=femme-de-menage" className="hover:text-white transition-colors">
                  Femmes de ménage & aide
                </Link>
              </li>
              <li>
                <Link href="/search?category=plombier" className="hover:text-white transition-colors">
                  Plombiers chauffagistes
                </Link>
              </li>
              <li>
                <Link href="/search?category=electricien" className="hover:text-white transition-colors">
                  Électriciens certifiés
                </Link>
              </li>
              <li>
                <Link href="/search?category=peintre" className="hover:text-white transition-colors">
                  Peintres en bâtiment
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Carte interactive des services
                </Link>
              </li>
              <li>
                <Link href="/client/dashboard" className="hover:text-white transition-colors">
                  Suivi de mes réservations
                </Link>
              </li>
              <li>
                <Link href="/provider/dashboard" className="hover:text-white transition-colors">
                  Espace Pro & Inscription Artisan
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Charte de confiance & avis certifiés</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support & Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+213 (0) 550 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>contact@proxiservice.com</span>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                Disponible du Dimanche au Jeudi, 8h30 - 18h00.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 ProxiService Inc. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu avec rigueur logicielle & architecture PostGIS
          </p>
        </div>
      </div>
    </footer>
  );
}
