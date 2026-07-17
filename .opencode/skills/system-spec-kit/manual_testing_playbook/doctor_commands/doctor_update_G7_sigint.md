---
title: "DOC-340 -- Doctor update G7 SIGINT"
description: "Manual scenario validating /doctor:update Ctrl-C handling during the memory rebuild step, including snapshot restore and exit 130."
version: 3.6.0.7
id: doctor-commands-doctor-update-g7-sigint
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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

- BLOCKED before executing Command 1 because the scenario requires creating a disposable workspace, but the run constraints allow writes only to this scenario file.
- Scenario text read from this file:
  - Line 13: `This is destructive and requires a disposable workspace. The test is only truthful when a real SQLite rebuild is interrupted and the post-cancel DB is compared against the pre-rebuild baseline.`
  - Line 23: ``- Preconditions: A long-pole full rebuild reaches `memory_index_scan`; snapshots are enabled; the workspace is disposable.``
  - Line 42: `1. Create a disposable workspace with the current spec-kit databases.`
- User constraint for this run: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.`
- Allowed write path for this run: `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor_commands/doctor_update_G7_sigint.md (this file only)`
- Missing precondition: a disposable workspace that can be created or used for the destructive `/doctor:update` SIGINT run without writing any files outside this scenario file.
- `/doctor:update` was not started; no memory rebuild, SIGINT, exit code, state log, or DB checksum comparison was produced.

### Pass / Fail

- **BLOCKED**: Command 1 requires creating a disposable workspace, but this run is constrained to write only this scenario file. The destructive `/doctor:update` SIGINT test cannot truthfully run without that disposable workspace.

### Failure Triage

If exit code is not 130, inspect the YAML Phase 6 SIGINT contract before checking data integrity. If checksums differ, fail with `cancel-restore-mismatch` and inspect snapshot restore ordering for the memory and vector databases. If settle is much longer than expected, compare observed behavior with ADR-001's per-file transaction finding.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
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
- Feature file path: `doctor_commands/doctor_update_G7_sigint.md`
