# Startup.kt cards: critical review brief

You are a **senior illustrator and art director** doing a harsh quality pass on one batch of printable cards before they
go to a print shop. The owner's verdict on the current deck: *"several look unfinished: the unicorn, the little people,
and especially Accessibility"*. Your job is to make every card in your batch look professionally illustrated and truly
finished. Not "fine". Ship-quality, like a published board game.

Read first: `print/DESIGN-BRIEF.md` (rules, card data, art area, how to render), `print/cards.js` (template, `Kit`
character kit, colours `C`), `print/kit.html` + `print/previews/kit.png` (the character kit demo).

## Process (per card)
1. Render it at 2× (`?shot=<id>`, command in DESIGN-BRIEF.md) and look at it with the Read tool.
2. **Critique it in writing first**, scoring 1–10 on: concept clarity (what the card *is*, readable at arm's length),
   illustration craft (shapes, proportions, detail, depth/shading), composition (balance, fills the window, focal point,
   margins), consistency with the deck (palette, corner radii, line weights, Kit characters), text (code/comment wit,
   lengths, no clipping). Anything below 8 must be redone.
3. Redo the art: rebuild weak drawings from scratch rather than nudging. Typical fixes:
   - **All people and robots must use `Kit.person` / `Kit.robot` / `Kit.laptop` / `Kit.desk`.** Delete hand-drawn
     blob people. Vary skin tone, hair, outfit and pose so the cast feels diverse and every role is recognisable.
   - Replace placeholder-looking boxes/text with real visual metaphors; give objects depth (a darker side/shadow tone,
     a highlight), consistent rounded corners, and a clear focal point.
   - Use 2–3 accent colours per card, not a rainbow; keep small labels ≥ 1.6 mm and few of them.
   - Composition: art should fill the window (respect the art area and `artH` rules in DESIGN-BRIEF.md), no dead
     corners, nothing touching the window edge.
4. Re-render, re-critique, repeat until every axis is ≥ 8. Expect 2–4 iterations per card.

## Rules
- Edit **only your batch's data file** in `print/data/` (and PNGs in `print/previews/`). Never edit `cards.js`,
  `index.html`, the briefs or other batches. If the template or Kit blocks you, say so in your final report.
- Card facts (cost, points, copies, chains, effect wording) must stay exactly as they are unless they contradict
  `core/src/commonMain/kotlin/startupkt/engine/Cards.kt`.
- No real logos or trademarks.
- Your file stays an IIFE; local helpers stay local.

## Final report
For each card: score before → after, and one line on what changed. Then any template/Kit limitation you hit.

## Kit API (print/cards.js, demo in print/kit.html and print/previews/kit.png)
All functions return SVG strings in card millimetres; (x, y) = bottom-centre of the figure or prop.
- `Kit.SKIN` (5 tones, light → dark, index 0–4), `Kit.HAIR` { black, brown, chestnut, auburn, blonde, grey, pink, blue },
  `Kit.mix(a, b, t)`, `Kit.dark(c, t = 0.2)`, `Kit.light(c, t = 0.25)`.
- `Kit.person(x, y, opts)`: `k` (1); `pose` 'bust' (default, ~16 mm tall, ~12.4 mm wide) | 'stand' (~20 mm) |
  'point' (right finger tip at ≈ +6.1, −16.7) | 'present' (behind a lectern); `skin` (hex or 0–4); `hair` 'short' | 'side' |
  'long' | 'bun' | 'curly' | 'buzz' | 'bald' | 'grey'; `hairColor`; `top` (colour); `topStyle` 'tee' | 'hoodie' | 'shirt' |
  'blazer'; `pants`; `glasses` (true | colour); `beard` (true | colour); `headset` (true | colour); `accessory` 'sprout' |
  'horn' | 'halo' | 'crown'; `mood` 'smile' | 'happy' | 'grin' | 'neutral' | 'talk'; `flip`.
- `Kit.robot(x, y, opts)`: `k`; `color` (C.agent); `expression` 'happy' | 'focus' | 'scan' | 'neutral'; `body` (false: head
  ~10.4×10.8 mm; true: ~16.8 mm with torso); `arms` 'down' | 'wave' | 'none'; `eye`.
- `Kit.laptop(x, y, k = 1, { view: 'back' | 'front', color, screen })`, `Kit.desk(x, y, w = 24, { legs, color })`,
  `Kit.dev(x, y, opts)` = bust behind a laptop on a desk (y = desk top; person opts + `k`, `laptopColor`, `deskW`),
  `Kit.lectern(w = 9)` at the origin.
- In a 21 mm art window a 'stand'/'point' figure fits at k = 1; `Kit.dev(22, 48.5, …)` sits well with props beside it.
