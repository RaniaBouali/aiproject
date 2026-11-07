import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, unauthorized } from '@/server/auth';
import { ok, serviceErrorResponse } from '@/server/http';
import { confirmProblemAnalysis } from '@/server/services/analyses';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser(request);
  if (!user) return unauthorized();
  try {
    return ok(await confirmProblemAnalysis(user, params.id));
  } catch (error) {
    return serviceErrorResponse(error);
  }
}
