import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      // Return default guest or first user
      const users = dataStore.getUsers();
      return NextResponse.json({
        success: true,
        data: users[0] || null,
      });
    }

    const user = dataStore.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    let providerProfile = null;
    if (user.role === 'PROVIDER') {
      providerProfile = dataStore.getProviderByUserId(user.id) ||
        (user.providerProfileId ? dataStore.getProviderById(user.providerProfileId) : null);
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
        providerProfile,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}
