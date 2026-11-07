'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Art from '@/components/Art';
import Checkout from '@/components/Checkout';
import { Line, OrderRec, P, eur, groupCart } from '@/components/types';
import { useConfig } from '@/components/useConfig';

type Msg = { role: 'user'; content: string } | { role: 'assistant'; content: string; title?: string; products?: P[]; engine?: string; note?: string } | { role: 'receipt'; rec: OrderRec };

const HOSTS = ['Chatout demo chat', 'Meta AI · Instagram', 'ChatGPT app', 'Gemini', 'Grok on X'];
const TODO = [
  { t: 'Nova Lane added a Kraków date', s: 'Tickets and tour tee, 2 stores', q: 'When is Nova Lane playing in Kraków? I want tickets and the tour tee.' },
  { t: 'The jacket from that Reel', s: 'Size M in stock', q: 'Where is the field jacket from that Reel? Show similar ones in size M.' },
  { t: 'Weekend shelf project', s: 'Nearest store with stock', q: 'I need 40 mm wood screws and a 3 mm drill bit, delivered today.' },
  { t: 'New drawing tablet', s: 'Compare 3 under €400', q: 'Compare drawing tablets under €400 and where to buy them.' },
  { t: '€230.40 waiting in PayPal', s: 'Spend it on any of the above', q: 'What can I buy with my PayPal balance from these stores?' }
];

export default function ChatPage() {
  const cfg = useConfig();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [cart, setCart] = useState<Line[]>([]);
  const [sheet, setSheet] = useState<P | null>(null);
  const [opt, setOpt] = useState('');
  const [checkout, setCheckout] = useState(false);
  const [host, setHost] = useState(HOSTS[0]);
  const [engine, setEngine] = useState('rules');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, busy]);

  async function send(text: string) {
    const q = text.trim(); if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: q }];
    setMsgs(next); setInput(''); setBusy(true);
    try {
      const history = next.filter(m => m.role !== 'receipt').map(m => ({ role: m.role as 'user' | 'assistant', content: (m as any).content }));
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setEngine(j.engine);
      setMsgs(m => [...m, { role: 'assistant', content: j.reply, title: j.title, products: j.products, engine: j.engine, note: j.note }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'assistant', content: `Something went wrong: ${(e as Error).message}. Try again.` }]);
    } finally { setBusy(false); }
  }

  const inCart = (id: string) => cart.some(l => l.p.id === id);
  const defOpt = (p: P) => p.options[Math.min(1, p.options.length - 1)];
  function toggle(p: P, option?: string) {
    setCart(c => inCart(p.id) && !option ? c.filter(l => l.p.id !== p.id) : [...c.filter(l => l.p.id !== p.id), { p, option: option || defOpt(p), qty: 1 }]);
  }
  function openSheet(p: P) { setSheet(p); setOpt(cart.find(l => l.p.id === p.id)?.option || defOpt(p)); }
  const { groups, total } = groupCart(cart);
  const count = cart.reduce((a, l) => a + l.qty, 0);

  return (
    <>
      <div className="chat">
        <main className="chat-main">
          <div className="thread" aria-live="polite">
            {msgs.length === 0 && (
              <section className="hello">
                <span className="eyebrow">Chatout · PayPal inside the conversation</span>
                <h1>Ask for anything. Buy it here. Pay with PayPal.</h1>
                <p className="mute" style={{ maxWidth: '60ch' }}>Products from several stores share one cart and one PayPal approval. Stores without an integration are handled by an agent. Every order shows up on the merchant dashboard.</p>
                <span className="eyebrow" style={{ marginTop: 8 }}>5 things to do now</span>
                <div className="suggest">
                  {TODO.map(t => <button key={t.t} onClick={() => send(t.q)}><b>{t.t}</b><span>{t.s}</span></button>)}
                </div>
              </section>
            )}
            {msgs.map((m, i) => m.role === 'user' ? <div key={i} className="mu">{m.content}</div>
              : m.role === 'receipt' ? (
                <div key={i} className="ma"><div className="who"><i />Chatout</div>
                  <div className="widget"><div className="widget-h"><b>Paid {eur(m.rec.total)} with PayPal</b><span className={`chip ${m.rec.mode === 'sandbox' ? 'ok' : 'warn'}`}><i />{m.rec.mode}</span></div>
                    <div className="receipt">{m.rec.stores.map(s => <div className="r" key={s.id}><b>{s.name}</b><span className="num">{eur(s.amount)}</span><small>{s.integration === 'agent' ? 'Agent placed the order on the store site' : 'Order sent to store system'} · tracking will appear here</small></div>)}</div>
                  </div>
                </div>
              ) : (
                <div key={i} className="ma">
                  <div className="who"><i />{host}{m.engine ? ` · ${m.engine === 'gemini' ? 'Gemini agent' : 'rule agent'}` : ''}</div>
                  <p>{m.content}</p>
                  {m.note && <span className="chip warn"><i />{m.note}</span>}
                  {!!m.products?.length && (
                    <div className="widget">
                      <div className="widget-h"><b>{m.title}</b><span className="pp-tag">Pay with PayPal</span></div>
                      <div className="cards">
                        {m.products.map(p => (
                          <div className="pc" key={p.id}>
                            <button className="im" onClick={() => openSheet(p)} aria-label={`Open ${p.name}`}><Art kind={p.art} color={p.color} /></button>
                            <div className="nm">{p.name}</div>
                            <div className="st">{p.merchant}</div>
                            <div className="row"><span className="pr num">{eur(p.price)}</span><button className={`add ${inCart(p.id) ? 'in' : ''}`} onClick={() => toggle(p)}>{inCart(p.id) ? 'Added ✓' : '+ Add'}</button></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            {busy && <div className="ma"><div className="who"><i />{host}</div><div className="typing"><i /><i /><i /></div></div>}
            <div ref={endRef} />
          </div>
        </main>
        <aside className="side">
          <div className="card">
            <span className="eyebrow">Shown inside</span>
            <select value={host} onChange={e => setHost(e.target.value)} aria-label="Host" style={{ height: 40, borderRadius: 20, background: 'var(--surface-2)', border: 0, padding: '0 14px' }}>
              {HOSTS.map(h => <option key={h}>{h}</option>)}
            </select>
            <p>The host label goes with every order, so the merchant dashboard shows which AI or social surface sold.</p>
          </div>
          <div className="card">
            <span className="eyebrow">This build</span>
            <p>Payments: {cfg?.mode === 'sandbox' ? 'PayPal sandbox, Orders v2' : 'demo mode until sandbox keys are set'}.<br />Agent: {cfg?.ai === 'gemini' ? 'Gemini with tool calls' : 'rule-based, works offline'}.</p>
            <Link className="pill sm" href="/merchant">Open merchant dashboard</Link>
          </div>
        </aside>
      </div>

      <div className="dock">
        <div className="dock-in"><div className="dock-col">
          {count > 0 && <div className="cartbar"><span><b>{count} item{count > 1 ? 's' : ''}</b> · {groups.length} store{groups.length > 1 ? 's' : ''} · <span className="num">{eur(total)}</span></span><button className="go" onClick={() => setCheckout(true)}>Checkout</button></div>}
          <form className="composer" onSubmit={e => { e.preventDefault(); send(input); }}>
            <input id="ask" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask for tickets, a jacket, screws…" autoComplete="off" />
            <button type="submit" aria-label="Send" disabled={busy}><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 15V5M5.5 9.5 10 5l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          </form>
        </div><div /></div>
      </div>

      {sheet && (
        <div className="scrim" onClick={() => setSheet(null)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label={sheet.name} onClick={e => e.stopPropagation()}>
            <div className="sheet-top"><h3>{sheet.name}</h3><button className="x" onClick={() => setSheet(null)} aria-label="Close">✕</button></div>
            <div className="gal">{[0, 1, 2].map(v => <div key={v}><Art kind={sheet.art} color={sheet.color} v={v} /></div>)}</div>
            <div className="line"><span className="mute">{sheet.merchant}</span><b className="num">{eur(sheet.price)}</b></div>
            <div className="opts" role="group" aria-label="Options">{sheet.options.map(o => <button key={o} aria-pressed={o === opt} onClick={() => setOpt(o)}>{o}</button>)}</div>
            <p className="mute" style={{ fontSize: 14 }}>{sheet.desc}</p>
            <button className="ppbtn alt" onClick={() => { toggle(sheet, opt); setSheet(null); }}>{inCart(sheet.id) ? 'Update cart' : 'Add to cart'}</button>
            <button className="ppbtn" onClick={() => { toggle(sheet, opt); setSheet(null); setCheckout(true); }}>Buy now with <i>PayPal</i></button>
          </div>
        </div>
      )}

      {checkout && cart.length > 0 && (
        <Checkout lines={cart} host={host} engine={engine} onClose={() => setCheckout(false)}
          onPaid={rec => { setCheckout(false); setCart([]); setMsgs(m => [...m, { role: 'receipt', rec }]); }} />
      )}
    </>
  );
}
