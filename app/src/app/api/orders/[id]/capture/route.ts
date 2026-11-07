import { NextResponse } from 'next/server';
import { captureOrder, paypalReady } from '@/lib/paypal';
import { priceCart, CartLine } from '@/lib/catalog';
import { record } from '@/lib/store';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const lines: CartLine[] = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
  const host = String(body.host || 'Chatout demo chat').slice(0, 40);
  const engine = String(body.engine || 'rules').slice(0, 20);
  try {
    const priced = priceCart(lines);
    const demo = id.startsWith('DEMO') || !paypalReady();
    const cap = demo
      ? { id, status: 'COMPLETED', captures: priced.groups.map((g, i) => ({ unit: g.merchant.id, id: `DEMO-CAP-${i + 1}-${id.slice(-5)}`, status: 'COMPLETED', amount: g.total.toFixed(2) })) }
      : await captureOrder(id);
    const rec = record({
      id: `co_${id}`, paypalOrderId: id, mode: demo ? 'demo' : 'sandbox', status: cap.status, total: priced.total, currency: 'EUR', host, engine,
      stores: priced.groups.map(g => ({ id: g.merchant.id, name: g.merchant.name, amount: g.total, integration: g.merchant.integration })),
      captures: cap.captures, items: lines.reduce((a, l) => a + (l.qty || 1), 0), createdAt: new Date().toISOString()
    });
    return NextResponse.json(rec);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
