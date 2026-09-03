---
title: "428 -- CLI Warm-Only No-Spawn Behavior"
description: "Manual check that a --warm-only CLI call against an absent daemon socket exits 75 with a backend-unavailable error and never cold-spawns a launcher or daemon."
version: 4.0.0.0
id: tooling-and-scripts-cli-warm-only-no-spawn
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 428 -- CLI Warm-Only No-Spawn Behavior

## 1. OVERVIEW

This scenario verifies the warm-only contract all prompt-time hook integrations rely on: a `--warm-only` CLI call probes the daemon socket first and, when no daemon is reachable, exits 75 (`EXIT_RETRYABLE`) with a `backend unavailable` error instead of auto-spawning the launcher. The sandbox uses a fresh empty socket directory, so the probe always misses and the no-spawn invariant is directly observable — the socket directory must stay empty after the calls.

`SYSTEM_SKILL_ADVISOR_CLI_WARM_ONLY` / `SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY` set the default and `--no-warm-only` re-enables auto-spawn per call. The `spec-memory` and `code-index` CLIs that shared this contract were removed with their servers, so the advisor is the only consumer left.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a warm-only call against an absent socket exits 75 fast and spawns nothing.
- Real user request: `When my prompt-time hook probes the advisor daemon and it is down, does anything heavy get booted on the prompt path?`
- Prompt: `Validate that --warm-only CLI calls exit 75 with backend unavailable and never spawn a daemon when the socket directory is empty.`
- Expected execution process: Point `SPECKIT_IPC_SOCKET_DIR` at a fresh temp directory, run one warm-only read call, capture the exit code, and verify the socket directory holds no socket and no launcher processes were created.
- Expected signals: Exit 75 from the call; JSON error payload contains `backend unavailable`; `$SANDBOX/sock` contains no `daemon-ipc.sock`; launcher process count unchanged.
- Desired user-visible outcome: Transport-down probes cost a failed connect, not a daemon boot.
- Pass/fail: PASS only when the warm-only call exits 75 and nothing was spawned.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate that --warm-only CLI calls exit 75 with backend unavailable and never spawn a daemon when the socket directory is empty.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0
BEFORE=$(pgrep -f "mk-skill-advisor-launcher" | wc -l)

node .opencode/bin/skill-advisor.cjs advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 --format json; echo "skill-advisor exit=$?"

AFTER=$(pgrep -f "mk-skill-advisor-launcher" | wc -l)
echo "launchers before=$BEFORE after=$AFTER"
ls -la "$SANDBOX/sock" 2>/dev/null || echo "no socket dir contents"
rm -rf "$SANDBOX"
```

### Expected

- The call prints a JSON envelope with `"status": "error"`, an error containing `backend unavailable`, `"exitCode": 75`, and the shell reports `exit=75`.
- `before` and `after` launcher counts are identical (zero new spawns).
- The sandbox socket directory contains no `daemon-ipc.sock`.

### Evidence

The recorded transcript for this scenario predates the memory decommission: two of its three
calls targeted the `spec-memory` and `code-index` shims, and the `spec-memory` call exited 69 on
a stale dist rather than 75. It was removed rather than reinterpreted. Re-execute the Commands
block against the advisor CLI and capture the transcript here before this scenario carries a
verdict again.

### Pass / Fail

- **SKIP**: the scenario was rewired from three CLIs to the one that survives and has not been
  re-executed. The blocker is a missing run, not a product defect.

### Failure Triage

An exit 0 means the call reached a daemon — check that `SPECKIT_IPC_SOCKET_DIR` was exported into the call's environment. A spawn means warm-only resolution failed: confirm the `--warm-only` flag parse and the `defaultWarmOnly()` env resolution in the CLI entrypoint. A hang points at the probe timeout path (`--timeout-ms`).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md` | Feature-catalog source for the warm-only contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` | `ensureDaemonReady` warm-only branch throwing the retryable error |
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Hook helper relying on this contract |

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 428
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/cli-warm-only-no-spawn.md`
