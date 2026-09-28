---
title: "CP-004 Daemon Absent Fallback"
description: "Manual validation for daemon-absent local fallback and native fail-open behavior."
trigger_phrases:
  - "cp-004"
  - "daemon absent fallback"
  - "daemon absent"
  - "daemon"
version: 0.8.0.13
id: CP-004
category: compat_and_disable
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# CP-004 Daemon Absent Fallback

Prompt: Manual validation for daemon-absent local fallback and native fail-open behavior.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate two fallback paths: the Python shim routes to local scoring when native daemon probing is unavailable and native `advisor_recommend` fails open with empty recommendations when freshness is absent.

---

## 2. SCENARIO CONTRACT

- Steps 2 to 4 run inside a sandbox created under `/tmp`. The sandbox gives the advisor its own socket directory and database directory, so the daemon-absent state needs no change to the live daemon, and the live daemon is never contacted or stopped.
- Create the sandbox with `mktemp -d /tmp/cp004.XXXXXX`. A `$TMPDIR` path on macOS is long enough to push the socket path past the 104-byte Darwin `sun_path` limit.
- Never move, rebuild or stop the live repository database or daemon. The teardown sends no signal. Step 4's sandbox daemon exits on a 12-second idle timeout, and step 5 removes the sandbox only once the lease, the socket and every open file in it are gone.

---

## 3. TEST EXECUTION

1. Python local fallback:

```bash
SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
```

2. Create the sandbox and record the live generation file's checksum. `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0` keeps the sandbox launcher away from the shared model server, which the launcher otherwise stops when it exits:

```bash
SANDBOX=$(mktemp -d /tmp/cp004.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db"
export SPECKIT_DAEMON_REELECTION=0
export SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
GEN_BEFORE=$(shasum "$GEN")
```

3. Daemon absent, cold spawn suppressed. This is the run that shows exit `75`:

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --warm-only --timeout-ms 3000 2>&1
echo "warm-only exit=$?"
```

4. Cold start. This run spawns a sandbox launcher and daemon, and is the one that shows the `live` rebuild. `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2` gives that daemon a 12-second idle timeout, so it exits on its own once the call ends. Inspect `freshness`, `trustState` and `recommendations`:

```bash
SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
echo "cold-start exit=$?"
```

5. Teardown. The block sends no signal. It waits until the lease file is gone, the socket folder is empty, no process holds a file open in the sandbox and at least 25 seconds have passed, which outlasts the idle timeout and its six-second check. The open-file test covers a launcher that crashes, because a crashing launcher deletes its lease without waiting for its daemon, and the daemon keeps its database open until it exits. Then the block confirms the live generation file is unchanged and removes the sandbox. It does nothing when step 2's variables are missing, as they are when the steps run in separate shells. It keeps the sandbox when `lsof` cannot list the shell's own open files, since the open-file test then proves nothing. It removes with `rm -r`, so `sandbox removed` prints only when a folder was really removed:

```bash
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
```

### Expected Signals

- Forced-local shim returns a JSON array from the Python scorer.
- Step 3 (`--warm-only`) prints `warm-only exit=75` after a retryable error envelope, `"status": "error"` with
  `"error": "backend unavailable: connect ENOENT $SANDBOX/sock/daemon-ipc.sock"` and `"exitCode": 75`. Nothing is
  spawned, and `$SANDBOX/db` is never created.
- Step 4 (cold start) prints `cold-start exit=0` after a `"status": "ok"` envelope from the sandbox daemon with
  `freshness: "live"`. The `freshness: "absent"` envelope with empty recommendations is a handler-level branch that
  the front door does not surface in the shipped configuration. The hook layer is where an unreachable daemon
  becomes an `Advisor:` status line.
- Step 5 prints `live generation file unchanged` and `sandbox advisor exited; sandbox removed`. No `/tmp/cp004.*` folder is left behind.
- The absence path does not throw and does not block prompt handling.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Native absent throws | Command call errors instead of JSON envelope | Inspect absent freshness branch. |
| Shim cannot route locally | Forced-local exits nonzero | Check Python scorer imports and skill metadata. |
| Warm-only run exits `0` | Step 3 answers from a daemon | The sandbox exports are missing, so the call reached the live daemon. Rerun step 2 in the same shell. |
| Cold start answers from the local scorer | Step 4 shows `degraded: true` and `source: "local-scorer"` with no `freshness` | The sandbox daemon did not answer inside the CLI's 5-second cold-start window. Run step 4 again, then tear down. |
| Sandbox advisor outlives the wait | Step 5 prints `still running after the wait` and keeps the sandbox | Check the pids in the kept lease, if there is one, and the pids `lsof -t +D "$SANDBOX"` prints, with `ps`. Remove the sandbox by hand once none of them runs. Never stop the live daemon. |
| `lsof` cannot run | Step 5 prints `lsof cannot list open files here` and keeps the sandbox | `lsof` is missing or the runtime's sandbox blocks it, so the block cannot tell whether the sandbox daemon still holds its database. Record the environment limit. Remove the sandbox by hand once `lsof -t +D` in a shell where it works shows nothing holds it. |
| Step 2's variables are lost | Step 5 prints `step 2 variables are missing` | The steps ran in separate shells, so nothing was checked or removed. Rerun steps 2 to 5 in one shell. |
| Live state changed | Step 5 prints `live generation file CHANGED` | Record it as a FAIL. The live advisor also rewrites that file when it starts, stops, scans, rebuilds or reindexes, and it reindexes about three seconds after any skill file it watches changes, with the reason `advisor-server-watcher-reindex`. So another session's edit during the run changes it too. Rerun steps 2 to 5 while no skill file is being edited, the live advisor keeps its pids and no one runs a skill-graph scan or an advisor rebuild. A `CHANGED` line on that quiet rerun points to the sandbox daemon writing live advisor state. |

---

## 4. SOURCE FILES

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`
- `.skilled/bin/system-skill-advisor-launcher.cjs`
- `.skilled/bin/lib/launcher-ipc-bridge.cjs`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: compat-and-disable/daemon-absent-fallback.md
