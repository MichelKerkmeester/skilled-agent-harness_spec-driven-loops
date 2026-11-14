#!/usr/bin/env bash
# Usage: dispatch.sh <name> [--ro]. Reads $SP/d/<name>.brief, runs one DeepSeek child in the worktree.
set -uo pipefail
SP="$(cd "$(dirname "$0")" && pwd)"; name="$1"; ro="${2:-}"
cd /Users/michelkerkmeester/worktrees/public/379-sk-code-audit-remediation || exit 9
command -v pi >/dev/null || { echo "pi missing"; exit 8; }
prompt="$(cat "$SP/head.txt" "$SP/d/$name.brief")"
tools=(); [ "$ro" = "--ro" ] && tools=(--tools read,grep,find,ls)
start=$(date +%s)
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true command pi -p "$prompt" \
  --model llmgateway/deepseek-v4.1-flash-1017 --thinking max --mode text --offline ${tools[@]+"${tools[@]}"} \
  </dev/null > "$SP/d/$name.out" 2> "$SP/d/$name.err"
echo "[$name] exit=$? secs=$(( $(date +%s) - start )) out=$(wc -c < "$SP/d/$name.out")b"
tail -12 "$SP/d/$name.out"
