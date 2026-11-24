// Sprint I Team cards: juniors, full-stack dev, the two coding agents and the product designer.
(() => {
  // Every figure comes from the shared Kit (print/cards.js); local props only.

  // Phone showing a Compose preview with a dashed padding box.
  const composePhone = (x, y) => `<g transform="translate(${x} ${y})">
      <rect x=".35" y=".35" width="11" height="18" rx="1.9" fill="${Kit.dark(C.frontend, .3)}"/>
      <rect x="0" y="0" width="11" height="18" rx="1.9" fill="${C.frontend}"/>
      <rect x=".6" y=".5" width="6" height=".45" rx=".22" fill="#fff" opacity=".35"/>
      <rect x="1.1" y="1.8" width="8.8" height="12.6" rx=".6" fill="${C.bg}"/>
      <rect x="2" y="3" width="7" height="6.6" rx=".6" fill="none" stroke="${C.frontend}" stroke-width=".3" stroke-dasharray=".7 .45"/>
      <rect x="3.3" y="4.3" width="4.4" height="3.6" rx=".55" fill="${C.frontend}"/>
      <text x="5.5" y="6.75" font-size="1.8" font-weight="800" fill="${C.bg}" text-anchor="middle">Hi</text>
      <text x="5.5" y="12.4" font-size="1.6" font-weight="700" fill="${C.frontend}" text-anchor="middle">16.dp</text>
      <circle cx="5.5" cy="16.2" r=".75" fill="${C.bg}"/></g>`;

  // Sticky note with a drop shadow and a folded corner.
  const sticky = (x, y, angle) => `<g transform="translate(${x} ${y}) rotate(${angle})">
      <rect x=".5" y=".6" width="13.4" height="12.4" rx=".7" fill="#000" opacity=".3"/>
      <path d="M0 .7Q0 0 .7 0L12.7 0Q13.4 0 13.4 .7L13.4 10.2L11 12.4L.7 12.4Q0 12.4 0 11.7Z" fill="${C.gold}"/>
      <path d="M13.4 10.2L11 12.4L11 10.9Q11 10.2 11.7 10.2Z" fill="${C.goldDark}"/>
      <rect x="0" y="0" width="13.4" height="1.9" rx=".7" fill="${C.goldDark}" opacity=".45"/>
      <text x="6.7" y="7.6" font-size="5" font-weight="800" fill="#3A2A05" text-anchor="middle">!!</text>
      <text x="6.4" y="10.3" font-size="1.6" font-weight="700" fill="#3A2A05" text-anchor="middle">just for now</text></g>`;

  // Round green check badge.
  const check = (x, y, r = 2.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.backend}" stroke="${C.bg}" stroke-width=".45"/>
      <path d="M${x - r * .5} ${y}l${r * .32} ${r * .32}l${r * .68} ${r * -.72}" fill="none" stroke="${C.bg}" stroke-width="${r * .24}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Source file page with coloured code lines.
  const page = (x, y, stroke, lines = true) => `<g transform="translate(${x} ${y})">
      <path d="M0 .8Q0 0 .8 0L8.2 0L11 2.8L11 13.2Q11 14 10.2 14L.8 14Q0 14 0 13.2Z" fill="${lines ? C.bg : C.surface2}" stroke="${stroke}" stroke-width=".35"/>
      <path d="M8.2 0L8.2 2Q8.2 2.8 9 2.8L11 2.8Z" fill="${stroke}"/>
      ${lines ? `<rect x="1.4" y="3" width="2.6" height="1" rx=".5" fill="${C.kw}"/><rect x="4.6" y="3" width="3" height="1" rx=".5" fill="${C.fn}"/>
      <rect x="2.6" y="5.4" width="6" height="1" rx=".5" fill="${C.text}" opacity=".5"/>
      <rect x="2.6" y="7.8" width="3.4" height="1" rx=".5" fill="${C.str}"/><rect x="6.6" y="7.8" width="2.6" height="1" rx=".5" fill="${C.text}" opacity=".5"/>
      <rect x="2.6" y="10.2" width="4.6" height="1" rx=".5" fill="${C.fn}" opacity=".8"/>
      <rect x="1.4" y="12" width="1.6" height="1" rx=".5" fill="${C.text}" opacity=".5"/>` : ''}</g>`;

  Object.assign(ART, {
    'junior-compose-dev': () => `
      ${Kit.dev(21, 48.6, { k: .95, deskW: 19, accessory: 'sprout', hair: 'curly', hairColor: Kit.HAIR.brown, skin: 1,
        top: C.frontend, topStyle: 'hoodie', mood: 'happy', laptopColor: '#5B5F68' })}
      ${composePhone(33.4, 30.6)}
      <g transform="translate(-1.8 0)">
      <path d="M56.8 33.2a5.2 5.2 0 1 1 -4.6 2.7" fill="none" stroke="${C.gold}" stroke-width=".85" stroke-linecap="round"/>
      <polygon points="50.6,34.2 53.8,35 51.5,37.6" fill="${C.gold}"/>
      <text x="55.4" y="39.9" font-size="2.5" font-weight="800" fill="${C.gold}" text-anchor="middle">×42</text></g>
      <text x="53.6" y="47.4" font-size="1.7" fill="${C.muted}" text-anchor="middle">recompose</text>`,

    'junior-backend-dev': () => `
      ${Kit.dev(21, 48.6, { k: .95, deskW: 19, accessory: 'sprout', hair: 'side', hairColor: Kit.HAIR.black, skin: 3,
        top: C.backend, topStyle: 'tee', glasses: true, mood: 'grin', laptopColor: '#5B5F68' })}
      ${sticky(31.6, 33.4, -6)}
      ${serverRack(46.2, 31.4, .8)}
      ${check(59, 32.4)}`,

    'mid-fullstack-dev': () => `
      ${phone(12.6, 30.6)}
      ${Kit.dev(36.5, 48.6, { k: .95, deskW: 17, hair: 'bun', hairColor: Kit.HAIR.black, skin: 4,
        top: Kit.mix(C.frontend, C.backend, .5), topStyle: 'hoodie', mood: 'smile', laptopColor: '#5B5F68' })}
      <g stroke-width=".6" stroke-linecap="round">
        <line x1="25" y1="40.4" x2="27.4" y2="40.4" stroke="${C.frontend}"/>
        <polygon points="24.2,40.4 25.8,39.3 25.8,41.5" fill="${C.frontend}"/>
        <line x1="45.6" y1="40.4" x2="48" y2="40.4" stroke="${C.backend}"/>
        <polygon points="48.8,40.4 47.2,39.3 47.2,41.5" fill="${C.backend}"/>
      </g>
      ${serverRack(49.6, 33.4, .7)}`,

    junie: () => `<g transform="translate(2.6 0)">
      ${page(43.6, 31, C.border, false)}
      ${page(41.2, 32.6, C.border, false)}
      ${page(38.6, 34.2, C.agent)}
      <rect x="38.6" y="40.2" width="11" height=".5" fill="${C.agent}" opacity=".9"/>
      <rect x="38.6" y="38.4" width="11" height="2.1" fill="${C.agent}" opacity=".16"/>
      ${Kit.robot(20.5, 49.6, { body: true, expression: 'scan', arms: 'wave' })}
      <circle cx="31.2" cy="38" r="3.3" fill="${C.agent}" fill-opacity=".18" stroke="${C.text}" stroke-width=".7"/>
      <path d="M29.6 36.6Q30.4 35.6 31.6 35.6" fill="none" stroke="#fff" stroke-width=".4" stroke-linecap="round" opacity=".6"/>
      <line x1="28.8" y1="40.4" x2="26.6" y2="42.6" stroke="${C.text}" stroke-width="1.1" stroke-linecap="round"/>
      ${check(52.6, 46.2, 2.4)}</g>`,

    'claude-code': () => `
      ${Kit.robot(18.5, 49.6, { body: true, expression: 'happy', arms: 'wave', color: C.kw })}
      <rect x="29.8" y="31.1" width="30.6" height="18" rx="1.4" fill="#000" opacity=".3"/>
      <rect x="29.4" y="30.6" width="30.6" height="18" rx="1.4" fill="${C.code}" stroke="${C.border}" stroke-width=".35"/>
      <path d="M29.4 33.8L29.4 32Q29.4 30.6 30.8 30.6L58.6 30.6Q60 30.6 60 32L60 33.8Z" fill="${C.surface2}"/>
      <circle cx="31.4" cy="32.2" r=".5" fill="#F26D6D"/><circle cx="33" cy="32.2" r=".5" fill="${C.gold}"/><circle cx="34.6" cy="32.2" r=".5" fill="#5FB865"/>
      <text x="31" y="37.4" font-size="2.2" font-weight="700"><tspan fill="${C.kw}">&gt;</tspan><tspan fill="${C.text}"> write tests</tspan></text>
      <text x="31" y="41" font-size="2.2" font-weight="700" fill="${C.backend}">✓ 12 passed</text>
      <rect x="30.6" y="42.6" width="28.2" height="4.6" rx=".9" fill="${C.bg}" stroke="${C.gold}" stroke-width=".4"/>
      <text x="31.8" y="45.7" font-size="2.2" font-weight="700"><tspan fill="${C.text}">rm -rf?</tspan><tspan fill="${C.gold}"> [y/N]</tspan></text>
      <rect x="53.6" y="44" width="1.1" height="2" fill="${C.text}" opacity=".7"/>`,

    'ui-designer': () => {
      const greys = [null, '#45474D', '#4D5056', '#55585E', '#5D6066', '#64676E',
        '#6B6E75', '#73767D', '#7B7E85', '#83868D', '#8B8E95', '#93969C',
        '#9B9EA4', '#A4A6AC', '#ADAFB4', '#B6B8BC', '#C8C9CD', '#D2D3D6'];
      const sw = greys.map((g, i) => {
        const x = 31.6 + (i % 6) * 4.6, y = 31.2 + Math.floor(i / 6) * 4.6;
        return g ? `<rect x="${x}" y="${y}" width="3.8" height="3.8" rx=".6" fill="${g}"/>`
          : `<rect x="${x - .7}" y="${y - .7}" width="5.2" height="5.2" rx="1.1" fill="none" stroke="${C.gold}" stroke-width=".45"/>
             <rect x="${x}" y="${y}" width="3.8" height="3.8" rx=".6" fill="url(#bolt)"/>`;
      }).join('');
      return `
      <rect x="29.6" y="29.6" width="29.4" height="15.4" rx="1.4" fill="${C.surface2}" opacity=".55"/>
      ${sw}
      ${Kit.person(22.6, 49.6, { pose: 'point', hair: 'long', hairColor: Kit.HAIR.auburn, skin: 0, top: C.cls, topStyle: 'tee', glasses: true, mood: 'happy', pants: '#3F4A63' })}
      <text x="44.3" y="48.6" font-size="1.7" fill="${C.muted}" text-anchor="middle">47 greys · 1 brand</text>`;
    },
  });

  CARDS.push(
    {
      id: 'junior-compose-dev', name: 'Junior Compose Dev', type: 'team', sprint: 1, copies: [3, 4],
      costCoins: 0, cost: [], file: 'Greeting.kt',
      effects: [{ kind: 'produces', units: [['frontend']] }],
      code: [[C.fn, 'Text'], [C.text, '('], [C.str, '"Hi"'], [C.text, ', '], [C.cls, 'Modifier'], [C.text, '.'], [C.fn, 'padding'], [C.text, '(16.dp))']],
      comment: 'still learning why it recomposes',
    },
    {
      id: 'junior-backend-dev', name: 'Junior Backend Dev', type: 'team', sprint: 1, copies: [3, 4],
      costCoins: 0, cost: [], file: 'Endpoint.kt',
      effects: [{ kind: 'produces', units: [['backend']] }],
      code: [[C.kw, 'val'], [C.text, ' user = repo.'], [C.fn, 'find'], [C.text, '(id)!!']],
      comment: '!! "just for now", shipped anyway',
    },
    {
      id: 'mid-fullstack-dev', name: 'Mid Full-stack Dev', type: 'team', sprint: 1, copies: [3, 5],
      costCoins: 2, cost: [], file: 'App.kt',
      effects: [{ kind: 'produces', units: [['frontend', 'backend']] }],
      code: [[C.text, 'client.'], [C.fn, 'get'], [C.text, '('], [C.str, '"/api"'], [C.text, ').'], [C.fn, 'body'], [C.text, '<'], [C.cls, 'User'], [C.text, '>()']],
      comment: 'either side of the API, just not Gradle',
    },
    {
      id: 'junie', name: 'Junie', type: 'team', sprint: 1, copies: [3],
      costCoins: 2, cost: [], file: 'Agent.kt',
      effects: [
        { kind: 'produces', units: [['agent']] },
        { kind: 'chips', label: 'MAKES FREE FOR YOU', chips: [{ kind: 'library', name: 'Koog', sprint: 2 }] },
      ],
      code: [[C.text, 'project.files.'], [C.fn, 'forEach'], [C.text, ' { '], [C.fn, 'read'], [C.text, '(it) }']],
      comment: 'reads the whole project first',
    },
    {
      id: 'claude-code', name: 'Claude Code', type: 'team', sprint: 1, copies: [3],
      costCoins: 2, cost: [], file: 'Terminal.kt',
      effects: [
        { kind: 'produces', units: [['agent']] },
        { kind: 'chips', label: 'MAKES FREE FOR YOU', chips: [{ kind: 'team', name: 'Agents with MCP', sprint: 2 }] },
      ],
      code: [[C.cls, '@Test'], [C.kw, ' fun'], [C.fn, ' `the one you skipped`'], [C.text, '()']],
      comment: 'asks before it runs rm -rf',
    },
    {
      id: 'ui-designer', name: 'Product Designer', type: 'team', sprint: 1, copies: [5],
      costCoins: 0, cost: [], file: 'Theme.kt',
      effects: [{ kind: 'produces', units: [['frontend']] }],
      code: [[C.kw, 'val'], [C.text, ' Brand = '], [C.fn, 'Color'], [C.text, '(0xFF7F52FF)']],
      comment: '47 shades of grey, one is the brand',
    },
  );
})();
