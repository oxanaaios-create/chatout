'use client';
import { useEffect, useMemo, useState } from 'react';
import { OrderRec, eur, loadLocal } from '@/components/types';

const STORES = [['all', 'All demo stores'], ['tourtix', 'Tour Tickets EU'], ['novalane', 'Nova Lane Store'], ['oro', 'Oro Studio'], ['toolbarn', 'ToolBarn'], ['pixel', 'Pixel Supply']];
const HOSTS = ['Meta AI · Instagram', 'ChatGPT app', 'Gemini', 'Grok on X', 'Chatout demo chat'];

/* Deterministic example data so the dashboard opens in a realistic state. Always labelled as example. */
function exampleOrders(): (OrderRec & { channel: 'ai' | 'web' })[] {
  let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const out: (OrderRec & { channel: 'ai' | 'web' })[] = [];
  const now = Date.now();
  for (let d = 13; d >= 0; d--) {
    const aiN = 2 + Math.floor(rnd() * 3 + (13 - d) / 4), webN = 3 + Math.floor(rnd() * 3);
    for (let k = 0; k < aiN + webN; k++) {
      const ai = k < aiN, st = STORES[1 + Math.floor(rnd() * 5)];
      const multi = ai && rnd() > .55, st2 = STORES[1 + Math.floor(rnd() * 5)];
      const a1 = Math.round((25 + rnd() * 140) * 100) / 100, a2 = multi ? Math.round((20 + rnd() * 60) * 100) / 100 : 0;
      out.push({ id: `ex_${d}_${k}`, paypalOrderId: 'EXAMPLE', mode: 'demo', status: 'COMPLETED', total: a1 + a2, currency: 'EUR', host: ai ? HOSTS[Math.floor(rnd() * 4)] : 'Website', engine: 'example',
        stores: [{ id: st[0], name: st[1], amount: a1, integration: 'webhook' }, ...(multi && st2[0] !== st[0] ? [{ id: st2[0], name: st2[1], amount: a2, integration: 'agent' as const }] : [])],
        captures: [], items: multi ? 2 : 1, createdAt: new Date(now - d * 864e5 - rnd() * 6e7).toISOString(), seed: true, channel: ai ? 'ai' : 'web' });
    }
  }
  return out;
}

export default function Merchant() {
  const [live, setLive] = useState<OrderRec[]>([]);
  const [showEx, setShowEx] = useState(true);
  const [store, setStore] = useState('all');
  const [ready, setReady] = useState(false);
  const ex = useMemo(() => (ready ? exampleOrders() : []), [ready]);
  useEffect(() => setReady(true), []);

  useEffect(() => {
    const load = () => fetch('/api/stats').then(r => r.json()).then(j => {
      const map = new Map<string, OrderRec>();
      [...(j.orders || []), ...loadLocal()].forEach((o: OrderRec) => map.set(o.id, o));
      setLive([...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    }).catch(() => setLive(loadLocal()));
    load(); const t = setInterval(load, 4000); return () => clearInterval(t);
  }, []);

  const all = useMemo(() => [...live.map(o => ({ ...o, channel: 'ai' as const })), ...(showEx ? ex : [])], [live, ex, showEx]);
  const scoped = all.filter(o => store === 'all' || o.stores.some(s => s.id === store));
  const amountOf = (o: OrderRec) => store === 'all' ? o.total : o.stores.filter(s => s.id === store).reduce((a, s) => a + s.amount, 0);
  const aiOrders = scoped.filter(o => o.channel === 'ai');
  const revenue = scoped.reduce((a, o) => a + amountOf(o), 0);
  const aiRevenue = aiOrders.reduce((a, o) => a + amountOf(o), 0);
  const multi = aiOrders.filter(o => o.stores.length > 1).length;

  const days = [...Array(14)].map((_, i) => { const d = new Date(Date.now() - (13 - i) * 864e5); return d.toISOString().slice(0, 10); });
  const byDay = days.map(d => {
    const os = scoped.filter(o => o.createdAt.slice(0, 10) === d);
    return { d, ai: os.filter(o => o.channel === 'ai').reduce((a, o) => a + amountOf(o), 0), web: os.filter(o => o.channel === 'web').reduce((a, o) => a + amountOf(o), 0), live: os.some(o => !o.seed) };
  });
  const max = Math.max(1, ...byDay.map(b => b.ai + b.web));
  const hosts = HOSTS.map(h => ({ h, v: aiOrders.filter(o => o.host === h).reduce((a, o) => a + amountOf(o), 0) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v);
  const hmax = Math.max(1, ...hosts.map(h => h.v));
  const liveCount = live.length;

  if (!ready) return <div className="wrap"><span className="eyebrow">Merchant dashboard</span><p className="mute">Loading orders…</p></div>;
  return (
    <div className="wrap">
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="eyebrow">Merchant dashboard · PayPal Business view</span>
          <h1>AI chat is a sales channel now.</h1>
          <p className="mute">{liveCount ? `${liveCount} live order${liveCount > 1 ? 's' : ''} from this demo` : 'No live orders yet. Buy something in the chat and it appears here within seconds.'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={store} onChange={e => setStore(e.target.value)} aria-label="Store" style={{ height: 40, borderRadius: 20, background: 'var(--surface)', border: 0, padding: '0 14px' }}>
            {STORES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
          <label className="toggle"><input type="checkbox" checked={showEx} onChange={e => setShowEx(e.target.checked)} /> Example data</label>
        </div>
      </header>

      <div className="kpis">
        <div className="card kpi"><span>Revenue, 14 days</span><b className="num">{eur(revenue)}</b></div>
        <div className="card kpi"><span>From AI chats</span><b className="num">{revenue ? Math.round(aiRevenue / revenue * 100) : 0}%</b></div>
        <div className="card kpi"><span>AI-chat orders</span><b className="num">{aiOrders.length}</b></div>
        <div className="card kpi"><span>Multi-store carts</span><b className="num">{aiOrders.length ? Math.round(multi / aiOrders.length * 100) : 0}%</b></div>
      </div>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}><h3>Revenue by day</h3><div style={{ display: 'flex', gap: 14, fontSize: 12.5 }} className="mute"><span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--panel)', marginRight: 6 }} />AI chats</span><span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--surface-3)', marginRight: 6 }} />Website</span></div></div>
        <div className="bars" role="img" aria-label="Revenue by day, AI chats on top of website">
          {byDay.map(b => <div key={b.d} title={`${b.d}: AI ${eur(b.ai)}, web ${eur(b.web)}`}>
            <i style={{ height: `${b.ai / max * 100}%`, outline: b.live ? '2px solid var(--ok)' : undefined }} />
            <i className="ex" style={{ height: `${b.web / max * 100}%` }} />
            <span>{b.d.slice(8)}</span></div>)}
        </div>
        {showEx && <p className="mute" style={{ fontSize: 12 }}>Example data shown in grey tones until real beta data replaces it. Days with live orders are outlined in green.</p>}
      </section>

      <div className="split">
        <section className="card">
          <h3>Sales by AI surface</h3>
          {hosts.length ? hosts.map(h => <div className="meter" key={h.h}><div className="t"><span>{h.h}</span><span className="num">{eur(h.v)}</span></div><div className="b"><i style={{ width: `${h.v / hmax * 100}%` }} /></div></div>) : <p className="mute">No AI-chat orders for this store yet.</p>}
        </section>
        <section className="card">
          <h3>Beta stores vs control</h3>
          <p className="mute" style={{ fontSize: 13.5 }}>During the beta, half of eligible stores get Chatout and half don’t. The difference in sales is the proof each store sees.</p>
          <div className="meter"><div className="t"><span>Beta stores, orders per 1,000 visits</span><b className="num">{showEx ? '41' : '—'}</b></div><div className="b"><i style={{ width: showEx ? '82%' : '0' }} /></div></div>
          <div className="meter"><div className="t"><span>Control stores</span><b className="num">{showEx ? '29' : '—'}</b></div><div className="b"><i style={{ width: showEx ? '58%' : '0' }} /></div></div>
          <span className="chip warn"><i />Example figures, not measured</span>
        </section>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3>Orders</h3>
        <div className="tbl"><table>
          <thead><tr><th>When</th><th>Order</th><th>Source</th><th>Stores</th><th>Total</th><th>Captures</th></tr></thead>
          <tbody>
            {scoped.slice(0, 40).map(o => (
              <tr key={o.id}>
                <td className="num">{new Date(o.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td><span className={`chip ${o.seed ? '' : o.mode === 'sandbox' ? 'ok' : 'warn'}`}><i />{o.seed ? 'example' : o.mode}</span><br /><span className="mono" style={{ fontSize: 11.5 }}>{o.seed ? '' : o.paypalOrderId}</span></td>
                <td>{o.channel === 'web' ? 'Website' : o.host}</td>
                <td>{o.stores.map(s => <div key={s.id}>{s.name} <span className="mute">{eur(s.amount)}{s.integration === 'agent' ? ' · agent' : ''}</span></div>)}</td>
                <td className="num">{eur(amountOf(o))}</td>
                <td className="mono" style={{ fontSize: 11.5 }}>{o.captures.map(c => <div key={c.id}>{c.id}</div>)}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}
