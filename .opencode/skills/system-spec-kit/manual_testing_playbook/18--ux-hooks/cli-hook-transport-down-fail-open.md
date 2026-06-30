---
title: "433 -- CLI Hook Transport-Down Fail-Open"
description: "Manual check that prompt-time hooks with warm-only CLI fallback fail open fast (exit 0, no daemon spawn, no prompt blocking) when the daemon socket is absent."
version: 3.6.0.1
---

# 433 -- CLI Hook Transport-Down Fail-Open

## 1. OVERVIEW

This scenario verifies the transport-down behavior of the 028 runtime hook integrations. Prompt-time hooks (Claude session-prime / compact-inject / session-stop, OpenCode session-start, and the Claude/OpenCode skill-advisor user-prompt-submit hooks) use warm-only CLI fallback helpers that probe the daemon socket first. When no socket exists, the hook fails open: it exits 0 quickly (measured around 1 ms for the probe itself), omits the CLI-backed extras, never blocks the prompt, and never cold-spawns a daemon from the prompt path.

The check drives compiled hook scripts directly with a sandbox socket directory, so the no-socket path is deterministic and host daemons are never contacted.

## 2. SCENARIO CONTRACT

- Objective: Confirm hooks exit 0 fast with an absent socket and spawn nothing.
- Real user request: `If the memory daemon is down when I submit a prompt, does my prompt hang or fail?`
- Prompt: `Validate hook transport-down fail-open: absent socket, exit 0, fast return, zero spawned launchers.`
- Expected execution process: Point `SPECKIT_IPC_SOCKET_DIR` at an empty sandbox, pipe a minimal hook payload into the compiled hook scripts under a generous timeout, and capture exit codes, wall time, and launcher process counts.
- Expected signals: Exit 0 from each hook in well under the timeout; launcher count unchanged; empty sandbox socket dir afterward.
- Desired user-visible outcome: A down transport degrades hook output, never the prompt.
- Pass/fail: PASS only when every hook exits 0 without spawning anything.

## 3. TEST EXECUTION

### Prompt

```text
Validate hook transport-down fail-open: absent socket, exit 0, fast return, zero spawned launchers.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0
BEFORE=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)

echo '{"session_id":"playbook-433","hook_event_name":"UserPromptSubmit","prompt":"hello"}' \
  | gtimeout 20 node .opencode/skills/system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js >/dev/null; echo "advisor-hook exit=$?"

echo '{"session_id":"playbook-433","source":"startup","hook_event_name":"SessionStart"}' \
  | gtimeout 30 node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js >/dev/null; echo "session-prime exit=$?"

AFTER=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)
echo "launchers before=$BEFORE after=$AFTER"
ls "$SANDBOX/sock" 2>/dev/null || echo "socket dir empty/absent"
rm -rf "$SANDBOX"
```

### Expected

- Both hooks exit 0 well inside their timeouts (the advisor hook returns in well under a second on the no-socket path).
- `before` and `after` launcher counts are identical — no prompt-time cold spawn.
- No `daemon-ipc.sock` appears in the sandbox.

### Evidence

Shell transcript with both exit codes, the launcher counts, and the socket-dir listing. Optionally wrap each hook call in `time` to record the fail-open latency.

### Pass / Fail

- **Pass**: both hooks exit 0, nothing spawned, no socket created.
- **Fail**: a hook exits non-zero, hits the timeout, or a launcher/daemon appears.

### Failure Triage

A timeout means the hook attempted a non-warm-only call or the probe timeout regressed — inspect the warm-only helper invocation in the hook adapter. A spawned launcher means the fallback helper lost its warm-only flag. A non-zero exit contradicts the fail-open contract: hooks must degrade output, not fail the prompt.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/16--tooling-and-scripts/cli-runtime-warm-only-fallbacks.md` | Feature-catalog source for the warm-only hook fallbacks |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/hooks/spec-memory-cli-fallback.ts` | Shared warm-only spec-memory CLI fallback helper |
| `mcp_server/hooks/code-index-cli-fallback.ts` | Shared warm-only code-index CLI fallback helper |
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Shared warm-only skill-advisor CLI fallback helper |
| `mcp_server/hooks/claude/session-prime.ts` | Claude session adapter using the warm paths |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Claude advisor hook using the fallback |
| `.opencode/skills/system-skill-advisor/hooks/opencode/user-prompt-submit.ts` | OpenCode advisor hook using the fallback |

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 433
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/cli-hook-transport-down-fail-open.md`
