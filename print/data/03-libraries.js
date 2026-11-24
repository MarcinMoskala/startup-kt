// Libraries: Compose Multiplatform, kotlinx.coroutines, kotlinx.serialization, Exposed, Koin,
// SQLDelight, Koog, Kotlin/Wasm, Amper.
// Libraries are abstract, so every card is one physical metaphor: a stamp, a spool of thread, a press,
// a puzzle piece, a syringe, a prize rosette, a toolbox, a rocket, a sticky note.
(() => {
const D = (c, t = 0.22) => Kit.dark(c, t);
const L = (c, t = 0.3) => Kit.light(c, t);
const PAPER = '#ECEEF2', INK = '#2B2D30';
const shadow = (cx, cy, rx, ry = 0.5) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity=".28"/>`;
// Same mini UI (avatar + two lines + button) drawn on any screen.
const miniUi = (x, y, w, h, c = C.frontend) => {
  const p = Math.min(w, h) * 0.12, r = Math.min(w, h) * 0.13;
  const bx = x + p + 2 * r + p * 0.8, bw = w - (bx - x) - p;
  return `<circle cx="${x + p + r}" cy="${y + p + r}" r="${r}" fill="${C.gold}"/>
    <rect x="${bx}" y="${y + p + r * 0.35}" width="${bw}" height="${r * 0.6}" rx="${r * 0.3}" fill="${c}" opacity=".75"/>
    <rect x="${bx}" y="${y + p + r * 1.15}" width="${bw * 0.65}" height="${r * 0.5}" rx="${r * 0.25}" fill="${c}" opacity=".4"/>
    <rect x="${x + p}" y="${y + h - p - r * 1.1}" width="${w - 2 * p}" height="${r * 1.1}" rx="${r * 0.55}" fill="${c}"/>`;
};
const t = (x, y, parts, size = 1.7, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" xml:space="preserve" ${extra}>${parts.map(([c, s]) => `<tspan fill="${c}">${esc(s)}</tspan>`).join('')}</text>`;
const check = (cx, cy, r = 1.6) => `<circle cx="${cx}" cy="${cy + r * 0.12}" r="${r}" fill="${D(C.backend, 0.35)}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.backend}"/>
    <path d="M${cx - r * 0.5} ${cy} l${r * 0.35} ${r * 0.38} l${r * 0.65} ${-r * 0.75}" fill="none" stroke="${C.bg}" stroke-width="${r * 0.3}" stroke-linecap="round" stroke-linejoin="round"/>`;
const head = (x, y, c) => `<polygon points="${x},${y} ${x - 1.9},${y - 1.2} ${x - 1.9},${y + 1.2}" fill="${c}"/>`;

Object.assign(ART, {
  // A rubber stamp with @Composable on it: one press, the same UI on phone, desktop and browser.
  'compose-multiplatform': () => {
    const fe = C.frontend, fd = D(fe, 0.3);
    return `
    ${shadow(36.5, 48.6, 22, 0.45)}
    <!-- phone -->
    <rect x="14.5" y="37.9" width="8" height="10.8" rx="1.4" fill="${fd}"/>
    <rect x="14" y="37.4" width="8" height="10.8" rx="1.4" fill="${fe}"/>
    <rect x="14.8" y="38.6" width="6.4" height="8.1" rx=".4" fill="${C.bg}"/>
    ${miniUi(14.8, 38.6, 6.4, 8.1)}
    <circle cx="18" cy="47.45" r=".4" fill="${C.bg}"/>
    <!-- desktop -->
    <rect x="34.9" y="46.2" width="3.2" height="1.4" fill="${fd}"/>
    <rect x="31.2" y="47.4" width="10.6" height="1.1" rx=".55" fill="${fd}"/>
    <rect x="26.3" y="38.9" width="21" height="7.8" rx="1.2" fill="${fd}"/>
    <rect x="25.8" y="38.4" width="21" height="7.8" rx="1.2" fill="${fe}"/>
    <rect x="26.6" y="39.2" width="19.4" height="6.2" rx=".4" fill="${C.bg}"/>
    ${miniUi(26.6, 39.2, 19.4, 6.2)}
    <!-- browser -->
    <rect x="50.6" y="38.9" width="10.6" height="9.6" rx="1.2" fill="${fd}"/>
    <rect x="50.1" y="38.4" width="10.6" height="9.6" rx="1.2" fill="${fe}"/>
    <circle cx="51.3" cy="39.45" r=".32" fill="${C.bg}"/><circle cx="52.3" cy="39.45" r=".32" fill="${C.bg}"/><circle cx="53.3" cy="39.45" r=".32" fill="${C.bg}"/>
    <rect x="50.8" y="40.3" width="9.2" height="7" rx=".4" fill="${C.bg}"/>
    ${miniUi(50.8, 40.3, 9.2, 7)}
    <!-- stamp motion: ink trails to the side screens, impact ticks on the middle one -->
    <path d="M28.6 35.6 Q21.6 35.6 18.4 37" fill="none" stroke="${C.muted}" stroke-width=".35" stroke-dasharray=".8 .6"/>
    <path d="M44.4 35.6 Q51.6 35.6 55 38" fill="none" stroke="${C.muted}" stroke-width=".35" stroke-dasharray=".8 .6"/>
    ${[[30.4, -1], [36.5, 0], [42.6, 1]].map(([x, s]) => `<line x1="${x}" y1="37.3" x2="${x + s * 0.5}" y2="37.9" stroke="${C.gold}" stroke-width=".4" stroke-linecap="round"/>`).join('')}
    <!-- the stamp -->
    <path d="M35.4 33 H37.6 L38.6 34.6 H34.4 Z" fill="${C.goldDark}"/>
    <circle cx="36.5" cy="32.3" r="1.75" fill="${C.goldDark}"/>
    <circle cx="36.3" cy="32.1" r="1.6" fill="${C.gold}"/>
    <circle cx="35.75" cy="31.55" r=".45" fill="#fff" opacity=".55"/>
    <rect x="28.6" y="34.4" width="15.8" height="2.4" rx=".7" fill="url(#bolt)"/>
    <rect x="28.6" y="34.4" width="15.8" height=".55" rx=".27" fill="#fff" opacity=".25"/>
    <rect x="29.1" y="36.6" width="14.8" height=".6" rx=".2" fill="${D('#7F52FF', 0.45)}"/>
    <text x="36.5" y="36.25" font-size="1.75" font-weight="800" fill="#fff" text-anchor="middle">@Composable</text>`;
  },

  // One thread (a spool), a hundred thousand tiny coroutines riding it; the gold ones are suspended.
  'kotlinx-coroutines': () => {
    const y = x => 39.2 - 4.6 * Math.sin((x - 21) * 2 * Math.PI / 26);
    const pts = []; for (let x = 21; x <= 60.4; x += 0.5) pts.push(`${x.toFixed(1)},${y(x).toFixed(2)}`);
    const shades = [C.backend, '#4DB57A', '#6FD89A', '#3E9E68'];
    const beads = []; let i = 0;
    for (let x = 24.6; x < 59.5; x += 2.45, i++) {
      const yy = y(x), dy = y(x + 0.3) - y(x - 0.3), a = Math.atan2(dy, 0.6) * 180 / Math.PI;
      const susp = i % 5 === 3;
      const c = susp ? C.gold : shades[i % 4];
      beads.push(`<g transform="translate(${x.toFixed(2)} ${yy.toFixed(2)}) rotate(${a.toFixed(1)})">
        <rect x="-.95" y="-.9" width="1.9" height="2" rx=".9" fill="${D(c, 0.3)}"/>
        <rect x="-.95" y="-1.05" width="1.9" height="1.9" rx=".9" fill="${c}"/>
        <rect x="-.55" y="-.8" width=".8" height=".35" rx=".17" fill="#fff" opacity=".45"/>
        ${susp ? `<rect x="-.45" y="-.6" width=".28" height="1.1" fill="${C.bg}"/><rect x=".17" y="-.6" width=".28" height="1.1" fill="${C.bg}"/>` : ''}</g>`);
    }
    const spool = `
      ${shadow(17, 48.4, 5.6, 0.45)}
      <rect x="13.4" y="32.4" width="7.2" height="14.4" fill="${C.backend}"/>
      <rect x="18.6" y="32.4" width="2" height="14.4" fill="${D(C.backend, 0.25)}"/>
      ${Array.from({ length: 13 }, (_, k) => `<line x1="13.4" y1="${33.4 + k * 1.05}" x2="20.6" y2="${33.8 + k * 1.05}" stroke="${D(C.backend, 0.35)}" stroke-width=".22"/>`).join('')}
      <rect x="14.2" y="32.4" width=".7" height="14.4" fill="#fff" opacity=".18"/>
      ${[30.9, 46.6].map(yy => `<rect x="12.2" y="${yy}" width="9.6" height="1.7" rx=".7" fill="${C.kw}"/><rect x="12.2" y="${yy + 1.1}" width="9.6" height=".6" rx=".3" fill="${D(C.kw, 0.3)}"/>`).join('')}
`;
    return `${spool}
    <polyline points="20.4,39.2 ${pts.join(' ')}" fill="none" stroke="${C.backend}" stroke-width=".4" stroke-linecap="round"/>
    <rect x="23.4" y="44.6" width="10.6" height="3.4" rx="1.7" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
    ${t(28.7, 46.85, [[C.muted, '1 thread']], 1.6, 'text-anchor="middle" font-weight="700"')}
    ${beads.join('')}
    <rect x="45.2" y="44.4" width="15.4" height="3.8" rx="1.9" fill="url(#bolt)"/>
    <text x="52.9" y="46.95" font-size="1.9" font-weight="800" fill="#fff" text-anchor="middle">×100_000</text>`;
  },

  // A Kotlin object (a solid box) goes through the press and comes out as a flat JSON sheet; and back.
  'kotlinx-serialization': () => {
    const pk = C.cls;
    return `
    ${shadow(18.6, 47.2, 5.4, 0.5)}
    <polygon points="18.6,31.4 24,34.1 18.6,36.8 13.2,34.1" fill="${L(pk, 0.3)}"/>
    <polygon points="13.2,34.1 18.6,36.8 18.6,46.9 13.2,44.2" fill="${pk}"/>
    <polygon points="18.6,36.8 24,34.1 24,44.2 18.6,46.9" fill="${D(pk, 0.3)}"/>
    <path d="M13.2 34.1 L18.6 36.8 L24 34.1" fill="none" stroke="#fff" stroke-width=".3" opacity=".35" stroke-linejoin="round"/>
    <g transform="translate(15.9 42.8) skewY(26.57)"><text x="0" y="0" font-size="1.9" font-weight="800" fill="#fff" text-anchor="middle">User</text></g>
    <!-- the press: two rollers with a crank -->
    <line x1="30.4" y1="37.6" x2="33" y2="33.4" stroke="${C.muted}" stroke-width=".55" stroke-linecap="round"/>
    <rect x="32.4" y="31.6" width="1.2" height="2.2" rx=".6" fill="${C.gold}"/>
    <line x1="25" y1="40.1" x2="27.1" y2="40.1" stroke="${pk}" stroke-width=".7" stroke-linecap="round"/>
    ${head(28.1, 40.1, pk)}
    ${[37.8, 42.4].map(cy => `<circle cx="30.6" cy="${cy}" r="2.3" fill="${D(C.surface2, 0.15)}"/><circle cx="30.4" cy="${cy - 0.15}" r="2.15" fill="${C.surface2}" stroke="${C.muted}" stroke-width=".3"/>
      <path d="M28.9 ${cy - 1.1} a1.7 1.7 0 0 1 1.9 -.9" fill="none" stroke="#fff" stroke-width=".35" opacity=".35" stroke-linecap="round"/>
      <circle cx="30.4" cy="${cy - 0.15}" r=".55" fill="${C.muted}"/>`).join('')}
    <rect x="32.4" y="39.6" width="3.4" height=".9" fill="${PAPER}" opacity=".85"/>
    <!-- the JSON sheet -->
    <rect x="35.9" y="31.6" width="24" height="15.6" rx=".9" fill="#000" opacity=".3" transform="translate(.5 .5)"/>
    <path d="M35.4 32.4 a.9 .9 0 0 1 .9 -.9 H56.4 L59.4 34.5 V45.9 a.9 .9 0 0 1 -.9 .9 H36.3 a.9 .9 0 0 1 -.9 -.9 Z" fill="${PAPER}"/>
    <path d="M56.4 31.5 V33.6 a.9 .9 0 0 0 .9 .9 H59.4 Z" fill="#C5C9D2"/>
    ${t(37, 35, [[INK, '{']], 1.9, 'font-weight="700"')}
    ${t(37, 38.3, [[C.cls, ' "id"'], [INK, ': '], ['#2F7FD0', '42'], [INK, ',']], 1.8, 'font-weight="700"')}
    ${t(37, 41.6, [[C.cls, ' "name"'], [INK, ': '], ['#3F8A4B', '"Ada"']], 1.8, 'font-weight="700"')}
    ${t(37, 44.9, [[INK, '}']], 1.9, 'font-weight="700"')}
    ${check(57, 44.4, 1.5)}
    <!-- and back again -->
    <path d="M38.5 48.6 Q31 50.2 25 47.6" fill="none" stroke="${C.backend}" stroke-width=".55" stroke-linecap="round"/>
    <polygon points="23.8,46.9 26.2,46.9 25.1,48.6" fill="${C.backend}" transform="rotate(-20 25 47.6)"/>`;
  },

  // A typed puzzle piece clicks into the database; tidy typed rows come out.
  exposed: () => {
    const g = C.backend, gd = D(g, 0.3);
    const piece = (x, y, c) => `<path d="M${x} ${y} h9 v3.1 a1.6 1.6 0 1 1 0 3.2 v3.1 h-9 Z" fill="${c}"/>`;
    const rows = [['1', 'Ada', 1], ['2', 'Bob', 3], ['3', 'Cy', 0]];
    return `
    ${shadow(36.5, 48.5, 24, 0.45)}
    <!-- puzzle piece: Users table -->
    <g transform="translate(.5 .5)">${piece(12.6, 34.9, D(C.frontend, 0.4))}</g>
    ${piece(12.6, 34.9, C.frontend)}
    <rect x="13.2" y="35.4" width="7.6" height=".5" rx=".25" fill="#fff" opacity=".3"/>
    <text x="17.1" y="40.15" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">Users</text>
    ${[[24.2, 36.2, 25.4, 35.2], [24.6, 39.6, 26, 39.6], [24.2, 43, 25.4, 44]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${C.gold}" stroke-width=".35" stroke-linecap="round"/>`).join('')}
    <!-- database drum with the matching socket -->
    <rect x="27.4" y="33.3" width="12.6" height="12.6" fill="${g}"/>
    <rect x="36.2" y="33.3" width="3.8" height="12.6" fill="${gd}"/>
    <ellipse cx="33.7" cy="45.9" rx="6.3" ry="1.9" fill="${gd}"/>
    ${[37.4, 41.6].map(yy => `<path d="M27.4 ${yy} a6.3 1.9 0 0 0 12.6 0" fill="none" stroke="${C.bg}" stroke-width=".4" opacity=".5"/>`).join('')}
    <ellipse cx="33.7" cy="33.3" rx="6.3" ry="1.9" fill="${L(g, 0.35)}"/>
    <ellipse cx="33.7" cy="33.3" rx="4" ry="1" fill="${L(g, 0.55)}" opacity=".6"/>
    <circle cx="28.2" cy="39.6" r="1.7" fill="${C.bg}"/>
    <rect x="28.5" y="35.4" width=".6" height="9.2" rx=".3" fill="#fff" opacity=".2"/>
    <!-- rows out -->
    <line x1="41" y1="39.6" x2="43.6" y2="39.6" stroke="${g}" stroke-width=".6" stroke-linecap="round"/>${head(45, 39.6, g)}
    ${rows.map(([id, n, s], i) => {
      const yy = 32.2 + i * 5.3;
      return `<rect x="46.6" y="${yy + 0.45}" width="14" height="4.2" rx="1" fill="#000" opacity=".3"/>
      <rect x="46.2" y="${yy}" width="14" height="4.2" rx="1" fill="${C.bg}" stroke="${g}" stroke-width=".35"/>
      <circle cx="48.4" cy="${yy + 2.1}" r="1.15" fill="${Kit.SKIN[s]}"/>
      ${t(50.2, yy + 2.75, [[C.fn, id], [C.text, ' '], [C.str, `"${n}"`]], 1.7)}`;
    }).join('')}`;
  },

  // Dependency injection, literally: a syringe full of dependencies, get() pushes them into the ViewModel.
  koin: () => {
    const fe = C.frontend;
    return `
    ${shadow(36.5, 48.3, 23, 0.45)}
    <!-- plunger -->
    <rect x="12.4" y="34.2" width="1.6" height="10.6" rx=".6" fill="${C.muted}"/>
    <rect x="12.4" y="34.2" width=".6" height="10.6" rx=".3" fill="#fff" opacity=".25"/>
    <rect x="14" y="38.8" width="5.4" height="1.4" fill="${C.faint}"/>
    ${t(16.6, 37.4, [[C.fn, 'get()']], 1.7, 'text-anchor="middle" font-weight="700"')}
    <rect x="19.4" y="33.2" width="1.3" height="12.6" rx=".5" fill="${C.muted}"/>
    <!-- barrel -->
    <rect x="20.7" y="34.6" width="21.4" height="9.8" rx="1.3" fill="${C.surface2}"/>
    <rect x="22.8" y="35.4" width="18.6" height="8.2" rx=".8" fill="${fe}" opacity=".35"/>
    <rect x="21.2" y="35" width="1.6" height="9" rx=".4" fill="${C.faint}"/>
    ${[['Api', 25.2, 36.6, C.backend], ['Db', 30.4, 40.2, C.gold], ['Log', 35.6, 36.8, C.cls]].map(([n, x, y, c]) =>
      `<rect x="${x}" y="${y + 0.3}" width="5" height="2.8" rx="1.1" fill="${D(c, 0.35)}"/><rect x="${x}" y="${y}" width="5" height="2.8" rx="1.1" fill="${c}"/>
       <text x="${x + 2.5}" y="${y + 1.95}" font-size="1.6" font-weight="800" fill="${C.bg}" text-anchor="middle">${n}</text>`).join('')}
    ${[26, 30, 34, 38].map(x => `<line x1="${x}" y1="34.6" x2="${x}" y2="35.6" stroke="${C.text}" stroke-width=".25" opacity=".6"/>`).join('')}
    <rect x="20.7" y="34.6" width="21.4" height="9.8" rx="1.3" fill="none" stroke="${C.text}" stroke-width=".35" opacity=".7"/>
    <rect x="23.2" y="35.2" width="17" height=".6" rx=".3" fill="#fff" opacity=".35"/>
    <polygon points="42.1,37.4 44.6,38.9 44.6,40.1 42.1,41.6" fill="${C.muted}"/>
    <line x1="44.6" y1="39.5" x2="50.6" y2="39.5" stroke="${C.text}" stroke-width=".35"/>
    <!-- the ViewModel being injected -->
    <rect x="49.4" y="34.1" width="11.6" height="11.6" rx="1.6" fill="${D(fe, 0.35)}"/>
    <rect x="48.9" y="33.6" width="11.6" height="11.2" rx="1.6" fill="${fe}"/>
    <rect x="49.5" y="34.1" width="10.4" height=".6" rx=".3" fill="#fff" opacity=".3"/>
    <text x="54.7" y="38.3" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">View</text>
    <text x="54.7" y="40.6" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">Model</text>
    ${check(57.8, 43.6, 1.3)}
    ${[[46.6, 33.2, 47.6, 32.2], [46.2, 45.8, 47.2, 46.8]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${C.gold}" stroke-width=".35" stroke-linecap="round"/>`).join('')}`;
  },

  // The compiler as the strict teacher: your .sq file comes back with every line ticked and an A+.
  sqldelight: () => {
    const lines = [[[C.fn, 'selectAll:']], [['#B0603A', 'SELECT '], [INK, '*']], [['#B0603A', 'FROM '], [INK, 'note']], [['#B0603A', 'WHERE '], [INK, 'done']]];
    const zig = Array.from({ length: 24 }, (_, i) => { const a = i * Math.PI / 12, r = i % 2 ? 6.1 : 6.8; return `${(46.6 + r * Math.sin(a)).toFixed(2)},${(38.6 - r * Math.cos(a)).toFixed(2)}`; }).join(' ');
    return `
    ${shadow(24, 48.6, 12, 0.4)}
    <!-- the .sq sheet -->
    <g transform="rotate(-3 24 40)">
      <rect x="13.9" y="31.3" width="21" height="16.6" rx=".9" fill="#000" opacity=".3"/>
      <rect x="13.4" y="30.8" width="21" height="16.6" rx=".9" fill="${PAPER}"/>
      <rect x="13.4" y="30.8" width="21" height="2.9" rx=".9" fill="#C5C9D2"/>
      ${t(14.8, 32.8, [['#5A5E66', 'Note.sq']], 1.6, 'font-weight="700"')}
      ${lines.map((p, i) => t(14.8, 36.4 + i * 3, p, 1.7, 'font-weight="700"') +
        `<path d="M${31.3} ${35.8 + i * 3} l.5 .55 l1 -1.1" fill="none" stroke="#2E9E5B" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
    </g>
    <!-- prize rosette -->
    <g transform="translate(2.6 -1)">
    <polygon points="43.2,43 41.4,49 43.6,47.9 45,49.6 46.2,43.6" fill="${D(C.backend, 0.15)}"/>
    <polygon points="50,43 51.8,49 49.6,47.9 48.2,49.6 47,43.6" fill="${D(C.backend, 0.3)}"/>
    <polygon points="${zig}" fill="${C.goldDark}" transform="translate(.4 .5)"/>
    <polygon points="${zig}" fill="${C.gold}"/>
    <circle cx="46.6" cy="38.6" r="4.6" fill="none" stroke="${C.goldDark}" stroke-width=".35" stroke-dasharray=".6 .45"/>
    <text x="46.6" y="40.1" font-size="4" font-weight="800" fill="${INK}" text-anchor="middle">A+</text>
    <path d="M43.4 35.4 a4 4 0 0 1 3.4 -1.4" fill="none" stroke="#fff" stroke-width=".4" opacity=".5" stroke-linecap="round"/>
    </g>
    <!-- sparkles -->
    ${[[40.2, 33.2, 1], [57.6, 32.4, 1.25], [58.6, 44.2, 0.9]].map(([x, y, s]) =>
      `<path d="M${x} ${y - 1.2 * s} Q${x} ${y} ${x + 1.2 * s} ${y} Q${x} ${y} ${x} ${y + 1.2 * s} Q${x} ${y} ${x - 1.2 * s} ${y} Q${x} ${y} ${x} ${y - 1.2 * s} Z" fill="${C.gold}"/>`).join('')}`;
  },

  // An agent with a toolbox: search, runSql, sendMail are real tools it picks up, not chat.
  koog: () => {
    const box = C.kw, bd = D(box, 0.3);
    return `
    <g transform="translate(2.6 0)">${Kit.robot(21, 48.4, { body: true, arms: 'wave', expression: 'focus', k: 1.05 })}
    <!-- wrench in the raised hand -->
    <g transform="rotate(30 27 39)">
      <rect x="26.45" y="36.6" width="1.1" height="5.4" rx=".45" fill="${C.muted}"/>
      <circle cx="27" cy="36.3" r="1.3" fill="${C.muted}"/><rect x="26.55" y="34.8" width=".9" height="1.6" fill="${C.surface}"/>
    </g>
    </g><g transform="translate(-1.2 0)">${shadow(49, 48.5, 11, 0.45)}
    <!-- tools sticking out of the box -->
    <rect x="40.6" y="34.2" width="7" height="5" rx=".5" fill="${PAPER}" transform="rotate(-12 44 37)"/>
    <path d="M40.6 34.2 L44.1 37 L47.6 34.2" fill="none" stroke="#9AA0AA" stroke-width=".35" transform="rotate(-12 44 37)"/>
    <g>
      <rect x="49.4" y="36.6" width="4.4" height="5" fill="${C.backend}"/>
      <ellipse cx="51.6" cy="41.6" rx="2.2" ry=".7" fill="${D(C.backend, 0.3)}"/>
      <ellipse cx="51.6" cy="36.6" rx="2.2" ry=".7" fill="${L(C.backend, 0.35)}"/>
    </g>
    <g transform="rotate(25 57 36)">
      <rect x="56.5" y="36.8" width="1" height="4.6" rx=".4" fill="${C.goldDark}"/>
      <circle cx="57" cy="35.2" r="2" fill="${C.bg}" stroke="${C.gold}" stroke-width=".7"/>
      <path d="M55.9 34.6 a1.2 1.2 0 0 1 1 -.8" fill="none" stroke="#fff" stroke-width=".3" opacity=".6"/>
    </g>
    <!-- the box -->
    <path d="M44.6 41.3 v-1.4 a1 1 0 0 1 1 -1 h6.8 a1 1 0 0 1 1 1 v1.4" fill="none" stroke="${bd}" stroke-width=".8"/>
    <rect x="38.6" y="41" width="21" height="7.4" rx="1.2" fill="${box}"/>
    <rect x="38.6" y="45.6" width="21" height="2.8" rx="1.2" fill="${bd}"/>
    <rect x="38.6" y="41" width="21" height="1.8" rx=".9" fill="${L(box, 0.2)}"/>
    <rect x="47.6" y="43" width="3" height="1.6" rx=".4" fill="${C.gold}"/>
    ${t(49.1, 47.6, [[C.bg, 'tools']], 1.6, 'text-anchor="middle" font-weight="800" opacity=".7"')}
    </g>
    <path d="M33.2 33 Q36.4 30.8 39.4 33.4" fill="none" stroke="${C.agent}" stroke-width=".4" stroke-dasharray=".8 .5" stroke-linecap="round"/>`;
  },

  // A Compose UI in a browser window, with a .wasm rocket bursting out of it at near-native speed.
  'kotlin-wasm': () => {
    const fe = C.frontend;
    return `
    <rect x="13.1" y="31.6" width="29" height="17.2" rx="1.4" fill="#000" opacity=".3"/>
    <rect x="12.6" y="31" width="29" height="17.2" rx="1.4" fill="${C.surface2}" stroke="${fe}" stroke-width=".35"/>
    <circle cx="14.3" cy="32.7" r=".45" fill="#F26D6D"/><circle cx="15.7" cy="32.7" r=".45" fill="${C.gold}"/><circle cx="17.1" cy="32.7" r=".45" fill="#5FB865"/>
    <rect x="18.6" y="31.7" width="21.6" height="2" rx="1" fill="${C.bg}"/>
    ${t(19.6, 33.2, [[C.muted, 'localhost:8080']], 1.6)}
    <rect x="13.3" y="34.4" width="27.6" height="13.1" rx=".5" fill="${C.bg}"/>
    ${miniUi(13.3, 34.4, 12.6, 13.1)}
    <rect x="27.4" y="35.6" width="12.4" height="5" rx=".8" fill="${fe}" opacity=".3"/>
    <rect x="27.4" y="41.6" width="12.4" height="4.7" rx=".8" fill="${fe}" opacity=".18"/>
    <!-- rocket, with speed lines in its own frame -->
    <g transform="translate(52.2 39.2) rotate(-38)">
      ${[[-2.9, -8.4, -11.4], [3, -8.4, -11.2], [0, -12.4, -15]].map(([y, a, b]) => `<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="${C.gold}" stroke-width=".4" stroke-linecap="round" opacity=".8"/>`).join('')}
      <path d="M-6.6 -1.7 Q-12.2 0 -6.6 1.7 Z" fill="${C.gold}"/>
      <path d="M-6.6 -1.1 Q-9.4 0 -6.6 1.1 Z" fill="${C.kw}"/>
      <path d="M-4.4 -2.1 L-7.4 -4.3 L-6.8 -1.9 Z" fill="${fe}"/><path d="M-4.4 2.1 L-7.4 4.3 L-6.8 1.9 Z" fill="${D(fe, 0.3)}"/>
      <path d="M-6.8 -2.3 H3 Q7.6 -2.3 9.4 0 Q7.6 2.3 3 2.3 H-6.8 Z" fill="url(#bolt)"/>
      <path d="M-6.8 .8 H3 Q7 .8 9.4 0 Q7.6 2.3 3 2.3 H-6.8 Z" fill="#000" opacity=".2"/>
      <path d="M-5.8 -1.6 H3" stroke="#fff" stroke-width=".35" opacity=".35" stroke-linecap="round"/>
      <circle cx="5.4" cy="0" r="1" fill="${C.bg}" stroke="#fff" stroke-width=".35"/>
      <text x="-1.4" y=".6" font-size="1.6" font-weight="800" fill="#fff" text-anchor="middle">.wasm</text>
    </g>`;
  },

  // 300 lines of build.gradle.kts unroll off the edge; Amper fits the same build on one sticky note.
  amper: () => {
    const widths = [8, 5, 9.5, 7, 9, 4.5, 8, 9.5, 6, 8.5];
    const bars = widths.map((w, i) => `<rect x="${15.2 + (i % 3 === 1 ? 1 : 0)}" y="${33.4 + i * 0.9}" width="${w * 0.9}" height=".42" rx=".2" fill="${[C.kw, C.fn, INK, C.str][i % 4]}" opacity=".7"/>`).join('');
    const note = '#F5D36B';
    return `
    ${shadow(20, 48.6, 9, 0.4)}
    <!-- the endless scroll -->
    <rect x="14" y="32" width="11.8" height="12.6" fill="${PAPER}"/>
    <rect x="23.9" y="32" width="1.9" height="12.6" fill="#D5D8DE"/>
    ${bars}
    <!-- the rest of the 300 lines, still rolled up -->
    <rect x="13.6" y="43" width="13.4" height="5.4" rx="2.7" fill="#C5C9D2"/>
    <rect x="13.6" y="43" width="13.4" height="2.6" rx="1.3" fill="${PAPER}"/>
    <ellipse cx="14.6" cy="45.7" rx="1.6" ry="2.7" fill="#E1E4EA"/>
    <path d="M14.6 45.7 m0 -.5 a.5 .5 0 1 1 -.1 1 a1 1.1 0 1 1 .5 -2.1 a1.4 1.9 0 1 1 -1 3.7" fill="none" stroke="#9AA0AA" stroke-width=".3"/>
    <rect x="13" y="30.8" width="13.8" height="1.9" rx=".95" fill="${C.goldDark}"/>
    <rect x="13" y="30.8" width="13.8" height=".8" rx=".4" fill="${C.gold}"/>
    <circle cx="13" cy="31.75" r="1.05" fill="${C.kw}"/><circle cx="26.8" cy="31.75" r="1.05" fill="${C.kw}"/>
    <rect x="16.4" y="44.2" width="10" height="3" rx="1.5" fill="#E44857"/>
    <text x="21.4" y="46.25" font-size="1.6" font-weight="800" fill="#fff" text-anchor="middle">300 lines</text>
    <!-- amp! -->
    <polygon points="33.6,31.6 29.6,39.6 32.4,39.6 30.6,47.4 36.4,37.8 33.4,37.8 35.6,31.6" fill="url(#bolt)"/>
    <!-- the sticky note -->
    <g transform="rotate(-4 48.5 39.5)">
      <rect x="39.4" y="32.4" width="20" height="15" rx=".6" fill="#000" opacity=".3" transform="translate(.5 .6)"/>
      <path d="M39 32 H59 V44.4 L55.6 47.6 H39 Z" fill="${note}"/>
      <path d="M59 44.4 L55.6 47.6 V45.2 a.8 .8 0 0 1 .8 -.8 Z" fill="${D(note, 0.25)}"/>
      <rect x="45.8" y="30.9" width="6.4" height="2.2" fill="${PAPER}" opacity=".6"/>
      ${t(40.2, 36.2, [['#8A3F12', 'product'], [INK, ': '], ['#2D6B36', 'jvm/app']], 1.7, 'font-weight="700"')}
      ${t(40.2, 39.4, [['#8A3F12', 'dependencies'], [INK, ':']], 1.7, 'font-weight="700"')}
      ${t(40.2, 42.6, [[INK, '  - '], ['#2D6B36', '$compose']], 1.7, 'font-weight="700"')}
    </g>
    ${check(57.6, 46.6, 1.45)}`;
  },
});

const lib = (id, name, cost, chips, extra = {}) => ({
  id, name, type: 'library', points: 2, copies: [3], cost,
  effects: [{ kind: 'chips', label: 'MAKES FREE FOR YOU', chips }], ...extra,
});
const f = (name, sprint) => ({ kind: 'feature', name, sprint });

CARDS.push(
  lib('compose-multiplatform', 'Compose Multiplatform', ['frontend'], [f('iOS App', 2), f('Localization', 3)], {
    sprint: 1, file: 'App.kt',
    code: [[C.cls, '@Composable '], [C.kw, 'fun '], [C.fn, 'App'], [C.text, '() { '], [C.fn, 'Greeting'], [C.text, '() }']],
    comment: 'one UI for Android, iOS, desktop, web',
  }),
  lib('kotlinx-coroutines', 'kotlinx.coroutines', ['backend'], [f('Push Notifications', 2), f('Scale to 1M Users', 3)], {
    sprint: 1, file: 'Workers.kt',
    code: [[C.fn, 'repeat'], [C.text, '('], [C.fn, '100_000'], [C.text, ') { '], [C.fn, 'launch'], [C.text, ' { '], [C.fn, 'work'], [C.text, '() } }']],
    comment: "100,000 coroutines, your laptop shrugs",
  }),
  lib('kotlinx-serialization', 'kotlinx.serialization', ['backend'], [f('Payments', 2), f('Search', 2)], {
    sprint: 1, file: 'User.kt',
    code: [[C.cls, '@Serializable '], [C.kw, 'data class '], [C.cls, 'User'], [C.text, '(…)']],
    comment: 'and JSON stops being a source of bugs',
  }),
  lib('exposed', 'Exposed', ['backend'], [f('Map View', 2), f('Admin Panel', 3)], {
    sprint: 1, copies: [4], file: 'Users.kt',
    code: [[C.fn, 'transaction'], [C.text, ' { '], [C.cls, 'Users'], [C.text, '.'], [C.fn, 'selectAll'], [C.text, '() }']],
    comment: 'SQL with type-safe Kotlin',
  }),
  lib('koin', 'Koin', ['frontend'], [f('Onboarding', 2), f('Wear OS App', 3)], {
    sprint: 1, copies: [5], file: 'AppModule.kt',
    code: [[C.fn, 'single'], [C.text, ' { '], [C.cls, 'Repository'], [C.text, '('], [C.fn, 'get'], [C.text, '()) }']],
    comment: 'DI without annotation processing',
  }),
  lib('sqldelight', 'SQLDelight', ['frontend', 'backend'], [f('Offline Mode', 3), f('Home Screen Widgets', 3)], {
    sprint: 2, file: 'NoteQueries.kt',
    code: [[C.text, 'queries.'], [C.fn, 'selectAll'], [C.text, '().'], [C.fn, 'executeAsList'], [C.text, '()']],
    comment: 'write SQL, the compiler reviews it',
  }),
  {
    id: 'koog', name: 'Koog', type: 'library', sprint: 2, copies: [3], points: 2,
    cost: ['agent', 'backend'], freeWith: 'Junie', file: 'Agent.kt',
    effects: [
      { kind: 'chips', label: 'MAKES FREE FOR YOU', chips: [f('In-app AI Assistant', 3)] },
      { kind: 'chips', label: 'FREE IF YOU BUILT', chips: [{ kind: 'team', name: 'Junie', sprint: 1 }] },
    ],
    code: [[C.cls, 'AIAgent'], [C.text, '(executor, toolRegistry = tools)']],
    comment: 'agents that call tools, not just chat',
  },
  lib('kotlin-wasm', 'Kotlin/Wasm', ['frontend', 'frontend'], [f('Web App', 3), f('KotlinConf Keynote Demo', 3)], {
    sprint: 2, file: 'Main.kt',
    code: [[C.fn, 'kotlin'], [C.text, ' { '], [C.fn, 'wasmJs'], [C.text, ' { '], [C.fn, 'browser'], [C.text, '() } }']],
    comment: 'your Compose app, in the browser',
  }),
  lib('amper', 'Amper', ['frontend', 'backend'], [f('Product Hunt Launch', 3), f('Dokka Docs', 3)], {
    sprint: 2, copies: [5], file: 'module.yaml',
    code: [[C.kw, 'product'], [C.text, ': { '], [C.kw, 'type'], [C.text, ': '], [C.str, 'app'], [C.text, ', '], [C.kw, 'platforms'], [C.text, ': ['], [C.str, 'jvm'], [C.text, '] }']],
    comment: '300 lines of Gradle become a short YAML',
  }),
);
})();
