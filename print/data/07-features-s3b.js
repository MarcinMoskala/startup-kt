// Sprint III features, batch B: Accessibility, Home Screen Widgets, Security Audit, Localization,
// GDPR Compliance, Product Hunt Launch, Dokka Docs, Wear OS App.
(() => {
const free = (kind, name, sprint) => [{ kind: 'chips', label: 'FREE IF YOU BUILT', chips: [{ kind, name, sprint }] }];
const RED = '#F26D6D';
let clipN = 0;   // unique clip-path ids (a card can be on the page twice)

// Soft ground shadow under a figure or prop.
const ground = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry=".55" fill="#000" opacity=".28"/>`;

// A phone body with depth (darker side plate, sheen); returns the frame, the caller draws the screen content.
// (x, y) = top-left, screen inset 1 mm sides, 1.6 mm top, 2.6 mm bottom.
const handset = (x, y, w, h, color = C.frontend) => `
  <rect x="${x + 0.55}" y="${y + 0.45}" width="${w}" height="${h}" rx="1.9" fill="${Kit.dark(color, 0.38)}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.9" fill="${color}"/>
  <path d="M${x + 1.2} ${y + 0.55}H${x + w - 1.6}" stroke="${Kit.light(color, 0.45)}" stroke-width=".35" stroke-linecap="round" opacity=".8"/>
  <rect x="${x + 1}" y="${y + 1.6}" width="${w - 2}" height="${h - 4.2}" rx=".7" fill="${C.code}"/>
  <rect x="${x + w / 2 - 1.6}" y="${y + h - 1.55}" width="3.2" height=".6" rx=".3" fill="${Kit.dark(color, 0.3)}"/>`;

// Small check mark in a disc.
const tick = (x, y, r, fill, ink = '#fff') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>
  <path d="M${x - r * 0.45} ${y + r * 0.02}L${x - r * 0.1} ${y + r * 0.38}L${x + r * 0.48} ${y - r * 0.36}" fill="none" stroke="${ink}" stroke-width="${(r * 0.32).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`;

// Paper document with a folded corner and a darker fold; (x, y) = top-left.
const doc = (x, y, w, h, color) => `
  <path d="M${x + 0.5} ${y + 0.5}H${x + w - 2.4}L${x + w + 0.5} ${y + 3.4}V${y + h + 0.5}H${x + 0.5}Z" fill="${Kit.dark(color, 0.38)}"/>
  <path d="M${x} ${y}H${x + w - 2.9}L${x + w} ${y + 2.9}V${y + h - 0.6}Q${x + w} ${y + h} ${x + w - 0.6} ${y + h}H${x + 0.6}Q${x} ${y + h} ${x} ${y + h - 0.6}V${y + 0.6}Q${x} ${y} ${x + 0.6} ${y}Z" fill="${color}"/>
  <path d="M${x + w - 2.9} ${y}V${y + 2.3}Q${x + w - 2.9} ${y + 2.9} ${x + w - 2.3} ${y + 2.9}H${x + w}Z" fill="${Kit.dark(color, 0.22)}"/>`;

Object.assign(ART, {
  // The agent scans the shop screen, the icon-only cart button has a focus ring,
  // the screen reader says "Buy, button" and a user with headphones hears it.
  accessibility: () => `
    <path d="M21.6 38.6L27.3 32.6V47L21.6 40.4Z" fill="${C.agent}" opacity=".16"/>
    <path d="M21.6 38.6L27.3 32.6M21.6 40.4L27.3 47" stroke="${C.agent}" stroke-width=".22" opacity=".55"/>
    ${ground(17.4, 49.5, 4.6)}
    ${Kit.robot(17.4, 49.6, { body: true, expression: 'scan', arms: 'down', k: 0.95 })}

    ${handset(26.6, 30.2, 12, 19.2)}
    <rect x="28.4" y="32.8" width="8.4" height="5.6" rx=".8" fill="${C.surface2}"/>
    <path d="M30.5 34.4L31.9 33.7Q32.6 34.4 33.3 33.7L34.7 34.4L35.4 35.8L34.4 36.2V37.6H30.8V36.2L29.8 35.8Z" fill="${C.frontend}"/>
    <path d="M31.9 33.7Q32.6 34.4 33.3 33.7" fill="none" stroke="${Kit.dark(C.frontend, 0.35)}" stroke-width=".25"/>
    <rect x="28.4" y="39.3" width="5.4" height=".75" rx=".37" fill="${C.text}" opacity=".7"/>
    <rect x="28.4" y="40.7" width="3.4" height=".75" rx=".37" fill="${C.gold}"/>
    <rect x="27.95" y="42.15" width="9.3" height="4.1" rx="2.05" fill="none" stroke="${C.gold}" stroke-width=".45"/>
    <rect x="28.7" y="42.9" width="7.8" height="2.6" rx="1.3" fill="${C.frontend}"/>
    <g fill="none" stroke="${C.code}" stroke-width=".32" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30.9 43.4H31.5L32.1 44.85H34.1L34.5 43.75H31.85"/>
    </g>
    <circle cx="32.35" cy="45.2" r=".26" fill="${C.code}"/><circle cx="33.8" cy="45.2" r=".26" fill="${C.code}"/>
    <rect x="27.3" y="41.35" width="10.6" height=".32" rx=".16" fill="${C.agent}"/>
    <rect x="27.3" y="40.85" width="10.6" height="1.3" fill="${C.agent}" opacity=".18"/>
    ${tick(38.3, 31.1, 1.35, C.agent)}

    <g fill="none" stroke="${C.gold}" stroke-width=".4" stroke-linecap="round">
      <path d="M40 42.9Q40.8 44.2 40 45.5" opacity=".95"/><path d="M41.4 42Q42.7 44.2 41.4 46.4" opacity=".7"/><path d="M42.8 41.1Q44.6 44.2 42.8 47.3" opacity=".45"/>
    </g>
    <path d="M40.6 30.2H54.6Q55.6 30.2 55.6 31.2V33.8Q55.6 34.8 54.6 34.8H43.4L40.6 38L41.4 34.8H40.6Q39.6 34.8 39.6 33.8V31.2Q39.6 30.2 40.6 30.2Z" fill="${C.gold}"/>
    <path d="M40.6 31.9H41.2L42.1 31.2V33.8L41.2 33.1H40.6Z" fill="${C.code}"/>
    <path d="M42.7 31.8Q43.2 32.5 42.7 33.2" fill="none" stroke="${C.code}" stroke-width=".25" stroke-linecap="round"/>
    <text x="49.15" y="33.15" font-size="1.7" font-weight="800" fill="${C.code}" text-anchor="middle">Buy, button</text>

    ${ground(55.4, 49.5, 5.4)}
    ${Kit.person(55.4, 49.6, { k: 0.88, skin: 3, hair: 'curly', hairColor: Kit.HAIR.grey, glasses: true, headset: C.gold, top: '#E8EAED', topStyle: 'shirt', mood: 'happy' })}`,

  // The local database feeds a Tasks widget on the home screen; a user just glances at it.
  'home-widgets': () => `
    ${ground(17.6, 48.6, 5.6)}
    <g transform="translate(17.6 0)">
      <path d="M-5 34.4V46.4A5 1.7 0 0 0 5 46.4V34.4Z" fill="#3E9E68"/>
      <path d="M-5 34.4V46.4A5 1.7 0 0 0 1.6 48V36Z" fill="${C.backend}"/>
      <path d="M-5 38.6A5 1.7 0 0 0 5 38.6M-5 42.6A5 1.7 0 0 0 5 42.6" fill="none" stroke="${C.code}" stroke-width=".35" opacity=".45"/>
      <ellipse cy="34.4" rx="5" ry="1.7" fill="#8FE3B2"/>
      <ellipse cy="34.4" rx="3.6" ry="1" fill="${C.backend}" opacity=".5"/>
      <text y="44.9" font-size="2" font-weight="800" fill="${C.code}" text-anchor="middle">.db</text>
    </g>
    <path d="M23.2 37.6Q25.6 36.4 28.2 35.6" fill="none" stroke="${C.backend}" stroke-width=".55" stroke-linecap="round" stroke-dasharray="1 .8"/>
    <polygon points="29.5,35.2 27.4,34.5 27.9,36.6" fill="${C.backend}"/>

    ${handset(30, 29.8, 14.2, 19.8)}
    <rect x="31" y="31.4" width="12.2" height="15.6" rx=".7" fill="#232A3A"/>
    <rect x="31.8" y="32.2" width="10.6" height="7.6" rx="1.1" fill="${C.surface2}"/>
    <rect x="31.8" y="32.2" width="10.6" height="7.6" rx="1.1" fill="none" stroke="${C.backend}" stroke-width=".3"/>
    <text x="32.6" y="34.5" font-size="1.6" font-weight="800" fill="${C.text}">Tasks</text>
    <circle cx="40.9" cy="33.9" r="1" fill="${C.gold}"/>
    <text x="40.9" y="34.5" font-size="1.5" font-weight="800" fill="${C.code}" text-anchor="middle">3</text>
    ${tick(33.3, 36.3, .6, C.backend, C.code)}<rect x="34.4" y="35.95" width="6.4" height=".7" rx=".35" fill="${C.text}" opacity=".35"/>
    <circle cx="33.3" cy="38.3" r=".55" fill="none" stroke="${C.muted}" stroke-width=".25"/><rect x="34.4" y="37.95" width="4.8" height=".7" rx=".35" fill="${C.text}" opacity=".7"/>
    ${[0, 1, 2, 3].map(i => `<rect x="${32 + i * 2.65}" y="41.2" width="2" height="2" rx=".6" fill="${C.frontend}" opacity="${[0.95, 0.6, 0.4, 0.75][i]}"/>`).join('')}
    ${[0, 1, 2, 3].map(i => `<rect x="${32 + i * 2.65}" y="44" width="2" height="2" rx=".6" fill="${C.frontend}" opacity="${[0.45, 0.8, 0.55, 0.3][i]}"/>`).join('')}

    ${ground(54.6, 49.5, 5.8)}
    ${Kit.person(54.6, 49.6, { k: 0.95, skin: 0, hair: 'side', hairColor: Kit.HAIR.chestnut, top: C.gold, topStyle: 'hoodie', mood: 'happy' })}
    <g fill="none" stroke="${C.text}" stroke-width=".3" stroke-linecap="round" opacity=".6">
      <path d="M46.6 36.2L45.4 35.6M46.8 38.4L45.6 38.6M46.5 40.4L45.4 41"/>
    </g>`,

  // The agent fuzzes every route (all green), yet the auditor's magnifier finds the password in application.yaml.
  'security-audit': () => `
    ${ground(16.8, 49.5, 4.2)}
    ${Kit.robot(16.8, 49.6, { body: true, expression: 'focus', arms: 'wave', k: 0.85 })}
    <g fill="${C.agent}">
      <circle cx="22.6" cy="37.4" r=".35"/><circle cx="23.6" cy="37" r=".3" opacity=".7"/><circle cx="24.5" cy="36.6" r=".25" opacity=".45"/>
    </g>
    <rect x="25.6" y="31.8" width="12.4" height="11" rx="1.2" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
    <g font-size="1.6" font-weight="700">
      <text x="26.5" y="34.8"><tspan fill="${C.kw}">POST</tspan><tspan fill="${C.text}"> /in</tspan></text>
      <text x="26.5" y="38"><tspan fill="${C.kw}">GET</tspan><tspan fill="${C.text}"> /me</tspan></text>
      <text x="26.5" y="41.2"><tspan fill="${C.kw}">PUT</tspan><tspan fill="${C.text}"> /pay</tspan></text>
    </g>
    ${tick(36.4, 34.25, .75, C.backend, C.code)}${tick(36.4, 37.45, .75, C.backend, C.code)}${tick(36.4, 40.65, .75, C.backend, C.code)}

    <rect x="39.4" y="31.8" width="13.4" height="16.4" rx="1.2" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
    <rect x="39.4" y="31.8" width="13.4" height="3" rx="1.2" fill="${C.surface2}"/>
    <rect x="39.4" y="33.6" width="13.4" height="1.2" fill="${C.surface2}"/>
    <text x="40.4" y="34" font-size="1.6" fill="${C.muted}">app.yaml</text>
    <text x="40.4" y="36.9" font-size="1.6"><tspan fill="${C.kw}">db</tspan><tspan fill="${C.text}">:</tspan></text>
    <text x="41.4" y="39.6" font-size="1.6"><tspan fill="${C.kw}">user</tspan><tspan fill="${C.text}">: </tspan><tspan fill="${C.str}">app</tspan></text>
    <text x="40.4" y="43.7" font-size="1.6"><tspan fill="${C.kw}"> pass</tspan><tspan fill="${C.text}">:</tspan></text>

    ${ground(57.2, 49.5, 4.4)}
    ${Kit.person(57.2, 49.6, { k: 0.78, skin: 1, hair: 'bun', hairColor: Kit.HAIR.black, glasses: true, top: '#3A4A6B', topStyle: 'blazer', mood: 'neutral' })}
    <path d="M51.4 45.3L53.8 48.1" stroke="#6B4A2E" stroke-width="1.1" stroke-linecap="round"/>
    <circle cx="49.3" cy="43.2" r="3" fill="${RED}" opacity=".16"/>
    <circle cx="49.3" cy="43.2" r="3" fill="none" stroke="#C3C7CE" stroke-width=".7"/>
    <text x="49.3" y="43.85" font-size="1.85" font-weight="800" fill="${RED}" text-anchor="middle">admin</text>
    <path d="M47.2 41.4Q48.1 40.6 49.3 40.6" fill="none" stroke="#fff" stroke-width=".35" stroke-linecap="round" opacity=".6"/>`,

  // A globe surrounded by greetings; on the phone the German label runs straight out of its button.
  localization: () => `
    ${ground(19.6, 49.3, 5.4)}
    <g transform="translate(19.6 39.8)">
      <circle r="7.4" fill="#2F86C8"/>
      <path d="M-3.4 -6.4C-1.6 -5.2 -2.4 -3.4 -4.2 -3C-5.8 -2.6 -5.2 -0.6 -6.6 0.2C-7.3 -2.8 -5.9 -5.3 -3.4 -6.4ZM0.6 -3.2C2.6 -4.2 4.8 -3 4.4 -0.8C4.1 0.9 5.6 1.4 5.4 3.2C4.6 5.2 2.4 5.6 1.6 3.6C1 2 -0.6 1.8 -0.4 0C-0.2 -1.4 -0.6 -2.6 0.6 -3.2ZM-4.4 2.6C-2.8 2.6 -2.2 4.4 -3.2 5.6C-4.2 5.1 -5.2 4 -5.4 3.2Z" fill="${C.backend}"/>
      <path d="M2.6 -7C5.6 -5.8 7.4 -3 7.4 0C7.4 4.1 4.1 7.4 0 7.4C-2.6 7.4 -4.9 6 -6.2 4C-3.6 5.8 0.2 6 2.8 4.2C5.8 2.2 6.6 -2.4 2.6 -7Z" fill="#000" opacity=".22"/>
      <path d="M-4.6 -4.4Q-2.8 -6.2 -0.4 -6.5" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round" opacity=".45"/>
    </g>
    <g font-size="1.7" font-weight="800">
      <path d="M21.4 30.4H29.4Q30.4 30.4 30.4 31.4V33.6Q30.4 34.6 29.4 34.6H24.8L23.2 36.2L23.4 34.6H21.4Q20.4 34.6 20.4 33.6V31.4Q20.4 30.4 21.4 30.4Z" fill="${C.agent}"/>
      <text x="25.4" y="33.1" fill="${C.code}" text-anchor="middle">Hola</text>
      <path d="M24.8 38.2H33.4Q34.4 38.2 34.4 39.2V41.4Q34.4 42.4 33.4 42.4H24.8Q23.8 42.4 23.8 41.4V40.8L22.6 40.2L23.8 39.8V39.2Q23.8 38.2 24.8 38.2Z" fill="${C.gold}"/>
      <text x="29.1" y="40.9" fill="${C.code}" text-anchor="middle">Cześć</text>
      <path d="M11.6 43.6H17.6Q18.6 43.6 18.6 44.6V46.6Q18.6 47.6 17.6 47.6H11.6Q10.6 47.6 10.6 46.6V44.6Q10.6 43.6 11.6 43.6Z" fill="${C.surface2}" transform="translate(1.6 0)"/>
      <text x="16.2" y="46.2" fill="${C.text}" text-anchor="middle">Hi</text>
    </g>

    ${handset(37, 29.8, 13, 19.8)}
    <text x="39" y="34.4" font-size="1.6" font-weight="700" fill="${C.muted}">de-DE</text>
    <rect x="39" y="35.8" width="7.4" height=".75" rx=".37" fill="${C.text}" opacity=".35"/>
    <rect x="39" y="37.4" width="5" height=".75" rx=".37" fill="${C.text}" opacity=".2"/>
    <rect x="47.4" y="39.4" width="8.2" height="5.8" rx="1" fill="${RED}" opacity=".16"/>
    <text x="39.9" y="42.95" font-size="1.85" font-weight="800" fill="${RED}">Herunterladen</text>
    <rect x="39" y="40.4" width="8.4" height="3.8" rx="1.9" fill="${C.frontend}"/>
    <clipPath id="l10n-btn-${++clipN}"><rect x="39" y="40.4" width="8.4" height="3.8" rx="1.9"/></clipPath>
    <text x="39.9" y="42.95" font-size="1.85" font-weight="800" fill="${C.code}" clip-path="url(#l10n-btn-${clipN})">Herunterladen</text>
    <path d="M47.4 38.6V46" stroke="${RED}" stroke-width=".35" stroke-dasharray=".7 .5"/>
    <g transform="translate(51.6 47.4)"><path d="M-1.4 1.1L0 -1.3L1.4 1.1Z" fill="${RED}" stroke="${RED}" stroke-width=".3" stroke-linejoin="round"/><rect x="-.13" y="-.5" width=".26" height=".9" rx=".1" fill="${C.code}"/><circle cy=".68" r=".15" fill="${C.code}"/></g>`,

  // Cookie banner in the browser, the personal-data export, and a lawyer who finally smiles.
  'gdpr-compliance': () => `
    <rect x="12.9" y="31.3" width="22.6" height="17.4" rx="1.4" fill="#111214"/>
    <rect x="12.4" y="30.8" width="22.6" height="17.4" rx="1.4" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
    <path d="M12.4 32.2Q12.4 30.8 13.8 30.8H33.6Q35 30.8 35 32.2V33.6H12.4Z" fill="${C.surface2}"/>
    <circle cx="14.2" cy="32.2" r=".42" fill="${RED}"/><circle cx="15.5" cy="32.2" r=".42" fill="${C.gold}"/><circle cx="16.8" cy="32.2" r=".42" fill="#5FB865"/>
    <rect x="18.4" y="31.6" width="12" height="1.2" rx=".6" fill="${C.bg}"/>
    <rect x="14" y="35" width="9" height=".9" rx=".45" fill="${C.text}" opacity=".35"/>
    <rect x="14" y="36.6" width="14" height=".9" rx=".45" fill="${C.text}" opacity=".2"/>
    <rect x="13.4" y="38.8" width="20.6" height="8.4" rx="1.1" fill="${C.surface2}"/>
    <g transform="translate(16.6 43)">
      <path d="M0 -2.4A2.4 2.4 0 1 0 2.4 0A1 1 0 0 1 1.1 -1.1A1 1 0 0 1 0 -2.4Z" fill="#C98B4A"/>
      <path d="M1.6 0.9A2.4 2.4 0 0 1 -2.1 1.2A2.4 2.4 0 0 0 2.35 0.3Z" fill="#000" opacity=".2"/>
      <g fill="#6B4320"><circle cx="-0.9" cy="-0.6" r=".38"/><circle cx="0.6" cy="0.6" r=".34"/><circle cx="-0.7" cy="1" r=".3"/></g>
    </g>
    <rect x="20.2" y="40.2" width="12.6" height=".8" rx=".4" fill="${C.text}" opacity=".35"/>
    <rect x="20.2" y="42.6" width="6" height="2.8" rx="1.4" fill="${C.backend}"/>
    <text x="23.2" y="44.5" font-size="1.6" font-weight="800" fill="${C.code}" text-anchor="middle">OK</text>
    <rect x="27.4" y="42.6" width="5.4" height="2.8" rx="1.4" fill="none" stroke="${C.muted}" stroke-width=".3"/>
    <text x="30.1" y="44.5" font-size="1.6" font-weight="700" fill="${C.text}" text-anchor="middle">No</text>

    <path d="M36.2 40.4H37.6" stroke="${C.backend}" stroke-width=".6" stroke-linecap="round"/><polygon points="38.9,40.4 37.2,39.3 37.2,41.5" fill="${C.backend}"/>
    ${doc(39.2, 34.4, 8, 10.6, C.backend)}
    <text x="42.6" y="40.4" font-size="1.8" font-weight="800" fill="${C.code}" text-anchor="middle">{ }</text>
    <rect x="40.4" y="41.6" width="5" height=".7" rx=".35" fill="${C.code}" opacity=".4"/>
    <rect x="40.4" y="43" width="3.4" height=".7" rx=".35" fill="${C.code}" opacity=".4"/>
    <text x="43.6" y="47.6" font-size="1.6" font-weight="700" fill="${C.muted}" text-anchor="middle">me.json</text>
    ${tick(46.8, 34.8, 1.3, C.gold, C.code)}

    ${ground(55.2, 49.5, 5.8)}
    ${Kit.person(55.2, 49.6, { k: 0.95, skin: 4, hair: 'grey', beard: '#C3C7CE', glasses: '#C3C7CE', top: '#3A4A6B', topStyle: 'blazer', mood: 'grin' })}`,

  // The upvote army cheers, one build lifts off, and lands on mobile, desktop and web.
  'product-hunt-launch': () => `
    <rect x="12.6" y="30.8" width="12.6" height="8.6" rx="1.4" fill="${C.goldDark}"/>
    <rect x="12.6" y="30.4" width="12.6" height="8.6" rx="1.4" fill="${C.gold}"/>
    <polygon points="18.9,31.6 21.4,34.6 16.4,34.6" fill="${C.code}"/>
    <text x="18.9" y="37.9" font-size="2.3" font-weight="800" fill="${C.code}" text-anchor="middle">1,024</text>
    ${Kit.person(14.6, 49.6, { k: 0.42, skin: 2, hair: 'curly', hairColor: Kit.HAIR.black, top: C.frontend, mood: 'grin' })}
    ${Kit.person(23.4, 49.6, { k: 0.42, skin: 0, hair: 'long', hairColor: Kit.HAIR.blonde, top: C.backend, mood: 'happy' })}
    ${Kit.person(19, 49.6, { k: 0.48, skin: 4, hair: 'buzz', hairColor: Kit.HAIR.black, top: C.gold, topStyle: 'hoodie', mood: 'grin' })}
    <g fill="${C.gold}"><polygon points="13.4,40.6 14.4,41.8 12.4,41.8"/><polygon points="24.6,40.6 25.6,41.8 23.6,41.8"/><polygon points="19,40 20,41.2 18,41.2"/></g>

    <g fill="${C.surface2}">
      <circle cx="33.6" cy="48.4" r="1.8"/><circle cx="36.6" cy="47.6" r="2.4"/><circle cx="39.6" cy="48.4" r="1.8"/>
    </g>
    <g transform="translate(36.6 0)">
      <path d="M-1.7 42.4L1.7 42.4L0.9 45.6L0 47.6L-0.9 45.6Z" fill="url(#bolt)"/>
      <path d="M-0.8 42.4L0.8 42.4L0 45.2Z" fill="${C.gold}"/>
      <path d="M-2.6 36.8L-5.4 41.8L-5.2 43L-2.8 41.8Z" fill="${Kit.dark(C.agent, 0.15)}"/>
      <path d="M2.6 36.8L5.4 41.8L5.2 43L2.8 41.8Z" fill="${Kit.dark(C.agent, 0.3)}"/>
      <path d="M0 29.8C2.8 31.6 3.4 35.4 3 42H-3C-3.4 35.4 -2.8 31.6 0 29.8Z" fill="#F1F2F4"/>
      <path d="M0 29.8C2.8 31.6 3.4 35.4 3 42H1.4C1.8 36 1.6 32.4 0 29.8Z" fill="#C3C7CE"/>
      <path d="M0 29.8C1.2 30.6 1.9 31.6 2.3 32.8H-2.3C-1.9 31.6 -1.2 30.6 0 29.8Z" fill="${C.agent}"/>
      <circle cy="35.6" r="1.45" fill="${C.frontend}" stroke="#7A7E85" stroke-width=".45"/>
      <path d="M-0.7 35.1Q-0.3 34.6 0.3 34.6" fill="none" stroke="#fff" stroke-width=".3" stroke-linecap="round" opacity=".8"/>
      <rect x="-1" y="40.2" width="2" height="2.6" rx=".4" fill="${Kit.dark(C.agent, 0.15)}"/>
    </g>
    <g stroke="${C.muted}" stroke-width=".35" stroke-linecap="round" stroke-dasharray=".8 .7" fill="none">
      <path d="M40.6 34.4Q44 32.2 47.4 32.6"/><path d="M40.8 38.6H47.4"/><path d="M40.6 42.8Q44 45 47.4 44.6"/>
    </g>
    <g transform="translate(49.2 0)">
      <rect x="0" y="30" width="3.2" height="5.2" rx=".7" fill="${C.frontend}"/><rect x=".45" y="30.75" width="2.3" height="3.4" rx=".3" fill="${C.code}"/>
      <rect x="-.3" y="36.4" width="4.4" height="3" rx=".45" fill="${C.backend}"/><rect x=".15" y="36.85" width="3.5" height="2.1" rx=".2" fill="${C.code}"/><rect x="-.8" y="39.4" width="5.4" height=".6" rx=".3" fill="${Kit.dark(C.backend, 0.2)}"/>
      <circle cx="1.6" cy="44.2" r="2" fill="${C.agent}"/><ellipse cx="1.6" cy="44.2" rx=".85" ry="2" fill="none" stroke="${C.code}" stroke-width=".3"/><path d="M-.4 44.2H3.6" stroke="${C.code}" stroke-width=".3"/>
    </g>
    <g font-size="1.6" fill="${C.text}">
      <text x="53.8" y="33.2">mobile</text><text x="53.8" y="38.8">desktop</text><text x="53.8" y="44.8">web</text>
    </g>`,

  // KDoc on the left, an agent writing it, the published docs page on the right.
  'dokka-docs': () => `
    <rect x="12.9" y="31.3" width="17.6" height="17" rx="1.2" fill="#111214"/>
    <rect x="12.4" y="30.8" width="17.6" height="17" rx="1.2" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
    <g font-size="1.6" font-style="italic" fill="${C.str}">
      <text x="13.4" y="33.8">/**</text>
      <text x="13.4" y="36.4"> * Loads a</text>
      <text x="13.4" y="39"> * <tspan fill="${C.kw}">@param</tspan> id</text>
      <text x="13.4" y="41.6"> */</text>
    </g>
    <text x="13.4" y="44.8" font-size="1.6"><tspan fill="${C.kw}">fun</tspan><tspan fill="${C.fn}"> load</tspan><tspan fill="${C.text}">(id)</tspan></text>
    <rect x="23.4" y="34.9" width=".35" height="1.9" fill="${C.text}"/>

    <path d="M31.4 32.6Q36 30.4 40.6 32.6" fill="none" stroke="${C.frontend}" stroke-width=".55" stroke-linecap="round" stroke-dasharray="1 .7"/>
    <polygon points="41.6,33.2 39.4,33.4 40.4,31.6" fill="${C.frontend}"/>
    ${ground(36, 49.5, 4)}
    ${Kit.robot(36, 49.6, { body: true, expression: 'happy', arms: 'wave', k: 0.8 })}
    <g transform="translate(40.6 41.6) rotate(35)">
      <rect x="-.45" y="-3.4" width=".9" height="3.4" rx=".3" fill="${C.gold}"/><path d="M-.45 0L.45 0L0 .9Z" fill="${C.text}"/>
    </g>

    <rect x="42.9" y="31.3" width="18" height="17" rx="1.2" fill="#111214"/>
    <rect x="42.4" y="30.8" width="18" height="17" rx="1.2" fill="#F1F2F4"/>
    <path d="M42.4 32Q42.4 30.8 43.6 30.8H59.2Q60.4 30.8 60.4 32V33.8H42.4Z" fill="${TYPES.feature.color}"/>
    <text x="43.4" y="32.95" font-size="1.6" font-weight="800" fill="#fff">docs</text>
    <path d="M42.4 33.8H46.6V47.8H43.6Q42.4 47.8 42.4 46.6Z" fill="#DCDDE2"/>
    <g fill="#9DA0A8"><rect x="43.1" y="35.2" width="2.8" height=".7" rx=".35"/><rect x="43.1" y="36.8" width="2.2" height=".7" rx=".35"/><rect x="43.1" y="38.4" width="2.8" height=".7" rx=".35"/></g>
    <rect x="43.1" y="40" width="2.8" height=".7" rx=".35" fill="${TYPES.feature.color}"/>
    <text x="47.4" y="36.6" font-size="1.8" font-weight="800" fill="#1E1F22">load</text>
    <rect x="47.4" y="38" width="11.8" height=".7" rx=".35" fill="#7A7E85"/>
    <rect x="47.4" y="39.4" width="8.6" height=".7" rx=".35" fill="#7A7E85"/>
    <rect x="47.4" y="41.2" width="11.8" height="2.6" rx=".5" fill="#E2E4EA"/>
    <text x="48" y="43" font-size="1.6"><tspan fill="#B4602D">fun</tspan><tspan fill="#2F6FD6"> load</tspan><tspan fill="#1E1F22">(id)</tspan></text>
    <rect x="47.4" y="45" width="10.2" height=".7" rx=".35" fill="#7A7E85"/>`,

  // The same Compose list on a phone and on a round watch, where the rows scale towards the edge.
  'wear-os-app': () => `
    ${handset(14.6, 30.2, 11.4, 18.8)}
    <rect x="16.4" y="33" width="7.8" height="2.4" rx="1.2" fill="${C.frontend}"/>
    <rect x="16.4" y="36.4" width="7.8" height="2.4" rx="1.2" fill="${C.frontend}" opacity=".7"/>
    <rect x="16.4" y="39.8" width="7.8" height="2.4" rx="1.2" fill="${C.frontend}" opacity=".45"/>
    <rect x="16.4" y="43.2" width="5" height="1.6" rx=".8" fill="${C.frontend}" opacity=".25"/>
    <rect x="17.2" y="33.85" width="4.4" height=".7" rx=".35" fill="${C.code}" opacity=".6"/>

    <path d="M28.4 39.6H37.2" stroke="${C.frontend}" stroke-width=".55" stroke-linecap="round" stroke-dasharray="1 .7"/>
    <polygon points="38.4,39.6 36.4,38.4 36.4,40.8" fill="${C.frontend}"/>
    <rect x="28.4" y="35.4" width="8.6" height="2.8" rx="1.4" fill="${C.surface2}"/>
    <text x="32.7" y="37.35" font-size="1.6" font-weight="800" fill="${C.text}" text-anchor="middle">same UI</text>

    <g transform="translate(49.4 39.6)">
      <path d="M-4 -10.2Q-4 -10.8 -3.4 -10.8H3.4Q4 -10.8 4 -10.2V-5H-4Z" fill="#555963"/><path d="M-4 10.2Q-4 10.8 -3.4 10.8H3.4Q4 10.8 4 10.2V5H-4Z" fill="#555963"/>
      <path d="M1.6 -10.8H3.4Q4 -10.8 4 -10.2V-5H1.6ZM1.6 10.8H3.4Q4 10.8 4 10.2V5H1.6Z" fill="#000" opacity=".22"/>
      <g fill="${C.code}" opacity=".6"><circle cy="-9.4" r=".3"/><circle cy="9.4" r=".3"/></g>
      <rect x="7.5" y="-1.8" width="1.6" height="3.6" rx=".7" fill="${Kit.dark(C.frontend, 0.3)}"/>
      <circle cx=".4" cy=".4" r="8" fill="${Kit.dark(C.frontend, 0.38)}"/>
      <circle r="8" fill="${C.frontend}"/>
      <path d="M-5.4 -5.8A8 8 0 0 1 2.2 -7.7" fill="none" stroke="${Kit.light(C.frontend, 0.45)}" stroke-width=".4" stroke-linecap="round" opacity=".8"/>
      <circle r="6.8" fill="${C.code}"/>
      <text y="-2.9" font-size="2.3" font-weight="800" fill="#fff" text-anchor="middle">10:09</text>
      <rect x="-4.8" y="-1.2" width="9.6" height="2.4" rx="1.2" fill="${C.frontend}"/>
      <rect x="-3.8" y="-.35" width="5" height=".7" rx=".35" fill="${C.code}" opacity=".6"/>
      <rect x="-3.9" y="1.8" width="7.8" height="2" rx="1" fill="${C.frontend}" opacity=".6"/>
      <rect x="-2.5" y="4.4" width="5" height="1.3" rx=".65" fill="${C.frontend}" opacity=".3"/>
    </g>`,
});

CARDS.push(
  {
    id: 'accessibility', name: 'Accessibility', type: 'feature', sprint: 3, copies: [3], points: 5,
    cost: ['frontend', 'frontend', 'agent'], freeWith: 'Dark Mode', file: 'A11y.kt',
    effects: free('feature', 'Dark Mode', 1),
    code: [[C.fn, 'Icon'], [C.text, '(cart, contentDescription = '], [C.str, '"Buy"'], [C.text, ')']],
    comment: 'an agent audits every single screen',
  },
  {
    id: 'home-widgets', name: 'Home Screen Widgets', type: 'feature', sprint: 3, copies: [4], points: 5,
    cost: ['frontend', 'frontend', 'frontend'], freeWith: 'SQLDelight', file: 'Widget.kt',
    effects: free('library', 'SQLDelight', 2),
    code: [[C.kw, 'class'], [C.text, ' TasksWidget : '], [C.cls, 'GlanceAppWidget'], [C.text, '()']],
    comment: 'glanceable without opening the app',
  },
  {
    id: 'security-audit', name: 'Security Audit', type: 'feature', sprint: 3, copies: [4], points: 5,
    cost: ['backend', 'backend', 'agent'], freeWith: 'Health-check Endpoint', file: 'Audit.kt',
    effects: free('feature', 'Health-check Endpoint', 1),
    code: [[C.text, 'routes.'], [C.fn, 'forEach'], [C.text, ' { agent.'], [C.fn, 'fuzz'], [C.text, '(it) }']],
    comment: 'password still in application.yaml',
  },
  {
    id: 'localization', name: 'Localization', type: 'feature', sprint: 3, copies: [4], points: 4,
    cost: ['frontend', 'agent'], freeWith: 'Compose Multiplatform', file: 'Strings.kt',
    effects: free('library', 'Compose Multiplatform', 1),
    code: [[C.fn, 'Text'], [C.text, '('], [C.fn, 'stringResource'], [C.text, '(Res.string.buy))']],
    comment: '30 languages; German still overflows',
  },
  {
    id: 'gdpr-compliance', name: 'GDPR Compliance', type: 'feature', sprint: 3, copies: [5], points: 5,
    cost: ['backend', 'backend', 'frontend'], freeWith: 'Login Screen', file: 'Privacy.kt',
    effects: free('feature', 'Login Screen', 1),
    code: [[C.fn, 'get'], [C.text, '('], [C.str, '"/me/export"'], [C.text, ') { call.'], [C.fn, 'respond'], [C.text, '(me) }']],
    comment: 'a cookie banner and a smiling lawyer',
  },
  {
    id: 'product-hunt-launch', name: 'Product Hunt Launch', type: 'feature', sprint: 3, copies: [5], points: 5,
    cost: ['frontend', 'backend', 'agent'], freeWith: 'Amper', file: 'Launch.kt',
    effects: free('library', 'Amper', 2),
    code: [[C.fn, 'repeat'], [C.text, '('], [C.fn, '1_000'], [C.text, ') { '], [C.fn, 'launch'], [C.text, ' { '], [C.fn, 'upvote'], [C.text, '() } }']],
    comment: 'one build, every platform, upvote army',
  },
  {
    id: 'dokka-docs', name: 'Dokka Docs', type: 'feature', sprint: 3, copies: [5], points: 5,
    cost: ['backend', 'frontend', 'agent'], freeWith: 'Amper', file: 'Docs.kt',
    effects: free('library', 'Amper', 2),
    code: [[C.str, '/** Returns the user with this [id]. */']],
    comment: 'KDoc everywhere, mostly by agents',
  },
  {
    id: 'wear-os-app', name: 'Wear OS App', type: 'feature', sprint: 3, copies: [5], points: 5,
    cost: ['frontend', 'frontend', 'backend'], freeWith: 'Koin', file: 'Watch.kt',
    effects: free('library', 'Koin', 1),
    code: [[C.fn, 'ScalingLazyColumn'], [C.text, ' { '], [C.fn, 'item'], [C.text, ' { '], [C.fn, 'Chip'], [C.text, '() } }']],
    comment: 'your app on a 1.4-inch screen',
  },
);
})();
