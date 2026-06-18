#!/usr/bin/env bash
# Staggered-pool driver for the 027 release-alignment deep review.
# Sustains POOL concurrent gpt-5.5-fast xhigh seats; spawns STAGGER seconds apart
# (the simultaneous-launch race kills ~2 when 4+ spawn within ~300ms); salvages empties.
set -uo pipefail

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P007="$ROOT/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review"
A="$P007/001-readmes-vs-027/review/seats"
B="$P007/002-code-vs-sk-code-opencode/review/seats"
LOG="$P007/scratch/progress.log"

POOL=10
STAGGER=3
TMO=1200
MODEL="openai/gpt-5.5-fast"
TO="$(command -v gtimeout || command -v timeout)"

cd "$ROOT"
: > "$LOG"
echo "$(date '+%H:%M:%S') START pool=$POOL stagger=${STAGGER}s tmo=${TMO}s model=$MODEL timeout-bin=${TO:-NONE}" | tee -a "$LOG"
[ -z "$TO" ] && { echo "FATAL: no gtimeout/timeout"; exit 1; }

# queue entries: "<prompt-file>::<out-base>"
queue=()
for f in "$A"/A*.prompt.txt "$B"/B*.prompt.txt; do
  [ -f "$f" ] || continue
  queue+=("$f::${f%.prompt.txt}")
done
total=${#queue[@]}
echo "$(date '+%H:%M:%S') queued $total seats" | tee -a "$LOG"

pids=()
launch() {
  local entry="$1" prompt="${1%%::*}" base="${1##*::}" id
  id="$(basename "$base")"
  AI_SESSION_CHILD=1 "$TO" "$TMO" opencode run --model "$MODEL" --variant xhigh --format json --dir "$ROOT" \
    "$(cat "$prompt")" </dev/null > "$base.json" 2> "$base.err" &
  local pid=$!
  pids+=("$pid")
  echo "$(date '+%H:%M:%S') LAUNCH $id pid=$pid" | tee -a "$LOG"
}

alive_count() { local c=0 p; for p in "${pids[@]:-}"; do [ -n "$p" ] && kill -0 "$p" 2>/dev/null && c=$((c+1)); done; echo "$c"; }

i=0
while [ "$i" -lt "$total" ] || [ "$(alive_count)" -gt 0 ]; do
  a="$(alive_count)"
  if [ "$i" -lt "$total" ] && [ "$a" -lt "$POOL" ]; then
    launch "${queue[$i]}"; i=$((i+1)); sleep "$STAGGER"
  else
    sleep 5
  fi
done
echo "$(date '+%H:%M:%S') wave-1 drained ($i launched)" | tee -a "$LOG"

# salvage: relaunch seats whose output is empty or has no json fence (one retry, same pool)
salvage=()
for f in "$A"/A*.prompt.txt "$B"/B*.prompt.txt; do
  base="${f%.prompt.txt}"
  if [ ! -s "$base.json" ] || ! grep -q '```json' "$base.json" 2>/dev/null; then
    salvage+=("$f::$base")
  fi
done
echo "$(date '+%H:%M:%S') salvage candidates: ${#salvage[@]}" | tee -a "$LOG"
if [ "${#salvage[@]}" -gt 0 ]; then
  pids=(); j=0; n=${#salvage[@]}
  while [ "$j" -lt "$n" ] || [ "$(alive_count)" -gt 0 ]; do
    a="$(alive_count)"
    if [ "$j" -lt "$n" ] && [ "$a" -lt "$POOL" ]; then
      launch "${salvage[$j]}"; j=$((j+1)); sleep "$STAGGER"
    else sleep 5; fi
  done
fi

# summary
ok=0; empty=0
for f in "$A"/A*.prompt.txt "$B"/B*.prompt.txt; do
  base="${f%.prompt.txt}"; id="$(basename "$base")"
  if [ -s "$base.json" ] && grep -q '```json' "$base.json" 2>/dev/null; then
    ok=$((ok+1))
  else
    empty=$((empty+1)); echo "$(date '+%H:%M:%S') STILL-EMPTY $id ($(wc -c < "$base.json" 2>/dev/null | tr -d ' ') bytes)" | tee -a "$LOG"
  fi
done
echo "$(date '+%H:%M:%S') DONE ok=$ok empty=$empty total=$total" | tee -a "$LOG"
