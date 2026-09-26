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

The check drives compiled hook scripts directly with a sandbox socket directory, so host daemons are never contacted.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the advisor hook exits 0 and never blocks the prompt when the daemon socket is absent.
- Real user request: `If the skill-advisor daemon is down when I submit a prompt, does my prompt hang or fail?`
- Prompt: `Validate hook transport-down fail-open: absent socket, exit 0, a status line or brief in every case, never a blocked prompt.`
- Expected execution process: Point `SPECKIT_IPC_SOCKET_DIR` at an empty sandbox and pipe each hook payload into the compiled Claude hook script under `gtimeout`. Run the work payload twice, once with a 300 ms hook budget and once with the default budget. Run the casual payload once. Capture each exit code and the first `additionalContext` line.
- Expected signals: All three runs exit 0. The `short:` first line starts with `Advisor: outage (fail_open); route by hand:`. The `casual:` first line is `Advisor: prompt skipped.` The `default:` first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);`.
- Desired user-visible outcome: Every case keeps the prompt unblocked and shows a status line or a brief.
- Pass/fail: PASS when all three runs exit 0 and each first line matches the expected signals.

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
HOOK=.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js
WORK='{"session_id":"playbook-433","hook_event_name":"UserPromptSubmit","prompt":"help me refactor the advisor hook timeout handling"}'
CASUAL='{"session_id":"playbook-433","hook_event_name":"UserPromptSubmit","prompt":"hello"}'

echo "$WORK" | SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 gtimeout 20 node "$HOOK" > "$SANDBOX/short.json"; echo "short-budget exit=$?"
echo "$WORK" | gtimeout 20 node "$HOOK" > "$SANDBOX/default.json"; echo "default-budget exit=$?"
echo "$CASUAL" | gtimeout 20 node "$HOOK" > "$SANDBOX/casual.json"; echo "casual exit=$?"

for f in short default casual; do
  python3 -c "import json; d=json.load(open('$SANDBOX/$f.json')); print('$f:', d['hookSpecificOutput']['additionalContext'].splitlines()[0])"
done
rm -rf "$SANDBOX"
```

### Expected

- All three runs exit 0.
- The `short:` first line starts with `Advisor: outage (fail_open); route by hand:`.
- The `casual:` first line is `Advisor: prompt skipped.`
- The `default:` first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);`. Which one appears depends on whether the CLI starts a daemon for the sandbox socket in time, whether another daemon holds the workspace lease and whether the local scorer answers first. All three are a pass.

### Evidence

Shell transcript with the three exit codes and the three first lines.

### Pass / Fail

- **Pass**: all three runs exit 0 and each first line matches the expected signals.
- **Fail**: a run exits non-zero, `gtimeout` kills the hook, stdout is empty or the `short:` first line is not the outage line.

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
