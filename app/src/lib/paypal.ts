import { CartLine, priceCart } from './catalog';

const BASE = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

export const paypalReady = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
export const multiPayee = () => process.env.MULTI_PAYEE === '1';

let cached: { token: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status}). Check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.`);
  const j = await res.json();
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cached.token;
}

const money = (v: number) => ({ currency_code: 'EUR', value: v.toFixed(2) });

/** Builds the Orders v2 body. Multi-payee mode: one purchase unit per store, each paid directly.
 *  Single-payee mode: one purchase unit to the sandbox app owner, items tagged by store. */
export function buildOrderBody(lines: CartLine[], host: string) {
  const { groups, total } = priceCart(lines);
  const item = (r: (typeof groups)[number]['items'][number], storeName: string) => ({
    name: `${r.p.name} · ${r.option}`.slice(0, 127),
    sku: r.p.id,
    description: storeName.slice(0, 127),
    unit_amount: money(r.p.price),
    quantity: String(r.qty),
    category: r.p.digital ? 'DIGITAL_GOODS' : 'PHYSICAL_GOODS'
  });
  if (multiPayee()) {
    return {
      intent: 'CAPTURE',
      purchase_units: groups.map(g => ({
        reference_id: g.merchant.id,
        description: `${g.merchant.name} via Chatout (${host})`.slice(0, 127),
        payee: { email_address: process.env[g.merchant.payeeEnv] || undefined },
        items: g.items.map(r => item(r, g.merchant.name)),
        amount: { ...money(g.total), breakdown: { item_total: money(g.itemTotal), shipping: money(g.shipping) } }
      }))
    };
  }
  const itemTotal = groups.reduce((a, g) => a + g.itemTotal, 0);
  const shipping = groups.reduce((a, g) => a + g.shipping, 0);
  return {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: 'chatout-cart',
      description: `Chatout cart, ${groups.length} store(s), via ${host}`.slice(0, 127),
      custom_id: groups.map(g => `${g.merchant.id}:${g.total.toFixed(2)}`).join('|').slice(0, 127),
      items: groups.flatMap(g => g.items.map(r => item(r, g.merchant.name))),
      amount: { ...money(total), breakdown: { item_total: money(itemTotal), shipping: money(shipping) } }
    }]
  };
}

export async function createOrder(lines: CartLine[], host: string) {
  const token = await accessToken();
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': crypto.randomUUID() },
    body: JSON.stringify(buildOrderBody(lines, host)),
    cache: 'no-store'
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`PayPal create order failed: ${j?.details?.[0]?.issue || j?.name || res.status}`);
  return j as { id: string; status: string };
}

export async function captureOrder(orderId: string) {
  if (!/^[A-Z0-9]{10,24}$/.test(orderId)) throw new Error('Invalid order id');
  const token = await accessToken();
  const res = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': `cap-${orderId}` },
    cache: 'no-store'
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`PayPal capture failed: ${j?.details?.[0]?.issue || j?.name || res.status}`);
  const captures = (j.purchase_units || []).flatMap((u: any) => (u.payments?.captures || []).map((c: any) => ({ unit: u.reference_id, id: c.id, status: c.status, amount: c.amount?.value })));
  return { id: j.id as string, status: j.status as string, payer: j.payer?.email_address as string | undefined, captures };
}
