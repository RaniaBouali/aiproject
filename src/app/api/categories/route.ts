import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET() {
  try {
    const categories = dataStore.getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
