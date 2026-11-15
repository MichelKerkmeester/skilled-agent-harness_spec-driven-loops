#!/usr/bin/env bash
cd '/private/tmp/claude-501/ev028/sb-ocr-c'
unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done
exec env "${unset_args[@]}" XDG_RUNTIME_DIR='/private/tmp/claude-501/ev028/out-ocr-c/run' PATH='/private/tmp/claude-501/ev028/out-ocr-c/bin':$PATH opencode --prompt 'If your context holds an active goal block, which starts with [active_goal:, reply with that first line exactly. Otherwise reply with the single word NONE.'
