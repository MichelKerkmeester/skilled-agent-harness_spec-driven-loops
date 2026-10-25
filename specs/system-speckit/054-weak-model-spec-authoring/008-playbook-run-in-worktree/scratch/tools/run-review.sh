#!/usr/bin/env bash
# One read-only review dispatch. Usage: run-review.sh <attempt>
set -u
ROOT="$(git rev-parse --show-toplevel)"
PHASE="$ROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
A="${1:-1}"
R="$PHASE/scratch/review"
echo "attempt=$A start=$(date +%H:%M:%S)" >> "$R/T017.attempts.txt"
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 devin -p --model swe-2-max --permission-mode auto -- "$(cat "$PHASE/scratch/briefs/T017.txt")" </dev/null > "$R/T017.raw.txt" 2> "$R/T017.err"
echo "attempt=$A devin_exit=$? end=$(date +%H:%M:%S)" >> "$R/T017.attempts.txt"
cp "$R/T017.raw.txt" "$R/T017.raw.$A.txt"; cp "$R/T017.err" "$R/T017.err.$A.txt"
grep -oE '^(P[012]) .*|NO FINDINGS$' "$R/T017.raw.txt" > "$R/T017.txt" || true
echo "attempt=$A result_lines=$(grep -c . "$R/T017.txt")" >> "$R/T017.attempts.txt"
