// Sprint II features: iOS App, Payments, Push Notifications, Onboarding, Search, Map View, Crash Reporting.
(() => {
// Small local helpers (inside the IIFE, so they do not leak into the shared scope).
const RED = '#F26D6D';
const shadow = (x, y, w, h, rx = 1.4) => `<rect x="${x + .5}" y="${y + .7}" width="${w}" height="${h}" rx="${rx}" fill="#000" opacity=".28"/>`;
const pin = (x, y, col, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy=".2" rx="1.4" ry=".45" fill="#000" opacity=".35"/>
  <path d="M0 0 C-1.2 -1.6 -2.2 -2.6 -2.2 -3.9 A2.2 2.2 0 0 1 2.2 -3.9 C2.2 -2.6 1.2 -1.6 0 0 Z" fill="${col}"/>
  <path d="M0 0 C1.2 -1.6 2.2 -2.6 2.2 -3.9 A2.2 2.2 0 0 0 .6 -6 C1.4 -5 1.5 -3.4 0 0 Z" fill="#000" opacity=".18"/>
  <circle cx="0" cy="-3.9" r=".85" fill="${C.bg}"/></g>`;
const starPath = (x, y, s, fill, stroke = 'none') =>
  `<use href="#i-star" x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}" stroke="${stroke}" stroke-width=".25"/>`;
// A modern phone: (x, y) = top-left, w x h; body colour with a darker right edge, a camera pill and a screen slot.
const handset = (x, y, w, h, col, screen = '') => `<g transform="translate(${x} ${y})">
  ${shadow(0, 0, w, h, 2)}
  <rect width="${w}" height="${h}" rx="2" fill="${Kit.dark(col, .28)}"/>
  <rect width="${w - .6}" height="${h}" rx="2" fill="${col}"/>
  <rect x=".8" y=".8" width="${w - 1.9}" height="${h - 1.6}" rx="1.3" fill="${C.code}"/>
  <rect x="${(w - 1.1) / 2 - 1.4}" y="1.4" width="2.8" height=".9" rx=".45" fill="${col}"/>
  ${screen}
  <path d="M1.3 1.6 v${h - 4}" stroke="#fff" stroke-width=".25" opacity=".18" stroke-linecap="round"/></g>`;

Object.assign(ART, {
  // Shared Compose code becomes an iPhone app; then it sits with App Review for a week.
  'ios-app': () => `
    ${shadow(12.4, 30.8, 16.6, 16.8)}
    <rect x="12.4" y="30.8" width="16.6" height="16.8" rx="1.4" fill="${C.code}" stroke="${C.border}" stroke-width=".3"/>
    <path d="M12.4 34 v-1.8 a1.4 1.4 0 0 1 1.4 -1.4 h13.8 a1.4 1.4 0 0 1 1.4 1.4 v1.8 z" fill="${C.surface2}"/>
    <circle cx="14.2" cy="32.4" r=".45" fill="${RED}"/><circle cx="15.6" cy="32.4" r=".45" fill="${C.gold}"/><circle cx="17" cy="32.4" r=".45" fill="${C.backend}"/>
    <text x="13.6" y="36.7" font-size="1.7" fill="${C.cls}">@Composable</text>
    <text x="13.6" y="39.3" font-size="1.7"><tspan fill="${C.kw}">fun</tspan><tspan fill="${C.fn}"> App</tspan><tspan fill="${C.text}">() {</tspan></text>
    <rect x="15.2" y="40.6" width="9.4" height="1" rx=".5" fill="${C.fn}" opacity=".85"/>
    <rect x="15.2" y="42.4" width="6.4" height="1" rx=".5" fill="${C.str}" opacity=".85"/>
    <text x="13.6" y="46.2" font-size="1.7" fill="${C.text}">}</text>
    <polygon points="30.2,37.7 32.4,37.7 32.4,36.1 35,39 32.4,41.9 32.4,40.3 30.2,40.3" fill="url(#bolt)"/>
    ${handset(36.4, 30.2, 10.8, 18.6, C.frontend, `
      <rect x="1.8" y="3.4" width="7" height="4.6" rx=".8" fill="${C.frontend}"/>
      <circle cx="3.6" cy="5.1" r=".9" fill="${C.code}" opacity=".7"/>
      <path d="M1.8 8 l2.6 -2.2 l2 1.4 l2.4 -1.8 v2.6 z" fill="${Kit.dark(C.frontend, .3)}"/>
      <rect x="1.8" y="9.2" width="7" height="1" rx=".5" fill="${C.text}" opacity=".8"/>
      <rect x="1.8" y="11" width="4.6" height=".9" rx=".45" fill="${C.muted}" opacity=".6"/>
      <rect x="1.8" y="14" width="7" height="2.2" rx="1.1" fill="${C.kw}"/>
      <rect x="3.5" y="17.1" width="3.6" height=".45" rx=".22" fill="${C.text}" opacity=".5"/>`)}
    ${Kit.person(53, 48.8, { k: .8, skin: 3, hair: 'bun', hairColor: Kit.HAIR.black, glasses: true,
      top: '#6B7080', topStyle: 'blazer', mood: 'neutral' })}
    <g transform="translate(55.6 30.4)">
      ${shadow(0, 0, 5.6, 6.8, 1)}
      <rect width="5.6" height="6.8" rx="1" fill="${C.text}"/>
      <path d="M0 2.4 v-1.4 a1 1 0 0 1 1 -1 h3.6 a1 1 0 0 1 1 1 v1.4 z" fill="${C.gold}"/>
      <text x="2.8" y="1.85" font-size="1.6" font-weight="800" fill="#3A2A05" text-anchor="middle">DAYS</text>
      <text x="2.8" y="5.9" font-size="3" font-weight="800" fill="${C.bg}" text-anchor="middle">7</text>
    </g>
    <g transform="translate(53 47.4) rotate(-8)">
      <rect x="-4.6" y="-1.3" width="9.2" height="2.6" rx=".5" fill="${C.bg}" stroke="${C.gold}" stroke-width=".35"/>
      <text x="0" y=".6" font-size="1.6" font-weight="800" fill="${C.gold}" text-anchor="middle">IN REVIEW</text>
    </g>`,

  // A card payment fires a webhook; the JSON had better be exactly right.
  payments: () => `
    <g transform="translate(21.2 39.6) rotate(-9)">
      <rect x="-8.2" y="-4.6" width="17" height="11" rx="1.4" fill="#000" opacity=".3"/>
      <rect x="-9" y="-5.6" width="17.6" height="11.2" rx="1.4" fill="${C.goldDark}"/>
      <rect x="-9" y="-5.6" width="17" height="11.2" rx="1.4" fill="${C.gold}"/>
      <path d="M-7.6 -5.6 h10 l-6 11.2 h-4 a1.4 1.4 0 0 1 -1.4 -1.4 v-8.4 a1.4 1.4 0 0 1 1.4 -1.4z" fill="#fff" opacity=".14"/>
      <rect x="-7.2" y="-2.6" width="3.4" height="2.6" rx=".5" fill="#FFE7A3" stroke="${C.goldDark}" stroke-width=".25"/>
      <path d="M-6.1 -2.6 v2.6 M-4.9 -2.6 v2.6 M-7.2 -1.3 h3.4" stroke="${C.goldDark}" stroke-width=".2"/>
      <g fill="none" stroke="#3A2A05" stroke-width=".35" stroke-linecap="round" opacity=".7">
        <path d="M-2.4 -2.4 a1.4 1.4 0 0 1 0 2.2"/><path d="M-1.5 -3 a2.3 2.3 0 0 1 0 3.4"/></g>
      <text x="-7.2" y="3.4" font-size="1.7" font-weight="700" fill="#3A2A05">•••• 4242</text>
      <circle cx="4.4" cy="-3.2" r="1.3" fill="${C.goldDark}" opacity=".75"/><circle cx="5.9" cy="-3.2" r="1.3" fill="${C.kw}" opacity=".85"/>
    </g>
    <path d="M30.6 38.6 C32.4 35.4 35 35.4 37.2 38.2" fill="none" stroke="${C.kw}" stroke-width=".5" stroke-dasharray="1 .7" stroke-linecap="round"/>
    <polygon points="37.8,39 36.1,38.1 37.6,36.9" fill="${C.kw}"/>
    <circle cx="33.9" cy="41.6" r="2.4" fill="${C.surface2}" stroke="${C.kw}" stroke-width=".35"/>
    <polygon points="34.4,39.6 32.8,41.9 33.9,41.9 33.4,43.6 35,41.2 33.9,41.2" fill="url(#bolt)"/>
    <text x="33.9" y="46.6" font-size="1.6" font-weight="700" fill="${C.kw}" text-anchor="middle">POST</text>
    ${shadow(38.8, 30.8, 22.2, 17.4)}
    <rect x="38.8" y="30.8" width="22.2" height="17.4" rx="1.4" fill="${C.code}" stroke="${C.backend}" stroke-width=".35"/>
    <path d="M38.8 34.4 v-2.2 a1.4 1.4 0 0 1 1.4 -1.4 h19.4 a1.4 1.4 0 0 1 1.4 1.4 v2.2 z" fill="${C.backend}" opacity=".22"/>
    <text x="40.2" y="33.2" font-size="1.6" font-weight="700" fill="${C.backend}">/webhook</text>
    <text x="40.2" y="37.4" font-size="1.7"><tspan fill="${C.text}">{</tspan><tspan fill="${C.cls}">"amount"</tspan><tspan fill="${C.text}">: </tspan><tspan fill="${C.fn}">4200</tspan><tspan fill="${C.text}">,</tspan></text>
    <path d="M51.6 38.4 q.5 -.4 1 0 t1 0 t1 0 t1 0" fill="none" stroke="${C.gold}" stroke-width=".3" stroke-linecap="round"/>
    <text x="41.2" y="40.6" font-size="1.7"><tspan fill="${C.cls}">"status"</tspan><tspan fill="${C.text}">: </tspan><tspan fill="${C.str}">"paid"</tspan><tspan fill="${C.text}">}</tspan></text>
    <rect x="40.2" y="42.8" width="12.4" height="3.6" rx="1.8" fill="${C.backend}"/>
    <polyline points="41.6,44.6 42.4,45.4 43.6,43.9" fill="none" stroke="${C.bg}" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="48.2" y="45.2" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">200 OK</text>
    <text x="59.6" y="45.2" font-size="1.6" fill="${C.faint}" text-anchor="end">12ms</text>`,

  // A backend queue pushes "We miss you!" onto phones on two platforms.
  'push-notifications': () => `
    ${serverRack(12.6, 32.6, 0.74)}
    <rect x="26" y="40.2" width="9.6" height=".7" rx=".35" fill="${C.surface2}"/>
    ${[0, 1, 2].map(i => `<g transform="translate(${26.4 + i * 3} 37.8)">
      <rect width="2.6" height="2" rx=".35" fill="${Kit.mix(C.surface2, C.gold, .3 + i * .35)}"/>
      <path d="M.2 .25 l1.1 .9 l1.1 -.9" fill="none" stroke="${C.bg}" stroke-width=".25" stroke-linejoin="round"/></g>`).join('')}
    <text x="30.8" y="43.4" font-size="1.6" fill="${C.muted}" text-anchor="middle">queue</text>
    ${handset(50.6, 31.8, 10, 16.8, C.backend, `
      <rect x="1.6" y="3.4" width="6.2" height="2.6" rx=".8" fill="${C.surface2}"/>
      <rect x="2.1" y="3.9" width="1.6" height="1.6" rx=".4" fill="${C.gold}"/>
      <rect x="4.2" y="4.3" width="3" height=".7" rx=".35" fill="${C.text}" opacity=".7"/>
      <rect x="1.6" y="9" width="6.2" height=".9" rx=".45" fill="${C.backend}" opacity=".35"/>
      <rect x="1.6" y="10.8" width="4.2" height=".9" rx=".45" fill="${C.backend}" opacity=".25"/>`)}
    ${handset(41, 30.4, 10.8, 18.4, C.frontend, `
      <rect x="1.8" y="12.4" width="7" height="1" rx=".5" fill="${C.frontend}" opacity=".35"/>
      <rect x="1.8" y="14.2" width="4.6" height="1" rx=".5" fill="${C.frontend}" opacity=".25"/>`)}
    <polygon points="35.9,37.9 37.5,38.8 35.9,39.7" fill="${C.kw}"/>
    ${shadow(38, 34.4, 20.6, 7)}
    <rect x="38" y="34.4" width="20.6" height="7" rx="1.6" fill="${C.surface2}" stroke="${C.border}" stroke-width=".3"/>
    <rect x="39" y="35.5" width="4.8" height="4.8" rx="1.1" fill="${C.gold}"/>
    <path d="M40.3 39 h2.2 l-.4-.6 v-1.2 a.7 .7 0 0 0 -1.4 0 v1.2 z" fill="#3A2A05"/>
    <circle cx="41.4" cy="39.4" r=".35" fill="#3A2A05"/>
    <circle cx="43.7" cy="35.6" r=".9" fill="${RED}"/>
    <text x="44.6" y="37.3" font-size="1.7" font-weight="700" fill="${C.text}">We miss you!</text>
    <text x="44.6" y="39.9" font-size="1.6" fill="${C.muted}">come back</text>`,

  // Three swipeable welcome slides, A/B-tested twelve times, and the user goes straight for Skip.
  onboarding: () => {
    const side = (x, rot, accent, icon) => `<g transform="translate(${x} 39.6) rotate(${rot})" opacity=".55">
      ${handset(-4.6, -7.8, 9.2, 15.6, C.frontend, `
        <circle cx="4" cy="5.4" r="2.2" fill="${accent}" opacity=".9"/>${icon}
        <rect x="1.6" y="9" width="4.8" height=".9" rx=".45" fill="${C.text}" opacity=".7"/>
        <rect x="2.2" y="10.7" width="3.6" height=".8" rx=".4" fill="${C.muted}" opacity=".6"/>`)}</g>`;
    return `
    ${side(23.4, -9, C.backend, `<path d="M3 5.4 l.8 .8 l1.4 -1.5" fill="none" stroke="${C.code}" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round"/>`)}
    ${side(50.6, 9, C.agent, `<circle cx="4" cy="5.4" r=".7" fill="${C.code}"/>`)}
    ${handset(30.6, 30.2, 11.8, 18.6, C.frontend, `
      <rect x="1.7" y="3.2" width="7.6" height="7.4" rx="1" fill="${C.surface2}"/>
      <circle cx="7.6" cy="4.6" r=".6" fill="${C.gold}"/>
      ${Kit.person(5.5, 10.6, { k: .42, skin: 2, hair: 'curly', hairColor: Kit.HAIR.black, top: C.kw, mood: 'happy' })}
      <text x="5.5" y="12.9" font-size="1.7" font-weight="700" fill="${C.text}" text-anchor="middle">Welcome!</text>
      <circle cx="4.1" cy="14.6" r=".4" fill="${C.frontend}"/><circle cx="5.5" cy="14.6" r=".4" fill="${C.faint}"/><circle cx="6.9" cy="14.6" r=".4" fill="${C.faint}"/>
      <rect x="2" y="15.6" width="7" height="1.7" rx=".85" fill="${C.frontend}" opacity=".35"/>`)}
    <g transform="translate(43.4 34.2)">
      <circle cx="0" cy="0" r="2.6" fill="none" stroke="${C.kw}" stroke-width=".25" opacity=".55"/>
      <rect x="-3.2" y="-1.5" width="6.4" height="3" rx="1.5" fill="${C.kw}"/>
      <text x="0" y=".6" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">Skip</text>
      <g transform="translate(2.4 .6) rotate(-22) scale(.75)">
        <path d="M0 0 l0 4.6 l1.2 -1.1 l1 2.2 l.9 -.4 l-1 -2.2 l1.7 -.1 z" fill="${C.text}" stroke="${C.bg}" stroke-width=".35" stroke-linejoin="round"/>
      </g>
    </g>
    <g transform="translate(16.4 32.8) rotate(-10)">
      <circle r="3.1" fill="${C.gold}"/><circle r="2.6" fill="none" stroke="${C.goldDark}" stroke-width=".25" stroke-dasharray=".5 .4"/>
      <text x="0" y="-.1" font-size="1.6" font-weight="800" fill="#3A2A05" text-anchor="middle">A/B</text>
      <text x="0" y="1.6" font-size="1.6" font-weight="700" fill="#3A2A05" text-anchor="middle">×12</text>
    </g>`;
  },

  // A search box over highlighted results, backed by a ten-million-row table.
  search: () => `
    ${shadow(12.6, 30.8, 33.4, 5.4, 2.7)}
    <rect x="12.6" y="30.8" width="33.4" height="5.4" rx="2.7" fill="${C.code}" stroke="${C.frontend}" stroke-width=".4"/>
    <circle cx="15.7" cy="33.2" r="1.25" fill="none" stroke="${C.frontend}" stroke-width=".45"/>
    <line x1="16.6" y1="34.1" x2="17.5" y2="35" stroke="${C.frontend}" stroke-width=".55" stroke-linecap="round"/>
    <text x="19.2" y="34.2" font-size="1.9" fill="${C.text}">kotlin</text>
    <rect x="26.4" y="32.2" width=".3" height="2.4" fill="${C.frontend}"/>
    <rect x="39.4" y="31.9" width="5.4" height="3.2" rx="1.6" fill="${C.frontend}"/>
    <text x="42.1" y="34.1" font-size="1.6" font-weight="800" fill="${C.bg}" text-anchor="middle">GO</text>
    <rect x="12.6" y="37.4" width="33.4" height="11" rx="1.2" fill="${C.surface2}" opacity=".55"/>
    ${[['Learn ', 'kotlin', ' fast'], ['', 'Kotlin', ' tips'], ['Why ', 'kotlin', '?']].map(([a, b, c], i) => {
      const y = 40.4 + i * 3.2, x0 = 17.4 + a.length * 1.02, w = b.length * 1.02;
      return `<rect x="13.6" y="${y - 1.7}" width="2.2" height="2.2" rx=".5" fill="${[C.frontend, C.backend, C.agent][i]}" opacity=".8"/>
      <rect x="${x0 - .3}" y="${y - 1.5}" width="${w + .6}" height="2" rx=".4" fill="${C.gold}"/>
      <text x="17.4" y="${y}" font-size="1.7" xml:space="preserve"><tspan fill="${C.text}">${a}</tspan><tspan fill="#3A2A05" font-weight="700">${b}</tspan><tspan fill="${C.text}">${c}</tspan></text>
      <rect x="${17.4 + (a + b + c).length * 1.02 + 1.2}" y="${y - 1.2}" width="${Math.max(2, 13 - (a + b + c).length * 1.02)}" height="1" rx=".5" fill="${C.muted}" opacity=".35"/>`;
    }).join('')}
    <g transform="translate(48.6 31.4)">
      <ellipse cx="6" cy="15.4" rx="6.4" ry="1.2" fill="#000" opacity=".3"/>
      <path d="M0 2 v12.6 a6 2 0 0 0 12 0 v-12.6" fill="#3E9E68"/>
      <path d="M8.4 3.8 v12.6 a6 2 0 0 0 3.6 -1.8 v-12.6 a6 2 0 0 1 -3.6 1.8z" fill="#000" opacity=".15"/>
      <path d="M1 3.6 v11.6" stroke="#fff" stroke-width=".5" opacity=".18" stroke-linecap="round"/>
      <path d="M0 5.2 a6 2 0 0 0 12 0" fill="none" stroke="${C.bg}" stroke-width=".35" opacity=".45"/>
      <ellipse cx="6" cy="2" rx="6" ry="2" fill="${C.backend}"/>
      <ellipse cx="6" cy="2" rx="4" ry="1.1" fill="#fff" opacity=".12"/>
      <text x="6" y="11" font-size="2.6" font-weight="800" fill="${C.bg}" text-anchor="middle">10M</text>
      <text x="6" y="13.6" font-size="1.6" font-weight="700" fill="${C.bg}" text-anchor="middle" opacity=".8">rows</text>
    </g>`,

  // A map in a Composable with a "you are here" dot and pins, fed by a backend that knows the coordinates.
  'map-view': () => `
    ${shadow(12.6, 30.6, 33.6, 17.8)}
    <rect x="12.6" y="30.6" width="33.6" height="17.8" rx="1.4" fill="#22302A"/>
    <g transform="translate(12.6 30.6)">
      <rect x="1.4" y="1.2" width="6.6" height="3.6" rx=".6" fill="${C.backend}" opacity=".3"/>
      <circle cx="3.4" cy="2.6" r=".7" fill="${C.backend}" opacity=".5"/><circle cx="5.8" cy="3.4" r=".6" fill="${C.backend}" opacity=".5"/>
      ${[[10.4, 1.2, 6, 3.6], [19, 1.2, 6.2, 3.4], [27, 6.6, 5.4, 3.2], [10.4, 6.8, 6.4, 3.2], [1.4, 6.8, 6.6, 3.4], [27, 1.2, 5.4, 3.4]].map(([x, y, w, h]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".5" fill="#2E3D36"/>`).join('')}
      <path d="M.2 14.4 C5.4 12.4 9.4 16.4 14.8 14 S25.4 10.4 33.4 12.2" fill="none" stroke="${C.frontend}" stroke-width="1.6" opacity=".5"/>
      <g stroke="#45524C" stroke-width=".9" stroke-linecap="butt">
        <line x1=".2" y1="5.8" x2="33.4" y2="5.8"/><line x1=".2" y1="10.9" x2="33.4" y2="10.9"/>
        <line x1="9.2" y1=".2" x2="9.2" y2="17.6"/><line x1="17.8" y1=".2" x2="17.8" y2="17.6"/><line x1="26.1" y1=".2" x2="26.1" y2="17.6"/>
      </g>
      <path d="M5.2 13.4 Q7 9 12.4 9.2 T22.4 6.8" fill="none" stroke="${C.gold}" stroke-width=".55" stroke-dasharray="1 .7" stroke-linecap="round"/>
      <circle cx="5.2" cy="13.4" r="2.4" fill="${C.frontend}" opacity=".2"/>
      <circle cx="5.2" cy="13.4" r="1.05" fill="#fff"/><circle cx="5.2" cy="13.4" r=".75" fill="${C.frontend}"/>
    </g>
    ${pin(23.4, 41.2, C.agent, 0.75)}
    ${pin(41.4, 46.4, C.gold, 0.7)}
    ${pin(35, 37.4, RED, 1.1)}
    <rect x="12.6" y="30.6" width="33.6" height="17.8" rx="1.4" fill="none" stroke="${C.border}" stroke-width=".35"/>
    <path d="M37.6 33.2 H48.6" stroke="${C.backend}" stroke-width=".45" stroke-dasharray=".9 .6"/>
    ${serverRack(48.8, 30.6, 0.7)}
    ${shadow(47.8, 43, 13.2, 5.4, 1)}
    <rect x="47.8" y="43" width="13.2" height="5.4" rx="1" fill="${C.code}" stroke="${C.backend}" stroke-width=".3"/>
    <text x="54.4" y="45.3" font-size="1.6" fill="${C.str}" text-anchor="middle">52.23 N</text>
    <text x="54.4" y="47.5" font-size="1.6" fill="${C.str}" text-anchor="middle">21.01 E</text>`,

  // Drawn for the taller window this card gets (no effect blocks): a crash report arrives,
  // the fix ships, and the one-star review never happens.
  'crash-reporting': () => `
    ${shadow(12.6, 21, 48.4, 16.6)}
    <rect x="12.6" y="21" width="48.4" height="16.6" rx="1.4" fill="${C.code}" stroke="${RED}" stroke-width=".4"/>
    <path d="M12.6 25.8 v-3.4 a1.4 1.4 0 0 1 1.4 -1.4 h45.6 a1.4 1.4 0 0 1 1.4 1.4 v3.4 z" fill="${RED}"/>
    <g transform="translate(15.6 23.5)">
      <g stroke="${C.bg}" stroke-width=".35" stroke-linecap="round">
        <line x1="-1.6" y1="-.6" x2="1.6" y2=".6"/><line x1="1.6" y1="-.6" x2="-1.6" y2=".6"/><line x1="-1.7" y1=".4" x2="1.7" y2=".4"/>
      </g>
      <ellipse cx="0" cy=".3" rx=".95" ry="1.35" fill="${C.bg}"/><circle cx="0" cy="-1.2" r=".6" fill="${C.bg}"/>
    </g>
    <text x="18.4" y="24.2" font-size="1.9" font-weight="800" fill="${C.bg}" letter-spacing=".15">FATAL EXCEPTION</text>
    <text x="58.8" y="24.2" font-size="1.6" font-weight="700" fill="${C.bg}" text-anchor="end">00:01</text>
    <text x="14.4" y="29.4" font-size="1.9" fill="${C.cls}">NullPointerException</text>
    <text x="16.2" y="32.4" font-size="1.7"><tspan fill="${C.faint}">at </tspan><tspan fill="${C.fn}">Cart.checkout</tspan><tspan fill="${C.faint}">(Cart.kt:42)</tspan></text>
    <text x="16.2" y="35.2" font-size="1.7"><tspan fill="${C.faint}">at </tspan><tspan fill="${C.fn}">Pay.submit</tspan><tspan fill="${C.faint}">(Pay.kt:17)</tspan></text>
    <rect x="47.4" y="27.2" width="11.6" height="3.6" rx="1.8" fill="${RED}" opacity=".2"/>
    <text x="53.2" y="29.7" font-size="1.6" font-weight="700" fill="${RED}" text-anchor="middle">312 users</text>

    <line x1="20" y1="38.6" x2="20" y2="44" stroke="${C.backend}" stroke-width=".6" stroke-linecap="round"/>
    <polygon points="20,45.2 18.8,43.4 21.2,43.4" fill="${C.backend}"/>
    <rect x="23" y="39.4" width="22" height="4.2" rx="2.1" fill="${C.backend}"/>
    <polyline points="24.6,41.6 25.4,42.4 26.8,40.8" fill="none" stroke="${C.bg}" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="35.6" y="42.3" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">fix 1.0.1 live</text>
    <text x="46.6" y="42.2" font-size="1.6" fill="${C.muted}">in 14 min</text>

    <rect x="12.6" y="46.4" width="48.4" height="12" rx="1.4" fill="${C.surface2}" stroke="${C.border}" stroke-width=".3"/>
    <g opacity=".55">
      <rect x="13.8" y="47.8" width="6.8" height="7.2" rx="1" fill="${C.surface}"/>
      ${Kit.person(17.2, 55, { k: .42, skin: 0, hair: 'long', hairColor: Kit.HAIR.auburn, top: C.frontend, mood: 'smile' })}
      ${starPath(22, 48, 3.2, C.gold, C.goldDark)}
      ${[1, 2, 3, 4].map(i => starPath(22 + i * 3.4, 48, 3.2, 'none', C.muted)).join('')}
      <text x="22" y="55.6" font-size="1.8" fill="${C.text}">"It crashes!!"</text>
    </g>
    <line x1="21.6" y1="55" x2="37" y2="55" stroke="${C.text}" stroke-width=".35" opacity=".7"/>
    <g transform="translate(52.4 51.8) rotate(-12)">
      <rect x="-7" y="-2.4" width="14" height="4.8" rx=".8" fill="${C.surface2}" stroke="${C.backend}" stroke-width=".5"/>
      <rect x="-6.3" y="-1.7" width="12.6" height="3.4" rx=".5" fill="none" stroke="${C.backend}" stroke-width=".2"/>
      <text x="0" y=".6" font-size="1.7" font-weight="800" fill="${C.backend}" text-anchor="middle" letter-spacing=".1">NEVER SENT</text>
    </g>`,
});

const free = (name, kind = 'library', sprint = 1) =>
  ({ kind: 'chips', label: 'FREE IF YOU BUILT', chips: [{ kind, name, sprint }] });

CARDS.push(
  {
    id: 'ios-app', name: 'iOS App', type: 'feature', sprint: 2, copies: [3], points: 5,
    cost: ['frontend', 'frontend', 'backend'], freeWith: 'Compose Multiplatform', file: 'MainViewController.kt',
    effects: [free('Compose Multiplatform')],
    code: [[C.fn, 'ComposeUIViewController'], [C.text, ' { '], [C.fn, 'App'], [C.text, '() }']],
    comment: 'same Compose code, now in Swift-land',
  },
  {
    id: 'payments', name: 'Payments', type: 'feature', sprint: 2, copies: [3], points: 5,
    cost: ['backend', 'backend', 'backend'], freeWith: 'kotlinx.serialization', file: 'Webhooks.kt',
    effects: [free('kotlinx.serialization')],
    code: [[C.text, 'json.'], [C.fn, 'decodeFromString'], [C.text, '<'], [C.cls, 'Payment'], [C.text, '>(body)']],
    comment: 'JSON you must never, ever get wrong',
  },
  {
    id: 'push-notifications', name: 'Push Notifications', type: 'feature', sprint: 2, copies: [3], points: 4,
    cost: ['frontend', 'backend', 'backend'], freeWith: 'kotlinx.coroutines', file: 'Notifier.kt',
    effects: [free('kotlinx.coroutines')],
    code: [[C.fn, 'launch'], [C.text, ' { queue.'], [C.fn, 'consumeEach'], [C.text, ' { '], [C.fn, 'push'], [C.text, '(it) } }']],
    comment: '"We miss you!" on two platforms',
  },
  {
    id: 'onboarding', name: 'Onboarding', type: 'feature', sprint: 2, copies: [3], points: 3,
    cost: ['frontend', 'frontend'], freeWith: 'Koin', file: 'Onboarding.kt',
    effects: [free('Koin')],
    code: [[C.fn, 'HorizontalPager'], [C.text, '(state) { '], [C.fn, 'Slide'], [C.text, '(it) }']],
    comment: 'three swipeable screens nobody reads',
  },
  {
    id: 'search', name: 'Search', type: 'feature', sprint: 2, copies: [4], points: 4,
    cost: ['backend', 'backend', 'frontend'], freeWith: 'kotlinx.serialization', file: 'Search.kt',
    effects: [free('kotlinx.serialization')],
    code: [[C.text, 'rows.'], [C.fn, 'filter'], [C.text, ' { query '], [C.kw, 'in'], [C.text, ' it.title }']],
    comment: 'easy for 10 rows, a career for 10M',
  },
  {
    id: 'map-view', name: 'Map View', type: 'feature', sprint: 2, copies: [4], points: 4,
    cost: ['frontend', 'frontend', 'backend'], freeWith: 'Exposed', file: 'MapScreen.kt',
    effects: [free('Exposed')],
    code: [[C.fn, 'MapView'], [C.text, '(markers = places.'], [C.fn, 'near'], [C.text, '(me))']],
    comment: 'a backend that knows where everything is',
  },
  {
    id: 'crash-reporting', name: 'Crash Reporting', type: 'feature', sprint: 2, copies: [5], points: 3,
    cost: ['frontend', 'backend'], file: 'CrashHandler.kt', artH: 38,
    effects: [],
    code: [[C.kw, 'catch'], [C.text, ' (e: '], [C.cls, 'Throwable'], [C.text, ') { '], [C.fn, 'report'], [C.text, '(e) }']],
    comment: 'you know before the one-star review does',
  },
);
})();
