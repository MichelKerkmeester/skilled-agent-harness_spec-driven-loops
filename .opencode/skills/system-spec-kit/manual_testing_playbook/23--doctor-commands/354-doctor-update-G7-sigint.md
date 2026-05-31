---
title: "DOC-340 -- Doctor update G7 SIGINT"
description: "Manual scenario validating /doctor:update Ctrl-C handling during the memory rebuild step, including snapshot restore and exit 130."
---

# DOC-340 -- Doctor update G7 SIGINT

## 1. OVERVIEW

This scenario validates graceful cancellation for the unified `/doctor:update` full-chain workflow. It starts the long-pole memory rebuild, sends Ctrl-C roughly 30 seconds into that step, and verifies the orchestrator restores the in-flight database snapshot, writes cancellation state, and exits 130.

This is destructive and requires a disposable workspace. The test is only truthful when a real SQLite rebuild is interrupted and the post-cancel DB is compared against the pre-rebuild baseline.

---

## 2. SCENARIO CONTRACT

- Objective: SIGINT cancellation during `/doctor:update` memory rebuild.
- Playbook ID: DOC-340.
- Real user request: `Start /doctor:update, then Ctrl-C ~30 sec into the memory rebuild step.`
- Prompt: `Start /doctor:update, then Ctrl-C ~30 sec into the memory rebuild step.`
- Preconditions: A long-pole full rebuild reaches `memory_index_scan`; snapshots are enabled; the workspace is disposable.
- Expected execution process: Record pre-run checksums, start `/doctor:update`, send SIGINT during the memory rebuild, wait for settle and restore, then compare DB checksums and exit code.
- Expected signals: SIGINT caught at orchestrator, current SQLite transaction settles in roughly 5 seconds per ADR-001, in-flight snapshot restored, state log written, and process exits 130.
- Desired user-visible outcome: A cancellation verdict proving no half-rebuilt memory database remains after Ctrl-C.
- Pass/fail: PASS only when exit code is 130 and the affected DB matches the pre-rebuild snapshot or copied baseline.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Start /doctor:update, then Ctrl-C ~30 sec into the memory rebuild step.
```

### Commands

1. Create a disposable workspace with the current spec-kit databases.
2. Confirm snapshots are enabled and record pre-run checksums for the active resolved profile Memory MCP database and the vector index database.
3. Run `/doctor:update` through the real runtime.
4. Wait until Phase 5 enters `context-index` or `memory_index_scan({ incremental: false, force: true })`.
5. Send Ctrl-C roughly 30 seconds into the memory rebuild step.
6. Wait for the command to settle and record whether restore finishes after the ADR-001 settle window.
7. Capture the process exit code.
8. Recompute affected DB checksums and compare them to the pre-run baseline or restored snapshot.
9. Capture `.doctor-update.last-run.json`.

### Expected

The command loads `doctor_update.yaml`, skips the status decision gate, begins the dependency chain, and catches SIGINT during the memory rebuild. The orchestrator sets the cancel flag, allows the in-flight SQLite transaction to commit or abort cleanly within roughly 5 seconds, restores the in-flight DB snapshot, writes a cancellation state log, releases the flock, and exits 130.

### Evidence

- Pre-run checksums for the active resolved profile Memory MCP database and the vector DB.
- Transcript showing `/doctor:update` entered the memory rebuild step.
- Transcript showing Ctrl-C was sent and SIGINT handling ran.
- State log with cancellation timestamp, rollback reason, snapshot path, and final status cancelled.
- Exit code `130`.
- Post-cancel DB checksums matching the pre-run baseline or snapshot.

### Pass / Fail

- **PASS**: SIGINT is caught, restore completes, exit code is 130, state log records cancellation, and affected DB checksums match the baseline.
- **FAIL**: SIGINT kills the process without orchestrator handling, exit code is not 130, no snapshot is restored, state log is missing, or the DB is left half-rebuilt.
- **SKIP**: no long-pole rebuild can be reached in the disposable workspace.
- **UNAUTOMATABLE**: the runtime cannot send a real Ctrl-C to a running `/doctor:update` process.

### Failure Triage

If exit code is not 130, inspect the YAML Phase 6 SIGINT contract before checking data integrity. If checksums differ, fail with `cancel-restore-mismatch` and inspect snapshot restore ordering for the memory and vector databases. If settle is much longer than expected, compare observed behavior with ADR-001's per-file transaction finding.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../mcp_server/database/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-340
- Feature name: Doctor update G7 SIGINT
- Command mode: `/doctor:update`
- YAML asset: `doctor_update.yaml`
- Cancellation policy: ADR-001 plus ADR-007, exit 130.
- Runtime policy: Real interrupted rebuild only; no mocked signal handling.
- Destructive: Yes; disposable workspace only.
- Feature file path: `23--doctor-commands/354-doctor-update-G7-sigint.md`
