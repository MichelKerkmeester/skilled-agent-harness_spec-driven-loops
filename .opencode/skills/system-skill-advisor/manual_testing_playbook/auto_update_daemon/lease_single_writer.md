---
title: "AU-002 Workspace Single-Writer Lease"
description: "Manual validation that the SQLite-backed workspace lease prevents concurrent daemon writes and reclaims stale leases through heartbeat expiry."
trigger_phrases:
  - "au-002"
  - "single writer lease"
  - "daemon lease heartbeat"
  - "lease reclaim stale"
version: 0.8.0.14
id: AU-002
category: auto_update_daemon
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/runtime/daemon_lease_contract.md
---

# AU-002 Workspace Single-Writer Lease

Prompt: Manual validation that the SQLite-backed workspace lease prevents concurrent daemon writes and reclaims stale leases through heartbeat expiry.


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

### Evidence

BLOCKED at precondition validation. The scenario requires a disposable workspace copy and specifies the MCP status call with `workspaceRoot` set to `/tmp/path-to-copy`, but that path does not exist in the current environment. Creating a disposable copy would violate this run's allowed write paths, which permit writes only to this scenario file.

Actual file-read output while checking the documented workspace root:

```text
File not found: /tmp/path-to-copy
```

### Pass/Fail

BLOCKED - missing disposable workspace copy at `/tmp/path-to-copy`; scenario commands could not be run without creating files outside the allowed write path.

---

## 4. SOURCE FILES

- Scenario [AU-003](../auto_update_daemon/daemon_lifecycle_shutdown.md), graceful shutdown and SIGTERM.
- Scenario [OP-003](../operator_h5/unavailable_daemon.md), recovery from unreadable DB.
- Feature [`daemon-and-freshness/lease.md`](../../feature_catalog/daemon_and_freshness/lease.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: auto-update-daemon/lease-single-writer.md
