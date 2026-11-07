'use client';
import { useEffect, useState } from 'react';

export default function Connect() {
  const [tab, setTab] = useState(1);
  const [origin, setOrigin] = useState('https://your-chatout-host');
  const [body, setBody] = useState<string>('');
  const [copied, setCopied] = useState('');
  useEffect(() => {
    setOrigin(location.origin);
    fetch('/api/orders/preview').then(r => r.json()).then(j => setBody(JSON.stringify(j.body, null, 2))).catch(() => {});
  }, []);
  const embed = `<!-- Paste before </body> on your product page -->\n<script src="${origin}/embed.js" async></script>\n\n<!-- Where the PayPal button should appear -->\n<chatout-pay sku="NL-TEE-BLK" option="M"></chatout-pay>`;
  const copy = (k: string, t: string) => navigator.clipboard?.writeText(t).then(() => setCopied(k), () => setCopied(''));
  return (
    <div className="wrap">
      <header style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="eyebrow">For businesses</span>
        <h1>Connect a store in one step.</h1>
        <p className="mute" style={{ maxWidth: '62ch' }}>Three ways in, from no code to the full API. Every path ends with orders and money in PayPal Business, marked with the AI surface that sold.</p>
      </header>
      <div className="tabs" role="tablist">
        {['Store Sync', 'Embed script', 'Orders API'].map((t, i) => <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{t}</button>)}
      </div>
      {tab === 0 && <div className="steps">
        <div className="step"><b>Check your platform</b><p>PayPal Store Sync partners include Wix, BigCommerce, Feedonomics, Cymbio, Shopware and Logicbroker.</p><span className="acc">Done when: your store platform is on the list.</span></div>
        <div className="step"><b>Turn on Store Sync in PayPal</b><p>Your catalog, stock and fulfilment connect once. Chatout reads the synced catalog, so products appear in chats with no new work.</p><span className="acc">Done when: products show as synced.</span></div>
        <div className="step"><b>Accept the beta invite</b><p>1,000 verified stores, under NDA, with a control group to prove the lift.</p><span className="acc">Done when: a test prompt shows your product card.</span></div>
      </div>}
      {tab === 1 && <>
        <p className="mute">Works on any site, in any builder, even inside a contact form. The button opens a PayPal checkout; the products on the page become available to AI chats.</p>
        <div className="code"><button className="pill sm copy" onClick={() => copy('e', embed)}>{copied === 'e' ? 'Copied' : 'Copy'}</button><pre>{embed}</pre></div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><a className="pill light" href="/demo-store.html" target="_blank" rel="noopener">Open the demo store page</a></div>
        <div className="steps">
          <div className="step"><b>Paste the script</b><p>One tag before the closing body tag, then a chatout-pay element where the button goes.</p><span className="acc">Done when: the PayPal button renders with the product price.</span></div>
          <div className="step"><b>Verify your domain</b><p>Required for the beta. Blocks fake stores.</p><span className="acc">Done when: the domain shows as verified.</span></div>
        </div>
      </>}
      {tab === 2 && <>
        <p className="mute">The exact Orders v2 body Chatout sends for a two-store cart. In multi-payee mode each store is its own purchase unit with its own payee.</p>
        <div className="code"><button className="pill sm copy" onClick={() => copy('a', `POST /v2/checkout/orders\n${body}`)}>{copied === 'a' ? 'Copied' : 'Copy'}</button><pre>{`POST /v2/checkout/orders\n${body || 'Loading…'}`}</pre></div>
        <div className="steps"><div className="step"><b>Listen for webhooks</b><p>PAYMENT.CAPTURE.COMPLETED creates the order in your system. Stores without a system are handled by the checkout agent.</p><span className="acc">Done when: a sandbox capture creates an order automatically.</span></div></div>
      </>}
    </div>
  );
}
