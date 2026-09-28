#!/usr/bin/env bash
# One watched crash of a sandbox launcher, run once on the operator's yes of 2026-09-28.
# It cold-starts a sandbox advisor with CP-004's environment, kills that sandbox's launcher and removes both lease
# files as the launcher's crash handler would, then samples the sandbox and the live advisor every 0.1 seconds until
# the orphaned daemon exits. CP-004 step 5's teardown, as the scenario writes it, runs against the same sandbox.
# The only signal goes to the sandbox launcher this script started, after three checks: its lease socket lies
# inside the sandbox, its pid is not a live advisor pid and its command is a launcher. No live advisor is signalled.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
here="$(cd "$(dirname "$0")" && pwd)"
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
LIVE_LEASE=.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
CP004=.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md
now() { perl -MTime::HiRes=time -e 'printf "%.2f", time'; }
procs() { ps -axo pid,ppid,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js|hf-model-server)" | grep -v grep \
  | awk '{cmd=$NF; sub(/.*Code_Environment\/Public\//, "", cmd); print "  pid=" $1, "ppid=" $2, cmd}'; }
lease_fields() { node -e 'const l = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); console.log([l.pid, l.childPid ?? "-", l.socketPath ?? "-"].join(" "))' "$1"; }

python3 - "$CP004" "$here/teardown-cp004-step5.sh" <<'PY'
import re, sys
blocks = re.findall(r"```bash\n(.*?)```", open(sys.argv[1], encoding="utf-8").read(), re.S)
open(sys.argv[2], "w", encoding="utf-8").write(blocks[4])
PY

LIVE_PIDS=$(ps -axo pid,command | grep -E "system-skill-advisor-launcher\.cjs|advisor-server\.js" | grep -v grep | awk '{print $1}' | tr '\n' ' ')
read -r LIVE_L LIVE_D _ < <(lease_fields "$LIVE_LEASE")
echo "started $(date -u +%H:%M:%SZ), HEAD $(git rev-parse --short HEAD), teardown sha $(shasum "$here/teardown-cp004-step5.sh" | cut -c1-12)"
GEN_BEFORE=$(shasum "$GEN"); echo "live generation before: $GEN_BEFORE"
echo "live lease names launcher $LIVE_L and daemon $LIVE_D; all advisor pids: $LIVE_PIDS"
echo "advisor processes before:"; procs

SANDBOX=$(mktemp -d /tmp/cp004.XXXXXX)
case "$SANDBOX" in /tmp/cp004.?*) ;; *) echo "unexpected sandbox path: $SANDBOX"; exit 1 ;; esac
SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_DAEMON_REELECTION=0 \
SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000 > "$here/cold-start.json" 2>&1
echo "cold start exit=$? into $SANDBOX, freshness $(grep -m1 -o '"freshness": "[a-z]*"' "$here/cold-start.json")"
LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
if [ ! -f "$LEASE" ]; then
  echo "no sandbox lease was written; nothing signalled"
  [ -z "$(lsof -t +D "$SANDBOX" 2>/dev/null)" ] && rm -r "$SANDBOX" && echo "empty sandbox removed"
  exit 1
fi
read -r LP DP SOCK < <(lease_fields "$LEASE")
case "$SOCK" in "$SANDBOX"/*|/private"$SANDBOX"/*) ;; *) echo "lease socket $SOCK is outside the sandbox; aborted"; exit 1 ;; esac
for p in $LIVE_PIDS; do
  if [ "$LP" = "$p" ] || [ "$DP" = "$p" ]; then echo "the sandbox lease names live pid $p; aborted"; exit 1; fi
done
ps -o command= -p "$LP" | grep -q 'system-skill-advisor-launcher\.cjs' || { echo "pid $LP is not a launcher; aborted"; exit 1; }
echo "sandbox launcher $LP, daemon $DP ($(ps -o command= -p "$DP" | awk '{print $NF}' | sed 's/.*Public\///')), socket $SOCK"
echo "checks passed: socket inside the sandbox, neither pid live, $LP is a launcher"

python3 "$here/sampler.py" "$SANDBOX" "$DP" "$LIVE_LEASE" "$LIVE_L" "$LIVE_D" "$here/samples.tsv" "$here/scans.tsv" &
SAMPLER=$!
sleep 1
KILL_AT=$(now)
kill -KILL "$LP"
rm -f "$LEASE" "$SANDBOX/db/.skill-advisor-owner.json"
echo "$KILL_AT" > "$here/kill-at.txt"
echo "$(date -u +%H:%M:%SZ) SIGKILL sent to sandbox launcher $LP, both sandbox lease files removed"

TEARDOWN_AT=$(now)
SANDBOX="$SANDBOX" GEN="$GEN" GEN_BEFORE="$GEN_BEFORE" bash "$here/teardown-cp004-step5.sh" > "$here/teardown-output.txt" 2>&1
TEARDOWN_END=$(now)
wait "$SAMPLER"
echo "teardown ran from +$(echo "$TEARDOWN_AT - $KILL_AT" | bc)s to +$(echo "$TEARDOWN_END - $KILL_AT" | bc)s and printed:"
sed 's/^/  /' "$here/teardown-output.txt"
if [ -e "$SANDBOX" ]; then
  holders=$(lsof -t +D "$SANDBOX" 2>/dev/null)
  if [ -z "$holders" ]; then rm -r "$SANDBOX" && echo "kept sandbox removed by hand, nothing held it"
  else echo "sandbox kept, still held by: $holders"; fi
fi

echo; echo "live generation after:  $(shasum "$GEN")"
[ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
echo "live lease after: $(lease_fields "$LIVE_LEASE")"
echo "advisor processes after:"; procs
echo "leftover sandboxes: $(find /tmp /private/tmp -maxdepth 1 \( -name 'cp003.*' -o -name 'cp004.*' -o -name 'cli-playbook.*' \) 2>/dev/null | wc -l | tr -d ' ')"
echo "finished $(date -u +%H:%M:%SZ)"
echo; python3 "$here/summarize.py" "$here/samples.tsv" "$here/scans.tsv" "$KILL_AT"
