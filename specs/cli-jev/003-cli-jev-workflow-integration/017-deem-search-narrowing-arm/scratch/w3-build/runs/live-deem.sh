#!/usr/bin/env bash
# usage: live-deem.sh <run-name>   (from the worktree root)
# One live --deem run with the Deem health pair read right before and right after.
set -u
W=specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build
R=$W/runs/$1
DEEM=(node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs)
mkdir -p "$R"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$R/start-utc.txt"
# Hold rule: nothing under specs/ may be dirty outside a scratch/ directory,
# because the test set skips scratch trees and no scratch path can change a question.
git status --porcelain -- specs/ > "$R/specs-status-before.txt"
if grep -v '/scratch/' "$R/specs-status-before.txt" | grep -q .; then
  echo "live run held: $(grep -v '/scratch/' "$R/specs-status-before.txt" | tr '\n' ' ')" > "$R/held.txt"
  exit 10
fi
# Updater window: the launchd job runs every 21600 s from its 14:27:02Z load,
# so it fires near 20:27Z and 02:27Z; hold from 20:17Z to 20:37Z and 02:17Z to 02:37Z.
HM=$(date -u '+%H%M')
if { [ "$HM" -ge 2017 ] && [ "$HM" -le 2037 ]; } || { [ "$HM" -ge 0217 ] && [ "$HM" -le 0237 ]; }; then
  echo "live run held: updater window" > "$R/held.txt"; exit 11
fi
"${DEEM[@]}" health > "$R/health-before.json" 2> "$R/health-before.stderr"
echo "exit=$?" > "$R/health-before.exit"
if ! grep -q '"ok":true' "$R/health-before.json"; then echo "live run held: deem down" > "$R/held.txt"; exit 12; fi
git status --porcelain > "$R/status-before.txt"
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs --deem --out "$R/out" > "$R/stdout.txt" 2> "$R/stderr.txt"
echo "exit=$?" > "$R/exit.txt"
git status --porcelain > "$R/status-after.txt"
"${DEEM[@]}" health > "$R/health-after.json" 2> "$R/health-after.stderr"
echo "exit=$?" > "$R/health-after.exit"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$R/end-utc.txt"
