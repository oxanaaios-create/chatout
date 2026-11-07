import { NextResponse } from 'next/server';
import { PRODUCTS, searchCatalog, merchantOf } from '@/lib/catalog';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const sku = u.searchParams.get('sku');
  const q = u.searchParams.get('q');
  const list = sku ? PRODUCTS.filter(p => p.id === sku) : q ? searchCatalog(q, 10) : PRODUCTS;
  return NextResponse.json({ products: list.map(p => ({ ...p, merchant: merchantOf(p).name })) });
}
