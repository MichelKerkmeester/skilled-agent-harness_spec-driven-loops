#!/usr/bin/env bash
# R5.2: does a nohup-detached child survive the Bash tool call that started it?
set -u
B="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it5-detach"
mkdir -p "$B"
rm -f "$B/child-alive.txt"
nohup bash -c "sleep 4; printf 'alive\n' > '$B/child-alive.txt'" > "$B/nohup.out" 2>&1 &
echo "$!" > "$B/nohup.pid"
echo "started pid=$(cat "$B/nohup.pid")"
