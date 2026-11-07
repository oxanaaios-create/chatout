import { NextResponse } from 'next/server';
import { paypalReady, multiPayee } from '@/lib/paypal';
import { MERCHANTS } from '@/lib/catalog';

export async function GET() {
  return NextResponse.json({
    mode: paypalReady() ? 'sandbox' : 'demo',
    clientId: paypalReady() ? process.env.PAYPAL_CLIENT_ID : null,
    currency: 'EUR',
    ai: process.env.GEMINI_API_KEY ? 'gemini' : 'rules',
    multiPayee: multiPayee(),
    payees: multiPayee() ? MERCHANTS.map(m => process.env[m.payeeEnv]).filter(Boolean) : []
  });
}
