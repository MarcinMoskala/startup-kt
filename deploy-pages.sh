#!/bin/bash
# Builds the browser game and publishes it to the gh-pages branch (GitHub Pages).
set -e
cd "$(dirname "$0")"
./gradlew :app:wasmJsBrowserDistribution -q
DIST=app/build/dist/wasmJs/productionExecutable
TMP=$(mktemp -d)
cp -R "$DIST"/. "$TMP"/
touch "$TMP/.nojekyll"
REMOTE=$(git remote get-url origin)
cd "$TMP"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy Startup.kt web build"
git push -f "$REMOTE" gh-pages
echo "Published to gh-pages"
