import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { calculateHaversineDistance, DEFAULT_COORDINATES } from '@/lib/geo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = dataStore.getProviderById(params.id);

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Optional: compute distance if lat/lng are supplied in query
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const searchLat = latStr ? parseFloat(latStr) : DEFAULT_COORDINATES.latitude;
    const searchLng = lngStr ? parseFloat(lngStr) : DEFAULT_COORDINATES.longitude;

    const distanceKm = calculateHaversineDistance(
      searchLat,
      searchLng,
      provider.latitude,
      provider.longitude
    );

    return NextResponse.json({
      success: true,
      data: {
        ...provider,
        distanceKm: Math.round(distanceKm * 10) / 10,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch provider profile' },
      { status: 500 }
    );
  }
}
