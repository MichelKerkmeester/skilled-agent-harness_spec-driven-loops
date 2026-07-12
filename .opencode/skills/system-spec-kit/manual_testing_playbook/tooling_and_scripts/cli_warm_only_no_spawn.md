---
title: "428 -- CLI Warm-Only No-Spawn Behavior"
description: "Manual check that --warm-only CLI calls against an absent daemon socket exit 75 with a backend-unavailable error and never cold-spawn a launcher or daemon."
version: 3.6.0.1
---

# 428 -- CLI Warm-Only No-Spawn Behavior

## 1. OVERVIEW

This scenario verifies the warm-only contract all prompt-time hook integrations rely on: a `--warm-only` CLI call probes the daemon socket first and, when no daemon is reachable, exits 75 (`EXIT_RETRYABLE`) with a `backend unavailable` error instead of auto-spawning the launcher. The sandbox uses a fresh empty socket directory, so the probe always misses and the no-spawn invariant is directly observable — the socket directory must stay empty after the calls.

All three CLIs share the contract (`SPECKIT_SPEC_MEMORY_CLI_WARM_ONLY`, `SPECKIT_CODE_INDEX_CLI_WARM_ONLY`, and `MK_SKILL_ADVISOR_CLI_WARM_ONLY` / `SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY` set the default; `--no-warm-only` re-enables auto-spawn per call).

## 2. SCENARIO CONTRACT

- Objective: Confirm warm-only calls against an absent socket exit 75 fast and spawn nothing.
- Real user request: `When my prompt-time hook probes the memory daemon and it is down, does anything heavy get booted on the prompt path?`
- Prompt: `Validate that --warm-only CLI calls exit 75 with backend unavailable and never spawn a daemon when the socket directory is empty.`
- Expected execution process: Point `SPECKIT_IPC_SOCKET_DIR` at a fresh temp directory, run one warm-only read call per CLI, capture exit codes, and verify the socket directory holds no socket and no launcher processes were created.
- Expected signals: Exit 75 from all three calls; JSON error payload contains `backend unavailable`; `$SANDBOX/sock` contains no `daemon-ipc.sock`; launcher process count unchanged.
- Desired user-visible outcome: Transport-down probes cost a failed connect, not a daemon boot.
- Pass/fail: PASS only when every warm-only call exits 75 and nothing was spawned.

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
BEFORE=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)

node .opencode/bin/spec-memory.cjs memory_stats --warm-only --timeout-ms 3000 --format json; echo "spec-memory exit=$?"
node .opencode/bin/code-index.cjs code_graph_status --warm-only --timeout-ms 3000 --format json; echo "code-index exit=$?"
node .opencode/bin/skill-advisor.cjs advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 --format json; echo "skill-advisor exit=$?"

AFTER=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)
echo "launchers before=$BEFORE after=$AFTER"
ls -la "$SANDBOX/sock" 2>/dev/null || echo "no socket dir contents"
rm -rf "$SANDBOX"
```

### Expected

- All three calls print a JSON envelope with `"status": "error"`, an error containing `backend unavailable`, `"exitCode": 75`, and the shell reports `exit=75`.
- `before` and `after` launcher counts are identical (zero new spawns).
- The sandbox socket directory contains no `daemon-ipc.sock`.

### Evidence

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
spec-memory exit=69
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/cli-playbook.Xrl7rt/sock/daemon-ipc.sock",
  "exitCode": 75
}
code-index exit=75
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/cli-playbook.Xrl7rt/sock/daemon-ipc.sock",
  "exitCode": 75
}
skill-advisor exit=75
launchers before=      11 after=      11
total 0
drwx------@ 2 michelkerkmeester  wheel  64 Jul  2 22:54 .
drwx------@ 3 michelkerkmeester  wheel  96 Jul  2 22:54 ..
```

### Pass / Fail

- **FAIL**: `spec-memory` exited 69 with `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build` instead of shell exit 75, so the scenario did not satisfy the all-three-calls exit-75 requirement; launcher counts stayed unchanged at 11 and no `daemon-ipc.sock` appeared in the sandbox socket directory.

### Failure Triage

An exit 0 means the call reached a daemon — check that `SPECKIT_IPC_SOCKET_DIR` was exported into the call's environment. A spawn means warm-only resolution failed: confirm the `--warm-only` flag parse and the `defaultWarmOnly()` env resolution in the CLI entrypoint. A hang points at the probe timeout path (`--timeout-ms`).

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md` | Feature-catalog source for the warm-only contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/spec-memory-cli.ts` | `ensureDaemonReady` warm-only branch throwing the retryable error |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | code-index warm-only branch |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | skill-advisor warm-only branch |
| `mcp_server/hooks/spec-memory-cli-fallback.ts` | Hook helper relying on this contract |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 428
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/cli_warm_only_no_spawn.md`
