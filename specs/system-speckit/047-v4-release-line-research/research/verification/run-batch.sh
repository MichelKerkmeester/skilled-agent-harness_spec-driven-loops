#!/usr/bin/env bash
# Runs one verification batch through cli-codex, read-only sandbox, GPT-6 Luna xhigh fast.
set -u
n="$1"
here="$(cd "$(dirname "$0")" && pwd)"
root=/Users/michelkerkmeester/MEGA/Development/Skilled
cd "$root"
start=$(date +%s)
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 codex exec \
  --model gpt-6-luna \
  -c model_reasoning_effort="xhigh" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox read-only \
  -o "$here/outputs/batch-$n.md" \
  "$(cat "$here/briefs/batch-$n.txt")" > "$here/outputs/batch-$n.log" 2>&1 </dev/null
rc=$?
echo "batch $n exit $rc secs $(( $(date +%s) - start ))" >> "$here/outputs/status.txt"
