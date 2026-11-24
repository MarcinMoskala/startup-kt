// Startup.kt printable STARTUP BOARDS (one per player). Needs print/cards.js (C, Kit, iconAt, rich, esc, sharedDefs).
// Units are millimetres: viewBox 201x106 = 195x100 mm landscape board + 3 mm bleed on each side.
// Trim box: x 3..198, y 3..103. Safe zone: x 6..195, y 6..100.
//
// Layout (bleed coordinates):
//   header        y 0..23     startup accent gradient: emblem, name, genre, roadmap rule reminder
//   art window    x 6..127, y 26..66   IDE window with the startup illustration
//   side column   x 130..195, y 26..66 PRODUCES block, AT START tile, flavor code
//   roadmap       y 69..106   3 stage slots, each 63 mm wide (= card width) at x 4.5 / 69 / 133.5,
//                             so a card tucked under the bottom edge lines up with its slot.
// Source of truth for the numbers: Cards.kt `startups` and RULES.md.
(() => {
const W = 201, H = 106;
const SLOT_W = 63, SLOT_X = [4.5, 69, 133.5], SLOT_Y = 69;
const f = n => +(+n).toFixed(2);
const K = Kit;

// ---------- small shared drawing helpers ----------
const shadow = (cx, cy, rx, ry = 0.9, o = 0.35) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;
const T = (x, y, parts, size = 2, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" xml:space="preserve" ${extra}>${parts.map(([c, s, b]) => `<tspan fill="${c}"${b ? ' font-weight="800"' : ''}>${esc(s)}</tspan>`).join('')}</text>`;
const heart = (cx, cy, s, fill) => `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 1.6C-1.9 0.3 -2.6 -0.6 -2.6 -1.4C-2.6 -2.3 -1.9 -2.9 -1.2 -2.9C-0.6 -2.9 -0.2 -2.6 0 -2.2C0.2 -2.6 0.6 -2.9 1.2 -2.9C1.9 -2.9 2.6 -2.3 2.6 -1.4C2.6 -0.6 1.9 0.3 0 1.6Z" fill="${fill}"/>`;
const check = (cx, cy, r, c = C.backend) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" stroke="${C.bg}" stroke-width="${f(r * 0.22)}"/>
  <path d="M${f(cx - r * 0.45)} ${f(cy)}L${f(cx - r * 0.1)} ${f(cy + r * 0.38)}L${f(cx + r * 0.5)} ${f(cy - r * 0.35)}" fill="none" stroke="${C.bg}" stroke-width="${f(r * 0.3)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const cloud = (x, y, k = 1, o = 0.9) => `<g transform="translate(${x} ${y}) scale(${k})" opacity="${o}">
  <path d="M-6 1.6Q-6.6 -0.6 -4.4 -1Q-4 -3.6 -1.4 -3.4Q0 -5.4 2.4 -4Q4.6 -4 4.6 -1.6Q6.6 -1.2 6 1.6Z" fill="#3A3D44"/>
  <path d="M-4.4 -1Q-4 -3.6 -1.4 -3.4Q0 -5.4 2.4 -4" fill="none" stroke="#50545C" stroke-width=".5" stroke-linecap="round"/></g>`;
const coinStack = (x, y, n, w = 7) => Array.from({ length: n }, (_, i) => {
  const cy = y - i * 1.35;
  return `<rect x="${f(x - w / 2)}" y="${f(cy - 1.4)}" width="${w}" height="1.4" rx=".7" fill="${C.goldDark}"/>
  <ellipse cx="${x}" cy="${f(cy - 1.4)}" rx="${w / 2}" ry=".7" fill="${i === n - 1 ? C.gold : '#E0AE3C'}"/>`;
}).join('') + `<ellipse cx="${x}" cy="${f(y - (n - 1) * 1.35 - 1.4)}" rx="${f(w / 2 - 1)}" ry=".35" fill="none" stroke="${C.goldDark}" stroke-width=".25"/>`;

// ---------- emblems (header badge, drawn around 0,0 in a ~12 mm square) ----------
const EMBLEM = {
  heart: a => `${heart(0, 0.6, 2.05, a)}<path d="M-3.4 -3.3Q-2.6 -4.4 -1.4 -4.1" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".55"/>`,
  plane: a => `<g transform="rotate(-35)"><path d="M-5.6 0Q-5.6 -0.9 -4.4 -0.9L4.6 -0.9Q6 -0.9 6 0Q6 0.9 4.6 0.9L-4.4 0.9Q-5.6 0.9 -5.6 0Z" fill="${a}"/>
    <path d="M-0.8 -0.8L-3.2 -5.2L-1.6 -5.2L2.4 -0.8ZM-0.8 0.8L-3.2 5.2L-1.6 5.2L2.4 0.8Z" fill="${K.light(a, 0.2)}"/>
    <path d="M-4.4 -0.8L-5.6 -2.9L-4.6 -2.9L-3.2 -0.8ZM-4.4 0.8L-5.6 2.9L-4.6 2.9L-3.2 0.8Z" fill="${K.light(a, 0.2)}"/></g>`,
  parcel: a => `<path d="M-5 -2.6L0 -5L5 -2.6L0 -0.2Z" fill="#E0B27A"/><path d="M-5 -2.6L0 -0.2L0 5.2L-5 2.8Z" fill="#C8935A"/><path d="M5 -2.6L0 -0.2L0 5.2L5 2.8Z" fill="#A8743F"/>
    <path d="M-2.5 -3.8L2.5 -1.4L2.5 1.4" fill="none" stroke="#F1D7AE" stroke-width=".9"/>
    <circle cx="-2.4" cy="1.6" r="1.7" fill="${a}"/><circle cx="-2.4" cy="1.6" r="1" fill="none" stroke="${K.dark(a, 0.25)}" stroke-width=".35"/>`,
  gamepad: a => `<path d="M-3.4 -3.2L3.4 -3.2Q5.6 -3.2 6 -0.6L6.4 2.4Q6.6 4.4 4.9 4.4Q3.9 4.4 3 3L2.2 1.8L-2.2 1.8L-3 3Q-3.9 4.4 -4.9 4.4Q-6.6 4.4 -6.4 2.4L-6 -0.6Q-5.6 -3.2 -3.4 -3.2Z" fill="${a}"/>
    <path d="M-4.3 -1.6L-4.3 1M-5.6 -0.3L-3 -0.3" stroke="${C.bg}" stroke-width=".85" stroke-linecap="round"/>
    <circle cx="3.6" cy="-1.3" r=".75" fill="${C.gold}"/><circle cx="4.9" cy="0" r=".75" fill="${C.backend}"/><circle cx="2.3" cy="0" r=".75" fill="${C.frontend}"/>`,
  vault: a => `<circle r="5.6" fill="#8D939E"/><circle r="4.6" fill="#B9BFC9"/><circle r="4.6" fill="none" stroke="#6E747E" stroke-width=".35"/>
    ${[0, 60, 120].map(d => `<rect x="-3.4" y="-.4" width="6.8" height=".8" rx=".4" fill="${C.goldDark}" transform="rotate(${d})"/>`).join('')}
    <circle r="1.5" fill="${C.gold}"/><circle r=".6" fill="${C.goldDark}"/>`,
};

// ---------- illustrations (art area: x 11..126, y 30..66) ----------
const ART_FN = {
  // A dating app that lives and dies by its UI: swipe right on a profile, it's a match.
  companion: ns => {
    const rose = '#F0648F', roseD = '#C93D6C';
    const px = 44, py = 31.2, pw = 27, ph = 34;
    const profile = `<clipPath id="${ns}-pc"><rect x="${px + 3}" y="${py + 5}" width="${pw - 6}" height="18" rx="1.4"/></clipPath>
      <g transform="rotate(-9 ${px + pw / 2} ${py + 22})"><rect x="${px + 3.4}" y="${py + 5.6}" width="${pw - 6.8}" height="21" rx="1.4" fill="#3A3D44"/></g>
      <g transform="rotate(5 ${px + pw / 2} ${py + 22})"><rect x="${px + 3.2}" y="${py + 5.4}" width="${pw - 6.4}" height="21" rx="1.4" fill="#45484F"/></g>
      <rect x="${px + 3}" y="${py + 5}" width="${pw - 6}" height="21.6" rx="1.4" fill="${C.surface}"/>
      <g clip-path="url(#${ns}-pc)"><rect x="${px + 3}" y="${py + 5}" width="${pw - 6}" height="18" fill="#4A3B55"/>
        <circle cx="${px + pw / 2}" cy="${py + 12}" r="9" fill="#5D4568"/>
        ${K.person(px + pw / 2, py + 23.4, { k: 1.05, hair: 'long', hairColor: K.HAIR.auburn, skin: 1, top: C.gold, topStyle: 'tee', mood: 'happy' })}</g>
      <rect x="${px + 3}" y="${py + 19.4}" width="${pw - 6}" height="7.2" rx="0" fill="${C.surface}" opacity=".92"/>
      ${T(px + 4.4, py + 22.4, [[C.text, 'Ada', true], [C.muted, ', 27']], 2.1)}
      ${T(px + 4.4, py + 25.2, [[C.muted, 'Kotlin dev · 2 km']], 1.6)}
      <rect x="${px + 3}" y="${py + 23}" width="${pw - 6}" height="3.6" rx="1.4" fill="none"/>`;
    const buttons = `
      <circle cx="${px + 7.2}" cy="${py + 29.8}" r="2.3" fill="#3A3D44"/><path d="M${px + 6.3} ${py + 28.9}l1.8 1.8m0 -1.8l-1.8 1.8" stroke="${C.muted}" stroke-width=".55" stroke-linecap="round"/>
      <circle cx="${px + pw / 2}" cy="${py + 29.8}" r="2" fill="#3A3D44"/><use href="#i-star" x="${px + pw / 2 - 1.2}" y="${py + 28.6}" width="2.4" height="2.4" fill="${C.frontend}"/>
      <circle cx="${px + pw - 7.2}" cy="${py + 29.8}" r="2.6" fill="${rose}"/>${heart(px + pw - 7.2, py + 30.3, 0.62, '#fff')}`;
    const phoneSvg = `${shadow(px + pw / 2, 65.2, 15, 1)}
      <rect x="${px + 0.7}" y="${py}" width="${pw}" height="${ph}" rx="3" fill="${K.dark(rose, 0.45)}"/>
      <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="3" fill="#2A2C31" stroke="${rose}" stroke-width=".5"/>
      <rect x="${px + 1.2}" y="${py + 1.2}" width="${pw - 2.4}" height="${ph - 2.4}" rx="2.1" fill="${C.bg}"/>
      <rect x="${px + pw / 2 - 3}" y="${py + 1.6}" width="6" height="1.2" rx=".6" fill="#2A2C31"/>
      ${heart(px + 4.2, py + 4, 0.38, rose)}${T(px + 6, py + 4.4, [[C.text, 'companion', true]], 1.7)}
      ${profile}${buttons}`;
    // swiping hand-ish arrow from the profile to the right
    const swipe = `<path d="M${px + pw + 2} ${py + 14}Q${px + pw + 7} ${py + 11} ${px + pw + 10} ${py + 14}" fill="none" stroke="${rose}" stroke-width=".7" stroke-linecap="round" stroke-dasharray="1.2 1"/>
      <path d="M${px + pw + 9} ${py + 12.4}L${px + pw + 10.4} ${py + 14.3}L${px + pw + 8.2} ${py + 14.8}" fill="none" stroke="${rose}" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round"/>`;
    // the match: two avatars and a big heart
    const av = (cx, cy, r, opts, id) => `<clipPath id="${ns}-${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <circle cx="${cx}" cy="${cy + 0.4}" r="${r + 0.8}" fill="#000" opacity=".3"/>
      <circle cx="${cx}" cy="${cy}" r="${r + 0.7}" fill="${rose}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${opts.bg}"/>
      <g clip-path="url(#${ns}-${id})">${K.person(cx, cy + r + 0.6, { k: 0.95, ...opts })}</g>`;
    const match = `
      ${av(90, 43.5, 7, { bg: '#2F4C5E', hair: 'curly', hairColor: K.HAIR.black, skin: 3, top: C.frontend, topStyle: 'hoodie', mood: 'grin' }, 'a1')}
      ${av(108, 43.5, 7, { bg: '#4A3B55', hair: 'long', hairColor: K.HAIR.auburn, skin: 1, top: C.gold, mood: 'happy' }, 'a2')}
      <circle cx="99" cy="48.6" r="4" fill="${C.bg}"/>${heart(99, 49.4, 1.25, rose)}
      <path d="M96.6 46.6Q97.3 45.7 98.1 45.9" fill="none" stroke="#fff" stroke-width=".4" stroke-linecap="round" opacity=".6"/>
      <text x="99" y="57.6" font-size="3.3" font-weight="800" fill="${rose}" text-anchor="middle">It's a match!</text>
      <rect x="86.4" y="59.6" width="25.2" height="4.4" rx="2.2" fill="${C.surface2}"/>
      ${T(88.4, 62.6, [[C.kw, 'val '], [C.text, 'date = '], [C.fn, 'Date'], [C.text, '()']], 1.75)}`;
    const floaters = [[79, 35, 0.55, rose], [83.5, 31.8, 0.4, K.light(rose, 0.3)], [118, 33.5, 0.5, rose], [121.5, 39, 0.35, K.light(rose, 0.3)], [80, 52, 0.38, K.light(rose, 0.2)]]
      .map(([x, y, s, c]) => heart(x, y, s, c)).join('');
    // the swiper, phone in hand
    const swiper = `${shadow(25, 65.3, 8, 0.9)}${K.person(25, 65.2, { pose: 'point', k: 1.4, hair: 'side', hairColor: K.HAIR.black, skin: 3, top: C.frontend, topStyle: 'hoodie', pants: '#3B4560', mood: 'grin' })}`;
    return `<circle cx="${px + pw / 2}" cy="48" r="22" fill="${rose}" opacity=".07"/><circle cx="99" cy="46" r="17" fill="${rose}" opacity=".06"/>
      ${floaters}${swiper}${phoneSvg}${swipe}${match}`;
  },

  // Bookings that suspend politely while the airline API thinks about it.
  'suspend-fun-travel': ns => {
    const sea = '#22B5C9', seaD = '#1586A8';
    const pin = (x, y, code, c) => `${shadow(x, y + 0.4, 2.4, 0.6)}
      <path d="M${x} ${y}C${x - 1.2} ${y - 2.6} ${x - 3.6} ${y - 4.6} ${x - 3.6} ${y - 7.2}A3.6 3.6 0 0 1 ${x + 3.6} ${y - 7.2}C${x + 3.6} ${y - 4.6} ${x + 1.2} ${y - 2.6} ${x} ${y}Z" fill="${c}"/>
      <circle cx="${x}" cy="${y - 7.2}" r="1.4" fill="${C.bg}"/>
      <rect x="${x - 4.2}" y="${y + 1.4}" width="8.4" height="3.4" rx="1.1" fill="${C.surface2}"/>
      <text x="${x}" y="${y + 3.85}" font-size="2" font-weight="800" fill="${C.text}" text-anchor="middle">${code}</text>`;
    const p0 = [40, 49], c1 = [79, 28], p2 = [117, 47];
    const route = `<path d="M${p0[0]} ${p0[1] - 7}Q${c1[0]} ${c1[1]} ${p2[0]} ${p2[1] - 7}" fill="none" stroke="${sea}" stroke-width=".6" stroke-dasharray="1.4 1.1" stroke-linecap="round" opacity=".9"/>`;
    const plane = `<g transform="translate(78.8 33.8) rotate(-2) scale(1.05)">
      <ellipse cx="0" cy="3.2" rx="7" ry=".7" fill="#000" opacity=".22"/>
      <path d="M-7.4 0Q-7.4 -1.3 -5.8 -1.3L5.4 -1.3Q8 -1.3 8.4 0Q8 1.3 5.4 1.3L-5.8 1.3Q-7.4 1.3 -7.4 0Z" fill="#E8EAED"/>
      <path d="M-7.4 0Q-7.4 1.3 -5.8 1.3L5.4 1.3Q8 1.3 8.4 0Z" fill="#B9BFC9"/>
      <path d="M-1.4 -1.2L-4.2 -6L-2.4 -6L2.6 -1.2Z" fill="${sea}"/><path d="M-1.4 1.2L-3.6 4.6L-1.9 4.6L2.4 1.2Z" fill="${seaD}"/>
      <path d="M-5.6 -1.2L-7.2 -4.2L-5.9 -4.2L-3.9 -1.2Z" fill="${sea}"/>
      ${[0, 1.6, 3.2].map(dx => `<circle cx="${f(1 + dx - 3)}" cy="-.2" r=".38" fill="${seaD}"/>`).join('')}
      <path d="M6.4 -0.9Q7.6 -0.7 7.9 -0.2L6.4 -0.2Z" fill="${seaD}"/></g>`;
    // boarding pass with a suspended status
    const tx = 50, ty = 41.5, tw = 56, th = 21;
    const ticket = `${shadow(tx + tw / 2, ty + th + 1.4, tw / 2 + 1, 1)}
      <path d="M${tx + 1.4} ${ty}L${tx + tw - 1.4} ${ty}Q${tx + tw} ${ty} ${tx + tw} ${ty + 1.4}L${tx + tw} ${ty + th - 1.4}Q${tx + tw} ${ty + th} ${tx + tw - 1.4} ${ty + th}L${tx + 1.4} ${ty + th}Q${tx} ${ty + th} ${tx} ${ty + th - 1.4}L${tx} ${ty + 1.4}Q${tx} ${ty} ${tx + 1.4} ${ty}Z" fill="#E8EAED"/>
      <path d="M${tx} ${ty + 1.4}Q${tx} ${ty} ${tx + 1.4} ${ty}L${tx + tw - 1.4} ${ty}Q${tx + tw} ${ty} ${tx + tw} ${ty + 1.4}L${tx + tw} ${ty + 5}L${tx} ${ty + 5}Z" fill="${sea}"/>
      <text x="${tx + 2.4}" y="${ty + 3.5}" font-size="2" font-weight="800" fill="#fff" letter-spacing=".25">BOARDING PASS</text>
      <text x="${tx + 39.4}" y="${ty + 3.5}" font-size="1.7" font-weight="700" fill="#fff" opacity=".85">KT 2.0</text>
      <circle cx="${tx + 41.6}" cy="${ty}" r="1.3" fill="${C.surface}"/><circle cx="${tx + 41.6}" cy="${ty + th}" r="1.3" fill="${C.surface}"/>
      <path d="M${tx + 41.6} ${ty + 6}L${tx + 41.6} ${ty + th - 1.8}" stroke="#B9BFC9" stroke-width=".3" stroke-dasharray=".8 .6"/>
      <text x="${tx + 2.4}" y="${ty + 10.6}" font-size="4.2" font-weight="800" fill="#2A2C31">WAW</text>
      <path d="M${tx + 13.6} ${ty + 9.2}L${tx + 20} ${ty + 9.2}M${tx + 18.6} ${ty + 7.9}L${tx + 20} ${ty + 9.2}L${tx + 18.6} ${ty + 10.5}" fill="none" stroke="${seaD}" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="${tx + 21.8}" y="${ty + 10.6}" font-size="4.2" font-weight="800" fill="#2A2C31">LIS</text>
      <text x="${tx + 2.4}" y="${ty + 13.4}" font-size="1.6" fill="#6F737A">gate 7 · seat 12A</text>
      <rect x="${tx + 2.2}" y="${ty + 15}" width="36.6" height="4.4" rx="2.2" fill="#FFF2CF"/>
      <rect x="${tx + 3.6}" y="${ty + 16.1}" width=".7" height="2.2" rx=".3" fill="${C.goldDark}"/><rect x="${tx + 4.9}" y="${ty + 16.1}" width=".7" height="2.2" rx=".3" fill="${C.goldDark}"/>
      ${T(tx + 7, ty + 18.1, [[C.goldDark, 'suspended', true], ['#6F737A', ' · awaiting API']], 1.75)}
      ${[0, 1, 2].map(i => `<circle cx="${tx + 35.4 + i * 1.1}" cy="${ty + 17.2}" r=".38" fill="${C.goldDark}" opacity="${[1, .6, .3][i]}"/>`).join('')}
      ${Array.from({ length: 11 }, (_, i) => `<rect x="${f(tx + 43.6 + i * 0.95)}" y="${ty + 7.4}" width="${[.5, .3, .6, .3, .45, .3, .6, .3, .5, .3, .45][i]}" height="11.4" fill="#2A2C31"/>`).join('')}`;
    // traveller with a rolling suitcase
    const suitcase = `${shadow(31.6, 65.2, 4, 0.6)}
      <path d="M30.2 51.6L30.2 48.6Q30.2 48 30.8 48L32.6 48Q33.2 48 33.2 48.6L33.2 51.6" fill="none" stroke="#6F737A" stroke-width=".5"/>
      <rect x="27.4" y="51.4" width="8.6" height="12.4" rx="1.3" fill="${sea}"/>
      <rect x="33.6" y="51.4" width="2.4" height="12.4" rx="1" fill="${seaD}"/>
      <path d="M29.6 52.6L29.6 62.6M31.8 52.6L31.8 62.6" stroke="${K.light(sea, 0.3)}" stroke-width=".4"/>
      <rect x="27.8" y="55.6" width="5" height="2.4" rx=".5" fill="${C.gold}"/>
      <circle cx="29" cy="64.4" r=".7" fill="#2A2C31"/><circle cx="34.6" cy="64.4" r=".7" fill="#2A2C31"/>`;
    const traveller = `${shadow(20, 65.3, 6.5, 0.85)}${K.person(20, 65.2, { pose: 'stand', k: 1.38, hair: 'bun', hairColor: K.HAIR.brown, skin: 2, top: C.gold, topStyle: 'shirt', pants: '#3B4560', mood: 'smile' })}`;
    const sun = `<circle cx="121" cy="34" r="2.6" fill="${C.gold}"/><circle cx="121" cy="34" r="3.9" fill="${C.gold}" opacity=".15"/>`;
    return `${sun}${cloud(56, 36.4, 0.8)}${cloud(103, 35.4, 0.7, .8)}${cloud(31, 35, 0.55, .7)}${route}
      ${pin(p0[0], p0[1], 'WAW', seaD)}${pin(p2[0], p2[1], 'LIS', sea)}${plane}${ticket}${suitcase}${traveller}`;
  },

  // sealed class Order: every state handled, no else branch, no lost parcels.
  'sealed-deals': ns => {
    const red = '#E8574A';
    const box = (x, y, w, h, seal) => {
      const d = 2.6;
      return `${shadow(x + w / 2 + 1, y + h + 0.1, w / 2 + 1.4, 0.6, .3)}
      <path d="M${x} ${y}L${x + d} ${y - d}L${x + w + d} ${y - d}L${x + w} ${y}Z" fill="#E0B27A"/>
      <path d="M${x + w} ${y}L${x + w + d} ${y - d}L${x + w + d} ${y + h - d}L${x + w} ${y + h}Z" fill="#9C6A38"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C8935A"/>
      <path d="M${x + w / 2 - 1.2} ${y}L${x + w / 2 + 1.3} ${y - d}L${x + w / 2 + 2.9} ${y - d}L${x + w / 2 + 0.4} ${y}Z" fill="#F1D7AE"/>
      <rect x="${x + w / 2 - 1.2}" y="${y}" width="1.6" height="${f(h * 0.42)}" fill="#F1D7AE"/>
      <rect x="${x + 1.2}" y="${y + h - 4.6}" width="${f(w * 0.42)}" height="3.4" rx=".3" fill="#F5E6CC"/>
      <rect x="${x + 1.8}" y="${y + h - 3.8}" width="${f(w * 0.3)}" height=".5" rx=".25" fill="#9C6A38"/><rect x="${x + 1.8}" y="${y + h - 2.6}" width="${f(w * 0.2)}" height=".5" rx=".25" fill="#9C6A38"/>
      ${seal ? `<circle cx="${x + w - 4}" cy="${y + h - 4.2}" r="2.8" fill="${K.dark(red, 0.2)}"/><circle cx="${x + w - 4.2}" cy="${y + h - 4.4}" r="2.6" fill="${red}"/>
        <circle cx="${x + w - 4.2}" cy="${y + h - 4.4}" r="1.7" fill="none" stroke="${K.dark(red, 0.25)}" stroke-width=".35"/>
        <path d="M${x + w - 5.1} ${y + h - 4.4}L${x + w - 4.4} ${y + h - 3.6}L${x + w - 3.2} ${y + h - 5.2}" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}`;
    };
    const tag = (cx, y, name, c) => {
      const w = name.length * 1.2 + 7.6;
      return `<rect x="${f(cx - w / 2 + .25)}" y="${y + .5}" width="${w}" height="4.2" rx="1.1" fill="#000" opacity=".3"/>
      <rect x="${f(cx - w / 2)}" y="${y}" width="${w}" height="4.2" rx="1.1" fill="${C.surface}" stroke="${c}" stroke-width=".35"/>
      ${T(f(cx - w / 2 + 1.2), y + 2.9, [[C.kw, 'is '], [C.cls, name, true]], 1.85)}
      ${check(f(cx + w / 2 - 1.9), y + 2.1, 1.1)}
      <path d="M${cx} ${y + 4.2}L${cx} ${y + 6.4}" stroke="${c}" stroke-width=".3" stroke-dasharray=".6 .5"/>`;
    };
    const belt = `${shadow(57, 64.8, 46, 0.8, .3)}
      <rect x="13" y="56.6" width="88" height="4.6" rx="2.3" fill="#2A2C31"/>
      <rect x="13.4" y="57" width="87.2" height="1.2" rx=".6" fill="#4A4D55"/>
      ${Array.from({ length: 12 }, (_, i) => `<circle cx="${f(16 + i * 7.6)}" cy="59.4" r="1.25" fill="#5B5F68"/><circle cx="${f(16 + i * 7.6)}" cy="59.4" r=".4" fill="#2A2C31"/>`).join('')}
      <rect x="18" y="61.2" width="1.6" height="3.4" fill="#3A3D44"/><rect x="94" y="61.2" width="1.6" height="3.4" fill="#3A3D44"/>
      ${[0, 1, 2].map(i => `<path d="M${30 + i * 26} 63.4l1.6 -.8l0 1.6z" fill="${C.faint}"/>`).join('')}`;
    const boxes = box(17, 43.4, 17, 13.2, false) + box(43, 43.4, 17, 13.2, false) + box(69, 43.4, 17, 13.2, true);
    const tags = tag(26.5, 33.2, 'Placed', C.cls) + tag(52.5, 33.2, 'Paid', C.cls) + tag(78.5, 33.2, 'Shipped', C.cls);
    // no else branch: struck through
    const noElse = `<rect x="93.2" y="33.4" width="13" height="4.2" rx="1.1" fill="none" stroke="${C.faint}" stroke-width=".3" stroke-dasharray=".8 .6"/>
      <text x="99.7" y="36.3" font-size="1.85" fill="${C.faint}" text-anchor="middle">else</text>
      <path d="M95.6 35.6L103.8 35.6" stroke="${red}" stroke-width=".3"/>`;
    // courier at the end of the line, delivered parcel in hand
    const courier = `${shadow(113.5, 65.3, 6.5, 0.85)}${K.person(113.5, 65.2, { pose: 'stand', k: 1.38, hair: 'short', hairColor: K.HAIR.black, skin: 4, beard: true, top: red, topStyle: 'tee', pants: '#3B4560', mood: 'grin' })}
      ${box(106.4, 50.2, 7.6, 5.6, false).replace(/<ellipse[^>]*\/>/, '')}
      ${check(120.6, 33.4, 1.6)}
      <text x="112.4" y="34.6" font-size="1.85" font-weight="700" fill="${C.backend}" text-anchor="middle">Delivered</text>`;
    return `${belt}${boxes}${tags}${noElse}${courier}`;
  },

  // Assets load by lazy, and so does the team on Fridays.
  'by-lazy-studio': ns => {
    const mag = '#D04BE0';
    const sx = 13.5, sy = 31.4, sw = 58, sh = 28;
    const px = 2.2;   // pixel size
    const blocks = (x0, y0, cols, rows, c, cd) => {
      let s = '';
      for (let r = 0; r < rows; r++) for (let c2 = 0; c2 < cols; c2++)
        s += `<rect x="${f(x0 + c2 * px)}" y="${f(y0 + r * px)}" width="${px - 0.15}" height="${px - 0.15}" fill="${r === 0 ? c : cd}"/>`;
      return s;
    };
    const gx = sx + 1.4, gy = sy + 1.4, gw = sw - 2.8, gh = sh - 2.8;
    const loaded = 33;   // width of the part of the level that has loaded
    const level = `<clipPath id="${ns}-scr"><rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="1"/></clipPath>
      <g clip-path="url(#${ns}-scr)">
        <rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="#2B2350"/>
        <rect x="${gx}" y="${gy + gh * 0.45}" width="${gw}" height="${gh * 0.55}" fill="#3A2C66"/>
        <circle cx="${gx + 8}" cy="${gy + 7}" r="3" fill="#FFD36E" opacity=".9"/>
        <path d="M${gx} ${gy + 19}L${gx + 6} ${gy + 13}L${gx + 11} ${gy + 17}L${gx + 17} ${gy + 11}L${gx + 25} ${gy + 19}Z" fill="#4B3A84"/>
        ${blocks(gx, gy + gh - px * 2, 16, 2, C.backend, '#8A5A3C')}
        ${blocks(gx + 15, gy + 12.6, 5, 1, C.backend, '#8A5A3C')}
        ${[0, 1, 2].map(i => `<circle cx="${f(gx + 16.6 + i * 3.6)}" cy="${gy + 10.4}" r=".95" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".25"/>`).join('')}
        <g transform="translate(${gx + 6.4} ${gy + gh - px * 2})">
          <rect x="0" y="-5.4" width="3.6" height="3.4" rx=".3" fill="${mag}"/><rect x=".5" y="-6.4" width="2.6" height="1.2" fill="${K.dark(mag, 0.3)}"/>
          <rect x="2" y="-4.6" width=".8" height=".9" fill="#fff"/><rect x=".4" y="-2" width="1" height="2" fill="#2A2C31"/><rect x="2.2" y="-2" width="1" height="2" fill="#2A2C31"/></g>
        <g transform="translate(${gx + 26} ${gy + gh - px * 2})"><path d="M0 0L0 -2.2Q0 -3.8 1.8 -3.8Q3.6 -3.8 3.6 -2.2L3.6 0Z" fill="${red()}"/><rect x=".8" y="-2.8" width=".7" height=".8" fill="#fff"/><rect x="2.1" y="-2.8" width=".7" height=".8" fill="#fff"/></g>
        <!-- not loaded yet: wireframe placeholder -->
        <rect x="${gx + loaded}" y="${gy}" width="${gw - loaded}" height="${gh}" fill="#1B1C20"/>
        <g stroke="#3A3D44" stroke-width=".25">${Array.from({ length: 9 }, (_, i) => `<path d="M${f(gx + loaded + i * px * 1.5)} ${gy}L${f(gx + loaded + i * px * 1.5)} ${gy + gh}"/>`).join('')}
          ${Array.from({ length: 8 }, (_, i) => `<path d="M${gx + loaded} ${f(gy + i * px * 1.5)}L${gx + gw} ${f(gy + i * px * 1.5)}"/>`).join('')}</g>
        <path d="M${gx + loaded} ${gy}l1.6 2.2l-1.6 2.2l1.6 2.2l-1.6 2.2l1.6 2.2l-1.6 2.2l1.6 2.2l-1.6 2.2l1.6 2.2l-1.6 2.2l1.6 2.2" fill="none" stroke="${mag}" stroke-width=".35"/>
        <text x="${gx + loaded + (gw - loaded) / 2 + 0.6}" y="${gy + 9.4}" font-size="1.75" font-weight="700" fill="${C.text}" text-anchor="middle">by lazy</text>
        <text x="${gx + loaded + (gw - loaded) / 2 + 0.6}" y="${gy + 12}" font-size="1.6" fill="${C.muted}" text-anchor="middle">loading…</text>
        <rect x="${gx + loaded + 3}" y="${gy + 14.2}" width="${gw - loaded - 4.4}" height="1.8" rx=".9" fill="#2A2C31"/>
        <rect x="${gx + loaded + 3}" y="${gy + 14.2}" width="${f((gw - loaded - 4.4) * 0.4)}" height="1.8" rx=".9" fill="${mag}"/>
        <rect x="${gx + 1}" y="${gy + 1}" width="13" height="2.8" rx=".6" fill="#000" opacity=".35"/>
        ${T(gx + 1.8, gy + 3, [[C.gold, '★ 3', true], ['#fff', '  LVL 1']], 1.6)}
      </g>`;
    const monitor = `${shadow(sx + sw / 2, 65.3, 16, 0.8)}
      <rect x="${sx + sw / 2 - 2.4}" y="${sy + sh}" width="4.8" height="4.6" fill="#3A3D44"/>
      <rect x="${sx + sw / 2 - 9}" y="${sy + sh + 4.4}" width="18" height="1.4" rx=".6" fill="#4A4D55"/>
      <rect x="${sx + 0.7}" y="${sy + 0.6}" width="${sw}" height="${sh}" rx="1.8" fill="#000" opacity=".35"/>
      <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.8" fill="#3A3D44"/>
      <rect x="${sx}" y="${sy}" width="${sw}" height=".6" rx=".3" fill="#fff" opacity=".1"/>
      ${level}`;
    // Friday: the dev naps at the desk, the robot playtests
    const dev = `${K.dev(95, 59.6, { k: 1.22, hair: 'curly', hairColor: K.HAIR.pink, skin: 1, top: mag, topStyle: 'hoodie', headset: C.gold, mood: 'happy', deskW: 34, laptopColor: '#5B5F68' })}`;
    const zz = `${T(103.4, 39, [[C.text, 'z']], 2)}${T(105.6, 36.4, [[C.text, 'z']], 2.6)}${T(108.4, 33.2, [[C.text, 'Z', true]], 3.2)}`;
    const cal = `<rect x="117.4" y="31.4" width="8" height="8.6" rx="1" fill="#E8EAED"/><rect x="117.4" y="31.4" width="8" height="2.8" rx="1" fill="${red()}"/>
      <rect x="117.4" y="33" width="8" height="1.2" fill="${red()}"/>
      <text x="121.4" y="33.6" font-size="1.6" font-weight="800" fill="#fff" text-anchor="middle">FRI</text>
      <text x="121.4" y="38.8" font-size="3.6" font-weight="800" fill="#2A2C31" text-anchor="middle">13</text>`;
    const pad = `<g transform="translate(81 58.4) scale(.55)">${EMBLEM.gamepad(K.light(mag, 0.1))}</g>`;
    const bot = `${K.robot(120, 59.6, { k: 0.78, body: true, arms: 'wave', expression: 'focus', color: C.agent })}`;
    return `<circle cx="96" cy="47" r="18" fill="${mag}" opacity=".06"/>${monitor}${dev}${pad}${zz}${cal}${bot}`;
  },

  // A fintech where every balance is non-null and every ledger lives on the backend.
  'nullsafe-bank': ns => {
    const ind = '#4B5FD6';
    const cx = 66, cy = 47.6, R = 13.8;
    const bolts = Array.from({ length: 12 }, (_, i) => {
      const a = i * Math.PI / 6;
      return `<circle cx="${f(cx + Math.cos(a) * (R - 1.7))}" cy="${f(cy + Math.sin(a) * (R - 1.7))}" r=".75" fill="#6E747E"/><circle cx="${f(cx + Math.cos(a) * (R - 1.7) - .2)}" cy="${f(cy + Math.sin(a) * (R - 1.7) - .2)}" r=".3" fill="#D6DAE0"/>`;
    }).join('');
    const spokes = [0, 60, 120].map(d => `<rect x="${cx - 6.2}" y="${cy - .55}" width="12.4" height="1.1" rx=".55" fill="${C.goldDark}" transform="rotate(${d + 15} ${cx} ${cy})"/>`).join('') +
      [0, 60, 120, 180, 240, 300].map(d => { const a = (d + 15) * Math.PI / 180; return `<circle cx="${f(cx + Math.cos(a) * 6.2)}" cy="${f(cy + Math.sin(a) * 6.2)}" r="1.05" fill="${C.gold}"/>`; }).join('');
    const vault = `${shadow(cx, 65.2, 20, 1)}
      <rect x="${cx - R - 2.6}" y="${cy - R - 2.6}" width="${2 * R + 5.2}" height="${2 * R + 5.2}" rx="3" fill="#4A4D55"/>
      <rect x="${cx - R - 2.6}" y="${cy - R - 2.6}" width="${2 * R + 5.2}" height=".7" rx=".35" fill="#fff" opacity=".08"/>
      <rect x="${cx + R + 0.6}" y="${cy - 9}" width="2.6" height="4.4" rx=".8" fill="#5B5F68"/><rect x="${cx + R + 0.6}" y="${cy + 4.6}" width="2.6" height="4.4" rx=".8" fill="#5B5F68"/>
      <circle cx="${cx + 0.6}" cy="${cy + 0.8}" r="${R}" fill="#000" opacity=".35"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="#8D939E"/>
      <circle cx="${cx}" cy="${cy}" r="${R - 3.4}" fill="#B9BFC9"/>
      <path d="M${cx - R + 3.6} ${cy - 3}A${R - 3.4} ${R - 3.4} 0 0 1 ${cx + 3} ${cy - R + 3.6}" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".5"/>
      <circle cx="${cx}" cy="${cy}" r="${R - 3.4}" fill="none" stroke="#6E747E" stroke-width=".4"/>
      ${bolts}${spokes}
      <circle cx="${cx}" cy="${cy}" r="3" fill="${C.gold}"/><circle cx="${cx}" cy="${cy}" r="1.8" fill="${C.goldDark}"/>
      <circle cx="${cx - .6}" cy="${cy - .7}" r=".6" fill="#fff" opacity=".5"/>
      <rect x="${cx - 5.4}" y="${cy + 6.6}" width="10.8" height="3.4" rx=".8" fill="${C.bg}"/>
      <text x="${cx}" y="${cy + 9}" font-size="1.85" font-weight="800" fill="${C.backend}" text-anchor="middle" letter-spacing=".15">0 NPEs</text>`;
    const bar = (x, y) => `<path d="M${x} ${y}L${x + 1.2} ${y - 2.6}L${x + 7.2} ${y - 2.6}L${x + 8.4} ${y}Z" fill="${C.gold}"/><path d="M${x + 1.2} ${y - 2.6}L${x + 7.2} ${y - 2.6}L${x + 6.8} ${y - 1.9}L${x + 1.6} ${y - 1.9}Z" fill="#FFE39A"/><path d="M${x} ${y}L${x + 8.4} ${y}L${x + 8.4} ${y + .4}L${x} ${y + .4}Z" fill="${C.goldDark}"/>`;
    const treasure = `${shadow(27, 65.3, 15, 0.9)}${coinStack(17, 64.8, 7)}${coinStack(25.2, 64.8, 10)}${coinStack(33.4, 64.8, 5)}
      ${bar(36.4, 64.8)}${bar(30.6, 62.2)}
      ${[[21, 44, 1.2], [36, 50, .9], [15, 52, .7]].map(([x, y, r]) => `<path d="M${x} ${y - r * 2}Q${x} ${y} ${x + r * 2} ${y}Q${x} ${y} ${x} ${y + r * 2}Q${x} ${y} ${x - r * 2} ${y}Q${x} ${y} ${x} ${y - r * 2}Z" fill="${C.gold}" opacity=".85"/>`).join('')}`;
    // ledger screen with the balance, then the banker
    const ledger = `<rect x="86.6" y="31" width="25.4" height="17.6" rx="1.4" fill="#000" opacity=".3" transform="translate(.4 .6)"/>
      <rect x="86.6" y="31" width="25.4" height="17.6" rx="1.4" fill="${C.surface}" stroke="${ind}" stroke-width=".4"/>
      <rect x="86.6" y="31" width="25.4" height="3.6" rx="1.4" fill="${ind}"/><rect x="86.6" y="33" width="25.4" height="1.6" fill="${ind}"/>
      <text x="88.2" y="33.7" font-size="1.7" font-weight="800" fill="#fff" letter-spacing=".2">LEDGER</text>
      ${serverRack(105.6, 31.6, 0.17)}
      ${T(88.2, 38, [[C.text, 'balance'], [C.muted, ': '], [C.cls, 'Money']], 1.75)}
      ${T(88.2, 41.4, [[C.gold, '1 024', true], [C.muted, ' coins']], 2.1)}
      <rect x="88.2" y="43.4" width="15" height="3.4" rx="1.7" fill="${K.dark(C.backend, 0.55)}"/>
      ${check(89.9, 45.1, 1)}${T(91.4, 45.75, [[C.backend, '!= null', true]], 1.7)}`;
    const banker = `${shadow(116, 65.3, 6.5, 0.85)}${K.person(116.4, 65.2, { pose: 'stand', k: 1.38, hair: 'grey', skin: 4, glasses: true, top: '#2E3D9E', topStyle: 'blazer', pants: '#2A3150', mood: 'smile', flip: true })}`;
    return `<circle cx="${cx}" cy="${cy}" r="21" fill="${ind}" opacity=".06"/>${treasure}${vault}${ledger}${banker}`;
  },
};
function red() { return '#E8574A'; }

// ---------- startups (facts from Cards.kt) ----------
const NOW = 'NOW', END = 'AT GAME END';
const mvp = (cost, coins) => ({ name: 'MVP', cost, rewards: [
  { icon: 'coin', n: coins, label: NOW, text: `+${coins} coins from the bank` },
  { icon: 'star', n: 1, label: NOW, text: '1 star' }] });
const exit = (cost, pts) => ({ name: 'EXIT', cost, rewards: [{ icon: 'star', n: pts, label: 'ACQUIRED', text: `${pts} stars`, sub: 'the big payday' }] });

const STARTUPS = [
  {
    id: 'companion', name: 'Companion', genre: 'DATING APP', accent: ['#F0648F', '#C93D6C'], emblem: 'heart',
    produces: 'frontend', startCoins: 4, file: 'Match.kt',
    code: [[C.kw, 'companion object '], [C.text, '{ '], [C.kw, 'val '], [C.text, 'one = '], [C.fn, 'you'], [C.text, '() }']],
    comment: ['the one you always come back to', 'a dating app that lives and dies by its UI'],
    stages: [
      mvp(['frontend', 'frontend'], 3),
      { name: 'PRODUCT-MARKET FIT', short: 'PMF', cost: ['frontend', 'backend'], rewards: [
        { icon: 'star', n: 1, label: END, text: 'per your {team} Team card', sub: 'people are the product' }] },
      exit(['frontend', 'frontend', 'backend'], 5),
    ],
  },
  {
    id: 'suspend-fun-travel', name: 'suspend fun Travel', kw: 'suspend fun ', genre: 'TRAVEL BOOKING', accent: ['#22B5C9', '#1586A8'], emblem: 'plane',
    produces: 'backend', startCoins: 4, file: 'Booking.kt',
    code: [[C.kw, 'suspend fun '], [C.fn, 'book'], [C.text, '(trip: '], [C.cls, 'Trip'], [C.text, ') = api.'], [C.fn, 'await'], [C.text, '()']],
    comment: ['bookings that suspend politely while', 'the airline API thinks about it'],
    stages: [
      mvp(['backend', 'backend'], 3),
      { name: 'PRODUCT-MARKET FIT', short: 'PMF', cost: ['backend', 'frontend'], rewards: [
        { icon: 'coin', n: 1, label: NOW, text: '+1 coin from the bank' },
        { icon: 'coin', n: 2, label: 'EVERY SPRINT END', text: '+2 coins from the bank' }] },
      exit(['backend', 'backend', 'frontend'], 5),
    ],
  },
  {
    id: 'sealed-deals', name: 'Sealed Deals', genre: 'E-COMMERCE', accent: ['#E8574A', '#B83A30'], emblem: 'parcel',
    produces: 'backend', startCoins: 5, file: 'Order.kt',
    code: [[C.kw, 'sealed class '], [C.cls, 'Order'], [C.text, ' { '], [C.faint, '/* no else */'], [C.text, ' }']],
    comment: ['every state handled, no else branch,', 'no lost parcels'],
    stages: [
      mvp(['backend', 'backend'], 4),
      { name: 'PRODUCT-MARKET FIT', short: 'PMF', cost: ['backend', 'frontend'], rewards: [
        { icon: 'coin', n: 5, label: 'ALWAYS', text: 'selling a card gives {coin:5}' },
        { icon: 'star', n: 1, label: NOW, text: '1 star' }] },
      exit(['backend', 'backend', 'frontend'], 5),
    ],
  },
  {
    id: 'by-lazy-studio', name: 'by lazy Studio', kw: 'by lazy ', genre: 'GAME STUDIO', accent: ['#D04BE0', '#9A2BB8'], emblem: 'gamepad',
    produces: 'frontend', startCoins: 3, file: 'Level1.kt',
    code: [[C.kw, 'val '], [C.text, 'assets '], [C.kw, 'by '], [C.fn, 'lazy'], [C.text, ' { '], [C.fn, 'load'], [C.text, '('], [C.str, '"lvl1"'], [C.text, ') }']],
    comment: ['assets load by lazy, and so does', 'the team on Fridays'],
    stages: [
      mvp(['frontend', 'frontend'], 3),
      { name: 'PRODUCT-MARKET FIT', short: 'PMF', cost: ['frontend', 'backend'], rewards: [
        { icon: 'star', n: 3, label: NOW, text: '3 stars' },
        { icon: 'star', n: 1, label: END, text: 'per your {library} Library' }] },
      exit(['frontend', 'frontend', 'backend'], 4),
    ],
  },
  {
    id: 'nullsafe-bank', name: 'NullSafe Bank', genre: 'FINTECH', accent: ['#4B5FD6', '#2E3D9E'], emblem: 'vault',
    produces: 'backend', startCoins: 4, file: 'Ledger.kt',
    code: [[C.kw, 'val '], [C.text, 'balance: '], [C.cls, 'Money'], [C.text, ' = ledger.'], [C.fn, 'sum'], [C.text, '()']],
    comment: ['every balance is non-null, every', 'ledger lives on the backend'],
    stages: [
      mvp(['backend', 'backend'], 3),
      { name: 'PRODUCT-MARKET FIT', short: 'PMF', cost: ['backend', 'frontend'], rewards: [
        { icon: 'coin', n: 3, label: NOW, text: '+3 coins from the bank' },
        { icon: 'star', n: 1, label: END, text: 'per {coin:2} you have (not 3)' }] },
      exit(['backend', 'backend', 'frontend'], 5),
    ],
  },
];

const RES_NAME = { frontend: 'Frontend', backend: 'Backend' };
const ROMAN = ['I', 'II', 'III'];

// ---------- roadmap slot ----------
function costBoxAt(cost, x, y, w, h) {
  const s = 5.4, gap = 0.5;
  let icons = '';
  const rows = cost.length > 2 ? [cost.slice(0, 2), cost.slice(2)] : [cost];
  const top = rows.length === 1 ? y + (h - 3.4) / 2 - s / 2 : y + 1.4;
  rows.forEach((row, r) => {
    const rw = row.length * s + (row.length - 1) * gap;
    row.forEach((res, i) => { icons += iconAt(res, null, f(x + w / 2 - rw / 2 + i * (s + gap)), f(top + r * (s + 0.4)), s); });
  });
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.6" fill="${C.bg}"/>${icons}
    <text x="${x + w / 2}" y="${y + h - 1.3}" font-size="1.75" font-weight="700" fill="${C.muted}" text-anchor="middle" letter-spacing=".15">COST</text>`;
}

function rewardTile(r, x, y, w, h, big) {
  const stroke = r.icon === 'star' ? C.gold : C.goldDark;
  if (big) {
    const s = 10;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.3" fill="${C.surface2}" stroke="${stroke}" stroke-width=".35"/>
      ${iconAt(r.icon, r.n, x + 1.6, y + (h - s) / 2, s)}
      <text x="${x + 13.4}" y="${y + 5.6}" font-size="1.75" font-weight="700" fill="${C.muted}" letter-spacing=".2">${esc(r.label)}</text>
      ${rich(r.text, x + 13.4, y + 9.9, 2.6, { maxW: w - 14.6, minSize: 1.9 }).svg}
      ${r.sub ? `<text x="${x + 13.4}" y="${y + 13.3}" font-size="1.7" font-style="italic" fill="${C.faint}">${esc(r.sub)}</text>` : ''}`;
  }
  const s = 6.2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.2" fill="${C.surface2}" stroke="${stroke}" stroke-width=".3"/>
    ${iconAt(r.icon, r.n, x + 1.1, y + (h - s) / 2, s)}
    <text x="${x + 8.4}" y="${y + 3.3}" font-size="1.6" font-weight="700" fill="${C.muted}" letter-spacing=".18">${esc(r.label)}</text>
    ${rich(r.text, x + 8.4, y + 6.75, 2.2, { maxW: w - 9.4, minSize: 1.75 }).svg}`;
}

function slot(st, i, x, accent, ns) {
  const y = SLOT_Y, w = SLOT_W, a = accent[0];
  const barC = Kit.mix(C.surface2, a, [0.4, 0.62, 0.85][i]);
  const body = `<path d="M${x} ${H}L${x} ${y + 1.6}Q${x} ${y} ${x + 1.6} ${y}L${x + w - 1.6} ${y}Q${x + w} ${y} ${x + w} ${y + 1.6}L${x + w} ${H}Z" fill="${C.surface}"/>
    <path d="M${x} ${y + 6.6}L${x} ${y + 1.6}Q${x} ${y} ${x + 1.6} ${y}L${x + w - 1.6} ${y}Q${x + w} ${y} ${x + w} ${y + 1.6}L${x + w} ${y + 6.6}Z" fill="${barC}"/>
    ${i === 2 ? `<path d="M${x} ${y + 6.6}L${x} ${y + 1.6}Q${x} ${y} ${x + 1.6} ${y}L${x + w - 1.6} ${y}Q${x + w} ${y} ${x + w} ${y + 1.6}L${x + w} ${y + 6.6}Z" fill="url(#stripes)"/>` : ''}
    <circle cx="${x + 4.4}" cy="${y + 3.3}" r="2.45" fill="${C.bg}"/>
    <text x="${x + 4.4}" y="${y + 4.15}" font-size="${i === 2 ? 1.95 : 2.3}" font-weight="800" fill="#fff" text-anchor="middle">${ROMAN[i]}</text>
    <text x="${x + 8.4}" y="${y + 4.45}" font-size="${st.name.length > 10 ? 2.55 : 2.9}" font-weight="800" fill="#fff" letter-spacing=".1">${esc(st.name)}</text>
    ${i === 1 ? `<rect x="${x + w - 12.6}" y="${y + 1.5}" width="11" height="3.6" rx="1.8" fill="${C.bg}" opacity=".85"/>
      <text x="${x + w - 7.1}" y="${y + 4}" font-size="1.7" font-weight="800" fill="${C.gold}" text-anchor="middle" letter-spacing=".2">ABILITY</text>`
      : `<text x="${x + w - 2}" y="${y + 4.2}" font-size="1.7" font-weight="700" fill="#fff" fill-opacity=".7" text-anchor="end" letter-spacing=".2">STAGE ${i + 1}/3</text>`}`;
  const by = y + 8.2, bh = 18.4;
  const cost = costBoxAt(st.cost, x + 1.8, by, 14.4, bh);
  const arrow = `<path d="M${x + 17.2} ${by + bh / 2}L${x + 19.6} ${by + bh / 2}M${x + 18.7} ${by + bh / 2 - 1}L${x + 19.7} ${by + bh / 2}L${x + 18.7} ${by + bh / 2 + 1}" fill="none" stroke="${C.muted}" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round"/>`;
  const rx = x + 20.8, rw = w - 20.8 - 1.8;
  let rewards = '';
  if (st.rewards.length === 1) rewards = rewardTile(st.rewards[0], rx, by, rw, bh, true);
  else {
    const rh = (bh - 1.2) / 2;
    st.rewards.forEach((r, j) => { rewards += rewardTile(r, rx, f(by + j * (rh + 1.2)), rw, rh, false); });
  }
  // tuck guide: where the card slides under the board
  const tuck = `<path d="M${x + 6} ${y + 29.6}L${x + w - 6} ${y + 29.6}" stroke="${C.border}" stroke-width=".3" stroke-dasharray="1 .8"/>
    <rect x="${x + w / 2 - 17}" y="${y + 28.1}" width="34" height="3" fill="${C.surface}"/>
    <path d="M${x + w / 2 - 15.4} ${y + 28.6}l0 1.6m-.8 -.8l.8 .8l.8 -.8" fill="none" stroke="${C.faint}" stroke-width=".3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + w / 2 + 1}" y="${y + 30.2}" font-size="1.6" fill="${C.faint}" text-anchor="middle" letter-spacing=".1">tuck a card here, face down</text>`;
  return body + cost + arrow + rewards + tuck;
}

// ---------- side column ----------
function producesBlock(s, x, y, w) {
  const h = 11.6;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.3" fill="${C.surface}" stroke="${TYPES.team.color}" stroke-width=".35"/>
    <use href="#i-team-line" x="${x + 1.8}" y="${y + 1.6}" width="3.4" height="3.4" color="#4FD1B0"/>
    <text x="${x + 2}" y="${y + 8.4}" font-size="2.15" font-weight="700" fill="#4FD1B0" letter-spacing=".2">PRODUCES</text>
    <rect x="${x + 16.4}" y="${y + 1.5}" width="8.6" height="8.6" rx="1.6" fill="${C.bg}"/>
    ${iconAt(s.produces, null, x + 17.2, y + 2.3, 7)}
    <text x="${x + 27.4}" y="${y + 5.4}" font-size="2.9" font-weight="800" fill="${C[s.produces]}">${RES_NAME[s.produces]}</text>
    <text x="${x + 27.4}" y="${y + 8.6}" font-size="1.75" fill="${C.muted}">for the whole game</text>`;
}

function startTile(s, x, y, w) {
  const h = 10;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.3" fill="${C.surface}" stroke="${C.goldDark}" stroke-width=".35"/>
    ${iconAt('coin', s.startCoins, x + 1.6, y + 1.4, 7.2)}
    <text x="${x + 10.8}" y="${y + 3.9}" font-size="1.9" font-weight="700" fill="${C.muted}" letter-spacing=".2">AT START</text>
    ${rich(`take {coin:${s.startCoins}} from the bank`, x + 10.8, y + 7.5, 2.6, { maxW: w - 12 }).svg}`;
}

function flavor(s, x, y, w, h, accent) {
  const code = s.code.map(([c, t]) => `<tspan fill="${c}">${esc(t)}</tspan>`).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.2" fill="${C.code}"/>
    <rect x="${x}" y="${y}" width=".6" height="${h}" fill="${accent}"/>
    <text x="${x + 2}" y="${y + 4}" font-size="1.95" xml:space="preserve">${code}</text>
    ${s.comment.map((l, i) => `<text x="${x + 2}" y="${y + 7.5 + i * 3}" font-size="1.85" font-style="italic" fill="${C.faint}">// ${esc(l)}</text>`).join('')}`;
}

// ---------- board ----------
function renderBoard(s, { guides = true, ns = 'b' } = {}) {
  const id = `${ns}-${s.id}`;
  const [a, ad] = s.accent;
  // window
  const wx = 6, wy = 26, ww = 121, wh = 40.6;
  const lines = Math.floor((wh - 4) / 3.5);
  const art = ART_FN[s.id] ? ART_FN[s.id](id) : '';
  const fileW = 2.8 + s.file.length * 1.14;
  // header name: optional Kotlin keyword prefix rendered lighter
  const name = s.kw
    ? `<tspan fill="#fff" fill-opacity=".72" font-weight="700">${esc(s.kw)}</tspan><tspan>${esc(s.name.slice(s.kw.length))}</tspan>`
    : esc(s.name);
  const nameSize = Math.min(8.2, 96 / (s.name.length * MONO));
  const arrows = [0, 1].map(i => {
    const cx = SLOT_X[i] + SLOT_W + 0.75, cy = SLOT_Y + 17.4;
    return `<circle cx="${cx}" cy="${cy + .4}" r="2.7" fill="#000" opacity=".35"/>
      <circle cx="${cx}" cy="${cy}" r="2.6" fill="${a}" stroke="${C.bg}" stroke-width=".6"/>
      <path d="M${cx - .7} ${cy - 1.2}L${cx + .6} ${cy}L${cx - .7} ${cy + 1.2}" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="JetBrains Mono, monospace" style="font-variant-ligatures:none" data-board="${s.id}">
  <defs><linearGradient id="hdr-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${ad}"/></linearGradient>
    <clipPath id="win-${id}"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="1.4"/></clipPath></defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>

  <!-- header -->
  <rect width="${W}" height="23" fill="url(#hdr-${id})"/>
  <rect width="${W}" height="23" fill="url(#stripes)"/>
  <rect y="23" width="${W}" height=".6" fill="${C.bg}" opacity=".35"/>
  <rect x="6" y="5.4" width="15.6" height="15.6" rx="2" fill="${C.bg}"/>
  <g transform="translate(13.8 13.2)">${EMBLEM[s.emblem](a)}</g>
  <use href="#i-business" x="25" y="6.9" width="3.2" height="3.2"/>
  <text x="28.8" y="9.4" font-size="2.3" font-weight="700" fill="#fff" fill-opacity=".85" letter-spacing=".35">STARTUP · ${esc(s.genre)}</text>
  <text x="24.8" y="18.6" font-size="${nameSize.toFixed(2)}" font-weight="800" fill="#fff">${name}</text>
  <g font-size="1.9" fill="#fff" text-anchor="end">
    <text x="195" y="10.4" font-weight="800" letter-spacing=".3" fill-opacity=".95">ROADMAP</text>
    <text x="195" y="14" fill-opacity=".85">Tuck any card under the next stage</text>
    <text x="195" y="17.2" fill-opacity=".85">and pay its cost. Stages go in order:</text>
    <text x="195" y="20.4" fill-opacity=".85" font-weight="700">I MVP → II Product-Market Fit → III Exit</text>
  </g>

  <!-- IDE window with art -->
  <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="1.4" fill="${C.surface}"/>
  <g clip-path="url(#win-${id})">
    <rect x="${wx}" y="${wy + 4}" width="${ww}" height="${wh - 4}" fill="url(#dots)"/>
    <rect x="${wx}" y="${wy}" width="${ww}" height="4" fill="${C.surface2}"/>
    <circle cx="${wx + 2.5}" cy="${wy + 2}" r=".6" fill="#F26D6D"/><circle cx="${wx + 4.3}" cy="${wy + 2}" r=".6" fill="${C.gold}"/><circle cx="${wx + 6.1}" cy="${wy + 2}" r=".6" fill="#5FB865"/>
    <rect x="${wx + 8.5}" y="${wy}" width="${fileW}" height="4" fill="${C.surface}"/>
    <rect x="${wx + 8.5}" y="${wy + 3.6}" width="${fileW}" height=".4" fill="${a}"/>
    <text x="${wx + 9.9}" y="${wy + 2.8}" font-size="1.9" fill="${C.text}">${esc(s.file)}</text>
    <rect x="${wx}" y="${wy + 4}" width="4" height="${wh - 4}" fill="${C.bg}" opacity=".45"/>
    <g font-size="1.5" fill="#6F737A" text-anchor="end">${Array.from({ length: lines }, (_, i) => `<text x="${wx + 3.3}" y="${wy + 3.5 + (i + 1) * 3.5}">${i + 1}</text>`).join('')}</g>
    ${art}
  </g>
  <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="1.4" fill="none" stroke="${C.border}" stroke-width=".3"/>

  <!-- side column -->
  ${producesBlock(s, 130, 26, 65)}
  ${startTile(s, 130, 39.6, 65)}
  ${flavor(s, 130, 51.6, 65, 15, a)}

  <!-- roadmap: 3 slots, each one card wide -->
  ${s.stages.map((st, i) => slot(st, i, SLOT_X[i], s.accent, id)).join('')}
  ${arrows}

  ${guides ? `<g class="guide" fill="none" stroke-width=".3">
    <rect x="3" y="3" width="195" height="100" rx="3" stroke="#FF4D4D" stroke-dasharray="1.2 .9"/>
    <rect x="6" y="6" width="189" height="94" rx="1" stroke="#33D1FF" stroke-dasharray=".7 .9" opacity=".7"/>
  </g>` : ''}
</svg>`;
}

window.BOARD_STARTUPS = STARTUPS;
window.renderBoard = renderBoard;
})();
