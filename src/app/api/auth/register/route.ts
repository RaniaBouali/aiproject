import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { DEFAULT_COORDINATES } from '@/lib/geo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      role = 'CLIENT',
      addressText,
      // Provider-specific fields
      categorySlug,
      bio,
      experienceYears,
      operationalRadiusKm,
      latitude,
      longitude,
      services,
      portfolio,
      avatar,
    } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants (Nom, Email, Téléphone, Mot de passe)' },
        { status: 400 }
      );
    }

    // 1. Register User
    const { user, token } = dataStore.registerUser({
      name,
      email,
      phone,
      password,
      role,
      addressText,
      avatar,
    });

    let providerProfile = null;

    // 2. If provider, initialize full ProviderProfile
    if (role === 'PROVIDER') {
      const category = categorySlug
        ? dataStore.getCategoryBySlug(categorySlug) || dataStore.getCategories()[0]
        : dataStore.getCategories()[0];

      const initialServices = Array.isArray(services) && services.length > 0
        ? services.map((s: any, idx: number) => ({
            id: `srv-${Date.now()}-${idx}`,
            title: s.title || 'Prestation standard',
            description: s.description || 'Prestation professionnelle réalisée avec soin.',
            price: Number(s.price) || 3000,
            priceType: s.priceType || 'FIXED',
            durationMinutes: Number(s.durationMinutes) || 60,
          }))
        : [
            {
              id: `srv-${Date.now()}-1`,
              title: 'Prestation initiale',
              description: 'Service professionnel à domicile ou en atelier.',
              price: 3500,
              priceType: 'FIXED',
              durationMinutes: 60,
            },
          ];

      const initialPortfolio = Array.isArray(portfolio) && portfolio.length > 0
        ? portfolio.map((p: any, idx: number) => ({
            id: `port-${Date.now()}-${idx}`,
            title: p.title || 'Réalisation récente',
            imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
            description: p.description || '',
          }))
        : [
            {
              id: `port-${Date.now()}-1`,
              title: 'Atelier / Équipement professionnel',
              imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
              description: 'Matériel certifié et outillage de haute précision.',
            },
          ];

      providerProfile = dataStore.createProviderProfile({
        userId: user.id,
        name: user.name,
        avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        phone: user.phone,
        email: user.email,
        addressText: addressText || 'Alger Centre',
        latitude: Number(latitude) || DEFAULT_COORDINATES.latitude,
        longitude: Number(longitude) || DEFAULT_COORDINATES.longitude,
        operationalRadiusKm: Number(operationalRadiusKm) || 20,
        isVerified: true,
        status: 'AVAILABLE',
        bio: bio || `Professionnel qualifié en ${category.name}. Travail propre, rapide et garanti.`,
        experienceYears: Number(experienceYears) || 3,
        categories: [category],
        services: initialServices,
        portfolio: initialPortfolio,
      });

      user.providerProfileId = providerProfile.id;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès',
        data: {
          user,
          token,
          providerProfile,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de l’inscription' },
      { status: 400 }
    );
  }
}
