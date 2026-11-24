#!/bin/bash
# Exports every print file from the HTML sources. Needs Google Chrome and a static server serving print/ at $BASE:
#   python3 -m http.server 8791 --directory print
# Usage: print/export.sh            (from anywhere)
set -euo pipefail
cd "$(dirname "$0")"
BASE="${BASE:-http://localhost:8791}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE="$(mktemp -d)"   # fresh profile: Chrome otherwise serves stale cached scripts
trap 'rm -rf "$PROFILE"' EXIT
curl -sf "$BASE/index.html" >/dev/null || { echo "No server at $BASE (python3 -m http.server 8791 --directory print)"; exit 1; }

chrome() { "$CHROME" --headless=new --user-data-dir="$PROFILE" --disable-gpu --hide-scrollbars --virtual-time-budget=10000 "$@" >/dev/null 2>&1 </dev/null; }
pdf() { chrome --no-pdf-header-footer --print-to-pdf="$1" "$BASE/$2"; echo "  $1"; }
png() { chrome --force-device-scale-factor=1 --window-size="$2" --screenshot="$1" "$BASE/$3"; }

OUT=out; HOME_DIR=$OUT/home-print; SHOP=$OUT/print-shop
rm -rf "$OUT"; mkdir -p "$HOME_DIR" "$SHOP/png/cards" "$SHOP/png/backs" "$SHOP/png/boards"

echo "Home printing (A4, crop marks):"
pdf "$HOME_DIR/cards-duplex-A4.pdf" "index.html?print=duplex"
pdf "$HOME_DIR/cards-fronts-A4.pdf" "index.html?print=fronts"
pdf "$HOME_DIR/cards-backs-A4.pdf"  "index.html?print=backs"
pdf "$HOME_DIR/boards-A4.pdf"       "boards.html"
pdf "$HOME_DIR/rules-booklet-A4-duplex-short-edge.pdf" "rules.html?print=home"
pdf "$HOME_DIR/box-A4.pdf"          "box.html?print=home"

echo "Print shop (one design per page, final size + 3 mm bleed):"
pdf "$SHOP/cards-fronts-69x94mm.pdf" "printshop.html?part=fronts"
pdf "$SHOP/cards-backs-69x94mm.pdf"  "printshop.html?part=backs"
pdf "$SHOP/boards-201x106mm.pdf"     "printshop.html?part=boards"
pdf "$SHOP/rules-12-pages-106x196mm.pdf" "rules.html?print=pages"
for piece in lid base; do
  pdf "$SHOP/box-$piece-art.pdf"      "box.html?part=$piece"
  pdf "$SHOP/box-$piece-dieline.pdf"  "box.html?part=$piece-dieline"
  pdf "$SHOP/box-$piece-proof.pdf"    "box.html?part=$piece-combined"
done

# Manifest of printed cards (deck order = page order of the PDFs) and the PNG list.
node -e '
const fs = require("fs"), vm = require("vm"), ctx = { console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("cards.js", "utf8") + ";this.sortedCards = sortedCards;", ctx);
for (const f of fs.readdirSync("data").filter(f => f.endsWith(".js")).sort()) vm.runInContext(fs.readFileSync("data/" + f, "utf8"), ctx);
const rows = ctx.sortedCards().flatMap(c => c.copies.map(p => ({ c, p })));
const type = { team: "Team", feature: "Feature", library: "Library", business: "Business" };
fs.writeFileSync(process.argv[1], "page;file;card;type;sprint;players;back\n" + rows.map(({ c, p }, i) => {
  const n = String(i + 1).padStart(2, "0");
  return [i + 1, `${n}-${c.id}-${p}plus.png`, c.name, type[c.type], ["", "I", "II", "III"][c.sprint], p + "+", `back-${c.sprint}.png`].join(";");
}).join("\n") + "\n");
console.log(rows.map(({ c, p }, i) => `${String(i + 1).padStart(2, "0")} ${c.id} ${p}`).join("\n"));
' "$SHOP/cards-manifest.csv" > "$OUT/.cards.txt"

echo "PNG 300 dpi (cards 815x1110 px, boards 2374x1252 px):"
while read -r n id p; do png "$SHOP/png/cards/$n-$id-${p}plus.png" 815,1110 "printshop.html?png=card&id=$id&p=$p"; done < "$OUT/.cards.txt"
for s in 1 2 3; do png "$SHOP/png/backs/back-$s.png" 815,1110 "printshop.html?png=back&s=$s"; done
for id in companion suspend-fun-travel sealed-deals by-lazy-studio nullsafe-bank; do
  png "$SHOP/png/boards/$id.png" 2374,1252 "printshop.html?png=board&id=$id"
done
rm "$OUT/.cards.txt"
cp ZAMOWIENIE-DRUKARNIA.md BOX-NOTES.md "$SHOP/"
(cd "$OUT" && zip -qr startup-kt-print-shop.zip print-shop home-print)
echo "  $(ls "$SHOP/png/cards" | wc -l | tr -d ' ') card fronts, 3 backs, 5 boards"
echo "Done: $OUT/ (send $OUT/startup-kt-print-shop.zip to the print shop)"
