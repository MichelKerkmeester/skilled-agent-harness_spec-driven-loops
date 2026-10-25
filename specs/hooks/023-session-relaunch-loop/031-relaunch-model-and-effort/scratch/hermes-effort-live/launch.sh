#!/usr/bin/env bash
cd '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/220-relaunch-cancel-and-test-isolation'
unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done
exec env "${unset_args[@]}" HERMES_ENABLE_PROJECT_PLUGINS=1 XDG_RUNTIME_DIR='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/220-relaunch-cancel-and-test-isolation/specs/hooks/023-session-relaunch-loop/031-relaunch-model-and-effort/scratch/hermes-effort-live/run' SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop hermes chat --provider copilot -m gpt-4.1 --reasoning low --yolo
