#!/usr/bin/env bash
cd '/private/tmp/claude-501/ev028/sb-cl-a'
unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done
exec env "${unset_args[@]}" XDG_RUNTIME_DIR='/private/tmp/claude-501/ev028/out-cl-a/run' SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop claude --model claude-sonnet-5-5 "/goal $(cat '/private/tmp/claude-501/ev028/out-cl-a/start.txt')"
