// Verifies sandbox keys by requesting an access token and creating a draft order. Usage: npm run check:paypal
import { readFileSync, existsSync } from 'node:fs';
if (existsSync('.env.local')) for (const l of readFileSync('.env.local', 'utf8').split('\n')) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
const { PAYPAL_CLIENT_ID: id, PAYPAL_CLIENT_SECRET: sec } = process.env;
if (!id || !sec) { console.log('No sandbox keys set. The app runs in demo mode.'); process.exit(0); }
const base = 'https://api-m.sandbox.paypal.com';
const t = await fetch(`${base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(`${id}:${sec}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
if (!t.ok) { console.error('Auth failed', t.status); process.exit(1); }
const { access_token } = await t.json();
const o = await fetch(`${base}/v2/checkout/orders`, { method: 'POST', headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'EUR', value: '1.00' } }] }) });
const j = await o.json();
console.log(o.ok ? `Sandbox OK. Draft order ${j.id} (${j.status}).` : `Order failed: ${JSON.stringify(j).slice(0, 300)}`);
