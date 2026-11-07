import { NextResponse } from 'next/server';
import { buildOrderBody, multiPayee } from '@/lib/paypal';

/* Shows the exact Orders v2 body Chatout sends for a sample two-store cart. */
export async function GET() {
  const sample = [{ id: 'NL-TIX-14', option: 'General entry', qty: 1 }, { id: 'NL-TEE-BLK', option: 'M', qty: 1 }];
  return NextResponse.json({ multiPayee: multiPayee(), body: buildOrderBody(sample, 'Chatout demo chat') });
}
