#!/usr/bin/env bash
cd '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public'
unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done
exec env "${unset_args[@]}" XDG_RUNTIME_DIR='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/hooks/023-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/scratch/codex-hop/run' SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop codex -m gpt-5.6-luna -c 'model_reasoning_effort="low"' --sandbox danger-full-access
