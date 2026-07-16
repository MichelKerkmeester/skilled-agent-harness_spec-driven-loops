#!/usr/bin/env bash
# Correction writer fleet (gpt-5.5-fast --variant high). One file-disjoint seat per file. In place.
set -uo pipefail
ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
DIR="$ROOT/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation/corrections"
LOG="$DIR/../../scratch/corrections-progress.log"
POOL=10; STAGGER=3; TMO=900; MODEL="openai/gpt-5.5-fast"
TO="$(command -v gtimeout || command -v timeout)"
cd "$ROOT"; : > "$LOG"
echo "$(date '+%H:%M:%S') START corrections pool=$POOL" | tee -a "$LOG"
queue=(); for f in "$DIR"/COR*.prompt.txt; do [ -f "$f" ] && queue+=("$f::${f%.prompt.txt}"); done
total=${#queue[@]}; echo "$(date '+%H:%M:%S') queued $total" | tee -a "$LOG"
pids=()
launch(){ local prompt="${1%%::*}" base="${1##*::}"; AI_SESSION_CHILD=1 "$TO" "$TMO" opencode run --model "$MODEL" --variant high --format json --dir "$ROOT" "$(cat "$prompt")" </dev/null > "$base.out.json" 2>"$base.err" & pids+=("$!"); echo "$(date '+%H:%M:%S') LAUNCH $(basename "$base") pid=$!" | tee -a "$LOG"; }
alive(){ local c=0 p; for p in "${pids[@]:-}"; do [ -n "$p" ] && kill -0 "$p" 2>/dev/null && c=$((c+1)); done; echo "$c"; }
i=0
while [ "$i" -lt "$total" ] || [ "$(alive)" -gt 0 ]; do
  if [ "$i" -lt "$total" ] && [ "$(alive)" -lt "$POOL" ]; then launch "${queue[$i]}"; i=$((i+1)); sleep "$STAGGER"; else sleep 5; fi
done
ok=0; for f in "$DIR"/COR*.prompt.txt; do b="${f%.prompt.txt}"; [ -s "$b.out.json" ] && grep -q '```json' "$b.out.json" 2>/dev/null && ok=$((ok+1)); done
echo "$(date '+%H:%M:%S') DONE ok=$ok total=$total" | tee -a "$LOG"
