import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET() {
  try {
    const bookings = dataStore.getBookings();
    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      clientId,
      clientName,
      clientPhone,
      clientAddress,
      providerId,
      providerName,
      serviceId,
      serviceTitle,
      servicePrice,
      servicePriceType,
      scheduledAt,
      notes,
    } = body;

    if (!clientName || !clientPhone || !providerId || !serviceId || !scheduledAt) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    const newBooking = dataStore.createBooking({
      clientId: clientId || 'cli-guest',
      clientName,
      clientPhone,
      clientAddress: clientAddress || '',
      providerId,
      providerName: providerName || 'Artisan',
      serviceId,
      serviceTitle: serviceTitle || 'Service demandé',
      servicePrice: Number(servicePrice) || 0,
      servicePriceType: servicePriceType || 'FIXED',
      scheduledAt,
      notes: notes || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Booking request sent successfully to provider',
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
