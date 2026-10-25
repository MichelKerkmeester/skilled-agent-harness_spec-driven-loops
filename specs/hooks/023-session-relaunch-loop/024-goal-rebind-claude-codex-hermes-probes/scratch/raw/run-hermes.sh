#!/bin/bash
# usage: run-hermes.sh <label> <spec-folder-or-empty>  ; clean env; key passed through without printing
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bf59c2c4-b852-41a2-886d-00232422ac9e/scratchpad/probe
WT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/220-relaunch-cancel-and-test-isolation
label="$1"; folder="$2"
extra=()
[ -n "$folder" ] && extra=(HERMES_SPEC_FOLDER="$folder")
cd "$WT" || exit 99
env -i HOME="$HOME" USER="$USER" PATH="$HOME/.local/bin:$HOME/.hermes/node/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin" TERM=dumb LANG=en_US.UTF-8 \
  LLMGATEWAY_API_KEY="$LLMGATEWAY_API_KEY" HERMES_ENABLE_PROJECT_PLUGINS=1 OPENCODE_GOAL_STATE_DIR="$S/d/goal-state" AI_SESSION_CHILD=1 "${extra[@]}" \
  "$HOME/.local/bin/hermes" chat -Q --oneshot --query-file "$S/d/q.md" --provider llmgateway --model deepseek-v4.1-flash-1017 --reasoning low \
  --ignore-rules --source tool --max-turns 4 --run-budget 150 -t file --in "$WT" </dev/null > "$S/d/$label.out" 2> "$S/d/$label.err"
echo "exit=$?" > "$S/d/$label.exit"
