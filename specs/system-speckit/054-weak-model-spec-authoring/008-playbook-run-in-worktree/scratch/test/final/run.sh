#!/usr/bin/env bash
# Runs the scenario's own command block from the current directory. The first
# fenced block under the Commands heading is the whole script, so a scenario
# edit needs no runner edit.
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
perl -e 'alarm shift; exec @ARGV' 1800 bash "$out.cmd" > "$out" 2>&1 || rc=$?
printf 'exit=%s\n' "$rc" >> "$out"
exit 0
