---
title: "AU-003 Daemon Lifecycle and SIGTERM"
description: "Manual validation that daemon boot, health reporting and SIGTERM shutdown behave as documented in lib/daemon/lifecycle.ts."
trigger_phrases:
  - "au-003"
  - "daemon lifecycle"
  - "sigterm shutdown"
  - "daemon health"
version: 0.8.0.14
---

# AU-003 Daemon Lifecycle and SIGTERM

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate graceful boot, health reporting, SIGTERM-based shutdown and launcher idle-timeout discoverability for the advisor daemon in `lib/daemon/lifecycle.ts`.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy or isolated MCP server process.
- Operator can send signals to the daemon PID.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.
- Log capture enabled.
- `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` can be set in the isolated process environment for idle-timeout checks.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Bring the daemon up:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

2. Capture PID, generation, `skillCount` and `trustState` from the response.
3. Send SIGTERM to the daemon process:

```bash
kill -TERM <daemon_pid>
```

4. After shutdown completes, re-run `advisor_status` to force a fresh boot.
5. Compare `skillCount` and `generation` against the pre-shutdown capture.
6. In a separate isolated process, set `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.02` and verify the launcher-idle-timeout test or manual process exits after inactivity. Then repeat with `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0` and confirm the idle monitor is disabled.

### Expected Signals

- Step 1 response includes populated `generation`, `skillCount` and `trustState.state = "live"` or `"stale"`.
- SIGTERM triggers graceful shutdown. No stack trace in stderr.
- Post-restart status matches pre-shutdown `skillCount` (same skills visible) and `generation` is at least equal to the prior value.
- No raw prompt text in lifecycle logs.
- Idle timeout setting is discoverable in the README/config docs, fractional values are accepted for tests, and `0` disables the monitor.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| SIGTERM ignored | Process survives signal | Inspect `lib/daemon/lifecycle.ts` signal handlers. |
| Fresh boot reports lower skillCount | Skills missing after restart | Confirm source discovery in `lifecycle.ts`. Check for source-cache corruption. |
| Stack trace on shutdown | Stderr contains unhandled rejection | Block release. Investigate teardown path. |
| Idle timeout kills active IPC client | Active secondary client exits during activity | Inspect `mcp_server/lib/ipc/socket-server.ts` activity callbacks. |

---

## 4. SOURCE FILES

- Scenario [AU-002](./lease-single-writer.md), single-writer lease reclaim.
- Scenario [OP-001](../04--operator-h5/degraded-daemon.md), degraded state detection.
- Feature [`01--daemon-and-freshness/lifecycle.md`](../../feature_catalog/01--daemon-and-freshness/lifecycle.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lifecycle.ts`.
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/launcher-idle-timeout.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: 05--auto-update-daemon/daemon-lifecycle-shutdown.md
