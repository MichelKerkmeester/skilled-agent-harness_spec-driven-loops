---
title: "DOC-338 -- Doctor update G5 failure injection mid-rebuild"
description: "Manual scenario validating /doctor:update failure handling when SPECKIT_FAIL_STEP=skill-graph injects a synthetic mid-run failure."
version: 3.6.0.7
id: doctor-commands-doctor-update-g5-confirm-failure-injection
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-338 -- Doctor update G5 failure injection mid-rebuild

## 1. OVERVIEW

This scenario validates interactive failure recovery for `/doctor:update`. It injects a synthetic failure at `skill-graph`, then verifies the orchestrator catches the failure, presents the retry/rollback/leave choices, and restores the affected database from the pre-run snapshot when rollback is selected.

This is a destructive rollback scenario. It must run only in a disposable workspace where the affected SQLite database can be compared against a pre-snapshot baseline.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm-mode failure injection with rollback from snapshot.
- Playbook ID: DOC-338.
- Real user request: `Run /doctor:update. We'll force a failure on skill-graph to test rollback.`
- Prompt: `Run /doctor:update. We'll force a failure on skill-graph to test rollback.`
- Preconditions: `SPECKIT_FAIL_STEP=skill-graph` is exported in a disposable workspace and snapshots are enabled.
- Expected execution process: Run `/doctor:update`, approve phases until `skill-graph`, observe injected failure, select rollback, then compare the affected database to the pre-snapshot baseline.
- Expected signals: tier-aware or phase-boundary prompts appear, the injected failure is caught, retry/rollback/leave choices are offered, rollback restores the affected DB, and state log records the rollback.
- Desired user-visible outcome: A rollback verdict proving interactive mode gives the operator a safe recovery choice after a mid-chain failure.
- Pass/fail: PASS if the failure is caught, rollback is offered and selected, and the affected DB matches the snapshot baseline.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:update. We'll force a failure on skill-graph to test rollback.
```

### Commands

1. Create a disposable workspace and confirm the required SQLite DBs exist.
2. Export `SPECKIT_FAIL_STEP=skill-graph` for the command runtime.
3. Record pre-run checksums for every DB in `allowed_targets` that can be affected by rollback.
4. Run `/doctor:update` through the real runtime.
5. Approve prompts through snapshot and dependency execution until the injected `skill-graph` failure fires.
6. Capture the failure prompt and select rollback.
7. Capture the rollback transcript and `.doctor-update.last-run.json`.
8. Compare the affected DB checksum to the pre-run snapshot or copied baseline.
9. Unset `SPECKIT_FAIL_STEP` after the scenario.

### Expected

The command loads `doctor-update.yaml`, snapshots the in-scope SQLite DBs, reaches `skill-graph`, and fails only because `SPECKIT_FAIL_STEP=skill-graph` requested a synthetic failure. Interactive mode offers retry from start, rollback snapshot and exit, or leave as-is. Selecting rollback restores `skill-graph.sqlite` and any downstream affected DBs from snapshots and records final status as rolled back or failed-with-rollback.

### Evidence

- Precondition check: the scenario requires `SPECKIT_FAIL_STEP=skill-graph` to be exported in a disposable workspace. The current workspace is the active repository, not a disposable workspace, and the execution constraints for this run allowed writes only to this scenario file, so a disposable workspace could not be created.

  ```text
  $ pwd
  .
  ```

  ```text
  $ git rev-parse --show-toplevel
  .
  ```

  ```text
  $ printenv SPECKIT_FAIL_STEP
  (no output)
  ```

- The in-scope SQLite DBs exist in the active repository, but running `/doctor:update` here would mutate and roll back these production workspace DBs rather than a disposable copy.

  ```text
  dcb47b324816dce37fe09d591666f9aecc6d278e1c9410efcef676578e99a863  .opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite
  f94ba30ef11a715e9c52df479b1cd303d533a33531e9aa1a150a43c856795190  .opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite
  ```

- The prompt transcript, rollback log entry, snapshot path, `.doctor-update.last-run.json`, and post-rollback checksum comparison were not produced because the destructive scenario was blocked before `/doctor:update` execution by the missing disposable workspace precondition.

### Pass / Fail

- **Pass**: The failure is caught, rollback is offered and selected, and the affected DB matches the snapshot baseline.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If the failure is not injected, verify the runtime propagates `SPECKIT_FAIL_STEP` into the YAML execution environment. If rollback is not offered, inspect `doctor-update.yaml` `failure_options` and Phase 5 failure policy. If checksums differ, treat it as a rollback failure and inspect snapshot restore ordering across the `allowed_targets` DBs.

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
- Playbook ID: DOC-338
- Feature name: Doctor update G5 failure injection mid-rebuild
- Command mode: `/doctor:update`
- YAML asset: `doctor-update.yaml`
- Failure injection: `SPECKIT_FAIL_STEP=skill-graph`
- Runtime policy: Real execution only; rollback must compare real SQLite files.
- Destructive: Yes; disposable workspace only.
- Feature file path: `doctor-commands/doctor-update-g5-confirm-failure-injection.md`
