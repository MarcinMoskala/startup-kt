// Business cards, Sprints I and II.
(() => {
  const coin = (n, x, y, s) => iconAt('coin', n, x, y, s);
  const arrow = (x1, y, x2, color) => `
    <line x1="${x1}" y1="${y}" x2="${x2 - 1.4}" y2="${y}" stroke="${color}" stroke-width=".6" stroke-linecap="round" stroke-dasharray="1.2 1"/>
    <polygon points="${x2},${y} ${x2 - 1.9},${y - 1.2} ${x2 - 1.9},${y + 1.2}" fill="${color}"/>`;
  const fStar = (x, y, s) => `
    <rect x="${x}" y="${y + 0.5}" width="${s}" height="${s}" rx="${s * 0.2}" fill="${Kit.dark(TYPES.feature.color, .35)}"/>
    <rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.2}" fill="${TYPES.feature.color}"/>
    <use href="#i-feature" x="${x + s * 0.18}" y="${y + s * 0.18}" width="${s * 0.64}" height="${s * 0.64}"/>`;
  // Soft floor shadow under a figure or prop.
  const shadow = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${(rx * 0.16).toFixed(2)}" fill="#000" opacity=".28"/>`;
  // Stack of gold coins seen from the side, (x, y) = bottom-left.
  const coinStack = (x, y, n, w = 10) => Array.from({ length: n }, (_, i) => `
    <rect x="${x}" y="${(y - (i + 1) * 1.9).toFixed(2)}" width="${w}" height="2.1" rx=".9" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3"/>
    <rect x="${x + 1.2}" y="${(y - (i + 1) * 1.9 + 0.45).toFixed(2)}" width="${w * 0.35}" height=".4" rx=".2" fill="#fff" opacity=".35"/>`).join('');
  // Banknote with a euro mark, (x, y) = top-left, 11 x 6.4.
  const note = (x, y, rot = 0) => `
    <g transform="translate(${x} ${y}) rotate(${rot} 5.5 3.2)">
      <rect width="11" height="6.4" rx=".8" fill="${Kit.dark(C.backend, .3)}" transform="translate(.35 .45)"/>
      <rect width="11" height="6.4" rx=".8" fill="${C.backend}"/>
      <rect x=".8" y=".8" width="9.4" height="4.8" rx=".5" fill="none" stroke="${Kit.dark(C.backend, .25)}" stroke-width=".3"/>
      <circle cx="5.5" cy="3.2" r="1.75" fill="${Kit.light(C.backend, .35)}"/>
      <text x="5.5" y="4.05" font-size="2.3" font-weight="800" fill="${Kit.dark(C.backend, .45)}" text-anchor="middle">€</text>
    </g>`;

  Object.assign(ART, {
    // Founder pointing at the TAM slide; the round lands as a stack of coins.
    'seed-round': () => `
      <path d="M24.6 30.4h21.2a1.1 1.1 0 0 1 1.1 1.1v12.6a1.1 1.1 0 0 1 -1.1 1.1h-21.2a1.1 1.1 0 0 1 -1.1 -1.1v-12.6a1.1 1.1 0 0 1 1.1 -1.1z" fill="#4A4D55"/>
      <rect x="24.4" y="31.2" width="21.6" height="12.6" rx=".6" fill="${C.code}"/>
      <rect x="34.6" y="45.2" width="1.2" height="2.6" fill="#4A4D55"/>
      <rect x="31.2" y="47.6" width="8" height=".9" rx=".45" fill="#4A4D55"/>
      <text x="25.6" y="33.6" font-size="1.6" font-weight="700" fill="${C.muted}">TAM</text>
      <circle cx="29.6" cy="38.6" r="4.2" fill="${C.frontend}" opacity=".22"/>
      <circle cx="29.6" cy="39.5" r="2.9" fill="${C.frontend}" opacity=".5"/>
      <circle cx="29.6" cy="40.4" r="1.5" fill="${C.gold}"/>
      <rect x="35.4" y="39.6" width="2" height="3" rx=".4" fill="${C.backend}" opacity=".5"/>
      <rect x="38.4" y="37.8" width="2" height="4.8" rx=".4" fill="${C.backend}" opacity=".75"/>
      <rect x="41.4" y="35.8" width="2" height="6.8" rx=".4" fill="${C.backend}"/>
      <polyline points="35.6,37.6 38.8,35.6 41.6,33.6 43.2,33.6" fill="none" stroke="${C.gold}" stroke-width=".6" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="45,33.6 43,32.4 43,34.8" fill="${C.gold}"/>
      ${shadow(17.2, 49.4, 4.6)}
      ${Kit.person(17.2, 49.5, { k: .95, pose: 'point', skin: 3, hair: 'bun', hairColor: Kit.HAIR.black, top: C.kw, topStyle: 'blazer', pants: '#3F4A63', mood: 'grin' })}
      ${shadow(54, 48.6, 6)}
      ${coinStack(49, 48.6, 5)}
      ${coin(5, 49.8, 30.8, 8.4)}`,

    // Agency building sends a freelancer; the rate tag drops from 2 to 1 coin.
    'outsourcing-partner': () => `
      <rect x="13.4" y="31.4" width="10.4" height="17.2" rx=".9" fill="#4A4D55"/>
      <path d="M20.6 31.4h2.3a.9 .9 0 0 1 .9 .9v16.3h-3.2z" fill="#000" opacity=".2"/>
      <rect x="13" y="30.6" width="11.2" height="1.6" rx=".6" fill="#5B5F68"/>
      ${[0, 1, 2, 3].map(r => [0, 1].map(c => `<rect x="${15.1 + c * 3.8}" y="${33.4 + r * 3.1}" width="2.6" height="2" rx=".35" fill="${(r + c) % 3 ? C.gold : Kit.dark(C.gold, .45)}" opacity="${(r + c) % 3 ? .9 : .7}"/>`).join('')).join('')}
      <rect x="17.4" y="45.8" width="2.4" height="2.8" rx=".3" fill="${C.code}"/>
      ${arrow(25.4, 41.2, 28.6, C.kw)}
      ${Kit.dev(37.6, 47.6, { k: .92, deskW: 17, skin: 4, hair: 'curly', hairColor: Kit.HAIR.black, top: C.frontend, topStyle: 'hoodie', headset: C.gold, mood: 'smile', laptopColor: '#5B5F68' })}
      <g>
        <path d="M48.6 31.4h9.6a1 1 0 0 1 1 1v15.2a1 1 0 0 1 -1 1h-9.6a1 1 0 0 1 -1 -1v-15.2a1 1 0 0 1 1 -1z" fill="${C.bg}" stroke="${C.border}" stroke-width=".3"/>
        <text x="53.4" y="34" font-size="1.6" font-weight="700" fill="${C.muted}" text-anchor="middle">RATE</text>
        <g opacity=".45">${coin(2, 50.6, 34.8, 5.6)}</g>
        <line x1="50.2" y1="40.2" x2="56.6" y2="35" stroke="#F26D6D" stroke-width=".6" stroke-linecap="round"/>
        <polygon points="53.4,42.4 52.2,41 54.6,41" fill="${C.muted}"/>
        ${coin(1, 50.6, 42.6, 5.6)}
      </g>`,

    // Two hackers on a shared desk, the countdown above and the trophy waiting.
    hackathon: () => `
      ${Kit.person(19.6, 48.3, { k: .86, skin: 0, hair: 'side', hairColor: Kit.HAIR.pink, top: C.agent, topStyle: 'hoodie', glasses: true, mood: 'grin' })}
      ${Kit.person(32.4, 48.3, { k: .86, skin: 3, hair: 'buzz', hairColor: Kit.HAIR.black, top: C.backend, topStyle: 'tee', beard: true, mood: 'talk', flip: true })}
      ${Kit.laptop(19.6, 48.1, .86, { color: '#5B5F68' })}
      ${Kit.laptop(32.4, 48.1, .86, { color: '#6B6F78' })}
      <g transform="translate(26 46.6)">
        <rect x="-1.3" y="-1.5" width="2.6" height="1.5" rx=".3" fill="${C.kw}"/>
        <rect x="-1.3" y="-1.5" width="2.6" height=".5" rx=".2" fill="${Kit.dark(C.kw, .3)}"/>
        <path d="M1.3 -1.2q.9 0 .9 .6t-.9 .5" fill="none" stroke="${C.kw}" stroke-width=".3"/>
      </g>
      ${Kit.desk(26, 48.1, 28)}
      <rect x="42.6" y="30.8" width="17.6" height="6.4" rx="1" fill="${C.code}" stroke="${C.border}" stroke-width=".3"/>
      <circle cx="44.4" cy="32.6" r=".55" fill="#F26D6D"/>
      <text x="52" y="35.8" font-size="3.6" font-weight="800" fill="${C.kw}" text-anchor="middle">47:59</text>
      ${shadow(51.4, 48.6, 4.8)}
      <g transform="translate(46.4 38.4)">
        <path d="M1 0 H9 V3.8 Q9 7.6 5 7.6 Q1 7.6 1 3.8 Z" fill="${C.gold}"/>
        <path d="M6.6 0 H9 V3.8 Q9 7.2 6 7.55 Q7.6 6 7.6 3.8 Z" fill="${C.goldDark}" opacity=".55"/>
        <path d="M1 1 H-.5 Q-.7 4.2 1.5 4.8 M9 1 H10.5 Q10.7 4.2 8.5 4.8" fill="none" stroke="${C.gold}" stroke-width=".65"/>
        <rect x="4.3" y="7.6" width="1.4" height="1.4" fill="${C.goldDark}"/>
        <rect x="2.4" y="8.9" width="5.2" height="1.3" rx=".4" fill="${C.goldDark}"/>
        <use href="#i-star" x="3.2" y="1.2" width="3.6" height="3.6" fill="#fff" opacity=".85"/>
      </g>`,

    // A literal angel (halo, wings) hands over a cheque for a slice of the pie.
    'angel-investor': () => {
      const wing = s => `<g transform="translate(20.8 39.2) scale(${s} 1)">
        <path d="M2.4 0C5.4 -3.6 9.6 -4.4 10.4 -3C10.9 -2 10 -0.6 9 0.1C9.9 0.4 10 1.6 9 2.3C9.6 2.9 9 4.2 7.6 4.4C8 5.3 6.6 6.3 4.6 5.6C3 5 2.4 3 2.4 0Z" fill="#C9CCD3"/>
        <path d="M2.4 0C5.4 -3.6 9.6 -4.4 10.4 -3C9 -2.6 6.2 -1.2 4.4 1.6C3.6 2.8 3 2.6 2.4 0Z" fill="#F1F2F4"/>
        <path d="M4.6 2.2Q6.6 1.4 8.6 0.6M4.4 3.8Q6 3.4 7.4 2.9" fill="none" stroke="#9EA2AB" stroke-width=".3" stroke-linecap="round"/></g>`;
      return `
      ${wing(-1)}${wing(1)}
      ${Kit.person(20.8, 49.2, { k: .92, skin: 1, hair: 'grey', beard: Kit.HAIR.grey, top: '#3D4A6B', topStyle: 'blazer', accessory: 'halo', mood: 'happy' })}
      <g transform="translate(1 0) rotate(-7 39.6 38.6)">
        <rect x="31.4" y="34.6" width="16.6" height="8.6" rx=".9" fill="#000" opacity=".3" transform="translate(.4 .6)"/>
        <rect x="31.4" y="34.6" width="16.6" height="8.6" rx=".9" fill="${C.text}"/>
        <rect x="31.4" y="34.6" width="16.6" height="1.7" rx=".9" fill="${C.gold}"/>
        <rect x="31.4" y="35.6" width="16.6" height=".7" fill="${C.gold}"/>
        <text x="32.6" y="38.8" font-size="1.6" font-weight="700" fill="${C.goldDark}">PAY TO</text>
        <text x="32.6" y="41.4" font-size="1.9" font-weight="800" fill="${C.bg}">you.kt</text>
        <path d="M40.6 41.6q1 -1.6 1.8 -.4t1.6 -.6 1.4 .2" fill="none" stroke="#2F5BD6" stroke-width=".3" stroke-linecap="round"/>
        <text x="46.8" y="39" font-size="2" font-weight="800" fill="${Kit.dark(C.backend, .2)}" text-anchor="end">€€€€</text>
      </g>
      <circle cx="55.2" cy="40.4" r="5" fill="#000" opacity=".25" transform="translate(.3 .5)"/>
      <circle cx="55.2" cy="40.4" r="5" fill="${C.surface2}" stroke="${C.border}" stroke-width=".3"/>
      <path d="M55.2 40.4 L55.2 35.4 A5 5 0 0 1 58.14 36.36 Z" fill="${C.gold}" transform="translate(.5 -.5)"/>
      <text x="55.2" y="48.8" font-size="1.8" font-weight="700" fill="${C.gold}" text-anchor="middle">10%</text>`;
    },

    // A 40-page form, stamped GRANTED, turns into a pile of banknotes.
    'eu-grant': () => `
      <rect x="18.8" y="30.6" width="17" height="17.6" rx=".9" fill="${C.faint}"/>
      <rect x="16.8" y="31.3" width="17" height="17.6" rx=".9" fill="${C.muted}"/>
      <rect x="15" y="32.3" width="17" height="16.6" rx=".9" fill="#000" opacity=".3"/>
      <rect x="14.6" y="32" width="17" height="16.6" rx=".9" fill="${C.text}"/>
      <rect x="14.6" y="32" width="17" height="3.4" rx=".9" fill="#2F5BD6"/>
      <rect x="14.6" y="34" width="17" height="1.4" fill="#2F5BD6"/>
      ${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<circle cx="${(17.4 + 1.1 * Math.cos(a)).toFixed(2)}" cy="${(33.7 + 1.1 * Math.sin(a)).toFixed(2)}" r=".28" fill="${C.gold}"/>`; }).join('')}
      <text x="19.6" y="34.4" font-size="1.6" font-weight="700" fill="#fff">GRANT</text>
      ${[0, 1, 2, 3].map(i => `<rect x="15.8" y="${37 + i * 2.4}" width="1.4" height="1.4" rx=".2" fill="none" stroke="${C.faint}" stroke-width=".3"/>
        <rect x="18.2" y="${37.4 + i * 2.4}" width="${[10, 8, 11, 7][i]}" height=".6" rx=".3" fill="${C.faint}"/>`).join('')}
      ${[0, 1, 2, 3].map(i => `<path d="M16 ${37.7 + i * 2.4} L16.5 ${38.2 + i * 2.4} L17.4 ${37 + i * 2.4}" fill="none" stroke="${C.backend}" stroke-width=".35" stroke-linecap="round"/>`).join('')}
      <text x="30.6" y="47.9" font-size="1.6" fill="${C.faint}" text-anchor="end">p. 40/40</text>
      <g transform="rotate(-12 24 43) translate(-3.2 .4)">
        <rect x="21.4" y="40.6" width="12" height="4.4" rx=".7" fill="${C.text}" stroke="${C.backend}" stroke-width=".5"/>
        <text x="27.4" y="43.7" font-size="2" font-weight="800" fill="${Kit.dark(C.backend, .15)}" text-anchor="middle">GRANTED</text>
      </g>
      ${arrow(36.4, 40, 43.2, C.gold)}
      ${shadow(52.4, 48.4, 7)}
      ${note(46.4, 41, -4)}${note(47.6, 37.4, 6)}${note(46.8, 33.6, -8)}
      ${coin(null, 56.6, 42.4, 4.6)}${coin(null, 44.4, 44.2, 3.8)}`,

    // The team slide: every hire carries a price tag, the bag says A.
    'series-a': () => {
      const cast = [
        [19, { skin: 0, hair: 'long', hairColor: Kit.HAIR.blonde, top: C.frontend, mood: 'happy' }],
        [28.4, { skin: 3, hair: 'buzz', hairColor: Kit.HAIR.black, top: C.backend, topStyle: 'hoodie', glasses: true, mood: 'grin' }],
        [37.8, { skin: 4, hair: 'curly', hairColor: Kit.HAIR.black, top: C.agent, topStyle: 'shirt', mood: 'smile' }],
      ];
      return `
      <rect x="12.6" y="30.4" width="31.6" height="18.4" rx="1.1" fill="${C.code}" stroke="${C.border}" stroke-width=".35"/>
      <text x="14.2" y="33.2" font-size="1.6" font-weight="700" fill="${C.muted}">OUR TEAM</text>
            <g>${cast.map(([x, o]) => Kit.person(x, 48.6, { k: .62, ...o })).join('')}</g>
      ${cast.map(([x]) => coin(2, x - 2, 33.6, 4)).join('')}
      ${arrow(45.6, 40.6, 49.8, C.gold)}
      ${shadow(56, 48.6, 5.4)}
      <g transform="translate(51 32.6)">
        <path d="M2.6 3.4 Q0 7 0 10.8 Q0 15.6 4.8 15.6 Q9.6 15.6 9.6 10.8 Q9.6 7 7 3.4 Z" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3"/>
        <path d="M6.2 3.6 Q9.6 7 9.6 10.8 Q9.6 15.6 4.8 15.6 Q8 14.4 8 10.8 Q8 7 6.2 3.6 Z" fill="${C.goldDark}" opacity=".45"/>
        <path d="M2.4 3.4 L1.4 0.6 Q4.8 1.6 8.2 0.6 L7.2 3.4 Z" fill="${C.goldDark}"/>
        <rect x="2.2" y="3" width="5.2" height="1" rx=".5" fill="${C.kw}"/>
        <path d="M2 7.4Q1.4 9 1.6 10.6" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round" opacity=".45"/>
        <text x="4.8" y="12.6" font-size="4" font-weight="800" fill="#3A2A05" text-anchor="middle">A</text>
      </g>`;
    },

    // A happy customer pays with a card; every shipped feature earns 2.
    'first-paying-customers': () => `
      ${Kit.person(18.6, 48.6, { k: .94, skin: 2, hair: 'long', hairColor: Kit.HAIR.chestnut, top: C.frontend, topStyle: 'shirt', mood: 'happy' })}
      <g transform="rotate(-16 24 41.6)">
        <rect x="20" y="39.2" width="8" height="5" rx=".7" fill="#000" opacity=".3" transform="translate(.3 .4)"/>
        <rect x="20" y="39.2" width="8" height="5" rx=".7" fill="${C.gold}"/>
        <rect x="20" y="40.2" width="8" height=".9" fill="${C.goldDark}"/>
        <rect x="21" y="42" width="1.8" height="1.3" rx=".25" fill="#E8EAED"/>
        <rect x="23.6" y="42.7" width="3.4" height=".45" rx=".2" fill="${C.goldDark}"/>
      </g>
      <circle cx="21.2" cy="43.8" r=".95" fill="${Kit.SKIN[2]}"/>
      ${arrow(29.2, 38.6, 33, C.gold)}
      ${[34.2, 43.2, 52.2].map(x => `
        ${fStar(x, 31.6, 7.6)}
        ${coin(2, x + 1.3, 40.6, 5)}`).join('')}
      <path d="M43.4 47.4 L44.3 48.3 L45.6 46.7" fill="none" stroke="${C.backend}" stroke-width=".5" stroke-linecap="round"/>
      <text x="46.2" y="48.4" font-size="1.7" font-weight="700" fill="${C.backend}">PAID</text>`,

    // Speaker at the lectern, the live demo on the big screen, the audience in silhouette.
    'kotlinconf-talk': () => `
      <polygon points="22.4,29.6 18.4,29.6 12.4,49.4 28.4,49.4" fill="${C.gold}" opacity=".1"/>
      <rect x="31" y="30.6" width="29" height="13.2" rx="1" fill="#000" opacity=".3" transform="translate(.4 .5)"/>
      <rect x="31" y="30.6" width="29" height="13.2" rx="1" fill="${C.code}" stroke="${C.border}" stroke-width=".35"/>
      <circle cx="33.2" cy="32.8" r=".7" fill="#F26D6D"/>
      <text x="34.4" y="33.4" font-size="1.6" font-weight="700" fill="#F26D6D">LIVE</text>
      <g transform="translate(39.4 31.4) scale(.64)">${phone(0, 0)}</g>
      <text x="53.4" y="36.4" font-size="1.7" font-weight="700" fill="${C.backend}" text-anchor="middle">demo</text>
      <text x="53.4" y="39.2" font-size="1.7" font-weight="700" fill="${C.backend}" text-anchor="middle">works</text>
      <path d="M51.6 40.6 L52.8 41.8 L55.2 39.8" fill="none" stroke="${C.backend}" stroke-width=".5" stroke-linecap="round"/>
      ${Kit.person(20.4, 49.4, { k: .92, pose: 'present', skin: 2, hair: 'side', hairColor: Kit.HAIR.black, top: C.frontend, topStyle: 'hoodie', mood: 'talk' })}
      ${[[32.6, '#4A4E57'], [37.2, '#555963'], [41.8, '#4A4E57'], [46.4, '#555963'], [51, '#4A4E57'], [55.6, '#555963']].map(([x, c], i) => `
        <path d="M${x - 2} 49.6v-1.2a2 1.6 0 0 1 4 0v1.2z" fill="${c}"/>
        <circle cx="${x}" cy="${i % 2 ? 46 : 46.4}" r="1.25" fill="${c}"/>`).join('')}`,

    // The teacher points at the coroutine bug on the whiteboard; libraries pay per head.
    'kotlin-workshop': () => `
      <rect x="18.4" y="45" width="1" height="3.6" fill="#4A4D55"/><rect x="31.6" y="45" width="1" height="3.6" fill="#4A4D55"/>
      <rect x="13.2" y="31.4" width="25.4" height="14.2" rx="1" fill="#000" opacity=".3" transform="translate(.4 .5)"/>
      <rect x="13.2" y="31.4" width="25.4" height="14.2" rx="1" fill="#9DA0A8"/>
      <rect x="14" y="32.2" width="23.8" height="12.6" rx=".6" fill="#F4F5F7"/>
      <text x="15.2" y="35.2" font-size="1.7" font-weight="700" fill="${Kit.dark(C.kw, .2)}">suspend fun</text>
      <text x="15.2" y="38" font-size="1.7" fill="#2F6FD6">launch {</text>
      <text x="17.2" y="40.8" font-size="1.7" fill="#3E9E68">delay(1000)</text>
      <text x="15.2" y="43.6" font-size="1.7" fill="#2F6FD6">}</text>
      <path d="M15.2 38.6q1.2 .5 2.4 0t2.4 0 2.4 0 2.4 0" fill="none" stroke="#E44857" stroke-width=".35" stroke-linecap="round"/>
      <rect x="27" y="44.8" width="5" height=".8" rx=".3" fill="${C.kw}"/>
      ${shadow(44.4, 49.4, 4.2)}
      ${Kit.person(44.4, 49.5, { k: .92, pose: 'point', flip: true, skin: 0, hair: 'long', hairColor: Kit.HAIR.auburn, glasses: true, top: C.backend, topStyle: 'shirt', pants: '#3F4A63', mood: 'talk' })}
      ${[0, 1, 2].map(i => `${iconAt('library', null, 50.6, 31.4 + i * 6, 5.2)}${coin(2, 56.2, 31.8 + i * 6, 4.4)}`).join('')}`,

    // Rocket launch, demo day on the calendar, cloud credits, 7% equity.
    accelerator: () => `
      ${[[14.2, 47.2, 2.1, '#4A4D55'], [17.4, 47.8, 1.6, '#555963'], [16.2, 44.6, 1.5, '#555963'], [19.6, 45.4, 1.3, '#62666F'], [21.2, 43.4, 1, '#6B7079']].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')}
      <path d="M14.6 46.2 Q15.6 45.3 16.6 45.6" fill="none" stroke="#6B7079" stroke-width=".4" stroke-linecap="round"/>
      <g transform="translate(26 36.6) rotate(45)">
        <path d="M0 -8 Q3.4 -4.6 3.4 1 L3.4 5 L-3.4 5 L-3.4 1 Q-3.4 -4.6 0 -8 Z" fill="${C.text}"/>
        <path d="M0 -8 Q3.4 -4.6 3.4 1 L3.4 5 L1.6 5 L1.6 1 Q1.6 -4.6 0 -8 Z" fill="#000" opacity=".14"/>
        <circle cx="0" cy="-1.4" r="1.5" fill="${C.frontend}" stroke="${C.surface2}" stroke-width=".4"/>
        <circle cx="-.45" cy="-1.85" r=".45" fill="#fff" opacity=".6"/>
        <path d="M-3.4 1.6 L-5.8 5.8 L-3.4 5 Z M3.4 1.6 L5.8 5.8 L3.4 5 Z" fill="#E44857"/>
        <path d="M-2.2 5 L0 9.4 L2.2 5 Z" fill="${C.gold}"/>
        <path d="M-1.1 5 L0 7.4 L1.1 5 Z" fill="${C.kw}"/>
      </g>
      <rect x="37.4" y="31" width="11" height="12" rx="1" fill="#000" opacity=".3" transform="translate(.4 .5)"/>
      <rect x="37.4" y="31" width="11" height="12" rx="1" fill="${C.text}"/>
      <rect x="37.4" y="31" width="11" height="3.4" rx="1" fill="#E44857"/>
      <rect x="37.4" y="33.2" width="11" height="1.2" fill="#E44857"/>
      <rect x="39.6" y="30.2" width=".8" height="1.8" rx=".4" fill="${C.muted}"/><rect x="45.4" y="30.2" width=".8" height="1.8" rx=".4" fill="${C.muted}"/>
      <text x="42.9" y="33.6" font-size="1.6" font-weight="700" fill="#fff" text-anchor="middle">DAY 90</text>
      <text x="42.9" y="38.6" font-size="2.2" font-weight="800" fill="${C.bg}" text-anchor="middle">DEMO</text>
      <text x="42.9" y="41.4" font-size="2.2" font-weight="800" fill="${C.bg}" text-anchor="middle">DAY</text>
      <text x="42.9" y="47.4" font-size="1.7" fill="${C.muted}" text-anchor="middle">3 months</text>
      <g transform="translate(50.2 32.4)">
        <path d="M2.2 6.6 Q0 6.6 0 4.6 Q0 2.6 2.2 2.6 Q2.8 0 5.4 0 Q8 0 8.6 2.4 Q10.6 2.4 10.6 4.5 Q10.6 6.6 8.4 6.6 Z" fill="${Kit.dark(C.frontend, .3)}" transform="translate(.3 .5)"/>
        <path d="M2.2 6.6 Q0 6.6 0 4.6 Q0 2.6 2.2 2.6 Q2.8 0 5.4 0 Q8 0 8.6 2.4 Q10.6 2.4 10.6 4.5 Q10.6 6.6 8.4 6.6 Z" fill="${C.frontend}"/>
        <path d="M2.6 2.9 Q3.2 .9 5.2 .7" fill="none" stroke="#fff" stroke-width=".4" stroke-linecap="round" opacity=".5"/>
        <text x="5.3" y="5.4" font-size="1.6" font-weight="800" fill="${C.bg}" text-anchor="middle">credits</text>
      </g>
      <circle cx="55.5" cy="43.6" r="3.4" fill="${C.surface2}" stroke="${C.border}" stroke-width=".3"/>
      <path d="M55.5 43.6 L55.5 40.2 A3.4 3.4 0 0 1 56.97 40.53 Z" fill="${C.gold}" transform="translate(.3 -.3)"/>
      <text x="55.5" y="49" font-size="1.6" font-weight="700" fill="${C.gold}" text-anchor="middle">7%</text>`,
  });

  CARDS.push(
    {
      id: 'seed-round', name: 'Seed Round', type: 'business', sprint: 1, copies: [3], points: 0,
      file: 'Pitch.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 5, label: 'NOW', text: '+5 coins from the bank' }],
      code: [[C.text, 'slides.'], [C.fn, 'forEach'], [C.text, ' { it.'], [C.fn, 'add'], [C.text, '('], [C.str, '"Kotlin"'], [C.text, ') }']],
      comment: 'ten slides, one TAM chart, all Kotlin',
    },
    {
      id: 'outsourcing-partner', name: 'Outsourcing Partner', type: 'business', sprint: 1, copies: [3], points: 0,
      file: 'Vendors.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 1, label: 'ALWAYS', text: 'Each freelancer costs you {coin:1}' }],
      code: [[C.kw, 'val '], [C.text, 'rate = '], [C.text, 'agency.'], [C.fn, 'quote'], [C.text, '() / '], [C.fn, '2']],
      comment: 'same endpoints at half the invoice',
    },
    {
      id: 'hackathon', name: 'Hackathon', type: 'business', sprint: 1, copies: [3], points: 1,
      file: 'Hackathon.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 3, label: 'NOW', text: '+3 coins from the bank' }],
      code: [[C.fn, 'withTimeout'], [C.text, '('], [C.fn, '48'], [C.text, '.hours) { '], [C.fn, 'prototype'], [C.text, '() }']],
      comment: 'the prototype becomes the product',
    },
    {
      id: 'angel-investor', name: 'Angel Investor', type: 'business', sprint: 1, copies: [4], points: 0,
      file: 'CapTable.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 4, label: 'NOW', text: '+4 coins from the bank' }],
      code: [[C.text, 'equity -= '], [C.cls, 'Angel'], [C.text, '('], [C.str, '"believer"'], [C.text, ').'], [C.fn, 'share']],
      comment: 'believes in you, and in 10% of you',
    },
    {
      id: 'eu-grant', name: 'EU Innovation Grant', type: 'business', sprint: 1, copies: [5], points: 0,
      file: 'Grant.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 4, label: 'NOW', text: '+4 coins from the bank' }],
      code: [[C.fn, 'require'], [C.text, '(form.pages >= '], [C.fn, '40'], [C.text, ') { '], [C.str, '"impact"'], [C.text, ' }']],
      comment: 'free money, after a 40-page form',
    },
    {
      id: 'series-a', name: 'Series A', type: 'business', sprint: 2, copies: [3], points: 0,
      file: 'SeriesA.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 2, label: 'NOW', text: 'per your {team} Team card' }],
      code: [[C.kw, 'val '], [C.text, 'raise = team.'], [C.fn, 'sumOf'], [C.text, ' { '], [C.fn, '2'], [C.text, '.coins }']],
      comment: 'every hire on the slide is worth cash',
    },
    {
      id: 'first-paying-customers', name: 'First Paying Customers', type: 'business', sprint: 2, copies: [3], points: 0,
      file: 'Billing.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 2, label: 'NOW', text: 'per your {feature} Feature card' }],
      code: [[C.kw, 'val '], [C.text, 'mrr = shipped.'], [C.fn, 'sumOf'], [C.text, ' { it.price }']],
      comment: 'every shipped feature finally earns',
    },
    {
      id: 'kotlinconf-talk', name: 'KotlinConf Talk', type: 'business', sprint: 2, copies: [3], points: 2,
      cost: ['frontend', 'backend'], file: 'Talk.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 2, label: 'NOW', text: '+2 coins from the bank' }],
      code: [[C.kw, 'suspend fun '], [C.fn, 'liveDemo'], [C.text, '() = app.'], [C.fn, 'run'], [C.text, '()']],
      comment: 'a live demo needs a working app',
    },
    {
      id: 'kotlin-workshop', name: 'Paid Kotlin Workshop', type: 'business', sprint: 2, copies: [4], points: 0,
      file: 'Workshop.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 2, label: 'NOW', text: 'per your {library} Library card' }],
      code: [[C.fn, 'launch'], [C.text, ' { '], [C.fn, 'teach'], [C.text, '('], [C.str, '"coroutines"'], [C.text, ') }']],
      comment: 'invoice per library you know',
    },
    {
      id: 'accelerator', name: 'Startup Accelerator', type: 'business', sprint: 2, copies: [5], points: 0,
      file: 'Accelerator.kt',
      effects: [{ kind: 'tile', icon: 'coin', amount: 4, label: 'NOW', text: '+4 coins from the bank' }],
      code: [[C.text, 'startup.'], [C.fn, 'apply'], [C.text, ' { equity -= '], [C.fn, '7'], [C.text, '.pct }']],
      comment: 'mentors, demo day and cloud credits',
    },
  );
})();
