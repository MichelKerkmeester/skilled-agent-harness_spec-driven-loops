#!/usr/bin/env bash
# Send one brief to DeepSeek V4.1 Flash max through OpenCode 2, from the worktree root.
# Usage: dispatch.sh <brief.md>. Output lands beside the brief as <name>.out.jsonl and .err.
set -uo pipefail
brief=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")
root=$(git -C "$(dirname "$brief")" rev-parse --show-toplevel)
base=${brief%.md}
cd "$root" || exit 2
start=$(date +%s)
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PWD="$root" opencode run --standalone \
  -m 'llmgateway/deepseek-v4.1-flash-1017#max' --format json "$(cat "$brief")" \
  </dev/null > "$base.out.jsonl" 2> "$base.err"
code=$?
echo "exit=$code seconds=$(( $(date +%s) - start ))" | tee "$base.status"
