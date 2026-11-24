// Sprint III features, batch A: AI Assistant, Multi-agent Workflow, Real-time Chat, Offline Mode, Web App,
// Scale to 1M Users, Featured on the App Store, Admin Panel, KotlinConf Keynote Demo.
// Sprint III cards are the big payoffs: every scene has a cast (Kit people / robots), depth and a clear focal point.
(() => {
const RED = '#F26D6D';
const INK = '#3A2A05';
const METAL = '#4A4D55';
const n2 = v => +v.toFixed(2);

// Soft floor shadow.
const shadow = (cx, cy, rx, ry = .55, o = .32) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}"/>`;
// Concentric glow (no gradients needed).
const glow = (cx, cy, r, color, o = .1) => [1, .72, .46].map(t => `<circle cx="${cx}" cy="${cy}" r="${n2(r * t)}" fill="${color}" opacity="${o}"/>`).join('');
// Four-point sparkle.
const spark = (x, y, r, color = C.gold) => `<path d="M${x} ${n2(y - r)}L${n2(x + r * .26)} ${n2(y - r * .26)} ${n2(x + r)} ${y} ${n2(x + r * .26)} ${n2(y + r * .26)} ${x} ${n2(y + r)} ${n2(x - r * .26)} ${n2(y + r * .26)} ${n2(x - r)} ${y} ${n2(x - r * .26)} ${n2(y - r * .26)}Z" fill="${color}"/>`;
// Arrow heads.
const headR = (x, y, c, s = 1) => `<polygon points="${x},${y} ${n2(x - 1.7 * s)},${n2(y - 1.1 * s)} ${n2(x - 1.7 * s)},${n2(y + 1.1 * s)}" fill="${c}"/>`;
const headD = (x, y, c, s = 1) => `<polygon points="${x},${y} ${n2(x - 1.1 * s)},${n2(y - 1.7 * s)} ${n2(x + 1.1 * s)},${n2(y - 1.7 * s)}" fill="${c}"/>`;
// Chat bubble with a tail on the bottom-left ('l') or bottom-right ('r').
const bubble = (x, y, w, h, color, tail, content) => {
  const tx = tail === 'l' ? x + 2 : x + w - 2, d = tail === 'l' ? -1 : 1;
  return `<rect x="${n2(x + .25)}" y="${n2(y + .35)}" width="${w}" height="${h}" rx="${n2(h / 2)}" fill="${Kit.dark(color, .35)}"/>
    <path d="M${n2(tx - 1)} ${n2(y + h - .6)}L${n2(tx + d * 1.6)} ${n2(y + h + 1.5)}L${n2(tx + 1)} ${n2(y + h - .6)}Z" fill="${color}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${n2(h / 2)}" fill="${color}"/>
    <path d="M${n2(x + h / 2)} ${n2(y + .55)}H${n2(x + w - h / 2)}" stroke="#fff" stroke-width=".3" stroke-linecap="round" opacity=".25"/>${content}`;
};
// Phone body with depth; returns the frame only (screen drawn by caller). (x, y) = top-left.
const handset = (x, y, w, h, color = C.frontend) => `
  ${shadow(n2(x + w / 2), n2(y + h + .1), n2(w * .45))}
  <rect x="${n2(x + .45)}" y="${n2(y + .35)}" width="${w}" height="${h}" rx="1.9" fill="${Kit.dark(color, .3)}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.9" fill="${color}"/>
  <path d="M${n2(x + 1.6)} ${n2(y + .55)}H${n2(x + w - 1.6)}" stroke="${Kit.light(color, .4)}" stroke-width=".35" stroke-linecap="round"/>`;
// Database cylinder.
const cylinder = (cx, top, rx, h, color) => {
  const ry = rx * .32, d1 = Kit.dark(color, .18), d2 = Kit.dark(color, .32);
  const disk = (y, c) => `<path d="M${n2(cx - rx)} ${n2(y)}V${n2(y + h / 3)}A${rx} ${n2(ry)} 0 0 0 ${n2(cx + rx)} ${n2(y + h / 3)}V${n2(y)}Z" fill="${c}"/>`;
  return `${shadow(cx, n2(top + h + ry), n2(rx * 1.05), n2(ry * .9))}
    ${disk(top + 2 * h / 3, d2)}${disk(top + h / 3, d1)}${disk(top, color)}
    ${[1, 2].map(i => `<path d="M${n2(cx - rx)} ${n2(top + i * h / 3)}A${rx} ${n2(ry)} 0 0 0 ${n2(cx + rx)} ${n2(top + i * h / 3)}" fill="none" stroke="${Kit.light(color, .35)}" stroke-width=".3" opacity=".7"/>`).join('')}
    <path d="M${n2(cx + rx * .45)} ${n2(top + ry * .9)}V${n2(top + h)}" stroke="#000" stroke-width="${n2(rx * .5)}" opacity=".08"/>
    <ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${n2(ry)}" fill="${Kit.light(color, .35)}"/>
    <ellipse cx="${cx}" cy="${n2(top + .1)}" rx="${n2(rx * .62)}" ry="${n2(ry * .5)}" fill="${Kit.light(color, .55)}" opacity=".6"/>`;
};
const check = (cx, cy, r, bg, fg = C.bg) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}"/>
  <polyline points="${n2(cx - r * .45)},${n2(cy + r * .02)} ${n2(cx - r * .1)},${n2(cy + r * .38)} ${n2(cx + r * .5)},${n2(cy - r * .35)}" fill="none" stroke="${fg}" stroke-width="${n2(r * .28)}" stroke-linecap="round" stroke-linejoin="round"/>`;

Object.assign(ART, {
  // A customer asks in the phone; the agent waves, calls a real function and the server answers.
  'ai-assistant': () => `
    ${handset(13.2, 27.4, 14.2, 24.6)}
    <rect x="14.3" y="29.4" width="12" height="19.6" rx=".7" fill="${C.bg}"/>
    <path d="M14.3 32.4V30.1A.7 .7 0 0 1 15 29.4H25.6A.7 .7 0 0 1 26.3 30.1V32.4Z" fill="${C.surface2}"/>
    <use href="#i-agent" x="15" y="29.75" width="2.3" height="2.3"/>
    <text x="17.9" y="31.6" font-size="1.6" font-weight="700" fill="${C.text}">Ask AI</text>
    <circle cx="25.2" cy="30.9" r=".45" fill="${C.backend}"/>
    ${bubble(15.9, 33.4, 9.9, 2.9, C.frontend, 'r', `<text x="20.85" y="35.4" font-size="1.6" font-weight="700" fill="${C.bg}" text-anchor="middle">order 42?</text>`)}
    ${bubble(14.9, 38, 8.2, 2.9, C.agent, 'l', `<text x="19" y="40" font-size="1.6" font-weight="700" fill="${C.bg}" text-anchor="middle">Friday!</text>`)}
    <rect x="14.9" y="42.5" width="10.8" height="4.6" rx=".7" fill="${C.surface2}"/>
    <rect x="15.6" y="43.2" width="2.6" height="2.4" rx=".35" fill="${C.gold}"/><path d="M15.6 44.1H18.2M16.9 43.2V44.1" stroke="${C.goldDark}" stroke-width=".3"/>
    <rect x="19" y="43.5" width="5.8" height=".75" rx=".37" fill="${C.border}"/>
    <rect x="19" y="45" width="5.8" height=".9" rx=".45" fill="${C.border}"/><rect x="19" y="45" width="4.4" height=".9" rx=".45" fill="${C.backend}"/>
    <circle cx="20.3" cy="50.4" r=".7" fill="${Kit.dark(C.frontend, .35)}"/>

    ${glow(36.4, 41.5, 8.5, C.agent, .09)}
    ${Kit.robot(36.4, 51.4, { k: 1.12, body: true, arms: 'wave', expression: 'happy' })}
    <path d="M43.6 40.4C44.6 37.4 45 35.4 46.4 32.8" fill="none" stroke="${C.agent}" stroke-width=".45" stroke-dasharray=".9 .7" stroke-linecap="round"/>
    ${spark(29.4, 33.2, 1.1)}${spark(31.2, 47.4, .7, C.agent)}

    <rect x="41.6" y="27.6" width="19.2" height="4.6" rx="1.3" fill="${Kit.dark(C.agent, .55)}"/>
    <rect x="41.6" y="27.3" width="19.2" height="4.6" rx="1.3" fill="${C.bg}" stroke="${C.agent}" stroke-width=".35"/>
    <text x="51.2" y="30.2" font-size="1.7" text-anchor="middle"><tspan fill="${C.fn}">getOrder</tspan><tspan fill="${C.text}">(</tspan><tspan fill="${C.fn}">42</tspan><tspan fill="${C.text}">)</tspan></text>
    <line x1="53.2" y1="32.4" x2="53.2" y2="34.6" stroke="${C.backend}" stroke-width=".6" stroke-linecap="round"/>${headD(53.2, 36.3, C.backend)}
    ${shadow(53.2, 51.4, 6.8)}
    ${serverRack(46.6, 37.1, .78)}`,

  // Three agents on an assembly line hand the work along; the human only approves the PR.
  'multi-agent-workflow': () => {
    const bots = [
      [18.4, Kit.mix(C.agent, C.frontend, .45), 'scan', 'PLAN'],
      [29.4, C.agent, 'focus', 'CODE'],
      [40.4, Kit.mix(C.agent, RED, .38), 'neutral', 'REVIEW'],
    ];
    const rollers = Array.from({ length: 12 }, (_, i) => `<circle cx="${n2(14 + i * 2.8)}" cy="48.6" r=".55" fill="${Kit.dark(METAL, .35)}"/>`).join('');
    const chevrons = [23.9, 34.9].map(x => `<path d="M${x - .5} 46.1L${x + .4} 46.85L${x - .5} 47.6" fill="none" stroke="${C.gold}" stroke-width=".4" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    return `
      <rect x="15.6" y="26.9" width="5.6" height="6.4" rx=".7" fill="${C.surface2}" stroke="${C.border}" stroke-width=".25"/>
      <rect x="17.1" y="26.4" width="2.6" height="1.1" rx=".4" fill="${C.gold}"/>
      ${[0, 1, 2].map(i => `${i < 2 ? check(17, n2(29 + i * 1.6), .5, C.backend) : `<circle cx="17" cy="32.2" r=".5" fill="none" stroke="${C.muted}" stroke-width=".25"/>`}<rect x="18" y="${n2(28.6 + i * 1.6)}" width="${[2.4, 2, 2.6][i]}" height=".75" rx=".37" fill="${C.border}"/>`).join('')}
      <rect x="26.2" y="27.3" width="6.4" height="5.2" rx=".9" fill="${C.code}" stroke="${C.border}" stroke-width=".25"/>
      <text x="29.4" y="30.9" font-size="2.2" font-weight="800" fill="${C.fn}" text-anchor="middle">{ }</text>
      <circle cx="39.8" cy="29.4" r="1.9" fill="${C.bg}" stroke="${C.text}" stroke-width=".55"/>
      <path d="M39 28.8Q39.5 28.3 40.2 28.4" stroke="#fff" stroke-width=".3" fill="none" stroke-linecap="round" opacity=".6"/>
      <line x1="41.2" y1="30.8" x2="42.6" y2="32.3" stroke="${C.text}" stroke-width=".8" stroke-linecap="round"/>

      <rect x="12.6" y="47.3" width="33.8" height="2.8" rx="1.3" fill="${Kit.dark(METAL, .2)}"/>
      <rect x="12.6" y="47" width="33.8" height="2.6" rx="1.3" fill="${METAL}"/>
      ${rollers}
      <rect x="13.2" y="47.1" width="32.6" height=".35" rx=".17" fill="${Kit.light(METAL, .2)}"/>
      ${bots.map(([x, col, ex]) => Kit.robot(x, 47.2, { k: .78, body: true, color: col, expression: ex })).join('')}
      ${chevrons}
      ${bots.map(([x, col, , label]) => `<text x="${x}" y="52.4" font-size="1.6" font-weight="800" fill="${Kit.light(col, .15)}" text-anchor="middle" letter-spacing=".1">${label}</text>`).join('')}

      <path d="M43.6 33.6Q45 30.6 47 30.4" fill="none" stroke="${C.agent}" stroke-width=".45" stroke-dasharray=".9 .7" stroke-linecap="round"/>
      ${headR(48.2, 30.4, C.agent, .75)}
      <rect x="48.7" y="27.3" width="12.2" height="7" rx="1.2" fill="${Kit.dark(C.backend, .55)}"/>
      <rect x="48.7" y="27" width="12.2" height="7" rx="1.2" fill="${C.bg}" stroke="${C.backend}" stroke-width=".35"/>
      <text x="49.9" y="29.9" font-size="1.65" font-weight="700" fill="${C.text}">PR #42</text>
      <text x="49.9" y="32.6" font-size="1.6" font-weight="700" fill="${C.backend}">approved</text>
      ${check(58.6, 29.3, 1.35, C.backend)}
      ${glow(54.8, 45, 6, C.backend, .07)}
      ${Kit.person(54.8, 52.6, { skin: 2, hair: 'bun', hairColor: Kit.HAIR.black, top: '#E8EAED', topStyle: 'shirt', glasses: true, mood: 'happy' })}`;
  },

  // Two people mid-conversation; their messages race both ways through one open pipe.
  'realtime-chat': () => {
    const mini = (x, c) => `<rect x="${x}" y="45.9" width="4" height="2.2" rx="1.1" fill="${c}"/><path d="M${x + .9} 47.8L${x + .5} 48.8L${x + 1.8} 48" fill="${c}"/>`;
    const handPhone = (x, rot) => `<g transform="rotate(${rot} ${x + 1.9} 47)">
      <rect x="${x + .3}" y="44.2" width="3.8" height="6.2" rx=".8" fill="${Kit.dark(METAL, .3)}"/>
      <rect x="${x}" y="44" width="3.8" height="6.2" rx=".8" fill="#2E3036" stroke="${METAL}" stroke-width=".25"/>
      <rect x="${x + .45}" y="44.6" width="2.9" height="4.6" rx=".35" fill="${C.frontend}" opacity=".85"/></g>`;
    return `
      ${Kit.person(19, 52.8, { skin: 3, hair: 'curly', hairColor: Kit.HAIR.black, top: C.frontend, topStyle: 'hoodie', mood: 'talk' })}
      ${handPhone(20.4, -12)}
      ${Kit.person(54, 52.8, { skin: 0, hair: 'long', hairColor: Kit.HAIR.auburn, top: C.backend, mood: 'grin', flip: true })}
      ${handPhone(48.8, 12)}
      ${bubble(23.2, 27.2, 13, 3.6, C.frontend, 'l', `<text x="29.7" y="29.6" font-size="1.75" font-weight="700" fill="${C.bg}" text-anchor="middle">ship it?</text>`)}
      ${bubble(36.4, 32.4, 13.4, 3.6, C.backend, 'r', `<text x="43.1" y="34.8" font-size="1.75" font-weight="700" fill="${C.bg}" text-anchor="middle">shipped!</text>`)}
      ${bubble(24.2, 37.6, 7.2, 3.2, C.frontend, 'l', [26.2, 27.8, 29.4].map((x, i) => `<circle cx="${x}" cy="39.2" r=".45" fill="${C.bg}" opacity="${[1, .75, .5][i]}"/>`).join(''))}
      <rect x="27.3" y="44.5" width="18.4" height="5.4" rx="2.7" fill="#000" opacity=".25"/>
      <rect x="27" y="44.1" width="18.4" height="5.4" rx="2.7" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
      <path d="M28.6 44.7H43.8" stroke="#fff" stroke-width=".3" stroke-linecap="round" opacity=".12"/>
      ${mini(29, C.frontend)}${mini(34.2, C.backend)}${mini(39.4, C.frontend)}
      <polygon points="25.7,46.8 27.1,45.6 27.1,48" fill="${C.kw}"/><polygon points="46.7,46.8 45.3,45.6 45.3,48" fill="${C.kw}"/>
      <text x="36.2" y="52.4" font-size="1.6" font-weight="700" fill="${C.kw}" text-anchor="middle" letter-spacing=".1">WebSocket</text>`;
  },

  // On the metro, no signal, and the app still works: everything is saved to the local database.
  'offline-mode': () => {
    const lights = [[18.4, 32.4, 5.4], [28.2, 32.4, 5]].map(([x, y, w]) =>
      `<rect x="${x}" y="${y - .45}" width="${w}" height=".9" rx=".45" fill="${C.gold}" opacity=".85"/><rect x="${x - 3}" y="${y - .3}" width="3" height=".6" rx=".3" fill="${C.gold}" opacity=".3"/>`).join('');
    const streaks = [[15.4, 36.2, 8], [27, 38.8, 6], [35.6, 35.4, 6]].map(([x, y, w]) =>
      `<rect x="${x}" y="${y}" width="${w}" height=".35" rx=".17" fill="#9DA0A8" opacity=".35"/>`).join('');
    return `
      <rect x="12.5" y="26.6" width="33.6" height="26.2" rx="1.9" fill="#363940"/>
      <rect x="14.4" y="28.4" width="29.8" height="16.2" rx="2" fill="${Kit.dark(METAL, .2)}"/>
      <rect x="15" y="29" width="28.6" height="15" rx="1.6" fill="#111215"/>
      ${lights}${streaks}
      <path d="M15.6 41.6L43 41.6" stroke="#2A2C31" stroke-width=".5"/>
      <rect x="12.5" y="46.2" width="33.6" height="1" fill="${C.frontend}" opacity=".35"/>
      <rect x="35.8" y="29.6" width="7.2" height="5.2" rx="1.2" fill="#1B1C20" stroke="${RED}" stroke-width=".3"/>
      <g transform="translate(37.1 33.8)">
        ${[0, 1, 2, 3].map(i => `<rect x="${i * 1.25}" y="${-.9 - i * .8}" width=".85" height="${n2(.9 + i * .8)}" rx=".2" fill="#5A5E66"/>`).join('')}
        <line x1="-.4" y1="-3.6" x2="5" y2=".4" stroke="#111215" stroke-width="1"/><line x1="-.4" y1="-3.6" x2="5" y2=".4" stroke="${RED}" stroke-width=".55" stroke-linecap="round"/>
      </g>
      ${Kit.person(27.6, 52.8, { skin: 1, hair: 'side', hairColor: Kit.HAIR.brown, top: C.backend, topStyle: 'hoodie', mood: 'smile', k: 1.04 })}
      <g transform="rotate(-8 31.6 46)">
        <rect x="30.1" y="42.6" width="4.2" height="6.8" rx=".9" fill="${Kit.dark(C.frontend, .3)}"/>
        <rect x="29.8" y="42.4" width="4.2" height="6.8" rx=".9" fill="${C.frontend}"/>
        <rect x="30.3" y="43.1" width="3.2" height="5" rx=".35" fill="${C.bg}"/>
        ${check(31.9, 45.6, 1.05, C.backend)}
      </g>
      <path d="M35 43.4Q41 41.8 47.4 41.2" fill="none" stroke="${C.backend}" stroke-width=".5" stroke-dasharray=".9 .7" stroke-linecap="round"/>
      ${headR(48.8, 41.1, C.backend, .8)}
      ${glow(55, 38.5, 8, C.backend, .07)}
      ${cylinder(55, 30.6, 5.4, 14.2, C.backend)}
      ${check(59.2, 30.4, 1.5, C.gold, INK)}
      <text x="55" y="51.4" font-size="1.65" font-weight="700" fill="${C.backend}" text-anchor="middle">local db</text>`;
  },

  // The phone app and the browser app are the same screen; wasm is the bridge.
  'web-version': () => {
    const ui = (x, y, w, s) => {   // the shared app UI, s = scale
      const bar = (bx, by, bw, c = C.border) => `<rect x="${n2(bx)}" y="${n2(by)}" width="${n2(bw)}" height="${n2(.8 * s)}" rx="${n2(.4 * s)}" fill="${c}"/>`;
      return `<rect x="${x}" y="${y}" width="${w}" height="${n2(1.8 * s)}" rx="${n2(.5 * s)}" fill="${C.frontend}"/>
        <circle cx="${n2(x + 1.9 * s)}" cy="${n2(y + 4.4 * s)}" r="${n2(1.5 * s)}" fill="${C.kw}"/>
        <path d="M${n2(x + .9 * s)} ${n2(y + 5.6 * s)}Q${n2(x + 1.9 * s)} ${n2(y + 4.4 * s)} ${n2(x + 2.9 * s)} ${n2(y + 5.6 * s)}" fill="${Kit.dark(C.kw, .25)}"/>
        ${bar(x + 4 * s, y + 3.3 * s, w * .42)}${bar(x + 4 * s, y + 4.9 * s, w * .3)}
        <rect x="${n2(x)}" y="${n2(y + 6.8 * s)}" width="${w}" height="${n2(1.9 * s)}" rx="${n2(.95 * s)}" fill="${C.backend}"/>`;
    };
    const card = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".6" fill="${C.surface2}"/>
      <circle cx="${n2(x + 1.7)}" cy="${n2(y + 1.7)}" r=".85" fill="${c}"/><rect x="${n2(x + 1)}" y="${n2(y + h - 1.5)}" width="${n2(w - 2)}" height=".7" rx=".35" fill="${C.border}"/>`;
    return `
      <rect x="28.4" y="26.6" width="32.4" height="20" rx="1.4" fill="${C.surface2}" opacity=".45"/>
      <rect x="26.7" y="27.6" width="33.6" height="22" rx="1.4" fill="${C.surface2}" opacity=".7"/>
      <rect x="25.3" y="29.2" width="35.4" height="23" rx="1.4" fill="#000" opacity=".28"/>
      <rect x="24.8" y="28.7" width="35.4" height="23" rx="1.4" fill="${C.bg}" stroke="${C.border}" stroke-width=".35"/>
      <path d="M24.8 32.1V30.1A1.4 1.4 0 0 1 26.2 28.7H58.8A1.4 1.4 0 0 1 60.2 30.1V32.1Z" fill="${C.surface2}"/>
      <circle cx="26.6" cy="30.4" r=".45" fill="${RED}"/><circle cx="28" cy="30.4" r=".45" fill="${C.gold}"/><circle cx="29.4" cy="30.4" r=".45" fill="#5FB865"/>
      <rect x="31" y="29.3" width="28.4" height="2.2" rx="1.1" fill="${C.bg}"/>
      <rect x="32" y="30.15" width="1.1" height=".9" rx=".2" fill="${C.backend}"/><path d="M32.2 30.2V29.85A.35 .35 0 0 1 32.9 29.85V30.2" fill="none" stroke="${C.backend}" stroke-width=".22"/>
      <text x="33.8" y="30.95" font-size="1.6" fill="${C.muted}">app.example</text>
      ${ui(26.6, 33.3, 31.8, 1.15)}
      <text x="42.5" y="42.65" font-size="1.6" font-weight="800" fill="${C.bg}" text-anchor="middle">Get started</text>
      ${card(26.6, 44.6, 10, 5.6, C.kw)}${card(37.5, 44.6, 10, 5.6, C.agent)}${card(48.4, 44.6, 10, 5.6, C.backend)}
      <g transform="translate(50.6 42.2)">
        <circle r="2.3" fill="none" stroke="#fff" stroke-width=".25" opacity=".35"/><circle r="1.3" fill="none" stroke="#fff" stroke-width=".3" opacity=".6"/>
        <path d="M0 0L0 4.1L1 3.2L1.75 4.8L2.5 4.45L1.75 2.9L3 2.8Z" fill="#fff" stroke="${C.bg}" stroke-width=".3" stroke-linejoin="round"/>
      </g>
      ${handset(12.6, 31.6, 10.4, 19.6)}
      <rect x="13.6" y="33.4" width="8.4" height="14.6" rx=".5" fill="${C.bg}"/>
      ${ui(14.3, 34.2, 7, .62)}
      ${card(14.3, 40.6, 7, 3.4, C.kw).replace(/<rect x="[\d.]+" y="[\d.]+" width="5" height=".7"[^>]*>/, '')}
      <rect x="14.3" y="44.6" width="7" height="2.6" rx=".6" fill="${C.surface2}"/><circle cx="15.6" cy="45.9" r=".7" fill="${C.agent}"/>
      <circle cx="17.8" cy="49.6" r=".7" fill="${Kit.dark(C.frontend, .35)}"/>
      <rect x="20.6" y="38.2" width="7.6" height="3.9" rx="1.2" fill="#000" opacity=".3"/>
      <rect x="20.3" y="37.8" width="7.6" height="3.9" rx="1.2" fill="url(#bolt)"/>
      <text x="24.1" y="40.3" font-size="1.6" font-weight="800" fill="#fff" text-anchor="middle">wasm</text>
      ${spark(24.3, 35.4, .9)}`;
  },

  // A crowd of a million under a rocketing curve, servers at full tilt, and the bill to match.
  'scale-to-1m': () => {
    const pts = Array.from({ length: 13 }, (_, i) => { const t = i / 12; return [n2(15 + t * 31.4), n2(50.5 - 21.4 * Math.pow(t, 2.3))]; });
    const line = pts.map(p => p.join(',')).join(' ');
    const tops = [C.frontend, C.backend, C.kw, C.agent, C.gold, C.cls, '#E8EAED'];
    const hairs = ['short', 'long', 'curly', 'bun', 'buzz', 'side', 'bald', 'grey'];
    const cols = Object.values(Kit.HAIR);
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const crowd = (xs, y, k, op) => xs.map((x, i) => {
      const hair = hairs[Math.floor(rnd() * hairs.length)];
      return `<g opacity="${op}">${Kit.person(x, y, { k, skin: Math.floor(rnd() * 5), hair, hairColor: cols[Math.floor(rnd() * 6)], top: tops[(i * 3 + Math.floor(rnd() * 3)) % tops.length], mood: ['happy', 'grin', 'smile'][i % 3] })}</g>`;
    }).join('');
    return `
      <polygon points="15,50.5 ${line} 46.4,50.5" fill="${C.backend}" opacity=".08"/>
      <polyline points="${line}" fill="none" stroke="url(#bolt)" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="47.6,27.6 45,28.3 46.7,30.3" fill="#7F52FF"/>
      <rect x="12.9" y="27" width="24.2" height="8" rx="1.3" fill="#000" opacity=".3" transform="translate(.3 .35)"/>
      <rect x="12.9" y="27" width="24.2" height="8" rx="1.3" fill="${C.bg}" stroke="${C.goldDark}" stroke-width=".35"/>
      <text x="14.3" y="29.6" font-size="1.6" font-weight="700" fill="${C.muted}" letter-spacing=".15">USERS</text>
      <text x="14.3" y="33.6" font-size="3" font-weight="800" fill="${C.gold}">1,000,000</text>
      <path d="M33.4 30.1L34.9 28.4L36.4 30.1Z" fill="${C.backend}"/>
      ${crowd([16.2, 21.6, 27, 32.4, 37.8, 43.2], 47.6, .37, 1)}
      ${crowd([13.6 + 2.9, 22.2, 27.9, 33.6, 39.3, 45], 53, .45, 1)}
      ${glow(54.6, 36, 8, C.backend, .07)}
      ${serverRack(48.4, 28.4, .72)}
      <g transform="rotate(-5 54.3 47.3)">
        <rect x="47.7" y="43.9" width="13.2" height="7" rx=".5" fill="#000" opacity=".3" transform="translate(.3 .35)"/>
        <path d="M47.7 43.9H60.9V50.3L59.8 50.9L58.7 50.3L57.6 50.9L56.5 50.3L55.4 50.9L54.3 50.3L53.2 50.9L52.1 50.3L51 50.9L49.9 50.3L48.8 50.9L47.7 50.3Z" fill="#F1ECE0"/>
        <text x="49" y="46" font-size="1.6" font-weight="700" fill="#7A6F5A" letter-spacing=".15">BILL</text>
        <text x="54.3" y="49.3" font-size="2" font-weight="800" fill="#B5432F" text-anchor="middle">$12,480</text>
      </g>`;
  },

  // Drawn taller (art y 21..58): with no effect blocks the window reaches the code block.
  // Spotlights, a banner, the app on the #1 pedestal, a proud dev and the 47th take.
  'app-store-featured': () => {
    const LEAVES = [[27.9, 49.4, -40], [26.4, 46.6, -26], [25.5, 43.5, -12], [25.3, 40.3, 0], [25.7, 37.1, 14], [26.7, 34.2, 28]];
    const laurel = (side) => `<path d="M28.6 51Q24.4 44 27.4 33.4" fill="none" stroke="${C.goldDark}" stroke-width=".4" stroke-linecap="round" transform="${side > 0 ? 'translate(73 0) scale(-1 1)' : ''}"/>` +
      LEAVES.map(([x, y, r], i) => { const cx = side > 0 ? n2(73 - x) : x; return `<ellipse cx="${cx}" cy="${y}" rx=".8" ry="1.7" fill="${i % 2 ? C.goldDark : C.gold}" transform="rotate(${side * -r} ${cx} ${y})"/>`; }).join('');
    const px = 29.6, py = 29.4;
    return `
      <polygon points="14.2,22 18.4,22 34,52.4 22.6,52.4" fill="#fff" opacity=".045"/>
      <polygon points="58.8,22 54.6,22 39,52.4 50.4,52.4" fill="#fff" opacity=".045"/>
      <rect x="13.6" y="21" width="5.2" height="2.2" rx=".8" fill="${METAL}"/><rect x="14.6" y="22.9" width="3.2" height=".5" rx=".25" fill="${C.gold}"/>
      <rect x="54.2" y="21" width="5.2" height="2.2" rx=".8" fill="${METAL}"/><rect x="55.2" y="22.9" width="3.2" height=".5" rx=".25" fill="${C.gold}"/>

      <polygon points="23.4,23.4 27.6,23.4 27.6,28.2 23.4,28.2 24.8,25.8" fill="${C.goldDark}"/>
      <polygon points="49.6,23.4 45.4,23.4 45.4,28.2 49.6,28.2 48.2,25.8" fill="${C.goldDark}"/>
      <rect x="25.8" y="22" width="21.4" height="5.4" rx=".6" fill="${C.gold}"/>
      <rect x="26.4" y="22.5" width="20.2" height=".4" rx=".2" fill="#fff" opacity=".35"/>
      <text x="36.5" y="25.6" font-size="2.2" font-weight="800" fill="${INK}" text-anchor="middle" letter-spacing=".15">FEATURED</text>

      ${laurel(-1)}${laurel(1)}
      ${glow(36.5, 41, 10, C.frontend, .06)}
      ${handset(px, py, 13.8, 22.6)}
      <rect x="${px + 1.1}" y="${py + 2}" width="11.6" height="16.8" rx=".6" fill="${C.bg}"/>
      <rect x="${px + 3.25}" y="${py + 3.3}" width="7.3" height="7.3" rx="1.8" fill="#000" opacity=".3" transform="translate(.3 .35)"/>
      <rect x="${px + 3.25}" y="${py + 3.3}" width="7.3" height="7.3" rx="1.8" fill="url(#bolt)"/>
      <use href="#i-star" x="${px + 4.6}" y="${py + 4.65}" width="4.6" height="4.6" fill="#fff"/>
      ${[0, 1, 2, 3, 4].map(i => `<use href="#i-star" x="${n2(px + 2.2 + i * 1.9)}" y="${py + 11.8}" width="1.7" height="1.7" fill="${C.gold}"/>`).join('')}
      <rect x="${px + 3.6}" y="${py + 14.6}" width="6.6" height="2.6" rx="1.3" fill="${C.frontend}"/>
      <text x="${px + 6.9}" y="${py + 16.45}" font-size="1.7" font-weight="800" fill="${C.bg}" text-anchor="middle">GET</text>
      <circle cx="${px + 6.9}" cy="${py + 20.6}" r=".8" fill="${Kit.dark(C.frontend, .35)}"/>

      <rect x="25" y="52.3" width="23" height="1.6" rx=".6" fill="${Kit.light(METAL, .15)}"/>
      <path d="M25.8 53.9H47.2L46.2 58H26.8Z" fill="#3A3D44"/><path d="M41.5 53.9H47.2L46.2 58H41.2Z" fill="#000" opacity=".15"/>
      <text x="36.5" y="57.2" font-size="2.6" font-weight="800" fill="${C.gold}" text-anchor="middle">#1</text>

      ${Kit.person(17.4, 57.8, { pose: 'point', skin: 4, hair: 'buzz', hairColor: Kit.HAIR.black, top: C.kw, topStyle: 'hoodie', pants: '#3B4252', mood: 'grin', beard: true })}

      <g transform="rotate(-4 54.6 52)">
        <rect x="49.1" y="49.4" width="11" height="7.6" rx=".7" fill="#000" opacity=".3" transform="translate(.3 .35)"/>
        <rect x="49.1" y="49.4" width="11" height="7.6" rx=".7" fill="#2E3036"/>
        <text x="54.6" y="54.6" font-size="1.6" font-weight="800" fill="#E8EAED" text-anchor="middle">TAKE 47</text>
        <g transform="rotate(-14 49.3 49)"><rect x="49.1" y="46.8" width="11" height="2.2" rx=".4" fill="#E8EAED"/>
          ${[0, 1, 2, 3].map(i => `<polygon points="${50 + i * 2.6},46.8 ${51.3 + i * 2.6},46.8 ${50.5 + i * 2.6},49 ${49.2 + i * 2.6},49" fill="#2E3036"/>`).join('')}</g>
      </g>
      ${spark(24.6, 31, 1.4)}${spark(50.6, 33.2, 1.2)}${spark(56.8, 39.6, 1.6)}${spark(48.6, 44, .8)}${spark(21.4, 50.6, .8)}`;
  },

  // The superuser (crowned, of course) points at the screen that runs the company.
  'admin-panel': () => {
    const rows = [['ada', 'admin', C.kw, 1, Kit.HAIR.brown, true], ['linus', 'dev', C.fn, 0, Kit.HAIR.blonde, true], ['grace', 'owner', C.cls, 3, Kit.HAIR.black, false]];
    return `
      ${shadow(29.6, 51.4, 9)}
      <rect x="27.8" y="46" width="3.6" height="4.4" fill="${Kit.dark(METAL, .25)}"/>
      <path d="M23.6 51.2Q23.6 50.2 24.6 50.2H34.6Q35.6 50.2 35.6 51.2Z" fill="${METAL}"/>
      <rect x="13.3" y="27.3" width="33" height="19.4" rx="1.4" fill="#000" opacity=".3"/>
      <rect x="12.8" y="26.8" width="33.6" height="19.6" rx="1.4" fill="${METAL}"/>
      <rect x="13.6" y="27.6" width="32" height="17" rx=".6" fill="${C.bg}"/>
      <circle cx="29.6" cy="45.5" r=".4" fill="${Kit.light(METAL, .3)}"/>
      <path d="M13.6 28.2A.6 .6 0 0 1 14.2 27.6H18.8V44.6H14.2A.6 .6 0 0 1 13.6 44V28.2Z" fill="${C.surface2}"/>
      <rect x="14.4" y="28.8" width="3.6" height="1.3" rx=".45" fill="${C.backend}"/>
      ${[31.2, 33.4, 35.6, 37.8].map((y, i) => `<rect x="14.4" y="${y}" width="${[3.6, 2.8, 3.2, 2.4][i]}" height="1.1" rx=".45" fill="${C.border}"/>`).join('')}
      <text x="19.8" y="30.4" font-size="1.85" font-weight="800" fill="${C.text}">Users</text>
      <rect x="38.6" y="28.4" width="6.2" height="2.6" rx=".8" fill="${C.backend}"/>
      <text x="41.7" y="30.25" font-size="1.6" font-weight="800" fill="${C.bg}" text-anchor="middle">+ New</text>
      ${rows.map(([name, role, col, skin, hc, on], i) => {
        const y = 32.2 + i * 4;
        return `<rect x="19.6" y="${y}" width="25.4" height="3.4" rx=".6" fill="${i === 0 ? C.surface2 : C.surface}" ${i === 0 ? '' : 'opacity=".7"'}/>
          <circle cx="21.4" cy="${y + 1.7}" r="1.15" fill="${Kit.SKIN[skin]}"/><path d="M20.25 ${y + 1.5}A1.15 1.15 0 0 1 22.55 ${y + 1.5}Q21.4 ${y + .95} 20.25 ${y + 1.5}Z" fill="${hc}"/>
          <text x="23.2" y="${y + 2.3}" font-size="1.65" fill="${C.text}">${name}</text>
          <text x="30.6" y="${y + 2.3}" font-size="1.65" fill="${col}">${role}</text>
          <rect x="40.6" y="${y + .8}" width="3.6" height="1.8" rx=".9" fill="${on ? C.backend : C.border}"/>
          <circle cx="${on ? 43.3 : 41.5}" cy="${y + 1.7}" r=".65" fill="#fff"/>`;
      }).join('')}
      ${glow(54.4, 40, 7.5, C.gold, .06)}
      ${Kit.person(55, 52.8, { pose: 'point', flip: true, skin: 2, hair: 'grey', top: '#3D4E6E', topStyle: 'blazer', pants: '#2E3442', glasses: true, accessory: 'crown', mood: 'grin' })}`;
  },

  // Main stage: the speaker live-codes, the agent demo answers, and the audience films everything.
  'kotlinconf-keynote': () => {
    const audiencePhone = (x, rot) => `<g transform="rotate(${rot} ${x + 2.1} 50)">
      <rect x="${x + .3}" y="45.6" width="4.2" height="7" rx=".8" fill="#000" opacity=".35"/>
      <rect x="${x}" y="45.2" width="4.2" height="7" rx=".8" fill="#2E3036" stroke="${METAL}" stroke-width=".25"/>
      <rect x="${x + .45}" y="45.8" width="3.3" height="5.2" rx=".35" fill="${C.code}"/>
      <rect x="${x + .8}" y="46.6" width="2.6" height="1.5" rx=".2" fill="url(#bolt)"/>
      <circle cx="${x + 1.2}" cy="49.6" r=".45" fill="${C.agent}"/><circle cx="${x + 2.9}" cy="49.6" r=".45" fill="${C.frontend}"/>
      <circle cx="${x + 3.5}" cy="45.75" r=".25" fill="${C.gold}"/></g>`;
    return `
      <polygon points="13.4,27 16.2,27 25.6,49.6 13.2,49.6" fill="#fff" opacity=".05"/>
      <polygon points="59.6,27 56.8,27 59.6,49.6 47.2,49.6" fill="#fff" opacity=".05"/>
      <rect x="25.3" y="27.3" width="26.6" height="15.6" rx="1.2" fill="#000" opacity=".3"/>
      <rect x="24.8" y="26.8" width="26.6" height="15.6" rx="1.2" fill="${METAL}"/>
      <rect x="25.5" y="27.5" width="25.2" height="14.2" rx=".6" fill="${C.code}"/>
      <rect x="25.5" y="27.5" width="25.2" height="1.3" fill="url(#bolt)"/>
      <rect x="26.6" y="30" width="7.6" height="2.6" rx=".7" fill="#E44857"/>
      <circle cx="28" cy="31.3" r=".5" fill="#fff"/>
      <text x="31" y="31.9" font-size="1.6" font-weight="800" fill="#fff" text-anchor="middle">LIVE</text>
      <g transform="translate(47.6 32.4)">${[1, 1.9, 2.8].map(r => { const d = n2(r * Math.SQRT1_2); return `<path d="M${-d} ${-d}A${r} ${r} 0 0 1 ${d} ${-d}" fill="none" stroke="${C.backend}" stroke-width=".5" stroke-linecap="round"/>`; }).join('')}<circle r=".45" fill="${C.backend}"/></g>
      <rect x="26.6" y="34" width="6" height=".85" rx=".42" fill="${C.kw}"/><rect x="33.4" y="34" width="8" height=".85" rx=".42" fill="${C.fn}"/>
      <rect x="28.2" y="35.9" width="10" height=".85" rx=".42" fill="${C.str}"/><rect x="39" y="35.9" width="3" height=".85" rx=".42" fill="${C.text}" opacity=".5"/>
      <rect x="28.2" y="37.8" width="5.4" height=".85" rx=".42" fill="${C.cls}"/><rect x="34.2" y="37.55" width=".5" height="1.35" fill="${C.text}"/>
      <rect x="37.4" y="37.4" width="5.6" height="3.4" rx="1" fill="${C.backend}"/>
      <polygon points="39.5,38.25 41.3,39.1 39.5,39.95" fill="${C.bg}"/>

      <rect x="12.4" y="49.6" width="48.6" height="2.6" rx=".6" fill="#3A3D44"/>
      <rect x="12.4" y="49.4" width="48.6" height=".9" rx=".45" fill="${Kit.light(METAL, .12)}"/>
      <ellipse cx="19.6" cy="49.9" rx="6" ry=".7" fill="#fff" opacity=".08"/><ellipse cx="53.4" cy="49.9" rx="6" ry=".7" fill="#fff" opacity=".08"/>
      ${Kit.person(19.6, 49.8, { pose: 'present', skin: 2, hair: 'long', hairColor: Kit.HAIR.chestnut, top: C.frontend, topStyle: 'blazer', headset: true, mood: 'talk' })}
      ${glow(53.4, 41, 6.5, C.agent, .1)}
      ${Kit.robot(53.4, 49.8, { k: .95, body: true, arms: 'wave', expression: 'happy' })}
      ${audiencePhone(31.4, -9)}${audiencePhone(38.6, 7)}`;
  },
});

const chipFree = (kind, name, sprint) => [{ kind: 'chips', label: 'FREE IF YOU BUILT', chips: [{ kind, name, sprint }] }];

CARDS.push(
  {
    id: 'ai-assistant', artH: 26, name: 'In-app AI Assistant', type: 'feature', sprint: 3, copies: [3], points: 6,
    cost: ['agent', 'agent', 'frontend', 'backend'], freeWith: 'Koog', file: 'Assistant.kt',
    effects: chipFree('library', 'Koog', 2),
    code: [[C.text, 'agent.'], [C.fn, 'run'], [C.text, '('], [C.str, '"Where is my order?"'], [C.text, ')']],
    comment: 'an agent that actually calls your API',
  },
  {
    id: 'multi-agent-workflow', artH: 26, name: 'Multi-agent Workflow', type: 'feature', sprint: 3, copies: [3], points: 6,
    cost: ['agent', 'agent', 'backend'], freeWith: 'Agents with MCP', file: 'Workflow.kt',
    effects: chipFree('team', 'Agents with MCP', 2),
    code: [[C.fn, 'listOf'], [C.text, '(planner, coder, reviewer)']],
    comment: 'one plans, one codes, you approve PRs',
  },
  {
    id: 'realtime-chat', artH: 26, name: 'Real-time Chat', type: 'feature', sprint: 3, copies: [3], points: 6,
    cost: ['backend', 'backend', 'frontend', 'frontend'], freeWith: 'Ktor', file: 'Chat.kt',
    effects: chipFree('library', 'Ktor', 1),
    code: [[C.text, 'messages.'], [C.fn, 'collect'], [C.text, ' { '], [C.fn, 'show'], [C.text, '(it) }']],
    comment: 'Flow over WebSockets: never miss a word',
  },
  {
    id: 'offline-mode', artH: 26, name: 'Offline Mode', type: 'feature', sprint: 3, copies: [3], points: 6,
    cost: ['frontend', 'frontend', 'backend'], freeWith: 'SQLDelight', file: 'OfflineSync.kt',
    effects: chipFree('library', 'SQLDelight', 2),
    code: [[C.text, 'db.queries.'], [C.fn, 'selectAll'], [C.text, '().'], [C.fn, 'asFlow'], [C.text, '()']],
    comment: 'works in the metro, syncs when back',
  },
  {
    id: 'web-version', artH: 26, name: 'Web App', type: 'feature', sprint: 3, copies: [3], points: 7,
    cost: ['frontend', 'frontend', 'frontend', 'backend'], freeWith: 'Kotlin/Wasm', file: 'WebMain.kt',
    effects: chipFree('library', 'Kotlin/Wasm', 2),
    code: [[C.fn, 'ComposeViewport'], [C.text, ' { '], [C.fn, 'App'], [C.text, '() }']],
    comment: 'the same Compose UI, in every browser',
  },
  {
    id: 'scale-to-1m', artH: 26, name: 'Scale to 1M Users', type: 'feature', sprint: 3, copies: [3], points: 8,
    costCoins: 2, cost: ['backend', 'backend', 'backend'], freeWith: 'kotlinx.coroutines', file: 'Scale.kt',
    effects: chipFree('library', 'kotlinx.coroutines', 1),
    code: [[C.fn, 'repeat'], [C.text, '('], [C.fn, '1_000_000'], [C.text, ') { '], [C.fn, 'launch'], [C.text, ' { '], [C.fn, 'serve'], [C.text, '() } }']],
    comment: 'and a cloud bill with a comma in it',
  },
  {
    id: 'app-store-featured', name: 'Featured on the App Store', type: 'feature', sprint: 3, copies: [3], points: 8,
    costCoins: 2, cost: ['frontend', 'frontend', 'frontend'], file: 'Launch.kt',
    effects: [],
    code: [[C.kw, 'val '], [C.text, 'video = '], [C.fn, 'shoot'], [C.text, '(takes = '], [C.fn, '47'], [C.text, ')']],
    comment: 'polish every pixel until editors notice',
  },
  {
    id: 'admin-panel', artH: 26, name: 'Admin Panel', type: 'feature', sprint: 3, copies: [3], points: 5,
    cost: ['frontend', 'backend', 'backend'], freeWith: 'Exposed', file: 'Admin.kt',
    effects: chipFree('library', 'Exposed', 1),
    code: [[C.cls, 'Users'], [C.text, '.'], [C.fn, 'selectAll'], [C.text, '().'], [C.fn, 'forEach'], [C.text, '(::row)']],
    comment: 'the most-used screen nobody outside sees',
  },
  {
    id: 'kotlinconf-keynote', artH: 26, name: 'KotlinConf Keynote Demo', type: 'feature', sprint: 3, copies: [3], points: 6,
    cost: ['backend', 'backend', 'agent'], freeWith: 'Kotlin/Wasm', file: 'Keynote.kt',
    effects: chipFree('library', 'Kotlin/Wasm', 2),
    code: [[C.fn, 'check'], [C.text, '(wifi.isUp) { '], [C.str, '"pray"'], [C.text, ' }']],
    comment: 'live-coded on the main stage, Wi-Fi held',
  },
);
})();
