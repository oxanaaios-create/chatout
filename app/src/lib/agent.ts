import { PRODUCTS, MERCHANTS, Product, searchCatalog, merchantOf } from './catalog';

export type ChatMsg = { role: 'user' | 'assistant'; content: string };
export type AgentResult = { reply: string; title: string; productIds: string[]; engine: 'gemini' | 'rules'; note?: string };

const CATALOG_BRIEF = PRODUCTS.map(p => `${p.id} | ${p.name} | €${p.price} | ${merchantOf(p).name} | options: ${p.options.join('/')}`).join('\n');

const SYSTEM = `You are the shopping layer inside an AI chat. Every product can be paid with PayPal inside the chat.
Answer the user's latest request in at most two short sentences, then call show_products with the best matching product ids.
Prefer combining items from different stores when the user asks for several things (for example a ticket and merch).
For local items, mention the nearest store. Never invent products or prices; use only this catalog:
${CATALOG_BRIEF}
Stores: ${MERCHANTS.map(m => `${m.name} (${m.note})`).join('; ')}.
If nothing in the catalog fits, say so briefly and call show_products with an empty list.`;

function rules(last: string): AgentResult {
  if (/balance|paypal money|my paypal/i.test(last)) {
    return { engine: 'rules', title: 'Picks your balance covers', productIds: ['NL-TEE-BLK', 'ORO-TOTE', 'TB-DRILL', 'PX-PTM', 'NL-TIX-14'],
      reply: 'Your PayPal balance pays first in this chat. Anything above it comes from your backup card, so nothing fails at checkout.' };
  }
  const found = searchCatalog(last, 6);
  for (const p of [...found]) for (const q of PRODUCTS) if (found.length < 4 && !found.includes(q) && q.art === p.art) found.push(q);
  if (!found.length) {
    return { engine: 'rules', title: 'Try one of these', productIds: ['NL-TIX-14', 'NL-TEE-BLK', 'ORO-RIDGE', 'TB-SCREW-40'],
      reply: 'I can show tickets and tour merch, jackets, drawing tablets or DIY parts from the demo stores. Here are a few to start.' };
  }
  const stores = [...new Set(found.map(p => merchantOf(p).name))];
  const lead = found[0];
  const topic = lead.tags.includes('ticket') || lead.tags.includes('merch') ? 'Nova Lane plays Tauron Arena Kraków on 14 and 15 March.'
    : lead.tags.includes('hardware') ? 'ToolBarn is the nearest store with stock, 1.2 km away.'
    : lead.tags.includes('tablet') ? 'Here are the drawing tablets in stock right now.'
    : lead.tags.includes('fashion') ? 'Here is the jacket with similar picks in stock.' : 'Here is what I found.';
  return {
    engine: 'rules',
    title: stores.length > 1 ? `${found.length} items from ${stores.length} stores` : `${found.length} item${found.length > 1 ? 's' : ''} from ${stores[0]}`,
    productIds: found.map(p => p.id),
    reply: `${topic} ${stores.length > 1 ? `Items from ${stores.slice(0, -1).join(', ')} and ${stores[stores.length - 1]} go in one cart and one PayPal payment.` : 'Pay with PayPal right here, no new tab.'}`
  };
}

async function gemini(messages: ChatMsg[]): Promise<AgentResult> {
  const key = process.env.GEMINI_API_KEY!;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: messages.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 2000) }] })),
    tools: [{ functionDeclarations: [{
      name: 'show_products',
      description: 'Render product cards with a PayPal checkout inside the chat.',
      parameters: { type: 'OBJECT', properties: {
        title: { type: 'STRING', description: 'Short card header, max 40 characters' },
        reply: { type: 'STRING', description: 'The short answer shown above the cards' },
        product_ids: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Catalog ids, best first, max 6' }
      }, required: ['title', 'reply', 'product_ids'] }
    }] }],
    toolConfig: { functionCallingConfig: { mode: 'ANY', allowedFunctionNames: ['show_products'] } }
  };
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body), cache: 'no-store'
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Gemini ${res.status}: ${String(e?.error?.message || '').slice(0, 140)}`); }
  const j = await res.json();
  const parts = j?.candidates?.[0]?.content?.parts || [];
  const call = parts.find((p: any) => p.functionCall)?.functionCall;
  if (!call) throw new Error('No tool call');
  const ids = (call.args?.product_ids || []).filter((id: string) => PRODUCTS.some(p => p.id === id)).slice(0, 6);
  return { engine: 'gemini', title: String(call.args?.title || 'Results').slice(0, 60), reply: String(call.args?.reply || '').slice(0, 400), productIds: ids };
}

export async function runAgent(messages: ChatMsg[]): Promise<AgentResult> {
  const last = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  if (process.env.GEMINI_API_KEY) {
    try { return await gemini(messages); }
    catch (e) { const r = rules(last); r.note = `AI unavailable (${(e as Error).message}), used rules`; return r; }
  }
  return rules(last);
}

export const productsFor = (ids: string[]): (Product & { merchant: string })[] =>
  ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).map(p => ({ ...p!, merchant: merchantOf(p!).name }));
