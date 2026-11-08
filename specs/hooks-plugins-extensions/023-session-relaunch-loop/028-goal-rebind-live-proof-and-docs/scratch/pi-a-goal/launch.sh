#!/usr/bin/env bash
cd '/private/tmp/claude-501/ev028/sb-pi-a'
unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done
exec env "${unset_args[@]}" XDG_RUNTIME_DIR='/private/tmp/claude-501/ev028/out-pi-a/run' SESSION_RELAUNCH_MAX_HOPS=1 PI_BLACKHOLE_PASSIVE=true bash .skilled/bin/skilled-loop pi -ne -e .pi/extensions/session-relaunch.ts -e .pi/extensions/goal-context.ts --model openai/gpt-6-luna
