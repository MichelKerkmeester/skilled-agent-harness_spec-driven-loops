#!/usr/bin/env bash
# Samples, once a second for 40 seconds after a sandbox cold start, which processes hold files open inside the
# sandbox, beside the lease and socket state the teardown reads. It shows whether an open-file test sees the sandbox
# daemon for its whole life, including the window after its socket closes. Sends no signal.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
procs() { ps -axo pid,ppid,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js|hf-model-server)" | grep -v grep \
  | awk '{cmd=$NF; sub(/.*Code_Environment\/Public\//, "", cmd); print "  pid=" $1, "ppid=" $2, cmd}'; }
echo "started $(date -u +%H:%M:%SZ), HEAD $(git rev-parse --short HEAD)"
echo "advisor processes before:"; procs
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX)
REAL=$(cd "$SANDBOX" && pwd -P)
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000 > "$SANDBOX.call.json" 2>&1
echo "call exit=$?, sandbox $SANDBOX, freshness $(grep -m1 -oE '"freshness": *"[a-z]+"' "$SANDBOX.call.json")"
rm -f "$SANDBOX.call.json"
LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
[ -f "$LEASE" ] && echo "lease: $(tr -d '\n' < "$LEASE" | cut -c1-160)"
T0=$(date +%s)
for i in $(seq 0 40); do
  open=$(lsof -n -P +D "$REAL" 2>/dev/null | awk 'NR>1 {print $1 "/" $2 ":" $NF}' | sed "s#$REAL##g" | sort -u | tr '\n' ' ')
  printf '+%2ss lease=%-3s sock=[%s] open=[%s]\n' "$(( $(date +%s) - T0 ))" "$([ -e "$LEASE" ] && echo yes || echo no)" \
    "$(ls -A "$SANDBOX/sock" 2>/dev/null | tr '\n' ' ')" "$open"
  sleep 1
done
if [ -e "$LEASE" ] || [ -n "$(lsof -n -P +D "$REAL" 2>/dev/null)" ]; then
  echo "something still runs in the sandbox; kept at $SANDBOX"
else
  rm -rf "$SANDBOX"; echo "sandbox removed"
fi
echo "advisor processes after:"; procs
echo "finished $(date -u +%H:%M:%SZ)"
