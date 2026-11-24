// Startup.kt printable GAME BOX: two-piece telescoping box (base + lid), each a single die-cut sheet with
// corner glue flaps. Needs print/cards.js (C, Kit, renderCard, renderBack, sharedDefs) and the card data files.
// Units are millimetres everywhere. See print/BOX-NOTES.md for the construction and the die-line legend.
//
// Geometry (board thickness T = 0.5 mm), per piece:
//   Ll  inner length = the long walls' length between the two flap creases (what the contents see)
//   Lp  = Ll + 2T   panel length; the short walls hinge on its ends, the long-wall flaps sit inside them
//   Wp  inner width = panel width; the long walls hinge on its long edges
//   Ws  = Wp + 2T   short-wall width, so the short walls also cover the end grain of the long walls
//   H   wall height (crease to free edge);  F flap length
//   outer size = (Lp + 2T) x (Wp + 2T) x H
// Flat sheet (trim box) = (Lp + 2H) x (Wp + 2H), plus 3 mm bleed on every side.
(() => {
const T = 0.5, BLEED = 3;
const SPEC = {
  base: { label: 'BASE', Ll: 203, Wp: 108, H: 32.5, F: 30 },
  lid:  { label: 'LID',  Ll: 206, Wp: 110, H: 30,   F: 28 },
};
const r2 = n => Math.round(n * 100) / 100;

function geom(kind) {
  const s = SPEC[kind];
  const Ll = s.Ll, Lp = Ll + 2 * T, Wp = s.Wp, Ws = Wp + 2 * T, H = s.H, F = s.F;
  const trimW = Lp + 2 * H, trimH = Wp + 2 * H;
  const sheetW = trimW + 2 * BLEED, sheetH = trimH + 2 * BLEED;
  const cx = BLEED + H + Lp / 2, cy = BLEED + H + Wp / 2;
  const a = Ll / 2, p = Lp / 2, w = Wp / 2, sw = Ws / 2;
  const c1 = 5, c2 = 2;              // flap chamfers: free corner (lead-in) and the corner next to the short wall
  const yT = -w - H + 1;             // flap stops 1 mm below the free edge of the wall
  // top-right quadrant of the outline, clockwise, centre-relative
  const TR = [[a, -w - H], [a, yT], [a + F - c1, yT], [a + F, yT + c1], [a + F, -sw - c2], [a + F - c2, -sw], [p + H, -sw]];
  const mx = ([x, y]) => [-x, y], my = ([x, y]) => [x, -y], mxy = ([x, y]) => [-x, -y];
  const outline = [...TR, ...TR.map(my).reverse(), ...TR.map(mxy), ...TR.map(mx).reverse()];
  const abs = ([x, y]) => [r2(cx + x), r2(cy + y)];
  // internal cuts: the 0.5 mm end of the long wall below the flap + the shared edge flap | short wall
  const icut = [[a, -w], [a, -sw], [a + F - c2, -sw]];
  const cuts = [icut, icut.map(my), icut.map(mxy), icut.map(mx)].map(l => l.map(abs));
  const creases = [
    [[-a, -w], [a, -w]], [[-a, w], [a, w]],                 // panel | long walls
    [[-p, -sw], [-p, sw]], [[p, -sw], [p, sw]],             // panel | short walls
    [[a, yT], [a, -sw]], [[a, sw], [a, -yT]], [[-a, yT], [-a, -sw]], [[-a, sw], [-a, -yT]],   // long walls | flaps
  ].map(l => l.map(abs));
  const flapTR = [[a, yT], [a + F - c1, yT], [a + F, yT + c1], [a + F, -sw - c2], [a + F - c2, -sw], [a, -sw]];
  const flaps = [flapTR, flapTR.map(my), flapTR.map(mxy), flapTR.map(mx)].map(l => l.map(abs));
  return {
    kind, ...s, T, BLEED, Ll, Lp, Wp, Ws, H, F, trimW, trimH, sheetW, sheetH, cx, cy, a, p, w, sw, yT, c1, c2,
    outline: outline.map(abs), cuts, creases, flaps,
    outer: [Lp + 2 * T, Wp + 2 * T, H], inner: [Ll, Wp, H - T],
    panels: {
      main:  [cx - p, cy - w, Lp, Wp],
      front: [cx - a, cy + w, Ll, H], back: [cx - a, cy - w - H, Ll, H],
      east:  [cx + p, cy - sw, H, Ws], west: [cx - p - H, cy - sw, H, Ws],
    },
  };
}

// ---------------------------------------------------------------- drawing helpers
const BG = '#1A1B1E', PINK = '#F0506E', PURPLE = '#B16CFF';
const ACC = { 1: '#FF6B6B', 2: '#F7C948', 3: '#8BD450' };   // = BACK_ACCENTS in cards.js (sprint I/II/III)
const MONO_W = 0.6;
const f2 = n => +(+n).toFixed(2);
const tspans = toks => toks.map(([c, s]) => `<tspan fill="${c}">${esc(s)}</tspan>`).join('');

// the wordmark, same lettering as the card backs: weight 800, letter-spacing -0.2 at 6.4 mm
function wordmark(x, y, size, anchor = 'start', extra = '') {
  return `<text x="${f2(x)}" y="${f2(y)}" font-size="${size}" font-weight="800" letter-spacing="${f2(-0.2 * size / 6.4)}" fill="${C.text}" text-anchor="${anchor}" ${extra}>Startup<tspan fill="${PINK}">.</tspan><tspan fill="${PURPLE}">kt</tspan></text>`;
}
const wordmarkW = size => 10 * MONO_W * size - 9 * 0.2 * size / 6.4;

// small line icons drawn in a 10x10 box at (x, y) with size s
const ICON = {
  players: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 10})" fill="${c}">
    <circle cx="6.6" cy="3" r="1.9" opacity=".55"/><path d="M3.6 9.6Q3.6 5.6 6.6 5.6Q9.6 5.6 9.6 9.6Z" opacity=".55"/>
    <circle cx="3.9" cy="3.4" r="2.1"/><path d="M0.4 9.8Q0.4 5.9 3.9 5.9Q7.4 5.9 7.4 9.8Z"/></g>`,
  clock: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 10})">
    <circle cx="5" cy="5.3" r="4.1" fill="none" stroke="${c}" stroke-width="1.1"/><rect x="3.9" y="0" width="2.2" height="1" rx=".4" fill="${c}"/>
    <path d="M5 5.3V2.9M5 5.3L6.8 6.4" stroke="${c}" stroke-width="1" stroke-linecap="round" fill="none"/></g>`,
  age: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 10})">
    <rect x="1" y="5" width="8" height="4.6" rx="1" fill="${c}"/>
    <path d="M1 6.9Q2.3 8 3.7 6.9Q5 8 6.3 6.9Q7.7 8 9 6.9" fill="none" stroke="${BG}" stroke-width=".7"/>
    <rect x="2.9" y="2.4" width=".9" height="2.6" rx=".3" fill="${c}"/><rect x="6.2" y="2.4" width=".9" height="2.6" rx=".3" fill="${c}"/>
    <path d="M3.35 0.4Q4.1 1.3 3.35 2Q2.6 1.3 3.35 0.4ZM6.65 0.4Q7.4 1.3 6.65 2Q5.9 1.3 6.65 0.4Z" fill="${C.gold}"/></g>`,
  check: (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s / 10})" d="M1.2 5.4L4 8.2L8.8 2.2" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  branch: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 10})" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round">
    <circle cx="3" cy="2" r="1.3"/><circle cx="3" cy="8.2" r="1.3"/><circle cx="7.4" cy="3.6" r="1.3"/><path d="M3 3.3V6.9M7.4 4.9Q7.4 6.6 3.4 7"/></g>`,
  cards: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 10})">
    <rect x="3.2" y="0.6" width="5.6" height="7.8" rx="1" fill="${c}" opacity=".45" transform="rotate(12 6 4.5)"/>
    <rect x="1.4" y="1.6" width="5.6" height="7.8" rx="1" fill="${c}"/></g>`,
  board: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 10})">
    <rect x="0.4" y="2.2" width="9.2" height="5.6" rx=".9" fill="${c}"/><rect x="1.3" y="5.4" width="2.2" height="1.6" rx=".3" fill="${BG}"/>
    <rect x="3.9" y="5.4" width="2.2" height="1.6" rx=".3" fill="${BG}"/><rect x="6.5" y="5.4" width="2.2" height="1.6" rx=".3" fill="${BG}"/></g>`,
  book: (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s / 10})">
    <rect x="1.6" y="0.6" width="6.8" height="8.8" rx=".9" fill="${c}"/><rect x="2.8" y="0.6" width=".7" height="8.8" fill="${BG}" opacity=".5"/>
    <rect x="4.3" y="2.6" width="3" height=".7" rx=".3" fill="${BG}"/><rect x="4.3" y="4" width="2.2" height=".7" rx=".3" fill="${BG}"/></g>`,
};

// a real card from the deck, rotated around its bottom centre (x, y); k = scale (1 = 63x88 mm)
let cardN = 0;
function cardAt(id, x, y, k, rot, opts = {}) {
  const c = CARDS.find(c => c.id === id);
  if (!c) return '';
  const ns = 'bx' + (cardN++);
  const svg = (opts.back ? renderBack(c.sprint, { ns }) : renderCard(c, { guides: false, ns }))
    .replace('<svg ', '<svg x="0" y="0" width="63" height="88" ').replace('viewBox="0 0 69 94"', 'viewBox="3 3 63 88"');
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${rot}) scale(${k}) translate(-31.5 -88)">
    <rect x="1.2" y="2.4" width="63" height="88" rx="3" fill="#000" opacity=".28"/>
    <rect x=".5" y="1.1" width="63" height="88" rx="3" fill="#000" opacity=".3"/>
    <g clip-path="url(#bx-cardclip)">${svg}</g>
    <rect width="63" height="88" rx="3" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".35"/></g>`;
}
const sparkle = (x, y, r, c, o = 1) => `<path transform="translate(${x} ${y})" d="M0 ${-r}Q${r * 0.16} ${-r * 0.16} ${r} 0Q${r * 0.16} ${r * 0.16} 0 ${r}Q${-r * 0.16} ${r * 0.16} ${-r} 0Q${-r * 0.16} ${-r * 0.16} 0 ${-r}Z" fill="${c}" opacity="${o}"/>`;
const star = (x, y, s, rot = 0) => `<use href="#i-star" x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" fill="${C.gold}" transform="translate(${x} ${y}) rotate(${rot})"/>`;
const coin = (x, y, s) => `<use href="#i-coin" x="${f2(x - s / 2)}" y="${f2(y - s / 2)}" width="${s}" height="${s}"/>`;
const shadow = (cx, cy, rx, ry = 1, o = 0.4) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;

// defs used by the box art (ids are global on the page, keep them unique)
const BOX_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <clipPath id="bx-cardclip" clipPathUnits="userSpaceOnUse"><rect width="63" height="88" rx="3"/></clipPath>
  <pattern id="bx-glue" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width=".5" height="2.4" fill="#F7941D"/></pattern>
  <pattern id="bx-grid" width="10" height="10" patternUnits="userSpaceOnUse">
    <path d="M10 0H0V10" fill="none" stroke="#fff" stroke-opacity=".035" stroke-width=".2"/></pattern>
  <radialGradient id="bx-glowP"><stop offset="0" stop-color="#8F5BFF" stop-opacity=".42"/><stop offset=".45" stop-color="#C711E1" stop-opacity=".12"/><stop offset="1" stop-color="#C711E1" stop-opacity="0"/></radialGradient>
  <radialGradient id="bx-glowR"><stop offset="0" stop-color="${PINK}" stop-opacity=".22"/><stop offset="1" stop-color="${PINK}" stop-opacity="0"/></radialGradient>
  <radialGradient id="bx-glowG"><stop offset="0" stop-color="#8BD450" stop-opacity=".16"/><stop offset="1" stop-color="#8BD450" stop-opacity="0"/></radialGradient>
  <linearGradient id="bx-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8F5BFF" stop-opacity="0"/><stop offset="1" stop-color="#8F5BFF" stop-opacity=".14"/></linearGradient>
  <linearGradient id="bx-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs></svg>`;

// background shared by every face: near-black, dot grid
const ground = (w, h, ox = -BLEED, oy = -BLEED) =>
  `<rect x="${ox}" y="${oy}" width="${w - 2 * ox}" height="${h - 2 * oy}" fill="${BG}"/><rect x="${ox}" y="${oy}" width="${w - 2 * ox}" height="${h - 2 * oy}" fill="url(#dots)"/>`;

// ---------------------------------------------------------------- LID TOP (207 x 110)
function lidTop(W, H) {
  cardN = 0;
  const wx = 8, wy = 8, ww = W - 16, wh = H - 16;          // IDE window
  const barB = wy + 9, statT = wy + wh - 7.5;                // title bar bottom, status bar top
  const gut = 11;
  const lineY = n => barB + 5.2 + (n - 1) * 4.55;
  const nLines = Math.floor((statT - barB - 2) / 4.55);
  const x0 = wx + gut + 6.5;                                 // code column
  const tab = (x, label, active) => {
    const tw = 6 + label.length * 1.62;
    return `${active ? `<rect x="${x}" y="${wy}" width="${tw}" height="9" fill="#202124"/><rect x="${x}" y="${barB - 0.7}" width="${tw}" height=".7" fill="url(#bolt)"/>` : ''}
      <text x="${x + 3}" y="${wy + 5.8}" font-size="2.7" fill="${active ? C.text : C.faint}" font-weight="${active ? 700 : 400}">${label}</text>`;
  };
  const pill = (x, y, icon, label, sub, wPill) => `<g>
    <rect x="${x}" y="${y}" width="${wPill}" height="10" rx="5" fill="#2B2D30" stroke="#43454A" stroke-width=".3"/>
    ${ICON[icon](x + 3, y + 2.4, 5.2, C.text)}
    <text x="${x + 10}" y="${y + 6.6}" font-size="3.5" font-weight="800" fill="${C.text}">${label}<tspan font-size="2.5" font-weight="700" fill="${C.muted}" dx="1">${sub}</tspan></text></g>`;

  // right-hand scene: fanned deck + team
  // three real cards: two tilted behind, one upright in front
  const fan = cardAt('junior-compose-dev', 146.5, 76.5, 0.44, -12) + cardAt('series-a', 174, 76.5, 0.44, 12) + cardAt('ktor', 160.2, 73.5, 0.48, 0);
  const floorY = statT - 2.2;
  const team =
    shadow(124, floorY, 9, 1.1) + Kit.person(124, floorY, { pose: 'point', k: 1.15, skin: 3, hair: 'curly', hairColor: Kit.HAIR.black, top: '#2FB59A', topStyle: 'hoodie', pants: '#33415C', mood: 'happy' }) +
    Kit.desk(158.5, floorY - 0.3, 32, { legs: true }) +
    Kit.person(150, floorY - 0.3, { pose: 'bust', k: 0.95, skin: 1, hair: 'bun', hairColor: Kit.HAIR.auburn, top: '#4FB3F6', topStyle: 'tee', glasses: true, mood: 'grin' }) +
    Kit.laptop(150, floorY - 0.3, 0.95, { color: '#5B5F68' }) +
    Kit.robot(167.5, floorY - 0.3, { k: 0.82, expression: 'focus', color: C.agent }) +
    shadow(191, floorY, 8, 1.1) + Kit.robot(191, floorY, { k: 1.12, body: true, arms: 'wave', expression: 'happy', color: '#4FB3F6' });

  return `
  ${ground(W, H, 0, 0)}
  <rect width="${W}" height="${H}" fill="url(#bx-grid)"/>
  <circle cx="160" cy="52" r="70" fill="url(#bx-glowP)"/>
  <circle cx="40" cy="40" r="60" fill="url(#bx-glowR)"/>

  <!-- IDE window -->
  <rect x="${wx + 0.8}" y="${wy + 1.6}" width="${ww}" height="${wh}" rx="3.2" fill="#000" opacity=".45"/>
  <clipPath id="bx-lidwin"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="3.2"/></clipPath>
  <g clip-path="url(#bx-lidwin)">
    <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#202124"/>
    <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="url(#dots)"/>
    <circle cx="158" cy="58" r="58" fill="url(#bx-glowP)"/>
    <rect x="${wx}" y="${barB}" width="${ww}" height="${floorY - barB}" fill="url(#bx-floor)"/>
    <!-- title bar -->
    <rect x="${wx}" y="${wy}" width="${ww}" height="9" fill="#2E3034"/>
    <circle cx="${wx + 5}" cy="${wy + 4.5}" r="1.25" fill="#F26D6D"/><circle cx="${wx + 9}" cy="${wy + 4.5}" r="1.25" fill="${C.gold}"/><circle cx="${wx + 13}" cy="${wy + 4.5}" r="1.25" fill="#5FB865"/>
    ${tab(wx + 18, 'Startup.kt', true)}${tab(wx + 40.2, 'Team.kt', false)}${tab(wx + 57.5, 'Roadmap.kt', false)}
    <g transform="translate(${wx + ww - 25} ${wy + 1.8})">
      <rect width="21" height="5.4" rx="1.2" fill="#3A3D42"/>
      <path d="M3 1.3L6.4 2.7L3 4.1Z" fill="#5FCB8B"/>
      <text x="8.4" y="3.85" font-size="2.4" font-weight="700" fill="${C.text}">ship()</text>
    </g>
    <!-- gutter -->
    <rect x="${wx}" y="${barB}" width="${gut}" height="${statT - barB}" fill="#000" opacity=".2"/>
    <g font-size="2.2" fill="#5D6168" text-anchor="end">${Array.from({ length: nLines }, (_, i) => `<text x="${wx + gut - 2.2}" y="${f2(lineY(i + 1) + 0.8)}">${i + 1}</text>`).join('')}</g>
    <path d="M${wx + gut + 2} ${lineY(4) - 3}V${lineY(11) + 1.6}" stroke="#3A3D42" stroke-width=".35"/>

    <!-- code column -->
    <text x="${x0}" y="${lineY(2) + 0.9}" font-size="2.75" font-style="italic" fill="${C.faint}">// build a Kotlin startup, ship the best app</text>
    ${wordmark(x0 - 1.2, lineY(7) - 0.4, 15.5)}
    <rect x="${f2(x0 - 1.2 + wordmarkW(15.5) + 1.2)}" y="${lineY(7) - 11.4}" width="1" height="12.6" fill="${PURPLE}" opacity=".85"/>
    <text x="${x0}" y="${lineY(9) - 0.6}" font-size="3.05" font-weight="700" letter-spacing=".95" fill="${C.muted}">BUILD · SHIP · COLLECT STARS</text>
    <text x="${x0}" y="${lineY(11) + 0.9}" font-size="2.9" xml:space="preserve">${tspans([[C.kw, 'val '], [C.text, 'winner = players.'], [C.fn, 'maxBy'], [C.text, ' { it.'], [C.cls, 'stars'], [C.text, ' }']])}</text>
    ${pill(x0 - 1, lineY(13) - 2.6, 'players', '2–5', 'players', 34.5)}
    ${pill(x0 + 36.5, lineY(13) - 2.6, 'clock', '20', 'min', 24.5)}
    ${pill(x0 + 64, lineY(13) - 2.6, 'age', '10+', 'age', 25)}

    <!-- scene -->
    ${sparkle(186, 19.5, 1.4, C.gold, .9)}${sparkle(196, 40, 1.2, '#F4E9FF', .7)}${sparkle(130, 47, 0.9, '#F4E9FF', .5)}
    ${fan}
    ${star(131, 66, 5.2, -12)}${star(193, 27, 5, 14)}${coin(127, 55, 4.6)}${coin(195, 52, 3.8)}
    ${team}
    ${sparkle(176, 62, 1.1, '#F4E9FF', .8)}

    <!-- status bar -->
    <rect x="${wx}" y="${statT}" width="${ww}" height="7.5" fill="#2E3034"/>
    ${ICON.branch(wx + 3, statT + 1.9, 3.8, C.muted)}
    <text x="${wx + 8}" y="${statT + 4.9}" font-size="2.5" fill="${C.muted}">main</text>
    ${ICON.check(wx + 22, statT + 1.8, 3.8, '#5FCB8B')}
    <text x="${wx + 27}" y="${statT + 4.9}" font-size="2.5" font-weight="700" fill="#5FCB8B">BUILD SUCCESSFUL</text>
    <text x="${wx + 56}" y="${statT + 4.9}" font-size="2.5" fill="${C.faint}">in 20 min</text>
    <text x="${wx + ww - 4}" y="${statT + 4.9}" font-size="2.5" fill="${C.faint}" text-anchor="end">75 cards · 5 boards · 3 sprints · UTF-8</text>
  </g>
  <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="3.2" fill="none" stroke="#4A4D53" stroke-width=".4"/>
  <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="3.2" fill="url(#bx-sheen)"/>`;
}

// ---------------------------------------------------------------- LID SIDES
// local frame: (0,0) top-left as seen from outside with the box closed; y = 0 is the lid's top crease
function lidLong(W, H, variant) {
  const cyM = H / 2 + 0.6;
  if (variant === 'front') {
    const size = 11, wmW = wordmarkW(size);
    const braceX = W / 2 - wmW / 2 - 7;
    const brace = (x, d) => `<path d="M${x + 2 * d} ${cyM - 9}C${x} ${cyM - 9} ${x + .3 * d} ${cyM - 7.6} ${x + .3 * d} ${cyM - 5.5}L${x + .3 * d} ${cyM - 2.3}C${x + .3 * d} ${cyM - .7} ${x - .5 * d} ${cyM} ${x - 1.6 * d} ${cyM}C${x - .5 * d} ${cyM} ${x + .3 * d} ${cyM + .7} ${x + .3 * d} ${cyM + 2.3}L${x + .3 * d} ${cyM + 5.5}C${x + .3 * d} ${cyM + 7.6} ${x} ${cyM + 9} ${x + 2 * d} ${cyM + 9}"/>`;
    return `${ground(W, H)}
      <circle cx="${W / 2}" cy="${cyM}" r="60" fill="url(#bx-glowP)" opacity=".8"/>
      <g fill="none" stroke="${PURPLE}" stroke-width=".55" stroke-linecap="round" opacity=".6">${brace(braceX, 1)}${brace(W - braceX, -1)}</g>
      ${wordmark(W / 2, cyM + 1.2, size, 'middle')}
      <text x="${W / 2}" y="${cyM + 6.6}" font-size="2.2" font-weight="700" letter-spacing=".7" fill="${C.muted}" text-anchor="middle">BUILD · SHIP · COLLECT STARS</text>
      <g transform="translate(9 ${cyM - 1.6})"><circle r="1.3" fill="#F26D6D"/><circle cx="4" r="1.3" fill="${C.gold}"/><circle cx="8" r="1.3" fill="#5FB865"/></g>
      <text x="9" y="${cyM + 5.2}" font-size="2.2" fill="${C.faint}" font-style="italic">// a card game</text>
      <g transform="translate(${W - 9} ${cyM})">${meta(0, 0, 'end')}</g>`;
  }
  // back: the team photo, a row of the deck's cast
  const cast = [
    ['p', { skin: 1, hair: 'short', hairColor: Kit.HAIR.brown, top: '#4FB3F6', mood: 'smile' }],
    ['r', { expression: 'happy', color: C.agent }],
    ['p', { skin: 3, hair: 'curly', hairColor: Kit.HAIR.black, top: '#2FB59A', topStyle: 'hoodie', mood: 'happy' }],
    ['p', { skin: 0, hair: 'long', hairColor: Kit.HAIR.blonde, top: '#C77DBB', mood: 'grin' }],
    ['p', { skin: 4, hair: 'grey', top: '#3B4252', topStyle: 'blazer', beard: true, mood: 'smile' }],
    ['r', { expression: 'scan', color: '#4FB3F6' }],
    ['p', { skin: 2, hair: 'bun', hairColor: Kit.HAIR.auburn, top: '#F5C451', glasses: true, mood: 'happy' }],
    ['p', { skin: 1, hair: 'side', hairColor: Kit.HAIR.pink, top: '#5FCB8B', topStyle: 'hoodie', headset: true, mood: 'grin' }],
  ];
  const span = 112, x1 = W - 12 - span;
  const row = cast.map(([t, o], i) => {
    const x = f2(x1 + 7 + i * (span - 14) / (cast.length - 1));
    return t === 'p' ? Kit.person(x, H - 2.6, { ...o, k: 1.02 }) : Kit.robot(x, H - 2.6, { ...o, k: 1.0 });
  }).join('');
  return `${ground(W, H)}
    <circle cx="${x1 + span / 2}" cy="${H}" r="62" fill="url(#bx-glowP)"/>
    <rect x="${x1 - 4}" y="${H - 3.2}" width="${span + 8}" height="1.1" rx=".55" fill="#2E3034"/>
    ${row}
    <text x="11" y="${H / 2 - 2.4}" font-size="2.3" font-style="italic" fill="${C.faint}">// the founding team</text>
    ${wordmark(10.4, H / 2 + 5.4, 8.2)}
    <text x="11" y="${H / 2 + 10.4}" font-size="2.2" xml:space="preserve">${tspans([[C.kw, 'data class '], [C.cls, 'Team'], [C.text, '(val '], [C.text, 'you'], [C.text, ': '], [C.cls, 'Founder'], [C.text, ')']])}</text>`;
}
// "2–5 players · 20 min · 10+" as a compact icon row (used on the front long side)
function meta(x, y, anchor) {
  const items = [['players', '2–5'], ['clock', '20′'], ['age', '10+']];
  const iw = 4.2, gap = 3.6;
  const widths = items.map(([, l]) => iw + 1.2 + l.length * 2.1);
  const total = widths.reduce((s, v) => s + v, 0) + gap * (items.length - 1);
  let cx = anchor === 'end' ? x - total : x;
  return items.map(([ic, l], i) => {
    const g = ICON[ic](cx, y - 3.3, iw, C.muted) + `<text x="${f2(cx + iw + 1.2)}" y="${y}" font-size="3.4" font-weight="800" fill="${C.text}">${l}</text>`;
    cx += widths[i] + gap; return g;
  }).join('');
}

function lidShort(W, H) {
  // players / time / age, then the sprint I -> II -> III track
  const cols = [['players', '2–5', 'PLAYERS'], ['clock', '20', 'MINUTES'], ['age', '10+', 'AGES']];
  const cw = 30, x0 = W / 2 - cw * 1.5;
  const top = cols.map(([ic, v, l], i) => {
    const cx = x0 + cw * i + cw / 2;
    return `${ICON[ic](cx - 10.5, 4.6, 6, C.text)}
      <text x="${cx - 3}" y="9.9" font-size="5" font-weight="800" fill="${C.text}">${v}</text>
      <text x="${cx - 3}" y="12.9" font-size="1.9" font-weight="700" letter-spacing=".4" fill="${C.muted}">${l}</text>`;
  }).join('') + [1, 2].map(i => `<rect x="${f2(x0 + cw * i - .15)}" y="5" width=".3" height="8" fill="#43454A"/>`).join('');
  // sprint track
  const ty = 21.2, tx0 = W / 2 - 29, tx1 = W / 2 + 31;
  const nodes = [1, 2, 3].map(s => {
    const x = tx0 + (tx1 - tx0) * (s - 1) / 2, rom = SPRINTS[s][0];
    return `<circle cx="${x}" cy="${ty}" r="3.6" fill="${BG}" stroke="${ACC[s]}" stroke-width=".6"/>
      <text x="${x}" y="${ty + 1.15}" font-size="3.2" font-weight="800" fill="${ACC[s]}" text-anchor="middle">${rom}</text>
      <text x="${x}" y="${ty + 6.8}" font-size="1.75" font-weight="700" letter-spacing=".35" fill="${C.faint}" text-anchor="middle">${SPRINTS[s][1]}</text>`;
  }).join('');
  const seg = (s, x1, x2) => `<line x1="${x1}" y1="${ty}" x2="${x2}" y2="${ty}" stroke="${ACC[s]}" stroke-width=".7" stroke-dasharray="1.4 1" opacity=".75"/>
    <path d="M${x2 - 1.6} ${ty - 1.1}L${x2 - .2} ${ty}L${x2 - 1.6} ${ty + 1.1}" fill="none" stroke="${ACC[s + 1]}" stroke-width=".6" stroke-linecap="round"/>`;
  const mid = (tx1 - tx0) / 2;
  return `${ground(W, H)}
    <circle cx="${W / 2}" cy="${ty}" r="40" fill="url(#bx-glowP)" opacity=".6"/>
    ${top}
    <text x="${tx0 - 5.6}" y="${ty + 0.7}" font-size="2" font-weight="700" letter-spacing=".4" fill="${C.muted}" text-anchor="end">SPRINT</text>
    ${seg(1, tx0 + 4.2, tx0 + mid - 4.2)}${seg(2, tx0 + mid + 4.2, tx1 - 4.2)}
    ${nodes}
    ${star(tx1 + 7.5, ty - .2, 4.4, 0)}`;
}

// ---------------------------------------------------------------- BASE
// local frame: y = 0 is the base's top rim (free edge); y = H is the bottom crease
function baseLong(W, H, variant) {
  if (variant === 'front') {
    const items = [['cards', '75', 'cards', 'two decks, sprint I – III'], ['board', '5', 'startup boards', 'one per player'], ['book', '1', 'rulebook', 'learn in 10 min']];
    const cw = 46, x0 = 58, dy = 2.6;
    const cols = items.map(([ic, n, l, s], i) => {
      const x = x0 + i * cw;
      return `${ICON[ic](x, 10.2 + dy, 8.4, [C.frontend, C.backend, C.gold][i])}
        <text x="${x + 11}" y="${15.4 + dy}" font-size="5.6" font-weight="800" fill="${C.text}">${n}<tspan font-size="3" font-weight="700" fill="${C.text}" dx="1.2">${l}</tspan></text>
        <text x="${x + 11}" y="${19.4 + dy}" font-size="2.1" fill="${C.faint}">${s}</text>`;
    }).join('') + [1, 2].map(i => `<rect x="${x0 + i * cw - 4}" y="${9 + dy}" width=".3" height="12" fill="#43454A"/>`).join('');
    return `${ground(W, H)}
      <rect x="-3" y="-3" width="${W + 6}" height="${H + 6}" fill="url(#bx-grid)"/>
      <text x="12" y="${11.6 + dy}" font-size="2.3" font-style="italic" fill="${C.faint}">// what's in the box</text>
      <text x="12" y="${17.6 + dy}" font-size="3.4" xml:space="preserve">${tspans([[C.kw, 'val '], [C.text, 'box = '], [C.fn, 'listOf'], [C.text, '(']])}</text>
      ${cols}
      <text x="${x0 + 3 * cw - 5}" y="${17.6 + dy}" font-size="3.4" fill="${C.text}">)</text>`;
  }
  return `${ground(W, H)}
    <rect x="-3" y="-3" width="${W + 6}" height="${H + 6}" fill="url(#bx-grid)"/>
    <circle cx="${W - 30}" cy="${H / 2}" r="40" fill="url(#bx-glowG)"/>
    <text x="12" y="11.4" font-size="2.3" font-style="italic" fill="${C.faint}">// TODO: ship before the runway runs out</text>
    <text x="12" y="17.8" font-size="3.3" xml:space="preserve">${tspans([[C.kw, 'while '], [C.text, '(runway > '], [C.str, '0'], [C.text, ') { '], [C.fn, 'build'], [C.text, '(); '], [C.fn, 'ship'], [C.text, '(); '], [C.fn, 'pivot'], [C.text, '() }']])}</text>
    <text x="12" y="23.8" font-size="3.3" xml:space="preserve">${tspans([[C.kw, 'return '], [C.text, 'stars.'], [C.fn, 'sum'], [C.text, '()  '], [C.faint, '// most stars win']])}</text>
    ${Kit.robot(W - 30, H - 6.5, { k: 1.25, expression: 'happy', color: C.agent })}
    ${shadow(W - 30, H - 6.3, 7, .8)}
    ${star(W - 41, 10.5, 4.4, -10)}${coin(W - 18.5, 11.5, 4)}`;
}
function baseShort(W, H) {
  return `${ground(W, H)}
    <rect x="-3" y="-3" width="${W + 6}" height="${H + 6}" fill="url(#bx-grid)"/>
    ${wordmark(W / 2, H / 2 + 2.2, 7.2, 'middle')}
    <g transform="translate(${W / 2 - 8.4} ${H / 2 + 6.2})">${[1, 2, 3].map(s => `<circle cx="${(s - 1) * 8.4}" r="1" fill="${ACC[s]}"/>`).join('')}
      <line x1="1.6" x2="6.8" stroke="#43454A" stroke-width=".35"/><line x1="10" x2="15.2" stroke="#43454A" stroke-width=".35"/></g>`;
}
// the underside of the box
function baseBottom(W, H) {
  return `${ground(W, H, 0, 0)}
    <rect width="${W}" height="${H}" fill="url(#bx-grid)"/>
    <circle cx="${W / 2}" cy="${H / 2 - 8}" r="70" fill="url(#bx-glowP)" opacity=".7"/>
    ${wordmark(W / 2, 32, 13, 'middle')}
    <text x="${W / 2}" y="39.5" font-size="2.6" font-weight="700" letter-spacing=".8" fill="${C.muted}" text-anchor="middle">BUILD · SHIP · COLLECT STARS</text>
    <text x="${W / 2}" y="52" font-size="3" fill="${C.text}" text-anchor="middle">Build a Kotlin startup. Ship the best app.</text>
    <text x="${W / 2}" y="56.6" font-size="3" fill="${C.text}" text-anchor="middle">Collect the most GitHub stars.</text>
    <g transform="translate(${W / 2} 68)">${meta(-25, 0, 'start')}</g>
    <text x="${W / 2}" y="80" font-size="2.4" fill="${C.faint}" text-anchor="middle">75 cards (63 × 88 mm) · 5 startup boards · 1 rulebook</text>
    <text x="${W / 2}" y="93" font-size="2" fill="${C.faint}" text-anchor="middle" font-style="italic">// a fan-made game. Not affiliated with or endorsed by JetBrains or the Kotlin Foundation.</text>
    <text x="${W / 2}" y="97" font-size="2" fill="${C.faint}" text-anchor="middle" font-style="italic">// no real logos were harmed in the making of this box</text>`;
}

// ---------------------------------------------------------------- flat sheet
// every face is drawn in its own upright frame and placed on the sheet with a rotation (see BOX-NOTES.md)
function faceArt(kind) {
  const g = geom(kind);
  if (kind === 'lid') return {
    main: lidTop(g.Lp, g.Wp),
    front: lidLong(g.Ll, g.H, 'front'), back: lidLong(g.Ll, g.H, 'back'),
    east: lidShort(g.Ws, g.H), west: lidShort(g.Ws, g.H),
  };
  return {
    main: baseBottom(g.Lp, g.Wp),
    front: baseLong(g.Ll, g.H, 'front'), back: baseLong(g.Ll, g.H, 'back'),
    east: baseShort(g.Ws, g.H), west: baseShort(g.Ws, g.H),
  };
}
// placement of each face's upright frame on the flat sheet.
// lid: printed side up = outside, walls hang down; base: the sheet is flipped over before folding, so the
// base's front/back/left/right map to rotated (and side-swapped) panels.
function placements(g) {
  const { cx, cy, a, p, w, sw, H } = g;
  if (g.kind === 'lid') return {
    main:  `translate(${cx - p} ${cy - w})`,
    front: `translate(${cx - a} ${cy + w})`,                       // y=0 at the crease
    back:  `translate(${cx + a} ${cy - w}) rotate(180)`,
    east:  `translate(${cx + p} ${cy + sw}) rotate(-90)`,          // right side of the box
    west:  `translate(${cx - p} ${cy - sw}) rotate(90)`,
  };
  return {
    main:  `translate(${cx - p} ${cy - w})`,
    front: `translate(${cx + a} ${cy + w + H}) rotate(180)`,       // y=0 at the rim
    back:  `translate(${cx - a} ${cy - w - H})`,
    east:  `translate(${cx - p - H} ${cy + sw}) rotate(-90)`,      // right side of the box = left panel on the sheet
    west:  `translate(${cx + p + H} ${cy - sw}) rotate(90)`,
  };
}
// clip of each face in its own frame: the face itself, plus bleed on the free (cut) edges
function faceClip(g, face) {
  const B = BLEED;
  if (face === 'main') return [0, 0, g.Lp, g.Wp];
  const len = face === 'front' || face === 'back' ? g.Ll : g.Ws;
  return g.kind === 'lid' ? [-B, 0, len + 2 * B, g.H + B] : [-B, -B, len + 2 * B, g.H + B];
}

function artLayer(kind) {
  const g = geom(kind), art = faceArt(kind), pl = placements(g);
  const order = ['front', 'back', 'east', 'west', 'main'];
  return `<g id="art-${kind}">
    <rect width="${g.sheetW}" height="${g.sheetH}" fill="${BG}"/><rect width="${g.sheetW}" height="${g.sheetH}" fill="url(#dots)"/>
    ${order.map(face => {
      const [x, y, w, h] = faceClip(g, face), id = `bx-clip-${kind}-${face}`;
      return `<g transform="${pl[face]}"><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
        <g clip-path="url(#${id})">${art[face]}</g></g>`;
    }).join('')}</g>`;
}

const pts = l => l.map(p => p.join(',')).join(' ');
const DIE = { cut: '#EC008C', crease: '#00AEEF', glue: '#F7941D' };

// mode 'print' (print-shop dieline), 'proof' (over the art), 'home' (thin, low-key lines for home printing)
function dieLayer(kind, mode = 'print') {
  const g = geom(kind);
  const home = mode === 'home';
  const cutC = home ? '#C9CCD2' : DIE.cut, crC = home ? '#C9CCD2' : DIE.crease;
  const sw = home ? 0.18 : 0.25;
  const glue = g.flaps.map(fl => `<polygon points="${pts(fl)}" fill="url(#bx-glue)" opacity="${home ? .55 : .9}"/>`).join('');
  const glueLabels = g.flaps.map(fl => {
    const xs = fl.map(p => p[0]), ys = fl.map(p => p[1]);
    const x = (Math.min(...xs) + Math.max(...xs)) / 2, y = (Math.min(...ys) + Math.max(...ys)) / 2;
    return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(90)"><rect x="-6" y="-2.2" width="12" height="3.6" rx="1" fill="${home ? BG : '#fff'}"/>
      <text y=".6" font-size="2.4" font-weight="800" fill="${DIE.glue}" text-anchor="middle">GLUE</text></g>`;
  }).join('');
  const out = `<polygon points="${pts(g.outline)}" fill="none" stroke="${cutC}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  const cuts = g.cuts.map(l => `<polyline points="${pts(l)}" fill="none" stroke="${cutC}" stroke-width="${sw}"/>`).join('');
  const creases = g.creases.map(([[x1, y1], [x2, y2]]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${crC}" stroke-width="${sw}" stroke-dasharray="${home ? '1.2 1.2' : '2 1'}" ${home ? 'opacity=".75"' : ''}/>`).join('');
  let labels = '';
  if (mode === 'print' || mode === 'proof') {
    const P = g.panels, tc = mode === 'print' ? '#333' : '#fff';
    const lbl = (x, y, s, size = 2.6, rot = 0, c = tc) => `<text transform="translate(${f2(x)} ${f2(y)}) rotate(${rot})" font-size="${size}" font-weight="700" fill="${c}" text-anchor="middle" ${mode === 'proof' ? 'paint-order="stroke" stroke="#000" stroke-width=".6" stroke-opacity=".7"' : ''}>${s}</text>`;
    const cxm = P.main[0] + P.main[2] / 2;
    // print: labels centred in the panels; proof: small labels just outside the panel creases, clear of the art
    const pr = mode === 'proof', ls = pr ? 2 : 2.6;
    labels += lbl(pr ? P.front[0] + 26 : cxm, pr ? P.front[1] + 3 : P.front[1] + g.H / 2 + 1, `FRONT WALL · ${g.Ll} × ${g.H}`, ls);
    labels += lbl(pr ? P.back[0] + P.back[2] - 26 : cxm, pr ? P.back[1] + g.H - 1.6 : P.back[1] + g.H / 2 + 1, `BACK WALL · ${g.Ll} × ${g.H}`, ls);
    labels += lbl(pr ? P.east[0] + 2.6 : P.east[0] + g.H / 2 + 1, P.east[1] + g.Ws / 2, `END WALL · ${g.Ws} × ${g.H}`, ls, -90);
    labels += lbl(pr ? P.west[0] + g.H - 2.6 : P.west[0] + g.H / 2 - 1, P.west[1] + g.Ws / 2, `END WALL · ${g.Ws} × ${g.H}`, ls, 90);
    if (pr) labels += lbl(P.main[0] + 22, P.main[1] + 3.2, `${kind === 'lid' ? 'LID TOP' : 'BOTTOM'} · ${g.Lp} × ${g.Wp}`, ls);
    if (mode === 'print') {
      const ly = P.main[1] + 12, lx = P.main[0] + 14;
      labels += `<g font-size="3" fill="#222">
        <text x="${lx}" y="${ly}" font-size="4.6" font-weight="800">Startup.kt · ${g.label} · die-line</text>
        <text x="${lx}" y="${ly + 6}">${kind === 'lid' ? 'LID TOP' : 'BOTTOM'} PANEL ${g.Lp} × ${g.Wp} mm · walls ${g.H} mm · board 350–400 g (T = ${T} mm)</text>
        <text x="${lx}" y="${ly + 11}">sheet incl. 3 mm bleed: ${r2(g.sheetW)} × ${r2(g.sheetH)} mm · trim box ${r2(g.trimW)} × ${r2(g.trimH)} mm</text>
        <text x="${lx}" y="${ly + 16}">inside ${g.inner.join(' × ')} mm · outside ${g.outer.join(' × ')} mm</text>
        <line x1="${lx}" y1="${ly + 23}" x2="${lx + 12}" y2="${ly + 23}" stroke="${DIE.cut}" stroke-width=".5"/><text x="${lx + 15}" y="${ly + 24}">CUT (solid magenta)</text>
        <line x1="${lx}" y1="${ly + 29}" x2="${lx + 12}" y2="${ly + 29}" stroke="${DIE.crease}" stroke-width=".5" stroke-dasharray="2 1"/><text x="${lx + 15}" y="${ly + 30}">CREASE (dashed cyan) · all folds go away from the printed side</text>
        <rect x="${lx}" y="${ly + 32.6}" width="12" height="3.6" fill="url(#bx-glue)" stroke="${DIE.glue}" stroke-width=".2"/><text x="${lx + 15}" y="${ly + 36}">GLUE on the printed side of the flaps, onto the inside of the end walls</text>
        <rect x="${lx}" y="${ly + 39}" width="12" height="3.6" fill="none" stroke="#999" stroke-width=".25" stroke-dasharray=".5 .5"/><text x="${lx + 15}" y="${ly + 42.2}">sheet edge = 3 mm bleed beyond every cut</text>
      </g>`;
    }
  }
  const edge = mode === 'print' ? `<rect x=".15" y=".15" width="${f2(g.sheetW - .3)}" height="${f2(g.sheetH - .3)}" fill="none" stroke="#999" stroke-width=".25" stroke-dasharray=".5 .5"/>` : '';
  return `<g id="die-${kind}">${edge}${glue}${home ? '' : glueLabels}${creases}${cuts}${out}${labels}</g>`;
}

function sheetSVG(kind, { art = true, die = null, w, h } = {}) {
  const g = geom(kind);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(g.sheetW)} ${r2(g.sheetH)}" width="${w || r2(g.sheetW) + 'mm'}" height="${h || r2(g.sheetH) + 'mm'}"
    font-family="JetBrains Mono, monospace" style="font-variant-ligatures:none;display:block">
    ${art ? artLayer(kind) : `<rect width="${g.sheetW}" height="${g.sheetH}" fill="#fff"/>`}
    ${die ? dieLayer(kind, die) : ''}</svg>`;
}

// a single face, upright, for previews and the 3D mockup
function faceSVG(kind, face, { pad = 0, mm = true } = {}) {
  const g = geom(kind), art = faceArt(kind)[face];
  const w = face === 'main' ? g.Lp : face === 'front' || face === 'back' ? g.Ll : g.Ws;
  const h = face === 'main' ? g.Wp : g.H;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}" ${mm ? `width="${w}mm" height="${h}mm"` : 'width="100%" height="100%" preserveAspectRatio="none"'}
    font-family="JetBrains Mono, monospace" style="font-variant-ligatures:none;display:block"><clipPath id="bx-fc-${kind}-${face}-${pad}"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath>
    <g clip-path="url(#bx-fc-${kind}-${face}-${pad})">${art}</g></svg>`;
}

// the rulebook cover (100 x 190 mm), used in the open-box mockup
function rulebookSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 100" width="100%" height="100%" font-family="JetBrains Mono, monospace" style="display:block">
    ${ground(190, 100, 0, 0)}<circle cx="50" cy="50" r="60" fill="url(#bx-glowP)"/>
    <text x="12" y="20" font-size="3" font-style="italic" fill="${C.faint}">// rules v4 · learn in 10 minutes</text>
    ${wordmark(11, 40, 13)}
    <text x="12" y="50" font-size="4.4" font-weight="800" letter-spacing="1.4" fill="${C.muted}">HOW TO SHIP</text>
    ${Kit.person(30, 92, { pose: 'present', k: 1.7, skin: 2, hair: 'long', hairColor: Kit.HAIR.chestnut, top: '#C77DBB', topStyle: 'blazer', mood: 'talk' })}
    ${Kit.robot(60, 92, { k: 1.5, body: true, arms: 'wave', color: C.agent })}
  </svg>`;
}

// ---------------------------------------------------------------- 3D mockup (CSS 3D, faces are the real art)
function mockup({ open = false, S = 2.4, rx = -26, ry = -32 } = {}) {
  const L = geom('lid'), B = geom('base');
  const px = mm => (mm * S).toFixed(1) + 'px';
  const face = (inner, w, h, tf, shade = 0, extra = '') =>
    `<div class="f3" style="width:${px(w)};height:${px(h)};margin:${px(-h / 2)} 0 0 ${px(-w / 2)};transform:${tf}">${inner}<i style="background:${shade}"></i>${extra}</div>`;
  const solid = (c) => `<div style="width:100%;height:100%;background:${c}"></div>`;
  // a box piece with outer size X (length) x Y (height) x Z (depth); faces: map of name -> html
  const piece = (X, Y, Z, faces, shades, tf) => `<div class="p3" style="transform:${tf}">
    ${faces.top ? face(faces.top, X, Z, `rotateX(90deg) translateZ(${px(Y / 2)})`, shades.top) : ''}
    ${faces.bottom ? face(faces.bottom, X, Z, `rotateX(-90deg) translateZ(${px(Y / 2)})`, shades.bottom) : ''}
    ${face(faces.front, X, Y, `translateZ(${px(Z / 2)})`, shades.front)}
    ${face(faces.right, Z, Y, `rotateY(90deg) translateZ(${px(X / 2)})`, shades.right)}
    ${faces.back ? face(faces.back, X, Y, `rotateY(180deg) translateZ(${px(Z / 2)})`, shades.back) : ''}
    ${faces.left ? face(faces.left, Z, Y, `rotateY(-90deg) translateZ(${px(X / 2)})`, shades.left) : ''}
    ${faces.extra || ''}</div>`;
  const fs = (k, f) => faceSVG(k, f, { mm: false });
  const [lX, lZ, lY] = L.outer, [bX, bZ, bY] = B.outer;
  const lidShades = { top: 'linear-gradient(160deg,rgba(255,255,255,.06),rgba(0,0,0,0) 40%,rgba(0,0,0,.1))', front: 'linear-gradient(rgba(0,0,0,.12),rgba(0,0,0,.32))', right: 'linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.55))' };
  const baseShades = { front: 'linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.3))', right: 'linear-gradient(rgba(0,0,0,.38),rgba(0,0,0,.55))', back: 'rgba(0,0,0,.2)', left: 'rgba(0,0,0,.2)', bottom: '' };
  const lidFaces = { top: fs('lid', 'main'), front: fs('lid', 'front'), right: fs('lid', 'east'), back: fs('lid', 'back'), left: fs('lid', 'west') };
  if (!open) {
    // closed: base on the table (y = 0 is the table), lid resting on the rim
    const baseFaces = { front: fs('base', 'front'), right: fs('base', 'east') };
    return `<div class="scene3" style="transform:rotateX(${rx}deg) rotateY(${ry}deg)">
      ${piece(bX, bY, bZ, baseFaces, baseShades, `translateY(${px(-bY / 2)})`)}
      ${piece(lX, lY, lZ, lidFaces, lidShades, `translateY(${px(-(bY + T) + lY / 2)})`)}
      <div class="shadow3" style="width:${px(lX * 1.1)};height:${px(lZ * 1.25)};margin:${px(-lZ * 0.625)} 0 0 ${px(-lX * 0.55)}"></div></div>`;
  }
  // open: base with contents, lid lifted and leaning back
  const board = '#D8D3C8';
  const inner = (w, h, tf, sh) => face(solid(board), w, h, tf, sh);
  const fillH = 24;   // height of the contents
  const iX = B.inner[0] + 1, iZ = B.inner[1], iY = bY - T;
  const contents = `<div class="p3" style="transform:translateY(${px(bY / 2 - T - fillH)})">
      ${face(`<div class="contents">${rulebookSVG()}
        <div class="stack" style="left:${px(150 - 31.5)};top:${px(55 - 44)};width:${px(63)};height:${px(88)};transform:rotate(-97deg) translate(${px(3)}, ${px(-2)})">${backCard(3)}</div>
        <div class="stack" style="left:${px(150 - 31.5)};top:${px(55 - 44)};width:${px(63)};height:${px(88)};transform:rotate(-84deg)">${backCard(1)}</div></div>`,
        iX - 1, iZ, `rotateX(90deg)`, '')}</div>`;
  const baseFaces = {
    front: fs('base', 'front'), right: fs('base', 'east'), back: fs('base', 'back'), left: fs('base', 'west'),
    extra: inner(iX, iY, `translateZ(${px(-bZ / 2 + T + .2)})`, 'rgba(0,0,0,.18)') +
      inner(iZ, iY, `rotateY(90deg) translateZ(${px(-bX / 2 + T + .2)})`, 'rgba(0,0,0,.05)') + contents,
  };
  return `<div class="scene3" style="transform:rotateX(${rx}deg) rotateY(${ry}deg)">
    ${piece(bX, bY, bZ, baseFaces, baseShades, `translateY(${px(-bY / 2)})`)}
    ${piece(lX, lY, lZ, lidFaces, lidShades, `translateY(${px(-bY - 34)}) translateZ(${px(-95)}) translateX(${px(10)}) rotateX(-12deg)`)}
    <div class="shadow3" style="width:${px(bX * 1.08)};height:${px(bZ * 1.25)};margin:${px(-bZ * 0.625)} 0 0 ${px(-bX * 0.54)}"></div></div>`;
}
function backCard(sprint) {
  return renderBack(sprint, { ns: 'mk' + sprint }).replace('<svg ', '<svg width="100%" height="100%" ').replace('viewBox="0 0 69 94"', 'viewBox="3 3 63 88"');
}

window.BOX = { T, BLEED, SPEC, geom, sheetSVG, faceSVG, artLayer, dieLayer, mockup, BOX_DEFS, DIE };
})();
