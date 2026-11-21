#!/usr/bin/env bash
# Usage: dispatch.sh <id>  -- runs one Luna leaf on tmp/p012-fix/prompt-<id>.txt
set -u
ROOT=/Users/michelkerkmeester/worktrees/public/474-advisor-pasted-context-and-crash-fallback
D=$ROOT/tmp/p012-fix
ID=$1
cd "$ROOT" || exit 9
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 command codex exec --model gpt-6-luna \
  -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never \
  --sandbox workspace-write -o "$D/last-$ID.txt" "$(cat "$D/prompt-$ID.txt")" </dev/null > "$D/leaf-$ID.log" 2>&1
echo "$ID EXIT=$?" >> "$D/exits.txt"
