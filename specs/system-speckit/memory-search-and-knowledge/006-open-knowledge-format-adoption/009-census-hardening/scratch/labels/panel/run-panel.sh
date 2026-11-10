#!/usr/bin/env bash
# Runs one panel model over the four batches from an empty folder. Usage: run-panel.sh <name>
set -u
NAME="$1"; P="$(cd "$(dirname "$0")" && pwd)"; EMPTY="${TMPDIR:-/tmp}/panel-empty-$NAME"; mkdir -p "$EMPTY"; cd "$EMPTY"
for b in 1 2 3 4; do
  PROMPT="$(cat "$P/brief.txt" "$P/batch-$b.md")"
  start=$(date -u +%H:%M:%S)
  case "$NAME" in
    swe) SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 devin -p --model swe-2-max --permission-mode dangerous --respect-workspace-trust false -- "$PROMPT" </dev/null > "$P/$NAME-b$b.out" 2> "$P/$NAME-b$b.err" ;;
    gemini) SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 devin -p --model gemini-3-8-flash-high --permission-mode dangerous --respect-workspace-trust false -- "$PROMPT" </dev/null > "$P/$NAME-b$b.out" 2> "$P/$NAME-b$b.err" ;;
    glm) SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 pi -p "$PROMPT" --model opencode-go/glm-5.3-flash --thinking max --mode text --offline </dev/null > "$P/$NAME-b$b.out" 2> "$P/$NAME-b$b.err" ;;
  esac
  echo "$NAME b$b rc=$? $start-$(date -u +%H:%M:%S)" >> "$P/runs.log"
done
