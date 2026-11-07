import { NextResponse } from 'next/server';
import { createOrder, paypalReady } from '@/lib/paypal';
import { priceCart, CartLine } from '@/lib/catalog';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const lines: CartLine[] = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
  const host = String(body.host || 'Chatout demo chat').slice(0, 40);
  if (!lines.length) return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
  try {
    const priced = priceCart(lines);
    if (!paypalReady()) return NextResponse.json({ id: 'DEMO' + Date.now().toString(36).toUpperCase(), demo: true, total: priced.total });
    const o = await createOrder(lines, host);
    return NextResponse.json({ id: o.id, demo: false, total: priced.total });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
