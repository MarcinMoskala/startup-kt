// Reference cards (designed first): Ktor (Library) and REST API (Feature).
(() => {
// Local helpers: a server tower with real depth, endpoint chips with a drop shadow.
const G = { front: '#4DB57A', side: '#2F7F55', top: '#86DDA9', bay: '#24573D', led: '#9BF0BE' };
// Server tower: front face at (x, y) w×h, side and top faces give it depth, floor shadow below.
const tower = (x, y, w, h, bays = 4) => {
  const d = w * 0.2, dy = d * 0.5, bh = (h - 2.2) / bays - 0.6;
  const bayRows = Array.from({ length: bays }, (_, i) => {
    const by = y + 1.1 + i * (bh + 0.6);
    return `<rect x="${x + 1.1}" y="${by}" width="${w - 2.2}" height="${bh}" rx=".6" fill="${G.bay}"/>
    <circle cx="${x + 2.4}" cy="${by + bh / 2}" r=".5" fill="${i === 0 ? C.gold : G.led}"/>
    <circle cx="${x + 3.8}" cy="${by + bh / 2}" r=".5" fill="${G.led}" opacity="${i % 2 ? .35 : .9}"/>
    <rect x="${x + 5.3}" y="${by + bh / 2 - 0.35}" width="${w - 7.6}" height=".7" rx=".35" fill="${G.front}" opacity=".55"/>`;
  }).join('');
  return `<ellipse cx="${x + (w + d) / 2}" cy="${y + h + 0.5}" rx="${(w + d) / 2 + 1.2}" ry=".9" fill="#000" opacity=".35"/>
    <path d="M${x + w} ${y} L${x + w + d} ${y - dy} L${x + w + d} ${y + h - dy} L${x + w} ${y + h} Z" fill="${G.side}"/>
    <path d="M${x} ${y} L${x + d} ${y - dy} L${x + w + d} ${y - dy} L${x + w} ${y} Z" fill="${G.top}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".5" fill="${G.front}"/>
    <rect x="${x}" y="${y}" width="${w}" height=".5" fill="#fff" opacity=".18"/>${bayRows}`;
};
// Chip with a drop shadow; parts = [[colour, text, bold?], ...].
const chip = (x, y, w, h, stroke = C.border) => `<rect x="${x + .25}" y="${y + .55}" width="${w}" height="${h}" rx="1.1" fill="#000" opacity=".35"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.1" fill="${C.surface}" stroke="${stroke}" stroke-width=".35"/>
    <rect x="${x + .6}" y="${y + .35}" width="${w - 1.2}" height=".35" rx=".17" fill="#fff" opacity=".07"/>`;
const t = (x, y, parts, size = 1.7, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" xml:space="preserve" ${extra}>${parts.map(([c, s, b]) => `<tspan fill="${c}"${b ? ' font-weight="700"' : ''}>${esc(s)}</tspan>`).join('')}</text>`;
const pill = (cx, cy, label, c) => `<rect x="${cx - 2.9}" y="${cy - 1.3}" width="5.8" height="2.6" rx="1.3" fill="${c}"/>
    <text x="${cx}" y="${cy + .6}" font-size="1.65" font-weight="800" fill="${C.bg}" text-anchor="middle">${label}</text>`;
const bolt = (cx, cy, r) => `<circle cx="${cx}" cy="${cy + .35}" r="${r}" fill="#000" opacity=".35"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#bolt)" stroke="${C.bg}" stroke-width=".5"/>
    <path d="M${cx + r * .12} ${cy - r * .68} L${cx - r * .42} ${cy + r * .1} L${cx - r * .02} ${cy + r * .1} L${cx - r * .16} ${cy + r * .68} L${cx + r * .44} ${cy - r * .14} L${cx + r * .04} ${cy - r * .14} Z" fill="#fff"/>`;

Object.assign(ART, {
  // One server, one bolt, a whole backend: routing { } fans out to live endpoints.
  ktor: () => {
    const routes = [[33.4, 'GET', '/health', '200'], [39.4, 'GET', '/api', '200'], [45.4, 'POST', '/login', '201']];
    const branches = routes.map(([y]) => `<path d="M30.6 39.4 C33 39.4 32.6 ${y} 35.2 ${y}" stroke="${C.backend}" stroke-width=".45" fill="none" stroke-linecap="round"/>
    <circle cx="35.2" cy="${y}" r=".55" fill="${C.backend}"/>`).join('');
    const chips = routes.map(([y, verb, path, code]) => `${chip(36, y - 2.3, 24.4, 4.6)}
    ${t(37.4, y + .6, [[C.kw, verb, true], [C.text, ' ' + path]])}
    ${pill(56.6, y, code, C.backend)}`).join('');
    return `${tower(14, 33, 12.6, 14.4)}
    <circle cx="29.4" cy="39.4" r=".75" fill="${C.backend}"/>
    ${branches}${chips}
    ${bolt(27.6, 32.2, 3.3)}`;
  },

  // The app asks, the server answers: GET /users out, a JSON list of users back.
  // Drawn 25 mm tall (artH) so it fills the taller window this card gets.
  'rest-api': () => {
    const users = [0, 1, 2, 3].map(i => {
      const y = 35.2 + i * 3.4, c = [C.frontend, C.cls, C.gold, C.backend][i];
      return `<circle cx="16.4" cy="${y}" r="1.1" fill="${c}"/>
    <rect x="18.2" y="${y - .85}" width="${[4.8, 3.8, 4.4, 3.2][i]}" height=".8" rx=".4" fill="${C.text}" opacity=".75"/>
    <rect x="18.2" y="${y + .3}" width="2.8" height=".6" rx=".3" fill="${C.muted}" opacity=".6"/>`;
    }).join('');
    return `<ellipse cx="19.4" cy="51.6" rx="7.4" ry=".85" fill="#000" opacity=".35"/>
    <rect x="13.8" y="27.6" width="12" height="23.4" rx="2.1" fill="#2F86C4"/>
    <rect x="13" y="27.6" width="12" height="23.4" rx="2.1" fill="${C.frontend}"/>
    <rect x="14" y="29.6" width="10" height="18.6" rx=".8" fill="${C.bg}"/>
    <rect x="17.4" y="28.25" width="3.2" height=".65" rx=".32" fill="${C.bg}"/>
    <rect x="14" y="29.6" width="10" height="2.6" rx=".8" fill="${C.frontend}" opacity=".22"/>
    <text x="15" y="31.5" font-size="1.6" font-weight="700" fill="${C.frontend}">Users</text>
    ${users}
    <rect x="17.2" y="49.3" width="3.6" height=".7" rx=".35" fill="${C.bg}" opacity=".7"/>
    <rect x="13.45" y="28.6" width=".5" height="7.4" rx=".25" fill="#fff" opacity=".35"/>

    ${chip(29.4, 28.4, 14.4, 3.8, C.kw)}
    ${t(36.6, 31.05, [[C.kw, 'GET', true], [C.text, ' /users']], 1.8, 'text-anchor="middle"')}
    <line x1="27.6" y1="34.6" x2="44.6" y2="34.6" stroke="${C.kw}" stroke-width=".6" stroke-linecap="round"/>
    <polygon points="46.4,34.6 44.3,33.3 44.3,35.9" fill="${C.kw}"/>

    ${chip(27.6, 37.4, 18.2, 7.6, C.backend)}
    ${pill(31.5, 39.8, '200', C.backend)}
    ${t(35, 40.4, [[C.backend, 'OK', true]], 1.7)}
    ${t(36.7, 43.5, [[C.text, '[{ '], [C.cls, '"id"'], [C.text, ': '], [C.fn, '42'], [C.text, ' }]']], 1.7, 'text-anchor="middle"')}
    <line x1="29.4" y1="47.8" x2="46.4" y2="47.8" stroke="${C.backend}" stroke-width=".6" stroke-linecap="round"/>
    <polygon points="27.6,47.8 29.7,46.5 29.7,49.1" fill="${C.backend}"/>

    ${tower(47.4, 30.6, 11, 20, 4)}`;
  },
});

CARDS.push(
  {
    id: 'ktor', name: 'Ktor', type: 'library', sprint: 1, copies: [3], points: 2,
    cost: ['backend'], file: 'Server.kt',
    effects: [{ kind: 'chips', label: 'MAKES FREE FOR YOU', chips: [
      { kind: 'feature', name: 'REST API', sprint: 2 },
      { kind: 'feature', name: 'Real-time Chat', sprint: 3 },
    ] }],
    code: [[C.fn, 'embeddedServer'], [C.text, '('], [C.cls, 'Netty'], [C.text, ') { '], [C.fn, 'routing'], [C.text, ' { } }']],
    comment: 'a whole backend in one expression',
  },
  {
    id: 'rest-api', name: 'REST API', type: 'feature', sprint: 2, copies: [3], points: 4,
    cost: ['backend', 'backend', 'frontend'], freeWith: 'Ktor', file: 'Routes.kt', artH: 25,
    effects: [{ kind: 'chips', label: 'FREE IF YOU BUILT', chips: [
      { kind: 'library', name: 'Ktor', sprint: 1 },
    ] }],
    code: [[C.fn, 'get'], [C.text, '('], [C.str, '"/users"'], [C.text, ') { '], [C.text, 'call.'], [C.fn, 'respond'], [C.text, '(users) }']],
    comment: 'everything else talks to this',
  },
);
})();
