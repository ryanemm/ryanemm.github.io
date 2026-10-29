#!/usr/bin/env bash
# Regenerates resume.pdf from resume.json (via resume.html) using headless Chrome.
# Run this after editing resume.json, then commit resume.pdf.
set -euo pipefail
cd "$(dirname "$0")"

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-8765}"

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  --print-to-pdf=resume.pdf \
  "http://127.0.0.1:$PORT/resume.html" 2>/dev/null

echo "Wrote resume.pdf"
