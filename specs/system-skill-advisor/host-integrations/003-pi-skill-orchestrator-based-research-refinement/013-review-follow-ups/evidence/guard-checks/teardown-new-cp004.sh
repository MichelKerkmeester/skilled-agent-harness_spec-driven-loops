if [ -z "${SANDBOX:-}" ] || [ -z "${GEN:-}" ] || [ -z "${GEN_BEFORE:-}" ]; then
  echo "step 2 variables are missing; rerun steps 2 to 5 in one shell"
else
  sandbox_advisor_running() {
    [ -e "$SANDBOX/db/.system-skill-advisor-launcher.json" ] || [ -n "$(ls -A "$SANDBOX/sock" 2>/dev/null)" ] ||
      [ -n "$(lsof -t +D "$SANDBOX" 2>/dev/null)" ]
  }
  for i in $(seq 1 60); do [ "$i" -gt 25 ] && ! sandbox_advisor_running && break; sleep 1; done
  [ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
  unset SPECKIT_IPC_SOCKET_DIR SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_DAEMON_REELECTION SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED
  if [ -z "$(lsof -t -p $$ 2>/dev/null)" ]; then
    echo "lsof cannot list open files here; sandbox kept at $SANDBOX"
  elif sandbox_advisor_running; then
    echo "sandbox advisor still running after the wait; sandbox kept at $SANDBOX"
  else
    rm -r "$SANDBOX" && echo "sandbox advisor exited; sandbox removed"
  fi
fi
