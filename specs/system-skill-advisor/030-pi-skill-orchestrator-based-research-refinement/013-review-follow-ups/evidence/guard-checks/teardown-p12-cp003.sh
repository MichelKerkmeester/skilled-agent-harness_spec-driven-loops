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
