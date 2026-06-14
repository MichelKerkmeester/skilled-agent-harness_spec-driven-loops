#!/bin/bash
# Dispatch one deep-research WAVE: up to 3 read-only Fable 5 seats on disjoint
# iterations, via the claude2 account, xhigh effort, plan-mode (no writes).
# Host writes all state afterward. Barrier-joins before returning.
set -u
REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SF=".opencode/specs/z_future/sqlite-to-turso"
BIN="/Users/michelkerkmeester/.superset/bin/claude"
cd "$REPO" || exit 1
mkdir -p "$SF/research/seats"
for N in "$@"; do
  NNN=$(printf '%03d' "$N")
  (
    CLAUDE_CONFIG_DIR="$HOME/.claude-account2" gtimeout 2400 "$BIN" \
      -p "$(cat "$SF/research/prompts/iteration-$NNN.md")" \
      --model claude-fable-5 --effort xhigh --permission-mode plan --output-format text \
      > "$SF/research/seats/iter-$NNN.out.md" \
      2> "$SF/research/seats/iter-$NNN.err.log"
    echo "iter-$NNN exit=$?"
  ) &
done
wait
echo "=== wave barrier joined: $* ==="
ls -la "$SF/research/seats/" | tail -8
