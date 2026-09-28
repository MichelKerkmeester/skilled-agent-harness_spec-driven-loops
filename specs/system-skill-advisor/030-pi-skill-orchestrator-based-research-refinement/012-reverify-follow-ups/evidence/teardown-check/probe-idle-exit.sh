#!/usr/bin/env bash
# Measures how a sandbox launcher and daemon wind down on a short idle timeout, with no signal sent:
# when the daemon exits, when the lease and socket disappear, and whether anything writes into the
# sandbox after the lease is gone. The live advisors are only listed, never touched.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
procs() { ps -axo pid,ppid,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js|hf-model-server)" | grep -v grep | cut -c1-110; }
alive() { kill -0 "$1" 2>/dev/null && echo alive || echo gone; }
echo "started $(date -u +%H:%M:%SZ)"; echo "advisor processes before:"; procs

SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX)
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.1 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000 > "$SANDBOX.call.json" 2>&1
echo "call exit=$? freshness=$(grep -o '"freshness": *"[a-z]*"' "$SANDBOX.call.json" | head -1)"
T0=$(python3 -c 'import time; print(time.time())')
LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
[ -e "$LEASE" ] || { echo "no lease written"; rm -rf "$SANDBOX" "$SANDBOX.call.json"; exit 0; }
read -r LP DP SOCK < <(node -e 'const l = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); console.log([l.pid, l.childPid ?? "-", l.socketPath ?? "-"].join(" "))' "$LEASE")
echo "lease: launcher $LP, daemon $DP, socket $SOCK"
el() { python3 -c "import time; print(f'{time.time()-$T0:5.1f}s')"; }
dgone=""; lgone=""; lpgone=""; sgone=""
for _ in $(seq 1 240); do
  [ -z "$dgone" ] && [ "$(alive "$DP")" = gone ] && dgone=$(el) && echo "daemon exited at +$dgone"
  [ -z "$lgone" ] && [ ! -e "$LEASE" ] && lgone=$(el) && echo "lease removed at +$lgone"
  [ -z "$lpgone" ] && [ "$(alive "$LP")" = gone ] && lpgone=$(el) && echo "launcher exited at +$lpgone"
  [ -z "$sgone" ] && [ ! -e "$SOCK" ] && sgone=$(el) && echo "socket file removed at +$sgone"
  [ -n "$dgone" ] && [ -n "$lgone" ] && [ -n "$lpgone" ] && break
  sleep 0.25
done
echo "socket file still present: $([ -e "$SOCK" ] && echo yes || echo no)"
echo "sandbox files after the lease was removed:"; (cd "$SANDBOX" && find . -type f -exec stat -f '%Sm %N' -t '%H:%M:%S' {} \; | sort)
M1=$(cd "$SANDBOX" && find . -type f -exec stat -f '%m %N' {} \; | sort | shasum)
sleep 20
M2=$(cd "$SANDBOX" && find . -type f -exec stat -f '%m %N' {} \; | sort | shasum)
[ "$M1" = "$M2" ] && echo "no write into the sandbox in the 20s after the processes exited" || echo "WRITE into the sandbox after the processes exited"
rm -rf "$SANDBOX" "$SANDBOX.call.json"
for i in $(seq 1 30); do [ -e "$SANDBOX" ] && { echo "sandbox reappeared ${i}s after removal"; break; }; sleep 1; done
[ -e "$SANDBOX" ] || echo "sandbox did not reappear within 30s of removal"
echo "advisor processes after:"; procs
echo "leftover sandboxes: $(ls -d /tmp/cp003.* 2>/dev/null | tr '\n' ' ')"
echo "finished $(date -u +%H:%M:%SZ)"
