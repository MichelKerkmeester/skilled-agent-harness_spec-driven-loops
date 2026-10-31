LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
if [ -f "$LEASE" ]; then
  read -r LAUNCHER_PID DAEMON_PID LEASE_SOCKET < <(node -e 'const l = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); console.log([l.pid, l.childPid ?? "-", l.socketPath ?? "-"].join(" "))' "$LEASE")
  case "$LEASE_SOCKET" in
    "$SANDBOX"/*|/private"$SANDBOX"/*)
      kill -TERM "$LAUNCHER_PID" 2>/dev/null
      for _ in $(seq 1 20); do kill -0 "$LAUNCHER_PID" 2>/dev/null || break; sleep 0.5; done
      if [ "$DAEMON_PID" != "-" ] && kill -0 "$DAEMON_PID" 2>/dev/null; then kill -TERM "$DAEMON_PID"; fi
      kill -0 "$LAUNCHER_PID" 2>/dev/null && echo "sandbox launcher $LAUNCHER_PID still running" || echo "sandbox launcher $LAUNCHER_PID stopped"
      ;;
    *) echo "lease socket $LEASE_SOCKET is outside the sandbox; nothing stopped" ;;
  esac
else
  echo "no sandbox launcher recorded"
fi
