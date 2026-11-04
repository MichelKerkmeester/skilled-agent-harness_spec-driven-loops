#!/usr/bin/env bash
# Launch each queued leaf only while fewer than MAX drive processes run, so the total stays capped
# even beside workers an earlier queue still owns. Usage: dispatch-v6.sh <queue> [max]
Q=$1; MAX=${2:-5}
T=specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools
LOG=specs/sk-doc/066-skill-readability-refinement/scratch/drive-v3.log
count() { ps -ax -o command | grep -cE '^bash [^ ]*drive-v[45]\.sh '; }
while read -r leaf skill kind mode; do
  [ -n "$leaf" ] || continue
  [ -f specs/sk-doc/066-skill-readability-refinement/scratch/STOP ] && { echo "SKIP $leaf (stop flagged)" >> "$LOG"; continue; }
  while [ "$(count)" -ge "$MAX" ]; do sleep 30; done
  d=drive-v4.sh; [ "$mode" = repair ] && d=drive-v5.sh
  nohup bash "$T/$d" "$leaf" "$skill" "$kind" $mode >> "$LOG" 2>&1 </dev/null &
  sleep 5
done < "$Q"
wait
echo "ALL-DONE dispatch-v6" >> "$LOG"
