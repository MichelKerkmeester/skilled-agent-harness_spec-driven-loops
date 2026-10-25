#!/usr/bin/env bash
# Runs the scenario's own command blocks from the current directory. Every
# fenced block under the Commands heading is appended in order and runs in one
# shell, so variables set in step one stay defined for the later steps.
set -euo pipefail
scenario="$1"
out="$2"
mkdir -p "$(dirname "$out")"
awk '
  /^### Commands[[:space:]]*$/ { section = 1; next }
  section && /^### / { exit }
  section && /^```/ { if (fence) { fence = 0; run = 0 } else { fence = 1; run = ($0 ~ /^```(bash|sh)[[:space:]]*$/) }; next }
  section && run { print }
' "$scenario" > "$out.cmd"
if [ ! -s "$out.cmd" ]; then
  printf 'NO_COMMANDS\n' > "$out"
  printf 'exit=90\n' >> "$out"
  exit 0
fi
rc=0
perl -e 'alarm shift; exec @ARGV' 1800 bash "$out.cmd" > "$out" 2>&1 || rc=$?
size=$(wc -c < "$out" | tr -d ' ')
if [ "$size" -gt 2097152 ]; then
  { head -c 2097152 "$out"; printf '\n[truncated]\n'; tail -n 200 "$out"; } > "$out.trunc"
  mv "$out.trunc" "$out"
  printf 'truncated=yes\n' >> "$out"
else
  printf 'truncated=no\n' >> "$out"
fi
printf 'exit=%s\n' "$rc" >> "$out"
exit 0
