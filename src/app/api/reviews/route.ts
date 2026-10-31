import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, clientId, clientName, rating, comment, bookingId } = body;

    if (!providerId || !clientName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required review fields' },
        { status: 400 }
      );
    }

    const review = dataStore.addReview(providerId, {
      clientId: clientId || 'cli-guest',
      clientName,
      rating: Number(rating),
      comment,
      bookingId,
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Provider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully',
        data: review,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
