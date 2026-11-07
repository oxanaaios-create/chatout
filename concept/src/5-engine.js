/* ================= DRAWING HELPERS ================= */
function wrap(text, max){ const w = text.split(' '); const out = []; let l = '';
  w.forEach(x => { if ((l + ' ' + x).trim().length > max) { if (l) out.push(l); l = x; } else l = (l + ' ' + x).trim(); });
  if (l) out.push(l); return out; }

const KIND = {chat:'CHAT',site:'WEBSITE',login:'LOGIN',form:'FORM',pay:'PAY',done:'DONE'};
function flowSVG(p){
  const W = 156, H = 76, G = 40, PADL = 128, laneY = [34, 220];
  const n = Math.max(p.now.length, p.ideal.length);
  const width = PADL + n * W + (n - 1) * G + 28, height = 344;
  let s = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Flow for ${p.name}: ${p.now.length} steps today, ${p.ideal.length} with Chatout">`;
  const lane = (arr, y, label, ok) => {
    s += `<text x="16" y="${y + 22}" fill="#908A8A" font-size="10" font-family="Geist Mono, monospace" letter-spacing=".8">${label}</text>`;
    s += `<text x="16" y="${y + 40}" fill="#E8E3E3" font-size="20" font-family="Hanken Grotesk, sans-serif">${arr.length} steps</text>`;
    arr.forEach((nd, i) => {
      const x = PADL + i * (W + G);
      if (i < arr.length - 1) {
        const x1 = x + W, x2 = x + W + G, cy = y + H / 2;
        s += `<path d="M${x1} ${cy} C ${x1 + G/2} ${cy}, ${x2 - G/2} ${cy}, ${x2} ${cy}" stroke="${ok ? '#5FD3A6' : '#5A5252'}" stroke-width="1.5" fill="none"/>`;
        s += `<circle cx="${x1}" cy="${cy}" r="3.5" fill="#141212" stroke="${ok ? '#5FD3A6' : '#5A5252'}" stroke-width="1.5"/><circle cx="${x2}" cy="${cy}" r="3.5" fill="#141212" stroke="${ok ? '#5FD3A6' : '#5A5252'}" stroke-width="1.5"/>`;
      }
      const stroke = nd.p ? '#EE8A78' : ok ? '#5FD3A6' : '#3A3434';
      s += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="14" fill="#1E1B1B" stroke="${stroke}" stroke-width="${nd.p || ok ? 1.5 : 1}"/>`;
      s += `<text x="${x + 12}" y="${y + 18}" fill="${nd.p ? '#EE8A78' : ok ? '#5FD3A6' : '#908A8A'}" font-size="9" font-family="Geist Mono, monospace" letter-spacing="1">${String(i + 1).padStart(2,'0')} · ${KIND[nd.k] || ''}</text>`;
      wrap(nd.t, 21).slice(0, 3).forEach((ln, j) => { s += `<text x="${x + 12}" y="${y + 36 + j * 14.5}" fill="#E8E3E3" font-size="12.5" font-family="Geist, sans-serif">${esc(ln)}</text>`; });
      if (nd.p) wrap(nd.p, 24).slice(0, 2).forEach((ln, j) => { s += `<text x="${x + 2}" y="${y + H + 18 + j * 13}" fill="#EE8A78" font-size="11" font-family="Geist, sans-serif">${j === 0 ? '▲ ' : '  '}${esc(ln)}</text>`; });
    });
  };
  lane(p.now, laneY[0], 'TODAY', false);
  s += `<line x1="16" x2="${width - 16}" y1="190" y2="190" stroke="#2A2626" stroke-dasharray="4 6"/>`;
  lane(p.ideal, laneY[1], 'WITH CHATOUT', true);
  return s + '</svg>';
}

function seqSVG(){
  const A = ['Buyer','AI host','Chatout','PayPal','Merchant','Agent'];
  const col = ['#F2C6A6','#A9C8F0','#E8E3E3','#FFC439','#BFE3C9','#C9C2F2'];
  const M = [
    [0,1,'Asks: tickets and the tour tee'],
    [1,2,'Tool call: search catalog'],
    [2,4,'Reads catalogs (Store Sync, feed, embed)'],
    [2,1,'Widget: cards from two stores'],
    [0,2,'Adds ticket + tee, opens checkout'],
    [2,3,'Create order: 1 unit per merchant'],
    [0,3,'Approves with saved wallet + Face ID'],
    [3,4,'Captures, pays each merchant'],
    [3,5,'Webhook; agent orders where no integration'],
    [2,0,'Receipts and tracking in chat']
  ];
  const CW = 150, X0 = 30, TOP = 64, RH = 46, W = X0 * 2 + CW * (A.length - 1) + 40, H = TOP + RH * M.length + 30;
  const cx = i => X0 + 20 + i * CW;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sequence of a Chatout purchase in ten messages">`;
  s += `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#D1CECE"/></marker></defs>`;
  A.forEach((a, i) => {
    s += `<rect x="${cx(i) - 52}" y="14" width="104" height="30" rx="15" fill="${col[i]}"/>`;
    s += `<text x="${cx(i)}" y="34" text-anchor="middle" fill="#141212" font-size="12.5" font-weight="500" font-family="Geist, sans-serif">${a}</text>`;
    s += `<line x1="${cx(i)}" x2="${cx(i)}" y1="44" y2="${H - 14}" stroke="#2A2626" stroke-dasharray="3 5"/>`;
  });
  M.forEach(([f, t, l], k) => {
    const y = TOP + k * RH + 14, x1 = cx(f), x2 = cx(t), dir = x2 > x1 ? 1 : -1;
    s += `<line x1="${x1 + dir * 4}" x2="${x2 - dir * 6}" y1="${y}" y2="${y}" stroke="#D1CECE" stroke-width="1.4" marker-end="url(#ah)"/>`;
    const lx = Math.min(x1, x2) + 8;
    s += `<text x="${lx}" y="${y - 8}" fill="#E8E3E3" font-size="11.5" font-family="Geist, sans-serif"><tspan fill="#908A8A" font-family="Geist Mono, monospace">${String(k + 1).padStart(2,'0')}  </tspan>${esc(l)}</text>`;
  });
  return s + '</svg>';
}

function archRow(label, items){
  const c = {b:'#5FD3A6',p:'#E8B26A',l:'#3A3434'};
  return `<div class="arow"><span class="eyebrow">${label}</span><div class="acells">${items.map(([t,d,k]) => `<div class="acell" style="box-shadow:inset 0 0 0 1.5px ${c[k]}"><b>${t}</b><span>${d}</span></div>`).join('')}</div></div>`;
}
function planBlock(title, rows){
  return `<section class="sec"><h3>${title}</h3><div class="steps">${rows.map(([t,a]) => `<div class="step"><h4>${esc(t)}</h4><p class="acc">Done when: ${esc(a)}</p></div>`).join('')}</div></section>`;
}
function budgetBars(rows){
  const max = Math.max(...rows.map(r => r[1]));
  return rows.map(([t,v]) => `<div class="bb"><div class="bb-l"><span>${esc(t)}</span><b class="num">$${v}K</b></div><div class="bb-t"><i style="width:${(v/max*100).toFixed(1)}%"></i></div></div>`).join('');
}

/* ---------- product art ---------- */
function art(kind, c, v = 0){
  const tf = v === 1 ? 'translate(-30 -26) scale(1.55)' : v === 2 ? 'translate(6 4) rotate(-8 50 50) scale(.92)' : '';
  const bgc = v === 2 ? 'rgba(0,0,0,.06)' : 'rgba(0,0,0,.035)';
  const shade = 'rgba(255,255,255,.14)';
  const S = {
    tee:`<path d="M30 24l12-6c2 5 14 5 16 0l12 6 10 14-11 6-4-5v41H35V39l-4 5-11-6z" fill="${c}"/><path d="M42 18c2 5 14 5 16 0" stroke="${shade}" stroke-width="2" fill="none"/><circle cx="50" cy="48" r="9" fill="none" stroke="${shade}" stroke-width="2"/>`,
    hoodie:`<path d="M30 28l10-8c0 9 20 9 20 0l10 8 9 34-10 2-3-14v34H34V50l-3 14-10-2z" fill="${c}"/><path d="M40 20c0 12 20 12 20 0" fill="none" stroke="${shade}" stroke-width="2.4"/><rect x="40" y="62" width="20" height="10" rx="3" fill="${shade}"/>`,
    ticket:`<path d="M18 32h64v12a6 6 0 0 0 0 12v12H18V56a6 6 0 0 0 0-12z" fill="${c}"/><path d="M62 32v36" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 3"/><rect x="25" y="40" width="28" height="4" rx="2" fill="${shade}"/><rect x="25" y="49" width="20" height="3" rx="1.5" fill="${shade}"/><rect x="25" y="56" width="24" height="3" rx="1.5" fill="${shade}"/><circle cx="72" cy="50" r="5" fill="${shade}"/>`,
    poster:`<rect x="26" y="16" width="48" height="68" rx="3" fill="${c}"/><circle cx="50" cy="44" r="14" fill="rgba(255,236,200,.75)"/><rect x="33" y="66" width="34" height="4" rx="2" fill="${shade}"/><rect x="38" y="73" width="24" height="3" rx="1.5" fill="${shade}"/><path d="M38 76c6-4 18-4 24 0" stroke="rgba(255,255,255,.4)" fill="none"/>`,
    tablet:`<rect x="16" y="26" width="68" height="48" rx="6" fill="${c}"/><rect x="22" y="31" width="56" height="38" rx="3" fill="rgba(255,255,255,.12)"/><path d="M30 60c8-14 16 4 24-8s10 2 14-2" stroke="rgba(255,255,255,.55)" stroke-width="1.6" fill="none"/><path d="M76 78l14-30" stroke="#222" stroke-width="3" stroke-linecap="round"/>`,
    film:`<rect x="22" y="22" width="56" height="56" rx="4" fill="${c}"/><path d="M28 70L70 28" stroke="rgba(255,255,255,.35)" stroke-width="6"/><path d="M40 72L72 40" stroke="rgba(255,255,255,.2)" stroke-width="3"/>`,
    jacket:`<path d="M32 22l10-5 8 6 8-6 10 5 10 18-9 6-3-6v44H34V40l-3 6-9-6z" fill="${c}"/><path d="M50 23v61" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><path d="M42 17l8 14 8-14" fill="none" stroke="${shade}" stroke-width="2"/><rect x="37" y="52" width="9" height="8" rx="1.5" fill="${shade}"/><rect x="54" y="52" width="9" height="8" rx="1.5" fill="${shade}"/>`,
    tote:`<path d="M38 36c0-14 24-14 24 0" fill="none" stroke="${c}" stroke-width="3.5"/><path d="M28 36h44l-4 46H32z" fill="${c}"/><rect x="40" y="52" width="20" height="3" rx="1.5" fill="rgba(0,0,0,.18)"/>`,
    screws:`<g fill="${c}">${[[30,30,-20],[50,26,10],[66,36,35],[38,56,-40],[60,58,15]].map(([x,y,r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-7" y="-4" width="14" height="5" rx="2"/><path d="M-2.5 1h5l-1 22h-3z"/><path d="M-4 6l8 2M-4 11l8 2M-4 16l8 2" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/></g>`).join('')}</g>`,
    bit:`<g transform="rotate(-35 50 50)"><rect x="44" y="12" width="12" height="26" rx="2" fill="${c}"/><path d="M45 38h10l-1 42-4 8-4-8z" fill="#9AA5B0"/><path d="M45 46l10 6M45 56l10 6M45 66l10 6" stroke="#5B6672" stroke-width="2"/></g>`,
    drill:`<path d="M22 32h44a8 8 0 0 1 8 8v4a8 8 0 0 1-8 8H50l-4 26H34l4-26H22z" fill="${c}"/><rect x="74" y="38" width="12" height="8" rx="2" fill="#555"/><path d="M86 42h8" stroke="#999" stroke-width="3"/><rect x="32" y="74" width="18" height="12" rx="3" fill="#2B2B2B"/>`
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="${bgc}"/><ellipse cx="50" cy="88" rx="30" ry="4" fill="rgba(0,0,0,.08)"/><g transform="${tf}">${S[kind] || S.tee}</g></svg>`;
}

/* ================= DEVICE ENGINE ================= */
const DESC = {
  ticket:'Mobile ticket delivered to your PayPal email and this chat. Entry with QR code. Resale through the official exchange only.',
  tee:'Heavyweight organic cotton, relaxed fit. Front print of the tour artwork, dates on the back.',
  hoodie:'Brushed fleece, kangaroo pocket, tour dates on the sleeve.',
  poster:'Signed limited print, 50 × 70 cm, shipped in a tube.',
  tablet:'Pressure-sensitive pen included. Works with Mac, Windows and Android.',
  film:'Paper-like matte film that reduces glare and adds pen friction.',
  jacket:'Water-repellent cotton canvas, corduroy collar, four pockets.',
  tote:'Heavy canvas tote with inner pocket.',
  screws:'Zinc-plated countersunk wood screws, Pozidriv head.',
  bit:'High-speed steel bits for wood and metal.',
  drill:'18V brushless drill driver, two speeds, LED light.'
};
const ADDR = {gpt:'ul. Długa 12/4, Kraków', grok:'Rua da Rosa 41, Lisbon', meta:'Via Tortona 18, Milan', gem:'14 Oak Rd, Manchester'};
const CUR = {gpt:'€', grok:'€', meta:'€', gem:'£'};
const HSUB = {gpt:'Chatout app', grok:'on X', meta:'Instagram · AI chat', gem:'with Chatout'};

function mountDevice(slot, k, opts = {}){
  const root = document.createElement('div'); slot.replaceChildren(root);
  const sc = SCEN[k], cur = CUR[k];
  const st = {cart:{}, sel:{}, low:!!opts.low, fund:'bal', trust:false};
  const money = n => cur + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/,'');
  const shipFor = m => (m.includes('Ticket') ? 0 : sc.items.find(i => i.m === m && i.a === 'screws') ? 2.5 : 4.9);
  root.innerHTML = `
  <div class="device"><div class="screen h-${k}">
   <div class="notch"></div>
   <div class="sbar"><span>9:41</span><span>5G ▮▮▮</span></div>
   <div class="hbar"><span class="hostmark"></span><div><div class="hn">${sc.host}</div><div class="hs">${HSUB[k]}</div></div><div class="sp">•••</div></div>
   <div class="thread">
    <div class="msg-u">${esc(sc.user)}</div>
    <div class="msg-a ${k === 'meta' ? 'bub' : ''}">${esc(sc.reply)}</div>
    <div class="cw">
     <div class="cw-h"><b>${esc(sc.head)}</b><span>Pay with PayPal</span></div>
     <div class="carousel">${sc.items.map(it => `
      <div class="pc" data-id="${it.id}">
       <button class="im" data-open="${it.id}" aria-label="Open ${esc(it.n)}">${art(it.a, it.c)}</button>
       <div class="nm">${esc(it.n)}</div><div class="mr">${esc(it.m)}</div>
       <div class="pr">${money(it.p)}</div>
       <button class="addbtn" data-add="${it.id}">+ Add</button>
      </div>`).join('')}</div>
     <div class="sim">${sc.similar.map(x => `<span>${esc(x)}</span>`).join('')}</div>
    </div>
    <div class="after"></div>
   </div>
   <div class="composer">Ask anything<span class="snd">↑</span></div>
   <div class="cartbar"><span class="cb-t"></span><button class="go">Checkout</button></div>
   <div class="scrim"></div>
   <div class="sheet" role="dialog" aria-label="Chatout sheet"><div class="sh-grab"></div><div class="sh-body"></div></div>
   <div class="popup" role="dialog" aria-label="5 things to do now"><div class="popcard">
     <button class="xs" data-closepop aria-label="Close">✕</button>
     <b style="font-size:16px">5 things to do now</b>
     <div class="tdo">
      <button data-closepop><span>🍽</span><span><b>Order dinner for tonight</b><small>2 places deliver by 19:30</small></span></button>
      <button data-closepop><span>🎟</span><span><b>Nova Lane added a Kraków date</b><small>Tickets from €79</small></span></button>
      <button data-closepop><span>☕</span><span><b>Coffee beans run out Friday</b><small>Reorder from your last store</small></span></button>
      <button data-closepop><span>🎁</span><span><b>Mum’s birthday is Sunday</b><small>3 gift ideas under €40</small></span></button>
      <button data-closepop><span>💳</span><span><b>${money(sc.balance)} is waiting in PayPal</b><small>Spend it on anything above</small></span></button>
     </div>
   </div></div>
  </div></div>`;
  const $ = s => root.querySelector(s), $$ = s => root.querySelectorAll(s);
  const sheet = $('.sheet'), body = $('.sh-body'), scrim = $('.scrim'), bar = $('.cartbar');
  const item = id => sc.items.find(i => i.id === id);
  const total = () => Object.values(st.cart).reduce((a, c) => a + c.it.p * c.q, 0);
  const merchants = () => [...new Set(Object.values(st.cart).map(c => c.it.m))];
  const ship = () => merchants().reduce((a, m) => a + shipFor(m), 0);
  const bal = () => st.low ? Math.min(sc.balance, 12.4) : sc.balance;
  function refresh(){
    const n = Object.values(st.cart).reduce((a, c) => a + c.q, 0);
    bar.classList.toggle('on', n > 0 && !sheet.classList.contains('on'));
    $('.cb-t').innerHTML = `<b>${n} item${n === 1 ? '' : 's'}</b> · ${merchants().length} store${merchants().length === 1 ? '' : 's'} · ${money(total())}`;
    $$('[data-add]').forEach(b => { const on = !!st.cart[b.dataset.add]; b.classList.toggle('in', on); b.textContent = on ? 'Added ✓' : '+ Add'; });
  }
  function add(id, opt){ const it = item(id); const o = opt || st.sel[id] || it.opts[Math.min(1, it.opts.length - 1)];
    if (st.cart[id]) { st.cart[id].o = o; } else st.cart[id] = {it, o, q:1}; refresh(); }
  function open(html){ body.innerHTML = html; sheet.classList.add('on'); scrim.classList.add('on'); bar.classList.remove('on'); body.scrollTop = 0; }
  function close(){ sheet.classList.remove('on'); scrim.classList.remove('on'); refresh(); }
  function product(id){
    const it = item(id); const sel = st.sel[id] || it.opts[Math.min(1, it.opts.length - 1)];
    const sims = sc.items.filter(x => x.id !== id).slice(0, 3);
    open(`<div class="sh-top"><h5>${esc(it.n)}</h5><button class="x" data-close aria-label="Close">✕</button></div>
     <div class="gal"><div>${art(it.a, it.c, 0)}</div><div>${art(it.a, it.c, 1)}</div><div>${art(it.a, it.c, 2)}</div></div>
     <div class="line"><span style="color:var(--h-mute)">${esc(it.m)}</span><b>${money(it.p)}</b></div>
     <div class="sizes" role="group" aria-label="Options">${it.opts.map(o => `<button data-opt="${esc(o)}" aria-pressed="${o === sel}">${esc(o)}</button>`).join('')}</div>
     <p style="font-size:12.5px;color:var(--h-mute);margin:0">${DESC[it.a] || ''}</p>
     <button class="ppbtn alt" data-addp="${id}">${st.cart[id] ? 'Update cart' : 'Add to cart'}</button>
     <button class="ppbtn" data-buy="${id}">Buy now with <i>PayPal</i></button>
     <div style="font-size:12px;font-weight:600">Similar in this chat</div>
     <div class="carousel" style="padding:0">${sims.map(s => `<div class="pc" style="flex-basis:96px"><button class="im" data-open="${s.id}">${art(s.a, s.c)}</button><div class="nm" style="font-size:11.5px">${esc(s.n)}</div><div class="pr" style="font-size:11.5px">${money(s.p)}</div></div>`).join('')}</div>`);
    body.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => { st.sel[id] = b.dataset.opt; body.querySelectorAll('[data-opt]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  }
  function checkout(){
    const t = total(), sh = ship(), all = t + sh, b = bal();
    const split = b < all;
    const groups = merchants().map(m => { const rows = Object.values(st.cart).filter(c => c.it.m === m);
      return `<div style="display:flex;flex-direction:column;gap:4px"><div class="line mut"><span>${esc(m)}</span><span>${shipFor(m) ? 'Shipping ' + money(shipFor(m)) : 'E-ticket'}</span></div>${rows.map(c => `<div class="line"><span>${esc(c.it.n)} · ${esc(c.o)}</span><span>${money(c.it.p)}</span></div>`).join('')}</div>`; }).join('<hr style="border:0;border-top:1px solid var(--h-cardline);margin:2px 0">');
    open(`<div class="sh-top"><h5>Checkout</h5><button class="x" data-close aria-label="Close">✕</button></div>
     ${groups}
     <div class="line" style="font-weight:700;font-size:14px"><span>Total · ${merchants().length} store${merchants().length > 1 ? 's' : ''}</span><span>${money(all)}</span></div>
     <div class="ship"><span>📍</span><span><b>${ADDR[k]}</b><small>From your PayPal account · Change</small></span></div>
     <div class="fund" role="radiogroup" aria-label="Pay with">
      <label><input type="radio" name="f-${k}" value="bal" ${st.fund === 'bal' ? 'checked' : ''}><span class="fi" style="background:#0B2A5B">PP</span><span>PayPal balance<small>${split ? money(b) + ' + ' + money(all - b) + ' from Visa ••4417' : 'Covers the full amount'}</small></span><span class="bal">${money(b)}</span></label>
      <label><input type="radio" name="f-${k}" value="card" ${st.fund === 'card' ? 'checked' : ''}><span class="fi" style="background:#1A1F71">VISA</span><span>Visa ••4417<small>Backup card in PayPal</small></span></label>
      <label><input type="radio" name="f-${k}" value="bank" ${st.fund === 'bank' ? 'checked' : ''}><span class="fi" style="background:#2E7D5B">BANK</span><span>Bank ••0921<small>Linked in PayPal</small></span></label>
      <label><input type="radio" name="f-${k}" value="biz" ${st.fund === 'biz' ? 'checked' : ''}><span class="fi" style="background:#444">BIZ</span><span>PayPal Business<small>Receipt with company name</small></span></label>
     </div>
     <label style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--h-mute)"><input type="checkbox" data-trust ${st.trust ? 'checked' : ''}> Remember these stores: skip Face ID under ${money(50)}</label>
     <button class="ppbtn" data-pay>Pay ${money(all)} with <i>PayPal</i></button>
     <p style="font-size:11px;color:var(--h-mute);margin:0;text-align:center">One PayPal order, ${merchants().length} payee${merchants().length > 1 ? 's' : ''}. Buyer protection applies to eligible purchases.</p>`);
    body.querySelectorAll(`[name="f-${k}"]`).forEach(r => r.onchange = () => st.fund = r.value);
    body.querySelector('[data-trust]').onchange = e => st.trust = e.target.checked;
  }
  function pay(){
    const all = total() + ship(), ms = merchants(), b = bal();
    open(`<div class="faceid"><div class="ring">🙂</div><b>Confirm with Face ID</b><span style="font-size:12px;color:var(--h-mute)">${money(all)} to ${ms.length} store${ms.length > 1 ? 's' : ''}</span></div>`);
    setTimeout(() => {
      const fundLine = st.fund === 'bal' ? (b < all ? `${money(b)} from balance + ${money(all - b)} from Visa ••4417` : `${money(all)} from PayPal balance`) : st.fund === 'card' ? 'Visa ••4417 via PayPal' : st.fund === 'bank' ? 'Bank ••0921 via PayPal' : 'PayPal Business account';
      open(`<div class="done"><div class="ok">✓</div><h5 style="margin:0;font-size:17px">Paid ${money(all)}</h5><span style="font-size:12.5px;color:var(--h-mute)">${fundLine}</span>
       ${ms.map((m, i) => `<div class="rcpt"><div class="line"><b>${esc(m)}</b><span>${money(Object.values(st.cart).filter(c => c.it.m === m).reduce((a, c) => a + c.it.p, 0) + shipFor(m))}</span></div><div class="line mut"><span>${i === 0 ? 'Order sent to store system' : 'Agent placing order on store site'}</span><span class="st">…</span></div><div class="prog"><i></i></div></div>`).join('')}
       <p style="font-size:11px;color:var(--h-mute);margin:0">Demo receipt · capture IDs appear here in the sandbox prototype.</p>
       <button class="ppbtn alt" data-finish>Back to chat</button></div>`);
      requestAnimationFrame(() => { body.querySelectorAll('.prog i').forEach(i => i.style.width = '100%'); });
      setTimeout(() => body.querySelectorAll('.rcpt .st').forEach(s => s.textContent = 'Confirmed'), 1700);
    }, 1300);
  }
  function finish(){
    const all = total() + ship(), ms = merchants();
    const r = document.createElement('div'); r.className = 'cw';
    r.innerHTML = `<div class="cw-h"><b>Paid ${money(all)} with PayPal</b><span>${ms.length} order${ms.length > 1 ? 's' : ''}</span></div><div style="padding:10px 12px;display:flex;flex-direction:column;gap:6px;font-size:12.5px">${ms.map(m => `<div class="line"><span>${esc(m)}</span><span style="color:var(--h-mute)">Track →</span></div>`).join('')}</div>`;
    $('.after').appendChild(r); st.cart = {}; close(); const th = $('.thread'); th.scrollTop = th.scrollHeight;
  }
  root.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t || !root.contains(t)) return;
    if (t.dataset.open) product(t.dataset.open);
    else if (t.dataset.add) { if (st.cart[t.dataset.add]) delete st.cart[t.dataset.add]; else add(t.dataset.add); refresh(); }
    else if (t.dataset.addp) { add(t.dataset.addp); close(); }
    else if (t.dataset.buy) { add(t.dataset.buy); checkout(); }
    else if (t.classList.contains('go')) checkout();
    else if ('close' in t.dataset) close();
    else if ('pay' in t.dataset) pay();
    else if ('finish' in t.dataset) finish();
    else if ('closepop' in t.dataset) $('.popup').classList.remove('on');
  });
  scrim.addEventListener('click', close);
  if (opts.popup) $('.popup').classList.add('on');
  refresh();
  return {
    popup(){ $('.popup').classList.add('on'); },
    setLow(v){ st.low = v; if (sheet.classList.contains('on') && body.querySelector('[data-pay]')) checkout(); }
  };
}

const HOSTNOTE = {
  gpt:['ChatGPT','Lina, 19, Kraków','Runs as an app inside the answer, the way ChatGPT apps render cards today. Tickets and merch from two stores share one cart and one PayPal approval.'],
  meta:['Meta AI in Instagram','Aisha, 27, Milan','The buyer never leaves the DM. Social traffic converts where it happens, and Meta AI has no PayPal checkout yet. This is the largest open audience.'],
  grok:['Grok on X','Marco, 34, Lisbon','Three stores compared in one card, paid from client money in PayPal. X runs its own wallet, so this host is a later partnership.'],
  gem:['Gemini','Daniel, 42, Manchester','Local stock ranked by distance from the delivery address. The balance is short, so the backup card covers the rest automatically.']
};

/* ================= BUSINESS TABS ================= */
const BIZ = [
 () => `<div class="steps">
   <div class="step"><h4>Check your platform</h4><p>Store Sync partners include Wix, BigCommerce, Feedonomics, Cymbio, Shopware and Logicbroker.</p><p class="acc">Done when: your store platform is on the list.</p></div>
   <div class="step"><h4>Turn on Store Sync in PayPal</h4><p>Connect the catalog, inventory and fulfilment once.</p><p class="acc">Done when: products show as synced in PayPal.</p></div>
   <div class="step"><h4>Accept the Chatout beta invite</h4><p>Your synced products become available to AI chats in the beta.</p><p class="acc">Done when: a test prompt shows your product card.</p></div>
   <div class="step"><h4>Watch the AI channel</h4><p>Orders arrive in PayPal Business marked “AI chat” with the host name.</p><p class="acc">Done when: the first beta order appears with its source.</p></div>
  </div>${srcLine('dc','zk')}`,
 () => `<p class="prose">For any site: one script tag. It adds the PayPal button next to your card and Apple Pay buttons and registers the products on the page for AI chats.</p>
  <div class="code"><button class="pill sm copy" data-copy="embed">Copy</button><pre id="embed"><span class="c">&lt;!-- Paste before &lt;/body&gt; on your product pages --&gt;</span>
<span class="k">&lt;script</span> <span class="t">src</span>=<span class="s">"https://YOUR-CHATOUT-HOST/embed.js"</span>
        <span class="t">data-merchant</span>=<span class="s">"YOUR_PAYPAL_MERCHANT_ID"</span>
        <span class="t">data-catalog</span>=<span class="s">"/products.json"</span> <span class="t">async</span><span class="k">&gt;&lt;/script&gt;</span>

<span class="c">&lt;!-- Where the button should appear --&gt;</span>
<span class="k">&lt;chatout-pay</span> <span class="t">sku</span>=<span class="s">"TEE-NOVA-BLK-M"</span> <span class="t">currency</span>=<span class="s">"EUR"</span><span class="k">&gt;&lt;/chatout-pay&gt;</span></pre></div>
  <div class="steps"><div class="step"><h4>Paste the script</h4><p>Works in contact forms and custom pages too, as Artem asked.</p><p class="acc">Done when: the PayPal button renders on a product page.</p></div><div class="step"><h4>Verify your domain</h4><p>Required for the beta, blocks fake stores.</p><p class="acc">Done when: the domain shows verified in Chatout.</p></div></div>`,
 () => `<p class="prose">For platforms and developers: create one PayPal order with a purchase unit per merchant. Each unit names its payee, so every store is paid directly.</p>
  <div class="code"><button class="pill sm copy" data-copy="api">Copy</button><pre id="api"><span class="k">POST</span> /v2/checkout/orders
{
  <span class="t">"intent"</span>: <span class="s">"CAPTURE"</span>,
  <span class="t">"purchase_units"</span>: [
    { <span class="t">"reference_id"</span>: <span class="s">"tickets"</span>,
      <span class="t">"payee"</span>: { <span class="t">"merchant_id"</span>: <span class="s">"TICKETS_MERCHANT_ID"</span> },
      <span class="t">"amount"</span>: { <span class="t">"currency_code"</span>: <span class="s">"EUR"</span>, <span class="t">"value"</span>: <span class="s">"79.00"</span> } },
    { <span class="t">"reference_id"</span>: <span class="s">"merch"</span>,
      <span class="t">"payee"</span>: { <span class="t">"merchant_id"</span>: <span class="s">"MERCH_MERCHANT_ID"</span> },
      <span class="t">"amount"</span>: { <span class="t">"currency_code"</span>: <span class="s">"EUR"</span>, <span class="t">"value"</span>: <span class="s">"39.90"</span> } }
  ]
}</pre></div>
  <div class="steps"><div class="step"><h4>Listen for webhooks</h4><p>PAYMENT.CAPTURE.COMPLETED creates the order in your system.</p><p class="acc">Done when: a sandbox capture creates an order automatically.</p></div></div>`
];

/* ================= ROUTER + SHELL ================= */
const view = document.getElementById('view');
const ALL = [...PAGES.map(p => p.id), ...PERSONAS.map(p => 'persona-' + p.key)];
let pendingHost = null;

function buildNav(){
  document.getElementById('railnav').innerHTML = GROUPS.map(g => `<div class="rail-group"><span class="eyebrow">${g.name}</span>${PAGES.filter(p => p.g === g.id).map(p => `<a class="lnk" href="#${p.id}" data-p="${p.id}"><span class="ix">${String(PAGES.indexOf(p)).padStart(2,'0')}</span>${p.t}</a>`).join('')}</div>`).join('');
  document.getElementById('tabbar').innerHTML = GROUPS.map(g => { const first = PAGES.find(p => p.g === g.id && p.id !== 'start') ; return `<a href="#${g.id === 'story' ? 'start' : first.id}" data-g="${g.id}"><svg viewBox="0 0 20 20" fill="none"><path d="${g.icon}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${g.name}</a>`; }).join('');
}

function route(){
  let id = (location.hash || '#start').slice(1);
  if (!ALL.includes(id)) id = 'start';
  const persona = id.startsWith('persona-') ? PERSONAS.find(p => 'persona-' + p.key === id) : null;
  const page = persona ? PAGES.find(p => p.id === 'personas') : PAGES.find(p => p.id === id);
  const i = PAGES.indexOf(page);
  let html = persona ? R.persona(persona) : R[id]();
  let prev, next;
  if (persona) { const k = PERSONAS.indexOf(persona); prev = k > 0 ? {id:'persona-' + PERSONAS[k-1].key, t:PERSONAS[k-1].name} : {id:'personas', t:'All personas'}; next = k < PERSONAS.length - 1 ? {id:'persona-' + PERSONAS[k+1].key, t:PERSONAS[k+1].name} : {id:'concept', t:'The concept'}; }
  else { prev = i > 0 ? PAGES[i-1] : null; next = i < PAGES.length - 1 ? PAGES[i+1] : null; }
  html += `<nav class="pager">${prev ? `<a href="#${prev.id}"><span class="eyebrow">← Back</span><b>${prev.t}</b></a>` : ''}${next ? `<a class="next" href="#${next.id}"><span class="eyebrow">Next →</span><b>${next.t}</b></a>` : ''}</nav>`;
  view.innerHTML = `<div class="page">${html}</div>`;
  document.querySelectorAll('.rail a.lnk').forEach(a => a.setAttribute('aria-current', a.dataset.p === page.id ? 'page' : 'false'));
  document.querySelectorAll('.tabbar a').forEach(a => a.setAttribute('aria-current', a.dataset.g === page.g ? 'true' : 'false'));
  document.getElementById('tbTitle').textContent = persona ? persona.name + ', ' + persona.age : page.t;
  document.getElementById('tbIdx').textContent = persona ? 'Persona ' + (PERSONAS.indexOf(persona) + 1) + ' / ' + PERSONAS.length : GROUPS.find(g => g.id === page.g).name + ' · ' + String(i).padStart(2,'0') + ' / ' + String(PAGES.length - 1).padStart(2,'0');
  document.getElementById('tbBack').style.visibility = id === 'start' ? 'hidden' : 'visible';
  document.getElementById('rail').classList.remove('open');
  window.scrollTo(0, 0);
  try { view.focus({preventScroll:true}); } catch(e) {}
  after(id);
}

function after(id){
  if (id === 'market') {
    const p = document.getElementById('cPlat'), a = document.getElementById('cPP'), b = document.getElementById('cBal');
    const upd = () => { document.getElementById('oPP').textContent = a.value + '%'; document.getElementById('oBal').textContent = b.value + '%'; document.getElementById('oRes').textContent = fmt(Math.round(+p.value * a.value / 100 * b.value / 100)); };
    [p, a, b].forEach(x => x.addEventListener('input', upd)); upd();
  }
  if (id === 'surfaces') {
    let ctl, low = false, cur = pendingHost || 'gpt'; pendingHost = null;
    const show = h => { cur = h; low = false; document.getElementById('ctlLow').textContent = 'Low balance: off';
      document.querySelectorAll('#hostTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.h === h));
      const n = HOSTNOTE[h]; document.getElementById('hostNote').innerHTML = `<span class="eyebrow">${n[1]}</span><h3>${n[0]}</h3><p class="prose" style="margin-top:8px">${n[2]}</p>`;
      ctl = mountDevice(document.getElementById('devHost'), h); };
    document.querySelectorAll('#hostTabs button').forEach(b => b.onclick = () => show(b.dataset.h));
    document.getElementById('ctlPop').onclick = () => ctl.popup();
    document.getElementById('ctlLow').onclick = e => { low = !low; ctl.setLow(low); e.target.textContent = 'Low balance: ' + (low ? 'on' : 'off'); };
    document.getElementById('ctlReset').onclick = () => show(cur);
    show(cur);
  }
  if (id === 'plan') {
    const show = i => { document.querySelectorAll('#planTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.pl == i)); const [n, when, rows] = PLAN[i]; document.getElementById('planBody').innerHTML = planBlock(n + ' · ' + when, rows); };
    document.querySelectorAll('#planTabs button').forEach(b => b.onclick = () => show(+b.dataset.pl)); show(0);
  }
  if (id === 'session') {
    document.querySelectorAll('#sesTabs button').forEach(b => b.onclick = () => { document.querySelectorAll('#sesTabs button').forEach(x => x.setAttribute('aria-selected', x === b)); document.getElementById('sesSaid').hidden = b.dataset.s !== 'said'; document.getElementById('sesChecked').hidden = b.dataset.s !== 'checked'; });
  }
  if (id === 'nudges') mountDevice(document.getElementById('devNudge'), 'gpt', {popup:true});
  if (id === 'connect-business') {
    const show = i => { document.querySelectorAll('#bizTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.b == i)); document.getElementById('bizBody').innerHTML = BIZ[i](); };
    document.querySelectorAll('#bizTabs button').forEach(b => b.onclick = () => show(+b.dataset.b)); show(0);
  }
  if (id === 'pitch') {
    const btn = document.getElementById('copyMail');
    btn.onclick = () => { const t = 'pichugin.workspace@gmail.com'; const ok = () => btn.textContent = 'Copied';
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, () => btn.textContent = t); else btn.textContent = t; };
  }
  view.querySelectorAll('[data-host]').forEach(a => a.addEventListener('click', () => pendingHost = a.dataset.host));
}

view.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]'); if (!c) return;
  const txt = document.getElementById(c.dataset.copy).innerText;
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => c.textContent = 'Copied', () => { const r = document.createRange(); r.selectNodeContents(document.getElementById(c.dataset.copy)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
});
document.getElementById('railClose').onclick = () => document.getElementById('rail').classList.remove('open');
document.getElementById('tbMenu').onclick = () => document.getElementById('rail').classList.add('open');
document.getElementById('tbBack').onclick = () => {
  const id = (location.hash || '#start').slice(1);
  if (id.startsWith('persona-')) location.hash = 'personas';
  else location.hash = 'start';
};
document.getElementById('rail').addEventListener('click', e => { if (e.target.closest('a')) document.getElementById('rail').classList.remove('open'); });
window.addEventListener('hashchange', route);
buildNav(); route();
