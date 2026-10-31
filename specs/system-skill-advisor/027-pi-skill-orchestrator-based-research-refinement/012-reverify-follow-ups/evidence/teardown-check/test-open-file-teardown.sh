#!/usr/bin/env bash
# Exercises the teardown wait with its open-file test, as CP-003 step 1 and CP-004 step 5 now write it:
#   A1 the wait before the open-file test, against a process holding a file in a sandbox with no lease and no socket
#   A2 the current wait against the same state
#   B  a real sandbox daemon whose launcher crashed and cleared both lease files, CP-004's environment
#   C  CP-003 step 1 run as written
# The waits send no signal. This script signals only processes it started: A's holder, and B's sandbox launcher,
# identified by its lease socket before a SIGKILL that stands in for the crash. The live advisors are asserted untouched.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
here="$(cd "$(dirname "$0")" && pwd)"
A=.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable
STEP1="$here/open-file-step1.sh"; NEWWAIT="$here/open-file-wait.sh"; OLDWAIT="$here/wait-before-open-file-test.sh"
python3 - "$A/global-disable-flag.md" "$STEP1" "$NEWWAIT" <<'PY'
import sys
text = open(sys.argv[1], encoding="utf-8").read()
block = text.split("## 3. TEST EXECUTION", 1)[1].split("```bash\n", 1)[1].split("```", 1)[0]
open(sys.argv[2], "w").write(block)
open(sys.argv[3], "w").write(block[block.index("sandbox_advisor_running() {"):])
PY
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
now() { perl -MTime::HiRes=time -e 'printf "%.1f", time'; }
procs() { ps -axo pid,ppid,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js|hf-model-server)" | grep -v grep \
  | awk '{cmd=$NF; sub(/.*Code_Environment\/Public\//, "", cmd); print "  pid=" $1, "ppid=" $2, cmd}'; }
alive() { ps -p "$1" > /dev/null 2>&1 && echo alive || echo gone; }
LIVE_PIDS=$(ps -axo pid,command | grep -E "system-skill-advisor-launcher\.cjs|advisor-server\.js" | grep -v grep | awk '{print $1}' | tr '\n' ' ')
echo "started $(date -u +%H:%M:%SZ), HEAD $(git rev-parse --short HEAD), step 1 sha $(shasum "$STEP1" | cut -c1-12), wait sha $(shasum "$NEWWAIT" | cut -c1-12)"
GEN_BEFORE=$(shasum "$GEN"); echo "live generation before: $GEN_BEFORE"
echo "advisor processes before (live pids $LIVE_PIDS):"; procs

holder_case() {
  local label="$1" wait="$2" holder t0 out
  SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX); export SANDBOX; mkdir -p "$SANDBOX/db" "$SANDBOX/sock"
  : > "$SANDBOX/db/skill-graph.sqlite"
  sleep 150 < "$SANDBOX/db/skill-graph.sqlite" & holder=$!
  echo "holder $holder has db/skill-graph.sqlite open, no lease, socket folder empty"
  t0=$(date +%s); out=$(bash "$wait" 2>&1 | tr '\n' ' ')
  echo "$label block: $out(took $(( $(date +%s) - t0 ))s)"
  echo "$label after the block: holder $(alive "$holder"), sandbox $([ -e "$SANDBOX" ] && echo kept || echo removed)"
  kill "$holder" 2>/dev/null; wait "$holder" 2>/dev/null; rm -rf "$SANDBOX"
}
echo; echo "== CASE A1: the wait before the open-file test, a process holding a file in the sandbox"
holder_case A1 "$OLDWAIT"
echo; echo "== CASE A2: the current wait, the same state"
holder_case A2 "$NEWWAIT"

echo; echo "== CASE B: a real sandbox daemon whose launcher crashed and cleared both lease files"
SANDBOX=$(mktemp -d /tmp/cp004.XXXXXX); export SANDBOX
SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_DAEMON_REELECTION=0 \
SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000 > /dev/null 2>&1
echo "call exit=$?"
LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
if [ -f "$LEASE" ]; then
  read -r LP DP SOCK < <(node -e 'const l = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); console.log([l.pid, l.childPid ?? "-", l.socketPath ?? "-"].join(" "))' "$LEASE")
  case "$SOCK" in "$SANDBOX"/*|/private"$SANDBOX"/*) ;; *) echo "socket outside sandbox; aborted"; exit 1 ;; esac
  for p in $LIVE_PIDS; do [ "$LP" = "$p" ] || [ "$DP" = "$p" ] && { echo "lease names a live pid; aborted"; exit 1; }; done
  ps -o command= -p "$LP" | grep -q 'system-skill-advisor-launcher\.cjs' || { echo "not a launcher; aborted"; exit 1; }
  kill -KILL "$LP"; sleep 0.5
  rm -f "$LEASE" "$SANDBOX/db/.skill-advisor-owner.json"
  echo "launcher $LP $(alive "$LP") after SIGKILL, both lease files removed as the crash handler would, daemon $DP $(alive "$DP")"
  T0=$(now)
  ( while ps -p "$DP" > /dev/null 2>&1; do sleep 0.2; done; now > "$here/caseB-daemon-exit.tmp" ) &
  WATCH=$!
  out=$(bash "$NEWWAIT" 2>&1 | tr '\n' ' '); T1=$(now)
  wait "$WATCH" 2>/dev/null
  TD=$(cat "$here/caseB-daemon-exit.tmp" 2>/dev/null || echo "$T1"); rm -f "$here/caseB-daemon-exit.tmp"
  echo "B block: $out"
  echo "B timing: daemon $DP exited at +$(echo "$TD - $T0" | bc)s, the block ended at +$(echo "$T1 - $T0" | bc)s, sandbox $([ -e "$SANDBOX" ] && echo kept || echo removed)"
  [ -e "$SANDBOX" ] && [ "$(alive "$DP")" = gone ] && { rm -rf "$SANDBOX"; echo "cleanup: the daemon is gone, kept sandbox removed by hand"; }
else
  echo "no lease written; case skipped"; rm -rf "$SANDBOX"
fi

echo; echo "== CASE C: normal path, CP-003 step 1 run as written"
T0=$(date +%s)
bash -x "$STEP1" > "$here/open-file-case-c.out" 2> "$here/open-file-case-c.trace"
echo "C block exit=$? took $(( $(date +%s) - T0 ))s; last line: $(tail -1 "$here/open-file-case-c.out")"
SB=$(grep -m1 -oE 'SANDBOX=/tmp/cp003\.[A-Za-z0-9]+' "$here/open-file-case-c.trace" | cut -d= -f2)
back=""; for i in $(seq 1 60); do [ -e "$SB" ] && { back="reappeared ${i}s after the block"; break; }; sleep 1; done
echo "C result: ${back:-$SB did not reappear within 60s}"
rm -f "$here/open-file-case-c.out" "$here/open-file-case-c.trace"

echo; echo "live generation after:  $(shasum "$GEN")"
[ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
echo "advisor processes after:"; procs
echo "leftover sandboxes: $(find /tmp /private/tmp -maxdepth 1 \( -name 'cp003.*' -o -name 'cp004.*' \) 2>/dev/null | wc -l | tr -d ' ')"
echo "finished $(date -u +%H:%M:%SZ)"
