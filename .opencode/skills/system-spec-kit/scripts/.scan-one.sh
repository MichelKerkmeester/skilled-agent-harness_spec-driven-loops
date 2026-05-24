#!/usr/bin/env bash
# Validate ONE spec folder with a short timeout, print a single summary line.
set -euo pipefail
folder="${1:?folder required}"
VALIDATE="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/spec/validate.sh"
ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs"
# 30s hard cap
out=$(bash "$VALIDATE" "$folder" --strict 2>&1 & pid=$!
      ( sleep 30 && kill -9 "$pid" 2>/dev/null || true ) & killer=$!
      wait "$pid" 2>/dev/null || true
      kill "$killer" 2>/dev/null || true
      wait "$killer" 2>/dev/null || true)
rel="${folder#$ROOT/}"
summary=$(printf '%s\n' "$out" | grep -E "^  Summary:" | head -1 || true)
if [ -z "$summary" ]; then
  echo "TIMEOUT_OR_FAIL | $rel"
  exit 0
fi
errs=$(printf '%s\n' "$summary" | sed -n 's/.*Errors: \([0-9]*\).*/\1/p' || true)
warns=$(printf '%s\n' "$summary" | sed -n 's/.*Warnings: \([0-9]*\).*/\1/p' || true)
if [ "${errs:-0}" -gt 0 ]; then
  rules=$(printf '%s\n' "$out" | grep -E "^✗ [A-Z_]+:" | sed 's/^✗ \([A-Z_]*\):.*/\1/' | sort -u | paste -sd, - || true)
  echo "ERR=${errs} WARN=${warns} | $rel | rules=$rules"
elif [ "${warns:-0}" -gt 0 ]; then
  rules=$(printf '%s\n' "$out" | grep -E "^⚠ [A-Z_]+:" | sed 's/^⚠ \([A-Z_]*\):.*/\1/' | sort -u | paste -sd, - || true)
  echo "ERR=0 WARN=${warns} | $rel | rules=$rules"
else
  echo "CLEAN | $rel"
fi
