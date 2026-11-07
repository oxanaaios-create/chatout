# Chatout

**PayPal checkout that lives inside the AI conversation.**
Ask an assistant for tickets and the tour tee. The answer is the store: product cards from several shops, one cart, one PayPal approval. Stores without an integration are handled by a checkout agent. Every order shows up on the merchant dashboard with the AI surface that sold it.

Built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/) by Artem Pichuhin, product designer.
Concept canvas (problem, market, 8 personas, flows, chat mockups, beta plan): see the project page on Devpost.

## What is different

| PayPal in AI chats today | Chatout |
|---|---|
| One merchant per checkout | One cart across stores, one PayPal approval |
| Pay with the wallet | Balance first, backup card covers the rest |
| Search-style assistants | Social surfaces too: the host label is tracked per order |
| Integrated merchants only | Embed script for any site, agent checkout for stores with no integration |
| Sales appear as card payments | Merchant dashboard shows the AI channel and a beta vs control comparison |

## Run it

```bash
cd app
npm install
cp .env.example .env.local   # optional: add PayPal sandbox keys and a Gemini key
npm run dev                  # http://localhost:3000
```

Without keys the app runs in **demo mode**: the full flow works, payments are simulated and marked as demo.

With `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` from a sandbox app ([developer.paypal.com](https://developer.paypal.com) > Apps & Credentials > Sandbox), checkout uses the real PayPal JS SDK and Orders v2 in the sandbox. Log in with a sandbox personal account. `npm run check:paypal` verifies the keys.

With `GEMINI_API_KEY` (free at aistudio.google.com) the agent is Gemini with a `show_products` tool call. Without it a rule-based agent answers, so the demo never breaks.

## Try this

1. On **Chat**, tap “Nova Lane added a Kraków date”.
2. Add the standing ticket (Tour Tickets EU) and open the tour tee (Nova Lane Store), pick size M, add it.
3. **Checkout**: one total for two stores, then pay with PayPal.
4. The receipt shows one capture per store. Nova Lane Store has no integration, so the agent places its order.
5. Open **Merchant**: the order is there with its source.
6. Open **Connect** > Embed script > “Open the demo store page”: a plain HTML page gets a working PayPal checkout from one script tag.

## How it uses PayPal

- **Orders v2**: server-side create and capture. Prices are always recomputed from the catalog on the server; the client only sends product ids and options.
- **One order per cart.** In multi-payee mode (`MULTI_PAYEE=1` plus a sandbox payee email per store) each store is its own purchase unit with its own `payee`, so stores are paid directly. This needs PayPal multi-seller access. In the default mode the cart is one purchase unit to the sandbox app owner, with items and a per-store breakdown in `custom_id`.
- **PayPal JS SDK** buttons for approval, with `merchant-id=*` when several payees are configured.
- Idempotency: `PayPal-Request-Id` on create and capture, so retries never double-charge.

## How it uses AI

- **Agent with tools** (`src/lib/agent.ts`): Gemini reads the conversation and the catalog, answers in two sentences and calls `show_products` with catalog ids. It cannot invent products or prices: unknown ids are dropped.
- **Rule fallback**: the same contract without a model, so the demo runs offline.
- **Checkout agent** for stores with no integration: shown in the receipt flow; the production version completes the store’s own checkout with the approved payment.

## Structure

The product lives in `app/`. The concept canvas is `concept/chatout-canvas.html`. Project process (plan, decisions, devlog) lives in `docs/`.

```
app/src/app/page.tsx              chat, product sheet, cart, checkout entry
app/src/components/Checkout.tsx   checkout sheet: PayPal SDK (sandbox) or demo flow
app/src/app/merchant/page.tsx     merchant dashboard
app/src/app/connect/page.tsx      Store Sync, embed script, Orders API body
app/src/app/pay/page.tsx          standalone checkout opened by the embed
app/src/app/api/*                 chat, catalog, config, orders, capture, stats
app/src/lib/paypal.ts             OAuth, Orders v2 body, create, capture
app/src/lib/agent.ts              Gemini tool call + rule agent
app/src/lib/catalog.ts            demo stores and products (fictional)
app/public/embed.js               <chatout-pay> web component
app/public/demo-store.html        plain HTML store using the embed
```

## Honest limits of this prototype

- Demo stores and products are fictional; product images are drawn in code.
- The order log is in memory on the server and in the browser’s local storage.
- Saved wallet (vault) for returning buyers, the MCP server for real AI hosts and the agent checkout are designed in the concept and listed as next steps.

## Licence

MIT. Built with Next.js 16.4, React 19.3, TypeScript 5.9.
