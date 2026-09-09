#!/usr/bin/env bash
# Run iterations 006-008 on Sonnet 5 via the claude2 account.
# MUST be run from a plain shell, NOT from inside a Claude Code session:
# the deep-loop recursion guard refuses cli-claude-code when the claude
# binary appears in the process ancestry, whatever account is configured.
#
# --permission-mode dontAsk: these prompts are read-only research and need file
# reads. Without it a non-interactive run can block forever on a permission
# prompt no one can answer. It never asks and never grants edits, which suits a
# read-only pass; the prompts also instruct the model not to write anything.
set -uo pipefail

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
A="$REPO/specs/hooks/018-cache-optimizer-improvement-research/research"
export CLAUDE_CONFIG_DIR="$HOME/.claude-account2"

cd "$REPO" || exit 1
for n in 006 007 008; do
  echo "=== iteration $n ==="
  claude -p "$(cat "$A/prompts/iteration-$n.md")" \
    --model claude-sonnet-5 \
    --effort xhigh \
    --permission-mode dontAsk \
    --output-format text \
    > "$A/iterations/iteration-$n.md" \
    2> "$A/logs/iteration-$n.log"
  echo "  exit=$? bytes=$(wc -c < "$A/iterations/iteration-$n.md")"
done
echo "Done. Tell Claude Code the iterations are complete and it will fold them into the packet."
