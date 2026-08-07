#!/usr/bin/env bash
# Sequential GLM dispatches. One at a time per cli-devin single-dispatch discipline;
# each PID is captured and killed by PID, never by a blanket pattern match.
set -u
D="$1"
for n in 01 02 03 04 05; do
  LOG="$D/devin-$n.log"
  AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 \
    devin -p --model glm-5-2 --permission-mode accept-edits --prompt-file "$D/prompt-$n.txt" \
    > "$LOG" 2>&1 </dev/null &
  PID=$!
  echo "[$(date +%H:%M:%S)] launched devin-$n pid=$PID" >> "$D/driver.log"
  wait "$PID"
  RC=$?
  kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
  SZ=$(wc -c < "$LOG" 2>/dev/null || echo 0)
  OUT=$([ -f "$D/devin-$n.md" ] && echo WROTE || echo NO-ARTIFACT)
  echo "[$(date +%H:%M:%S)] devin-$n rc=$RC log=${SZ}b $OUT" >> "$D/driver.log"
done
echo "[$(date +%H:%M:%S)] ALL PASSES DONE" >> "$D/driver.log"
