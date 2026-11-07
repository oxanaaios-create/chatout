'use client';
import { useEffect, useRef, useState } from 'react';
import { Line, OrderRec, eur, groupCart, saveLocal } from './types';
import { useConfig } from './useConfig';
import { loadPayPal } from './paypalSdk';

type Props = { lines: Line[]; host: string; engine: string; onClose: () => void; onPaid: (rec: OrderRec) => void; standalone?: boolean };

const DEMO_BALANCE = 230.4;

export default function Checkout({ lines, host, engine, onClose, onPaid, standalone }: Props) {
  const cfg = useConfig();
  const { groups, total } = groupCart(lines);
  const [step, setStep] = useState<'review' | 'confirm' | 'done'>('review');
  const [fund, setFund] = useState('bal');
  const [err, setErr] = useState<string | null>(null);
  const [rec, setRec] = useState<OrderRec | null>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const payload = { items: lines.map(l => ({ id: l.p.id, option: l.option, qty: l.qty })), host, engine };

  async function capture(orderId: string) {
    const r = await fetch(`/api/orders/${orderId}/capture`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Capture failed');
    saveLocal(j); setRec(j); setStep('done');
  }

  useEffect(() => {
    if (!cfg || cfg.mode !== 'sandbox' || step !== 'review' || !btnRef.current) return;
    let buttons: any; let dead = false;
    loadPayPal(cfg.clientId!, cfg.payees).then(paypal => {
      if (dead || !btnRef.current) return;
      buttons = paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 48 },
        createOrder: async () => {
          setErr(null);
          const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const j = await r.json();
          if (!r.ok) { setErr(j.error); throw new Error(j.error); }
          return j.id;
        },
        onApprove: async (data: { orderID: string }) => { try { await capture(data.orderID); } catch (e) { setErr((e as Error).message); } },
        onCancel: () => setErr('Payment cancelled. Your cart is still here.'),
        onError: (e: unknown) => setErr(String((e as Error)?.message || e))
      });
      buttons.render(btnRef.current);
    }).catch(e => setErr(e.message));
    return () => { dead = true; try { buttons?.close(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg, step]);

  async function demoPay() {
    setErr(null); setStep('confirm');
    try {
      await new Promise(r => setTimeout(r, 1200));
      const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      await capture(j.id);
    } catch (e) { setErr((e as Error).message); setStep('review'); }
  }

  const close = () => (rec ? onPaid(rec) : onClose());
  const fundLine = fund === 'bal' ? (DEMO_BALANCE >= total ? `${eur(total)} from PayPal balance` : `${eur(DEMO_BALANCE)} balance + ${eur(total - DEMO_BALANCE)} from Visa ••4417`) : fund === 'card' ? 'Visa ••4417 via PayPal' : fund === 'bank' ? 'Bank ••0921 via PayPal' : 'PayPal Business account';

  const body = (
    <div className="sheet" role="dialog" aria-modal="true" aria-label="Checkout" onClick={e => e.stopPropagation()}>
      <div className="sheet-top"><h3>{step === 'done' ? 'Paid' : 'Checkout'}</h3>{!standalone || step === 'done' ? <button className="x" onClick={close} aria-label="Close">✕</button> : null}</div>

      {step === 'review' && <>
        {groups.map(g => (
          <div className="group" key={g.id}>
            <div className="line sm"><span>{g.name}</span><span>{g.shipping ? `Shipping ${eur(g.shipping)}` : g.items.every(l => l.p.digital) ? 'E-ticket' : 'Free shipping'}</span></div>
            {g.items.map(l => <div className="line" key={l.p.id}><span>{l.p.name} · {l.option}{l.qty > 1 ? ` ×${l.qty}` : ''}</span><span className="num">{eur(l.p.price * l.qty)}</span></div>)}
          </div>
        ))}
        <div className="line" style={{ fontWeight: 600, fontSize: 16 }}><span>Total · {groups.length} store{groups.length > 1 ? 's' : ''}</span><span className="num">{eur(total)}</span></div>
        <p className="mute" style={{ fontSize: 12.5 }}>One PayPal order{cfg?.multiPayee ? `, ${groups.length} payees: each store is paid directly` : ''}. Delivery address comes from your PayPal account.</p>

        {cfg?.mode === 'sandbox' ? <>
          <div ref={btnRef} />
          <p className="mute" style={{ fontSize: 12 }}>PayPal sandbox. Log in with a sandbox personal account. No real money moves.</p>
        </> : <>
          <div className="fund" role="radiogroup" aria-label="Pay with">
            {[['bal', 'PP', '#0B2A5B', 'PayPal balance', `${eur(DEMO_BALANCE)} available · example`], ['card', 'VISA', '#1A1F71', 'Visa ••4417', 'Backup card in PayPal'], ['bank', 'BANK', '#2E7D5B', 'Bank ••0921', 'Linked in PayPal'], ['biz', 'BIZ', '#444', 'PayPal Business', 'Receipt with company name']].map(([v, t, c, n, s]) => (
              <label key={v}><input type="radio" name="fund" value={v} checked={fund === v} onChange={() => setFund(v)} /><span className="tag" style={{ background: c }}>{t}</span><span>{n}<small>{s}</small></span></label>
            ))}
          </div>
          <button className="ppbtn" onClick={demoPay}>Pay {eur(total)} with <i>PayPal</i></button>
          <p className="mute" style={{ fontSize: 12 }}>Demo mode: add PayPal sandbox keys to run real sandbox payments. {fundLine}.</p>
        </>}
      </>}

      {step === 'confirm' && <div className="face"><div className="ring">🙂</div><b>Confirm with Face ID</b><span className="mute" style={{ fontSize: 13 }}>{eur(total)} to {groups.length} store{groups.length > 1 ? 's' : ''}</span></div>}

      {step === 'done' && rec && <>
        <div className="okc">✓</div>
        <h2 className="num">{eur(rec.total)}</h2>
        <p className="mute" style={{ fontSize: 13 }}>{rec.mode === 'sandbox' ? `PayPal sandbox order ${rec.paypalOrderId}` : `Demo order ${rec.paypalOrderId}`} · {rec.status}</p>
        <div className="widget"><div className="receipt">
          {rec.stores.map(s => {
            const cap = rec.captures.find(c => c.unit === s.id) || rec.captures[0];
            return <div className="r" key={s.id}><b>{s.name}</b><span className="num">{eur(s.amount)}</span>
              <small>{s.integration === 'agent' ? 'No store integration: agent places the order on the store site' : 'Order sent to the store system by webhook'}{cap ? ` · capture ${cap.id}` : ''}</small>
              <div className="prog" style={{ gridColumn: '1/-1' }}><i /></div></div>;
          })}
        </div></div>
        <button className="ppbtn alt" onClick={close}>{standalone ? 'Done' : 'Back to chat'}</button>
      </>}

      {err && <div className="err">{err}</div>}
    </div>
  );
  if (standalone) return body;
  return <div className="scrim" onClick={close}>{body}</div>;
}
