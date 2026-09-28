#!/usr/bin/env bash
# Exercises the old and new sandbox teardown on the three paths the GPT-6 Luna verify flagged.
# Old teardown: CP-004 step 5 at HEAD. New teardown: CP-003 step 1 in the working tree.
# Only processes this script starts are ever signalled; the live advisors are asserted untouched.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
here="$(cd "$(dirname "$0")" && pwd)"
A=.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable
OLD="$here/old-teardown.sh"; NEW="$here/new-teardown.sh"
git show "HEAD:$A/daemon-absent-fallback.md" | awk '/^LEASE=/{f=1} f{print} /^fi$/{if(f){exit}}' > "$OLD"
awk '/^LEASE=/{f=1} f{print} /^fi$/{if(f){exit}}' "$A/global-disable-flag.md" > "$NEW"
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
LIVE_PIDS="97186 97187 18680 18683"
procs() { ps -axo pid,ppid,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js|hf-model-server)" | grep -v grep | cut -c1-150; }
alive() { kill -0 "$1" 2>/dev/null && echo alive || echo gone; }

echo "started $(date -u +%H:%M:%SZ)"
echo "old teardown sha $(shasum "$OLD" | cut -c1-12), new teardown sha $(shasum "$NEW" | cut -c1-12)"
GEN_BEFORE=$(shasum "$GEN"); echo "live generation before: $GEN_BEFORE"
echo "advisor processes before:"; procs

echo; echo "== CASE 1: lease socket climbs out of the sandbox with .."
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX); export SANDBOX; mkdir -p "$SANDBOX/db"
printf '{"pid":999999,"childPid":999998,"socketPath":"%s/../outside/sock/advisor.sock"}' "$SANDBOX" > "$SANDBOX/db/.system-skill-advisor-launcher.json"
echo "old: $(bash "$OLD" 2>&1)"
echo "new: $(bash "$NEW" 2>&1)"
rm -rf "$SANDBOX"

echo; echo "== CASE 2: lease pids belong to decoy processes, socket inside the sandbox"
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX); export SANDBOX; mkdir -p "$SANDBOX/db"
sleep 600 & D1=$!; sleep 600 & D2=$!
printf '{"pid":%d,"childPid":%d,"socketPath":"%s/sock/advisor.sock"}' "$D1" "$D2" "$SANDBOX" > "$SANDBOX/db/.system-skill-advisor-launcher.json"
echo "decoys: launcher-slot $D1, daemon-slot $D2"
echo "new: $(bash "$NEW" 2>&1 | tr '\n' ' ')"
echo "after new: decoy1 $(alive "$D1"), decoy2 $(alive "$D2")"
echo "old: $(bash "$OLD" 2>&1 | tr '\n' ' ')"
sleep 1
echo "after old: decoy1 $(alive "$D1"), decoy2 $(alive "$D2")"
kill "$D1" "$D2" 2>/dev/null; wait "$D1" "$D2" 2>/dev/null
rm -rf "$SANDBOX"

for variant in old new; do
  echo; echo "== CASE 3 ($variant): real sandbox launcher killed without its handler, daemon orphaned"
  SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX); export SANDBOX
  SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 \
    node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
    --options '{"topK":1}' --format json --timeout-ms 30000 > /dev/null 2>&1
  echo "cold start exit=$?"
  LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
  if [ ! -f "$LEASE" ]; then echo "no lease; case skipped"; rm -rf "$SANDBOX"; continue; fi
  read -r LP DP SOCK < <(node -e 'const l = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); console.log([l.pid, l.childPid ?? "-", l.socketPath ?? "-"].join(" "))' "$LEASE")
  echo "lease: launcher $LP, daemon $DP, socket $SOCK"
  case "$SOCK" in "$SANDBOX"/*|/private"$SANDBOX"/*) ;; *) echo "socket outside sandbox; case aborted"; rm -rf "$SANDBOX"; continue ;; esac
  for p in $LIVE_PIDS; do if [ "$LP" = "$p" ] || [ "$DP" = "$p" ]; then echo "lease names a live advisor pid; aborted"; exit 1; fi; done
  ps -o command= -p "$LP" | grep -q 'system-skill-advisor-launcher\.cjs' || { echo "launcher pid is not a launcher; aborted"; exit 1; }
  [ "$(ps -o ppid= -p "$DP" | tr -d ' ')" = "$LP" ] || { echo "daemon is not the launcher's child; aborted"; exit 1; }
  kill -KILL "$LP"; sleep 2
  echo "after SIGKILL: launcher $(alive "$LP"), daemon $(alive "$DP"), daemon ppid now $(ps -o ppid= -p "$DP" 2>/dev/null | tr -d ' ')"
  T0=$(date +%s)
  echo "teardown: $(bash "$( [ "$variant" = old ] && echo "$OLD" || echo "$NEW")" 2>&1 | tr '\n' ' ')"
  echo "teardown took $(( $(date +%s) - T0 ))s, daemon $(alive "$DP") when it returned"
  rm -rf "$SANDBOX"
  back=""
  for i in $(seq 1 60); do if [ -e "$SANDBOX" ]; then back="reappeared ${i}s after removal: $(cd "$SANDBOX" && find . -type f | tr '\n' ' ')"; break; fi; sleep 1; done
  echo "RESULT $variant: ${back:-$SANDBOX did not reappear within 60s}; daemon $(alive "$DP")"
  if kill -0 "$DP" 2>/dev/null && ps -o command= -p "$DP" | grep -q 'advisor-server\.js'; then kill -TERM "$DP"; sleep 3; echo "cleanup: stopped leftover sandbox daemon $DP"; fi
  rm -rf "$SANDBOX"
done

echo; echo "live generation after:  $(shasum "$GEN")"
[ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
echo "advisor processes after:"; procs
echo "leftover sandboxes: $(ls -d /tmp/cp003.* 2>/dev/null | tr '\n' ' ')"
echo "finished $(date -u +%H:%M:%SZ)"
