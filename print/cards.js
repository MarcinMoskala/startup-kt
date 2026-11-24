// Startup.kt printable cards: one SVG template for every card.
// Units are millimetres: viewBox 69x94 = 63x88 mm poker card + 3 mm bleed on each side.
// Trim box: x 3..66, y 3..91. Safe zone: x 6..63, y 6..88.

const C = {
  bg: '#1E1F22', surface: '#2B2D30', surface2: '#393B40', border: '#43454A', code: '#18191B',
  text: '#DFE1E5', muted: '#9DA0A8', faint: '#7A7E85',
  frontend: '#4FB3F6', backend: '#5FCB8B', agent: '#C77DFF',
  gold: '#F5C451', goldDark: '#B8862A', chain: '#A98BFF',
  // IntelliJ-like syntax colours for flavor code
  fn: '#57AAF7', kw: '#CF8E6D', str: '#6AAB73', cls: '#C77DBB',
};

const TYPES = {
  team:     { label: 'TEAM',     color: '#26A68A', grad: ['#33BE9F', '#1C8A72'], icon: 'i-team' },
  feature:  { label: 'FEATURE',  color: '#8B5CF6', grad: ['#9D74FF', '#6B3FE0'], icon: 'i-feature' },
  library:  { label: 'LIBRARY',  color: '#3D8BFD', grad: ['#4C97FF', '#2F6FD6'], icon: 'i-book' },
  business: { label: 'BUSINESS', color: '#E29A2F', grad: ['#F0AA3E', '#C97F18'], icon: 'i-business' },
};

const SPRINTS = { 1: ['I', 'HELLO, WORLD'], 2: ['II', 'BETA'], 3: ['III', 'RELEASE 1.0'] };

// Shared symbols, included once per page (see sharedDefs()).
const DEFS = `
<symbol id="i-backend" viewBox="0 0 10 10">
  <rect x="1" y="0.8" width="8" height="2.4" rx="0.6" fill="${C.backend}"/>
  <rect x="1" y="3.8" width="8" height="2.4" rx="0.6" fill="${C.backend}"/>
  <rect x="1" y="6.8" width="8" height="2.4" rx="0.6" fill="${C.backend}"/>
  <g fill="${C.bg}"><circle cx="2.5" cy="2" r="0.5"/><circle cx="2.5" cy="5" r="0.5"/><circle cx="2.5" cy="8" r="0.5"/>
  <g opacity=".5"><rect x="4.2" y="1.7" width="3.6" height="0.6" rx="0.3"/><rect x="4.2" y="4.7" width="3.6" height="0.6" rx="0.3"/><rect x="4.2" y="7.7" width="3.6" height="0.6" rx="0.3"/></g></g>
</symbol>
<symbol id="i-frontend" viewBox="0 0 10 10">
  <rect x="2.4" y="0.5" width="5.2" height="9" rx="1.2" fill="${C.frontend}"/>
  <rect x="3.2" y="1.6" width="3.6" height="5.8" rx="0.4" fill="${C.bg}"/>
  <circle cx="5" cy="8.4" r="0.45" fill="${C.bg}"/>
</symbol>
<symbol id="i-agent" viewBox="0 0 10 10">
  <line x1="5" y1="0.8" x2="5" y2="2.6" stroke="${C.agent}" stroke-width="0.8"/>
  <circle cx="5" cy="0.9" r="0.8" fill="${C.agent}"/>
  <rect x="1.2" y="2.4" width="7.6" height="6.8" rx="1.8" fill="${C.agent}"/>
  <circle cx="3.6" cy="5.4" r="0.9" fill="${C.bg}"/><circle cx="6.4" cy="5.4" r="0.9" fill="${C.bg}"/>
  <rect x="3.4" y="7.2" width="3.2" height="0.7" rx="0.35" fill="${C.bg}"/>
</symbol>
<symbol id="i-coin" viewBox="0 0 10 10">
  <circle cx="5" cy="5" r="4.6" fill="${C.gold}"/>
  <circle cx="5" cy="5" r="3.5" fill="none" stroke="${C.goldDark}" stroke-width="0.6"/>
</symbol>
<symbol id="i-star" viewBox="0 0 10 10">
  <polygon points="5.00,0.30 6.23,3.60 9.76,3.75 7.00,5.95 7.94,9.35 5.00,7.40 2.06,9.35 3.00,5.95 0.24,3.75 3.77,3.60"/>
</symbol>
<symbol id="i-feature" viewBox="0 0 10 10">
  <polygon fill="#fff" points="5.00,0.30 6.23,3.60 9.76,3.75 7.00,5.95 7.94,9.35 5.00,7.40 2.06,9.35 3.00,5.95 0.24,3.75 3.77,3.60"/>
</symbol>
<symbol id="i-book" viewBox="0 0 10 10">
  <rect x="1.4" y="1" width="7.2" height="8" rx="0.8" fill="#fff"/>
  <rect x="2.6" y="1" width="0.6" height="8" fill="#3D8BFD"/>
  <rect x="4.2" y="3" width="3.2" height="0.6" fill="#3D8BFD"/>
  <rect x="4.2" y="4.5" width="2.4" height="0.6" fill="#3D8BFD"/>
</symbol>
<symbol id="i-team" viewBox="0 0 10 10">
  <circle cx="5" cy="3" r="2" fill="#fff"/><rect x="1.6" y="5.6" width="6.8" height="4" rx="2.6" fill="#fff"/>
</symbol>
<symbol id="i-business" viewBox="0 0 10 10">
  <rect x="3.4" y="1.4" width="3.2" height="2" rx="0.6" fill="none" stroke="#fff" stroke-width="0.9"/>
  <rect x="0.8" y="3" width="8.4" height="5.8" rx="1" fill="#fff"/>
</symbol>
<symbol id="i-chain" viewBox="0 0 10 10">
  <rect x="0.6" y="3.6" width="5" height="3" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <rect x="4.4" y="3.6" width="5" height="3" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/>
</symbol>
<symbol id="i-team-line" viewBox="0 0 10 10">
  <circle cx="5" cy="3.2" r="1.9" fill="none" stroke="currentColor" stroke-width="1"/><path d="M1.6 9.2 Q1.6 5.8 5 5.8 Q8.4 5.8 8.4 9.2" fill="none" stroke="currentColor" stroke-width="1"/>
</symbol>
<symbol id="i-person" viewBox="0 0 10 10">
  <circle cx="5" cy="3" r="2" fill="${C.muted}"/><rect x="1.6" y="5.6" width="6.8" height="4" rx="2.6" fill="${C.muted}"/>
</symbol>
<pattern id="dots" width="2.5" height="2.5" patternUnits="userSpaceOnUse">
  <circle cx="1.25" cy="1.25" r="0.18" fill="${C.border}"/>
</pattern>
<pattern id="stripes" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
  <rect width="1" height="3" fill="#fff" opacity=".05"/>
</pattern>
<linearGradient id="bolt" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#E44857"/><stop offset=".5" stop-color="#C711E1"/><stop offset="1" stop-color="#7F52FF"/>
</linearGradient>
`;

function sharedDefs() {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${DEFS}</defs></svg>`;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 0.6; // JetBrains Mono advance width, in em

// ---------- card art (drawn inside the IDE window: x 10.5..62.5, y 29..50) ----------

function serverRack(x, y, k = 1) {
  const bars = ['#5FCB8B', '#4DB57A', '#3E9E68'].map((c, i) => `
    <rect x="0" y="${i * 5.6}" width="17" height="4.6" rx=".8" fill="${c}"/>
    <circle cx="2.2" cy="${2.3 + i * 5.6}" r=".75" fill="${C.bg}"/>
    <rect x="5" y="${1.8 + i * 5.6}" width="9.5" height="1" rx=".5" fill="${C.bg}" opacity=".45"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${k})">${bars}
    <circle cx="4.2" cy="2.3" r=".55" fill="${C.gold}"/>
    <rect x="7.5" y="15.8" width="2" height="1.6" fill="#3E9E68"/>
    <rect x="4" y="17.2" width="9" height=".9" rx=".45" fill="#3E9E68"/></g>`;
}

function phone(x, y) {
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="10.5" height="18" rx="1.9" fill="${C.frontend}"/>
    <rect x="1.1" y="1.8" width="8.3" height="12.6" rx=".6" fill="${C.bg}"/>
    <rect x="2.1" y="3.2" width="6.3" height="1.6" rx=".5" fill="${C.frontend}"/>
    <rect x="2.1" y="6" width="6.3" height="1.6" rx=".5" fill="${C.frontend}" opacity=".7"/>
    <rect x="2.1" y="8.8" width="6.3" height="1.6" rx=".5" fill="${C.frontend}" opacity=".45"/>
    <rect x="2.1" y="11.6" width="4" height="1.6" rx=".5" fill="${C.frontend}" opacity=".25"/>
    <circle cx="5.25" cy="16.2" r=".75" fill="${C.bg}"/></g>`;
}

// ---------- character kit ----------
// Shared people, robots and props for card art, so every card draws them the same way.
// Every function returns an SVG string in card millimetres; (x, y) is the bottom-centre of the figure.
// See print/kit.html for every option side by side.
const Kit = (() => {
  const rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const dark = (c, t = 0.2) => mix(c, '#000000', t);
  const light = (c, t = 0.25) => mix(c, '#FFFFFF', t);
  const lum = c => { const [r, g, b] = rgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const f = n => +n.toFixed(2);

  const SKIN = ['#F7D7BE', '#EBB792', '#C98D62', '#9B623D', '#6A3F27'];
  const HAIR = { black: '#2E2628', brown: '#5C3B27', chestnut: '#8A4B2A', auburn: '#B5532F', blonde: '#E2B661', grey: '#C3C7CE', pink: '#E879B5', blue: '#5B8DEF' };
  const INK = '#2A2120';
  let uid = 0;   // unique clip-path ids

  // ----- head (local frame: chin at 0,0; skull top at y -6.2; half-width 2.45) -----
  const SKULL = 'M-2.45 -3.4C-2.45 -5.4 -1.4 -6.2 0 -6.2C1.4 -6.2 2.45 -5.4 2.45 -3.4L2.45 -2.6C2.45 -1 1.3 0 0 0C-1.3 0 -2.45 -1 -2.45 -2.6Z';
  const FACE_SHADE = 'M1.25 -6C2.1 -5.5 2.45 -4.5 2.45 -3.4L2.45 -2.6C2.45 -1 1.3 0 0 0C0.9 -0.35 1.75 -1.25 1.85 -2.6L1.9 -3.4C1.9 -4.5 1.7 -5.4 1.25 -6Z';

  // hair: back (drawn behind the head and body), front (over the head), hl (highlight stroke), top (y of the hair top)
  const HAIRS = {
    short: {
      front: 'M-2.6 -2.7C-2.95 -5.7 -1.6 -6.85 0.1 -6.85C2 -6.85 3.05 -5.7 2.65 -2.8L2.33 -2.9C2.28 -3.9 2 -4.5 1.55 -4.85C0.6 -4.25 -0.8 -4.35 -1.75 -4.95C-2.1 -4.45 -2.3 -3.65 -2.3 -2.75Z',
      hl: 'M-1.3 -6.15Q0.2 -6.65 1.6 -6.05', top: -6.85,
    },
    side: {
      front: 'M-2.6 -2.7C-3 -5.9 -1.4 -7 0.4 -6.95C2.3 -6.9 3.15 -5.5 2.65 -2.8L2.33 -2.9C2.33 -4 2.1 -4.65 1.7 -5C0.4 -4.75 -0.8 -5.05 -1.45 -5.65C-1.95 -4.95 -2.3 -3.9 -2.3 -2.75Z',
      part: 'M-1.45 -5.65Q-1.2 -6.4 -0.4 -6.75',
      hl: 'M-0.6 -6.5Q0.9 -6.75 2 -5.9', top: -6.95,
    },
    long: {
      back: 'M-2.85 -3.2C-3.15 -6.35 -1.5 -7 0 -7C1.5 -7 3.15 -6.35 2.85 -3.2L3.3 1.3C2.2 2 -2.2 2 -3.3 1.3Z',
      front: 'M-2.7 -1.4C-3 -5.8 -1.5 -6.9 0 -6.9C1.5 -6.9 3 -5.8 2.7 -1.4L2.25 -1.8C2.2 -3.6 1.85 -4.6 0.35 -5.3C-0.3 -4.55 -1.3 -4.15 -2.25 -3.95L-2.25 -1.8Z',
      hl: 'M-1.6 -6.05Q-0.2 -6.75 1.4 -6.2', top: -7, hideEars: true,
    },
    bun: {
      back: 'M-1.35 -7.35a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0Z',
      front: 'M-2.55 -2.9C-2.85 -5.8 -1.4 -6.8 0 -6.8C1.4 -6.8 2.85 -5.8 2.55 -2.9C2.3 -4 1.6 -4.75 0 -4.85C-1.6 -4.75 -2.3 -4 -2.55 -2.9Z',
      hl: 'M-1.4 -6.15Q0 -6.6 1.4 -6.15', top: -8.7, band: true,
    },
    curly: { top: -7.3 },   // built from circles below
    buzz: {
      front: 'M-2.5 -3.3C-2.55 -5.6 -1.4 -6.5 0 -6.5C1.4 -6.5 2.55 -5.6 2.5 -3.3C2.25 -4.35 1.85 -4.85 1.35 -4.95Q0 -4.65 -1.35 -4.95C-1.85 -4.85 -2.25 -4.35 -2.5 -3.3Z',
      top: -6.5, faded: true,
    },
    bald: {
      front: 'M-2.6 -2.3C-2.75 -3.4 -2.6 -4.1 -2.2 -4.55L-2.15 -2.9ZM2.6 -2.3C2.75 -3.4 2.6 -4.1 2.2 -4.55L2.15 -2.9Z',
      shine: true, top: -6.2,
    },
    grey: {
      front: 'M-2.6 -2.7C-2.95 -5.75 -1.5 -6.85 0.3 -6.85C2.2 -6.85 3.1 -5.6 2.65 -2.8L2.33 -2.9C2.33 -4.2 2.15 -4.9 1.8 -5.3C0.7 -5.4 -0.6 -5.5 -1.5 -5.85C-2 -5.15 -2.3 -4 -2.3 -2.75Z',
      hl: 'M-0.8 -6.4Q0.8 -6.7 2 -6', top: -6.85,
    },
  };
  const CURLS = [[-2.45, -3.3, 0.85], [-2.45, -4.6, 1], [-1.75, -5.85, 1.05], [-0.55, -6.45, 1.05], [0.75, -6.4, 1.05],
    [1.85, -5.7, 1.05], [2.45, -4.45, 1], [2.45, -3.25, 0.85], [-1.2, -5.3, 0.8], [0.1, -5.4, 0.8], [1.25, -5.25, 0.8]];

  function hairParts(style, hc, skin) {
    const h = HAIRS[style] || HAIRS.short;
    const hd = dark(hc, 0.22), hl = light(hc, 0.32);
    const fill = h.faded ? mix(hc, skin, 0.3) : hc;
    const rim = light(hc, 0.3);   // top-left rim light keeps dark hair readable on the dark window
    let back = '', front = '';
    if (h.back) back = `<path d="${h.back}" fill="${hd}"/>`;
    if (style === 'bun') back = `<path d="${h.back}" fill="${rim}" transform="translate(-0.16 -0.2)"/>` + back;
    if (style === 'curly') {
      front = `<path d="M-2.5 -3.2C-2.7 -5.9 -1.3 -6.9 0 -6.9C1.3 -6.9 2.7 -5.9 2.5 -3.2C2.1 -4.3 1.2 -4.8 0 -4.8C-1.2 -4.8 -2.1 -4.3 -2.5 -3.2Z" fill="${hc}"/>` +
        CURLS.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hc}"/>`).join('') +
        `<path d="M-2.2 -5.3Q-1.4 -6.9 0.4 -7.05" fill="none" stroke="${hl}" stroke-width=".4" stroke-linecap="round" opacity=".7"/>`;
      front = `<g transform="translate(-0.16 -0.2)" fill="${rim}">${front.replace(/fill="[^"]*"/g, '').replace(/<path d="M-2.2 -5.3[^>]*>/g, '')}</g>` + front;
    } else {
      front = (h.faded || h.shine ? '' : `<path d="${h.front}" fill="${rim}" transform="translate(-0.16 -0.2)"/>`) + `<path d="${h.front}" fill="${fill}"/>`;
      if (h.part) front += `<path d="${h.part}" fill="none" stroke="${hd}" stroke-width=".3" stroke-linecap="round"/>`;
      if (h.hl) front += `<path d="${h.hl}" fill="none" stroke="${hl}" stroke-width=".4" stroke-linecap="round" opacity=".75"/>`;
      if (h.shine) front += `<path d="M-1.3 -5.7Q-0.3 -6.05 0.6 -5.85" fill="none" stroke="#fff" stroke-width=".45" stroke-linecap="round" opacity=".35"/>`;
      if (h.band) back += `<path d="M-0.85 -7.85Q-0.2 -8.45 0.55 -8.2" fill="none" stroke="${hl}" stroke-width=".35" stroke-linecap="round" opacity=".7"/>`;
    }
    return { back, front, top: h.top, hideEars: h.hideEars, shadow: style === 'curly' ? 'M-2.6 -3.6C-2.7 -6 -1.3 -6.9 0 -6.9C1.3 -6.9 2.7 -6 2.6 -3.6C1.8 -4.4 1 -4.3 0 -4.4C-1 -4.3 -1.8 -4.4 -2.6 -3.6Z' : h.faded || h.shine ? '' : h.front };
  }

  function face(o, sd) {
    const browC = o.hair === 'bald' || o.hair === 'buzz' ? dark(o.skin, 0.45) : dark(o.hairColor, 0.15);
    const mood = o.mood || 'smile';
    let eyes = mood === 'happy'
      ? [-1, 1].map(s => `<path d="M${f(s * 0.95 - 0.38)} -2.6q0.38 -0.5 0.76 0" fill="none" stroke="${INK}" stroke-width=".32" stroke-linecap="round"/>`).join('')
      : [-1, 1].map(s => `<ellipse cx="${s * 0.95}" cy="-2.72" rx=".3" ry=".4" fill="${INK}"/><circle cx="${f(s * 0.95 + 0.1)}" cy="-2.86" r=".1" fill="#fff" opacity=".9"/>`).join('');
    const brows = [-1, 1].map(s => `<path d="M${f(s * 0.55)} -3.62Q${f(s * 0.95)} -3.92 ${f(s * 1.38)} -3.66" fill="none" stroke="${browC}" stroke-width=".32" stroke-linecap="round"/>`).join('');
    const nose = `<path d="M-0.05 -2.3Q0.4 -1.85 0.12 -1.68Q-0.1 -1.66 -0.25 -1.78" fill="${dark(o.skin, 0.16)}"/>`;
    const mouths = {
      smile: `<path d="M-0.62 -1.1Q0 -0.42 0.62 -1.1Z" fill="#8E3B37"/>`,
      grin: `<path d="M-0.75 -1.15Q0 -0.15 0.75 -1.15Z" fill="#7A2E2B"/><path d="M-0.62 -1.1L0.62 -1.1L0.5 -0.88L-0.5 -0.88Z" fill="#fff"/>`,
      neutral: `<path d="M-0.45 -1Q0 -0.85 0.45 -1" fill="none" stroke="#8E3B37" stroke-width=".3" stroke-linecap="round"/>`,
      talk: `<ellipse cx="0" cy="-0.95" rx=".42" ry=".32" fill="#7A2E2B"/>`,
      happy: `<path d="M-0.7 -1.15Q0 -0.25 0.7 -1.15Z" fill="#8E3B37"/>`,
    };
    const blush = [-1, 1].map(s => `<ellipse cx="${s * 1.45}" cy="-1.65" rx=".42" ry=".24" fill="#F08A7E" opacity="${f(0.1 + 0.2 * lum(o.skin))}"/>`).join('');
    return blush + brows + eyes + nose + (mouths[mood] || mouths.smile);
  }

  function glasses(c = '#1B1C1F') {
    return [-1, 1].map(s => `<rect x="${f(s * 0.98 - 0.82)}" y="-3.35" width="1.64" height="1.3" rx=".42" fill="#fff" fill-opacity=".14" stroke="${c}" stroke-width=".26"/>`).join('') +
      `<path d="M-0.16 -2.85Q0 -3 0.16 -2.85M-1.8 -2.9L-2.45 -3.05M1.8 -2.9L2.45 -3.05" fill="none" stroke="${c}" stroke-width=".26" stroke-linecap="round"/>`;
  }

  function beard(hc) {
    return `<path d="M-2.45 -2.9L-2.45 -2.4C-2.45 -0.6 -1.3 0.45 0 0.45C1.3 0.45 2.45 -0.6 2.45 -2.4L2.45 -2.9C2.15 -2.1 1.75 -1.55 1.1 -1.5C0.6 -1.75 0.3 -1.6 0 -1.6C-0.3 -1.6 -0.6 -1.75 -1.1 -1.5C-1.75 -1.55 -2.15 -2.1 -2.45 -2.9Z" fill="${hc}"/>
      <path d="M-0.85 -1.42Q0 -1.95 0.85 -1.42Q0 -1.35 -0.85 -1.42Z" fill="${dark(hc, 0.15)}"/>`;
  }

  function headset(accent) {
    return `<path d="M-2.75 -3.2C-2.95 -7.2 2.95 -7.2 2.75 -3.2" fill="none" stroke="#3A3D44" stroke-width=".5"/>
      <path d="M-2.62 -2.6Q-2.4 -0.9 -0.85 -0.95" fill="none" stroke="#3A3D44" stroke-width=".32" stroke-linecap="round"/>
      <circle cx="-0.8" cy="-0.95" r=".34" fill="${accent}"/>
      ${[-1, 1].map(s => `<rect x="${f(s * 2.72 - 0.6)}" y="-3.9" width="1.2" height="1.9" rx=".55" fill="#4A4E57"/><rect x="${f(s * 2.72 - 0.25 + s * 0.12)}" y="-3.5" width=".5" height="1.1" rx=".25" fill="${accent}"/>`).join('')}`;
  }

  function accessory(kind, top) {
    if (kind === 'sprout') return `<g transform="translate(0 ${f(top + 0.15)})">
      <path d="M0 0Q0.15 -0.9 -0.05 -1.7" fill="none" stroke="#3E9E68" stroke-width=".32" stroke-linecap="round"/>
      <path d="M-0.05 -1.15C-0.55 -1.95 -1.55 -2.05 -2 -1.55C-1.5 -0.95 -0.65 -0.85 -0.05 -1.15Z" fill="#4DB57A"/>
      <path d="M0 -1.5C0.4 -2.45 1.55 -2.75 2.15 -2.2C1.65 -1.4 0.65 -1.15 0 -1.5Z" fill="${C.backend}"/>
      <path d="M0.35 -1.6Q1.1 -2.05 1.75 -2.15" fill="none" stroke="#3E9E68" stroke-width=".25" stroke-linecap="round"/></g>`;
    if (kind === 'horn') return `<g transform="translate(0.1 -5.7) rotate(10)">
      <path d="M-0.72 0L0.72 0L0.08 -3.9Q0 -4.05 -0.08 -3.9Z" fill="${C.gold}"/>
      <path d="M-0.6 -0.75L0.55 -1.15M-0.45 -1.65L0.42 -1.95M-0.3 -2.5L0.3 -2.75M-0.18 -3.25L0.16 -3.4" stroke="${C.goldDark}" stroke-width=".25" stroke-linecap="round"/></g>`;
    if (kind === 'halo') return `<ellipse cx="0" cy="${f(top - 1.1)}" rx="2.35" ry=".62" fill="none" stroke="${C.gold}" stroke-width=".5"/>
      <ellipse cx="0" cy="${f(top - 1.1)}" rx="2.35" ry=".62" fill="none" stroke="${C.gold}" stroke-width="1.1" opacity=".18"/>`;
    if (kind === 'crown') return `<path d="M-1.6 ${f(top + 0.3)}L-1.75 ${f(top - 1.3)}L-0.8 ${f(top - 0.55)}L0 ${f(top - 1.6)}L0.8 ${f(top - 0.55)}L1.75 ${f(top - 1.3)}L1.6 ${f(top + 0.3)}Z" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".25" stroke-linejoin="round"/>`;
    return '';
  }

  function head(o) {
    const s = o.skin, sd = dark(s, 0.14);
    const hp = hairParts(o.hair, o.hairColor, s);
    const ears = hp.hideEars ? '' : [-1, 1].map(k => `<ellipse cx="${k * 2.38}" cy="-2.8" rx=".62" ry=".82" fill="${k > 0 ? sd : s}"/><ellipse cx="${k * 2.5}" cy="-2.78" rx=".24" ry=".42" fill="${dark(s, 0.24)}"/>`).join('');
    const front = ears +
      `<path d="${SKULL}" fill="${s}"/><path d="${FACE_SHADE}" fill="${sd}" opacity=".7"/>` +
      (hp.shadow ? `<clipPath id="kit-c${++uid}"><path d="${SKULL}"/></clipPath><path d="${hp.shadow}" transform="translate(0.12 0.38)" fill="${dark(s, 0.2)}" opacity=".55" clip-path="url(#kit-c${uid})"/>` : '') +
      face(o, sd) +
      (o.beard ? beard(o.beard === true ? o.hairColor : o.beard) : '') +
      hp.front +
      (o.glasses ? glasses(o.glasses === true ? undefined : o.glasses) : '') +
      (o.headset ? headset(o.headset === true ? C.backend : o.headset) : '') +
      accessory(o.accessory, hp.top);
    return { back: hp.back, front, top: hp.top };
  }

  // ----- clothing -----
  // Neck opening and collar, centred on (0, y0) = the neck base on the shoulder line.
  function neckline(style, y0, top, s, len = 9) {
    const td = dark(top, 0.2), sd = dark(s, 0.14);
    if (style === 'hoodie') return `
      <path d="M-3.3 ${y0 + 0.2}Q-3 ${y0 + 2.2} 0 ${y0 + 2.4}Q3 ${y0 + 2.2} 3.3 ${y0 + 0.2}Q3.1 ${y0 - 0.7} 1.5 ${y0 - 0.8}L1.4 ${y0 + 0.1}Q0 ${y0 + 1.2} -1.4 ${y0 + 0.1}L-1.5 ${y0 - 0.8}Q-3.1 ${y0 - 0.7} -3.3 ${y0 + 0.2}Z" fill="${td}"/>
      <path d="M-1.4 ${y0 + 0.1}Q0 ${y0 + 1.2} 1.4 ${y0 + 0.1}" fill="none" stroke="${dark(top, 0.35)}" stroke-width=".25"/>
      <path d="M-0.75 ${y0 + 2.1}L-0.85 ${y0 + 4.4}M0.75 ${y0 + 2.1}L0.85 ${y0 + 4.4}" stroke="${light(top, 0.55)}" stroke-width=".28" stroke-linecap="round"/>`;
    if (style === 'shirt') return `
      <path d="M-1.25 ${y0}L0 ${y0 + 1.5}L1.25 ${y0}Z" fill="${sd}"/>
      <path d="M0 ${y0 + 1.5}L0 ${Math.min(y0 + len, -0.2)}" stroke="${td}" stroke-width=".25"/>
      <circle cx="0" cy="${y0 + 2.7}" r=".2" fill="${td}"/><circle cx="0" cy="${y0 + 4.4}" r=".2" fill="${td}"/><circle cx="0" cy="${y0 + 6.1}" r=".2" fill="${td}"/>
      <path d="M-1.35 ${y0 - 0.25}L0 ${y0 + 1.55}L-2.35 ${y0 + 1.25}L-2.05 ${y0 + 0.05}Z" fill="${light(top, 0.4)}"/>
      <path d="M1.35 ${y0 - 0.25}L0 ${y0 + 1.55}L2.35 ${y0 + 1.25}L2.05 ${y0 + 0.05}Z" fill="${light(top, 0.3)}"/>`;
    if (style === 'blazer') return `
      <path d="M-1.55 ${y0}L0 ${y0 + 4.3}L1.55 ${y0}Z" fill="#E8EAED"/>
      <path d="M-1.2 ${y0}L0 ${y0 + 1.3}L1.2 ${y0}Z" fill="${sd}"/>
      <path d="M-0.3 ${y0 + 1.25}L0.3 ${y0 + 1.25}L0.45 ${y0 + 3.6}L0 ${y0 + 4.1}L-0.45 ${y0 + 3.6}Z" fill="${C.agent}"/>
      <path d="M-1.55 ${y0 - 0.1}L-2.9 ${y0 + 0.45}L-2.1 ${y0 + 1.6}L-2.6 ${y0 + 2}L0 ${y0 + 4.4}Z" fill="${td}"/>
      <path d="M1.55 ${y0 - 0.1}L2.9 ${y0 + 0.45}L2.1 ${y0 + 1.6}L2.6 ${y0 + 2}L0 ${y0 + 4.4}Z" fill="${dark(top, 0.28)}"/>
      <circle cx="0" cy="${y0 + 5.4}" r=".28" fill="${dark(top, 0.35)}"/>`;
    // tee
    return `<path d="M-1.35 ${y0}Q0 ${y0 + 1.75} 1.35 ${y0}Z" fill="${sd}"/>
      <path d="M-1.55 ${y0 - 0.05}Q0 ${y0 + 2.05} 1.55 ${y0 - 0.05}" fill="none" stroke="${td}" stroke-width=".38"/>`;
  }

  // ----- person -----
  const DEFAULTS = { k: 1, pose: 'bust', skin: SKIN[1], hair: 'short', hairColor: HAIR.brown, top: C.frontend, topStyle: 'tee',
    glasses: false, beard: false, headset: false, accessory: null, mood: 'smile', pants: '#46506A', flip: false };

  function bust(o) {
    const s = o.skin, top = o.top, td = dark(top, 0.2), y0 = -8.15;
    const h = head(o);
    const torso = `<path d="M-6.2 0L-6.2 -3.8C-6.2 -6.3 -5 -7.35 -2.8 -7.85L-1.3 -8.15L1.3 -8.15L2.8 -7.85C5 -7.35 6.2 -6.3 6.2 -3.8L6.2 0Z" fill="${top}"/>
      <path d="M2.8 -7.85C5 -7.35 6.2 -6.3 6.2 -3.8L6.2 0L4.55 0Q4.65 -2.6 4.3 -5.1Q3.9 -6.9 2.8 -7.85Z" fill="${td}" opacity=".75"/>`;
    const neck = `<rect x="-1.05" y="-9.9" width="2.1" height="2.4" fill="${s}"/><path d="M-1.05 -9.9L1.05 -9.9L1.05 -8.7Q0 -8.1 -1.05 -8.7Z" fill="${dark(s, 0.2)}"/>`;
    return `${shift(h.back, -9.25)}${torso}${neck}${neckline(o.topStyle, y0, top, s, 8)}${shift(h.front, -9.25)}`;
  }

  function shift(svg, y, k = 1) { return svg ? `<g transform="translate(0 ${y})${k !== 1 ? ` scale(${k})` : ''}">${svg}</g>` : ''; }

  // Standing figure, drawn ~22 mm tall and scaled to ~20 mm.
  function standing(o, arms) {
    const s = o.skin, top = o.top, td = dark(top, 0.2), pants = o.pants, pd = dark(pants, 0.22);
    const h = head(o);
    const y0 = -14.3;
    const legs = `<path d="M-2.55 -7.6L-2.35 -1.1L-0.45 -1.1L-0.2 -6.2L0.2 -6.2L0.45 -1.1L2.35 -1.1L2.55 -7.6Z" fill="${pants}"/>
      <path d="M0.2 -6.2L0.45 -1.1L2.35 -1.1L2.55 -7.6L1.6 -7.6Z" fill="${pd}" opacity=".6"/>`;
    const shoes = [-1, 1].map(k => `<path d="M${k * 0.3} -0.2L${k * 0.3} -1.35L${k * 2.45} -1.35Q${k * 3.25} -1 ${k * 3.15} -0.2Z" fill="#E8EAED"/><rect x="${k > 0 ? 0.3 : -3.15}" y="-0.45" width="2.85" height=".45" rx=".2" fill="#9DA0A8"/>`).join('');
    const torso = `<path d="M-2.75 -7.2L-3.05 -12.2C-3.1 -13.5 -2.6 -14 -1.3 -14.3L1.3 -14.3C2.6 -14 3.1 -13.5 3.05 -12.2L2.75 -7.2Q0 -6.8 -2.75 -7.2Z" fill="${top}"/>
      <path d="M1.3 -14.3C2.6 -14 3.1 -13.5 3.05 -12.2L2.75 -7.2Q2.1 -7.1 1.9 -7.1L2.05 -12.3Q2 -13.6 1.3 -14.3Z" fill="${td}" opacity=".75"/>`;
    const neck = `<rect x="-0.95" y="-15.7" width="1.9" height="2" fill="${s}"/><path d="M-0.95 -15.7L0.95 -15.7L0.95 -14.8Q0 -14.3 -0.95 -14.8Z" fill="${dark(s, 0.2)}"/>`;
    const arm = (d, hand) => `<path d="${d}" fill="none" stroke="${td}" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${hand[0]}" cy="${hand[1]}" r=".64" fill="${s}"/>`;
    const L = arms[0] === 'down' ? arm('M-2.75 -13.3Q-3.7 -11.2 -3.6 -8.6', [-3.6, -7.9]) : arms[0] || '';
    let R = '';
    if (arms[1] === 'down') R = arm('M2.75 -13.3Q3.7 -11.2 3.6 -8.6', [3.6, -7.9]);
    else if (arms[1] === 'point') R = arm('M2.75 -13.3Q4.4 -13.6 5.5 -16.2', [5.75, -16.75]) +
      `<path d="M5.95 -17.15L6.75 -18.55" stroke="${s}" stroke-width=".5" stroke-linecap="round"/>`;
    else if (arms[1] === 'gesture') R = arm('M2.75 -13.3Q4.6 -12.4 5.1 -14.2', [5.25, -14.85]);
    const torsoDetail = neckline(o.topStyle, y0, top, s, 7);
    const body = `${legs}${shoes}${torso}${neck}${torsoDetail}${L}${R}`;
    return `<g transform="scale(.9)">${shift(h.back, -15.3)}${body}${shift(h.front, -15.3)}</g>`;
  }

  function lectern(w = 9) {
    return `<path d="M${-w / 2 + 0.5} -7.3L${w / 2 - 0.5} -7.3L${w / 2 - 1.3} 0L${-w / 2 + 1.3} 0Z" fill="${C.surface2}"/>
      <path d="M${w / 2 - 0.5} -7.3L${w / 2 - 1.3} 0L${w / 2 - 2.4} 0L${w / 2 - 1.7} -7.3Z" fill="#000" opacity=".18"/>
      <rect x="${-w / 2}" y="-8.1" width="${w}" height="1.3" rx=".55" fill="#555963"/>
      <rect x="${-w / 2 + 0.5}" y="-8.0" width="${w - 1}" height=".35" rx=".17" fill="#6B7079"/>
      <rect x="-1.9" y="-5" width="3.8" height=".9" rx=".45" fill="url(#bolt)"/>
      <path d="M-1.6 -8.1Q-1.7 -9.6 -0.9 -10.6" fill="none" stroke="#6F737A" stroke-width=".3" stroke-linecap="round"/><rect x="-1.15" y="-11.7" width=".7" height="1.3" rx=".35" fill="#9DA0A8" transform="rotate(35 -0.8 -11)"/>`;
  }

  function person(x, y, opts = {}) {
    const o = { ...DEFAULTS, ...opts };
    if (opts.hair === 'grey' && !opts.hairColor) o.hairColor = HAIR.grey;
    if (o.skin != null && typeof o.skin === 'number') o.skin = SKIN[o.skin];
    let body;
    if (o.pose === 'stand') body = standing(o, ['down', 'down']);
    else if (o.pose === 'point') body = standing(o, ['down', 'point']);
    else if (o.pose === 'present') body = standing(o, ['', 'gesture']) + lectern();
    else body = bust(o);
    const flip = o.flip ? ' scale(-1 1)' : '';
    return `<g transform="translate(${x} ${y}) scale(${o.k})${flip}">${body}</g>`;
  }

  // ----- props -----
  // Laptop standing on a surface at (x, y). view 'back' (lid towards the viewer) or 'front' (screen towards the viewer).
  function laptop(x, y, k = 1, opts = {}) {
    const { view = 'back', color = '#5B5F68', screen = C.frontend } = opts;
    let g;
    if (view === 'front') {
      g = `<rect x="-5.6" y="-7.4" width="11.2" height="7" rx=".8" fill="${color}"/>
        <rect x="-4.9" y="-6.75" width="9.8" height="5.7" rx=".35" fill="${C.code}"/>
        <rect x="-4.2" y="-5.95" width="3" height=".7" rx=".35" fill="${C.kw}"/><rect x="-0.9" y="-5.95" width="3.6" height=".7" rx=".35" fill="${C.fn}"/>
        <rect x="-3.2" y="-4.75" width="4.4" height=".7" rx=".35" fill="${C.str}"/><rect x="1.5" y="-4.75" width="2" height=".7" rx=".35" fill="${C.text}" opacity=".5"/>
        <rect x="-3.2" y="-3.55" width="2.6" height=".7" rx=".35" fill="${screen}"/><rect x="-4.2" y="-2.35" width="1.6" height=".7" rx=".35" fill="${C.kw}"/>
        <path d="M-6.6 0L6.6 0L5.7 -0.75L-5.7 -0.75Z" fill="${light(color, 0.2)}"/><rect x="-1.4" y="-0.6" width="2.8" height=".3" rx=".15" fill="${dark(color, 0.2)}"/>`;
    } else {
      g = `<path d="M-5.3 -0.5L-5.6 -5.8C-5.62 -6.3 -5.3 -6.6 -4.8 -6.6L4.8 -6.6C5.3 -6.6 5.62 -6.3 5.6 -5.8L5.3 -0.5Z" fill="${color}"/>
        <path d="M1.5 -6.6L4.8 -6.6C5.3 -6.6 5.62 -6.3 5.6 -5.8L5.3 -0.5L2.6 -0.5Z" fill="#000" opacity=".1"/>
        <path d="M-4.75 -6.15L4.75 -6.15" stroke="${light(color, 0.22)}" stroke-width=".35" stroke-linecap="round"/>
        <circle cx="0" cy="-3.6" r=".9" fill="${light(color, 0.28)}"/>
        <rect x="-6.4" y="-0.75" width="12.8" height=".9" rx=".42" fill="${light(color, 0.3)}"/>`;
    }
    return `<g transform="translate(${x} ${y}) scale(${k})">${g}</g>`;
  }

  // Desk top whose upper surface is at y, centred on x.
  function desk(x, y, w = 24, opts = {}) {
    const { legs = false, color = '#4A4D55' } = opts;
    const l = x - w / 2;
    return (legs ? `<rect x="${f(l + 1.2)}" y="${y + 1}" width="1" height="6" fill="${dark(color, 0.2)}"/><rect x="${f(l + w - 2.2)}" y="${y + 1}" width="1" height="6" fill="${dark(color, 0.2)}"/>` : '') +
      `<rect x="${f(l)}" y="${y}" width="${w}" height="1.3" rx=".55" fill="${color}"/>
      <rect x="${f(l + 0.5)}" y="${y + 0.05}" width="${w - 1}" height=".35" rx=".17" fill="${light(color, 0.18)}"/>`;
  }

  // Person behind a laptop on a desk: (x, y) is the desk top under the laptop.
  function dev(x, y, opts = {}) {
    const { laptopColor, deskW = 22, k = 1 } = opts;
    return `<g transform="translate(${x} ${y}) scale(${k})">${person(0, 0.2, { ...opts, k: 1, pose: 'bust' })}${laptop(0, 0, 1, { color: laptopColor })}${desk(0, 0, deskW)}</g>`;
  }

  // ----- robot (AI agent) -----
  function robot(x, y, opts = {}) {
    const { k = 1, color = C.agent, expression = 'happy', body = false, arms = 'down', eye = '#F4E9FF' } = opts;
    const cd = dark(color, 0.25), cl = light(color, 0.35), visor = '#1A1424';
    const hy = body ? -6.4 : 0;   // bottom of the head
    const eyesY = hy - 4.1;
    const glow = (svg) => `<g opacity=".28" filter="none">${svg}</g>`;
    let eyes = '', mouth = '';
    if (expression === 'happy') {
      eyes = [-1, 1].map(s => `<path d="M${f(s * 1.45 - 0.75)} ${f(eyesY + 0.35)}q0.75 -1.05 1.5 0" fill="none" stroke="${eye}" stroke-width=".6" stroke-linecap="round"/>`).join('');
      mouth = `<path d="M-1.05 ${f(hy - 1.45)}Q0 ${f(hy - 0.55)} 1.05 ${f(hy - 1.45)}" fill="none" stroke="${dark(color, 0.5)}" stroke-width=".45" stroke-linecap="round"/>`;
    } else if (expression === 'focus') {
      eyes = [-1, 1].map(s => `<rect x="${f(s * 1.45 - 0.75)}" y="${f(eyesY - 0.25)}" width="1.5" height=".7" rx=".35" fill="${eye}"/>` +
        `<path d="M${f(s * 1.45 - 0.8)} ${f(eyesY - 0.95 + (s > 0 ? 0.25 : 0))}L${f(s * 1.45 + 0.8)} ${f(eyesY - 0.95 + (s > 0 ? 0 : 0.25))}" stroke="${eye}" stroke-width=".35" stroke-linecap="round" opacity=".7"/>`).join('');
      mouth = `<rect x="-0.9" y="${f(hy - 1.25)}" width="1.8" height=".42" rx=".21" fill="${dark(color, 0.5)}"/>`;
    } else if (expression === 'scan') {
      eyes = glow(`<rect x="-3.1" y="${f(eyesY - 0.8)}" width="6.2" height="1.6" rx=".8" fill="${eye}"/>`) +
        `<rect x="-2.8" y="${f(eyesY - 0.3)}" width="5.6" height=".6" rx=".3" fill="${eye}" opacity=".55"/>
         <circle cx="1.2" cy="${f(eyesY)}" r=".62" fill="#fff"/>`;
      mouth = [-0.7, 0, 0.7].map(dx => `<circle cx="${dx}" cy="${f(hy - 1.05)}" r=".22" fill="${dark(color, 0.5)}"/>`).join('');
    } else {   // neutral
      eyes = [-1, 1].map(s => glow(`<circle cx="${s * 1.45}" cy="${f(eyesY)}" r="1.15" fill="${eye}"/>`) + `<circle cx="${s * 1.45}" cy="${f(eyesY)}" r=".7" fill="${eye}"/>`).join('');
      mouth = `<rect x="-0.9" y="${f(hy - 1.25)}" width="1.8" height=".42" rx=".21" fill="${dark(color, 0.5)}"/>`;
    }
    const headSvg = `
      <path d="M0 ${f(hy - 7.4)}L0 ${f(hy - 9.1)}" stroke="${cd}" stroke-width=".5" stroke-linecap="round"/>
      <circle cx="0" cy="${f(hy - 9.55)}" r=".8" fill="${C.gold}"/><circle cx="-0.22" cy="${f(hy - 9.8)}" r=".25" fill="#fff" opacity=".6"/>
      ${[-1, 1].map(s => `<rect x="${f(s * 4.85 - 0.55)}" y="${f(hy - 5)}" width="1.1" height="2.8" rx=".5" fill="${cd}"/>`).join('')}
      <rect x="-4.6" y="${f(hy - 7.4)}" width="9.2" height="7.4" rx="2.6" fill="${cd}"/>
      <rect x="-4.6" y="${f(hy - 7.4)}" width="9.2" height="6.75" rx="2.6" fill="${color}"/>
      <path d="M-3.1 ${f(hy - 6.75)}Q-1.4 ${f(hy - 7.1)} 1.2 ${f(hy - 7.0)}" fill="none" stroke="${cl}" stroke-width=".45" stroke-linecap="round" opacity=".8"/>
      <rect x="-3.65" y="${f(hy - 6.05)}" width="7.3" height="3.9" rx="1.6" fill="${visor}"/>
      <path d="M-2.9 ${f(hy - 5.55)}L-1.6 ${f(hy - 5.55)}" stroke="#fff" stroke-width=".3" stroke-linecap="round" opacity=".18"/>
      ${eyes}${mouth}`;
    let bodySvg = '';
    if (body) {
      const arm = (s, up) => up
        ? `<path d="M${s * 3.3} -5Q${s * 5.2} -5.6 ${s * 5.6} -8" fill="none" stroke="${cd}" stroke-width="1.3" stroke-linecap="round"/><circle cx="${s * 5.7}" cy="-8.4" r=".8" fill="${color}"/>`
        : `<path d="M${s * 3.3} -5Q${s * 4.6} -4 ${s * 4.5} -2.3" fill="none" stroke="${cd}" stroke-width="1.3" stroke-linecap="round"/><circle cx="${s * 4.5}" cy="-1.95" r=".8" fill="${color}"/>`;
      const armSvg = arms === 'none' ? '' : arm(-1, false) + arm(1, arms === 'wave');
      bodySvg = `<ellipse cx="0" cy="-0.1" rx="2.8" ry=".45" fill="#000" opacity=".3"/>
        <ellipse cx="0" cy="-0.95" rx="1.5" ry=".4" fill="${cl}" opacity=".45"/>
        ${armSvg}
        <rect x="-0.9" y="-7" width="1.8" height="1.4" fill="${cd}"/>
        <path d="M-3.5 -5.2Q-3.5 -6.1 -2.6 -6.1L2.6 -6.1Q3.5 -6.1 3.5 -5.2L3.1 -2.4Q2.9 -1.15 1.6 -1.15L-1.6 -1.15Q-2.9 -1.15 -3.1 -2.4Z" fill="${cd}"/>
        <path d="M-3.5 -5.2Q-3.5 -6.1 -2.6 -6.1L2.6 -6.1Q3.5 -6.1 3.5 -5.2L3.2 -2.9Q3 -1.7 1.7 -1.7L-1.7 -1.7Q-3 -1.7 -3.2 -2.9Z" fill="${color}"/>
        <rect x="-1.5" y="-4.9" width="3" height="1.9" rx=".6" fill="${visor}"/>
        <circle cx="-0.6" cy="-3.95" r=".35" fill="${C.backend}"/><rect x="0.05" y="-4.15" width="1" height=".4" rx=".2" fill="${eye}" opacity=".7"/>`;
    }
    return `<g transform="translate(${x} ${y}) scale(${k})">${bodySvg}${headSvg}</g>`;
  }

  return { SKIN, HAIR, mix, dark, light, person, laptop, desk, dev, robot, lectern };
})();

// Per-card art, keyed by card id; filled by print/data/*.js
const ART = {};

// Card data; filled by print/data/*.js
const CARDS = [];

// ---------- template ----------
//
// Card data shape (see print/data/*.js):
// {
//   id, name, type: 'team'|'feature'|'library'|'business', sprint: 1|2|3,
//   copies: [3, 4],                  // one printed copy per entry, footer shows "3+", "4+"…
//   points: 2,                       // ⭐ in the header (0 = no star)
//   costCoins: 2, cost: ['backend', 'frontend', 'agent'],   // max 4 items in total
//   freeWith: 'Ktor',                // adds the chain badge on the cost box
//   file: 'Server.kt',               // IDE tab name above the art
//   effects: [ …blocks, top to bottom… ],
//   code: [[C.fn, 'get'], [C.text, '(…)']],   // ≤ 40 chars in total
//   comment: 'a whole backend in one expression',   // ≤ 40 chars, printed after "// "
// }
// Effect blocks:
//   { kind: 'chips', label: 'MAKES FREE FOR YOU' | 'FREE IF YOU BUILT', chips: [{ kind: <card type>, name, sprint }] }
//   { kind: 'produces', units: [['frontend'], ['frontend', 'backend']] }   // inner array = "one of"
//   { kind: 'tile', icon: 'coin'|'star', amount: 2, label: 'NOW'|'AT GAME END'|'ALWAYS', text: 'per your {team} Team card' }
// Rich text: {frontend} {backend} {agent} {coin} {coin:2} {star} {star:1} {team} {feature} {library} {business}

const EFFECT_BOTTOM = 72, BLOCK_GAP = 1.6;

function iconAt(name, n, x, y, s) {
  if (['frontend', 'backend', 'agent'].includes(name))
    return `<use href="#i-${name}" x="${x}" y="${y}" width="${s}" height="${s}"/>`;
  if (name === 'coin')
    return `<use href="#i-coin" x="${x}" y="${y}" width="${s}" height="${s}"/>` +
      (n != null ? `<text x="${x + s / 2}" y="${y + s * 0.69}" font-size="${(s * 0.56).toFixed(2)}" font-weight="800" fill="#3A2A05" text-anchor="middle">${n}</text>` : '');
  if (name === 'star')
    return `<use href="#i-star" x="${x}" y="${y}" width="${s}" height="${s}" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".3"/>` +
      (n != null ? `<text x="${x + s / 2}" y="${y + s * 0.67}" font-size="${(s * 0.4).toFixed(2)}" font-weight="800" fill="#3A2A05" text-anchor="middle">${n}</text>` : '');
  if (TYPES[name]) {
    const p = s * 0.14;
    return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.2}" fill="${TYPES[name].color}"/>` +
      `<use href="#${TYPES[name].icon}" x="${x + p}" y="${y + p}" width="${s - 2 * p}" height="${s - 2 * p}"/>`;
  }
  return '';
}

// Text with inline icons; monospace makes widths exact. Returns { svg, width }.
function rich(str, x, y, size, { fill = C.text, weight = 700, anchor = 'start', maxW = Infinity, minSize = 2.1 } = {}) {
  const parts = [];
  const re = /\{(\w+)(?::(\d+))?\}/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) parts.push({ t: str.slice(last, m.index) });
    parts.push({ icon: m[1], n: m[2] });
    last = re.lastIndex;
  }
  if (last < str.length) parts.push({ t: str.slice(last) });
  const widthAt = sz => parts.reduce((w, p) => w + (p.t != null ? p.t.length * MONO * sz : sz * 1.35), 0);
  while (widthAt(size) > maxW && size > minSize) size -= 0.05;
  const w = widthAt(size);
  let cx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  let out = '';
  for (const p of parts) {
    if (p.t != null) {
      out += `<text x="${cx.toFixed(2)}" y="${y}" font-size="${size.toFixed(2)}" font-weight="${weight}" fill="${fill}" xml:space="preserve">${esc(p.t)}</text>`;
      cx += p.t.length * MONO * size;
    } else {
      const s = size * 1.2;
      out += iconAt(p.icon, p.n, cx + size * 0.075, y - size * 0.9, s);
      cx += size * 1.35;
    }
  }
  return { svg: out, width: w };
}

function costBox(card) {
  // Up to 4 cost items; coins come first and show their amount.
  const items = [];
  if (card.costCoins) items.push({ coin: card.costCoins });
  (card.cost || []).forEach(r => items.push({ res: r }));
  const box = `<rect x="6" y="6" width="12.4" height="15" rx="1.8" fill="${C.bg}"/>`;
  const label = items.length
    ? `<text x="12.2" y="19.7" font-size="1.9" font-weight="700" fill="${C.muted}" text-anchor="middle" letter-spacing=".15">COST</text>`
    : `<text x="12.2" y="14.6" font-size="2.6" font-weight="800" fill="${C.text}" text-anchor="middle">FREE</text>`;
  const icon = (it, x, y, s) => it.coin ? iconAt('coin', it.coin, x, y, s) : iconAt(it.res, null, x, y, s);
  let icons = '';
  if (items.length === 1) icons = icon(items[0], 8.2, 7, 8);
  else items.forEach((it, i) => {
    const row = Math.floor(i / 2), inRow = Math.min(2, items.length - row * 2);
    const s = 5, gap = 0.4, rowW = inRow * s + (inRow - 1) * gap;
    const x = 12.2 - rowW / 2 + (i % 2) * (s + gap);
    const rows = Math.ceil(items.length / 2);
    const y = (rows === 1 ? 9.6 : 7.1) + row * (s + 0.3);
    icons += icon(it, x, y, s);
  });
  const chainBadge = card.freeWith
    ? `<circle cx="18.2" cy="20.4" r="2.4" fill="#7F52FF" stroke="${C.bg}" stroke-width=".5"/>
       <use href="#i-chain" x="16.4" y="18.6" width="3.6" height="3.6" color="#fff"/>`
    : '';
  return box + icons + label + chainBadge;
}

function nameBlock(card) {
  const x = 21.2, maxW = card.points ? 27.6 : 41;
  const fit = (len, max) => Math.min(max, maxW / (len * MONO));
  let size = fit(card.name.length, 7);
  // break points: spaces (dropped) and after "." or "/" (kept on the first line)
  const breaks = [];
  for (let i = 1; i < card.name.length - 1; i++) {
    const ch = card.name[i];
    if (ch === ' ') breaks.push([card.name.slice(0, i), card.name.slice(i + 1)]);
    else if (ch === '.' || ch === '/') breaks.push([card.name.slice(0, i + 1), card.name.slice(i + 1)]);
  }
  if (size >= 4 || !breaks.length) return `<text x="${x}" y="17.6" font-size="${size.toFixed(2)}" font-weight="800" fill="#fff">${esc(card.name)}</text>`;
  // shortest longest-line wins, but within 1 char of it prefer the longer first line ("Wear OS / App", not "Wear / OS App")
  const minM = Math.min(...breaks.map(([a, b]) => Math.max(a.length, b.length)));
  const ok = breaks.filter(([a, b]) => Math.max(a.length, b.length) <= minM + 1);
  const [ba, bb] = ok.reduce((p, c) => c[0].length > p[0].length ? c : p);
  const best = { a: ba, b: bb, m: Math.max(ba.length, bb.length) };
  size = fit(best.m, 4.6);
  const y1 = 14.3, y2 = y1 + size * 1.08;   // keeps line 2 above the header edge (22.5)
  return `<text font-size="${size.toFixed(2)}" font-weight="800" fill="#fff"><tspan x="${x}" y="${y1.toFixed(2)}">${esc(best.a)}</tspan><tspan x="${x}" y="${y2.toFixed(2)}">${esc(best.b)}</tspan></text>`;
}

function starBadge(points) {
  if (!points) return '';
  // Star centre is at (56.1, 12.5); the digit is centred on it, clear of the lower inner corners.
  return `<use href="#i-star" x="49.6" y="5.6" width="13" height="13" fill="${C.gold}" stroke="${C.goldDark}" stroke-width=".4"/>
    <text x="56.1" y="13.85" font-size="4.1" font-weight="800" fill="#3A2A05" text-anchor="middle">${points}</text>`;
}

// ----- effect blocks -----

function blockLabel(text, y, color, icon) {
  return (icon ? `<use href="#${icon}" x="6.4" y="${y}" width="3.6" height="3.6" color="${color}"/>` : '') +
    `<text x="${icon ? 10.8 : 6.6}" y="${y + 2.8}" font-size="2.15" font-weight="700" fill="${color}" letter-spacing=".2">${esc(text)}</text>`;
}

function chip(c, y, inlineLabel) {
  const icon = c.kind === 'feature'
    ? `<use href="#i-star" x="8.2" y="${y + 1.4}" width="3.8" height="3.8" fill="${TYPES.feature.color}"/>`
    : iconAt(c.kind, null, 8.1, y + 1.25, 4.1);
  const sprint = `SPRINT ${SPRINTS[c.sprint][0]}`;
  const sprintW = sprint.length * (2 * MONO + 0.2);
  const maxW = 59.6 - sprintW - 2.6 - 13.6;   // never runs under the sprint label
  const name = inlineLabel
    ? `<text x="13.6" y="${y + 2.5}" font-size="1.65" font-weight="700" fill="${C.chain}" letter-spacing=".15">${esc(inlineLabel)}</text>` +
      rich(c.name, 13.6, y + 5.5, 2.6, { maxW, minSize: 2 }).svg
    : rich(c.name, 13.6, y + 4.4, 2.9, { maxW, minSize: 2 }).svg;
  return `<rect x="6.5" y="${y}" width="56" height="6.6" rx="1.3" fill="${C.surface}" stroke="${TYPES[c.kind].color}" stroke-width=".35"/>
    ${icon}${name}
    <text x="59.6" y="${y + 4.2}" font-size="2" fill="${C.muted}" text-anchor="end" letter-spacing=".2">${sprint}</text>`;
}

const BLOCKS = {
  chips: {
    // b.compact is set by layout() when the card has several chips blocks: the label moves into each chip.
    height: b => (b.compact ? 0 : 4.6) + b.chips.length * 6.6 + (b.chips.length - 1) * 1.2,
    render: (b, y) => b.compact
      ? b.chips.map((c, i) => chip(c, y + i * 7.8, b.label)).join('')
      : blockLabel(b.label, y, C.chain, 'i-chain') + b.chips.map((c, i) => chip(c, y + 4.6 + i * 7.8)).join(''),
  },
  produces: {
    height: () => 10,
    render: (b, y) => {
      const s = 7, slash = 2.4, pad = 1.2, gap = 3;
      const unitW = u => u.length === 1 ? s : u.length * s + (u.length - 1) * slash + 2 * pad;
      const total = b.units.reduce((w, u) => w + unitW(u), 0) + (b.units.length - 1) * gap;
      let x = 43 - total / 2, out = '';   // icons centred in the area right of the label
      for (const u of b.units) {
        if (u.length === 1) out += iconAt(u[0], null, x, y + 1.5, s);
        else {
          out += `<rect x="${x}" y="${y + 1}" width="${unitW(u)}" height="${s + 1}" rx="${(s + 1) / 2}" fill="${C.bg}" stroke="${C.border}" stroke-width=".3"/>`;
          u.forEach((r, i) => {
            const ix = x + pad + i * (s + slash);
            out += iconAt(r, null, ix, y + 1.5, s);
            if (i < u.length - 1) out += `<text x="${ix + s + slash / 2}" y="${y + 6.6}" font-size="3.4" fill="${C.muted}" text-anchor="middle">/</text>`;
          });
        }
        x += unitW(u) + gap;
      }
      return `<rect x="6.5" y="${y}" width="56" height="10" rx="1.3" fill="${C.surface}" stroke="${TYPES.team.color}" stroke-width=".35"/>
        <use href="#i-team-line" x="8.4" y="${y + 1.6}" width="3.4" height="3.4" color="#4FD1B0"/>
        <text x="8.6" y="${y + 7.8}" font-size="2.15" font-weight="700" fill="#4FD1B0" letter-spacing=".2">PRODUCES</text>` + out;
    },
  },
  tile: {
    height: () => 9.6,
    render: (b, y) => {
      const stroke = b.icon === 'star' ? C.gold : C.goldDark;
      const icon = iconAt(b.icon, b.amount, 8.2, y + 1.3, 7);
      const label = `<text x="17.4" y="${y + 3.7}" font-size="1.9" font-weight="700" fill="${C.muted}" letter-spacing=".2">${esc(b.label || '')}</text>`;
      const text = rich(b.text, 17.4, y + 7.3, 2.7, { maxW: 43.5 }).svg;
      return `<rect x="6.5" y="${y}" width="56" height="9.6" rx="1.3" fill="${C.surface}" stroke="${stroke}" stroke-width=".35"/>` + icon + label + text;
    },
  },
};

function blocksOf(card) {
  const bs = card.effects || [];
  const compact = bs.filter(b => b.kind === 'chips').length > 1;
  return bs.map(b => b.kind === 'chips' ? { ...b, compact } : b);
}

function effectsHeight(card) {
  const bs = blocksOf(card);
  return bs.reduce((h, b) => h + BLOCKS[b.kind].height(b), 0) + Math.max(0, bs.length - 1) * BLOCK_GAP;
}

function effectBlocks(card) {
  let y = EFFECT_BOTTOM - effectsHeight(card), out = '';
  for (const b of blocksOf(card)) { out += BLOCKS[b.kind].render(b, y); y += BLOCKS[b.kind].height(b) + BLOCK_GAP; }
  return out;
}

function renderCard(card, { guides = true, players = card.copies[0], ns = 'g', artWin = 0 } = {}) {
  // artWin > 0: fixed art-window height and no effect blocks (used to export the art for the game app)
  const t = TYPES[card.type];
  const uid = `${ns}-${card.id}-${players}`;   // ns keeps ids unique when the same card is on the page twice (gallery + print sheet)
  const [roman, sprintName] = SPRINTS[card.sprint];
  const eh = effectsHeight(card);
  const winH = artWin || EFFECT_BOTTOM - eh - (eh ? 2.6 : 0) - 25;   // no effects: the window reaches down to the code block
  // Art is drawn for a 56x21 mm area (x 6.5..62.5, y 29..50); scale it down if the window is shorter, centre it if taller.
  // card.artH: height of the drawn art (default 21), always centred on y 39.5 in art coordinates.
  const artH = card.artH || 21;
  const k = Math.min(1, (winH - 4) / artH);
  const shiftY = ((winH - 4) - 21 * k) / 2;
  const artTransform = `translate(${(36.5 * (1 - k)).toFixed(2)} ${(29 * (1 - k) + shiftY).toFixed(2)}) scale(${k.toFixed(3)})`;
  const lines = Math.floor((winH - 4) / 3.5);
  const code = card.code.map(([c, s]) => `<tspan fill="${c}">${esc(s)}</tspan>`).join('');
  const art = ART[card.id] ? ART[card.id]() : `<text x="36.5" y="41" font-size="2.4" fill="${C.faint}" text-anchor="middle">// TODO: art</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69 94" font-family="JetBrains Mono, monospace" style="font-variant-ligatures:none" data-card="${card.id}">
  <defs><linearGradient id="hdr-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.grad[0]}"/><stop offset="1" stop-color="${t.grad[1]}"/></linearGradient>
    <clipPath id="win-${uid}"><rect x="6.5" y="25" width="56" height="${winH}" rx="1.4"/></clipPath></defs>
  <rect width="69" height="94" fill="${C.bg}"/>

  <!-- header: type colour, name, stars (the part you see when cards overlap) -->
  <rect width="69" height="22.5" fill="url(#hdr-${uid})"/>
  <rect width="69" height="22.5" fill="url(#stripes)"/>
  <rect y="22.5" width="69" height="0.6" fill="${C.bg}" opacity=".35"/>
  ${costBox(card)}
  <use href="#${t.icon}" x="21.4" y="7.2" width="3.2" height="3.2"/>
  <text x="25.2" y="9.7" font-size="2.3" font-weight="700" fill="#fff" fill-opacity=".85" letter-spacing=".35">${t.label}</text>
  ${nameBlock(card)}
  ${starBadge(card.points)}

  <!-- IDE window with art -->
  <rect x="6.5" y="25" width="56" height="${winH}" rx="1.4" fill="${C.surface}"/>
  <g clip-path="url(#win-${uid})">
    <rect x="6.5" y="29" width="56" height="${winH - 4}" fill="url(#dots)"/>
    <rect x="6.5" y="25" width="56" height="4" fill="${C.surface2}"/>
    <circle cx="9" cy="27" r=".6" fill="#F26D6D"/><circle cx="10.8" cy="27" r=".6" fill="${C.gold}"/><circle cx="12.6" cy="27" r=".6" fill="#5FB865"/>
    <rect x="15" y="25" width="${2.8 + card.file.length * 1.14}" height="4" fill="${C.surface}"/>
    <rect x="15" y="28.6" width="${2.8 + card.file.length * 1.14}" height=".4" fill="${t.color}"/>
    <text x="16.4" y="27.8" font-size="1.9" fill="${C.text}">${esc(card.file)}</text>
    <rect x="6.5" y="29" width="4" height="${winH - 4}" fill="${C.bg}" opacity=".45"/>
    <g font-size="1.5" fill="#6F737A" text-anchor="end">${Array.from({ length: lines }, (_, i) => i + 1).map(n => `<text x="9.8" y="${28.5 + n * 3.5}">${n}</text>`).join('')}</g>
    <g transform="${artTransform}">${art}</g>
  </g>
  <rect x="6.5" y="25" width="56" height="${winH}" rx="1.4" fill="none" stroke="${C.border}" stroke-width=".3"/>

  ${artWin ? '' : effectBlocks(card)}

  <!-- flavor as code -->
  <rect x="6.5" y="73.8" width="56" height="8.4" rx="1.2" fill="${C.code}"/>
  <rect x="6.5" y="73.8" width=".6" height="8.4" fill="${t.color}"/>
  <text x="8.4" y="77.4" font-size="1.95" xml:space="preserve">${code}</text>
  <text x="8.4" y="80.5" font-size="1.85" font-style="italic" fill="${C.faint}">// ${esc(card.comment)}</text>

  <!-- footer: sprint and player count -->
  <rect x="6.5" y="84" width="${3 + roman.length * 1.5}" height="3.4" rx=".8" fill="${C.surface2}"/>
  <text x="${6.5 + (3 + roman.length * 1.5) / 2}" y="86.4" font-size="2.1" font-weight="800" fill="${C.text}" text-anchor="middle">${roman}</text>
  <text x="${11.4 + roman.length * 1.5}" y="86.4" font-size="2" fill="${C.muted}" letter-spacing=".15">${sprintName}</text>
  <use href="#i-person" x="55" y="84.1" width="3.2" height="3.2"/>
  <text x="62.5" y="86.6" font-size="2.2" font-weight="700" fill="${C.muted}" text-anchor="end">${players}+</text>

  ${guides ? `<g class="guide" fill="none" stroke-width=".25">
    <rect x="3" y="3" width="63" height="88" rx="3" stroke="#FF4D4D" stroke-dasharray="1 .8"/>
    <rect x="6" y="6" width="57" height="82" rx="1" stroke="#33D1FF" stroke-dasharray=".6 .8" opacity=".7"/>
  </g>` : ''}
</svg>`;
}

const TYPE_ORDER = ['team', 'library', 'feature', 'business'];
function sortedCards() {
  return [...CARDS].sort((a, b) => a.sprint - b.sprint || TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));
}

// ---------- card backs ----------
// One shared design, one accent per Sprint so the deck can be sorted face down.
// The accents follow a CI build status (red → amber → green): "Hello, World" is still failing, "Release 1.0" ships green.
// Gradients only fill shapes (never text or strokes), which keeps PDF output portable across viewers/RIPs.
// Everything that matters sits ≥ 6 mm inside the trim and the layout is mirror-symmetric, so duplex misregistration is harmless.
const BACK_ACCENTS = { 1: '#FF6B6B', 2: '#F7C948', 3: '#8BD450' };

function renderBack(sprint, { guides = false, ns = 'g' } = {}) {
  const uid = `${ns}-back-${sprint}`;
  const acc = BACK_ACCENTS[sprint];
  const [roman, sprintName] = SPRINTS[sprint];
  const cx = 34.5, cy = 49, R = 14.2;
  const f = n => n.toFixed(2);

  // progress ring: three 120° segments starting at 12 o'clock, the first `sprint` of them lit
  const gapDeg = 10;
  const pt = deg => { const a = (deg - 90) * Math.PI / 180; return [f(cx + R * Math.cos(a)), f(cy + R * Math.sin(a))]; };
  const seg = i => { const a0 = i * 120 + gapDeg / 2, [x0, y0] = pt(a0), [x1, y1] = pt(a0 + 120 - gapDeg); return `M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}`; };
  const ring = [0, 1, 2].map(i => `<path d="${seg(i)}" fill="none" stroke="${i < sprint ? acc : C.surface2}" stroke-width="1.8" stroke-linecap="round"/>`).join('');
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const a = i * 10 * Math.PI / 180, r0 = R + 2.2, r1 = R + (i % 3 === 0 ? 3.3 : 2.7);
    return `<line x1="${f(cx + r0 * Math.sin(a))}" y1="${f(cy - r0 * Math.cos(a))}" x2="${f(cx + r1 * Math.sin(a))}" y2="${f(cy - r1 * Math.cos(a))}"/>`;
  }).join('');

  // big curly braces framing the emblem: { II }
  const brace = (x, dir) => { const d = dir, h = 15.5, y0 = cy - h, y1 = cy + h;
    return `<path d="M${x + 2.6 * d} ${y0} C${x} ${y0} ${x + 0.4 * d} ${y0 + 2} ${x + 0.4 * d} ${y0 + 5} L${x + 0.4 * d} ${cy - 3.4}
      C${x + 0.4 * d} ${cy - 1} ${x - 0.6 * d} ${cy} ${x - 2 * d} ${cy} C${x - 0.6 * d} ${cy} ${x + 0.4 * d} ${cy + 1} ${x + 0.4 * d} ${cy + 3.4}
      L${x + 0.4 * d} ${y1 - 5} C${x + 0.4 * d} ${y1 - 2} ${x} ${y1} ${x + 2.6 * d} ${y1}"/>`; };

  const numSize = roman.length === 3 ? 10.5 : 12;
  const corner = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})">
      <text x="0" y="0" font-size="3" font-weight="800" fill="${acc}" text-anchor="middle">${roman}</text>
      <g transform="translate(0 2)">${[0, 1, 2].map(i => `<circle cx="${(i - 1) * 1.4}" cy="0" r=".42" fill="${i < sprint ? acc : C.surface2}"/>`).join('')}</g></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69 94" font-family="JetBrains Mono, monospace" style="font-variant-ligatures:none" data-back="${sprint}">
  <defs>
    <radialGradient id="glow-${uid}">
      <stop offset="0" stop-color="${acc}" stop-opacity=".26"/><stop offset=".5" stop-color="${acc}" stop-opacity=".07"/><stop offset="1" stop-color="${acc}" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig-${uid}" r=".72">
      <stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
  </defs>
  <rect width="69" height="94" fill="#1A1B1E"/>
  <rect width="69" height="94" fill="url(#dots)"/>
  <circle cx="${cx}" cy="${cy}" r="36" fill="url(#glow-${uid})"/>
  <rect width="69" height="94" fill="url(#vig-${uid})"/>

  <!-- wordmark -->
  <g text-anchor="middle">
    <text x="16.2" y="22.4" font-size="6.4" font-weight="800" letter-spacing="-.2" fill="${C.text}" text-anchor="start">Startup</text>
    <text x="41.68" y="22.4" font-size="6.4" font-weight="800" letter-spacing="-.2" fill="#B16CFF" text-anchor="start"><tspan fill="#F0506E">.</tspan>kt</text>
    <text x="34.5" y="26.6" font-size="1.7" font-weight="700" letter-spacing=".5" fill="${C.faint}">BUILD · SHIP · COLLECT STARS</text>
  </g>

  <!-- sprint emblem -->
  <g fill="none" stroke="${acc}" stroke-width=".55" stroke-linecap="round" stroke-linejoin="round" opacity=".55">${brace(12.2, 1)}${brace(56.8, -1)}</g>
  <circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="#1A1B1E" opacity=".7"/>
  <g stroke="${C.border}" stroke-width=".25" stroke-linecap="round">${ticks}</g>
  <circle cx="${cx}" cy="${cy}" r="${R - 2.4}" fill="${C.surface}" opacity=".6"/>
  ${ring}
  <text x="${cx}" y="${cy - 5.6}" font-size="1.7" font-weight="700" letter-spacing=".5" fill="${C.muted}" text-anchor="middle">SPRINT</text>
  <g font-size="${numSize}" font-weight="800" letter-spacing="-.3" text-anchor="middle">
    <text x="${cx}" y="${f(cy + numSize * 0.36 + 0.45)}" fill="${Kit.dark(acc, 0.55)}">${roman}</text>
    <text x="${cx}" y="${f(cy + numSize * 0.36)}" fill="${acc}">${roman}</text></g>

  <!-- sprint name -->
  <text x="34.5" y="${f(cy + R + 11)}" font-size="3.5" font-weight="800" letter-spacing=".35" fill="${acc}" text-anchor="middle">${sprintName}</text>

  <!-- corner indices (mirror-symmetric) -->
  ${corner(12, 12.6, 0)}${corner(57, 12.6, 0)}${corner(12, 81.4, 180)}${corner(57, 81.4, 180)}

  ${guides ? `<g class="guide" fill="none" stroke-width=".25">
    <rect x="3" y="3" width="63" height="88" rx="3" stroke="#FF4D4D" stroke-dasharray="1 .8"/>
    <rect x="6" y="6" width="57" height="82" rx="1" stroke="#33D1FF" stroke-dasharray=".6 .8" opacity=".7"/>
  </g>` : ''}
</svg>`;
}
