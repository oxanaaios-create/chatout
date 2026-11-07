import { NextResponse } from 'next/server';
import { runAgent, productsFor, ChatMsg } from '@/lib/agent';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const messages: ChatMsg[] = Array.isArray(body.messages) ? body.messages.filter((m: any) => typeof m?.content === 'string').slice(-12) : [];
  if (!messages.length) return NextResponse.json({ error: 'Send at least one message.' }, { status: 400 });
  const r = await runAgent(messages);
  return NextResponse.json({ ...r, products: productsFor(r.productIds) });
}
