#!/bin/bash
# Copies the print design into the game app: card art (WebP) and app/.../PrintFlavor.kt (file tab, flavor code, comment).
# Needs Chrome, ImageMagick and a static server serving print/ at $BASE (python3 -m http.server 8791 --directory print).
set -euo pipefail
cd "$(dirname "$0")"
BASE="${BASE:-http://localhost:8791}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
DRAW=../app/src/commonMain/composeResources/drawable
PROFILE="$(mktemp -d)"; TMP="$(mktemp -d)"; trap 'rm -rf "$PROFILE" "$TMP"' EXIT
curl -sf "$BASE/printshop.html" >/dev/null || { echo "No server at $BASE"; exit 1; }
node gen-app-flavor.js > "$TMP/ids.txt"
mkdir -p "$DRAW"
while read -r id; do
  "$CHROME" --headless=new --user-data-dir="$PROFILE" --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=600,321 --virtual-time-budget=3000 --screenshot="$TMP/$id.png" "$BASE/printshop.html?png=art&id=$id" >/dev/null 2>&1 </dev/null
  magick "$TMP/$id.png" -quality 88 "$DRAW/art_${id//-/_}.webp"
done < "$TMP/ids.txt"
echo "Exported $(wc -l < "$TMP/ids.txt" | tr -d ' ') arts to $DRAW and regenerated PrintFlavor.kt"
