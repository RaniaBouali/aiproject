import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// Force dynamic rendering so categories are always fetched from the live dataStore
// (not cached at build time). Important since categories can change at runtime.
export const dynamic = 'force-dynamic';

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
