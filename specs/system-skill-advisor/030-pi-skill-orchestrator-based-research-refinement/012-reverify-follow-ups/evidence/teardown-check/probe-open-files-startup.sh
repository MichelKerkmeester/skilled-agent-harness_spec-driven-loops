#!/usr/bin/env bash
# Samples a sandbox advisor from the moment of its cold start: the lease, the socket folder and the files open inside
# the sandbox, every 0.2 seconds while the call runs. It shows whether an open-file test sees the daemon during its
# startup scan, before the socket exists, and whether lsof +D matches through the /tmp symlink. Sends no signal.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX)
REAL=$(cd "$SANDBOX" && pwd -P)
LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
echo "started $(date -u +%H:%M:%SZ), HEAD $(git rev-parse --short HEAD), sandbox $SANDBOX (real $REAL)"
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000 > /dev/null 2>&1 &
CALL=$!
T0=$(perl -MTime::HiRes=time -e 'printf "%.1f", time')
while ps -p "$CALL" > /dev/null 2>&1; do
  t=$(perl -MTime::HiRes=time -e "printf '%.1f', time - $T0")
  via_tmp=$(lsof -n -P -t +D "$SANDBOX" 2>/dev/null | sort -u | tr '\n' ' ')
  via_real=$(lsof -n -P +D "$REAL" 2>/dev/null | awk 'NR>1 {print $1 "/" $2 ":" $NF}' | sed "s#$REAL##g" | sort -u | tr '\n' ' ')
  printf '+%4ss lease=%-3s sock=[%s] open_via_tmp_pids=[%s] open_via_real=[%s]\n' "$t" "$([ -e "$LEASE" ] && echo yes || echo no)" \
    "$(ls -A "$SANDBOX/sock" 2>/dev/null | tr '\n' ' ')" "$via_tmp" "$via_real"
  sleep 0.2
done
wait "$CALL"; echo "call exit=$? at +$(perl -MTime::HiRes=time -e "printf '%.1f', time - $T0")s"
for i in $(seq 1 60); do
  [ -e "$LEASE" ] || [ -n "$(ls -A "$SANDBOX/sock" 2>/dev/null)" ] || [ -n "$(lsof -n -P -t +D "$REAL" 2>/dev/null)" ] || break
  sleep 1
done
if [ -e "$LEASE" ] || [ -n "$(lsof -n -P -t +D "$REAL" 2>/dev/null)" ]; then
  echo "something still runs in the sandbox; kept at $SANDBOX"
else
  rm -rf "$SANDBOX"; echo "sandbox advisor gone after the call; sandbox removed"
fi
echo "finished $(date -u +%H:%M:%SZ)"
