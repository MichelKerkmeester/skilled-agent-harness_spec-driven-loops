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

The check drives compiled hook scripts directly with a sandbox socket directory and a sandbox database directory, so it never reaches the host daemon or its database. Its teardown sends no signal. The default-budget run starts a sandbox launcher and daemon. The daemon exits on a 12-second idle timeout, and the block removes the sandbox only once nothing holds it.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the advisor hook exits 0 and never blocks the prompt when the daemon socket is absent.
- Real user request: `If the skill-advisor daemon is down when I submit a prompt, does my prompt hang or fail?`
- Prompt: `Validate hook transport-down fail-open: absent socket, exit 0, a status line or brief in every case, never a blocked prompt.`
- Expected execution process: Point `SPECKIT_IPC_SOCKET_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` at directories inside an empty sandbox and pipe each hook payload into the compiled Claude hook script under `gtimeout`. Run the work payload twice, once with a 300 ms hook budget and once with the default budget. Run the casual payload once. Capture each exit code and the first `additionalContext` line. Then tear down without sending a signal: wait until the lease, the socket and every open file in the sandbox are gone, confirm the live generation file is unchanged and remove the sandbox.
- Expected signals: All three runs exit 0. The `short:` first line starts with `Advisor: outage (fail_open); route by hand:`. The `casual:` first line is `Advisor: prompt skipped.` The `default:` first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);`.
- Desired user-visible outcome: Every case keeps the prompt unblocked and shows a status line or a brief.
- Pass/fail: PASS when all three runs exit 0, each first line matches the expected signals and the teardown prints `live generation file unchanged` and `sandbox advisor exited; sandbox removed`.

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
export SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2
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

if [ -z "${SANDBOX:-}" ] || [ -z "${GEN:-}" ] || [ -z "${GEN_BEFORE:-}" ]; then
  echo "the block's variables are missing; rerun the whole block in one shell"
else
  sandbox_advisor_running() {
    [ -e "$SANDBOX/db/.system-skill-advisor-launcher.json" ] || [ -n "$(ls -A "$SANDBOX/sock" 2>/dev/null)" ] ||
      [ -n "$(lsof -t +D "$SANDBOX" 2>/dev/null)" ]
  }
  for i in $(seq 1 60); do [ "$i" -gt 25 ] && ! sandbox_advisor_running && break; sleep 1; done
  [ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
  unset SPECKIT_IPC_SOCKET_DIR SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN
  if [ -z "$(lsof -t -p $$ 2>/dev/null)" ]; then
    echo "lsof cannot list open files here; sandbox kept at $SANDBOX"
  elif sandbox_advisor_running; then
    echo "sandbox advisor still running after the wait; sandbox kept at $SANDBOX"
  else
    rm -r "$SANDBOX" && echo "sandbox advisor exited; sandbox removed"
  fi
fi
```

### Expected

- All three runs exit 0.
- The `short:` first line starts with `Advisor: outage (fail_open); route by hand:`.
- The `casual:` first line is `Advisor: prompt skipped.`
- The `default:` first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);`. Which one appears depends on whether the CLI starts a daemon for the sandbox socket in time and whether the local scorer answers first. All three are a pass.
- The teardown prints `live generation file unchanged` and then `sandbox advisor exited; sandbox removed`. No `/tmp/cli-playbook.*` folder is left behind.

### Evidence

Shell transcript with the three exit codes, the three first lines and the teardown output.

### Pass / Fail

- **Pass**: all three runs exit 0, each first line matches the expected signals and the teardown prints `live generation file unchanged` and `sandbox advisor exited; sandbox removed`.
- **Fail**: a run exits non-zero, `gtimeout` kills the hook, stdout is empty or the `short:` first line is not the outage line.
- **Fail**: the teardown prints `live generation file CHANGED`.
- **Fail**: the teardown keeps the sandbox, printing `lsof cannot list open files here` or `sandbox advisor still running after the wait`.

### Failure Triage

A non-zero exit breaks the fail-open contract: hooks must degrade output and never fail the prompt. A `short:` result that is not the outage line means the hook budget no longer bounds the CLI call (inspect `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`). A `casual:` result other than `Advisor: prompt skipped.` means the prompt gate no longer runs before the CLI. A kept sandbox is the teardown refusing to guess. `lsof cannot list open files here` means `lsof` is missing or the runtime's sandbox blocks it, so the block cannot tell whether the sandbox daemon still holds its database. `still running after the wait` means a sandbox process outlived the wait: check the pids in the kept lease, if there is one, and the pids `lsof -t +D "$SANDBOX"` prints, with `ps`. Either way, remove the sandbox by hand once no process holds a file in it, and never stop the live daemon. `the block's variables are missing` means its lines ran in separate shells, so rerun the whole block in one shell. `live generation file CHANGED` does not always mean the sandbox. The live advisor also rewrites that file when it starts, stops, scans, rebuilds or reindexes, and it reindexes about three seconds after any skill file it watches changes, with the reason `advisor-server-watcher-reindex`. So another session's edit during the run changes it too. Rerun the block while no skill file is being edited, the live advisor keeps its pids and no one runs a skill-graph scan or an advisor rebuild. A `CHANGED` line on that quiet rerun points to the sandbox writing live advisor state.

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
