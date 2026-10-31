import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const authResult = dataStore.authenticate(email, password);

    if (!authResult) {
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides (email ou mot de passe incorrect)' },
        { status: 401 }
      );
    }

    let providerProfile = null;
    if (authResult.user.role === 'PROVIDER') {
      providerProfile = dataStore.getProviderByUserId(authResult.user.id) ||
        (authResult.user.providerProfileId ? dataStore.getProviderById(authResult.user.providerProfileId) : null);
    }

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: authResult.user,
        token: authResult.token,
        providerProfile,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
