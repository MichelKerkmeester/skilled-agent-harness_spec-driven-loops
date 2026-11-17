#!/bin/bash
# run-go.sh <brief-file> <label> [lane]: one OpenCode Go (or Pi) dispatch in the 008 worktree,
# 20-minute PID watchdog, main + worktree status snapshots before and after.
WT=/Users/michelkerkmeester/worktrees/public/468-ed-008-review-dimension-coverage
MAIN=/Users/michelkerkmeester/MEGA/Development/Skilled
D=$(dirname "$0"); B="$1"; L="$2"; LANE="${3:-go}"
git -C $MAIN status --porcelain > $D/$L.main-before; git -C $WT status --porcelain > $D/$L.wt-before
BRIEF="$(cat "$B")"
cd "$WT"
if [ "$LANE" = pi ]; then
  SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "$BRIEF" --model llmgateway/deepseek-v4.1-flash-1017 --thinking max --mode text --offline </dev/null > $D/$L.out 2> $D/$L.err &
else
  PWD="$WT" SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run --standalone -m 'opencode-go/deepseek-v4.1-flash#max' --format json "$BRIEF" </dev/null > $D/$L.out 2> $D/$L.err &
fi
PID=$!; start=$(date +%s)
while kill -0 $PID 2>/dev/null; do
  if [ $(( $(date +%s) - start )) -gt 1200 ]; then pkill -9 -P $PID; kill -9 $PID; echo "WATCHDOG KILLED after 1200s"; break; fi
  /bin/sleep 10
done
wait $PID 2>/dev/null; echo "exit=$? secs=$(( $(date +%s) - start ))"
git -C $MAIN status --porcelain > $D/$L.main-after; git -C $WT status --porcelain > $D/$L.wt-after
echo "--- main new:"; comm -13 <(sort $D/$L.main-before) <(sort $D/$L.main-after)
echo "--- worktree status:"; cat $D/$L.wt-after
echo "--- provider errors:"; grep -hoE "Error 4(01|02|29)[^\"]{0,80}|No API key[^\"]{0,60}" $D/$L.err $D/$L.out | head -3
