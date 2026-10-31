import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updated = dataStore.updateBookingStatus(params.id, status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
