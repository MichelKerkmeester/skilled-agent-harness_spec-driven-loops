---
title: "EX-042 -- Checkpoint v2 .needs-rebuild self-heal (boot / scan-lease)"
description: "This scenario validates the post-restore .needs-rebuild sentinel self-heal for `EX-042`. It focuses on the sentinel being written when derived artifacts go stale after a v2 restore, and repaired at boot and during a leased index scan."
version: 3.6.0.2
id: lifecycle-checkpoint-v2-needs-rebuild-self-heal
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# EX-042 -- Checkpoint v2 .needs-rebuild self-heal (boot / scan-lease)

## 1. OVERVIEW

This scenario validates the `.needs-rebuild` sentinel self-heal for `EX-042`. After a v2 checkpoint restore, the derived artifacts (FTS, communities, entities, degree snapshots, lineage) can be stale relative to the swapped-in snapshot. A `.needs-rebuild` sentinel marks that staleness so the daemon repairs it deterministically rather than serving a half-rebuilt index.

The sentinel is repaired at two entry points: at daemon boot, and during a `memory_index_scan` after the scan lease is acquired. The user-observable value is that an operator who restores a snapshot does not have to manually trigger every derived rebuild — the next boot or scan converges the index and clears the sentinel.

> **Sandbox-only.** This scenario depends on a v2 restore (see `EX-037`). Run it against a disposable copy of the database.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the `.needs-rebuild` sentinel self-heal at boot and during a leased scan.
- Real user request: `After I restored a checkpoint the search results looked stale. Does the system rebuild derived data on its own, or do I have to?`
- Prompt: `Validate the .needs-rebuild self-heal: confirm the sentinel is repaired at daemon boot and during a memory_index_scan after the scan lease is acquired, and that a successful repair clears the sentinel. Return a concise pass/fail verdict with cited field names.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `repairNeedsRebuildSentinel` reports `sentinelPresent`, `attempted`, `completed`, `failed`, `skipped`, and `cleared`; a successful repair clears the sentinel; the scan response surfaces the repair counts.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the sentinel is repaired and cleared at boot and via a leased scan without manual rebuild steps.

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, validate the boot-time .needs-rebuild repair against a daemon start with a sentinel present. Verify the boot path calls repairNeedsRebuildSentinel and clears the sentinel on a successful rebuild. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. With a sandbox DB that has a `.needs-rebuild` sentinel under the checkpoints directory, start the daemon.
2. Capture the boot log line reporting the checkpoint derived-rebuild repair (`completed`, `failed`, `skipped`).
3. Confirm the sentinel is cleared after a successful repair.

### Expected

At boot, the server runs `runCheckpointNeedsRebuildRepair`, which calls `repairNeedsRebuildSentinel`; on a successful rebuild the sentinel is cleared and the boot log reports `completed` with `failed=0`.

### Evidence

Boot transcript showing the repair summary and the cleared sentinel.

### Pass / Fail

- **Pass**: boot repairs and clears the sentinel with `failed=0`
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `runCheckpointNeedsRebuildRepair` in `mcp-server/context-server.ts` and `repairNeedsRebuildSentinel` in `mcp-server/lib/storage/checkpoints.ts` if the sentinel survives a successful boot rebuild.

---

### Prompt

```
As a lifecycle validation operator, validate the scan-lease .needs-rebuild repair against memory_index_scan with a sentinel present. Verify the scan acquires its lease, runs the sentinel repair, and surfaces the repair counts (completed, failed, skipped, cleared) in the response. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. With a sandbox DB that has a `.needs-rebuild` sentinel, run memory_index_scan(force:false).
2. Confirm the scan first acquires the scan lease, then runs the checkpoint sentinel repair.
3. Capture the repair counts in the scan response (`sentinelPresent`, `attempted`, `completed`, `failed`, `skipped`, `cleared`).

### Expected

The scan reserves `scan_started_at` via `acquireIndexScanLease`, then runs `runCheckpointNeedsRebuildRepairForScan` (source `memory_index_scan`); the response carries the repair counts and `cleared:true` on success.

### Evidence

Scan transcript showing lease acquisition followed by the repair counts.

### Pass / Fail

- **Pass**: the leased scan runs the repair and reports the repair counts with `cleared:true` on success
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `runCheckpointNeedsRebuildRepairForScan` in `mcp-server/handlers/memory-index.ts` (called after `acquireIndexScanLease`) if the repair never runs or the counts are missing.

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Sentinel repair: `mcp-server/lib/storage/checkpoints.ts` (`repairNeedsRebuildSentinel`, `NEEDS_REBUILD_SENTINEL_NAME`)
- Boot entry point: `mcp-server/context-server.ts` (`runCheckpointNeedsRebuildRepair`)
- Scan entry point: `mcp-server/handlers/memory-index.ts` (`runCheckpointNeedsRebuildRepairForScan`, after `acquireIndexScanLease`)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-042
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `lifecycle/checkpoint-v2-needs-rebuild-self-heal.md`
- Source anchors read: `mcp-server/lib/storage/checkpoints.ts` (`NEEDS_REBUILD_SENTINEL_NAME` ~L118, `repairNeedsRebuildSentinel` ~L1930); `mcp-server/context-server.ts` (`runCheckpointNeedsRebuildRepair` ~L427); `mcp-server/handlers/memory-index.ts` (`runCheckpointNeedsRebuildRepairForScan` ~L214, lease at ~L351, repair after lease ~L383)
- Destructive: No mutation beyond the sandbox rebuild; sandbox-only because it depends on a prior restore.
- Runtime policy: Real execution only; no mocked rebuild.
