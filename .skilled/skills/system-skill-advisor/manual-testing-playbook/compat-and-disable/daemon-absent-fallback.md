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
- Never move, rebuild or stop the live repository database or daemon. The teardown stops only the launcher this scenario started.

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

4. Cold start. This run spawns a sandbox launcher and daemon, and is the one that shows the `live` rebuild. Inspect `freshness`, `trustState` and `recommendations`:

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
echo "cold-start exit=$?"
```

5. Teardown. The launcher records its own pid, the daemon's pid and its socket path in `$SANDBOX/db/.system-skill-advisor-launcher.json`. Stop that launcher only when its recorded socket lives inside this sandbox, confirm the live generation file is unchanged, then remove the sandbox:

```bash
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
[ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
unset SPECKIT_IPC_SOCKET_DIR SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_DAEMON_REELECTION SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED
rm -rf "$SANDBOX"
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
- Step 5 prints `sandbox launcher <pid> stopped` and `live generation file unchanged`.
- The absence path does not throw and does not block prompt handling.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Native absent throws | Command call errors instead of JSON envelope | Inspect absent freshness branch. |
| Shim cannot route locally | Forced-local exits nonzero | Check Python scorer imports and skill metadata. |
| Warm-only run exits `0` | Step 3 answers from a daemon | The sandbox exports are missing, so the call reached the live daemon. Rerun step 2 in the same shell. |
| Cold start answers from the local scorer | Step 4 shows `degraded: true` and `source: "local-scorer"` with no `freshness` | The sandbox daemon did not answer inside the CLI's 5-second cold-start window. Run step 4 again, then tear down. |
| Sandbox launcher survives teardown | Step 5 prints `still running` | Stop that pid by hand after confirming its lease socket is inside the sandbox. Never stop the live daemon. |
| Live state changed | Step 5 prints `live generation file CHANGED` | Record it as a FAIL. The sandbox daemon wrote live advisor state. |

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

---

## 6. EVIDENCE

Command:

```bash
SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
```

Output:

```text
Skill graph: loaded from SQLite
[
  {
    "skill": "sk-git",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !changes(multi), !commit, !commit(keyword), !commit(signal), branch",
    "_graph_boost_count": 0,
    "source": "local"
  }
]
```

MCP call:

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"topK":1,"includeAbstainReasons":true}})
```

Observed response:

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "unavailable",
    "trustState": {
      "state": "unavailable",
      "reason": "advisor_unavailable",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:02:56.797Z",
      "lastLiveAt": null
    },
    "generatedAt": "2026-07-03T02:02:56.797Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": false
    },
    "warnings": [
      "advisor_unavailable"
    ],
    "abstainReasons": [
      "Skill advisor freshness is unavailable; returning fail-open empty recommendations."
    ]
  }
}
```

Comparison against Expected Signals:

- Forced-local shim returned a JSON array from the Python scorer.
- Native response returned `recommendations: []` and a prompt-safe abstain reason.
- Native response did not throw and did not block prompt handling.
- Native response returned `freshness: "unavailable"`, not the expected `freshness: "absent"`.
- The required disposable workspace or controlled environment override for absent native generation/artifact state was not available under the allowed write constraints for this run.

---

## 7. PASS/FAIL

BLOCKED - The scenario could not establish the required absent native generation/artifact precondition; the real native response was fail-open but reported `freshness: "unavailable"` instead of the expected `freshness: "absent"`.
