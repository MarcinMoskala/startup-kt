# Startup.kt printable cards: design brief

Physical cards for playing Startup.kt at a table (63×88 mm poker size, 3 mm bleed).
These designs are the new reference; the in-game `CardView` will later be updated to match them.

## Files
- `print/cards.js`: the shared template (`renderCard`), colours `C`, card types `TYPES`, icons, art helpers
  `serverRack(x, y, k)` and `phone(x, y)`. The comment block above `iconAt` documents the card data shape and effect blocks.
- `print/data/00-examples.js`: the two reference cards, **Ktor** (Library) and **REST API** (Feature). Match their quality.
- `print/data/NN-*.js`: one file per design batch. Each file is wrapped in an IIFE `(() => { … })();`
  (all files share one global scope, so never declare top-level functions or constants), then calls
  `Object.assign(ART, { … })` and `CARDS.push(…)`.
- Source of truth for card facts: `core/src/commonMain/kotlin/startupkt/engine/Cards.kt` and `RULES.md`.

## Card facts (copy exactly from Cards.kt)
- `copies` = the Kotlin `copies` list (default `[3]`). `sprint`, `points`, the `cost` resources (F = `frontend`,
  B = `backend`, A = `agent`) and `costCoins` (the `coins` argument of `team(...)`/`feature(...)`).
- `freeWith` = the **name** of the card in `freeWith` (e.g. `'Ktor'`), plus a `FREE IF YOU BUILT` chips block with
  that card (`kind` = its type, its sprint).
- If other cards have `freeWith = <this id>`, add a `MAKES FREE FOR YOU` chips block listing them (type + sprint).
- Order of effect blocks: main effect first (`produces` / `tile`), then `MAKES FREE FOR YOU`, then `FREE IF YOU BUILT`.

## Effect wording (keep it identical across cards)
| Kotlin | Block |
|---|---|
| team `produces` | `{ kind: 'produces', units: [...] }`, one inner array per unit, `['frontend','backend']` = one unit that is F **or** B |
| business `coins = N` | `{ kind: 'tile', icon: 'coin', amount: N, label: 'NOW', text: '+N coins from the bank' }` |
| `Special.CoinsPer(TYPE, n)` | `{ kind: 'tile', icon: 'coin', amount: n, label: 'NOW', text: 'per your {team} Team card' }` (use the right type token and word) |
| `Special.PointsPer(TYPE, n)` | `{ kind: 'tile', icon: 'star', amount: n, label: 'AT GAME END', text: 'per your {feature} Feature card' }` |
| `Special.FreelancerPrice(p)` | `{ kind: 'tile', icon: 'coin', amount: p, label: 'ALWAYS', text: 'Each freelancer costs you {coin:p}' }` |
| business `points = N` | goes to `points` (the header star), not a tile |

A feature with no chain and no special has no effect blocks; the art window then grows to y 25..72 (content y 29..72).
For those cards draw **taller art**, filling about y 21..58 in art coordinates (the template centres art on y 39.5,
so the window content y 29..72 maps to art y ≈ 18..61), so the window does not look empty.
Set `artH` on the card to the height you drew (e.g. `artH: 37`) so the art is scaled correctly when the window is shorter.

## Art (the part that makes the card)
- Drawn into a 56×21 mm area: x 10.5..62.5 (x < 10.5 is the line-number gutter), y 29..50, in card millimetres.
  The template centres or scales it to the real window height. Keep a ≥ 1.5 mm margin from the area edges.
- Flat vector, IDE-dark style like the reference cards: solid shapes, rounded corners (rx 0.6–1.9), palette from `C`
  (`frontend` blue, `backend` green, `agent` purple, `gold`, `kw` orange, `fn` blue, `str` green, `cls` pink), `url(#bolt)`
  gradient for accents. Small labels in the art at ≥ 1.6 mm font size.
- One clear idea per card, readable at arm's length: what the card *is* (a person, a device, a flow, a deal).
  People for Team cards: a simple flat character (head circle + rounded body + laptop/desk props), varied per role.
- No real logos or trademarks (no Kotlin, JetBrains, Apple, Android, Claude logos). Generic symbols only.
- Each card gets its own `file` tab name, a plausible Kotlin file (`Login.kt`, `Payments.kt`, `TeamLead.kt`, …).

## Flavor
- `code`: one line of plausible, idiomatic Kotlin tied to the card, ≤ 40 characters total, as `[colour, text]` tokens
  (`C.kw` keywords, `C.fn` function calls, `C.str` strings, `C.cls` types/annotations, `C.text` everything else).
- `comment`: ≤ 40 characters, a punchy line derived from the card's `desc` in Cards.kt (English, no ending period).

## Checking your work
A static server serves `print/` at http://localhost:8791. Render one card at high resolution with:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=520,690 --virtual-time-budget=4000 \
  --screenshot="$PWD/print/previews/<id>.png" "http://localhost:8791/index.html?shot=<id>"
```
(run from the repo root), then look at the PNG with the Read tool. Check: nothing overflows or overlaps, text is not cut,
the art fills its window well and is centred, the name fits, and the card looks as polished as Ktor/REST API.
`?only=<id>,<id>` shows several cards side by side.
