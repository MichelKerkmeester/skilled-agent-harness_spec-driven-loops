#!/usr/bin/env bash
# Live Pi turn with a bound goal: proves the run exits on its own after the
# final answer and leaves the bound goal.md untouched.
set -u
REPO=$(pwd)
E=specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/runtime-verification/opencode-pi-fix
PACKET=$E/canary-packet
SCRATCH=${SCRATCH:?set SCRATCH to a scratch directory}
STATE=$SCRATCH/pi-live-state; SESS=$SCRATCH/pi-live-sessions
mkdir -p "$STATE" "$SESS"
SID="pi-live-fix-$(cat $E/b3fix-canary-suffix.txt)-${ATTEMPT:-1}"
echo "$SID" > $E/b3fix-session-id.txt
{
  echo "\$ OPENCODE_GOAL_STATE_DIR=<scratch-state> node .skilled/hooks/goal/bin/goal.cjs bind $PACKET --runtime Pi --session $SID --workspace <repo>"
  OPENCODE_GOAL_STATE_DIR=$STATE node .skilled/hooks/goal/bin/goal.cjs bind "$PACKET" --runtime Pi --session "$SID" --workspace "$REPO" | grep -E '^(STATUS|mutation|packet_path|packet_state|packet_bound|resend_pending)'
  echo "bind_exit=${PIPESTATUS[0]}"
} > $E/b3fix-bind.log 2>&1
SHA_BEFORE=$(shasum -a 256 "$PACKET/goal.md" | cut -d' ' -f1)
START=$(date +%s)
env AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 PI_BLACKHOLE_PASSIVE=true OPENCODE_GOAL_STATE_DIR="$STATE" \
  pi -p --offline --model llmgateway/mimo-v2.6-pro --thinking high \
  --session-dir "$SESS" --session-id "$SID" "$(cat $E/b3fix-prompt.txt)" </dev/null \
  > $E/b3fix-out.log 2> $E/b3fix-err.log &
PID=$!
( sleep 480; if kill -0 $PID 2>/dev/null; then echo "WATCHDOG: pi still running after 480s, killing" >> $E/b3fix-err.log; kill $PID; fi ) &
WD=$!
wait $PID; RC=$?
END=$(date +%s)
kill $WD 2>/dev/null
SHA_AFTER=$(shasum -a 256 "$PACKET/goal.md" | cut -d' ' -f1)
cp "$SESS"/*.jsonl $E/b3fix-session-transcript.jsonl 2>/dev/null || find "$SESS" -name '*.jsonl' -exec cp {} $E/b3fix-session-transcript.jsonl \;
{
  echo "pi_exit=$RC wall_seconds=$((END-START))"
  echo "goal_md_sha256_before=$SHA_BEFORE"
  echo "goal_md_sha256_after=$SHA_AFTER"
  [ "$SHA_BEFORE" = "$SHA_AFTER" ] && echo "goal_md_unchanged=true" || echo "goal_md_unchanged=false"
  grep -q WATCHDOG $E/b3fix-err.log && echo "watchdog_fired=true" || echo "watchdog_fired=false"
} > $E/b3fix-result.log
cat $E/b3fix-result.log
