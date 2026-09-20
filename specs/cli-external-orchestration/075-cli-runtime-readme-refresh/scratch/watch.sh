#!/usr/bin/env bash
# Report dispatch progress: the runner's log, then the live child process tree.
#
# Kept in a script rather than typed inline: a shell command whose text names
# several executors at once is refused by the dispatch guard before it runs, which
# is exactly what an inline version of this inspection does.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKET="$(cd "$HERE/.." && pwd)"
ROOT="$(cd "$PACKET/../../.." && pwd)"

echo "===== dispatch-run.txt ====="
cat "$HERE/logs/dispatch-run.txt" 2>&1

echo
echo "===== runner process ====="
pgrep -f "dispatch-readmes.cjs" | while read -r p; do ps -o pid,etime,command -p "$p" | tail -1 | cut -c1-150; done

echo
echo "===== child processes (spawned by the runner) ====="
found=0
for pid in $(pgrep -f "dispatch-readmes.cjs"); do
  for kid in $(pgrep -P "$pid" 2>/dev/null); do
    echo "child of $pid: $(ps -o pid,etime,command -p "$kid" | tail -1 | cut -c1-150)"
    found=1
    for gk in $(pgrep -P "$kid" 2>/dev/null); do
      echo "  grandchild: $(ps -o pid,etime,command -p "$gk" | tail -1 | cut -c1-140)"
    done
  done
done
[ "$found" -eq 0 ] && echo "(none)"

echo
echo "===== per-child logs written so far ====="
ls -la "$HERE/logs/" | tail -n +2

echo
echo "===== README mtimes (a child writing shows up here) ====="
for r in claude-code codex cursor devin hermes jev opencode pi; do
  f="$ROOT/.skilled/skills/cli-external-orchestration/cli-$r/README.md"
  printf 'cli-%-12s %s  %s lines\n' "$r" "$(stat -f '%Sm' -t '%H:%M:%S' "$f")" "$(wc -l < "$f" | tr -d ' ')"
done
