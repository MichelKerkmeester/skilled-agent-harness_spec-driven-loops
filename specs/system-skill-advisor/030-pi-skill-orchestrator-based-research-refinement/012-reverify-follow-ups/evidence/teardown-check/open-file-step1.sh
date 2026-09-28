SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX)
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
sandbox_advisor_running() {
  [ -e "$SANDBOX/db/.system-skill-advisor-launcher.json" ] || [ -n "$(ls -A "$SANDBOX/sock" 2>/dev/null)" ] ||
    [ -n "$(lsof -t +D "$SANDBOX" 2>/dev/null)" ]
}
for i in $(seq 1 60); do [ "$i" -gt 25 ] && ! sandbox_advisor_running && break; sleep 1; done
if sandbox_advisor_running; then
  echo "sandbox advisor still running after 60s; sandbox kept at $SANDBOX"
else
  rm -rf "$SANDBOX" && echo "sandbox advisor exited; sandbox removed"
fi
