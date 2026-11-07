/* ================= PAGES ================= */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const srcLine = (...keys) => `<p class="src">Sources: ${keys.map(k => `<a href="${SRC[k].u}" target="_blank" rel="noopener">${esc(SRC[k].t)}</a>`).join(' · ')}</p>`;
const chip = (t, cls='') => `<span class="chip ${cls}"><span class="dot"></span>${t}</span>`;
const head = (eyebrow, title, lede) => `<header class="head"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}</header>`;
const head2 = (eyebrow, title, lede) => `<header class="head"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}</header>`;
const fmt = n => n >= 1e9 ? (n/1e9).toFixed(n%1e9?1:0)+'B' : n >= 1e6 ? Math.round(n/1e6)+'M' : n >= 1e3 ? Math.round(n/1e3)+'K' : String(n);

const R = {};

R.start = () => `
<section class="cover">
  <div class="head">
    <span class="eyebrow">PayPal AI Hackathon · concept and prototype</span>
    <h1>Pay with PayPal, right inside the conversation.</h1>
    <p class="lede">Chatout turns an AI answer into a store. The catalog, the cart and the PayPal checkout live in the message, so people buy with the money already in their PayPal account and never leave the chat.</p>
    <div class="row"><a class="pill light" href="#surfaces">See it in the chats</a><a class="pill" href="#problem">Start with the problem</a></div>
  </div>
  <div class="panel">
    <span class="eyebrow" style="color:var(--on-light-2)">The bet, in one line</span>
    <p style="font:400 22px/1.3 var(--display);color:var(--on-light);letter-spacing:-.01em">AI chats and social feeds are where people decide what to buy. If PayPal sits next to the card in that moment, PayPal balances start moving again.</p>
    <p class="mono" style="font-size:12px">440M PayPal accounts · ~1B Meta AI users · 900M weekly ChatGPT users</p>
  </div>
</section>
<section class="sec">
  <span class="eyebrow">Chapters</span>
  <div class="chapters">
    ${GROUPS.map(g => {const ps = PAGES.filter(p => p.g === g.id); return `<a href="#${ps[0].id === 'start' ? ps[1].id : ps[0].id}"><span class="eyebrow">${g.name} · ${ps.length}</span><b>${ps.filter(p=>p.id!=='start').slice(0,3).map(p=>p.t).join(', ')}</b><span>${ps.length>3?'and '+(ps.length-3)+' more':'&nbsp;'}</span></a>`;}).join('')}
  </div>
</section>
<p class="src">Concept by Artem Pichuhin. Interface mockups are concepts for integration and are not affiliated with or endorsed by PayPal, OpenAI, xAI, Google or Meta. Numbers carry their sources on each page.</p>`;

R.session = () => `
${head('Story · 01','From our session','Artem talked the idea through in one long voice note. This page keeps his words as the source and shows what each one became. Everything after this page builds on these lines.')}
<div class="tabs" role="tablist" id="sesTabs"><button role="tab" data-s="said" aria-selected="true">What Artem said</button><button role="tab" data-s="checked" aria-selected="false">What I checked</button></div>
<div id="sesSaid"><div class="list">
 ${[
  ['“People keep a lot of money in PayPal and can’t spend it as freely as a card.”','Core user problem. Balance first, card as backup, the way Apple Pay picks a card.'],
  ['“Convert the traffic in AI and social networks through PayPal.”','North star. Every AI or social answer that shows a product can close the sale with PayPal.'],
  ['“The layout right in the chat, like a decent website. No going to links.”','Catalog cards, product sheet with gallery and sizes, similar items, cart, all inside the message.'],
  ['“Tickets and merch in one message, one cart.”','Multi-merchant cart paid in one PayPal approval, one purchase unit per merchant.'],
  ['“You don’t need to log in again. That’s the main thing.”','Saved PayPal wallet for the assistant, confirmed with Face ID or a passkey.'],
  ['“The agent opens the site and places the order.”','Fallback for merchants without an integration. The agent completes their checkout after PayPal approves.'],
  ['“Business just puts the PayPal button on its store.”','Three ways in: Store Sync switch, one embed script, or the Orders API.'],
  ['“Beta for 1,000 businesses, under NDA, we must show growth.”','Staged beta 1 → 10 → 100 → 1,000 with a control group, so the growth is provable.'],
  ['“5 things to do now. You can’t skip it, but you can.”','Proactive card, opt-in, tap first, small close button, at most once a day.'],
  ['“I’d test 3 cents, you decide the right price.”','Fee experiment with three cohorts. PayPal sets the final price from the data.']
 ].map(([a,b]) => `<div><h4>${esc(a)}</h4><span></span><p>${esc(b)}</p></div>`).join('')}
</div>
</div>
<section class="sec" id="sesChecked" hidden>
 <div class="grid two">
  <div class="card">${chip('Corrected','warn')}<h4>PayPal is already in some AI chats</h4><p>Copilot Checkout runs on PayPal since January 2026. Perplexity offers PayPal and Venmo to US Pro users. ChatGPT support was announced for 2026. Chatout has to win on what those deals don’t cover.</p></div>
  <div class="card">${chip('Corrected','warn')}<h4>Elon Musk does not run PayPal</h4><p>He co-founded it and left in 2002. PayPal’s CEO in Q3 2026 is Enrique Lores. Musk’s X runs its own wallet, X Money, so Grok is a harder partner than Meta AI.</p></div>
  <div class="card">${chip('Kept','ok')}<h4>Meta AI is the biggest open door</h4><p>Around one billion monthly users across WhatsApp, Instagram and Messenger, and no PayPal checkout announced there. That matches Artem’s focus on social traffic.</p></div>
  <div class="card">${chip('Kept','ok')}<h4>Claude is possible too</h4><p>Artem assumed Claude was out. One MCP server with interactive UI can serve ChatGPT and Claude from the same code. See Two game changers.</p></div>
 </div>
 ${srcLine('ab','zk','tc','sec','xm','pr')}
</section>`;

R.problem = () => `
${head('Story · 02','Three sides lose the same sale','Discovery moved into AI chats and social feeds. Checkout stayed on websites, where the card form is the default. Buyers, merchants and PayPal each pay for that gap.')}
<div class="grid">
 <div class="card"><span class="eyebrow">Buyer</span><h3>Money in PayPal is harder to spend</h3><p>The PayPal button hides under “more payment options”, or the shop takes cards only. Leaving the chat means tabs, account walls, re-typing the address and logging into PayPal again.</p></div>
 <div class="card"><span class="eyebrow">Merchant</span><h3>AI traffic arrives as a link, then leaves</h3><p>An AI recommends the shop, the buyer lands on a mobile site and drops at the form. The merchant can’t see the AI channel at all, and each AI platform asks for its own integration.</p></div>
 <div class="card"><span class="eyebrow">PayPal</span><h3>Branded checkout is slowing</h3><p>Branded checkout is about 29% of PayPal’s volume and its growth slowed from 6% to 5% in late 2025. Every new AI platform is a separate deal, and the largest social AI has no PayPal checkout yet.</p></div>
</div>
<section class="sec">
 <h3>What a buyer goes through today</h3>
 <div class="delta">
  <div><b class="num">9</b><span>steps for Lina to buy a ticket and a tee</span></div>
  <div><b class="num">3</b><span>websites opened</span></div>
  <div><b class="num">2</b><span>logins, including PayPal itself</span></div>
  <div><b class="num">5</b><span>steps with Chatout</span></div>
 </div>
 <p class="src">Counted from the persona flows on the Personas page.</p>
</section>
<div class="note">${chip('Solution','ok')}<span>Put the PayPal checkout where the decision happens: a catalog card inside the AI answer, one cart across stores, and a saved PayPal wallet that confirms with Face ID. Merchants switch it on once and see the channel in their PayPal Business dashboard.</span></div>
${srcLine('ab')}`;

R.market = () => `
${head('Market · 03','The market in numbers','Two audiences meet here: PayPal’s 440 million accounts and the billion-plus people who now ask AI what to buy.')}
<div class="grid">
 <div class="card stat"><b class="num">440M</b><span>PayPal active accounts, Q3 2026</span></div>
 <div class="card stat"><b class="num">$487.1B</b><span>PayPal total payment volume in Q3 2026, up 6%</span></div>
 <div class="card stat"><b class="num">6.8B</b><span>payment transactions in the quarter, up 7%</span></div>
 <div class="card stat"><b class="num">~29%</b><span>of PayPal volume is branded checkout, the part Chatout grows</span></div>
</div>
${srcLine('sec','ab')}
<section class="sec">
 <h3>Where people ask what to buy</h3>
 <div class="tbl"><table style="min-width:560px">
  <thead><tr><th>Assistant</th><th>Users</th><th>Measure</th><th>PayPal checkout today</th></tr></thead>
  <tbody>
   <tr><td>Meta AI</td><td class="num">~1B</td><td>monthly, across WhatsApp, Instagram, Messenger</td><td>${chip('None found','bad')}</td></tr>
   <tr><td>ChatGPT</td><td class="num">900M</td><td>weekly, Feb 2026</td><td>${chip('Announced for 2026','warn')}</td></tr>
   <tr><td>Gemini</td><td class="num">~400M</td><td>monthly, consumer and Workspace</td><td>${chip('None found','bad')}</td></tr>
   <tr><td>Microsoft Copilot</td><td class="num">218–420M</td><td>monthly, depends on surfaces counted</td><td>${chip('Live since Jan 2026','ok')}</td></tr>
   <tr><td>Grok</td><td class="num">20–35M</td><td>monthly</td><td>${chip('X Money competes','bad')}</td></tr>
   <tr><td>Perplexity</td><td class="num">~22M</td><td>monthly</td><td>${chip('Live, US Pro','ok')}</td></tr>
  </tbody></table></div>
 ${srcLine('pr','ab','zk','tc','xm')}
</section>
<section class="sec">
 <h3>Shoppers are ready to let AI help</h3>
 <div class="delta">
  <div><b class="num">$261B</b><span>US online shopping expected to come from AI agents (Worldpay)</span></div>
  <div><b class="num">44%</b><span>of US shoppers would let an AI assistant browse for them</span></div>
  <div><b class="num">59%</b><span>of shoppers aged 18–34 would</span></div>
 </div>
 ${srcLine('ab')}
</section>
<section class="sec">
 <h3>Reach estimate, Artem’s method</h3>
 <p class="prose">Take an assistant’s audience, the share who already have PayPal, and the share who keep money there. The two shares are assumptions to replace with PayPal’s own data.</p>
 <div class="card calc" id="calc">
  <div class="field"><label for="cPlat">Assistant</label><select class="inp" id="cPlat"><option value="1000000000">Meta AI · ~1B</option><option value="900000000">ChatGPT · 900M</option><option value="400000000">Gemini · ~400M</option><option value="218000000">Copilot · 218M</option><option value="20000000">Grok · 20M</option></select></div>
  <div class="field"><label for="cPP">Have a PayPal account · <output id="oPP">10%</output></label><input id="cPP" type="range" min="1" max="40" value="10"></div>
  <div class="field"><label for="cBal">Keep a balance · <output id="oBal">30%</output></label><input id="cBal" type="range" min="5" max="80" value="30"></div>
  <div class="field"><label>People who can pay from balance</label><output id="oRes" class="num" style="font-size:40px">30M</output><span class="src">Assumptions: account share is a placeholder, 30% balance share is Artem’s estimate.</span></div>
 </div>
</section>`;

R.landscape = () => `
${head('Market · 04','What already exists','PayPal has moved fast on agentic commerce, through one partner at a time. Chatout fills the gaps those deals leave and gives every host the same checkout.')}
<div class="tbl"><table>
 <thead><tr><th>Surface</th><th>Status</th><th>What it does</th><th>Gap Chatout fills</th></tr></thead>
 <tbody>
  <tr><td>Microsoft Copilot</td><td>${chip('Live','ok')}</td><td>Copilot Checkout: browse, choose and pay with PayPal inside Copilot, since Jan 2026.</td><td>One host only</td></tr>
  <tr><td>Perplexity</td><td>${chip('Live, US','ok')}</td><td>Instant checkout with PayPal or Venmo for US Pro users.</td><td>Pro tier, US only</td></tr>
  <tr><td>ChatGPT</td><td>${chip('Announced','warn')}</td><td>PayPal wallet in Instant Checkout via the Agentic Commerce Protocol, targeted for 2026.</td><td>Multi-store cart, balance-first funding</td></tr>
  <tr><td>Store Sync</td><td>${chip('Live','ok')}</td><td>Connects a merchant catalog, inventory and fulfilment to AI discovery. Partners: Wix, Cymbio, BigCommerce, Feedonomics, Shopware, Logicbroker.</td><td>Use it as Chatout’s catalog source</td></tr>
  <tr><td>Agent Ready</td><td>${chip('Early 2026','warn')}</td><td>Lets existing PayPal merchants accept payments started by AI agents.</td><td>Use it for merchant acceptance</td></tr>
  <tr><td>Meta AI</td><td>${chip('None found','bad')}</td><td>No PayPal checkout announced in Instagram, WhatsApp or Messenger AI.</td><td>Biggest open audience, social traffic</td></tr>
  <tr><td>Grok on X</td><td>${chip('Competing wallet','bad')}</td><td>X Money in limited US beta since June 2026, with a Visa debit card and Grok inside.</td><td>Harder partner, keep for later</td></tr>
  <tr><td>Gemini</td><td>${chip('None found','bad')}</td><td>No direct PayPal checkout partnership found.</td><td>Local shopping, delivery address</td></tr>
 </tbody></table></div>
${srcLine('ab','zk','rs','dc','xm')}
<section class="sec">
 <h3>Where Chatout is different</h3>
 <div class="grid two">
  <div class="card"><h4>One cart, many stores</h4><p>A ticket and a tee from two merchants paid in one PayPal approval. Today’s integrations check out one merchant at a time.</p></div>
  <div class="card"><h4>Balance first, card as backup</h4><p>The checkout spends the PayPal balance first and fills the rest from a chosen card or bank, like Apple Pay’s card order.</p></div>
  <div class="card"><h4>Social traffic, not only search</h4><p>Meta AI and X are where people see products in posts. Chatout starts there, where PayPal has no checkout yet.</p></div>
  <div class="card"><h4>Proof for the merchant</h4><p>The AI channel shows up in the PayPal Business dashboard with a control group, so growth is measured, not claimed.</p></div>
 </div>
</section>`;

R.audience = () => `
${head('Market · 05','Audience, 16 to 55','Five age bands, one shared expectation: buy from the answer, pay with what’s already in the wallet. The beta runs 18–55, because a PayPal account requires its holder to be 18.')}
<div class="tbl"><table>
 <thead><tr><th>Age</th><th>Context</th><th>Buys in chat</th><th>Typical prompt</th><th>Expects</th><th>PayPal angle</th></tr></thead>
 <tbody>
  <tr><td>16–17</td><td>School, first part-time income</td><td>Tickets, games, merch, sneakers</td><td>“Cheapest ticket for this show”</td><td>Speed, no card needed</td><td>Not in beta. Reachable later only through accounts a parent manages.</td></tr>
  <tr><td>18–24</td><td>Students, first jobs, resale income</td><td>Tickets, fashion, food, accessories</td><td>“Find a cheaper version of this”</td><td>One tap, no forms</td><td>Balance from resale and gigs, often no credit card</td></tr>
  <tr><td>25–34</td><td>Freelancers, young professionals</td><td>Gear, software, travel, home</td><td>“Compare these three under €400”</td><td>Comparison in one place, buyer protection</td><td>Client payments arrive in PayPal</td></tr>
  <tr><td>35–44</td><td>Parents, homeowners</td><td>Food, groceries, DIY, kids</td><td>“Nearest store with this in stock”</td><td>Nearest store, delivery time, saved address</td><td>PayPal as safe default, card behind it</td></tr>
  <tr><td>45–55</td><td>Owners, managers, established buyers</td><td>Hobby gear, gifts, business supplies</td><td>“Reorder what I bought in March”</td><td>Trust, receipts, invoices</td><td>Pay from a Business account</td></tr>
 </tbody></table></div>
<section class="sec">
 <h3>What every band expects today and doesn’t get</h3>
 <div class="grid">
  <div class="card"><h4>No tab hopping</h4><p>Today: open several sites to compare one product. Expected: the comparison inside the answer.</p></div>
  <div class="card"><h4>No second login</h4><p>Today: log into the shop, then into PayPal. Expected: the wallet already connected to the assistant.</p></div>
  <div class="card"><h4>Nearest, not loudest</h4><p>Today: the best-ranked store wins. Expected: the closest store with stock, from the delivery address.</p></div>
  <div class="card"><h4>Know what you pay for</h4><p>Today: totals appear at the last step. Expected: each payment explained per store before Face ID.</p></div>
 </div>
</section>`;

R.personas = () => `
${head('Market · 06','Eight people, eight flows','Each persona has a flow today and with Chatout, drawn as nodes. Tap a card to open the flow.')}
<div class="grid">
 ${PERSONAS.map(p => `<a class="card" href="#persona-${p.key}">
   <div class="p-head"><span class="avatar" style="background:${p.color}">${p.name[0]}</span><div><h4>${p.name}, ${p.age}</h4><small>${esc(p.role)} · ${p.city}</small></div></div>
   <p>${esc(p.quote)}</p>
   <div class="foot"><span>${p.now.length} → ${p.ideal.length} steps</span><span>${esc(p.hostName)} →</span></div>
 </a>`).join('')}
</div>`;

R.persona = (p) => {
  const cnt = (arr, k) => arr.filter(n => n.k === k).length;
  const pains = p.now.filter(n => n.p).length;
  const hostLink = ['gpt','grok','meta','gem'].includes(p.host) ? `<a class="pill sm" href="#surfaces" data-host="${p.host}">Open the ${esc(p.hostName)} mockup</a>` : '';
  return `
<header class="head">
 <span class="eyebrow">Persona · ${PERSONAS.indexOf(p)+1} of ${PERSONAS.length}</span>
 <div class="p-head"><span class="avatar" style="background:${p.color};width:56px;height:56px;font-size:22px">${p.name[0]}</span><div><h2>${p.name}, ${p.age}</h2><small>${esc(p.role)} · ${p.city}</small></div></div>
 <p class="quote">“${esc(p.quote)}”</p>
</header>
${p.phase ? `<div class="note">${chip('Later','warn')}<span>${esc(p.phase)}</span></div>` : ''}
<dl class="kv">
 <dt>Money</dt><dd>${esc(p.money)}</dd>
 <dt>Asks</dt><dd>${esc(p.prompt)}</dd>
 <dt>Buys</dt><dd>${esc(p.buys)}</dd>
 <dt>Where</dt><dd>${esc(p.hostName)}</dd>
</dl>
<section class="sec">
 <div class="row" style="justify-content:space-between"><h3>Flow, today and with Chatout</h3><div class="legend"><span><i style="background:#EE8A78"></i>Pain point</span><span><i style="background:#5FD3A6"></i>Chatout step</span></div></div>
 <div class="diagram">${flowSVG(p)}</div>
</section>
<div class="delta">
 <div><b class="num">${p.now.length} → ${p.ideal.length}</b><span>steps</span></div>
 <div><b class="num">${cnt(p.now,'site')} → ${cnt(p.ideal,'site')}</b><span>websites opened</span></div>
 <div><b class="num">${cnt(p.now,'login')+cnt(p.now,'form')} → ${cnt(p.ideal,'login')+cnt(p.ideal,'form')}</b><span>logins and forms</span></div>
 <div><b class="num">${pains} → 0</b><span>pain points</span></div>
</div>
<div class="note">${chip('Outcome','ok')}<span>${esc(p.win)}</span></div>
${hostLink ? `<div class="row">${hostLink}</div>` : ''}`;
};

R.concept = () => `
${head('Product · 07','The concept','Chatout is a layer between AI hosts, merchants and PayPal. It answers with products, holds a cart across stores and closes the sale with one PayPal approval.')}
<div class="grid two">
 <div class="card"><span class="eyebrow">1 · Catalog in the message</span><h3>The answer is the store</h3><p>Product cards with photos, price and store, a product sheet with gallery and sizes, and similar items underneath. It reads like a good shop page, inside the chat.</p></div>
 <div class="card"><span class="eyebrow">2 · One cart, many stores</span><h3>Ticket and tee together</h3><p>Items from different merchants share one cart. PayPal receives one order with a purchase unit per merchant, so each store gets paid and ships its own part.</p></div>
 <div class="card"><span class="eyebrow">3 · Pay with what you have</span><h3>Balance first, card behind it</h3><p>PayPal balance by default. If it’s short, the backup card or bank covers the rest. A Business account is one tap away. Face ID or a passkey confirms. No second login.</p></div>
 <div class="card"><span class="eyebrow">4 · Proof for the business</span><h3>The channel shows up</h3><p>Orders land in PayPal Business with the source “AI chat” and the host name. During the beta a control group shows the lift.</p></div>
</div>
<section class="sec">
 <h3>The moment that starts it</h3>
 <div class="panel"><span class="eyebrow" style="color:var(--on-light-2)">In-chat invitation, beta users only</span><p style="font:400 24px/1.25 var(--display);color:var(--on-light);letter-spacing:-.01em">Your PayPal now works here. Buy from any answer and pay with your balance. Connect once, confirm with Face ID.</p><div class="row"><span class="pill sm" style="background:var(--on-light);color:var(--panel-light)">Connect PayPal</span><span class="pill sm" style="background:transparent;color:var(--on-light);box-shadow:inset 0 0 0 1px var(--on-light-2)">Not now</span></div></div>
 <p class="prose">The user journey starts at this invitation and ends when the first order arrives. We count every connection.</p>
</section>`;

R.how = () => `
${head('Product · 08','How it works','Ten messages between six parties. PayPal holds the money, the merchant stays the seller, and Chatout never sees card numbers.')}
<div class="diagram">${seqSVG()}</div>
<div class="list">
 <div><h4>Catalog</h4><span class="chip">Store Sync · feed · embed</span><p>Products come from PayPal Store Sync where the merchant already uses it, from a product feed, or from the embed script on the merchant’s site.</p></div>
 <div><h4>Order</h4><span class="chip">Orders v2</span><p>One PayPal order with up to ten purchase units, one per merchant. Each unit names its payee, items, shipping and amount.</p></div>
 <div><h4>Wallet</h4><span class="chip">Vault</span><p>The buyer saves PayPal for the assistant once on paypal.com. Later payments use that saved wallet and confirm with Face ID or a passkey, so there is no second login.</p></div>
 <div><h4>Merchant</h4><span class="chip">Webhooks · agent</span><p>A webhook creates the order in the merchant’s system. For a store without an integration, an agent completes the store’s own checkout using the approved PayPal payment.</p></div>
</div>`;

R.map = () => {
  const lanes = ['Buyer','AI host','Chatout','PayPal','Merchant'];
  const cols = ['Invite','Connect','Discover','Cart','Pay','Fulfil','After'];
  const M = [
   ['Gets the beta invite by email and in chat','Logs into PayPal once, saves wallet, sets backup card and address','Asks a question, sees product cards','Adds items from two stores','Reviews per-store totals, Face ID','Sees receipts and tracking in chat','Refund or dispute from the receipt'],
   ['Shows the invitation card','Opens PayPal consent in a secure sheet','Calls Chatout tools, renders the widget','Keeps the cart in the thread','Shows the confirm sheet','Posts order updates','Shows support entry'],
   ['Picks beta cohort, sends invite','Stores the vault token, never credentials','Ranks catalog by relevance, stock, distance','Splits cart by merchant, checks stock','Creates one order with a unit per merchant','Fires webhooks, runs agent checkout if needed','Logs AI channel metrics'],
   ['Sends the invite email','Login, 2FA, vault setup, buyer verification','Store Sync catalogs','—','Authorises balance, then backup funding','Captures, pays each merchant, buyer protection','Refunds, disputes, statements'],
   ['Joins beta, verified business','Turns on Store Sync or adds embed','Products appear in answers','Stock reserved','Funds in PayPal Business','Ships its part of the order','Sees AI channel growth vs control']
  ];
  const lc = ['#F2C6A6','#A9C8F0','#E8E3E3','#FFC439','#BFE3C9'];
  return `
${head('Product · 09','Product map','Every touchpoint from the invitation to the refund, by party. Logins, two-factor checks, transactions and webhooks all sit in one grid.')}
<div class="tbl"><table style="min-width:980px">
 <thead><tr><th></th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
 <tbody>${lanes.map((l,i)=>`<tr><td><span class="chip" style="background:${lc[i]};color:#141212">${l}</span></td>${M[i].map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>
<p class="src">Scroll sideways on a phone. Security controls for each column are on the Security and trust page.</p>`;
};

R.surfaces = () => `
${head('Product · 10','In each chat','The same Chatout checkout, dressed in each host’s own interface. Tap a product, pick a size, check out, confirm. It works.')}
<div class="tabs" role="tablist" id="hostTabs">
 <button role="tab" data-h="gpt" aria-selected="true">ChatGPT</button>
 <button role="tab" data-h="meta" aria-selected="false">Meta AI</button>
 <button role="tab" data-h="grok" aria-selected="false">Grok on X</button>
 <button role="tab" data-h="gem" aria-selected="false">Gemini</button>
</div>
<div class="stage">
 <div id="devHost"></div>
 <div class="mock-note">
  <div id="hostNote"></div>
  <div class="ctl">
   <span class="eyebrow">Try</span>
   <button class="pill sm" id="ctlPop">Show “5 things to do now”</button>
   <button class="pill sm" id="ctlLow">Low balance: off</button>
   <button class="pill sm" id="ctlReset">Reset this chat</button>
  </div>
  <p class="src">Concept mockups for integration. Host names identify where the feature would run. No host logos are reproduced and no affiliation is implied.</p>
 </div>
</div>`;

R.checkout = () => `
${head('Product · 11','Checkout rules','The confirm sheet is where trust is won. These rules decide what it shows and what it asks.')}
<div class="list">
 <div><h4>Balance covers the total</h4>${chip('Default','ok')}<p>Pay from PayPal balance. One line: “€114 from PayPal balance”. Face ID.</p></div>
 <div><h4>Balance covers part</h4>${chip('Split','warn')}<p>“€24.10 from balance + €58.30 from Visa ••4417”. The backup order is set once, like Apple Pay’s card list.</p></div>
 <div><h4>No balance</h4><span class="chip">Card</span><p>The preferred card or bank inside PayPal. The buyer never types a card number in chat.</p></div>
 <div><h4>Business purchase</h4><span class="chip">Business</span><p>Switch to the PayPal Business account in one tap. The receipt carries the company name for accounting.</p></div>
 <div><h4>Trusted merchant</h4><span class="chip">Optional</span><p>“Remember this store: skip confirmation under €50.” Off by default. Any amount above the limit always asks for Face ID.</p></div>
 <div><h4>Payment fails</h4>${chip('Recover','bad')}<p>Switch to the next funding source automatically and say so. Never charge twice: one PayPal order, retried by its ID.</p></div>
</div>
<section class="sec">
 <h3>What you pay for, before you pay</h3>
 <div class="grid two">
  <div class="card"><h4>Per store</h4><p>Items, size, shipping and the store name, grouped by merchant, because each store ships its own part.</p></div>
  <div class="card"><h4>Delivery</h4><p>Saved address from PayPal, editable in the sheet. If none, a short form once, then saved.</p></div>
  <div class="card"><h4>Protection</h4><p>A line that PayPal buyer protection applies to eligible purchases, with a link to the terms.</p></div>
  <div class="card"><h4>After</h4><p>The receipt stays in the thread with tracking and a refund entry, so the chat is the order history.</p></div>
 </div>
</section>`;

R.nudges = () => `
${head('Product · 12','5 things to do now','A proactive card that turns the assistant’s context into small errands. Artem’s rule: it feels unskippable, but it is always skippable.')}
<div class="stage">
 <div id="devNudge"></div>
 <div class="mock-note">
  <div class="list">
   <div><h4>Who sees it</h4><p>Only beta users who connected PayPal and turned on suggestions. Never on the first session.</p></div>
   <div><h4>When</h4><p>At most once a day, when the person opens the assistant and has shown shopping intent: buying questions, store searches, saved interests.</p></div>
   <div><h4>How it behaves</h4><p>Tap first. A small close button in the corner and a swipe down. It never blocks typing.</p></div>
   <div><h4>What it can suggest</h4><p>Errands that end in a PayPal payment: dinner, a refill, a ticket on sale, a gift, spending an idle balance.</p></div>
   <div><h4>Privacy</h4><p>Signals stay with the host. Chatout receives a category, never the conversation.</p></div>
  </div>
 </div>
</div>`;

R.ideas = () => `
${head('Product · 13','Two game changers','Only two additions passed the test: each removes a large cost and adds nothing for the buyer to learn.')}
<div class="grid two">
 <div class="card"><span class="eyebrow">Game changer 1</span><h3>Use Store Sync as the catalog</h3><p>Onboarding 1,000 businesses is the hardest part of the beta. Merchants already on PayPal Store Sync can appear in chat with zero new work, through Wix, BigCommerce, Shopware and the other Store Sync partners. The embed script covers everyone else.</p><div class="foot"><span>Removes most onboarding work</span><span>${chip('Live product','ok')}</span></div></div>
 <div class="card"><span class="eyebrow">Game changer 2</span><h3>One MCP server for every host</h3><p>ChatGPT apps are built on the Model Context Protocol, and the MCP Apps standard lets one server render interactive UI in hosts that support it, Claude included. Chatout ships as one server with one widget. Meta and X adapters follow as partnerships allow.</p><div class="foot"><span>One codebase, many chats</span><span>${chip('Prototype target','warn')}</span></div></div>
</div>
${srcLine('dc')}
<div class="note">${chip('Left out','bad')}<span>Ideas that added steps for the buyer were cut: a separate Chatout account, a points programme, a crypto-first wallet. Crypto stays as a later funding source only.</span></div>`;

R['connect-user'] = () => `
${head('Launch · 14','Connect: buyer','Five steps, once. After this the buyer pays in any supported chat with Face ID.')}
<div class="steps">
 <div class="step"><h4>Accept the invitation</h4><p>Email and an in-chat card: “Your PayPal now works here.” Beta users only.</p><p class="acc">Done when: the invite shows the host, the beta terms and a Not now option.</p></div>
 <div class="step"><h4>Log into PayPal once</h4><p>Tap Connect PayPal. The login opens on paypal.com in a secure sheet, never inside the chat text. Two-factor applies as usual.</p><p class="acc">Done when: the chat never receives a password, only a consent result.</p></div>
 <div class="step"><h4>Save PayPal for this assistant</h4><p>Approve “Pay with PayPal in [assistant]” with a spending limit. PayPal stores a token for the assistant.</p><p class="acc">Done when: the next purchase needs no PayPal login.</p></div>
 <div class="step"><h4>Confirm delivery address</h4><p>PayPal’s address is offered first. Edit or add one.</p><p class="acc">Done when: checkout shows the address without typing.</p></div>
 <div class="step"><h4>Order your funding</h4><p>Balance first, then a card or bank, like Apple Pay’s card list. Business account optional.</p><p class="acc">Done when: a short balance is covered by the backup without an error.</p></div>
</div>
<div class="note">${chip('Revoke','warn')}<span>Disconnect any time from PayPal settings or by asking the assistant. The token stops working immediately.</span></div>`;

R['connect-business'] = () => `
${head('Launch · 15','Connect: business','Three ways in, from no code to full API. Every path ends with orders and money in PayPal Business.')}
<div class="tabs" role="tablist" id="bizTabs">
 <button role="tab" data-b="0" aria-selected="true">Store Sync</button>
 <button role="tab" data-b="1" aria-selected="false">Embed script</button>
 <button role="tab" data-b="2" aria-selected="false">Orders API</button>
</div>
<div id="bizBody"></div>`;

R.security = () => `
${head('Launch · 16','Security and trust','Artem’s condition for launch: verified stores, verified buyers, and no way to steal through the chat.')}
<div class="grid two">
 <div class="card"><h4>Verified merchants</h4><p>Beta stores pass PayPal business verification and show a sales history. A verified domain is required for the embed.</p></div>
 <div class="card"><h4>Verified buyers</h4><p>Only PayPal accounts in good standing with two-factor turned on can connect.</p></div>
 <div class="card"><h4>Tokens, never credentials</h4><p>The assistant holds a PayPal token with a spending limit. Passwords and card numbers stay at PayPal.</p></div>
 <div class="card"><h4>Confirm every payment</h4><p>Face ID or a passkey for each payment, except an opted-in trusted store under its limit.</p></div>
 <div class="card"><h4>Agent limits</h4><p>Agents act only on an approved PayPal order: fixed items, amount and payee. Changing any of them voids the approval.</p></div>
 <div class="card"><h4>Store hygiene</h4><p>Before joining, a store updates its platform and plugins and passes a basic scan. Artem’s example: a store hit by a known exploit must clean it before going live.</p></div>
 <div class="card"><h4>Fraud signals</h4><p>New device, unusual amount or a new store combination triggers step-up checks, using PayPal’s existing risk models.</p></div>
 <div class="card"><h4>Leaks during beta</h4><p>NDA for stores, feature flags per account, and invite-only access. A leaked screenshot can’t be used without an invited account.</p></div>
</div>`;

R.beta = () => `
${head('Launch · 17','Beta: 0 to 1,000','Artem’s plan, staged so each step proves the next. Real buyers, real stores, real money, behind gates.')}
<div class="tbl"><table>
 <thead><tr><th>Stage</th><th>Who</th><th>Hosts</th><th>Gate to next stage</th></tr></thead>
 <tbody>
  <tr><td>0 · Lab</td><td>Team and 3 demo stores, sandbox</td><td>Prototype chat</td><td>Every sandbox order captured and reconciled per merchant</td></tr>
  <tr><td>1 · First store</td><td>1 real store, 10 invited buyers, €50 cap</td><td>1 host</td><td>Zero unreconciled payments, refund tested end to end</td></tr>
  <tr><td>10</td><td>10 stores, 100 buyers</td><td>2 hosts</td><td>Checkout success ≥ 95% of confirm taps (target)</td></tr>
  <tr><td>100</td><td>100 stores, 1,000 buyers</td><td>2–3 hosts</td><td>Fraud and dispute rates at or below PayPal baseline</td></tr>
  <tr><td>1,000</td><td>1,000 stores under NDA, control group</td><td>All partner hosts</td><td>AI-channel sales lift vs control is statistically clear</td></tr>
 </tbody></table></div>
<section class="sec">
 <h3>Invitation, not a terms update</h3>
 <div class="grid two">
  <div class="card"><span class="eyebrow">Email to stores</span><h4>You’re invited: sell inside AI chats with PayPal</h4><p>Your store was selected for a closed beta. Turn on one setting and your products can be bought in AI chats with PayPal. You’ll see the new channel in your Business dashboard. Spots: 1,000.</p></div>
  <div class="card"><span class="eyebrow">In-chat card to buyers</span><h4>Your PayPal now works here</h4><p>Buy from any answer and pay with your balance. Connect once, confirm with Face ID. You’re one of the first people to try it.</p></div>
 </div>
</section>
<div class="note">${chip('Anti-fake','warn')}<span>No open sign-up. Stores are selected from verified PayPal Business accounts with sales history. This keeps out the fake shops Artem warned about.</span></div>`;

R.metrics = () => `
${head('Launch · 18','What we measure','One number leads: PayPal wallets connected to an AI assistant. The rest explain it.')}
<div class="panel"><span class="eyebrow" style="color:var(--on-light-2)">North star</span><p style="font:400 30px/1.15 var(--display);color:var(--on-light);letter-spacing:-.02em">Connected wallets that made a purchase within 30 days</p></div>
<div class="tbl"><table>
 <thead><tr><th>Metric</th><th>Definition</th><th>Why it matters</th></tr></thead>
 <tbody>
  <tr><td>Connections</td><td>Wallets saved for an assistant</td><td>Top of the funnel, Artem’s first count</td></tr>
  <tr><td>Card → pay</td><td>Payments ÷ catalog cards shown</td><td>Does the in-chat store convert</td></tr>
  <tr><td>Time to pay</td><td>First card view to Face ID</td><td>Speed is the promise</td></tr>
  <tr><td>Balance spent</td><td>Share of payment funded from balance</td><td>Idle money moving again</td></tr>
  <tr><td>Backup used</td><td>Payments where a card covered the rest</td><td>Fallback works without errors</td></tr>
  <tr><td>Multi-store carts</td><td>Orders with 2+ merchants</td><td>Chatout’s unique behaviour</td></tr>
  <tr><td>Merchant lift</td><td>AI-channel sales, beta vs control stores</td><td>The proof for the 1,000</td></tr>
  <tr><td>Disputes</td><td>Disputes per 1,000 orders vs baseline</td><td>Safety gate for each stage</td></tr>
 </tbody></table></div>`;

R.architecture = () => `
${head('Proposal · 19','Architecture','Hosts on top, PayPal at the bottom, Chatout in between. The prototype implements the green parts.')}
<div class="arch">
 ${archRow('AI hosts', [['ChatGPT app','MCP + widget','p'],['Claude','MCP Apps','p'],['Meta AI','partner adapter','l'],['Gemini','partner adapter','l'],['Grok on X','later','l'],['Prototype chat','own UI, demo','b']])}
 ${archRow('Chatout gateway', [['Agent tools','search, details, cart, checkout, status','b'],['Widget UI','cards, sheet, confirm','b'],['Proactive cards','5 things to do now','p']])}
 ${archRow('Services', [['Catalog index','Store Sync, feeds, embed','b'],['Cart','split by merchant','b'],['Payments','orders, vault, webhooks','b'],['Agent runner','checkout on non-integrated sites','l'],['Analytics','AI channel, control group','b']])}
 ${archRow('PayPal', [['Orders v2','multi-merchant units','b'],['Vault','saved wallet','p'],['Webhooks','order events','b'],['Store Sync','catalogs','l'],['Business dashboard','reporting','l']])}
</div>
<div class="legend"><span><i style="background:#5FD3A6"></i>In the hackathon prototype</span><span><i style="background:#E8B26A"></i>Prototype stretch goal</span><span><i style="background:#3A3434"></i>Partnership phase</span></div>
<section class="sec">
 <h3>Prototype stack</h3>
 <div class="list">
  <div><h4>App</h4><span class="chip">Next.js · TypeScript</span><p>Chat surface, product widget, checkout sheet, merchant dashboard and the embed script, in one app.</p></div>
  <div><h4>Payments</h4><span class="chip">PayPal sandbox</span><p>Orders v2 with one purchase unit per merchant, the PayPal JS SDK for approval, capture on the server.</p></div>
  <div><h4>AI</h4><span class="chip">LLM with tools</span><p>The model picks tools: search catalog, add to cart, start checkout. A rule-based fallback keeps the demo running without an API key.</p></div>
  <div><h4>Hosting</h4><span class="chip">Render or Netlify</span><p>Public demo URL for the judges, environment variables for sandbox keys.</p></div>
 </div>
</section>`;

R.plan = () => `
${head('Proposal · 20','Development plan','Every task has a done-when line. A task without one is a wish.')}
<div class="tabs" role="tablist" id="planTabs">${PLAN.map((p,i)=>`<button role="tab" data-pl="${i}" aria-selected="${i===0}">${p[0]}</button>`).join('')}</div>
<div id="planBody"></div>`;

const PLAN = [
 ['Hackathon','8–12 Nov 2026', [
 ['Catalog service with 3 demo stores','Search returns items from at least two stores for each demo prompt'],
 ['Chat agent with tools','“Nova Lane tickets and tee” returns one card with both stores, with and without an API key'],
 ['Multi-store cart','Items from two stores share a cart; totals per store and overall are correct'],
 ['PayPal sandbox order','One Orders v2 order with two purchase units is created, approved and captured'],
 ['Merchant dashboard','A captured order appears with source “AI chat” and host name'],
 ['Embed script','A plain HTML page with one script tag shows the PayPal button and creates a sandbox order'],
 ['Public repo','MIT licence, README run steps; a fresh clone runs with install and dev'],
 ['Video under 3 minutes','On YouTube, shows a full sandbox payment, no third-party logos'],
 ['Devpost submission','Submitted before 12 Nov, 21:00 Tirane time']]],
 ['Pilot','Months 1–2', [
 ['Saved wallet (vault) for returning buyers','Second purchase completes with no PayPal login'],
 ['MCP server with widget','The same checkout runs inside one real AI host in developer mode'],
 ['Store Sync catalog import','A Store Sync merchant appears in chat without new setup'],
 ['Stage 0 and 1 of the beta','First real store live with 10 buyers and zero unreconciled payments']]],
 ['Beta','Months 3–6', [
 ['Partner adapter for a social host','Checkout works in one social AI surface for invited users'],
 ['Agent checkout for non-integrated stores','Agent completes 9 of 10 test orders without human help'],
 ['Control-group analytics','Dashboard shows lift with confidence interval per store'],
 ['Scale to 1,000 stores','All stages passed their gates; fraud at or below baseline']]],
 ['Scale','Months 7–12', [
 ['Open to all verified PayPal Business accounts','Self-serve onboarding under 10 minutes'],
 ['More funding sources, crypto where available','Crypto checkout works in at least one market'],
 ['Fee model decided from experiment data','Price chosen with merchant churn below the agreed threshold']]]
];

R.budget = () => `
${head('Proposal · 21','Budget and fees','Artem’s estimate is $650,000 to build the system with one AI partner. This is a proposed split to validate with PayPal.')}
<div class="card" style="gap:16px">
 ${budgetBars([
  ['Product engineering: gateway, host adapters, widget',260],
  ['Payments and risk engineering: vault, fraud, reconciliation',120],
  ['Design, research and beta operations',80],
  ['Onboarding support for 1,000 beta stores',70],
  ['Security review and penetration testing',60],
  ['Infrastructure and monitoring, 12 months',30],
  ['Legal and compliance: NDA, terms, regions',30]
 ])}
 <p class="src">Proposal in thousands of USD. Totals $650K. Not a quote.</p>
</div>
<section class="sec">
 <h3>Fee experiment</h3>
 <p class="prose">Buyers pay nothing extra, so PayPal stays equal to a card in the chat. Merchants pay their usual PayPal rate. On top, three beta cohorts test an AI-channel fee and PayPal picks the price from the data.</p>
 <div class="grid">
  <div class="card"><span class="eyebrow">Cohort A</span><h3>No extra fee</h3><p>Baseline for conversion and merchant retention.</p></div>
  <div class="card"><span class="eyebrow">Cohort B</span><h3>3¢ per order</h3><p>Artem’s test price. Small enough to measure tolerance.</p></div>
  <div class="card"><span class="eyebrow">Cohort C</span><h3>Small % per order</h3><p>Scales with order value. Compared on churn against A and B.</p></div>
 </div>
</section>`;

R.prototype = () => `
${head('Proposal · 22','Working prototype','Devpost accepts only a functional demo: a running app on the PayPal sandbox, a public repo and a video. The mockups on this canvas are the design; the app is the proof.')}
<div class="list">
 <div><h4>Chat with an AI agent</h4>${chip('Building','warn')}<p>Type a request, get product cards from several demo stores.</p></div>
 <div><h4>Cart and checkout sheet</h4>${chip('Building','warn')}<p>Multi-store cart, per-store totals, funding choice.</p></div>
 <div><h4>PayPal sandbox payment</h4>${chip('Needs sandbox keys','bad')}<p>Real Orders v2 order with a purchase unit per store, approved and captured in the sandbox.</p></div>
 <div><h4>Merchant dashboard</h4>${chip('Building','warn')}<p>Orders and revenue by channel, updated after each capture.</p></div>
 <div><h4>Embed script</h4>${chip('Building','warn')}<p>One script tag adds the PayPal checkout to any store page.</p></div>
</div>
<div class="note">${chip('Rules','warn')}<span>Submission closes 12 Nov 2026 at 12:00 PT, 21:00 in Tirane. Judged on technical implementation, design, impact, idea and presentation.</span></div>
${srcLine('dp','pb')}`;

R.video = () => `
${head('Proposal · 23','Video and tech deck','The demo video must stay under three minutes and avoid third-party logos, so it shows the prototype chat, not the host mockups.')}
<div class="tbl"><table style="min-width:620px">
 <thead><tr><th>Time</th><th>Scene</th><th>On screen</th></tr></thead>
 <tbody>
  <tr><td>0:00</td><td>The problem</td><td>Lina’s nine steps as nodes, collapsing to five</td></tr>
  <tr><td>0:20</td><td>The ask</td><td>Typing: “Nova Lane in Kraków, tickets and the tour tee”</td></tr>
  <tr><td>0:35</td><td>The store in the answer</td><td>Cards from two stores, product sheet, size M, add both</td></tr>
  <tr><td>1:05</td><td>One approval</td><td>Checkout sheet, balance first, PayPal sandbox approval</td></tr>
  <tr><td>1:35</td><td>Two merchants paid</td><td>Receipt with two capture IDs, agent status</td></tr>
  <tr><td>1:55</td><td>The merchant side</td><td>Dashboard updates, source “AI chat”</td></tr>
  <tr><td>2:15</td><td>Any store</td><td>Embed script on a plain page</td></tr>
  <tr><td>2:35</td><td>The plan</td><td>Beta 1 → 1,000, one MCP server for every host, Artem’s offer</td></tr>
 </tbody></table></div>
<section class="sec">
 <h3>Technical presentation, 10 slides</h3>
 <div class="steps">
  ${['Problem on three sides','Market and what exists','Concept in four pillars','Live demo','Architecture','Multi-merchant order on Orders v2','Wallet and security model','Beta and metrics','Plan, budget, fees','Team ask'].map(s=>`<div class="step"><h4>${s}</h4></div>`).join('')}
 </div>
</section>`;

R.pitch = () => `
${head('Proposal · 24','Let’s build it together','A note from Artem to the PayPal team.')}
<div class="prose" style="font-size:17.5px;line-height:1.65">
 <p>I can’t reach every layer of this system with my own hands. A payment network across AI chats needs your engineers, your risk teams and your partnerships. What I bring is the view from the user’s side of the screen, and the full concept you’ve just read.</p>
 <p>I’m ready to consult at any stage, to take full ownership of the project, or to join your team officially as a product designer and partner on the solution. I work best as part of a team. Without one, a system of this scale would take too long to do properly.</p>
 <p>I’m based in Albania and ready to work from wherever the project is built. If an office is the best place for it, I’ll be there. If that needs a visa, I’d be grateful for your help with it.</p>
</div>
<div class="grid two">
 <div class="card"><span class="eyebrow">Artem Pichuhin</span><h3>Independent Product Designer</h3><p>Previously Lead Product Designer at Basa.Solutions, where he mentored five designers. Five years designing and building websites and products. English, Polish, Ukrainian.</p></div>
 <div class="card"><span class="eyebrow">Contact</span><p class="mono" style="font-size:13.5px;line-height:1.9;color:var(--ink)">pichugin.workspace@gmail.com<br>linkedin.com/in/artem-pichuhin-251326272<br>behance.net/artempichuhin</p><div class="row"><button class="pill sm light" id="copyMail">Copy email</button></div></div>
</div>`;
