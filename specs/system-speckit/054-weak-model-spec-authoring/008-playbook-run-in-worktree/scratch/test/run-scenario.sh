#!/usr/bin/env bash
set -euo pipefail
scenario="$1"
out="$2"
mkdir -p "$(dirname "$out")"
awk '
  /^### Commands[[:space:]]*$/ { section = 1; next }
  section && /^```/ { if (block) exit; block = 1; next }
  block { print }
' "$scenario" > "$out.cmd"
if [ ! -s "$out.cmd" ]; then
  printf 'NO_COMMANDS\n' > "$out"
  printf 'exit=90\n' >> "$out"
  exit 0
fi
rc=0
bash "$out.cmd" > "$out" 2>&1 || rc=$?
printf 'exit=%s\n' "$rc" >> "$out"
exit 0
