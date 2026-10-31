import { Category, ProviderProfile, Booking, Review, GeoSearchFilters } from '@/types';
import { calculateHaversineDistance, DEFAULT_COORDINATES } from './geo';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-mecanique',
    name: 'Mécanicien Auto & Moto',
    slug: 'mecanicien',
    icon: 'Wrench',
    description: 'Dépannage, vidange, révision, freins et diagnostic à domicile.',
    badgeCount: 14,
  },
  {
    id: 'cat-menage',
    name: 'Femme de ménage & Aide à domicile',
    slug: 'femme-de-menage',
    icon: 'Sparkles',
    description: 'Nettoyage approfondi, repassage, entretien de maisons et bureaux.',
    badgeCount: 22,
  },
  {
    id: 'cat-electricite',
    name: 'Électricien',
    slug: 'electricien',
    icon: 'Zap',
    description: 'Installation, remise aux normes, recherche de pannes & disjoncteurs.',
    badgeCount: 18,
  },
  {
    id: 'cat-plomberie',
    name: 'Plombier Chauffagiste',
    slug: 'plombier',
    icon: 'Droplet',
    description: 'Recherche de fuite, débouchage, chauffe-eau et robinetterie.',
    badgeCount: 19,
  },
  {
    id: 'cat-peinture',
    name: 'Peintre en bâtiment',
    slug: 'peintre',
    icon: 'Paintbrush',
    description: 'Peinture intérieure/extérieure, enduit, rénovation murale.',
    badgeCount: 12,
  },
  {
    id: 'cat-menuiserie',
    name: 'Menuisier & Agencement',
    slug: 'menuisier',
    icon: 'Hammer',
    description: 'Meubles sur mesure, pose de cuisine, parquets et placards.',
    badgeCount: 9,
  },
];

export const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov-karim-meca',
    userId: 'user-karim',
    name: 'Karim Benali',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    phone: '+213 550 12 34 56',
    email: 'karim.meca@proxiservice.com',
    addressText: 'Bab El Oued, Alger Centre',
    latitude: 36.7865,
    longitude: 3.0535,
    operationalRadiusKm: 25,
    isVerified: true,
    ratingAverage: 4.9,
    reviewCount: 38,
    status: 'AVAILABLE',
    experienceYears: 12,
    bio: 'Mécanicien automobile certifié avec plus de 12 ans d’expérience en atelier et service mobile d’urgence. Équipé d’une valise de diagnostic multi-marques. Intervention rapide sur Alger et ses environs.',
    categories: [INITIAL_CATEGORIES[0]],
    services: [
      {
        id: 'srv-diag',
        title: 'Diagnostic Électronique Complet (Valise OBD2)',
        description: 'Lecture et effacement des codes défauts, contrôle capteurs, test injecteurs et batterie.',
        price: 3500,
        priceType: 'FIXED',
        durationMinutes: 45,
      },
      {
        id: 'srv-vidange',
        title: 'Vidange Moteur + Remplacement Filtres',
        description: 'Vidange huile synthétique adaptée, changement filtre à huile, air et habitacle.',
        price: 5000,
        priceType: 'FIXED',
        durationMinutes: 60,
      },
      {
        id: 'srv-freins',
        title: 'Changement Plaquettes & Disques de Frein',
        description: 'Remplacement plaquettes avant/arrière, vérification liquide de frein et purge.',
        price: 4000,
        priceType: 'FIXED',
        durationMinutes: 90,
      },
      {
        id: 'srv-depannage',
        title: 'Dépannage Urgence / SOS Batterie à domicile',
        description: 'Recharge / booster de démarrage, test alternateur et remplacement batterie sur place.',
        price: 3000,
        priceType: 'FIXED',
        durationMinutes: 30,
      },
    ],
    portfolio: [
      {
        id: 'p-1',
        title: 'Révision moteur complète VW Golf 7',
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
        description: 'Remplacement courroie et pompe à eau.',
      },
      {
        id: 'p-2',
        title: 'Diagnostic électronique sur place',
        imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
        description: 'Intervention d’urgence avec station mobile.',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        clientId: 'cli-yassine',
        clientName: 'Yassine M.',
        rating: 5,
        comment: 'Très ponctuel et professionnel ! Karim est venu réparer l’alternateur de ma voiture directement dans mon parking. Travail propre et prix très honnête.',
        createdAt: '2026-10-24',
      },
      {
        id: 'rev-2',
        clientId: 'cli-amina',
        clientName: 'Amina K.',
        rating: 5,
        comment: 'Super mécanicien, il a trouvé la panne en 15 minutes alors que 2 garages s’étaient trompés.',
        createdAt: '2026-10-18',
      },
    ],
  },
  {
    id: 'prov-fatima-menage',
    userId: 'user-fatima',
    name: 'Fatima-Zahra Cherif',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    phone: '+213 661 98 76 54',
    email: 'fatima.menage@proxiservice.com',
    addressText: 'Kouba, Alger',
    latitude: 36.7262,
    longitude: 3.0864,
    operationalRadiusKm: 15,
    isVerified: true,
    ratingAverage: 4.95,
    reviewCount: 52,
    status: 'AVAILABLE',
    experienceYears: 8,
    bio: 'Experte en ménage résidentiel, nettoyage de fin de chantier et repassage soigné. Minutieuse, discrète et organisée. J’apporte un soin particulier à l’hygiène et aux produits écologiques non toxiques.',
    categories: [INITIAL_CATEGORIES[1]],
    services: [
      {
        id: 'srv-menage-std',
        title: 'Ménage Standard Appartement (3h)',
        description: 'Aspiration, lavage sols, dépoussiérage meubles, désinfection sanitaires et cuisine.',
        price: 3000,
        priceType: 'FIXED',
        durationMinutes: 180,
      },
      {
        id: 'srv-menage-profond',
        title: 'Grand Nettoyage en Profondeur / Printemps (5h)',
        description: 'Nettoyage intérieur placards, vitres complètes, électroménager et lessivage faïences.',
        price: 5500,
        priceType: 'FIXED',
        durationMinutes: 300,
      },
      {
        id: 'srv-repassage',
        title: 'Repassage & Soin du Linge (Par Heure)',
        description: 'Repassage soigné de chemises, draps, pliage et rangement en penderie.',
        price: 1000,
        priceType: 'HOURLY',
        durationMinutes: 60,
      },
      {
        id: 'srv-bureaux',
        title: 'Entretien Bureaux & Locaux Professionnels',
        description: 'Vidage corbeilles, nettoyage postes de travail, désinfection points de contact.',
        price: 1200,
        priceType: 'HOURLY',
        durationMinutes: 120,
      },
    ],
    portfolio: [
      {
        id: 'p-3',
        title: 'Nettoyage salon & baies vitrées',
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
        description: 'Résultat impeccable sans traces.',
      },
      {
        id: 'p-4',
        title: 'Rangement & organisation dressing',
        imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600',
        description: 'Optimisation de l’espace et repassage soigné.',
      },
    ],
    reviews: [
      {
        id: 'rev-3',
        clientId: 'cli-mourad',
        clientName: 'Mourad D.',
        rating: 5,
        comment: 'Fatima est d’une efficacité remarquable. Maison impeccable, odeur de frais, très respectueuse des lieux.',
        createdAt: '2026-10-28',
      },
      {
        id: 'rev-4',
        clientId: 'cli-sarah',
        clientName: 'Sarah B.',
        rating: 5,
        comment: 'Je fais appel à Fatima chaque semaine depuis 6 mois. Confiance absolue et travail parfait !',
        createdAt: '2026-10-15',
      },
    ],
  },
  {
    id: 'prov-ahmed-elec',
    userId: 'user-ahmed',
    name: 'Ahmed Mansour',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    phone: '+213 555 33 44 55',
    email: 'ahmed.elec@proxiservice.com',
    addressText: 'Hydra, Alger',
    latitude: 36.7451,
    longitude: 3.0422,
    operationalRadiusKm: 20,
    isVerified: true,
    ratingAverage: 4.85,
    reviewCount: 29,
    status: 'AVAILABLE',
    experienceYears: 15,
    bio: 'Artisan électricien diplômé d’état. Spécialiste des installations neuves, rénovations complètes, tableaux électriques, et domotique. Matériel conforme aux normes de sécurité internationales.',
    categories: [INITIAL_CATEGORIES[2]],
    services: [
      {
        id: 'srv-depannage-elec',
        title: 'Dépannage d’urgence Court-circuit / Disjoncteur',
        description: 'Localisation de la fuite de courant ou panne électrique avec appareil de mesure.',
        price: 3500,
        priceType: 'FIXED',
        durationMinutes: 45,
      },
      {
        id: 'srv-tableau',
        title: 'Remplacement / Pose Tableau Électrique',
        description: 'Mise en place de disjoncteurs différentiels, repérage circuits et mise à la terre.',
        price: 15000,
        priceType: 'ESTIMATE',
        durationMinutes: 240,
      },
      {
        id: 'srv-luminaires',
        title: 'Pose de Luminaires, Spots LED & Prises',
        description: 'Installation de lustres, appliques, variateurs et prises murales.',
        price: 1500,
        priceType: 'HOURLY',
        durationMinutes: 60,
      },
    ],
    portfolio: [
      {
        id: 'p-5',
        title: 'Tableau électrique sécurisé Schneider',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
        description: 'Rénovation totale villa avec certification.',
      },
    ],
    reviews: [
      {
        id: 'rev-5',
        clientId: 'cli-mehdi',
        clientName: 'Mehdi L.',
        rating: 5,
        comment: 'Électricien très pro. A résolu une panne complexe que d’autres n’arrivaient pas à localiser. Je recommande les yeux fermés.',
        createdAt: '2026-10-22',
      },
    ],
  },
  {
    id: 'prov-youssef-plombier',
    userId: 'user-youssef',
    name: 'Youssef Daoud',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    phone: '+213 770 44 55 66',
    email: 'youssef.plomberie@proxiservice.com',
    addressText: 'El Harrach, Alger',
    latitude: 36.7135,
    longitude: 3.1328,
    operationalRadiusKm: 30,
    isVerified: true,
    ratingAverage: 4.8,
    reviewCount: 41,
    status: 'AVAILABLE',
    experienceYears: 10,
    bio: 'Plombier chauffagiste expérimenté. Intervention rapide 7j/7 pour toutes vos urgences : fuites cachées, canalisations bouchées, installation chauffe-eau, chaudières murales et sanitaires.',
    categories: [INITIAL_CATEGORIES[3]],
    services: [
      {
        id: 'srv-fuite',
        title: 'Détection & Réparation de Fuite d’Eau',
        description: 'Colmatage fuite sous évier, tuyauterie cuivre/multicouche ou robinet.',
        price: 3000,
        priceType: 'FIXED',
        durationMinutes: 45,
      },
      {
        id: 'srv-debouchage',
        title: 'Débouchage Canalisation / WC / Évier',
        description: 'Débouchage mécanique à furet haute pression et contrôle écoulement.',
        price: 4000,
        priceType: 'FIXED',
        durationMinutes: 60,
      },
      {
        id: 'srv-chauffe-eau',
        title: 'Installation / Détartrage Chauffe-Eau',
        description: 'Pose chauffe-eau gaz ou électrique, raccordement sécurité et réglage flamme.',
        price: 6000,
        priceType: 'FIXED',
        durationMinutes: 90,
      },
    ],
    portfolio: [
      {
        id: 'p-6',
        title: 'Rénovation salle d’eau & douche italienne',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
        description: 'Raccordements impeccables sans aucune fuite.',
      },
    ],
    reviews: [
      {
        id: 'rev-6',
        clientId: 'cli-nora',
        clientName: 'Nora F.',
        rating: 5,
        comment: 'Appelé un dimanche matin pour une fuite importante, Youssef est arrivé en 30 minutes. Sauvetage réussi !',
        createdAt: '2026-10-25',
      },
    ],
  },
  {
    id: 'prov-samir-peintre',
    userId: 'user-samir',
    name: 'Samir Kadri',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    phone: '+213 552 99 88 77',
    email: 'samir.peinture@proxiservice.com',
    addressText: 'Chéraga, Alger',
    latitude: 36.7698,
    longitude: 2.9578,
    operationalRadiusKm: 25,
    isVerified: true,
    ratingAverage: 4.75,
    reviewCount: 24,
    status: 'AVAILABLE',
    experienceYears: 14,
    bio: 'Artisan peintre en bâtiment et décorateur. Travail soigné, protection complète des meubles et sols. Pose d’enduit lisse, peinture satinée, mate et effets décoratifs (stucco, sablé).',
    categories: [INITIAL_CATEGORIES[4]],
    services: [
      {
        id: 'srv-peinture-piece',
        title: 'Peinture Complète d’une Pièce (Murs + Plafond)',
        description: 'Lessivage, rebouchage fissures, sous-couche + 2 couches de finition.',
        price: 18000,
        priceType: 'ESTIMATE',
        durationMinutes: 480,
      },
      {
        id: 'srv-enduit',
        title: 'Enduisage et Ponçage Lisse (par m²)',
        description: '2 passes d’enduit gros + finition poncée pour mur prêt à peindre.',
        price: 450,
        priceType: 'FIXED',
        durationMinutes: 60,
      },
    ],
    portfolio: [
      {
        id: 'p-7',
        title: 'Rénovation salon moderne tons chaleureux',
        imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600',
        description: 'Finition mate veloutée sans coulure.',
      },
    ],
    reviews: [
      {
        id: 'rev-7',
        clientId: 'cli-riad',
        clientName: 'Riad T.',
        rating: 5,
        comment: 'Très méticuleux, appartement laissé propre à la fin du chantier. Peinture parfaite.',
        createdAt: '2026-10-12',
      },
    ],
  },
  {
    id: 'prov-mourad-menuisier',
    userId: 'user-mourad',
    name: 'Mourad Larbi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    phone: '+213 664 11 22 33',
    email: 'mourad.bois@proxiservice.com',
    addressText: 'Bir Mourad Raïs, Alger',
    latitude: 36.7329,
    longitude: 3.0531,
    operationalRadiusKm: 20,
    isVerified: true,
    ratingAverage: 4.88,
    reviewCount: 31,
    status: 'AVAILABLE',
    experienceYears: 16,
    bio: 'Menuisier ébéniste passionné. Conception et fabrication de dressings sur-mesure, meubles TV suspendus, pose de cuisines équipées et réparation de serrures/portes.',
    categories: [INITIAL_CATEGORIES[5]],
    services: [
      {
        id: 'srv-pose-porte',
        title: 'Pose / Rabotage Porte d’intérieur & Serrures',
        description: 'Ajustement porte qui frotte, changement cylindre ou pose bloc porte neuf.',
        price: 3500,
        priceType: 'FIXED',
        durationMinutes: 90,
      },
      {
        id: 'srv-montage-meuble',
        title: 'Montage Meubles en Kit & Dressing (3h)',
        description: 'Assemblage sécurisé de placards, commodes, fixation murale renforcée.',
        price: 4500,
        priceType: 'FIXED',
        durationMinutes: 180,
      },
    ],
    portfolio: [
      {
        id: 'p-8',
        title: 'Dressing sur mesure en chêne clair',
        imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=600',
        description: 'Agencement optimisé du sol au plafond.',
      },
    ],
    reviews: [
      {
        id: 'rev-8',
        clientId: 'cli-hichem',
        clientName: 'Hichem S.',
        rating: 5,
        comment: 'Mourad a confectionné une bibliothèque sur mesure splendide. Très grand artisan.',
        createdAt: '2026-10-19',
      },
    ],
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-101',
    clientId: 'cli-demo',
    clientName: 'Sarah Belhadj',
    clientPhone: '+213 550 99 88 11',
    clientAddress: '12 Rue Didouche Mourad, Alger',
    providerId: 'prov-karim-meca',
    providerName: 'Karim Benali (Mécanicien)',
    serviceId: 'srv-vidange',
    serviceTitle: 'Vidange Moteur + Remplacement Filtres',
    servicePrice: 5000,
    servicePriceType: 'FIXED',
    scheduledAt: '2026-11-04T10:00:00.000Z',
    status: 'PENDING',
    notes: 'Voiture Peugeot 208, garée au sous-sol. Merci de prévoir de l’huile 5W30.',
    createdAt: '2026-10-30T14:30:00.000Z',
    updatedAt: '2026-10-30T14:30:00.000Z',
  },
  {
    id: 'book-102',
    clientId: 'cli-demo',
    clientName: 'Sarah Belhadj',
    clientPhone: '+213 550 99 88 11',
    clientAddress: '12 Rue Didouche Mourad, Alger',
    providerId: 'prov-fatima-menage',
    providerName: 'Fatima-Zahra Cherif (Femme de ménage)',
    serviceId: 'srv-menage-std',
    serviceTitle: 'Ménage Standard Appartement (3h)',
    servicePrice: 3000,
    servicePriceType: 'FIXED',
    scheduledAt: '2026-11-02T09:00:00.000Z',
    status: 'ACCEPTED',
    notes: 'Appartement F4 au 3ème étage avec ascenseur.',
    createdAt: '2026-10-29T11:15:00.000Z',
    updatedAt: '2026-10-29T12:00:00.000Z',
  },
];

/**
 * In-memory state store with CRUD helpers
 */
class DataStore {
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private providers: ProviderProfile[] = [...INITIAL_PROVIDERS];
  private bookings: Booking[] = [...INITIAL_BOOKINGS];

  public getCategories(): Category[] {
    return this.categories;
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  public getProviders(): ProviderProfile[] {
    return this.providers;
  }

  public getProviderById(id: string): ProviderProfile | undefined {
    return this.providers.find((p) => p.id === id);
  }

  /**
   * Spatial Proximity Search with Filtering
   */
  public searchProviders(filters: GeoSearchFilters): ProviderProfile[] {
    const searchLat = filters.latitude ?? DEFAULT_COORDINATES.latitude;
    const searchLng = filters.longitude ?? DEFAULT_COORDINATES.longitude;
    const maxRadius = filters.radiusKm ?? 25; // default 25km radius

    // 1. Calculate distance for all providers
    let results = this.providers.map((p) => {
      const distanceKm = calculateHaversineDistance(
        searchLat,
        searchLng,
        p.latitude,
        p.longitude
      );
      return {
        ...p,
        distanceKm: Math.round(distanceKm * 10) / 10,
      };
    });

    // 2. Spatial radius filter:
    // A provider matches if distance is within the search radius
    // AND within the provider's own operational radius
    results = results.filter((p) => {
      const withinSearchRadius = p.distanceKm <= maxRadius;
      const withinProviderRadius = p.distanceKm <= p.operationalRadiusKm + 5; // slight tolerance
      return withinSearchRadius && withinProviderRadius;
    });

    // 3. Category filter
    if (filters.category && filters.category !== 'all') {
      results = results.filter((p) =>
        p.categories.some((c) => c.slug.toLowerCase() === filters.category?.toLowerCase())
      );
    }

    // 4. Rating filter
    if (filters.minRating && filters.minRating > 0) {
      results = results.filter((p) => p.ratingAverage >= filters.minRating!);
    }

    // 5. Keyword search query
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.services.some((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) ||
          p.categories.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // 6. Sorting
    const sortBy = filters.sortBy || 'distance';
    if (sortBy === 'distance') {
      results.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.ratingAverage - a.ratingAverage);
    } else if (sortBy === 'reviews') {
      results.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price_asc') {
      const getMinPrice = (p: ProviderProfile) =>
        Math.min(...p.services.map((s) => s.price));
      results.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    }

    return results;
  }

  public getBookings(): Booking[] {
    return this.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Booking {
    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  public updateBookingStatus(id: string, status: Booking['status']): Booking | null {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  public addReview(providerId: string, review: Omit<Review, 'id' | 'createdAt'>): Review | null {
    const provider = this.providers.find((p) => p.id === providerId);
    if (!provider) return null;

    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    provider.reviews.unshift(newReview);
    // Recalculate average rating
    const total = provider.reviews.reduce((acc, r) => acc + r.rating, 0);
    provider.ratingAverage = Math.round((total / provider.reviews.length) * 100) / 100;
    provider.reviewCount = provider.reviews.length;

    return newReview;
  }
}

// Global singleton instance
export const dataStore = new DataStore();
