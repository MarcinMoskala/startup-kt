// Startup.kt RULES BOOKLET: content and layout. Needs cards.js, data/*.js and boards.js (renderCard, renderBack,
// renderBoard, BOARD_STARTUPS, Kit, iconAt, C, TYPES). Page = 106 x 196 mm (100 x 190 trim + 3 mm bleed); every figure
// is an inline SVG in millimetres. Source of truth for the rules: RULES.md and core/.../engine/Cards.kt.
(() => {
const N_PAGES = 12;
let nsN = 0;
const nsid = p => `${p}${++nsN}`;
const card = id => { const c = CARDS.find(c => c.id === id); if (!c) throw new Error('no card ' + id); return c; };
const startup = id => BOARD_STARTUPS.find(s => s.id === id);
const MONOF = 'JetBrains Mono, monospace';
const SANS = 'Inter, system-ui, sans-serif';

// ---------- inline icons ----------
const CLOCK = `<circle cx="5" cy="5" r="4.2" fill="none" stroke="currentColor" stroke-width="1"/><path d="M5 2.6V5L6.8 6.2" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>`;
function I(name, n) {
  if (name === 'chain') return `<svg class="ic" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.8" fill="#7F52FF"/><use href="#i-chain" x="1.7" y="1.7" width="6.6" height="6.6" color="#fff"/></svg>`;
  if (name === 'person') return `<svg class="ic" viewBox="0 0 10 10"><use href="#i-person" x="0" y="0" width="10" height="10"/></svg>`;
  if (name === 'clock') return `<svg class="ic" viewBox="0 0 10 10" style="color:${C.muted}">${CLOCK}</svg>`;
  if (name === 'fstar') return `<svg class="ic" viewBox="0 0 10 10"><use href="#i-star" x=".4" y=".4" width="9.2" height="9.2" fill="${TYPES.feature.color}"/></svg>`;
  // inline, a number inside a star is too small to read: write it in front of the star instead
  if (name === 'star' && n != null) return `<b class="sn">${n}</b>${I('star')}`;
  return `<svg class="ic" viewBox="0 0 10 10" font-family="${MONOF}">${iconAt(name, n == null ? null : n, 0, 0, 10)}</svg>`;
}
// big numbered icon (coin or star with the number inside), size in mm
const BIG = (name, n, s) => fig(s, s, iconAt(name, n, 0, 0, s));
// "{frontend} and {coin:2}" -> text with inline icons
const R = s => s.replace(/\{(\w+)(?::(\d+))?\}/g, (_, a, b) => I(a, b == null ? null : +b));

// ---------- placing the real print designs inside figures ----------
const cardInner = (id, ns, players) => { const c = card(id);
  return renderCard(c, { guides: false, ns, players: players || c.copies[0] }).replace('viewBox="0 0 69 94"', 'x="0" y="0" width="63" height="88" viewBox="3 3 63 88"'); };
const backInner = (s, ns) => renderBack(s, { ns }).replace('viewBox="0 0 69 94"', 'x="0" y="0" width="63" height="88" viewBox="3 3 63 88"');
// card with its top-left corner at (x, y), w mm wide, rotated about its centre
function placeCard(id, x, y, w, { rot = 0, shadow = true, players, back } = {}) {
  const k = w / 63, ns = nsid('c');
  const inner = back ? backInner(back, ns) : cardInner(id, ns, players);
  return `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${88 * k / 2}) scale(${k})">
    ${shadow ? `<rect x="0.6" y="2.2" width="63" height="88" rx="3.4" fill="#000" opacity=".22"/><rect x="0.3" y="1" width="63" height="88" rx="3.2" fill="#000" opacity=".3"/>` : ''}
    <clipPath id="${ns}-k"><rect width="63" height="88" rx="3"/></clipPath>
    <g clip-path="url(#${ns}-k)">${inner}</g></g>`;
}
// board (195 x 100 trim) or a crop of it, given in board bleed coordinates [x, y, w, h]
function placeBoard(id, x, y, w, { crop = [3, 3, 195, 100], rx = 3, shadow = true } = {}) {
  const [cx, cy, cw, ch] = crop, k = w / cw, ns = nsid('b');
  const svg = renderBoard(startup(id), { guides: false, ns }).replace('viewBox="0 0 201 106"', `x="0" y="0" width="${cw}" height="${ch}" viewBox="${cx} ${cy} ${cw} ${ch}"`);
  return `<g transform="translate(${x} ${y}) scale(${k})">
    ${shadow ? `<rect x=".5" y="1.6" width="${cw}" height="${ch}" rx="${rx}" fill="#000" opacity=".35"/>` : ''}
    <clipPath id="${ns}-k"><rect width="${cw}" height="${ch}" rx="${rx}"/></clipPath>
    <g clip-path="url(#${ns}-k)">${svg}</g></g>`;
}
const fig = (w, h, inner, style = '') => `<svg class="fig" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:${w}mm;height:${h}mm;${style}" font-family="${MONOF}">${inner}</svg>`;
const cardImg = (id, w, opts = {}) => fig(w, w * 88 / 63, `<g transform="scale(${w / 63})">${placeCard(id, 0, 0, 63, { shadow: false, ...opts })}</g>`);
const backImg = (s, w) => fig(w, w * 88 / 63, `<g transform="scale(${w / 63})">${placeCard(null, 0, 0, 63, { shadow: false, back: s })}</g>`);
const marker = (n, x, y, r = 2.1) => `<circle cx="${x}" cy="${y}" r="${r + .45}" fill="${C.bg}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${C.gold}"/>
  <text x="${x}" y="${(y + r * 0.46).toFixed(2)}" font-size="${(r * 1.25).toFixed(2)}" font-weight="800" fill="#2A1E04" text-anchor="middle">${n}</text>`;
const arrow = (x1, y1, x2, y2, c = C.muted, w = .45) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 1.3;
  const p = (d) => `${(x2 - h * Math.cos(a + d)).toFixed(2)} ${(y2 - h * Math.sin(a + d)).toFixed(2)}`;
  return `<path d="M${x1} ${y1}L${x2} ${y2}M${p(0.5)}L${x2} ${y2}L${p(-0.5)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; };
const lbl = (x, y, t, { size = 2.3, fill = C.muted, anchor = 'start', weight = 700, ls = .15, font = MONOF } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" font-family="${font}">${t}</text>`;
// card-like chip (as on the cards): type icon, name, sprint
const chip = (type, name, sprint) => `<span class="chip" style="--c:${TYPES[type].color}">${type === 'feature' ? I('fstar') : I(type)}<span class="nm">${name}</span><span class="sp">${['', 'I', 'II', 'III'][sprint]}</span></span>`;

// ---------- page shell ----------
const DOTS = ['#F26D6D', C.gold, '#5FB865'];
function page(n, o) {
  const folio = o.noFolio ? '' : `<div class="folio"><span>STARTUP.KT · RULES</span><b>${n}</b></div>`;
  const body = o.raw || `<div class="content">
      <div class="tabbar"><span class="dots">${DOTS.map(c => `<i style="background:${c}"></i>`).join('')}</span><span class="tab">${o.file}</span><span class="kicker">${o.kicker}</span></div>
      ${o.body}</div>`;
  return `<section class="page ${n % 2 ? 'odd' : 'even'}" data-page="${n}" style="--acc:${o.acc}">${body}${folio}</section>`;
}

// =====================================================================================================
// 1 · COVER
// =====================================================================================================
function cover() {
  const fan = ['junior-compose-dev', 'kotlinx-coroutines', 'ktor', 'rest-api', 'seed-round'];
  const cw = 32, top = 47, py = 150;
  const fanSvg = [0, 4, 1, 3, 2].map(i => `<g transform="rotate(${(i - 2) * 8.5} 53 ${py})">${placeCard(fan[i], 53 - cw / 2, top + Math.abs(i - 2) * 1.2, cw)}</g>`).join('');
  const star = (x, y, s, o = 1) => `<use href="#i-star" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3" opacity="${o}"/>`;
  const sparks = [[12, 108, 4.2], [94, 106, 3.6], [9, 137, 2.4, .8], [97, 135, 2.8, .85], [8, 92, 2.2, .6], [98, 90, 2.4, .6]].map(a => star(...a)).join('');
  const floorY = 158;
  const scene = `
    <ellipse cx="53" cy="${floorY + 2.4}" rx="44" ry="2.2" fill="#000" opacity=".35"/>
    ${Kit.dev(24, floorY - 6.5, { k: 1.3, hair: 'curly', hairColor: Kit.HAIR.black, skin: 3, top: C.backend, topStyle: 'hoodie', mood: 'happy', deskW: 24, laptopColor: '#5B5F68' })}
    ${Kit.desk(24, floorY - 6.5, 30.5, { legs: true })}
    ${Kit.robot(53, floorY + 1, { k: 1.32, body: true, arms: 'wave', expression: 'happy' })}
    ${Kit.dev(82, floorY - 6.5, { k: 1.3, hair: 'bun', hairColor: Kit.HAIR.auburn, skin: 1, top: C.frontend, topStyle: 'tee', glasses: true, mood: 'smile', deskW: 24, laptopColor: '#6A5A8C' })}
    ${Kit.desk(82, floorY - 6.5, 30.5, { legs: true })}`;
  const pill = (x, w, icon, t) => `<rect x="${x}" y="168" width="${w}" height="7" rx="3.5" fill="${C.surface}" stroke="${C.border}" stroke-width=".3"/>${icon(x + 2.2, 169.4)}
    <text x="${x + 7.6}" y="172.75" font-size="2.5" font-weight="800" fill="${C.text}">${t}</text>`;
  const svg = `<svg class="fig" viewBox="0 0 106 196" style="width:106mm;height:196mm" font-family="${MONOF}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cv-glow" cx="50%" cy="42%" r="55%"><stop offset="0" stop-color="#7F52FF" stop-opacity=".42"/><stop offset=".45" stop-color="#C711E1" stop-opacity=".12"/><stop offset="1" stop-color="#C711E1" stop-opacity="0"/></radialGradient>
      <radialGradient id="cv-vig" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
    </defs>
    <rect width="106" height="196" fill="#17181B"/>
    <rect width="106" height="196" fill="url(#dots)"/>
    <rect width="106" height="196" fill="url(#cv-glow)"/>
    <rect width="106" height="196" fill="url(#cv-vig)"/>
    <rect x="0" y="0" width="106" height="2.6" fill="url(#bolt)"/>
    ${lbl(53, 17.5, 'A KOTLIN STARTUP CARD GAME', { size: 2.5, fill: C.muted, anchor: 'middle', ls: .55 })}
    <text x="53" y="33.5" font-size="14.2" font-weight="800" text-anchor="middle" letter-spacing="-.3"><tspan fill="${C.text}">Startup</tspan><tspan fill="#F0506E">.</tspan><tspan fill="#B16CFF">kt</tspan></text>
    ${lbl(53, 40.6, 'BUILD · SHIP · COLLECT STARS', { size: 2.5, fill: C.faint, anchor: 'middle', ls: .5 })}
    ${fanSvg}
    ${sparks}
    <text x="53" y="117.4" font-size="3" font-family="${SANS}" font-weight="600" fill="${C.text}" text-anchor="middle">Build a Kotlin startup. Ship the best app.</text>
    <text x="53" y="122.2" font-size="3" font-family="${SANS}" font-weight="600" fill="${C.text}" text-anchor="middle">Collect the most <tspan fill="${C.gold}">★ GitHub Stars</tspan>.</text>
    ${scene}
    ${pill(14.5, 27, (x, y) => `<use href="#i-person" x="${x}" y="${y}" width="4.2" height="4.2"/>`, '2–5 players')}
    ${pill(43.5, 20, (x, y) => `<g transform="translate(${x} ${y}) scale(.42)" style="color:${C.muted}">${CLOCK}</g>`, '20 min')}
    ${pill(65.5, 26, (x, y) => `<use href="#i-star" x="${x}" y="${y}" width="4.2" height="4.2" fill="${C.gold}"/>`, 'ages 10+')}
    ${lbl(53, 183.5, 'RULEBOOK', { size: 2.9, fill: C.text, anchor: 'middle', ls: .9, weight: 800 })}
  </svg>`;
  return page(1, { acc: C.agent, raw: svg, noFolio: true });
}

// =====================================================================================================
// 2 · WELCOME + COMPONENTS
// =====================================================================================================
function welcome() {
  const types = [
    ['team', 'junior-compose-dev', 19, 'Produces {frontend} / {backend} / {agent} for the rest of the game'],
    ['feature', 'login-screen', 30, 'Costs resources, scores {star}'],
    ['library', 'ktor', 10, 'Scores {star:2} and makes features free'],
    ['business', 'seed-round', 16, '{coin} now, or {star} at the end for what you built'],
  ];
  const typeGrid = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2.2mm 3mm">${types.map(([t, id, n, d]) =>
    `<div style="display:grid;grid-template-columns:14.6mm 1fr;gap:2mm;align-items:center">${cardImg(id, 14.6)}<div style="line-height:1.3">
      <div class="mono" style="font-size:7.4pt;font-weight:800;letter-spacing:.06em;color:${TYPES[t].color}">${n} × ${TYPES[t].label}</div>
      <div style="font-size:8pt">${R(d)}</div></div></div>`).join('')}</div>`;
  const backs = fig(39, 20.6, [1, 2, 3].map(s => `<g transform="translate(${1 + (s - 1) * 12.6} .4) rotate(${(s - 2) * 4} 6.5 10.2) scale(${12.4 / 63})">${placeCard(null, 0, 0, 63, { back: s })}</g>`).join(''));
  const board = fig(39, 20.6, placeBoard('suspend-fun-travel', 0, .4, 39));
  const coins = fig(13, 9, [0, 1, 2].map(i => `<use href="#i-coin" x="${i * 3.2}" y="${i % 2 ? 0 : 1.6}" width="6.6" height="6.6"/>`).join(''));
  return page(2, { acc: C.frontend, file: 'README.md', kicker: 'WELCOME', body: `
    <h1>Build a Kotlin <span class="acc">startup</span>.</h1>
    <p class="lead">Each of you runs a young Kotlin startup. Over three <b>Sprints</b> you draft cards, hire a team, build
      features on top of great libraries, close deals and push your startup along its <b>Roadmap</b> from MVP to Exit.
      Whoever collects the most ${I('star')} <b>GitHub Stars</b> wins.</p>
    <div class="row mono" style="gap:1.6mm;margin:1mm 0 .6mm;font-size:7.2pt;font-weight:700;white-space:nowrap">
      <span class="tile" style="flex:1;padding:1.2mm 1.6mm">${I('person')} 2–5 players</span><span class="tile" style="flex:1;padding:1.2mm 1.6mm">${I('clock')} 20 min</span><span class="tile" style="flex:1;padding:1.2mm 1.6mm">${I('star')} ages 10+</span></div>
    <h2>Components</h2>
    <p style="margin-bottom:2mm"><b>75 cards</b> in four types:</p>
    ${typeGrid}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-top:3.4mm">
      <div>${backs}<p style="margin:1.4mm 0 0;font-size:8pt"><b>3 backs</b>, 25 cards each: Sprint <span class="mono" style="color:#FF6B6B;font-weight:800">I</span>, <span class="mono" style="color:#F7C948;font-weight:800">II</span> and <span class="mono" style="color:#8BD450;font-weight:800">III</span>.</p></div>
      <div>${board}<p style="margin:1.4mm 0 0;font-size:8pt"><b>5 Startup boards</b>, each with its own Roadmap.</p></div></div>
    <div class="row" style="margin-top:2.6mm;align-items:center">${coins}<p style="margin:0"><b>Coins</b> ${I('coin')}: the bank. Any coin tokens work.</p></div>
    <div class="note" style="margin-top:3mm"><span class="c">// first game?</span>Read pages 5 and 6, deal the cards and look the rest up as you play. Page 12 is a cheat sheet.</div>
  ` });
}

// =====================================================================================================
// 3 · CARD ANATOMY
// =====================================================================================================
function anatomy() {
  const cx = 21.5, w = 40, k = w / 63, h = 88 * k, top = 7;
  const P = (x, y) => [cx + x * k, top + y * k];   // card trim coords -> figure
  const L = [[1, 9.2, 10.5], [2, 15.2, 17.4], [7, 4, 74], [8, 3.4, 82.6]];   // left markers
  const Rm = [[6, 50, 33], [5, 40, 62.5], [9, 60.2, 82.6]];
  const Tm = [[3, 20, 4.4, 20], [4, 56.1, 3.5, 56.1]];   // top markers: [n, x, y, marker x]
  const dot = (x, y) => `<circle cx="${x}" cy="${y}" r=".7" fill="${C.gold}"/>`;
  const lead = (n, x, y, side) => { const [px, py] = P(x, y), mx = side < 0 ? cx - 5 : cx + w + 5;
    return `<path d="M${mx} ${py}L${px} ${py}" stroke="${C.gold}" stroke-width=".35"/>${dot(px, py)}${marker(n, mx, py)}`; };
  const svg = fig(83, h + top + 1.5, `${placeCard('rest-api', cx, top, w)}
    ${L.map(([n, x, y]) => lead(n, x, y, -1)).join('')}${Rm.map(([n, x, y]) => lead(n, x, y, 1)).join('')}
    ${Tm.map(([n, x, y, mxc]) => { const [px, py] = P(x, y), [mx] = P(mxc, 0);
      return `<path d="M${mx} 2.4L${mx} ${top - 1.4}L${px} ${top - 1.4}L${px} ${py}" fill="none" stroke="${C.gold}" stroke-width=".35"/>${dot(px, py)}${marker(n, mx, 2.4)}`; }).join('')}`);
  const items = [
    [1, 'COST', 'Pay it to build. <b>FREE</b>: no cost.'],
    [2, 'CHAIN', 'Free if you built the card named below.'],
    [3, 'TYPE · NAME', 'Team, Feature, Library or Business.'],
    [4, 'STARS', '{star} it scores at the end.'],
    [5, 'EFFECT', 'What the card does for you.'],
    [6, 'ART', 'Just for looks.'],
    [7, 'FLAVOR', 'Kotlin and a joke. No rules.'],
    [8, 'SPRINT', 'Its deck: I, II or III.'],
    [9, 'PLAYERS', 'Used only with this many players or more.'],
  ];
  const leg = `<div class="legend">${items.map(([n, t, d]) => `<div class="it"><span class="num">${n}</span><div><span class="t">${t}</span>${R(d)}</div></div>`).join('')}</div>`;
  const cropCost = (id, label) => { const ns = nsid('cc');
    const svg = renderCard(card(id), { guides: false, ns }).replace('viewBox="0 0 69 94"', 'x="0" y="0" width="16.4" height="18.8" viewBox="4.6 4.6 16.4 18.8"');
    return `<div style="text-align:center">${fig(16.4, 18.8, `<clipPath id="${ns}-q"><rect width="16.4" height="18.8" rx="1.6"/></clipPath><g clip-path="url(#${ns}-q)">${svg}</g>`, 'margin:0 auto;width:13.4mm;height:15.4mm')}
      <div style="font-size:8pt;line-height:1.25;margin-top:.8mm">${label}</div></div>`; };
  return page(3, { acc: TYPES.feature.color, file: 'Card.kt', kicker: 'ANATOMY', body: `
    <h1>Reading a <span class="acc">card</span></h1>
    ${svg}
    <div style="margin-top:3mm">${leg}</div>
    <h2>Cost boxes</h2>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2mm">
      ${cropCost('junior-backend-dev', 'no cost')}
      ${cropCost('junie', R('pay {coin:2}'))}
      ${cropCost('profile-screen', R('cover {frontend}{frontend}'))}
      ${cropCost('scale-to-1m', R('{coin:2}{backend}{backend}{backend}'))}
    </div>` });
}

// =====================================================================================================
// 4 · STARTUP BOARD + ROADMAP
// =====================================================================================================
function boardPage() {
  const bw = 83, k = bw / 195;
  const P = (x, y) => [x * k, 1 + y * k];   // board trim coords -> figure
  const ms = [[1, 124.4, 29], [2, 124.4, 41.6], [3, 36, 69.3], [4, 132.3, 92.6], [5, 191.7, 92.6], [6, 110, 69.3]];
  const svg = fig(83, 100 * k + 2.5, `${placeBoard('companion', 0, 1, bw)}${ms.map(([n, x, y]) => { const [a, b] = P(x, y); return marker(n, a, b, 1.9); }).join('')}`);
  const items = [
    [1, 'PRODUCES', 'Your own resource, all game.'],
    [2, 'AT START', 'Take this many {coin}.'],
    [3, 'ROADMAP', 'Three stages, in order.'],
    [4, 'STAGE COST', 'Paid like a card cost.'],
    [5, 'REWARD', 'What the stage gives you.'],
    [6, 'ABILITY', 'Your startup’s special power.'],
  ];
  const leg = `<div class="legend">${items.map(([n, t, d]) => `<div class="it"><span class="num">${n}</span><div><span class="t">${t}</span>${R(d)}</div></div>`).join('')}</div>`;
  // tuck illustration: the PMF slot of a board with a card back sliding under its bottom edge
  const sw = 34, sk = sw / 63, sh = 34 * sk, peek = 9;
  const ns = nsid('t');
  const tuck = fig(sw + 6, sh + peek + 1.5, `
    <clipPath id="${ns}-p"><rect x="-2" y="${sh - 6}" width="${sw + 4}" height="${peek + 9}"/></clipPath>
    <g clip-path="url(#${ns}-p)">${placeCard(null, 0, sh + peek - 88 * sk, sw, { back: 2 })}</g>
    ${placeBoard('companion', 0, 0, sw, { crop: [69, 69, 63, 34], rx: 1.6 })}
    <rect x="0" y="${sh - .3}" width="${sw}" height=".6" fill="#000" opacity=".45"/>
    ${arrow(sw + 3.4, sh + peek - 1, sw + 3.4, sh - 4, C.gold, .55)}`);
  return page(4, { acc: '#F0648F', file: 'Startup.kt', kicker: 'YOUR BOARD', body: `
    <h1>Your <span class="acc">startup</span></h1>
    ${svg}
    <div style="margin-top:2.4mm">${leg}</div>
    <h2>The Roadmap</h2>
    <p>Every startup has 3 stages: <b>MVP → Product-Market Fit → Exit</b>. Reach them in order, one per pick, by
      <b>tucking</b> any card from your hand face down under the next stage and paying the stage cost (your team,
      freelancers and ${I('agent')} tokens work exactly like for cards).</p>
    <div class="row" style="align-items:center;gap:2.4mm;margin-top:1.4mm">${tuck}
      <ul class="dots" style="flex:1">
        <li><b>MVP</b> gives ${I('coin')} and ${I('star', 1)}.</li>
        <li><b>Product-Market Fit</b> gives your startup’s special ability.</li>
        <li><b>Exit</b> gives 4–5 ${I('star')}.</li>
      </ul></div>
    <div class="note" style="margin:1.2mm 0 0"><b>Pro tip:</b> tucking a card is also a way to keep it away from your neighbour.</div>` });
}

// =====================================================================================================
// 5 · SETUP
// =====================================================================================================
function setup() {
  const W = 83, H = 60, bw = 27, bh = bw * 100 / 195;
  const cx = W / 2, cy = H / 2;
  const B = (id, x, y, rot) => `<g transform="rotate(${rot} ${x + bw / 2} ${y + bh / 2})">${placeBoard(id, x, y, bw, { rx: 2 })}</g>`;
  const hand = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})">${[-2, -1, 0, 1, 2].map(i => `<g transform="rotate(${i * 9} ${x} ${y + 9})">${placeCard(null, x - 2.6, y - 3.6, 5.2, { back: 1, shadow: false })}</g>`).join('')}</g>`;
  const decks = [1, 2, 3].map(s => [0, 1, 2].map(j => placeCard(null, cx - 16 + (s - 1) * 11.2 + j * .35, cy - 7.4 - j * .45, 9, { back: s, shadow: j === 0 })).join('')).join('');
  const coinPile = [[0, 0], [3, -.6], [1.6, 2], [4.4, 1.6], [2.4, -2.4]].map(([x, y]) => `<use href="#i-coin" x="${cx + 18 + x}" y="${cy - 3 + y}" width="4.6" height="4.6"/>`).join('');
  const svg = fig(W, H, `
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="5" fill="${C.surface}" opacity=".55"/>
    ${B('companion', cx - bw / 2, H - bh - 2.4, 0)}${B('sealed-deals', cx - bw / 2, 2.4, 180)}
    ${B('nullsafe-bank', 2.4 - (bw - bh) / 2, cy - bh / 2, 90)}${B('by-lazy-studio', W - 2.4 - bh - (bw - bh) / 2, cy - bh / 2, -90)}
    ${decks}${coinPile}
    ${lbl(cx - 16 + 4.5, cy + 9.6, 'I', { size: 2.2, fill: '#FF6B6B', anchor: 'middle', weight: 800 })}${lbl(cx - 4.8 + 4.5, cy + 9.6, 'II', { size: 2.2, fill: '#F7C948', anchor: 'middle', weight: 800 })}${lbl(cx + 6.4 + 4.5, cy + 9.6, 'III', { size: 2.2, fill: '#8BD450', anchor: 'middle', weight: 800 })}
    ${lbl(cx + 20.3, cy + 6.4, 'bank', { size: 2, fill: C.muted, anchor: 'middle' })}
    ${hand(cx + 20, H - 12, 0)}${lbl(cx + 20, H - 1.6, '5 cards', { size: 2, fill: C.muted, anchor: 'middle' })}`);
  const mark = t => `<span class="mono" style="display:inline-flex;align-items:center;gap:.6mm;background:var(--surface2);border-radius:.8mm;padding:0 1.2mm;font-weight:800;font-size:7.2pt">${I('person')}${t}</span>`;
  return page(5, { acc: TYPES.team.color, file: 'Setup.kt', kicker: 'SETUP', body: `
    <h1>Setup</h1>
    ${svg}
    <ol class="steps" style="margin-top:3.2mm">
      <li><b>Sort the cards by their back</b> into three decks: Sprint I, II and III.</li>
      <li><b>Remove the cards you don’t need.</b> Every card shows a player mark in its bottom-right corner. Use only the
        cards whose mark is not higher than your player count, and put the rest back in the box:
        <table class="t" style="margin:1.4mm 0 .4mm"><thead><tr><th>PLAYERS</th><th>USE</th><th>CARDS PER SPRINT</th></tr></thead><tbody>
          <tr><td class="mono"><b>3</b></td><td>${mark('3+')}</td><td>15</td></tr>
          <tr><td class="mono"><b>4</b></td><td>${mark('3+')} ${mark('4+')}</td><td>20</td></tr>
          <tr><td class="mono"><b>5</b></td><td>${mark('3+')} ${mark('4+')} ${mark('5+')}</td><td>25 (all)</td></tr>
          <tr><td class="mono"><b>2</b></td><td>${mark('3+')} ${mark('4+')}</td><td>20 · Duel, p. 11</td></tr>
        </tbody></table></li>
      <li><b>Shuffle each deck</b> on its own.</li>
      <li>Each player draws a <b>Startup board</b> and takes the ${I('coin')} shown under <span class="mono"><b>AT START</b></span> from the bank.</li>
      <li><b>Deal 5 Sprint I cards</b> to each player (Duel: 8). Keep the other decks aside.</li>
    </ol>` });
}

// =====================================================================================================
// 6 · PLAYING A SPRINT
// =====================================================================================================
function playing() {
  const mini = (x, y, col, w = 7.4, rot = 0, faceDown = false) => { const h = w * 88 / 63;
    return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + .3}" y="${y + .6}" width="${w}" height="${h}" rx="${w * .07}" fill="#000" opacity=".35"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * .07}" fill="${faceDown ? '#26272B' : C.bg}" stroke="${faceDown ? '#F7C948' : C.border}" stroke-width=".25"/>
      ${faceDown ? `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w * .26}" fill="none" stroke="#F7C948" stroke-width=".35"/>` :
      `<rect x="${x}" y="${y}" width="${w}" height="${h * .25}" rx="${w * .07}" fill="${col}"/><rect x="${x}" y="${y + h * .18}" width="${w}" height="${h * .07}" fill="${col}"/>
      <rect x="${x + w * .1}" y="${y + h * .32}" width="${w * .8}" height="${h * .34}" rx=".4" fill="${C.surface2}"/>
      <rect x="${x + w * .1}" y="${y + h * .72}" width="${w * .8}" height="${h * .12}" rx=".4" fill="${C.surface}"/>`}</g>`; };
  const act = (name, col, art, text) => `<div class="tile" style="--c:${col};padding:1.6mm 1.8mm">
      ${fig(22, 12.4, art, 'margin:0 auto .6mm')}
      <div class="mono" style="font-weight:800;color:${col};font-size:8pt;letter-spacing:.06em;text-align:center">${name}</div>
      <div style="font-size:8pt;line-height:1.3;margin-top:.6mm">${R(text)}</div></div>`;
  const build = `${mini(2, 1.4, TYPES.feature.color)}${arrow(10.6, 6.6, 13.4, 6.6, C.muted)}${mini(14.2, 1, TYPES.team.color, 5.6, -6)}${mini(15.6, 2.4, TYPES.feature.color, 5.6, 4)}
    <rect x="12.6" y="11.4" width="9.2" height=".5" rx=".25" fill="${C.border}"/>`;
  const sell = `${mini(2, 1.4, TYPES.business.color)}${arrow(10.6, 6.6, 13.6, 6.6, C.muted)}<g transform="translate(14.4 2.4) scale(.8)">${iconAt('coin', 3, 0, 0, 10)}</g>`;
  const tuck = `${mini(1.6, 1.4, TYPES.library.color)}${arrow(10.2, 6.6, 12.6, 6.6, C.muted)}
    ${mini(14.2, 5.8, null, 5.6, 0, true)}<rect x="12.2" y="1.2" width="9.6" height="6.8" rx=".8" fill="#C93D6C"/><rect x="12.2" y="1.2" width="9.6" height="2" rx=".8" fill="#F0648F"/><rect x="12.2" y="7.6" width="9.6" height=".5" fill="#000" opacity=".4"/>`;
  // passing diagram: 4 players round a table, hands move to each player's right (counter-clockwise seen from above)
  const W = 36, cxp = 18, cyp = 18, r = 11.6;
  const seats = [[90, 0, 3, 'short', C.frontend], [0, 1, 1, 'long', C.backend], [270, 2, 4, 'bun', C.agent], [180, 3, 0, 'curly', C.gold]];
  const people = seats.map(([deg, i, skin, hair, top]) => { const a = deg * Math.PI / 180, x = cxp + r * Math.cos(a), y = cyp + r * Math.sin(a);
    return Kit.person(x, y + 3.6, { k: .52, skin, hair, top, hairColor: [Kit.HAIR.brown, Kit.HAIR.auburn, Kit.HAIR.black, Kit.HAIR.blonde][i], mood: 'smile' }); }).join('');
  const arcs = [0, 1, 2, 3].map(i => { const a0 = (90 - i * 90 - 22) * Math.PI / 180, a1 = (90 - i * 90 - 68) * Math.PI / 180, rr = r + .4;
    const [x0, y0, x1, y1] = [cxp + rr * Math.cos(a0), cyp + rr * Math.sin(a0), cxp + rr * Math.cos(a1), cyp + rr * Math.sin(a1)];
    const ht = Math.atan2(y1 - y0, x1 - x0);
    return `<path d="M${x0.toFixed(2)} ${y0.toFixed(2)}A${rr} ${rr} 0 0 0 ${x1.toFixed(2)} ${y1.toFixed(2)}" fill="none" stroke="${C.gold}" stroke-width=".55" stroke-linecap="round"/>
      ${arrow(x1 - Math.cos(ht - .5) * .1, y1 - Math.sin(ht - .5) * .1, x1, y1, C.gold, .55)}`; }).join('');
  const passSvg = fig(W, W, `<circle cx="${cxp}" cy="${cyp}" r="7.4" fill="${C.surface}"/>
    ${lbl(cxp, cyp - .4, 'PASS', { size: 2.1, fill: C.gold, anchor: 'middle', weight: 800 })}${lbl(cxp, cyp + 2.4, 'RIGHT', { size: 2.1, fill: C.gold, anchor: 'middle', weight: 800 })}
    ${arcs}${people}`);
  const tl = [1, 2, 3].map(sp => { const x = (sp - 1) * 24;
    return `<g transform="translate(${x} 0)">${placeCard(null, 0, 1, 10.4, { back: sp })}
      ${lbl(12, 6.2, 'SPRINT ' + ['', 'I', 'II', 'III'][sp], { size: 1.9, fill: ['', '#FF6B6B', '#F7C948', '#8BD450'][sp], weight: 800, ls: 0 })}
      ${lbl(12, 9.4, '5 cards', { size: 1.9, fill: C.muted, weight: 400, ls: 0 })}${lbl(12, 12.2, '4 picks', { size: 1.9, fill: C.muted, weight: 400, ls: 0 })}
      ${arrow(21.6, 8, 23.4, 8, C.faint)}</g>`; }).join('');
  const timeline = fig(83, 16.4, `${tl}
    <use href="#i-star" x="72" y="1.4" width="10.4" height="10.4" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3"/>
    ${lbl(77.2, 15.4, 'SCORE', { size: 1.9, fill: C.gold, anchor: 'middle', weight: 800 })}`);
  return page(6, { acc: C.gold, file: 'Sprint.kt', kicker: 'HOW TO PLAY', body: `
    <h1>Playing a <span class="acc">Sprint</span></h1>
    <p class="lead">The game has <b>3 Sprints</b>. In each Sprint everyone gets <b>5 cards</b> from that Sprint’s deck. Then play <b>4 picks</b>:</p>
    <ol class="steps" style="margin-top:1.6mm">
      <li><b>Pick.</b> Everyone chooses one card from their hand at the same time, lays it face down, and then all reveal.</li>
      <li><b>Play it</b> in one of three ways:
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.6mm;margin:1.6mm 0 .4mm -6.6mm">
          ${act('BUILD', TYPES.feature.color, build, 'Pay its cost and place it in front of you.')}
          ${act('SELL', C.gold, sell, 'Discard it and take {coin:3} from the bank.')}
          ${act('TUCK', '#F0648F', tuck, 'Put it under your next <b>Roadmap</b> stage and pay that stage.')}
        </div></li>
      <li><b>Pass</b> the rest of your hand to the player on your <b>right</b>.</li>
      <li>After <b>4 picks</b>, discard the last card. The Sprint is over: deal the next one.</li>
    </ol>
    <div class="row" style="margin-top:1mm;align-items:center">${passSvg}
      <div style="flex:1">
        <div class="note" style="margin:0 0 1.6mm"><span class="c">// one rule to remember</span>You can’t build two copies of the same card.</div>
        <p style="margin:0">Built cards stay in front of you for the whole game. A sold or discarded card goes out of the game.</p>
      </div></div>
    <h2>Three Sprints</h2>
    ${timeline}
    <p style="font-size:8pt;margin-top:1.4mm">Some effects pay out <b>at every Sprint end</b>, others count <b>at game end</b> (p. 9).</p>` });
}

// =====================================================================================================
// 7 · PAYING
// =====================================================================================================
function paying() {
  const res = (r, name, from) => `<div class="tile" style="--c:${C[r]};display:flex;gap:1.6mm;align-items:center;padding:1.4mm 1.8mm">
      ${fig(6.4, 6.4, iconAt(r, null, 0, 0, 6.4))}<div style="line-height:1.22"><div class="mono" style="font-weight:800;color:${C[r]};font-size:7.8pt">${name}</div><div style="font-size:8pt">${from}</div></div></div>`;
  const src = (icon, who, extra = '') => `<span class="src">${I(icon)}<span>${who}</span>${extra ? `<b class="k-gold">${extra}</b>` : ''}</span>`;
  const ex = (id, cost, rows, total, ok = true) => `<div class="exrow">
      <div class="exhead"><span class="mono" style="font-weight:800;color:#fff">${card(id).name}</span><span>${cost.map(c => I(c)).join('')}</span></div>
      <div class="exbody">${rows}</div>
      <div class="extot mono" style="color:${ok ? C.gold : '#FF6B6B'}">${total}</div></div>`;
  return page(7, { acc: C.backend, file: 'Payment.kt', kicker: 'PAYING', body: `
    <style>
      .src { display:inline-flex; align-items:center; gap:.7mm; background:var(--surface2); border-radius:1mm; padding:.25mm 1.4mm .25mm .6mm; margin:0 .8mm .8mm 0; font-size:7.8pt; white-space:nowrap; }
      .exrow { display:grid; grid-template-columns:24mm 1fr 13mm; gap:1.4mm; align-items:center; background:var(--surface); border-radius:1.4mm; padding:1.6mm 1.8mm .8mm; margin-bottom:1.4mm; }
      .exhead { display:flex; flex-direction:column; gap:.4mm; font-size:7.8pt; line-height:1.2; margin-bottom:.8mm; }
      .exhead .ic { width:4.4mm; height:4.4mm; }
      .extot { font-weight:800; font-size:8pt; text-align:right; margin-bottom:.8mm; white-space:nowrap; }
    </style>
    <h1>Paying for a <span class="acc">card</span></h1>
    <p class="lead">The cost box shows what a card needs. <b>Coins</b> are paid to the bank. <b>Resource icons</b> must be
      covered by what your startup produces.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.6mm;margin:1.6mm 0 1.4mm">
      ${res('frontend', 'Frontend', 'from people')}${res('backend', 'Backend', 'from people')}${res('agent', 'Agent', 'from agents')}</div>
    <p style="font-size:8pt" class="muted">Your startup board produces one resource; every Team card ${I('team')} you build adds more.</p>
    <ul class="dots">
      <li><b>Resources are never spent.</b> Your team works on every build: each resource you produce covers one icon of every cost, all game long.</li>
      <li>${I('agent')} <b>Agents</b> fill ${I('agent')} slots for free. A ${I('agent')} can also do ${I('frontend')} or ${I('backend')} work: <b>pay ${I('coin', 1)} in tokens</b> each time.</li>
      <li>Missing ${I('frontend')} or ${I('backend')}? <b>Hire a freelancer for ${I('coin', 2)}</b>. You can’t hire a ${I('agent')}.</li>
      <li>${I('frontend')}<span class="muted">/</span>${I('backend')} on a card is one person who does either, not both at once.</li>
    </ul>
    <h2>Example</h2>
    <p>Your startup produces ${I('backend')}. You built <b>Junior Compose Dev</b> ${I('frontend')} and <b>Junie</b> ${I('agent')}.</p>
    ${ex('push-notifications', ['frontend', 'backend', 'backend'], src('frontend', 'Junior') + src('backend', 'startup') + src('agent', 'Junie as', '+1') , `pay ${I('coin', 1)}`)}
    ${ex('payments', ['backend', 'backend', 'backend'], src('backend', 'startup') + src('agent', 'Junie as', '+1') + src('backend', 'freelancer', '+2'), `pay ${I('coin', 3)}`)}
    ${ex('multi-agent-workflow', ['agent', 'agent', 'backend'], src('agent', 'Junie') + `<span class="src" style="color:#FF8A8A">${I('agent')} missing, can’t hire</span>`, '<span style="font-size:13pt">×</span>', false)}
    <p class="muted" style="font-size:8pt;margin:0">Outsourcing Partner makes your freelancers cost ${I('coin', 1)}.</p>` });
}

// =====================================================================================================
// 8 · CHAINS
// =====================================================================================================
function chains() {
  const kw = 26, sw = 22, sh = sw * 88 / 63;
  const free = (x, y) => `<g transform="rotate(-10 ${x} ${y})"><rect x="${x - 6}" y="${y - 2.4}" width="12" height="4.8" rx="1" fill="${C.backend}" stroke="${C.bg}" stroke-width=".5"/>
    <text x="${x}" y="${y + 1.05}" font-size="2.9" font-weight="800" fill="${C.bg}" text-anchor="middle" letter-spacing=".2">FREE</text></g>`;
  const y0 = 1, kh = kw * 88 / 63;
  const svgC = fig(83, kh + 3, `${placeCard('ktor', 0, y0, kw)}
    <path d="M${kw + 1} ${y0 + kh * .55}C${kw + 6} ${y0 + kh * .55} ${kw + 5} ${y0 + sh / 2} ${kw + 9.5} ${y0 + sh / 2 + 2}" fill="none" stroke="${C.chain}" stroke-width=".6" stroke-dasharray="1.2 .8"/>
    ${placeCard('rest-api', kw + 10, y0 + 2, sw)}${placeCard('realtime-chat', kw + 13 + sw, y0 + 2, sw)}
    ${arrow(kw + 9.4, y0 + sh / 2 + 2, kw + 10, y0 + sh / 2 + 2.2, C.chain, .6)}
    <path d="M${kw + 10 + sw} ${y0 + sh / 2 + 2}L${kw + 13 + sw} ${y0 + sh / 2 + 2}" stroke="${C.chain}" stroke-width=".6" stroke-dasharray="1.2 .8"/>
    ${free(kw + 10 + sw / 2, y0 + 13)}${free(kw + 13 + 1.5 * sw, y0 + 13)}`);
  const pair = (a, b) => `<div class="pair">${chip('feature', card(a).name, 1)}<span class="ar">→</span>${chip('feature', card(b).name, 3)}</div>`;
  return page(8, { acc: C.chain, file: 'Chains.kt', kicker: 'CHAINS', body: `
    <style>
      .chip { display:inline-flex; align-items:center; gap:1mm; background:var(--surface); border:.3mm solid var(--c); border-radius:1.2mm; padding:.5mm 1.4mm .5mm .8mm; font-family:var(--mono); font-weight:800; font-size:7.4pt; color:#fff; white-space:nowrap; }
      .chip .sp { color:var(--muted); font-weight:700; font-size:6.4pt; margin-left:.6mm; }
      .pair { display:flex; align-items:center; gap:1.4mm; margin-bottom:1.3mm; }
      .pair .ar { color:var(--chain); font-weight:800; font-family:var(--mono); }
      .spr { font-family:var(--mono); font-size:6.4pt; color:var(--muted); font-weight:700; }
      .libs { display:grid; grid-template-columns:1fr 1fr; gap:1mm 1.4mm; }
      .lc { display:grid; grid-template-columns:4mm 1fr; gap:1mm; background:var(--surface); border-radius:1.2mm; padding:.9mm 1.2mm; font-size:7.6pt; line-height:1.28; }
      .lc .ic { width:3.6mm; height:3.6mm; margin-top:.3mm; }
    </style>
    <h1>Chains: build for <span class="acc">free</span></h1>
    <p class="lead">A chain badge ${I('chain')} on a cost box means the card is <b>free if you already built</b> the card named
      on it. Free means free: no coins, no resources.</p>
    ${svgC}
    <p style="margin-top:1.6mm"><b>Libraries</b> ${I('library')} score ${I('star', 2)} and make the features printed on them <b>free for you</b> (two each; Koog: one).</p>
    <h2>Sprint I → Sprint III</h2>
    <p>Three small Sprint I features each make one Sprint III feature free:</p>
    ${pair('login-screen', 'gdpr-compliance')}${pair('health-check', 'security-audit')}${pair('dark-mode', 'accessibility')}
    <p style="font-size:8pt;margin-top:1.4mm">Agents chain too: <b>Claude Code → Agents with MCP → Multi-agent Workflow</b> and <b>Junie → Koog → In-app AI Assistant</b>.</p>
    <div class="note"><span class="c">// before you pass a card</span>Check your libraries: a feature they make free is ${I('star')} for nothing. Chains are also a reason to tuck a card your neighbour needs.</div>` });
}

// =====================================================================================================
// 9 · SCORING
// =====================================================================================================
function scoring() {
  const L = [
    ['Features', 'Login Screen 3 · REST API 4 · GDPR 5 · Real-time Chat 6', 18],
    ['Libraries', 'Ktor 2 · Amper 2', 4],
    ['Team', 'Tech Lead 3', 3],
    ['Business', 'IPO: 1 per Feature card (4)', 4],
    ['Roadmap', 'MVP 1 · Exit 5', 6],
    ['Ability', 'Companion: 1 per Team card (3)', 3],
    ['Coins', '8 coins ÷ 3, rounded down', 2],
  ];
  const win = `<div style="background:var(--deep);border-radius:1.4mm;overflow:hidden;border:.3mm solid var(--border)">
    <div class="tabbar" style="margin:0;border-radius:0;height:5mm"><span class="dots">${DOTS.map(c => `<i style="background:${c}"></i>`).join('')}</span><span class="tab" style="--acc:${C.gold}">Score.kt</span><span class="kicker">ADA · COMPANION</span></div>
    <div style="padding:1.6mm 2.4mm 2mm;font-family:var(--mono);font-size:7.4pt;line-height:1.55">
      ${L.map(([a, b, n]) => `<div style="display:grid;grid-template-columns:15mm 1fr 6mm;gap:1.4mm"><span style="color:${C.kw}">${a}</span><span style="color:${C.muted};font-size:6.9pt">${b}</span><span style="text-align:right;color:#fff;font-weight:800">${n}</span></div>`).join('')}
      <div style="border-top:.3mm dashed var(--border);margin-top:1mm;padding-top:1mm;display:grid;grid-template-columns:1fr auto;align-items:center">
        <span style="color:${C.fn};font-weight:800">val total =</span><span style="color:${C.gold};font-weight:800;font-size:10pt">${L.reduce((s, l) => s + l[2], 0)} ${I('star')}</span></div>
    </div></div>`;
  return page(9, { acc: C.gold, file: 'Score.kt', kicker: 'GAME END', body: `
    <h1>End of the <span class="acc">game</span></h1>
    <p class="lead">The game ends after the third Sprint. First apply Sprint-end effects (like the ${I('coin', 2)} of suspend fun Travel), then everyone adds up their ${I('star')}:</p>
    <ul class="dots" style="margin-top:1.6mm">
      <li>${I('star')} printed on the cards you built: Features, Libraries, Tech Lead and some Business cards.</li>
      <li>${I('star')} from <span class="mono"><b>AT GAME END</b></span> tiles: on Business cards and on your board.</li>
      <li>${I('star')} from your Roadmap: MVP 1, Exit 4–5 (and the Product-Market Fit stars of by lazy Studio and Sealed Deals).</li>
      <li><b>1 ${I('star')} per 3 ${I('coin')}</b> you still have, rounded down (NullSafe Bank with Product-Market Fit: per 2 ${I('coin')}).</li>
    </ul>
    <div class="panel" style="margin:1.4mm 0 3mm;display:flex;gap:2mm;align-items:center;border-color:var(--gold)">
      ${fig(9, 9, `<use href="#i-star" x="0" y="0" width="9" height="9" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3"/>`)}
      <div><b>Most ${I('star')} wins.</b> On a tie, more ${I('coin')} wins. Still tied? Share the victory.</div></div>
    <h2>Example</h2>
    ${win}
    <div class="note" style="margin-top:3.4mm"><span class="c">// tip for your first game</span>In Sprint I build your team. The ${I('star')} come later.</div>` });
}

// =====================================================================================================
// 10 · WORKED EXAMPLE
// =====================================================================================================
function example() {
  const steps = [
    ['mid-fullstack-dev', 'BUILD', TYPES.feature.color, 'Pays {coin:2}. Now she produces {frontend} (startup) and {frontend}/{backend} (Mid).', 2, 0],
    ['ktor', 'BUILD', TYPES.feature.color, 'Needs {backend}: Mid covers it, so she pays nothing. Ktor is worth {star:2}.', 2, 2],
    ['health-check', 'TUCK', '#F0648F', 'Reaches <b>MVP</b> ({frontend}{frontend}: startup + Mid): +{coin:3} and {star:1}. Her right neighbour wanted that card.', 5, 3],
    ['login-screen', 'BUILD', TYPES.feature.color, 'Needs {frontend}{backend}: startup + Mid, so it’s free to build: {star:3}.', 5, 6],
  ];
  const row = ([id, act, col, text, coins, stars], i) => `<div class="exstep">
      <div class="pk mono">PICK ${i + 1}</div>
      ${cardImg(id, 14.2)}
      <div><div class="mono" style="font-weight:800;color:#fff;font-size:8pt">${card(id).name} <span class="act" style="background:${col}">${act}</span></div>
        <div style="font-size:8pt;line-height:1.32;margin-top:.5mm">${R(text)}</div></div>
      <div class="state mono">${BIG('coin', coins, 6.6)}${BIG('star', stars, 7.2)}</div></div>`;
  return page(10, { acc: '#F0648F', file: 'Example.kt', kicker: 'EXAMPLE', body: `
    <style>
      .exstep { display:grid; grid-template-columns:5mm 14.2mm 1fr 8.4mm; gap:2mm; align-items:center; background:var(--surface); border-radius:1.6mm; padding:1.6mm 1.8mm; margin-bottom:1.6mm; }
      .exstep .pk { writing-mode:vertical-rl; transform:rotate(180deg); font-size:6.2pt; font-weight:800; letter-spacing:.14em; color:var(--muted); text-align:center; }
      .act { display:inline-block; font-size:6.2pt; letter-spacing:.1em; color:#fff; border-radius:.8mm; padding:.1mm 1.2mm; vertical-align:.25mm; margin-left:.6mm; }
      .state { display:flex; flex-direction:column; gap:1mm; align-items:center; }
      .state .ic { width:6.6mm; height:6.6mm; }
    </style>
    <h1>Ada’s first <span class="acc">Sprint</span></h1>
    <p class="lead">Ada runs <b>Companion</b>: it produces ${I('frontend')} and she starts with ${I('coin', 4)}. Her four picks in Sprint I:</p>
    <div style="margin-top:2mm">${steps.map(row).join('')}</div>
    <p style="margin-top:.6mm">Her last card is discarded. Selling Health-check instead would have paid ${I('coin', 3)}, but MVP gave her ${I('coin', 3)} <i>and</i> ${I('star', 1)}.</p>
    <div class="note"><span class="c">// what the chains bring later</span>In Sprint II <b>REST API</b> (${I('star', 4)}) is free for her thanks to Ktor; in Sprint III <b>GDPR Compliance</b> (${I('star', 5)}) is free thanks to Login Screen.</div>` });
}

// =====================================================================================================
// 11 · STARTUPS + DUEL
// =====================================================================================================
function duel() {
  // facts as in RULES.md / Cards.kt
  const S = [
    ['companion', 'Companion', 'dating', 'frontend', 4, '+{coin:3} {star:1}', 'end: {star:1} per your {team}', 5],
    ['suspend-fun-travel', 'suspend fun Travel', 'travel', 'backend', 4, '+{coin:3} {star:1}', '+{coin:1} now, +{coin:2} every Sprint end', 5],
    ['sealed-deals', 'Sealed Deals', 'e-commerce', 'backend', 5, '+{coin:4} {star:1}', 'selling gives {coin:5}; {star:1}', 5],
    ['by-lazy-studio', 'by lazy Studio', 'games', 'frontend', 3, '+{coin:3} {star:1}', '{star:3}; end: {star:1} per your {library}', 4],
    ['nullsafe-bank', 'NullSafe Bank', 'fintech', 'backend', 4, '+{coin:3} {star:1}', '+{coin:3}; end: {star:1} per {coin:2}', 5],
  ];
  const rows = S.map(([id, name, genre, mk, start, mvp, pmf, exit]) => { const s = startup(id);
    return `<div class="su" style="--a:${s.accent[0]}">
      <div class="su-h"><span class="nm">${name}</span><span class="g">${genre}</span><span class="mk">${I(mk)} ${I('coin', start)}</span></div>
      <div class="su-b"><span><i>MVP</i>${R(mvp)}</span><span><i>PMF</i>${R(pmf)}</span><span><i>EXIT</i>${I('star', exit)}</span></div></div>`; }).join('');
  // duel diagram: hand of 8 -> play 1 + discard 1 -> pass 6
  const cw = 5.6, ch = cw * 88 / 63;
  const fan = (x, y, n, col) => Array.from({ length: n }, (_, i) => `<g transform="rotate(${(i - (n - 1) / 2) * 7} ${x} ${y + 12})"><rect x="${x - cw / 2}" y="${y}" width="${cw}" height="${ch}" rx=".5" fill="${C.bg}" stroke="${C.border}" stroke-width=".25"/><rect x="${x - cw / 2}" y="${y}" width="${cw}" height="${ch * .26}" rx=".5" fill="${col}"/></g>`).join('');
  const one = (x, y, col, down) => `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx=".5" fill="${down ? '#26272B' : C.bg}" stroke="${down ? '#F7C948' : C.border}" stroke-width=".25"/>` +
    (down ? `<circle cx="${x + cw / 2}" cy="${y + ch / 2}" r="1.4" fill="none" stroke="#F7C948" stroke-width=".3"/>` : `<rect x="${x}" y="${y}" width="${cw}" height="${ch * .26}" rx=".5" fill="${col}"/>`);
  const dsvg = fig(83, 23, `
    ${fan(9, 3, 8, TYPES.team.color)}${lbl(9, 17.6, '8 CARDS', { size: 2, anchor: 'middle', fill: C.text, weight: 800 })}${lbl(9, 20.6, 'your hand', { size: 1.7, anchor: 'middle', fill: C.muted, weight: 400, ls: 0 })}
    ${arrow(19, 10, 24, 10)}
    ${one(27, 2.4, TYPES.feature.color)}${lbl(29.8, 17.6, 'PLAY 1', { size: 2, anchor: 'middle', fill: C.text, weight: 800 })}
    ${lbl(29.8, 20.6, 'build·sell·tuck', { size: 1.7, anchor: 'middle', fill: C.muted, weight: 400, ls: 0 })}
    ${lbl(36.8, 9.6, '+', { size: 3.6, anchor: 'middle', fill: C.muted })}
    ${one(41, 2.4, null, true)}${lbl(43.8, 17.6, 'DISCARD 1', { size: 2, anchor: 'middle', fill: C.text, weight: 800 })}
    ${lbl(43.8, 20.6, 'face down', { size: 1.7, anchor: 'middle', fill: C.muted, weight: 400, ls: 0 })}
    ${arrow(52, 10, 57, 10)}
    ${fan(68, 3, 6, TYPES.team.color)}${lbl(68, 17.6, 'PASS 6', { size: 2, anchor: 'middle', fill: C.text, weight: 800 })}${lbl(68, 20.6, 'to the other player', { size: 1.7, anchor: 'middle', fill: C.muted, weight: 400, ls: 0 })}`);
  return page(11, { acc: TYPES.library.color, file: 'Duel.kt', kicker: 'STARTUPS · 2 PLAYERS', body: `
    <style>
      .su { background:var(--surface); border-left:.8mm solid var(--a); border-radius:0 1.4mm 1.4mm 0; padding:1.2mm 2mm 1.3mm; margin-bottom:1.3mm; }
      .su-h { display:flex; align-items:center; gap:1.6mm; }
      .su-h .nm { font-family:var(--mono); font-weight:800; font-size:8pt; color:#fff; }
      .su-h .g { font-family:var(--mono); font-size:6.2pt; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; }
      .su-h .mk { margin-left:auto; }
      .su-b { display:grid; grid-template-columns:19mm 1fr 10mm; gap:1.6mm; font-size:7.8pt; line-height:1.25; margin-top:.5mm; }
      .su-b i { font-style:normal; font-family:var(--mono); font-size:6pt; font-weight:800; color:var(--a); letter-spacing:.08em; display:block; }
    </style>
    <h1>The five <span class="acc">startups</span></h1>
    <p style="font-size:8pt" class="muted">Each makes one resource ${I('frontend')} or ${I('backend')} and starts with the ${I('coin')} shown. Stage costs are printed on the boards. PMF = Product-Market Fit.</p>
    ${rows}
    <h2>Two players: the Duel</h2>
    ${dsvg}
    <ol class="steps" style="margin-top:2mm">
      <li>Use the <b>3+ and 4+ cards</b> and deal <b>8 cards</b> each.</li>
      <li>Every pick you play one card (build, sell or roadmap) <b>and discard another face down</b>, then pass.</li>
      <li>After 4 picks your hand is empty. The 4 cards left in each deck stay unused.</li>
    </ol>` });
}

// =====================================================================================================
// 12 · QUICK REFERENCE (back cover)
// =====================================================================================================
function quickref() {
  const box = (title, col, html) => `<div class="qr" style="--c:${col}"><div class="qt">${title}</div>${html}</div>`;
  const scene = fig(83, 21, `<ellipse cx="41.5" cy="19.6" rx="34" ry="1.3" fill="#000" opacity=".35"/>
    ${Kit.person(18, 19.4, { k: .95, pose: 'point', skin: 2, hair: 'side', hairColor: Kit.HAIR.chestnut, top: TYPES.team.color, topStyle: 'tee', mood: 'grin' })}
    ${Kit.robot(41.5, 19.4, { k: .95, body: true, arms: 'wave', expression: 'happy' })}
    ${Kit.person(65, 19.4, { k: .95, pose: 'stand', skin: 4, hair: 'buzz', hairColor: Kit.HAIR.black, top: C.frontend, topStyle: 'hoodie', mood: 'happy' })}
    ${[[30, 4, 2.6], [54, 3, 3.2], [74, 6, 2.2], [8, 7, 2]].map(([x, y, s]) => `<use href="#i-star" x="${x}" y="${y}" width="${s}" height="${s}" fill="${C.gold}"/>`).join('')}`);
  return page(12, { acc: C.agent, file: 'Cheatsheet.kt', kicker: 'QUICK REFERENCE', noFolio: true, body: `
    <style>
      .qr { background:var(--surface); border-top:.7mm solid var(--c); border-radius:0 0 1.4mm 1.4mm; padding:1.5mm 2.2mm 1.6mm; margin-bottom:1.6mm; font-size:8pt; line-height:1.33; }
      .qt { font-family:var(--mono); font-weight:800; font-size:7.4pt; letter-spacing:.1em; color:var(--c); margin-bottom:.6mm; }
      .qr p { margin:0 0 .5mm; }
    </style>
    <h1 style="font-size:14pt">Quick <span class="acc">reference</span></h1>
    ${box('EACH PICK', C.gold, `<p><b>Pick</b> a card together, reveal, then <b>Build</b> it (pay cost) · <b>Sell</b> it (+${I('coin', 3)}) · <b>Tuck</b> it under your next Roadmap stage (pay stage cost). <b>Pass right.</b></p><p>3 Sprints · 5 cards · 4 picks · discard the last card.</p>`)}
    ${box('PAYING', C.backend, `<p>Resources are never spent: each covers one icon of every cost. ${I('agent')} as ${I('frontend')}/${I('backend')}: +${I('coin', 1)} token. Freelancer ${I('frontend')}/${I('backend')}: ${I('coin', 2)}. No freelancer for ${I('agent')}.</p>`)}
    ${box('FREE', C.chain, `<p>${I('chain')} Free if you built the named card. Libraries make their features free. No two copies of the same card.</p>`)}
    ${box('ROADMAP', '#F0648F', `<p>MVP → Product-Market Fit → Exit, in order, one per pick. MVP: ${I('coin')} + ${I('star', 1)} · PMF: ability · Exit: 4–5 ${I('star')}.</p>`)}
    ${box('SCORING', C.gold, `<p>${I('star')} on cards + bonuses + Roadmap + 1 ${I('star')} per 3 ${I('coin')}. Tie: more ${I('coin')} wins.</p>`)}
    ${box('PLAYERS', TYPES.team.color, `<p>3: cards 3+ · 4: 3+ 4+ · 5: all. <b>Duel (2):</b> 3+ 4+, 8 cards, also discard one card face down every pick.</p>`)}
    <div class="grow"></div>
    ${scene}
    <div style="text-align:center;margin-top:1.4mm" class="mono"><span style="font-weight:800;font-size:11pt;color:var(--text)">Startup<span style="color:#F0506E">.</span><span style="color:#B16CFF">kt</span></span>
      <div style="font-size:6.2pt;color:var(--faint);letter-spacing:.2em;margin-top:.4mm">BUILD · SHIP · COLLECT STARS</div></div>` });
}

// =====================================================================================================
const PAGES = [cover, welcome, anatomy, boardPage, setup, playing, paying, chains, scoring, example, duel, quickref];
if (PAGES.length !== N_PAGES || N_PAGES % 4) throw new Error('page count must be a multiple of 4');

document.body.insertAdjacentHTML('afterbegin', sharedDefs());
const q = new URLSearchParams(location.search);
const shot = +q.get('page'), printMode = q.get('print') === 'home' ? 'home' : 'pages';
const html = n => PAGES[n - 1]();
const vp = n => `<div class="vp">${html(n)}</div>`;
const guides = `<svg class="guides" viewBox="0 0 106 196" style="width:106mm;height:196mm"><g fill="none" stroke-width=".25">
  <rect x="3" y="3" width="100" height="190" stroke="#FF4D4D" stroke-dasharray="1 .8"/><rect x="6" y="6" width="94" height="184" stroke="#33D1FF" stroke-dasharray=".6 .8" opacity=".7"/></g></svg>`;

if (shot) {
  document.body.classList.add('shot');
  if (q.get('bleed')) document.body.classList.add('bleed');
  document.getElementById('book').innerHTML = `<div class="vp">${html(shot)}${q.get('bleed') ? guides : ''}</div>`;
  document.getElementById('book').style.zoom = q.get('zoom') || 2;
} else {
  // screen: cover alone, then spreads 2-3, 4-5, ..., back cover alone
  const sp = [[1]]; for (let i = 2; i < N_PAGES; i += 2) sp.push([i, i + 1]); sp.push([N_PAGES]);
  document.getElementById('book').innerHTML = sp.map(s => `<div class="spread">${s.map(vp).join('')}</div>`).join('');
}

// ---------- print ----------
const pz = document.getElementById('pagesize');
if (printMode === 'pages') {
  pz.textContent = '@page { size: 106mm 196mm; margin: 0; } .sheet { width:106mm; height:196mm; }';
  document.getElementById('print').innerHTML = Array.from({ length: N_PAGES }, (_, i) => `<div class="sheet">${html(i + 1)}</div>`).join('');
} else {
  // A4 landscape 297 x 210: two trimmed pages (200 x 190) centred, meeting at the fold x = 148.5; outer bleed kept.
  pz.textContent = '@page { size: 297mm 210mm; margin: 0; } .sheet { width:297mm; height:210mm; }';
  const sides = [];
  for (let s = 0; s < N_PAGES / 4; s++) {
    const a = 2 * s + 1;                                  // 1, 3, 5
    sides.push([N_PAGES - 2 * s, a]);                     // front: [12 | 1], [10 | 3], [8 | 5]
    sides.push([a + 1, N_PAGES - 2 * s - 1]);             // back:  [2 | 11], [4 | 9], [6 | 7]
  }
  const L = 48.5, T = 10, FOLD = 148.5;                   // trim box of the left page starts at (48.5, 10)
  const marks = (() => {
    const l = (x1, y1, x2, y2, d = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${d}/>`;
    let s = '';
    [L, L + 200].forEach(x => { s += l(x, 1.5, x, 6) + l(x, 204, x, 208.5); });                 // vertical cuts
    [T, T + 190].forEach(y => { s += l(36, y, 44, y) + l(253, y, 261, y); });                    // horizontal cuts
    s += l(FOLD, 1.5, FOLD, 6, ' stroke-dasharray="1 .8"') + l(FOLD, 204, FOLD, 208.5, ' stroke-dasharray="1 .8"');
    return `<svg class="marks" viewBox="0 0 297 210" style="width:297mm;height:210mm" xmlns="http://www.w3.org/2000/svg"><g stroke="#000" stroke-width=".2">${s}</g>
      <text x="270" y="105" font-size="2.2" font-family="${MONOF}" fill="#888" text-anchor="middle" transform="rotate(90 270 105)">Startup.kt rules · print at 100% · duplex, flip on short edge · cut on the marks, fold on the dashed mark</text></svg>`;
  })();
  document.getElementById('print').innerHTML = sides.map(([left, right], i) => `<div class="sheet">
      <div class="half" style="left:${L - 3}mm;top:${T - 3}mm;width:103mm;height:196mm">${html(left)}</div>
      <div class="half" style="left:${FOLD}mm;top:${T - 3}mm;width:103mm;height:196mm"><div style="position:absolute;left:-3mm;top:0">${html(right)}</div></div>
      ${marks}
      <div style="position:absolute;left:4mm;top:4mm;font:6pt ${MONOF};color:#888">sheet ${Math.floor(i / 2) + 1} · ${i % 2 ? 'back' : 'front'}</div></div>`).join('');
}
})();
