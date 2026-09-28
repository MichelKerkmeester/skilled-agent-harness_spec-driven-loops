LEASE="$SANDBOX/db/.system-skill-advisor-launcher.json"
if [ -f "$LEASE" ]; then
  read -r LAUNCHER_PID DAEMON_PID LEASE_SOCKET < <(node -e 'const path = require("path"); const l = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); console.log([l.pid, l.childPid ?? "-", l.socketPath ? path.resolve(l.socketPath) : "-"].join(" "))' "$LEASE")
  case "$LEASE_SOCKET" in
    "$SANDBOX"/*|/private"$SANDBOX"/*)
      if ps -o command= -p "$LAUNCHER_PID" 2>/dev/null | grep -q 'system-skill-advisor-launcher\.cjs'; then kill -TERM "$LAUNCHER_PID"; fi
      for _ in $(seq 1 20); do kill -0 "$LAUNCHER_PID" 2>/dev/null || break; sleep 0.5; done
      if [ "$DAEMON_PID" != "-" ] && ps -o command= -p "$DAEMON_PID" 2>/dev/null | grep -q 'advisor-server\.js'; then
        kill -TERM "$DAEMON_PID"
        for _ in $(seq 1 20); do kill -0 "$DAEMON_PID" 2>/dev/null || break; sleep 0.5; done
        if kill -0 "$DAEMON_PID" 2>/dev/null; then echo "sandbox daemon $DAEMON_PID still running"; fi
      fi
      kill -0 "$LAUNCHER_PID" 2>/dev/null && echo "sandbox launcher $LAUNCHER_PID still running" || echo "sandbox launcher $LAUNCHER_PID stopped"
      ;;
    *) echo "lease socket $LEASE_SOCKET is outside the sandbox; nothing stopped" ;;
  esac
else
  echo "no sandbox launcher recorded"
fi
