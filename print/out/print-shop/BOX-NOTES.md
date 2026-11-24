# Startup.kt game box: print notes

Two-piece telescoping box (base + lid). Each piece is one die-cut sheet with four corner glue flaps.
Source: `print/box.js` (geometry + art), pages in `print/box.html`, previews in `print/previews/box/`.

## Dimensions (mm, board thickness T = 0.5 mm, 350–400 g/m² board)

| | Base | Lid |
|---|---|---|
| Inside (between flaps × width × depth) | **203 × 108 × 32** | 206 × 110 × 29.5 |
| Outside | 205 × 109 × 32.5 | 208 × 111 × 30 |
| Main panel (bottom / lid top) | 204 × 108 | 207 × 110 |
| Long walls (between flap creases) | 203 × 32.5 | 206 × 30 |
| End walls | 109 × 32.5 | 111 × 30 |
| Flaps (length × height) | 30 × 31 | 28 × 28.5 |
| Trim box of the flat sheet | 269 × 173 | 267 × 170 |
| **Sheet incl. 3 mm bleed** | **275 × 179** | **273 × 176** |

Fit: the lid's inside is 1 mm larger than the base's outside in both directions (0.5 mm clearance per side).
The lid (30 mm) is shallower than the base (32.5 mm), so it rests on the base rim. Closed box: 208 × 111 × 33 mm,
with 3 mm of the base showing under the lid.

Thickness offsets built into the die-line:
- main panel length = inner length + 2T: the long-wall flaps (one board thick) sit inside the end walls;
- end-wall width = panel width + 2T: the end walls also cover the end grain of the long walls;
- flaps start T above the main-panel crease (they rest on the bottom instead of colliding with it) and stop 1 mm
  below the rim; flap corners are chamfered (5 mm lead-in, 2 mm at the end wall).

## Die-line legend (`?part=lid-dieline`, `?part=base-dieline`)
- **Cut**: solid magenta `#EC008C`, 0.25 mm. Includes the short internal cuts that free each flap from its end wall.
- **Crease**: dashed cyan `#00AEEF`. All folds go **away from the printed side** (walls and flaps fold to the inside).
- **Glue**: orange hatch `#F7941D` = the four flaps. Glue goes on the **printed side of the flaps**, which is pressed
  onto the unprinted inside of the end walls. Ask the printer to keep varnish/laminate off the flaps (or use a
  laminate-compatible glue / double-sided tape).
- Grey dotted rectangle = sheet edge = 3 mm bleed beyond every cut. Art covers the whole sheet.

Die-line, art and proof files share the same sheet coordinates (origin top-left of the bleed).
Print-shop art: `?part=lid` / `?part=base` (PDF page = sheet size). Proof: `?part=lid-combined` / `?part=base-combined`.
Only the outside is printed (one-sided). Inside: plain board.

Faces: the lid's front wall carries the wordmark, its back wall the Kit "founding team", both end walls the
players / time / age icons and the Sprint I → II → III track. The base sheet is turned over to fold it, so its
walls are drawn rotated: front wall = contents list (`val box = listOf(75 cards, 5 boards, 1 rulebook)`),
back wall = flavor code, end walls = small wordmark, bottom panel = box underside with blurb and the fan-game notice.

## Home build (`?print=home`)
A4 landscape, 2 pages (lid, base); both sheets fit A4 (largest 275 × 179 mm). Print at 100 % / actual size on
250–300 g/m² card. Cut lines and fold lines are printed as thin light-grey lines, crop marks sit at the trim-box corners.
With thinner home card the box ends up ~0.5 mm roomier, which is fine.

## Assembly (both pieces)
1. Cut along the solid lines, including the short cuts between each flap and its end wall.
2. Score the dashed lines (blunt knife / bone folder against a ruler, on the printed side).
3. Fold the two long walls up (print outside) and fold each flap 90° inward.
4. Glue the printed side of each flap; fold the end wall up over it so the flap sits inside the end wall.
   Hold square for ~30 s (a block or the other box piece helps).
5. Repeat for the other end. The lid goes over the base.

## Verified / not verified
- Verified numerically (scratch script): outline is a simple polygon, bleed ≥ 3 mm everywhere, flaps fit inside
  the end-wall column and don't meet, folded flaps meet the end-wall inner faces, lid clearance 0.5 mm/side,
  contents fit (boards 195 × 100, rulebook 100 × 190, two 63 × 88 stacks side by side, ~24 mm tall of 32).
- PDF page sizes checked: lid 273 × 176 mm, base 275 × 179 mm, home print 2 × A4.
- Not verified: a physical build; board grain direction; the printer's own crease allowance (some shops want
  crease offsets tuned to their board; numbers above assume 0.5 mm). The 0.5 mm notch at each panel corner may be
  simplified by the die maker.
