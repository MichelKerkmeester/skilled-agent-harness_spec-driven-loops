#!/usr/bin/env bash
# Wave 1 fleet driver: launches the parallel read-only research seats.
# A and B (claude2 opus) each write their own findings file, C (gpt-5.5-fast) returns stdout JSON.
set -u
REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SEATS="$REPO/.opencode/specs/skilled-agent-orchestration/150-mcp-open-design/001-terminal-control-and-integration-research/research/seats"
CLAUDE2="/Users/michelkerkmeester/.superset/bin/claude"
cd "$REPO" || exit 1
: > "$SEATS/_status.txt"

# Seat A — claude2 opus — Open Design terminal-control surface
CLAUDE_CONFIG_DIR="$HOME/.claude-account2" AI_SESSION_CHILD=1 gtimeout 1000 \
  "$CLAUDE2" -p "$(cat "$SEATS/seat-a-prompt.md")" \
  --model claude-opus-4-8 --permission-mode bypassPermissions --output-format text \
  > "$SEATS/seat-a.out" 2>&1 &
A=$!

# Seat B — claude2 opus — sk-interface-design de-vendor + integration + licensing
CLAUDE_CONFIG_DIR="$HOME/.claude-account2" AI_SESSION_CHILD=1 gtimeout 1000 \
  "$CLAUDE2" -p "$(cat "$SEATS/seat-b-prompt.md")" \
  --model claude-opus-4-8 --permission-mode bypassPermissions --output-format text \
  > "$SEATS/seat-b.out" 2>&1 &
B=$!

# Seat C — gpt-5.5-fast via opencode — mcp-open-design skill design + adversarial cross-check (stdout JSON)
AI_SESSION_CHILD=1 gtimeout 700 \
  opencode run --model openai/gpt-5.5-fast --variant high --format json --dir "$REPO" \
  "$(cat "$SEATS/seat-c-prompt.md")" </dev/null \
  > "$SEATS/seat-c.out" 2>&1 &
C=$!

wait "$A"; echo "seatA exit=$?" >> "$SEATS/_status.txt"
wait "$B"; echo "seatB exit=$?" >> "$SEATS/_status.txt"
wait "$C"; echo "seatC exit=$?" >> "$SEATS/_status.txt"
echo "WAVE COMPLETE $(ls -la "$SEATS"/seat-*.out "$SEATS"/seat-*.findings.md 2>/dev/null | wc -l) output files" >> "$SEATS/_status.txt"
