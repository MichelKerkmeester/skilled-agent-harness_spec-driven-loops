#!/usr/bin/env bash
# Read-only accuracy-audit fleet (gpt-5.5-fast --variant high). Pool, staggered, salvage.
set -uo pipefail
ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
AUD="$ROOT/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/audit"
LOG="$AUD/../../scratch/audit-progress.log"
POOL=10; STAGGER=3; TMO=1200; MODEL="openai/gpt-5.5-fast"
TO="$(command -v gtimeout || command -v timeout)"
cd "$ROOT"; : > "$LOG"
echo "$(date '+%H:%M:%S') START audit pool=$POOL model=$MODEL" | tee -a "$LOG"
queue=(); for f in "$AUD"/AUD*.prompt.txt; do [ -f "$f" ] && queue+=("$f::${f%.prompt.txt}"); done
total=${#queue[@]}; echo "$(date '+%H:%M:%S') queued $total audit seats" | tee -a "$LOG"
pids=()
launch(){ local prompt="${1%%::*}" base="${1##*::}"; AI_SESSION_CHILD=1 "$TO" "$TMO" opencode run --model "$MODEL" --variant high --format json --dir "$ROOT" "$(cat "$prompt")" </dev/null > "$base.out.json" 2>"$base.err" & pids+=("$!"); echo "$(date '+%H:%M:%S') LAUNCH $(basename "$base") pid=$!" | tee -a "$LOG"; }
alive(){ local c=0 p; for p in "${pids[@]:-}"; do [ -n "$p" ] && kill -0 "$p" 2>/dev/null && c=$((c+1)); done; echo "$c"; }
i=0
while [ "$i" -lt "$total" ] || [ "$(alive)" -gt 0 ]; do
  if [ "$i" -lt "$total" ] && [ "$(alive)" -lt "$POOL" ]; then launch "${queue[$i]}"; i=$((i+1)); sleep "$STAGGER"; else sleep 5; fi
done
sal=(); for f in "$AUD"/AUD*.prompt.txt; do b="${f%.prompt.txt}"; { [ ! -s "$b.out.json" ] || ! grep -q '```json' "$b.out.json" 2>/dev/null; } && sal+=("$f::$b"); done
echo "$(date '+%H:%M:%S') salvage: ${#sal[@]}" | tee -a "$LOG"
if [ "${#sal[@]}" -gt 0 ]; then pids=(); j=0; n=${#sal[@]}; while [ "$j" -lt "$n" ] || [ "$(alive)" -gt 0 ]; do if [ "$j" -lt "$n" ] && [ "$(alive)" -lt "$POOL" ]; then launch "${sal[$j]}"; j=$((j+1)); sleep "$STAGGER"; else sleep 5; fi; done; fi
ok=0; for f in "$AUD"/AUD*.prompt.txt; do b="${f%.prompt.txt}"; [ -s "$b.out.json" ] && grep -q '```json' "$b.out.json" 2>/dev/null && ok=$((ok+1)); done
echo "$(date '+%H:%M:%S') DONE ok=$ok total=$total" | tee -a "$LOG"
