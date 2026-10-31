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
  section && /^```/ { block = !block; next }
  section && block { print }
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
