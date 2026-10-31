import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { DEFAULT_COORDINATES } from '@/lib/geo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const radiusStr = searchParams.get('radius');
    const category = searchParams.get('category') || undefined;
    const minRatingStr = searchParams.get('minRating');
    const sortBy = (searchParams.get('sortBy') as any) || 'distance';
    const query = searchParams.get('query') || undefined;

    const latitude = latStr ? parseFloat(latStr) : DEFAULT_COORDINATES.latitude;
    const longitude = lngStr ? parseFloat(lngStr) : DEFAULT_COORDINATES.longitude;
    const radiusKm = radiusStr ? parseFloat(radiusStr) : 25;
    const minRating = minRatingStr ? parseFloat(minRatingStr) : undefined;

    const results = dataStore.searchProviders({
      latitude,
      longitude,
      radiusKm,
      category,
      minRating,
      sortBy,
      query,
    });

    return NextResponse.json({
      success: true,
      meta: {
        center: { latitude, longitude },
        radiusKm,
        totalFound: results.length,
      },
      data: results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to search providers' },
      { status: 500 }
    );
  }
}
