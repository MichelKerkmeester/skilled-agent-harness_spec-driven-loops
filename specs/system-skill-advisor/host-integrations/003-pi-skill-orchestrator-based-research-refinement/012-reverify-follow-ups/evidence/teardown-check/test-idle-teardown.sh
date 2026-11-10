#!/usr/bin/env bash
# Exercises the signal-free sandbox teardown now in CP-003 step 1 and CP-004 step 5 on three paths:
# a hostile lease, a sandbox launcher killed without its handler, and the normal path run as written.
# The only signal in this script is case 2's SIGKILL, sent to a sandbox launcher this script started
# and identified by its lease socket; the live advisors are asserted untouched.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
here="$(cd "$(dirname "$0")" && pwd)"
A=.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable
STEP1="$here/final-step1.sh"; WAIT="$here/final-wait.sh"
python3 - "$A/global-disable-flag.md" "$STEP1" "$WAIT" <<'PY'
import sys
text = open(sys.argv[1], encoding="utf-8").read()
block = text.split("## 3. TEST EXECUTION", 1)[1].split("```bash\n", 1)[1].split("```", 1)[0]
open(sys.argv[2], "w").write(block)
open(sys.argv[3], "w").write(block[block.index("sandbox_advisor_running() {"):])
PY
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
LIVE_PIDS="97186 97187 18680 18683 30503 30504"
procs() { ps -axo pid,ppid,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js|hf-model-server)" | grep -v grep | cut -c1-110; }
alive() { kill -0 "$1" 2>/dev/null && echo alive || echo gone; }
echo "started $(date -u +%H:%M:%SZ), HEAD $(git rev-parse --short HEAD), step 1 sha $(shasum "$STEP1" | cut -c1-12)"
GEN_BEFORE=$(shasum "$GEN"); echo "live generation before: $GEN_BEFORE"
echo "advisor processes before:"; procs

echo; echo "== CASE 1: hostile lease naming decoy pids with a socket path that climbs out"
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX); export SANDBOX; mkdir -p "$SANDBOX/db"
sleep 600 & D1=$!; sleep 600 & D2=$!
printf '{"pid":%d,"childPid":%d,"socketPath":"%s/../outside/sock/advisor.sock"}' "$D1" "$D2" "$SANDBOX" > "$SANDBOX/db/.system-skill-advisor-launcher.json"
T0=$(date +%s); out=$(bash "$WAIT" 2>&1 | tr '\n' ' ')
echo "block: $out(took $(( $(date +%s) - T0 ))s)"
echo "after the block: decoy1 $(alive "$D1"), decoy2 $(alive "$D2"), sandbox $([ -e "$SANDBOX" ] && echo kept || echo removed)"
kill "$D1" "$D2" 2>/dev/null; wait "$D1" "$D2" 2>/dev/null; rm -rf "$SANDBOX"

echo; echo "== CASE 2: sandbox launcher killed without its handler right after the call"
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX); export SANDBOX
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000 > /dev/null 2>&1
echo "call exit=$?"
LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
if [ -f "$LEASE" ]; then
  read -r LP DP SOCK < <(node -e 'const l = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); console.log([l.pid, l.childPid ?? "-", l.socketPath ?? "-"].join(" "))' "$LEASE")
  case "$SOCK" in "$SANDBOX"/*|/private"$SANDBOX"/*) ;; *) echo "socket outside sandbox; aborted"; exit 1 ;; esac
  for p in $LIVE_PIDS; do [ "$LP" = "$p" ] && { echo "lease names a live pid; aborted"; exit 1; }; done
  ps -o command= -p "$LP" | grep -q 'system-skill-advisor-launcher\.cjs' || { echo "not a launcher; aborted"; exit 1; }
  kill -KILL "$LP"; sleep 1
  echo "launcher $LP $(alive "$LP") after SIGKILL, daemon $DP $(alive "$DP")"
  T0=$(date +%s); out=$(bash "$WAIT" 2>&1 | tr '\n' ' ')
  echo "block: $out(took $(( $(date +%s) - T0 ))s)"
  echo "after the block: daemon $DP $(alive "$DP"), lease $([ -e "$LEASE" ] && echo present || echo gone), sandbox $([ -e "$SANDBOX" ] && echo kept || echo removed)"
  if [ "$(alive "$DP")" = gone ] && [ "$(alive "$LP")" = gone ]; then rm -rf "$SANDBOX"; echo "cleanup: neither lease pid runs, kept sandbox removed by hand"; fi
else
  echo "no lease written; case skipped"; rm -rf "$SANDBOX"
fi

echo; echo "== CASE 3: normal path, CP-003 step 1 run as written"
T0=$(date +%s)
bash -x "$STEP1" > "$here/case3.out" 2> "$here/case3.trace"
echo "block exit=$? took $(( $(date +%s) - T0 ))s; last line: $(tail -1 "$here/case3.out")"
SB=$(grep -m1 -oE 'SANDBOX=/tmp/cp003\.[A-Za-z0-9]+' "$here/case3.trace" | cut -d= -f2)
echo "sandbox was $SB"
back=""; for i in $(seq 1 60); do [ -e "$SB" ] && { back="reappeared ${i}s after the block"; break; }; sleep 1; done
echo "RESULT normal: ${back:-$SB did not reappear within 60s}"

echo; echo "live generation after:  $(shasum "$GEN")"
[ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
echo "advisor processes after:"; procs
echo "leftover sandboxes: $(ls -d /tmp/cp003.* 2>/dev/null | tr '\n' ' ')"
echo "finished $(date -u +%H:%M:%SZ)"
