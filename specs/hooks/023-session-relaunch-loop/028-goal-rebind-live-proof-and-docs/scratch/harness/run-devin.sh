#!/usr/bin/env bash
# Receiver half on Devin, headless. Devin has no arm event, so no hop reaches it; this starts one
# fresh session in a throwaway checkout with the hand-over variable set by hand (or not) and
# reads what the session sees and the goal store holds. Usage: run-devin.sh <sandbox> <out> [ENV=value ...]
set -u
here="$(cd "$(dirname "$0")" && pwd)"
sb="$1"; out="$2"; shift 2
mkdir -p "$out"; : > "$out/summary.txt"
cd "$sb" || exit 9
unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done
prompt='If your context holds an active goal block, which starts with [active_goal:, reply with that first line exactly. Otherwise reply with the single word NONE.'
echo "$(date -u +%FT%TZ) env: $*" | tee -a "$out/summary.txt"
env "${unset_args[@]}" "$@" "$here/tmo.sh" 180 "$(command -v devin)" -p --respect-workspace-trust false --model swe --permission-mode auto -- "$prompt" > "$out/reply.txt" 2> "$out/stderr.txt"
echo "exit=$?" | tee -a "$out/summary.txt"
echo "reply: $(head -c 300 "$out/reply.txt")" | tee -a "$out/summary.txt"
echo "stderr: $(head -c 300 "$out/stderr.txt")" >> "$out/summary.txt"
node "$here/goal-records.cjs" "$sb/.skilled/skills/.state/goal" | tee "$out/goal-records.txt" | tee -a "$out/summary.txt"
