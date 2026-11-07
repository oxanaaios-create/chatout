export type ArtKind = 'ticket' | 'tee' | 'hoodie' | 'poster' | 'tablet' | 'film' | 'jacket' | 'tote' | 'screws' | 'bit' | 'drill';

export type Merchant = {
  id: string;
  name: string;
  payeeEnv: string;          // env var holding this store's sandbox payee email
  shipping: number;          // flat shipping in EUR, 0 for e-tickets
  integration: 'webhook' | 'agent';
  note: string;
};

export type Product = {
  id: string;
  merchantId: string;
  name: string;
  price: number;             // EUR
  art: ArtKind;
  color: string;
  options: string[];
  digital?: boolean;
  tags: string[];
  desc: string;
};

/* Demo stores. All names are fictional. */
export const MERCHANTS: Merchant[] = [
  { id: 'tourtix', name: 'Tour Tickets EU', payeeEnv: 'PAYEE_TOURTIX', shipping: 0, integration: 'webhook', note: 'E-tickets, integrated via webhook' },
  { id: 'novalane', name: 'Nova Lane Store', payeeEnv: 'PAYEE_NOVALANE', shipping: 4.9, integration: 'agent', note: 'Artist merch, no integration: agent completes checkout' },
  { id: 'oro', name: 'Oro Studio', payeeEnv: 'PAYEE_ORO', shipping: 5.9, integration: 'webhook', note: 'Small fashion brand via embed script' },
  { id: 'toolbarn', name: 'ToolBarn', payeeEnv: 'PAYEE_TOOLBARN', shipping: 2.5, integration: 'webhook', note: 'Local hardware store, 1.2 km' },
  { id: 'pixel', name: 'Pixel Supply', payeeEnv: 'PAYEE_PIXEL', shipping: 0, integration: 'webhook', note: 'Electronics, free shipping' }
];

export const PRODUCTS: Product[] = [
  { id: 'NL-TIX-14', merchantId: 'tourtix', name: 'Nova Lane · Standing ticket · 14 Mar', price: 79, art: 'ticket', color: '#2B2B3F', options: ['General entry'], digital: true, tags: ['nova', 'lane', 'ticket', 'tickets', 'concert', 'krakow', 'kraków', 'show', 'gig', 'tour'], desc: 'Tauron Arena Kraków. Mobile ticket with QR code, sent to your PayPal email.' },
  { id: 'NL-TIX-15', merchantId: 'tourtix', name: 'Nova Lane · Seat, Block C · 15 Mar', price: 94, art: 'ticket', color: '#3F2B33', options: ['Row 4', 'Row 9'], digital: true, tags: ['nova', 'lane', 'ticket', 'tickets', 'concert', 'krakow', 'kraków', 'seat', 'tour'], desc: 'Seated ticket, Block C. Mobile ticket with QR code.' },
  { id: 'NL-TEE-BLK', merchantId: 'novalane', name: 'Nova Lane tour tee, black', price: 35, art: 'tee', color: '#1C1C1C', options: ['S', 'M', 'L', 'XL'], tags: ['nova', 'lane', 'tee', 't-shirt', 'tshirt', 'shirt', 'merch', 'tour'], desc: 'Heavyweight organic cotton. Tour dates on the back.' },
  { id: 'NL-HOOD', merchantId: 'novalane', name: 'Nova Lane tour hoodie', price: 69, art: 'hoodie', color: '#5A6B8C', options: ['S', 'M', 'L', 'XL'], tags: ['nova', 'lane', 'hoodie', 'merch', 'tour'], desc: 'Brushed fleece, tour dates on the sleeve.' },
  { id: 'NL-POSTER', merchantId: 'novalane', name: 'Signed tour poster', price: 25, art: 'poster', color: '#C7553B', options: ['50 × 70 cm'], tags: ['nova', 'lane', 'poster', 'merch', 'signed'], desc: 'Limited signed print, shipped in a tube.' },

  { id: 'ORO-RIDGE', merchantId: 'oro', name: 'Ridge Field Jacket', price: 148, art: 'jacket', color: '#7A6A4F', options: ['S', 'M', 'L'], tags: ['jacket', 'field', 'coat', 'outfit', 'fashion', 'reel', 'instagram'], desc: 'Water-repellent cotton canvas, corduroy collar, four pockets.' },
  { id: 'ORO-CROP', merchantId: 'oro', name: 'Cropped utility jacket', price: 119, art: 'jacket', color: '#A88F6A', options: ['XS', 'S', 'M'], tags: ['jacket', 'cropped', 'utility', 'fashion', 'outfit'], desc: 'Cropped fit, double-stitched cotton twill.' },
  { id: 'ORO-TOTE', merchantId: 'oro', name: 'Canvas tote', price: 39, art: 'tote', color: '#D8C9A8', options: ['One size'], tags: ['tote', 'bag', 'fashion', 'outfit', 'gift'], desc: 'Heavy canvas tote with inner pocket.' },

  { id: 'TB-SCREW-40', merchantId: 'toolbarn', name: 'Wood screws 4×40 mm, 200 pcs', price: 8.9, art: 'screws', color: '#8C8C8C', options: ['200 pcs', '500 pcs'], tags: ['screw', 'screws', 'wood', '40', 'mm', 'diy', 'hardware'], desc: 'Zinc-plated countersunk, Pozidriv head.' },
  { id: 'TB-BIT-3', merchantId: 'toolbarn', name: 'HSS drill bit 3 mm, 2 pcs', price: 4.5, art: 'bit', color: '#4F5B66', options: ['2 pcs'], tags: ['bit', 'drill', '3', 'mm', 'diy', 'hardware'], desc: 'High-speed steel, for wood and metal.' },
  { id: 'TB-DRILL', merchantId: 'toolbarn', name: 'Cordless drill 18V', price: 79, art: 'drill', color: '#C9612E', options: ['Body only', 'With battery'], tags: ['drill', 'cordless', 'tool', 'diy', 'hardware'], desc: 'Brushless, two speeds, LED light.' },

  { id: 'PX-PD13', merchantId: 'pixel', name: 'Pen display 13″', price: 349, art: 'tablet', color: '#24303B', options: ['Black'], tags: ['tablet', 'drawing', 'pen', 'display', 'design', 'graphic'], desc: 'Pressure-sensitive pen included. Mac, Windows, Android.' },
  { id: 'PX-PTM', merchantId: 'pixel', name: 'Pen tablet M, wireless', price: 189, art: 'tablet', color: '#3A3A3A', options: ['Grey'], tags: ['tablet', 'drawing', 'pen', 'wireless', 'design'], desc: 'Wireless pen tablet, medium size.' },
  { id: 'PX-FILM', merchantId: 'pixel', name: 'Matte screen film 13″', price: 19, art: 'film', color: '#6A7A8C', options: ['13″'], tags: ['film', 'screen', 'protector', 'tablet', 'matte'], desc: 'Paper-like matte film, less glare.' }
];

export const merchantOf = (p: Product) => MERCHANTS.find(m => m.id === p.merchantId)!;
export const productById = (id: string) => PRODUCTS.find(p => p.id === id);

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

const STOP = new Set(['the', 'and', 'for', 'with', 'want', 'need', 'when', 'what', 'where', 'show', 'find', 'from', 'that', 'this', 'buy', 'get', 'can', 'me', 'my', 'in', 'is', 'it', 'to', 'of', 'a', 'i', 'on', 'if', 'possible', 'today', 'ones', 'similar', 'playing', 'them', 'these', 'under', 'best']);

export function searchCatalog(q: string, limit = 6): Product[] {
  const words = norm(q).split(/[^a-z0-9]+/).filter(w => w.length > 1 && !STOP.has(w));
  const scored = PRODUCTS.map(p => {
    const hay = p.tags.map(norm).concat(norm(p.name).split(/[^a-z0-9]+/));
    const score = words.reduce((s, w) => s + (hay.includes(w) ? 2 : w.length >= 4 && hay.some(h => h.length >= 4 && (h.startsWith(w) || w.startsWith(h))) ? 1 : 0), 0);
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  const top = scored[0]?.score || 0;
  return scored.filter(x => x.score >= Math.max(2, top * 0.4)).slice(0, limit).map(x => x.p);
}

export type CartLine = { id: string; option: string; qty: number };

/** Prices always come from the catalog, never from the client. */
export function priceCart(lines: CartLine[]) {
  const rows = lines.map(l => {
    const p = productById(l.id);
    if (!p) throw new Error(`Unknown product ${l.id}`);
    const option = p.options.includes(l.option) ? l.option : p.options[0];
    const qty = Math.max(1, Math.min(10, Math.floor(l.qty || 1)));
    return { p, option, qty, line: Math.round(p.price * qty * 100) / 100 };
  });
  const byMerchant = MERCHANTS.map(m => {
    const items = rows.filter(r => r.p.merchantId === m.id);
    if (!items.length) return null;
    const itemTotal = Math.round(items.reduce((a, r) => a + r.line, 0) * 100) / 100;
    const shipping = items.every(r => r.p.digital) ? 0 : m.shipping;
    return { merchant: m, items, itemTotal, shipping, total: Math.round((itemTotal + shipping) * 100) / 100 };
  }).filter(Boolean) as { merchant: Merchant; items: typeof rows; itemTotal: number; shipping: number; total: number }[];
  const total = Math.round(byMerchant.reduce((a, g) => a + g.total, 0) * 100) / 100;
  return { groups: byMerchant, total };
}
