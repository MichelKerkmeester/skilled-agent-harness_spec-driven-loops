#!/usr/bin/env bash
# Staggered-pool driver for the remediation WRITER fleet (gpt-5.5-fast --variant high).
# Seats edit in place on the current branch; file-disjoint by construction; diff-reviewed before commit.
set -uo pipefail

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P007="$ROOT/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review"
FA="$P007/003-readme-remediation/fixers"
FB="$P007/004-code-remediation/fixers"
LOG="$P007/scratch/fixers-progress.log"

POOL=10
STAGGER=3
TMO=1200
MODEL="openai/gpt-5.5-fast"
TO="$(command -v gtimeout || command -v timeout)"

cd "$ROOT"
: > "$LOG"
echo "$(date '+%H:%M:%S') START fixer fleet pool=$POOL variant=high model=$MODEL" | tee -a "$LOG"
[ -z "$TO" ] && { echo "FATAL: no gtimeout/timeout"; exit 1; }

queue=()
for f in "$FA"/*.prompt.txt "$FB"/*.prompt.txt; do
  [ -f "$f" ] || continue
  queue+=("$f::${f%.prompt.txt}")
done
total=${#queue[@]}
echo "$(date '+%H:%M:%S') queued $total fixer seats" | tee -a "$LOG"

pids=()
launch() {
  local entry="$1" prompt="${1%%::*}" base="${1##*::}" id
  id="$(basename "$base")"
  AI_SESSION_CHILD=1 "$TO" "$TMO" opencode run --model "$MODEL" --variant high --format json --dir "$ROOT" \
    "$(cat "$prompt")" </dev/null > "$base.out.json" 2> "$base.err" &
  pids+=("$!")
  echo "$(date '+%H:%M:%S') LAUNCH $id pid=$! " | tee -a "$LOG"
}
alive_count() { local c=0 p; for p in "${pids[@]:-}"; do [ -n "$p" ] && kill -0 "$p" 2>/dev/null && c=$((c+1)); done; echo "$c"; }

i=0
while [ "$i" -lt "$total" ] || [ "$(alive_count)" -gt 0 ]; do
  if [ "$i" -lt "$total" ] && [ "$(alive_count)" -lt "$POOL" ]; then
    launch "${queue[$i]}"; i=$((i+1)); sleep "$STAGGER"
  else sleep 5; fi
done
echo "$(date '+%H:%M:%S') wave-1 drained ($i launched)" | tee -a "$LOG"

# salvage empties once
salvage=()
for f in "$FA"/*.prompt.txt "$FB"/*.prompt.txt; do
  base="${f%.prompt.txt}"
  if [ ! -s "$base.out.json" ] || ! grep -q '```json' "$base.out.json" 2>/dev/null; then salvage+=("$f::$base"); fi
done
echo "$(date '+%H:%M:%S') salvage: ${#salvage[@]}" | tee -a "$LOG"
if [ "${#salvage[@]}" -gt 0 ]; then
  pids=(); j=0; n=${#salvage[@]}
  while [ "$j" -lt "$n" ] || [ "$(alive_count)" -gt 0 ]; do
    if [ "$j" -lt "$n" ] && [ "$(alive_count)" -lt "$POOL" ]; then launch "${salvage[$j]}"; j=$((j+1)); sleep "$STAGGER"; else sleep 5; fi
  done
fi

ok=0; empty=0
for f in "$FA"/*.prompt.txt "$FB"/*.prompt.txt; do
  base="${f%.prompt.txt}"
  if [ -s "$base.out.json" ] && grep -q '```json' "$base.out.json" 2>/dev/null; then ok=$((ok+1)); else empty=$((empty+1)); echo "EMPTY $(basename "$base")" | tee -a "$LOG"; fi
done
echo "$(date '+%H:%M:%S') DONE ok=$ok empty=$empty total=$total" | tee -a "$LOG"
