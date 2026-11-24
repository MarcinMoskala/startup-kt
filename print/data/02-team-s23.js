// Team cards, Sprint II and III: Senior Compose Dev, Senior Backend Dev, Full-stack Senior,
// Agents with MCP, QA Engineer, Tech Lead.
// People and robots come from Kit (print/cards.js). The five 34 mm windows draw art over y ≈ 26..53 (artH 28);
// Agents with MCP has a short 14 mm window and draws a flat strip over y ≈ 33..46 (artH 13).
(() => {
  const RED = '#F26D6D';

  // Soft floor shadow under a figure or prop.
  const shadow = (x, y, rx = 6) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry=".7" fill="#000" opacity=".28"/>`;

  // Four-point sparkle.
  const spark = (x, y, r = 1.2, col = C.gold) =>
    `<path d="M${x} ${y - r}Q${x + r * .18} ${y - r * .18} ${x + r} ${y}Q${x + r * .18} ${y + r * .18} ${x} ${y + r}Q${x - r * .18} ${y + r * .18} ${x - r} ${y}Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z" fill="${col}"/>`;

  // Phone with a custom screen (x, y = top-left), w × h, flat blue body with a darker right side.
  const handset = (x, y, w, h, screen, col = C.frontend) => `
    <rect x="${x + .5}" y="${y + .5}" width="${w}" height="${h}" rx="2" fill="#000" opacity=".25"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${Kit.dark(col, .22)}"/>
    <rect x="${x}" y="${y}" width="${w - .7}" height="${h}" rx="2" fill="${col}"/>
    <rect x="${x + 1}" y="${y + 1.9}" width="${w - 2.4}" height="${h - 4.4}" rx=".7" fill="${C.bg}"/>
    <rect x="${x + w / 2 - 2}" y="${y + .75}" width="3.4" height=".5" rx=".25" fill="${Kit.dark(col, .3)}"/>
    <circle cx="${x + (w - .7) / 2}" cy="${y + h - 1.25}" r=".7" fill="${Kit.dark(col, .3)}"/>
    ${screen}`;

  // Database cylinder (x = centre, y = top of the lid), rx × body height.
  const database = (x, y, rx, h, col = C.backend) => {
    const ry = rx * .32, d = Kit.dark(col, .18), dd = Kit.dark(col, .32), band = i => y + h * i / 3;
    return `<ellipse cx="${x + .5}" cy="${y + h + .6}" rx="${rx}" ry="${ry}" fill="#000" opacity=".28"/>
      <path d="M${x - rx} ${y} V${y + h} A${rx} ${ry} 0 0 0 ${x + rx} ${y + h} V${y}Z" fill="${d}"/>
      <path d="M${x + rx * .45} ${y + ry * .9} V${y + h + ry * .9} A${rx} ${ry} 0 0 0 ${x + rx} ${y + h} V${y}Z" fill="${dd}" opacity=".7"/>
      ${[1, 2].map(i => `<path d="M${x - rx} ${band(i)} A${rx} ${ry} 0 0 0 ${x + rx} ${band(i)}" fill="none" stroke="${C.bg}" stroke-width=".45" opacity=".55"/>`).join('')}
      ${[0, 1, 2].map(i => `<circle cx="${x - rx * .55}" cy="${band(i) + h / 6 + ry * .55}" r=".55" fill="${i === 0 ? C.gold : Kit.light(col, .4)}"/>`).join('')}
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}"/>
      <ellipse cx="${x}" cy="${y}" rx="${rx * .62}" ry="${ry * .5}" fill="${Kit.light(col, .3)}" opacity=".6"/>`;
  };

  // A board card (kanban sticky) with an icon.
  const ticket = (x, y, w, h, inner, col = C.surface2) => `
    <rect x="${x + .3}" y="${y + .35}" width="${w}" height="${h}" rx=".7" fill="#000" opacity=".3"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".7" fill="${col}"/>
    ${inner}`;

  Object.assign(ART, {
    // Compose dev at the laptop; UI blocks fly from the code into the phone and click together into a screen.
    'senior-compose-dev': () => {
      const px = 46, py = 27.2, pw = 14.2, ph = 25.2;
      const screen = `
        <rect x="${px + 1}" y="${py + 1.9}" width="${pw - 2.4}" height="3" rx=".7" fill="${C.frontend}" opacity=".9"/>
        <rect x="${px + 2}" y="${py + 3}" width="5" height=".8" rx=".4" fill="${C.bg}" opacity=".7"/>
        <rect x="${px + 2}" y="${py + 6.2}" width="${pw - 4.4}" height="6.6" rx=".8" fill="${C.surface2}"/>
        <circle cx="${px + 4.3}" cy="${py + 9.5}" r="1.5" fill="${C.cls}"/>
        <rect x="${px + 6.5}" y="${py + 8.2}" width="4.6" height=".8" rx=".4" fill="${C.text}" opacity=".8"/>
        <rect x="${px + 6.5}" y="${py + 10.1}" width="3.2" height=".8" rx=".4" fill="${C.muted}" opacity=".7"/>
        <rect x="${px + 2}" y="${py + 14.2}" width="5.4" height=".8" rx=".4" fill="${C.muted}" opacity=".8"/>
        <rect x="${px + 8}" y="${py + 13.75}" width="3.8" height="1.8" rx=".9" fill="${C.frontend}"/>
        <circle cx="${px + 10.9}" cy="${py + 14.65}" r=".65" fill="#fff"/>
        <rect x="${px + 2}" y="${py + 17.2}" width="${pw - 4.4}" height="2.6" rx="1.3" fill="${C.gold}"/>
        <rect x="${px + 4.8}" y="${py + 18.15}" width="4.2" height=".7" rx=".35" fill="#3A2A05" opacity=".7"/>`;
      return `
        ${Kit.dev(23.2, 51.5, { k: 1.3, skin: 2, hair: 'bun', hairColor: Kit.HAIR.black, top: C.frontend, topStyle: 'hoodie',
          glasses: true, mood: 'happy', laptopColor: '#5B5F68', deskW: 17 })}
        <path d="M31 32.3 L28.9 34.9 L33.4 32.3" fill="${C.bg}" stroke="${C.cls}" stroke-width=".35" stroke-linejoin="round"/>
        <rect x="28.8" y="28.2" width="15.2" height="4.4" rx="1.1" fill="${C.bg}" stroke="${C.cls}" stroke-width=".35"/>
        <rect x="30.9" y="32.05" width="2.6" height=".5" fill="${C.bg}"/>
        <text x="36.4" y="31.25" font-size="1.85" font-weight="700" fill="${C.cls}" text-anchor="middle">@Composable</text>
        <path d="M33 46.4 C37 46.4 38.5 41 43.6 40.4" fill="none" stroke="${C.frontend}" stroke-width=".5" stroke-linecap="round" stroke-dasharray=".1 1.1"/>
        <polygon points="45,40.2 43.2,39.3 43.5,41.4" fill="${C.frontend}"/>
        <rect x="34.6" y="35.2" width="5.2" height="3.1" rx=".8" fill="${C.surface2}" stroke="${C.frontend}" stroke-width=".3" transform="rotate(-10 37.2 36.7)"/>
        <circle cx="35.9" cy="36.95" r=".75" fill="${C.cls}" transform="rotate(-10 37.2 36.7)"/>
        <rect x="38.6" y="41.6" width="4.6" height="2" rx="1" fill="${C.gold}" transform="rotate(8 40.9 42.6)"/>
        ${handset(px, py, pw, ph, screen)}`;
    },

    // Grey-bearded backend veteran next to a database that went from 1200 ms to 12 ms.
    'senior-backend-dev': () => `
      ${Kit.dev(22.6, 51.5, { k: 1.3, skin: 3, hair: 'grey', beard: true, glasses: true, top: C.backend, topStyle: 'shirt',
        mood: 'smile', laptopColor: '#4A4E57', deskW: 16.5 })}
      ${database(40.5, 31.2, 5.6, 17.4)}
      <polygon points="41.6,35.2 38.2,41.6 40.6,41.6 39.2,47 43.6,39.6 41,39.6 42.8,35.2" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3" stroke-linejoin="round"/>
      <rect x="48.6" y="30.4" width="12.4" height="5" rx="1.2" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
      <text x="54.8" y="33.65" font-size="1.85" font-weight="700" fill="${RED}" text-anchor="middle" opacity=".8">1200 ms</text>
      <line x1="50" y1="33" x2="59.6" y2="33" stroke="${RED}" stroke-width=".4" opacity=".85"/>
      <path d="M54.8 36.6 V40.4" stroke="${C.muted}" stroke-width=".55" stroke-linecap="round"/>
      <polygon points="54.8,42 53.3,39.8 56.3,39.8" fill="${C.muted}"/>
      <rect x="48.6" y="43.2" width="12.4" height="6.2" rx="1.4" fill="${C.bg}" stroke="${C.backend}" stroke-width=".45"/>
      <rect x="48.6" y="43.2" width="12.4" height="6.2" rx="1.4" fill="${C.backend}" opacity=".12"/>
      <text x="54.8" y="47.25" font-size="2.4" font-weight="800" fill="${C.backend}" text-anchor="middle">12 ms</text>`,

    // The unicorn hire: horned, pink-maned, standing under a rainbow that bridges the phone (UI) and the server (backend).
    'fullstack-senior': () => `
      <g fill="none" stroke-linecap="round" stroke-width="1.5">
        <path d="M16.2 33.4 C22.4 25.4 50.2 25.4 55.6 38.6" stroke="${C.frontend}"/>
        <path d="M17.9 33.8 C23.8 27 48.6 27 53.9 38.6" stroke="${C.cls}"/>
        <path d="M19.6 34.2 C25.2 28.6 47 28.6 52.2 38.6" stroke="${C.backend}"/>
      </g>
      ${handset(12.2, 33, 10.6, 18.2, `
        <rect x="13.2" y="34.9" width="8.2" height="2.2" rx=".6" fill="${C.frontend}"/>
        <rect x="14.2" y="38.3" width="6.2" height="1.5" rx=".5" fill="${C.frontend}" opacity=".7"/>
        <rect x="14.2" y="40.9" width="6.2" height="1.5" rx=".5" fill="${C.frontend}" opacity=".45"/>
        <rect x="14.2" y="43.5" width="4" height="1.5" rx=".5" fill="${C.frontend}" opacity=".25"/>`)}
      ${serverRack(49.2, 38.6, 0.68)}
      ${shadow(36.5, 53.2, 6.2)}
      ${Kit.person(36.5, 53.4, { pose: 'stand', k: 1.2, skin: 0, hair: 'long', hairColor: Kit.HAIR.pink, top: '#8B5CF6',
        topStyle: 'hoodie', pants: '#3B4258', accessory: 'horn', mood: 'happy' })}
      ${spark(42.4, 29.4, 1.3)}${spark(31.2, 31, .9)}${spark(44.4, 35, .75, '#fff')}${spark(27.8, 46.2, .85)}${spark(45.6, 47.6, .7, '#fff')}`,

    // Two agents plug into one MCP hub that fans out to real tools: shell, database, deploy.
    'agents-with-mcp': () => {
      const tool = (y, col, icon, label) => `
        <rect x="46.4" y="${y}" width="13.4" height="3.7" rx="1" fill="${C.surface2}"/>
        <rect x="46.4" y="${y}" width="3.8" height="3.7" rx="1" fill="${col}"/>
        <rect x="49.2" y="${y}" width="1" height="3.7" fill="${col}"/>
        ${icon(48.3, y + 1.85)}
        <text x="51.3" y="${y + 2.5}" font-size="1.7" font-weight="700" fill="${C.text}">${label}</text>`;
      return `
        <g fill="none" stroke="${C.agent}" stroke-width=".6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16.2 43.4 V44.5 Q16.2 45.3 17 45.3 H37.8 Q38.6 45.3 38.6 44.5 V43.4"/>
          <path d="M27 43.4 V45.3"/>
        </g>
        ${Kit.robot(16.2, 43.6, { k: .92, expression: 'happy' })}
        ${Kit.robot(27, 43.6, { k: .92, expression: 'focus' })}
        <rect x="34.9" y="34.7" width="8" height="8.9" rx="1.7" fill="${Kit.dark(C.agent, .3)}"/>
        <rect x="34.6" y="34.4" width="8" height="8.6" rx="1.7" fill="${C.agent}"/>
        <rect x="35.6" y="35.4" width="6" height="6.6" rx="1.1" fill="#1A1424"/>
        <text x="38.6" y="39.3" font-size="1.95" font-weight="800" fill="${C.agent}" text-anchor="middle">MCP</text>
        ${[0, 1, 2].map(i => `<circle cx="${36.9 + i * 1.7}" cy="40.8" r=".3" fill="${i === 1 ? C.gold : C.backend}"/>`).join('')}
        <g fill="none" stroke="${C.border}" stroke-width=".55" stroke-linecap="round">
          <path d="M42.6 36.8 C44.6 36.8 44.4 35.45 46.4 35.45"/><path d="M42.6 39.4 C44.6 39.4 44.4 39.85 46.4 39.85"/><path d="M42.6 41.6 C44.6 41.6 44.4 44.25 46.4 44.25"/>
        </g>
        ${tool(33.6, C.text, (x, y) => `<text x="${x}" y="${y + .62}" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">&gt;_</text>`, 'shell')}
        ${tool(38, C.backend, (x, y) => `<path d="M${x - 1.05} ${y - .7} V${y + .75} A1.05 .38 0 0 0 ${x + 1.05} ${y + .75} V${y - .7}Z" fill="${C.bg}" opacity=".8"/><ellipse cx="${x}" cy="${y - .7}" rx="1.05" ry=".38" fill="${C.bg}"/>`, 'db')}
        ${tool(42.4, C.gold, (x, y) => `<path d="M${x} ${y - 1.25} L${x + 1.15} ${y + .1} H${x + .45} V${y + 1.2} H${x - .45} V${y + .1} H${x - 1.15}Z" fill="${C.bg}"/>`, 'deploy')}`;
    },

    // QA engineer points a magnifier at the phone and catches the one bug among green tests.
    'qa-engineer': () => {
      const row = (y, ok, label) => `
        <circle cx="49.6" cy="${y}" r="1.05" fill="${ok ? C.backend : RED}"/>
        ${ok ? `<path d="M49 ${y} L49.45 ${y + .45} L50.25 ${y - .4}" fill="none" stroke="${C.bg}" stroke-width=".38" stroke-linecap="round" stroke-linejoin="round"/>`
             : `<path d="M49.15 ${y - .45} L50.05 ${y + .45} M50.05 ${y - .45} L49.15 ${y + .45}" stroke="${C.bg}" stroke-width=".38" stroke-linecap="round"/>`}
        <text x="51.4" y="${y + .62}" font-size="1.75" font-weight="${ok ? 400 : 700}" fill="${ok ? C.text : RED}">${label}</text>`;
      return `
        ${handset(28.6, 28.6, 12, 21.8, `
          <rect x="29.6" y="30.5" width="9.6" height="2.4" rx=".6" fill="${C.frontend}"/>
          <rect x="30.6" y="34.4" width="7.6" height="1.6" rx=".5" fill="${C.frontend}" opacity=".6"/>
          <rect x="30.6" y="37.2" width="7.6" height="1.6" rx=".5" fill="${C.frontend}" opacity=".4"/>
          <rect x="30.6" y="40" width="5" height="1.6" rx=".5" fill="${C.frontend}" opacity=".25"/>
          <rect x="30.6" y="43.4" width="7.6" height="2.4" rx="1.2" fill="${C.frontend}"/>`)}
        <path d="M23.4 34.85 L31 37.4" stroke="#3A3D44" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M21.9 34.35 L26 35.75" stroke="#5B5F68" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M28.6 36.6 L29.6 36.95" stroke="${C.gold}" stroke-width="1.4"/>
        ${shadow(17.5, 53.2, 5)}
        ${Kit.person(17.5, 53.4, { pose: 'point', k: 1.22, skin: 4, hair: 'curly', hairColor: Kit.HAIR.black, top: '#E8A33D',
          topStyle: 'tee', pants: '#3B4258', mood: 'grin' })}
        <circle cx="34.6" cy="38.8" r="4.9" fill="${C.bg}" fill-opacity=".88"/>
        <circle cx="34.6" cy="38.8" r="4.9" fill="none" stroke="#3A3D44" stroke-width="1.1"/>
        <circle cx="34.6" cy="38.8" r="4.3" fill="none" stroke="${C.muted}" stroke-width=".3"/>
        <path d="M31.6 36.2 Q32.6 34.8 34.4 34.6" fill="none" stroke="#fff" stroke-width=".45" stroke-linecap="round" opacity=".45"/>
        <g transform="translate(34.6 39.4)">
          <g stroke="${RED}" stroke-width=".42" stroke-linecap="round">
            <path d="M-2.3 -.7 H2.3 M-2.5 .8 H2.5 M-2.1 2.2 H2.1 M-.6 -2.2 L-1.3 -3.1 M.6 -2.2 L1.3 -3.1"/></g>
          <ellipse cx="0" cy=".6" rx="1.65" ry="2.3" fill="${RED}"/>
          <circle cx="0" cy="-1.85" r=".95" fill="${Kit.dark(RED, .2)}"/>
          <line x1="0" y1="-.8" x2="0" y2="2.8" stroke="${C.bg}" stroke-width=".3"/>
          <circle cx="-.75" cy=".2" r=".3" fill="${C.bg}" opacity=".6"/><circle cx=".75" cy="1.4" r=".3" fill="${C.bg}" opacity=".6"/>
        </g>
        <rect x="45.4" y="30.4" width="15.4" height="19.2" rx="1.3" fill="#000" opacity=".25" transform="translate(.4 .4)"/>
        <rect x="45.4" y="30.4" width="15.4" height="19.2" rx="1.3" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
        <text x="47.2" y="33.6" font-size="1.6" font-weight="700" fill="${C.muted}" letter-spacing=".12">TESTS</text>
        ${row(36.4, true, 'login')}${row(39.8, true, 'api')}${row(43.2, false, 'demo')}
        <rect x="47.2" y="46.4" width="12" height="1.1" rx=".55" fill="${C.backend}"/>
        <rect x="57" y="46.4" width="2.2" height="1.1" rx=".55" fill="${RED}"/>`;
    },

    // Tech lead in a blazer points at the sprint board: the agent task is moving, UI and backend are done.
    'tech-lead': () => {
      const bx = 27.2, by = 28.6, bw = 33.2, bh = 22.4, cw = bw / 3;
      return `
        <rect x="${bx + .5}" y="${by + .5}" width="${bw}" height="${bh}" rx="1.4" fill="#000" opacity=".28"/>
        <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="1.4" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
        ${['TODO', 'DOING', 'DONE'].map((h, i) => `
          <text x="${bx + cw * (i + .5)}" y="${by + 3.3}" font-size="1.65" font-weight="700" fill="${i === 2 ? C.backend : C.muted}" text-anchor="middle" letter-spacing=".12">${h}</text>
          ${i ? `<line x1="${bx + cw * i}" y1="${by + 1.4}" x2="${bx + cw * i}" y2="${by + bh - 1.4}" stroke="${C.border}" stroke-width=".25"/>` : ''}`).join('')}
        <line x1="${bx + 1.2}" y1="${by + 4.6}" x2="${bx + bw - 1.2}" y2="${by + 4.6}" stroke="${C.border}" stroke-width=".25"/>
        ${ticket(bx + 1.4, by + 6, cw - 2.8, 4.6, `<rect x="${bx + 2.6}" y="${by + 7.4}" width="5.6" height=".8" rx=".4" fill="${C.muted}"/><rect x="${bx + 2.6}" y="${by + 8.9}" width="3.6" height=".8" rx=".4" fill="${C.faint}"/>`)}
        ${ticket(bx + 1.4, by + 12, cw - 2.8, 4.6, `<rect x="${bx + 2.6}" y="${by + 13.4}" width="4.6" height=".8" rx=".4" fill="${C.muted}"/><rect x="${bx + 2.6}" y="${by + 14.9}" width="6" height=".8" rx=".4" fill="${C.faint}"/>`)}
        ${ticket(bx + cw + 1.4, by + 6, cw - 2.8, 9.4, Kit.robot(bx + cw * 1.5, by + 14.4, { k: .66, expression: 'focus' }), Kit.mix(C.surface2, C.agent, .18))}
        ${ticket(bx + cw * 2 + 1.4, by + 6, cw - 2.8, 6.2, iconAt('frontend', null, bx + cw * 2.5 - 2.3, by + 6.95, 4.6), Kit.mix(C.surface2, C.frontend, .14))}
        ${ticket(bx + cw * 2 + 1.4, by + 13.6, cw - 2.8, 6.2, iconAt('backend', null, bx + cw * 2.5 - 2.3, by + 14.4, 4.6), Kit.mix(C.surface2, C.backend, .14))}
        <path d="M${bx + cw * 1.5} ${by + 16.6} Q${bx + cw * 1.6} ${by + 20} ${bx + cw * 2 + .6} ${by + 19.4}" fill="none" stroke="${C.gold}" stroke-width=".5" stroke-linecap="round"/>
        <polygon points="${bx + cw * 2 + 1.5},${by + 19.1} ${bx + cw * 2 - .2},${by + 18.4} ${bx + cw * 2 + .4},${by + 20.4}" fill="${C.gold}"/>
        ${shadow(17.2, 53.2, 5)}
        ${Kit.person(17.2, 53.4, { pose: 'point', k: 1.22, skin: 1, hair: 'side', hairColor: Kit.HAIR.chestnut, glasses: true,
          top: '#34456B', topStyle: 'blazer', pants: '#2C3346', mood: 'talk' })}`;
    },
  });

  const produces = units => ({ kind: 'produces', units });

  CARDS.push(
    {
      id: 'senior-compose-dev', name: 'Senior Compose Dev', type: 'team', sprint: 2, copies: [3, 4], points: 0,
      costCoins: 1, cost: [], file: 'Screen.kt', artH: 28,
      effects: [produces([['frontend'], ['frontend']])],
      code: [[C.fn, 'rememberSaveable'], [C.text, ' { '], [C.fn, 'mutableStateOf'], [C.text, '('], [C.str, '""'], [C.text, ') }']],
      comment: 'opinions on remember, and they are right',
    },
    {
      id: 'senior-backend-dev', name: 'Senior Backend Dev', type: 'team', sprint: 2, copies: [3, 4], points: 0,
      costCoins: 0, cost: [], file: 'Queries.kt', artH: 28,
      effects: [produces([['backend'], ['backend']])],
      code: [[C.fn, 'withContext'], [C.text, '('], [C.cls, 'Dispatchers'], [C.text, '.IO) { '], [C.fn, 'query'], [C.text, '() }']],
      comment: 'knows why the database is slow',
    },
    {
      id: 'fullstack-senior', name: 'Full-stack Senior', type: 'team', sprint: 2, copies: [3, 5], points: 0,
      costCoins: 2, cost: [], file: 'FullStack.kt', artH: 28,
      effects: [produces([['frontend'], ['backend']])],
      code: [[C.cls, '@Composable'], [C.text, ' '], [C.kw, 'fun'], [C.text, ' '], [C.fn, 'App'], [C.text, '() = '], [C.fn, 'Users'], [C.text, '(api)']],
      comment: 'the unicorn hire: UI and query plans',
    },
    {
      id: 'agents-with-mcp', name: 'Agents with MCP', type: 'team', sprint: 2, copies: [3], points: 0,
      costCoins: 3, cost: [], freeWith: 'Claude Code', file: 'McpTools.kt', artH: 13,
      effects: [
        produces([['agent'], ['agent']]),
        { kind: 'chips', label: 'MAKES FREE FOR YOU', chips: [{ kind: 'feature', name: 'Multi-agent Workflow', sprint: 3 }] },
        { kind: 'chips', label: 'FREE IF YOU BUILT', chips: [{ kind: 'team', name: 'Claude Code', sprint: 1 }] },
      ],
      code: [[C.text, 'server.'], [C.fn, 'addTool'], [C.text, '('], [C.str, '"build"'], [C.text, ') { '], [C.fn, 'gradle'], [C.text, '() }']],
      comment: 'real tools: no more guessing, just ship',
    },
    {
      id: 'qa-engineer', name: 'QA Engineer', type: 'team', sprint: 2, copies: [5], points: 0,
      costCoins: 1, cost: [], file: 'LoginTest.kt', artH: 28,
      effects: [produces([['frontend', 'backend']])],
      code: [[C.cls, '@Test'], [C.text, ' '], [C.kw, 'fun'], [C.text, ' '], [C.fn, '`works on both platforms`'], [C.text, '()']],
      comment: 'finds the bug in yesterday\'s demo',
    },
    {
      id: 'tech-lead', name: 'Tech Lead', type: 'team', sprint: 3, copies: [3, 4], points: 3,
      costCoins: 1, cost: [], file: 'TechLead.kt', artH: 28,
      effects: [produces([['frontend'], ['backend'], ['agent']])],
      code: [[C.text, 'team.'], [C.fn, 'forEach'], [C.text, ' { it.'], [C.fn, 'unblock'], [C.text, '() }']],
      comment: 'writes less code, everyone ships more',
    },
  );
})();
