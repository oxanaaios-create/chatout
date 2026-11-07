/* ================= DATA ================= */
const SRC = {
  sec:{t:'PayPal Q3 2026 earnings release, SEC 8-K, 27 Oct 2026',u:'https://www.sec.gov/Archives/edgar/data/0001633917/000163391726000086/pypl3q-26earningsrelease.htm'},
  ab:{t:'American Banker, PayPal partners with Microsoft, 21 Jan 2026',u:'https://www.americanbanker.com/payments/news/paypal-partners-with-microsoft-to-expand-agentic-commerce'},
  dc:{t:'Digital Commerce 360, PayPal agentic commerce services, 28 Oct 2025',u:'https://www.digitalcommerce360.com/2025/10/28/paypal-agentic-commerce-ai-driven-shopping-services/'},
  rs:{t:'Retail Systems, ChatGPT adds PayPal checkout, 29 Oct 2025',u:'https://retail-systems.com/rs/ChatGPT_Adds_PayPal_Checkout_As_AI_Shopping_Expands.php'},
  tc:{t:'TechCrunch, PayPal partners with OpenAI, 28 Oct 2025',u:'https://techcrunch.com/2025/10/28/paypal-partners-with-openai-to-let-users-pay-for-their-shopping-within-chatgpt'},
  zk:{t:'Nasdaq / Zacks, PayPal agentic commerce expansion, 2026',u:'https://www.nasdaq.com/articles/paypals-agentic-commerce-expansion-will-it-boost-top-line-growth'},
  pr:{t:'Presenc.ai, AI assistant monthly users, May 2026',u:'https://presenc.ai/research/ai-assistant-monthly-active-users-2026'},
  xm:{t:'Roboin, X Money limited beta, 26 Jun 2026',u:'https://roboin.io/article/en/2026/06/26/x-money-launches-limited-beta-for-paid-users-in-the-us/'},
  dp:{t:'Devpost, PayPal AI Hackathon',u:'https://paypalaihackathon.devpost.com/'},
  pb:{t:'PayPal Developer Blog, hackathon announcement',u:'https://developer.paypal.com/community/blog/PayPal_AI_Hackathon'}
};

const GROUPS = [
  {id:'story',  name:'Story',    icon:'M4 5h12M4 10h12M4 15h7'},
  {id:'market', name:'Market',   icon:'M4 15V9M8.5 15V5M13 15v-4M17 15V7'},
  {id:'product',name:'Product',  icon:'M5 4.5h10a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 15 13.5H9.5L6 16.5v-3H5A1.5 1.5 0 0 1 3.5 12V6A1.5 1.5 0 0 1 5 4.5Z'},
  {id:'launch', name:'Launch',   icon:'M10 3.5c3 2 4.5 5 4.5 8.5H5.5C5.5 8.5 7 5.5 10 3.5ZM8 12v3.5M12 12v3.5M10 7.5v.5'},
  {id:'proposal',name:'Proposal',icon:'M5.5 3.5h6l3 3v10h-9zM11.5 3.5v3h3M7.5 10h5M7.5 13h5'}
];

const PAGES = [
  {id:'start',     g:'story',   t:'Overview'},
  {id:'session',   g:'story',   t:'From our session'},
  {id:'problem',   g:'story',   t:'The problem'},
  {id:'market',    g:'market',  t:'Market in numbers'},
  {id:'landscape', g:'market',  t:'What already exists'},
  {id:'audience',  g:'market',  t:'Audience 16–55'},
  {id:'personas',  g:'market',  t:'Personas and flows'},
  {id:'concept',   g:'product', t:'The concept'},
  {id:'how',       g:'product', t:'How it works'},
  {id:'map',       g:'product', t:'Product map'},
  {id:'surfaces',  g:'product', t:'In each chat'},
  {id:'checkout',  g:'product', t:'Checkout rules'},
  {id:'nudges',    g:'product', t:'5 things to do now'},
  {id:'ideas',     g:'product', t:'Two game changers'},
  {id:'connect-user',     g:'launch', t:'Connect: buyer'},
  {id:'connect-business', g:'launch', t:'Connect: business'},
  {id:'security',  g:'launch',  t:'Security and trust'},
  {id:'beta',      g:'launch',  t:'Beta: 0 to 1,000'},
  {id:'metrics',   g:'launch',  t:'What we measure'},
  {id:'architecture', g:'proposal', t:'Architecture'},
  {id:'plan',      g:'proposal', t:'Development plan'},
  {id:'budget',    g:'proposal', t:'Budget and fees'},
  {id:'prototype', g:'proposal', t:'Working prototype'},
  {id:'video',     g:'proposal', t:'Video and tech deck'},
  {id:'pitch',     g:'proposal', t:'Let’s build it'}
];

/* ---------- personas ---------- */
const PERSONAS = [
 {key:'lina',name:'Lina',age:19,role:'Student, part-time barista',city:'Kraków',color:'#F2C6A6',host:'gpt',hostName:'ChatGPT',
  quote:'I want the ticket and the tour tee before they sell out. I don’t have a credit card.',
  money:'Around €230 sits in PayPal from resold tickets and second-hand sales. No credit card yet.',
  prompt:'When is Nova Lane playing in Kraków? I want tickets and the tour tee.',
  buys:'Concert tickets, merch, sneakers',
  now:[
   {t:'Asks the AI for dates',k:'chat'},
   {t:'Opens the ticket site',k:'site'},
   {t:'Picks date and seat',k:'site'},
   {t:'Creates an account',k:'login',p:'Account wall before paying'},
   {t:'Card form first',k:'pay',p:'PayPal hidden under “more methods”'},
   {t:'Opens the merch store',k:'site',p:'Second store, new tab'},
   {t:'Finds tee and size',k:'site'},
   {t:'Types address again',k:'form',p:'Same data, second time'},
   {t:'Logs into PayPal again',k:'login',p:'Password + code on a small screen'}
  ],
  ideal:[
   {t:'Asks the AI',k:'chat'},
   {t:'Dates, seats and merch in one message',k:'chat'},
   {t:'Taps ticket and tee size',k:'chat'},
   {t:'Pays from PayPal balance, Face ID',k:'pay'},
   {t:'Agent books both, receipts in chat',k:'done'}
  ],
  win:'Ticket and merch paid in one approval, from money she already had.'},
 {key:'marco',name:'Marco',age:34,role:'Freelance designer',city:'Lisbon',color:'#A9C8F0',host:'grok',hostName:'Grok on X',
  quote:'My clients pay me through PayPal. The shop I want only takes cards.',
  money:'Client payments arrive in PayPal every month. Moving them to the bank takes extra steps and time.',
  prompt:'Compare the three best drawing tablets under €400 and where to buy them.',
  buys:'Gear, software, courses, travel',
  now:[
   {t:'Sees a post about a tablet',k:'chat'},
   {t:'Opens three shops to compare',k:'site',p:'Three tabs, three layouts'},
   {t:'Best price shop: cards only',k:'pay',p:'PayPal not accepted'},
   {t:'Withdraws PayPal to bank',k:'form',p:'Waits for the transfer'},
   {t:'Returns, price changed',k:'site',p:'Lost the deal'},
   {t:'Pays by card',k:'pay'}
  ],
  ideal:[
   {t:'Asks Grok to compare',k:'chat'},
   {t:'Three shops side by side in one card',k:'chat'},
   {t:'Pays from PayPal balance',k:'pay'},
   {t:'Tracking appears in the thread',k:'done'}
  ],
  win:'Client money is spent where he already reads, with no bank detour.'},
 {key:'daniel',name:'Daniel',age:42,role:'Homeowner, weekend DIY',city:'Manchester',color:'#BFE3C9',host:'gem',hostName:'Gemini',
  quote:'Five hardware stores near me. Which one has these screws today?',
  money:'Uses PayPal as the safe default for unfamiliar shops, with a card behind it.',
  prompt:'I need 40 mm wood screws and a 3 mm bit, delivered today if possible.',
  buys:'DIY parts, tools, garden, home',
  now:[
   {t:'Searches for the part',k:'chat'},
   {t:'Checks stock on five sites',k:'site',p:'Five sites, one item'},
   {t:'Compares distance and delivery',k:'site',p:'Mental math on a phone'},
   {t:'Guest checkout, types card',k:'form',p:'Card and address again'},
   {t:'One item missing, second order',k:'pay',p:'Two deliveries'}
  ],
  ideal:[
   {t:'Asks with a photo',k:'chat'},
   {t:'Nearest store with stock, by delivery address',k:'chat'},
   {t:'Adds screws and bit',k:'chat'},
   {t:'PayPal pays, backup card covers the rest',k:'pay'},
   {t:'Pickup time in the thread',k:'done'}
  ],
  win:'The nearest store with stock wins the sale, not the best SEO.'},
 {key:'aisha',name:'Aisha',age:27,role:'Marketing coordinator',city:'Milan',color:'#F3B9D0',host:'meta',hostName:'Meta AI in Instagram',
  quote:'I saw the jacket in a Reel. By the time the site loaded I lost interest.',
  money:'Keeps a PayPal balance from refunds and sold items. Prefers buyer protection for new brands.',
  prompt:'Where is this jacket from? Show me similar ones in my size.',
  buys:'Fashion, beauty, small brands from social',
  now:[
   {t:'Sees outfit in a Reel',k:'chat'},
   {t:'Taps link in bio',k:'site',p:'Leaves the app'},
   {t:'Slow mobile site, finds item',k:'site'},
   {t:'Size chart, creates account',k:'login',p:'Account wall'},
   {t:'Shipping cost at the last step',k:'pay',p:'Abandons the cart'}
  ],
  ideal:[
   {t:'Asks Meta AI in DM',k:'chat'},
   {t:'Product card with gallery and similar items',k:'chat'},
   {t:'Picks size, sees total with shipping',k:'chat'},
   {t:'Pays with PayPal, stays in the app',k:'pay'},
   {t:'Order confirmation in DM',k:'done'}
  ],
  win:'Social traffic converts where it happens.'},
 {key:'tom',name:'Tom',age:52,role:'Owner, ceramics shop on Wix',city:'Bristol',color:'#E6D3A3',host:'biz',hostName:'PayPal Business',
  quote:'People find us through AI now. I can’t see if any of it turns into sales.',
  money:'Receives payments into a PayPal Business account. No developer on staff.',
  prompt:'(Merchant side) How do I sell inside AI chats without rebuilding my site?',
  buys:'Sells handmade ceramics, ships across the EU',
  now:[
   {t:'AI mentions the shop as a link',k:'chat'},
   {t:'Buyer lands on the site',k:'site'},
   {t:'Browses, opens checkout',k:'site'},
   {t:'Long form, drops off',k:'form',p:'Lost at the form'},
   {t:'Tom sees no source data',k:'site',p:'AI traffic invisible'}
  ],
  ideal:[
   {t:'Turns on Store Sync or pastes one script',k:'form'},
   {t:'Products appear as cards in chats',k:'chat'},
   {t:'Buyers pay with PayPal in chat',k:'pay'},
   {t:'Funds and order in Business account',k:'done'},
   {t:'Dashboard shows the AI channel',k:'done'}
  ],
  win:'A new sales channel with one switch and proof in the dashboard.'},
 {key:'sofia',name:'Sofia',age:31,role:'Parent, project manager',city:'Warsaw',color:'#C9C2F2',host:'gpt',hostName:'ChatGPT',
  quote:'At six o’clock I need dinner ordered and tomorrow sorted. Fast.',
  money:'PayPal linked to her main card. Uses it to avoid typing card details on new sites.',
  prompt:'Order dinner for 3, nothing spicy, and remind me what the kids need for school.',
  buys:'Food delivery, groceries, kids, household',
  now:[
   {t:'Opens a delivery app',k:'site'},
   {t:'Scrolls three restaurants',k:'site',p:'Decision fatigue'},
   {t:'App asks to log in again',k:'login',p:'Session expired'},
   {t:'Pays',k:'pay'},
   {t:'School supplies on another site',k:'site',p:'Second checkout'}
  ],
  ideal:[
   {t:'Sees “5 things to do now”',k:'chat'},
   {t:'Taps “Order dinner”',k:'chat'},
   {t:'Two options with delivery time',k:'chat'},
   {t:'Adds school supplies, one PayPal approval',k:'pay'},
   {t:'Both deliveries tracked in chat',k:'done'}
  ],
  win:'Two errands closed in one approval.'},
 {key:'ken',name:'Ken',age:24,role:'Junior developer',city:'Austin',color:'#9FDCE0',host:'grok',hostName:'Grok on X',
  quote:'Part of my savings is crypto in PayPal. Spending it is a project.',
  money:'Holds crypto in his PayPal account next to a small cash balance.',
  prompt:'Find me noise-cancelling headphones under $300 and let me pay with my crypto.',
  buys:'Tech, games, subscriptions',
  phase:'Phase 3. Only in markets where PayPal crypto checkout is available.',
  now:[
   {t:'Finds headphones',k:'chat'},
   {t:'Opens the store',k:'site'},
   {t:'Sells crypto in PayPal',k:'form',p:'Manual conversion'},
   {t:'Waits, then checks out',k:'pay',p:'Price moved meanwhile'},
   {t:'Logs in again to pay',k:'login',p:'Second login'}
  ],
  ideal:[
   {t:'Asks Grok',k:'chat'},
   {t:'Picks headphones in the card',k:'chat'},
   {t:'Chooses crypto as the funding source',k:'pay'},
   {t:'PayPal converts at checkout, merchant gets cash',k:'done'}
  ],
  win:'Crypto becomes spendable without a separate sell step.'},
 {key:'elena',name:'Elena',age:45,role:'Lead developer at a digital agency',city:'Berlin',color:'#D9D4C4',host:'dev',hostName:'Developer console',
  quote:'Every AI platform wants its own checkout integration. My clients want one.',
  money:'Builds shops and AI agents for 20 small clients.',
  prompt:'(Builder side) One integration that makes my clients’ shops payable in every chat.',
  buys:'Integrates payments for clients',
  now:[
   {t:'Client asks for AI sales',k:'chat'},
   {t:'Separate program per AI platform',k:'site',p:'Different specs and reviews'},
   {t:'Builds custom checkout each time',k:'form',p:'Weeks of work'},
   {t:'Maintains several integrations',k:'site',p:'Breaks on every update'}
  ],
  ideal:[
   {t:'Adds the client to the gateway',k:'form'},
   {t:'Embed script or MCP server, once',k:'form'},
   {t:'Sandbox test, then live',k:'pay'},
   {t:'Client sees AI sales in PayPal',k:'done'}
  ],
  win:'Agent builders get a product to sell. PayPal gets every client they build.'}
];

/* ---------- surfaces: host scenarios ---------- */
const SCEN = {
 gpt:{host:'ChatGPT',sub:'concept for the ChatGPT app',user:'When is Nova Lane playing in Kraków? I want tickets and the tour tee.',
  reply:'Nova Lane plays Tauron Arena Kraków on 14 and 15 March. Tickets and official tour merch are below, all payable with PayPal.',
  head:'Nova Lane · Kraków',
  items:[
   {id:'t1',n:'Standing ticket · 14 Mar',m:'Tour Tickets EU',p:79,a:'ticket',c:'#2B2B3F',opts:['General entry']},
   {id:'t2',n:'Seat, Block C · 15 Mar',m:'Tour Tickets EU',p:94,a:'ticket',c:'#3F2B33',opts:['Row 4','Row 9']},
   {id:'m1',n:'Tour tee, black',m:'Nova Lane Store',p:35,a:'tee',c:'#1C1C1C',opts:['S','M','L','XL']},
   {id:'m2',n:'Tour hoodie',m:'Nova Lane Store',p:69,a:'hoodie',c:'#5A6B8C',opts:['S','M','L','XL']},
   {id:'m3',n:'Poster, signed',m:'Nova Lane Store',p:25,a:'poster',c:'#C7553B',opts:['A2']}
  ],
  similar:['Venue map','Parking at Tauron','Hotels nearby','Setlist'],balance:230.40},
 grok:{host:'Grok',sub:'concept for Grok on X',user:'Compare the three best drawing tablets under €400 and where to buy them.',
  reply:'Three picks people on X rate highly this month. Prices are live from each store. Your PayPal balance covers all three.',
  head:'Drawing tablets under €400',
  items:[
   {id:'g1',n:'Pen display 13″',m:'Pixel Supply',p:349,a:'tablet',c:'#24303B',opts:['Black']},
   {id:'g2',n:'Pen tablet M, wireless',m:'Atelier Tech',p:189,a:'tablet',c:'#3A3A3A',opts:['Grey']},
   {id:'g3',n:'Pen display 12″ Lite',m:'NorthDesk',p:279,a:'tablet',c:'#2E3B2E',opts:['Black','White']},
   {id:'g4',n:'Matte screen film',m:'Pixel Supply',p:19,a:'film',c:'#6A7A8C',opts:['13″']}
  ],
  similar:['Compare specs','Reviews on X','Bundles'],balance:612.00},
 meta:{host:'Meta AI',sub:'concept for Meta AI in Instagram DMs',user:'Where is this jacket from? Show me similar ones in my size.',
  reply:'That’s the Ridge Field Jacket from Oro Studio. Here it is with two similar picks. Your size M is in stock.',
  head:'Field jackets · size M',
  items:[
   {id:'j1',n:'Ridge Field Jacket',m:'Oro Studio',p:148,a:'jacket',c:'#7A6A4F',opts:['S','M','L']},
   {id:'j2',n:'Waxed cotton jacket',m:'Northline',p:132,a:'jacket',c:'#3E4A3A',opts:['S','M','L']},
   {id:'j3',n:'Cropped utility jacket',m:'Oro Studio',p:119,a:'jacket',c:'#A88F6A',opts:['XS','S','M']},
   {id:'j4',n:'Canvas tote',m:'Oro Studio',p:39,a:'tote',c:'#D8C9A8',opts:['One size']}
  ],
  similar:['Complete the look','Same creator','Under €100'],balance:186.25},
 gem:{host:'Gemini',sub:'concept for the Gemini app',user:'I need 40 mm wood screws and a 3 mm drill bit, delivered today if possible.',
  reply:'Two stores near your delivery address have both in stock. ToolBarn is closest, 1.2 km, with delivery by 18:00.',
  head:'Near 14 Oak Rd · today',
  items:[
   {id:'d1',n:'Wood screws 4×40, 200 pcs',m:'ToolBarn · 1.2 km',p:8.9,a:'screws',c:'#8C8C8C',opts:['200 pcs','500 pcs']},
   {id:'d2',n:'HSS drill bit 3 mm, 2 pcs',m:'ToolBarn · 1.2 km',p:4.5,a:'bit',c:'#4F5B66',opts:['2 pcs']},
   {id:'d3',n:'Wood screws 4×40, 250 pcs',m:'Fix&Co · 2.8 km',p:9.6,a:'screws',c:'#9B8C6A',opts:['250 pcs']},
   {id:'d4',n:'Cordless drill 18V',m:'Fix&Co · 2.8 km',p:79,a:'drill',c:'#C9612E',opts:['Body only','With battery']}
  ],
  similar:['Wall plugs','Wood glue','Rent a drill'],balance:24.10}
};
