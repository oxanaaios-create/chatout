export type P = { id: string; merchantId: string; merchant: string; name: string; price: number; art: string; color: string; options: string[]; desc: string; digital?: boolean };
export type Line = { p: P; option: string; qty: number };
export type OrderRec = {
  id: string; paypalOrderId: string; mode: 'sandbox' | 'demo'; status: string; total: number; currency: 'EUR'; host: string; engine: string;
  stores: { id: string; name: string; amount: number; integration: 'webhook' | 'agent' }[];
  captures: { unit: string; id: string; status: string; amount?: string }[]; items: number; createdAt: string; seed?: boolean;
};
export const eur = (n: number) => { const r = Math.round(n * 100) / 100; return '€' + r.toLocaleString('en-US', { minimumFractionDigits: r % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
export const SHIP: Record<string, number> = { tourtix: 0, novalane: 4.9, oro: 5.9, toolbarn: 2.5, pixel: 0 };
export function groupCart(lines: Line[]) {
  const ids = [...new Set(lines.map(l => l.p.merchantId))];
  const groups = ids.map(id => {
    const items = lines.filter(l => l.p.merchantId === id);
    const itemTotal = items.reduce((a, l) => a + l.p.price * l.qty, 0);
    const shipping = items.every(l => l.p.digital) ? 0 : SHIP[id] ?? 0;
    return { id, name: items[0].p.merchant, items, itemTotal, shipping, total: itemTotal + shipping };
  });
  return { groups, total: groups.reduce((a, g) => a + g.total, 0) };
}
export function saveLocal(rec: OrderRec) {
  try { const k = 'chatout.orders'; const a: OrderRec[] = JSON.parse(localStorage.getItem(k) || '[]'); if (!a.some(x => x.id === rec.id)) a.unshift(rec); localStorage.setItem(k, JSON.stringify(a.slice(0, 200))); } catch {}
}
export function loadLocal(): OrderRec[] { try { return JSON.parse(localStorage.getItem('chatout.orders') || '[]'); } catch { return []; } }
