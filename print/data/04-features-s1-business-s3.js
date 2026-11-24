// Sprint I features (Login Screen, Dark Mode, Profile Screen, Health-check Endpoint, Settings Screen)
// and Sprint III business cards (IPO, Acquihire, Unicorn Valuation, Open Source Maintainer).
// Cards with one effect block get a ~30 mm window, so their art is drawn ~27 mm tall (artH); cards with no
// effect blocks get the tall window and art drawn ~38 mm tall.
(() => {
const RED = '#F26D6D';
const PINK = '#E879B5';
const LIGHT = '#EEF0F4';
let uid = 0;   // unique clip-path ids (a card can be on the page twice)

// Phone with depth: frame colour, darker right edge, screen inset. (x, y) = top-left.
const handset = (x, y, w, h, frame, screen, inner = '') => `
  <rect x="${x + 0.5}" y="${y + 0.6}" width="${w}" height="${h}" rx="2" fill="#000" opacity=".25"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${Kit.dark(frame, 0.22)}"/>
  <rect x="${x}" y="${y}" width="${w - 0.7}" height="${h}" rx="2" fill="${frame}"/>
  <path d="M${x + 1.6} ${y + 0.55}H${x + w - 2.4}" stroke="${Kit.light(frame, 0.35)}" stroke-width=".35" stroke-linecap="round"/>
  <rect x="${x + 1.1}" y="${y + 2.2}" width="${w - 2.5}" height="${h - 5}" rx=".7" fill="${screen}"/>
  <rect x="${x + w / 2 - 2}" y="${y + 1}" width="3.4" height=".55" rx=".27" fill="${Kit.dark(frame, 0.35)}"/>
  <circle cx="${x + (w - 0.7) / 2}" cy="${y + h - 1.4}" r=".75" fill="${Kit.dark(frame, 0.3)}"/>${inner}`;

// Gear with n teeth and a drop shadow, centred at (cx, cy).
const gear = (cx, cy, r, fill, n = 8) => {
  const body = c => Array.from({ length: n }, (_, i) =>
    `<rect x="${cx - r * 0.24}" y="${cy - r - r * 0.32}" width="${r * 0.48}" height="${r * 0.6}" rx="${r * 0.1}" fill="${c}" transform="rotate(${(360 / n) * i} ${cx} ${cy})"/>`).join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`;
  return `<g transform="translate(.5 .6)" opacity=".3">${body('#000')}</g>${body(Kit.dark(fill, 0.25))}
    <g transform="translate(-.25 -.3)">${body(fill)}</g>
    <circle cx="${cx - 0.25}" cy="${cy - 0.3}" r="${r * 0.72}" fill="none" stroke="${Kit.light(fill, 0.3)}" stroke-width=".35" opacity=".7"/>
    <circle cx="${cx - 0.25}" cy="${cy - 0.3}" r="${r * 0.36}" fill="${C.surface}"/>`;
};

// Toggle switch, left edge x, top y. on: true | false | null (undecided).
const toggle = (x, y, on, w = 6.4, h = 3.4) => {
  const kx = on === true ? x + w - h / 2 : on === false ? x + h / 2 : x + w / 2;
  const track = on === true ? C.backend : on === false ? C.surface2 : C.gold;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${track}"/>
    <circle cx="${kx + 0.15}" cy="${y + h / 2 + 0.2}" r="${h / 2 - 0.4}" fill="#000" opacity=".25"/>
    <circle cx="${kx}" cy="${y + h / 2}" r="${h / 2 - 0.45}" fill="${on === false ? C.muted : '#fff'}"/>
    ${on == null ? `<text x="${kx}" y="${y + h / 2 + 0.6}" font-size="1.7" font-weight="800" fill="${C.goldDark}" text-anchor="middle">?</text>` : ''}`;
};

// Briefcase (a Business card / a deal), bottom-centre (x, y).
const briefcase = (x, y, w = 5) => {
  const h = w * 0.7, c = TYPES.business.color;
  return `<rect x="${x - w * 0.22}" y="${y - h - w * 0.2}" width="${w * 0.44}" height="${w * 0.3}" rx="${w * 0.1}" fill="none" stroke="${Kit.dark(c, 0.3)}" stroke-width="${w * 0.09}"/>
    <rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="${w * 0.14}" fill="${Kit.dark(c, 0.2)}"/>
    <rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h * 0.55}" rx="${w * 0.14}" fill="${c}"/>
    <rect x="${x - w * 0.1}" y="${y - h * 0.55}" width="${w * 0.2}" height="${h * 0.22}" rx="${w * 0.04}" fill="${C.gold}"/>`;
};

// 4-point sparkle centred at (x, y).
const sparkle = (x, y, r, c = C.gold) =>
  `<path d="M${x} ${y - r}Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y}Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r}Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y}Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="${c}"/>`;

// The unicorn: side view facing right, prancing. Local frame ~26 x 24.5 mm, (x, y) = left end of the ground line.
const unicorn = (x, y, k = 1) => {
  const body = '#F4F0FB', shade = '#D6CCEB', far = '#C6BBDE', ink = '#2A2120';
  const leg = (d, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const hoof = (cx, cy, rot = 0) => `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${cx - 0.95}" y="${cy - 0.7}" width="1.9" height="1.3" rx=".4" fill="${C.gold}"/><rect x="${cx - 0.95}" y="${cy + 0.15}" width="1.9" height=".45" rx=".2" fill="${C.goldDark}"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${k})">
    <ellipse cx="11.5" cy="0" rx="9.5" ry=".75" fill="#000" opacity=".3"/>
    <!-- tail -->
    <path d="M4.6 -12.1C2.4 -13 0.4 -12.2 -0.1 -10.2C1 -11 2.6 -11.2 4.2 -10.8Z" fill="${C.frontend}"/>
    <path d="M4.4 -11.6C1.6 -12.2 -0.3 -10.2 0.1 -7.6C0.3 -6.2 -0.2 -5 -0.9 -4.1C1.5 -4.1 2.5 -5.8 2.5 -7.4C2.5 -9 3.1 -10.2 4.4 -10.4Z" fill="${C.agent}"/>
    <path d="M4.3 -10.8C2.6 -10.6 2 -9.2 2.2 -7.8C2.4 -6.6 2.2 -5.4 1.5 -4.6C3.2 -5 3.7 -6.8 3.5 -8C3.4 -9.2 3.7 -10 4.5 -10.2Z" fill="${PINK}"/>
    <!-- far legs -->
    ${leg('M8.3 -7.4L8.6 -1.2', far)}${hoof(8.6, -0.75)}
    ${leg('M16 -7.6L17 -1.2', far)}${hoof(17, -0.75)}
    <!-- body and neck -->
    <path d="M13.4 -12C14.4 -14.6 16.2 -17.3 18.4 -18.7L21.3 -16.9C19.7 -15.3 18.4 -13.1 17.3 -9.6L15 -10Z" fill="${body}"/>
    <path d="M5 -12.3C8 -13.1 12 -12.9 15 -12.5C17.1 -12.2 18.2 -10.5 17.8 -8.5C17.4 -6.6 15.6 -6 14 -6.2C11 -5.7 8 -5.7 6 -6.3C3.6 -6.9 3 -9 3.4 -10.4C3.8 -11.6 4.4 -12.1 5 -12.3Z" fill="${body}"/>
    <path d="M6.1 -6.3C8.4 -5.8 11 -5.8 14 -6.25C15.5 -6.5 16.9 -7 17.6 -8.3C15.9 -7.6 14 -7.5 11 -7.5C8.6 -7.5 7 -7.1 6.1 -6.3Z" fill="${shade}"/>
    <path d="M18.4 -15.2C17.6 -13.8 17.2 -12.2 17.1 -10.6C17.6 -11.4 18.3 -13.4 19.6 -14.9Z" fill="${shade}" opacity=".8"/>
    <path d="M6.2 -12.4Q10 -12.95 13.6 -12.6" fill="none" stroke="#fff" stroke-width=".45" stroke-linecap="round" opacity=".9"/>
    <!-- near legs: hind leg planted, foreleg raised -->
    ${leg('M5.8 -8Q5.1 -4.6 5.7 -1.2', body)}${hoof(5.7, -0.75)}
    <path d="M4.2 -9.6C4.2 -8.2 5 -7 6.4 -6.6" fill="none" stroke="${shade}" stroke-width=".4" stroke-linecap="round"/>
    ${leg('M14.6 -7.4L16.5 -4.7L15.5 -2.6', body)}${hoof(15.6, -2.2, -35)}
    <!-- mane -->
    <path d="M15.6 -14.4C13.8 -14.2 12.6 -13.2 11.3 -12.5C12.8 -12 14.1 -12.4 15.1 -13.1Z" fill="${C.frontend}"/>
    <path d="M19.3 -17.8C15.6 -17.8 13.8 -15.6 13.6 -13.8C13.5 -12.8 12.8 -12 11.8 -11.8C13.7 -11.2 15.1 -12.2 15.5 -13.6C15.9 -14.8 17 -16.4 19.4 -16.9Z" fill="${C.agent}"/>
    <path d="M19.4 -19.7C17 -20.5 15.1 -18.9 14.7 -16.6C14.5 -15.6 13.9 -15 13 -14.8C14.7 -14.1 16.2 -15.1 16.8 -16.4C17.4 -17.6 18.2 -18.2 19.2 -18.2Z" fill="${PINK}"/>
    <path d="M18.1 -19.2Q16.3 -18.8 15.6 -16.9" fill="none" stroke="#fff" stroke-width=".3" stroke-linecap="round" opacity=".55"/>
    <!-- ear, head, muzzle -->
    <path d="M19.1 -19.7L18.6 -22.1L20.5 -20.2Z" fill="${body}"/><path d="M19.2 -20L19 -21.3L19.9 -20.3Z" fill="${PINK}" opacity=".7"/>
    <path d="M18 -18.4C18.4 -20.2 20.4 -20.6 21.6 -19.6C22.8 -18.6 24.2 -17 24.6 -15.9C24.9 -14.9 24.1 -14.2 23.1 -14.4C22 -14.6 20.8 -15.4 19.8 -16.2C19 -16.8 18 -17.4 18 -18.4Z" fill="${body}"/>
    <path d="M22.4 -15C23.1 -14.5 24.1 -14.3 24.5 -15C24.7 -15.5 24.6 -16 24.4 -16.3C23.8 -15.6 23.1 -15.2 22.4 -15Z" fill="#F3C6DA"/>
    <ellipse cx="24" cy="-15.85" rx=".22" ry=".32" fill="#B56A8A" transform="rotate(-30 24 -15.85)"/>
    <path d="M22.5 -14.95Q23 -14.55 23.5 -14.7" fill="none" stroke="#B56A8A" stroke-width=".22" stroke-linecap="round"/>
    <ellipse cx="21.6" cy="-16.2" rx=".6" ry=".35" fill="${PINK}" opacity=".35"/>
    <ellipse cx="21.25" cy="-17.75" rx=".42" ry=".55" fill="${ink}"/><circle cx="21.38" cy="-17.95" r=".15" fill="#fff"/>
    <path d="M20.75 -18.25L20.35 -18.55M20.9 -18.4L20.65 -18.8" stroke="${ink}" stroke-width=".18" stroke-linecap="round"/>
    <!-- horn -->
    <path d="M20.3 -19.95L22.2 -19.35L24.9 -24.4Z" fill="${C.gold}"/>
    <path d="M22.2 -19.35L24.9 -24.4L21.3 -19.65Z" fill="${C.goldDark}" opacity=".35"/>
    <path d="M21.35 -20.8L22.65 -20.4M22.25 -21.7L23.2 -21.4M23.15 -22.6L23.75 -22.4M24.05 -23.5L24.3 -23.4" stroke="${C.goldDark}" stroke-width=".26" stroke-linecap="round"/>
    <path d="M19.5 -19.9C20.4 -20.9 21.7 -20.7 22.1 -19.6C21.4 -20 20.6 -19.8 20.1 -19Z" fill="${C.agent}"/>
  </g>`;
};

Object.assign(ART, {
  // artH 27: phone, request/response, padlock.
  'login-screen': () => `
    ${handset(13, 27, 14.4, 25.4, C.frontend, C.bg, `
      <circle cx="19.85" cy="33" r="2.2" fill="${C.frontend}" opacity=".25"/>
      <circle cx="19.85" cy="32.4" r=".85" fill="${C.frontend}"/><path d="M18.5 34.3Q18.5 33.3 19.85 33.3Q21.2 33.3 21.2 34.3Z" fill="${C.frontend}"/>
      <rect x="15.4" y="36.6" width="8.9" height="2.6" rx=".6" fill="${C.surface}" stroke="${C.frontend}" stroke-width=".3"/>
      <rect x="16.3" y="37.65" width="4.6" height=".55" rx=".27" fill="${C.muted}"/>
      <rect x="15.4" y="40.1" width="8.9" height="2.6" rx=".6" fill="${C.surface}" stroke="${C.border}" stroke-width=".3"/>
      <g fill="${C.text}">${[0, 1, 2, 3, 4].map(i => `<circle cx="${16.7 + i * 1.25}" cy="41.4" r=".4"/>`).join('')}</g>
      <rect x="15.4" y="43.7" width="8.9" height="2.7" rx="1.35" fill="${C.frontend}"/>
      <rect x="17.8" y="44.8" width="4.1" height=".55" rx=".27" fill="${C.bg}" opacity=".7"/>`)}

    <text x="35.4" y="33.6" font-size="1.7" text-anchor="middle"><tspan fill="${C.kw}" font-weight="700">POST</tspan><tspan fill="${C.text}"> /login</tspan></text>
    <path d="M29.4 35.7H40.6" stroke="${C.kw}" stroke-width=".65" stroke-linecap="round"/>
    <polygon points="42,35.7 39.9,34.4 39.9,37" fill="${C.kw}"/>
    <path d="M30.2 41H41.6" stroke="${C.backend}" stroke-width=".65" stroke-linecap="round"/>
    <polygon points="28.8,41 30.9,39.7 30.9,42.3" fill="${C.backend}"/>
    <rect x="28.8" y="43.4" width="13.2" height="4" rx="1" fill="${C.bg}" stroke="${C.backend}" stroke-width=".3"/>
    <text x="35.4" y="46.05" font-size="1.65" text-anchor="middle"><tspan fill="${C.cls}">Bearer</tspan><tspan fill="${C.str}"> eyJ…</tspan></text>

    <ellipse cx="52.6" cy="52" rx="7.6" ry=".7" fill="#000" opacity=".3"/>
    <path d="M48.3 39V34.6a4.3 4.3 0 0 1 8.6 0V39" fill="none" stroke="${C.goldDark}" stroke-width="2"/>
    <path d="M48.3 39V34.6a4.3 4.3 0 0 1 8.6 0" fill="none" stroke="${Kit.light(C.goldDark, 0.25)}" stroke-width=".45" transform="translate(-.45 0)"/>
    <rect x="45" y="38.4" width="15.2" height="13.4" rx="1.9" fill="${C.goldDark}"/>
    <rect x="45" y="38.4" width="14.1" height="13.4" rx="1.9" fill="${C.gold}"/>
    <rect x="46.2" y="39.3" width="11.6" height=".5" rx=".25" fill="#fff" opacity=".45"/>
    <circle cx="52.1" cy="43.9" r="1.6" fill="${C.bg}"/>
    <path d="M51.35 44.6H52.85L53.1 48.2H51.1Z" fill="${C.bg}"/>
    ${sparkle(60.4, 33.4, 1.1, C.gold)}${sparkle(44.6, 31, .6, C.text)}`,

  // artH 27: the same screen in light and dark, with a theme switch between them.
  'dark-mode': () => {
    const ui = (x, y, fg, line, card) => `
      <rect x="${x}" y="${y}" width="10.9" height="2.6" rx=".5" fill="${fg}"/>
      <circle cx="${x + 1.5}" cy="${y + 5.6}" r="1.4" fill="${fg}" opacity=".85"/>
      <rect x="${x + 3.6}" y="${y + 4.6}" width="6.4" height=".8" rx=".4" fill="${line}"/>
      <rect x="${x + 3.6}" y="${y + 6}" width="4.2" height=".7" rx=".35" fill="${line}" opacity=".6"/>
      <rect x="${x}" y="${y + 8.6}" width="10.9" height="4.4" rx=".7" fill="${card}"/>
      <rect x="${x + 1}" y="${y + 9.6}" width="6.2" height=".8" rx=".4" fill="${line}"/>
      <rect x="${x + 1}" y="${y + 11.1}" width="8.4" height=".7" rx=".35" fill="${line}" opacity=".6"/>
      <rect x="${x}" y="${y + 14.2}" width="10.9" height="2.6" rx="1.3" fill="${fg}"/>`;
    return `
    ${handset(13, 27, 14.4, 25.4, '#D7DBE3', '#FFFFFF', ui(14.65, 30.4, C.frontend, '#AEB3BD', '#E8EBF0'))}
    ${handset(46.6, 27, 14.4, 25.4, '#5A4A78', C.code, ui(48.25, 30.4, C.agent, '#5A5E66', C.surface))}

    <g stroke="${C.gold}" stroke-width=".55" stroke-linecap="round">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="31.6" y1="31.4" x2="31.6" y2="30.6" transform="rotate(${a} 31.6 33.6)"/>`).join('')}</g>
    <circle cx="31.6" cy="33.6" r="1.6" fill="${C.gold}"/>
    <path d="M42.2 31.6a2.2 2.2 0 1 0 1.2 3.9a1.75 1.75 0 0 1 -1.2 -3.9Z" fill="${LIGHT}"/>
    ${sparkle(43.9, 31.4, .55, LIGHT)}

    <rect x="29.6" y="38.5" width="14.6" height="6" rx="3" fill="#000" opacity=".3" transform="translate(.3 .4)"/>
    <rect x="29.6" y="38.5" width="14.6" height="6" rx="3" fill="url(#bolt)"/>
    <circle cx="41.2" cy="41.5" r="2.4" fill="#fff"/>
    <path d="M41.6 40a1.6 1.6 0 1 0 0.9 2.85a1.3 1.3 0 0 1 -0.9 -2.85Z" fill="${C.agent}"/>
    <text x="36.9" y="49.6" font-size="1.65" text-anchor="middle"><tspan fill="${C.fn}">darkColorScheme</tspan><tspan fill="${C.text}">()</tspan></text>`;
  },

  // No effect blocks, artH 38: profile on a phone + the TextField states it needs.
  'profile-screen': () => {
    const id = `pf-av-${++uid}`;
    const field = (y, color, label, extra, dash = '') => `
      <rect x="37.2" y="${y}" width="23.4" height="5.6" rx="1.2" fill="${C.bg}" stroke="${color}" stroke-width=".45" ${dash}/>
      <text x="38.8" y="${y + 3.55}" font-size="1.75" fill="${color === C.border ? C.faint : color === C.frontend || color === C.backend ? C.text : color}">${label}</text>${extra}`;
    return `
    ${handset(13.6, 21, 19.6, 37.4, C.frontend, C.bg, `
      <rect x="14.7" y="23.2" width="17.1" height="6.6" rx=".7" fill="url(#bolt)" opacity=".75"/>
      <clipPath id="${id}"><circle cx="23.25" cy="30.2" r="4.4"/></clipPath>
      <circle cx="23.25" cy="30.2" r="4.9" fill="${C.bg}"/>
      <circle cx="23.25" cy="30.2" r="4.4" fill="${C.surface2}"/>
      <g clip-path="url(#${id})">${Kit.person(23.25, 35.4, { k: 0.54, skin: 3, hair: 'curly', hairColor: Kit.HAIR.black, top: C.gold, topStyle: 'tee', mood: 'happy' })}</g>
      <rect x="18.6" y="36.4" width="9.3" height="1.6" rx=".6" fill="${C.text}"/>
      <rect x="20" y="38.9" width="6.5" height=".9" rx=".45" fill="${C.frontend}" opacity=".8"/>
      <rect x="16.6" y="41.6" width="13.3" height=".9" rx=".45" fill="${C.muted}" opacity=".7"/>
      <rect x="16.6" y="43.3" width="13.3" height=".9" rx=".45" fill="${C.muted}" opacity=".7"/>
      <rect x="16.6" y="45" width="8.4" height=".9" rx=".45" fill="${C.muted}" opacity=".7"/>
      <rect x="18.4" y="48.6" width="9.7" height="3.4" rx="1.7" fill="${C.frontend}"/>
      <text x="23.25" y="50.9" font-size="1.65" font-weight="800" fill="${C.bg}" text-anchor="middle">Edit</text>`)}

    <text x="37.2" y="24.4" font-size="1.7" fill="${C.muted}" font-weight="700" letter-spacing=".1">TextField</text>
    ${field(26, C.frontend, 'focused', `<rect x="47.3" y="27.35" width=".3" height="2.9" fill="${C.frontend}"/>`)}
    ${field(34, RED, 'error', `<circle cx="58.1" cy="36.8" r="1.4" fill="${RED}"/><text x="58.1" y="37.45" font-size="1.8" font-weight="800" fill="${C.bg}" text-anchor="middle">!</text>`)}
    <text x="38.8" y="41.4" font-size="1.6" fill="${RED}" opacity=".85">bio too long</text>
    ${field(43.6, C.border, 'disabled', `<path d="M57.2 45.7v-.5a.9 .9 0 0 1 1.8 0v.5" fill="none" stroke="${C.faint}" stroke-width=".35"/><rect x="56.9" y="45.6" width="2.4" height="1.9" rx=".4" fill="${C.faint}"/>`, 'stroke-dasharray=".9 .55"')}
    ${field(51.6, C.backend, 'filled', `<path d="M56.9 54.3l1 1l2 -2.2" fill="none" stroke="${C.backend}" stroke-width=".6" stroke-linecap="round" stroke-linejoin="round"/>`)}`;
  },

  // artH 27: server on a heart-rate monitor.
  'health-check': () => {
    const grid = Array.from({ length: 5 }, (_, i) => `<path d="M${38.4 + i * 4.4} 31V46.4" stroke="${C.backend}" stroke-width=".12" opacity=".25"/>`).join('') +
      Array.from({ length: 3 }, (_, i) => `<path d="M37.6 ${34.6 + i * 4.4}H59.2" stroke="${C.backend}" stroke-width=".12" opacity=".25"/>`).join('');
    return `
    <ellipse cx="23.1" cy="52.1" rx="9.4" ry=".65" fill="#000" opacity=".3"/>
    ${serverRack(13.4, 31, 1.14)}
    <path d="M32.6 47.6Q35.4 50.4 39.4 50.4H44.6" fill="none" stroke="${C.surface2}" stroke-width=".9" stroke-linecap="round"/>

    <rect x="36.9" y="28.6" width="24" height="20.2" rx="1.8" fill="#000" opacity=".25" transform="translate(.5 .6)"/>
    <rect x="36.4" y="28.4" width="24" height="20.2" rx="1.8" fill="${C.border}"/>
    <rect x="36.4" y="28.4" width="23.2" height="20.2" rx="1.8" fill="${C.surface2}"/>
    <rect x="37.6" y="29.6" width="21.6" height="17" rx=".9" fill="${C.code}"/>
    ${grid}
    <text x="38.6" y="32.4" font-size="1.65"><tspan fill="${C.kw}" font-weight="700">GET</tspan><tspan fill="${C.text}"> /health</tspan></text>
    <path d="M55.9 31.3c-.4 -.8 -2 -.6 -2 .6c0 1.1 2 2.2 2 2.2c0 0 2 -1.1 2 -2.2c0 -1.2 -1.6 -1.4 -2 -.6Z" fill="${RED}"/>
    <path d="M38.4 39.4H42.2L43.6 36.8L45.5 43L47.6 34.4L49.6 41.8L50.9 39.4H56.6" fill="none" stroke="${C.backend}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity=".25"/>
    <path d="M38.4 39.4H42.2L43.6 36.8L45.5 43L47.6 34.4L49.6 41.8L50.9 39.4H56.6" fill="none" stroke="${C.backend}" stroke-width=".55" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="57.4" cy="39.4" r=".85" fill="${C.backend}"/>
    <text x="58.4" y="45.4" font-size="1.9" font-weight="800" fill="${C.backend}" text-anchor="end">200 OK</text>
    <path d="M46.8 48.6H50.2L50.9 51.3H46.1Z" fill="${C.border}"/>
    <rect x="43.6" y="51" width="10.2" height="1.1" rx=".55" fill="${C.surface2}"/>`;
  },

  // No effect blocks, artH 38: a settings list, one toggle nobody decided on, and gears.
  'settings-screen': () => {
    const rows = [[9.4, true], [7.2, false], [10.4, null], [6.4, false], [8.6, true], [7.6, true]];
    const list = rows.map(([w, on], i) => {
      const y = 28.4 + i * 4.9;
      const ic = on === true ? C.frontend : on == null ? C.gold : C.faint;
      return `<rect x="15.6" y="${y + 0.7}" width="2.2" height="2.2" rx=".55" fill="${ic}" opacity="${on === false ? 0.7 : 1}"/>
        <rect x="19.2" y="${y + 1.35}" width="${w}" height="1" rx=".5" fill="${C.text}" opacity="${on === false ? 0.5 : 0.85}"/>
        ${toggle(31.4, y, on)}
        ${i < rows.length - 1 ? `<rect x="15.6" y="${y + 4.15}" width="22.2" height=".2" fill="${C.border}"/>` : ''}`;
    }).join('');
    return `
    <rect x="14.3" y="22.2" width="26.4" height="35" rx="1.9" fill="#000" opacity=".25" transform="translate(.5 .6)"/>
    <rect x="13.8" y="21.6" width="26.4" height="35" rx="1.9" fill="${C.bg}" stroke="${C.border}" stroke-width=".3"/>
    <text x="15.6" y="25.6" font-size="2.2" font-weight="800" fill="${C.text}">Settings</text>
    <rect x="15.6" y="26.8" width="22.2" height=".35" rx=".17" fill="${C.frontend}"/>
    ${list}
    ${gear(51.4, 31.8, 6.2, C.muted, 9)}
    ${gear(55.6, 45.6, 4, C.frontend, 7)}
    ${gear(46.2, 50.8, 2.6, C.faint, 6)}`;
  },

  // artH 28: the founder rings in the IPO pointing at stars piling up per feature.
  ipo: () => {
    const hs = [5, 8.4, 11.8, 15.2, 18.6];
    const bars = hs.map((h, i) => {
      const x = 28 + i * 4.3, top = 51.6 - h, c = Kit.mix(TYPES.feature.color, '#B9A2FF', i * 0.12);
      return `<rect x="${x}" y="${top}" width="3.3" height="${h}" rx=".6" fill="${Kit.dark(c, 0.22)}"/>
        <rect x="${x}" y="${top}" width="2.5" height="${h}" rx=".6" fill="${c}"/>
        <use href="#i-star" x="${x - 0.35}" y="${top - 3.9}" width="4" height="4" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3"/>`;
    }).join('');
    return `
    <ellipse cx="18.6" cy="52.2" rx="5.4" ry=".6" fill="#000" opacity=".3"/>
    ${Kit.person(18.4, 52.2, { pose: 'point', k: 1.18, skin: 4, hair: 'bun', hairColor: Kit.HAIR.black, top: '#2F3A57', topStyle: 'blazer', pants: '#262C3D', mood: 'grin' })}
    <rect x="26.8" y="51.6" width="22.6" height=".5" rx=".25" fill="${C.border}"/>
    ${bars}
    <rect x="50.5" y="28" width="11" height="7.6" rx="1.2" fill="${C.bg}" stroke="${C.gold}" stroke-width=".35"/>
    <text x="56" y="31.2" font-size="1.9" font-weight="800" fill="${C.gold}" text-anchor="middle">$STKT</text>
    <text x="56" y="34.1" font-size="1.65" font-weight="700" fill="${C.backend}" text-anchor="middle">▲312%</text>
    <g transform="translate(56 38.6)">
      <path d="M-.4 0H.4V1.2H-.4Z" fill="${C.goldDark}"/>
      <path d="M-3.6 9.6C-3.4 8.6 -2.8 8.2 -2.8 6.4V4.4C-2.8 2.4 -1.6 1 0 1C1.6 1 2.8 2.4 2.8 4.4V6.4C2.8 8.2 3.4 8.6 3.6 9.6Z" fill="${C.gold}"/>
      <path d="M1 1.3C2.2 1.8 2.8 3 2.8 4.4V6.4C2.8 8.2 3.4 8.6 3.6 9.6H2C1.8 8.6 1.6 7.8 1.6 6.4V4.4C1.6 3 1.4 2 1 1.3Z" fill="${C.goldDark}" opacity=".45"/>
      <rect x="-4" y="9.4" width="8" height="1" rx=".5" fill="${C.goldDark}"/>
      <circle cx="0" cy="11.2" r=".9" fill="${C.goldDark}"/>
      <path d="M-1.9 3.4Q-1.9 2.2 -.9 1.8" fill="none" stroke="#fff" stroke-width=".35" stroke-linecap="round" opacity=".6"/>
      <path d="M-4.8 3.2Q-5.8 5 -4.8 6.8M4.8 3.2Q5.8 5 4.8 6.8" fill="none" stroke="${C.gold}" stroke-width=".4" stroke-linecap="round"/>
    </g>`;
  },

  // artH 28: Big Tech hires the team; the product goes in the bin.
  acquihire: () => {
    const win = Array.from({ length: 18 }, (_, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const lit = [0, 2, 4, 5, 7, 9, 10, 13, 15, 17].includes(i);
      return `<rect x="${49.1 + col * 3.3}" y="${31.6 + row * 3}" width="2" height="1.8" rx=".3" fill="${lit ? C.gold : C.bg}" opacity="${lit ? 0.95 : 0.7}"/>`;
    }).join('');
    return `
    <ellipse cx="24.2" cy="52.3" rx="11.5" ry=".7" fill="#000" opacity=".3"/>
    ${Kit.person(16.4, 52.2, { pose: 'stand', k: 1.04, skin: 1, hair: 'long', hairColor: Kit.HAIR.auburn, top: C.frontend, topStyle: 'hoodie', pants: '#3B4560', mood: 'happy' })}
    ${Kit.person(24.4, 52.2, { pose: 'stand', k: 1.1, skin: 4, hair: 'buzz', hairColor: Kit.HAIR.black, top: C.backend, topStyle: 'tee', pants: '#46506A', beard: true, mood: 'grin' })}
    ${Kit.person(32.2, 52.2, { pose: 'stand', k: 1.04, skin: 2, hair: 'side', hairColor: Kit.HAIR.black, top: C.agent, topStyle: 'shirt', pants: '#2F3A57', glasses: true, mood: 'smile' })}

    <path d="M36.6 34.2H44" stroke="${C.gold}" stroke-width=".75" stroke-linecap="round"/>
    <polygon points="45.4,34.2 43.2,32.8 43.2,35.6" fill="${C.gold}"/>
    ${iconAt('coin', null, 38.4, 28.4, 3.6)}

    <g transform="rotate(-18 41.6 45)"><rect x="39.4" y="40.6" width="4.6" height="7.6" rx=".9" fill="${C.frontend}"/>
      <rect x="40" y="41.6" width="3.4" height="5.2" rx=".35" fill="#4B2A6B"/>
      <rect x="40" y="44.4" width="3.4" height="2.4" rx=".2" fill="#2A1F3D"/>
      <path d="M40.9 44.4a.8 .8 0 0 1 1.6 0Z" fill="${C.kw}"/><path d="M40.2 44.4H43.2" stroke="${C.gold}" stroke-width=".2"/></g>
    <path d="M38 46.4H45.4L44.6 52.4H38.8Z" fill="#5B5F68"/>
    <path d="M42.4 46.4H45.4L44.6 52.4H42Z" fill="#000" opacity=".2"/>
    <rect x="37.6" y="45.6" width="8.2" height="1.3" rx=".5" fill="#787C86"/>
    <path d="M40 48V51M41.7 48V51M43.4 48V51" stroke="#474A52" stroke-width=".35" stroke-linecap="round"/>

    <rect x="53.6" y="26.4" width=".4" height="2.6" fill="${C.muted}"/><circle cx="53.8" cy="26.4" r=".5" fill="${RED}"/>
    <rect x="47.6" y="29" width="13.4" height="23.4" rx="1.1" fill="#3A3D44"/>
    <rect x="47.6" y="29" width="11.8" height="23.4" rx="1.1" fill="#4A4E57"/>
    <rect x="47.6" y="29" width="13.4" height="1.6" rx=".8" fill="${TYPES.business.color}"/>
    ${win}
    <rect x="52" y="49.4" width="3.6" height="3" rx=".4" fill="${C.bg}"/>`;
  },

  // artH 28: the pitch slide adds a zero per deal; a proper unicorn prances beside it.
  'unicorn-valuation': () => `
    <rect x="13.1" y="28.6" width="21.4" height="21.6" rx="1.4" fill="#000" opacity=".25"/>
    <rect x="12.6" y="28" width="21.4" height="21.6" rx="1.4" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
    <rect x="12.6" y="28" width="21.4" height="1.3" rx=".65" fill="${TYPES.business.color}"/>
    <text x="14.2" y="32.4" font-size="1.6" font-weight="700" fill="${C.muted}" letter-spacing=".1">VALUATION</text>
    <text x="23.3" y="36.6" font-size="2.15" font-weight="800" fill="${C.gold}" text-anchor="middle">$1,000,000,000</text>
    <rect x="14.2" y="38.4" width="18.2" height=".25" fill="${C.border}"/>
    ${[17.4, 23.3, 29.2].map((x, i) => `${briefcase(x, 47.9 - i * 0)}
      <text x="${x}" y="${41.9}" font-size="1.7" font-weight="800" fill="${C.backend}" text-anchor="middle">+0</text>`).join('')}
    <ellipse cx="23.3" cy="52.4" rx="9" ry=".6" fill="#000" opacity=".25"/>
    <rect x="22.9" y="49.6" width=".8" height="2.6" fill="${C.border}"/>
    <rect x="19.8" y="51.8" width="7" height=".8" rx=".4" fill="${C.border}"/>

    ${unicorn(36.2, 52.4, 1)}
    ${sparkle(53.8, 30.4, 1.1)}${sparkle(50.6, 27.4, .6, LIGHT)}${sparkle(39.4, 31.2, .8, PINK)}`,

  // artH 28: a maintainer at the laptop, the libraries they know inside out, and the repo's stats.
  'open-source-maintainer': () => {
    const books = [[C.frontend, 10.4, 0.6], [C.agent, 11.6, -0.4], [C.backend, 11, 0.3], [TYPES.library.color, 12.2, 0]];
    const stack = books.map(([c, w, dx], i) => {
      const y = 48.6 - i * 3.6, x = 39.6 - w / 2 + dx;
      return `<rect x="${x}" y="${y}" width="${w}" height="3.4" rx=".6" fill="${Kit.dark(c, 0.25)}"/>
        <rect x="${x}" y="${y}" width="${w}" height="2.7" rx=".6" fill="${c}"/>
        <rect x="${x + w - 1.2}" y="${y + 0.5}" width=".9" height="2.4" rx=".2" fill="#F5F1E6"/>
        <rect x="${x + 1.1}" y="${y}" width=".55" height="3.4" fill="#fff" opacity=".45"/>
        <rect x="${x + 2.6}" y="${y + 1.05}" width="${w * 0.35}" height=".6" rx=".3" fill="#fff" opacity=".55"/>`;
    }).join('');
    return `
    ${Kit.dev(22.2, 49.2, { k: 1.22, deskW: 15, skin: 0, hair: 'grey', beard: Kit.HAIR.grey, glasses: true, top: TYPES.library.color, topStyle: 'hoodie', mood: 'neutral', laptopColor: '#5B5F68' })}
    <circle cx="24.4" cy="45.4" r=".75" fill="${C.backend}"/><rect x="18.8" y="45" width="2.4" height="1" rx=".5" fill="${C.gold}"/>
    <ellipse cx="39.6" cy="52.4" rx="7" ry=".6" fill="#000" opacity=".3"/>
    ${stack}
    ${iconAt('star', null, 37.6, 33.1, 4)}

    <rect x="48" y="28.4" width="13.4" height="6.6" rx="1.2" fill="${C.bg}" stroke="${C.gold}" stroke-width=".35"/>
    <use href="#i-star" x="49" y="29.9" width="3.6" height="3.6" fill="${C.gold}"/>
    <text x="53.4" y="32.4" font-size="1.95" font-weight="800" fill="${C.text}">12.4k</text>
    <rect x="48" y="37.4" width="13.4" height="5.2" rx="1" fill="${C.bg}" stroke="${C.backend}" stroke-width=".3"/>
    <text x="54.7" y="40.6" font-size="1.65" font-weight="700" fill="${C.backend}" text-anchor="middle">PR merged</text>
    <rect x="48" y="45" width="13.4" height="5.2" rx="1" fill="${C.bg}" stroke="${C.kw}" stroke-width=".3"/>
    <text x="54.7" y="48.2" font-size="1.65" font-weight="700" fill="${C.kw}" text-anchor="middle">issues 99+</text>`;
  },
});

const sprint3Feature = name => ({ kind: 'chips', label: 'MAKES FREE FOR YOU', chips: [{ kind: 'feature', name, sprint: 3 }] });

CARDS.push(
  {
    id: 'login-screen', name: 'Login Screen', type: 'feature', sprint: 1, copies: [3], points: 3,
    cost: ['frontend', 'backend'], file: 'Login.kt', artH: 27,
    effects: [sprint3Feature('GDPR Compliance')],
    code: [[C.fn, 'authenticate'], [C.text, '('], [C.str, '"oauth"'], [C.text, ') { '], [C.fn, 'login'], [C.text, '() }']],
    comment: 'three weeks of OAuth edge cases',
  },
  {
    id: 'dark-mode', name: 'Dark Mode', type: 'feature', sprint: 1, copies: [3], points: 2,
    cost: ['frontend'], file: 'Theme.kt', artH: 27,
    effects: [sprint3Feature('Accessibility')],
    code: [[C.fn, 'MaterialTheme'], [C.text, '('], [C.fn, 'darkColorScheme'], [C.text, '()) { }']],
    comment: 'done, until design comes back with notes',
  },
  {
    id: 'profile-screen', name: 'Profile Screen', type: 'feature', sprint: 1, copies: [3], points: 3,
    cost: ['frontend', 'frontend'], file: 'Profile.kt', artH: 38,
    effects: [],
    code: [[C.fn, 'OutlinedTextField'], [C.text, '(bio, { bio = it })']],
    comment: 'a surprising number of TextField states',
  },
  {
    id: 'health-check', name: 'Health-check Endpoint', type: 'feature', sprint: 1, copies: [4], points: 2,
    cost: ['backend'], file: 'Health.kt', artH: 27,
    effects: [sprint3Feature('Security Audit')],
    code: [[C.fn, 'get'], [C.text, '('], [C.str, '"/health"'], [C.text, ') { call.'], [C.fn, 'respond'], [C.text, '('], [C.str, '"OK"'], [C.text, ') }']],
    comment: "the most reliable code you'll ever ship",
  },
  {
    id: 'settings-screen', name: 'Settings Screen', type: 'feature', sprint: 1, copies: [5], points: 3,
    cost: ['frontend', 'backend'], file: 'Settings.kt', artH: 38,
    effects: [],
    code: [[C.fn, 'Switch'], [C.text, '(checked, onCheckedChange = {})']],
    comment: 'each toggle: a decision someone dodged',
  },
  {
    id: 'ipo', name: 'IPO', type: 'business', sprint: 3, copies: [3, 4], points: 0,
    file: 'Ipo.kt', artH: 28,
    effects: [{ kind: 'tile', icon: 'star', amount: 1, label: 'AT GAME END', text: 'per your {feature} Feature card' }],
    code: [[C.text, 'points += features.'], [C.fn, 'size']],
    comment: 'Wall Street counts features, not LOC',
  },
  {
    id: 'acquihire', name: 'Acquihire', type: 'business', sprint: 3, copies: [3, 5], points: 2,
    file: 'Acquisition.kt', artH: 28,
    effects: [{ kind: 'tile', icon: 'star', amount: 1, label: 'AT GAME END', text: 'per your {team} Team card' }],
    code: [[C.text, 'bigTech.'], [C.fn, 'hire'], [C.text, '(team); product.'], [C.fn, 'sunset'], [C.text, '()']],
    comment: 'the product is a rounding error',
  },
  {
    id: 'unicorn-valuation', name: 'Unicorn Valuation', type: 'business', sprint: 3, copies: [3], points: 2,
    file: 'Valuation.kt', artH: 28,
    effects: [{ kind: 'tile', icon: 'star', amount: 1, label: 'AT GAME END', text: 'per your {business} Business card' }],
    code: [[C.text, 'valuation *= '], [C.fn, '10.0'], [C.text, '.'], [C.fn, 'pow'], [C.text, '(deals.size)']],
    comment: 'every deal adds another zero',
  },
  {
    id: 'open-source-maintainer', name: 'Open Source Maintainer', type: 'business', sprint: 3, copies: [3], points: 0,
    file: 'Maintainer.kt', artH: 28,
    effects: [{ kind: 'tile', icon: 'star', amount: 2, label: 'AT GAME END', text: 'per your {library} Library card' }],
    code: [[C.text, 'points += '], [C.fn, '2'], [C.text, ' * libraries.'], [C.fn, 'size']],
    comment: 'you know these libraries from the inside',
  },
);
})();
