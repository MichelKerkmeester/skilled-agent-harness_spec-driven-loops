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

- Objective: SIGINT cancellation during the `/doctor:update` long-pole rebuild step.
- Playbook ID: DOC-340.
- Real user request: `Start /doctor:update, then Ctrl-C ~30 sec into the long-pole rebuild step.`
- Prompt: `Start /doctor:update, then Ctrl-C ~30 sec into the long-pole rebuild step.`
- Preconditions: A long-pole full rebuild reaches the advisor skill-graph rebuild, the longest surviving step in the manifest; snapshots are enabled; the workspace is disposable.
- Expected execution process: Record pre-run checksums, start `/doctor:update`, send SIGINT during the long-pole rebuild, wait for settle and restore, then compare DB checksums and exit code.
- Expected signals: SIGINT caught at orchestrator, current SQLite transaction settles in roughly 5 seconds per ADR-001, in-flight snapshot restored, state log written, and process exits 130.
- Desired user-visible outcome: A cancellation verdict proving no half-rebuilt database remains after Ctrl-C.
- Pass/fail: PASS only when exit code is 130 and the affected DB matches the pre-rebuild snapshot or copied baseline.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Start /doctor:update, then Ctrl-C ~30 sec into the long-pole rebuild step.
```

### Commands

1. Create a disposable workspace with the current spec-kit databases.
2. Confirm snapshots are enabled and record pre-run checksums for every database the manifest declares as a rebuild target.
3. Run `/doctor:update` through the real runtime.
4. Wait until the run enters its declared long-pole step.
5. Send Ctrl-C roughly 30 seconds into that step.
6. Wait for the command to settle and record whether restore finishes after the ADR-001 settle window.
7. Capture the process exit code.
8. Recompute affected DB checksums and compare them to the pre-run baseline or restored snapshot.
9. Capture `.doctor-update.last-run.json`.

### Expected

The command loads `doctor-update.yaml`, skips the status decision gate, begins the dependency chain, and catches SIGINT during the memory rebuild. The orchestrator sets the cancel flag, allows the in-flight SQLite transaction to commit or abort cleanly within roughly 5 seconds, restores the in-flight DB snapshot, writes a cancellation state log, releases the flock, and exits 130.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Exit code is 130 and the affected DB matches the pre-rebuild snapshot or copied baseline.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If exit code is not 130, inspect the YAML Phase 6 SIGINT contract before checking data integrity. If checksums differ, fail with `cancel-restore-mismatch` and inspect snapshot restore ordering for the restored artifacts. If settle is much longer than expected, compare observed behavior with ADR-001's per-file transaction finding.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor-update.yaml](../../../../commands/doctor/assets/doctor-update.yaml)
- Migration manifest: [specs/system-speckit/026-graph-and-context-optimization/.../scratch/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-340
- Feature name: Doctor update G7 SIGINT
- Command mode: `/doctor:update`
- YAML asset: `doctor-update.yaml`
- Cancellation policy: ADR-001 plus ADR-007, exit 130.
- Runtime policy: Real interrupted rebuild only; no mocked signal handling.
- Destructive: Yes; disposable workspace only.
- Feature file path: `doctor-commands/doctor-update-g7-sigint.md`
