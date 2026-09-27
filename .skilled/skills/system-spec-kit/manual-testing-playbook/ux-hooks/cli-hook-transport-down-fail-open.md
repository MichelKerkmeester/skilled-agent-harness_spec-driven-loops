---
title: "433 -- CLI Hook Transport-Down Fail-Open"
description: "Manual check that the skill-advisor prompt hook exits 0 and never blocks the prompt when the daemon socket is absent, with a status line or a brief in every case."
version: 3.6.0.2
id: ux-hooks-cli-hook-transport-down-fail-open
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 433 -- CLI Hook Transport-Down Fail-Open

## 1. OVERVIEW

This scenario verifies the transport-down behavior of the surviving runtime hook integrations. The Claude skill-advisor `user-prompt-submit` hook, which the Codex, Cursor and Devin adapters also spawn, runs the CLI through the fallback helper with `--no-warm-only`, so the CLI owns daemon reachability. The memory-backed session-prime, compact-inject, session-stop and session-start hooks were removed with their server, so the advisor hook is the remaining consumer of this contract. A casual prompt such as `hello` never reaches the CLI: the prompt gate declines it first and the hook prints `Advisor: prompt skipped.` On a cold socket the CLI starts the launcher and waits at most 5 s, then answers from the local scorer. The hook marks the answer degraded and renders it as stale (`Advisor: stale`). When the hook budget ends first, the hook exits 0 and prints `Advisor: outage (fail_open); route by hand:` above the directives. In every case the hook exits 0 and never blocks the prompt.

The check drives compiled hook scripts directly with a sandbox socket directory and a sandbox database directory, so it never reaches the host daemon or its database.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the advisor hook exits 0 and never blocks the prompt when the daemon socket is absent.
- Real user request: `If the skill-advisor daemon is down when I submit a prompt, does my prompt hang or fail?`
- Prompt: `Validate hook transport-down fail-open: absent socket, exit 0, a status line or brief in every case, never a blocked prompt.`
- Expected execution process: Point `SPECKIT_IPC_SOCKET_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` at directories inside an empty sandbox and pipe each hook payload into the compiled Claude hook script under `gtimeout`. Run the work payload twice, once with a 300 ms hook budget and once with the default budget. Run the casual payload once. Capture each exit code and the first `additionalContext` line. Then tear down: stop only the sandbox launcher whose socket lives inside the sandbox, confirm the live generation file is unchanged and remove the sandbox.
- Expected signals: All three runs exit 0. The `short:` first line starts with `Advisor: outage (fail_open); route by hand:`. The `casual:` first line is `Advisor: prompt skipped.` The `default:` first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);`.
- Desired user-visible outcome: Every case keeps the prompt unblocked and shows a status line or a brief.
- Pass/fail: PASS when all three runs exit 0, each first line matches the expected signals and the teardown prints `live generation file unchanged`.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate hook transport-down fail-open: absent socket, exit 0, a status line or brief in every case, never a blocked prompt.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db"
export SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
GEN_BEFORE=$(shasum "$GEN")
HOOK=.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js
WORK='{"session_id":"playbook-433","hook_event_name":"UserPromptSubmit","prompt":"help me refactor the advisor hook timeout handling"}'
CASUAL='{"session_id":"playbook-433","hook_event_name":"UserPromptSubmit","prompt":"hello"}'

echo "$WORK" | SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 gtimeout 20 node "$HOOK" > "$SANDBOX/short.json"; echo "short-budget exit=$?"
echo "$WORK" | gtimeout 20 node "$HOOK" > "$SANDBOX/default.json"; echo "default-budget exit=$?"
echo "$CASUAL" | gtimeout 20 node "$HOOK" > "$SANDBOX/casual.json"; echo "casual exit=$?"

for f in short default casual; do
  python3 -c "import json; d=json.load(open('$SANDBOX/$f.json')); print('$f:', d['hookSpecificOutput']['additionalContext'].splitlines()[0])"
done

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
unset SPECKIT_IPC_SOCKET_DIR SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED
rm -rf "$SANDBOX"
```

### Expected

- All three runs exit 0.
- The `short:` first line starts with `Advisor: outage (fail_open); route by hand:`.
- The `casual:` first line is `Advisor: prompt skipped.`
- The `default:` first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);`. Which one appears depends on whether the CLI starts a daemon for the sandbox socket in time and whether the local scorer answers first. All three are a pass.
- The teardown prints `live generation file unchanged`.

### Evidence

Shell transcript with the three exit codes, the three first lines and the teardown output.

### Pass / Fail

- **Pass**: all three runs exit 0, each first line matches the expected signals and the teardown prints `live generation file unchanged`.
- **Fail**: a run exits non-zero, `gtimeout` kills the hook, stdout is empty or the `short:` first line is not the outage line.
- **Fail**: the teardown prints `live generation file CHANGED`.

### Failure Triage

A non-zero exit breaks the fail-open contract: hooks must degrade output and never fail the prompt. A `short:` result that is not the outage line means the hook budget no longer bounds the CLI call (inspect `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`). A `casual:` result other than `Advisor: prompt skipped.` means the prompt gate no longer runs before the CLI.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md` | Feature-catalog source for the CLI hook fallbacks |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Shared skill-advisor CLI fallback helper |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Claude advisor hook using the fallback |
| `.skilled/plugins/system-skill-advisor.js` | OpenCode advisor plugin using the fallback |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | Cold-start window and local scorer |

Provenance: manual only - run the scenario prompt: Validate hook transport-down fail-open: absent socket, exit 0, a status line or brief in every case, never a blocked prompt.

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 433
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/cli-hook-transport-down-fail-open.md`
