#!/bin/bash
# Builds the browser version and serves it on http://localhost:${PORT:-8779}
set -e
cd "$(dirname "$0")"
./gradlew :app:wasmJsBrowserDistribution -q
echo "Startup.kt: http://localhost:${PORT:-8779}"
python3 -m http.server "${PORT:-8779}" --directory app/build/dist/wasmJs/productionExecutable
