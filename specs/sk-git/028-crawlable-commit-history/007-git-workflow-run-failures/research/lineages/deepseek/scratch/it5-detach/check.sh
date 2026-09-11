#!/usr/bin/env bash
# R5.2b: check the detached child after this separate Bash tool call returns.
set -u
B="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it5-detach"
sleep 6
PID="$(cat "$B/nohup.pid" 2>/dev/null || echo 0)"
if kill -0 "$PID" 2>/dev/null; then echo "detached child alive: yes (pid $PID)"; else echo "detached child alive: no (pid $PID)"; fi
if [ -f "$B/child-alive.txt" ]; then echo "marker: $(cat "$B/child-alive.txt")"; else echo "marker: MISSING"; fi
echo "nohup.out: $(cat "$B/nohup.out" 2>/dev/null || echo empty)"
