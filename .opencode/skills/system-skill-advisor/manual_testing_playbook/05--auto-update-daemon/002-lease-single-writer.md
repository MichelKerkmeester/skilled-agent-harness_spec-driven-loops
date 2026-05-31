---
title: "AU-002 Workspace Single-Writer Lease"
description: "Manual validation that the SQLite-backed workspace lease prevents concurrent daemon writes and reclaims stale leases through heartbeat expiry."
trigger_phrases:
  - "au-002"
  - "single writer lease"
  - "daemon lease heartbeat"
  - "lease reclaim stale"
---

# AU-002 Workspace Single-Writer Lease

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that only one daemon holds the workspace lease at a time and that a stale lease is reclaimed after heartbeat expiry per `lib/daemon/lease.ts`.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy so concurrent launches do not pollute the real DB.
- MCP server built.
- Two shells available to launch separate daemon processes.
- Operator can read `advisor_status` output without affecting the daemon lease.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. In shell A, trigger a daemon bring-up via an MCP status call:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

2. Capture the `trustState` and `lastScanAt` timestamp.
3. In shell B, attempt a second concurrent bring-up against the same workspace root with `advisor_status`.
4. Kill shell A's daemon process without allowing graceful shutdown (simulate crash).
5. Wait at least 90 seconds so the heartbeat ages beyond the reclaim threshold.
6. In shell B, call `advisor_status` again.

### Expected Signals

- Step 3 concurrent call returns trust metadata consistent with a single owner. No two writers advance generation at the same timestamp.
- Step 6 call after stale heartbeat succeeds and the new daemon acquires the lease.
- `trustState.state` transitions from `stale` or `absent` back to `live` after reclaim.
- No raw prompt text or workspace paths other than the documented `workspaceRoot` appear in diagnostics.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Duplicate writers | Generation advances twice with near-identical timestamps | Inspect `lib/daemon/lease.ts` acquire path and heartbeat table. |
| Stale lease never reclaimed | Shell B remains `absent` after 90s | Verify heartbeat TTL and reclaim interval in `lease.ts`. |
| Lease corruption | Daemon crashes on acquire | Treat as HALT. Quarantine DB and run rebuild-from-source per OP-003. |

---

## 4. SOURCE FILES

- Scenario [AU-003](./003-daemon-lifecycle-shutdown.md), graceful shutdown and SIGTERM.
- Scenario [OP-003](../04--operator-h5/003-unavailable-daemon.md), recovery from unreadable DB.
- Feature [`01--daemon-and-freshness/002-lease.md`](../../feature_catalog/01--daemon-and-freshness/002-lease.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 05--auto-update-daemon/002-lease-single-writer.md
