#!/usr/bin/env bash
set -u
PHASE=specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" -c approval_policy=never --sandbox read-only -o "$PHASE/scratch/review/T011.txt" "$(cat "$PHASE/scratch/briefs/T011.txt")" </dev/null > "$PHASE/scratch/review/T011.stdout" 2> "$PHASE/scratch/review/T011.err"
rc=$?
echo "exit=$rc" >> "$PHASE/scratch/review/T011.err"
echo "exit=$rc" > "$PHASE/scratch/review/T011.rc"
