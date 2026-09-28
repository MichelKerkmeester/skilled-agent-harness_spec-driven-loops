if [ -z "${SANDBOX:-}" ]; then
  echo "SANDBOX is unset; run step 1 as one block"
else
  sandbox_advisor_running() {
    [ -e "$SANDBOX/db/.system-skill-advisor-launcher.json" ] || [ -n "$(ls -A "$SANDBOX/sock" 2>/dev/null)" ] ||
      [ -n "$(lsof -t +D "$SANDBOX" 2>/dev/null)" ]
  }
  for i in $(seq 1 60); do [ "$i" -gt 25 ] && ! sandbox_advisor_running && break; sleep 1; done
  if [ -z "$(lsof -t -p $$ 2>/dev/null)" ]; then
    echo "lsof cannot list open files here; sandbox kept at $SANDBOX"
  elif sandbox_advisor_running; then
    echo "sandbox advisor still running after the wait; sandbox kept at $SANDBOX"
  else
    rm -r "$SANDBOX" && echo "sandbox advisor exited; sandbox removed"
  fi
fi
