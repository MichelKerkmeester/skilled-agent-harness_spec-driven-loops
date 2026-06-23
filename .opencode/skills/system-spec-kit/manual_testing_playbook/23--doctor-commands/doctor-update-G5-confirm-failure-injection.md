---
title: "DOC-338 -- Doctor update G5 failure injection mid-rebuild"
description: "Manual scenario validating /doctor:update failure handling when SPECKIT_FAIL_STEP=causal-edges-init injects a synthetic mid-run failure."
version: 3.6.0.7
---

# DOC-338 -- Doctor update G5 failure injection mid-rebuild

## 1. OVERVIEW

This scenario validates interactive failure recovery for `/doctor:update`. It injects a synthetic failure at `causal-edges-init`, then verifies the orchestrator catches the failure, presents the retry/rollback/leave choices, and restores the affected database from the pre-run snapshot when rollback is selected.

This is a destructive rollback scenario. It must run only in a disposable workspace where the affected SQLite database can be compared against a pre-snapshot baseline.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm-mode failure injection with rollback from snapshot.
- Playbook ID: DOC-338.
- Real user request: `Run /doctor:update. We'll force a failure on causal-edges-init to test rollback.`
- Prompt: `Run /doctor:update. We'll force a failure on causal-edges-init to test rollback.`
- Preconditions: `SPECKIT_FAIL_STEP=causal-edges-init` is exported in a disposable workspace and snapshots are enabled.
- Expected execution process: Run `/doctor:update`, approve phases until `causal-edges-init`, observe injected failure, select rollback, then compare the affected database to the pre-snapshot baseline.
- Expected signals: tier-aware or phase-boundary prompts appear, the injected failure is caught, retry/rollback/leave choices are offered, rollback restores the affected DB, and state log records the rollback.
- Desired user-visible outcome: A rollback verdict proving interactive mode gives the operator a safe recovery choice after a mid-chain failure.
- Pass/fail: PASS if the failure is caught, rollback is offered and selected, and the affected DB matches the snapshot baseline.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:update. We'll force a failure on causal-edges-init to test rollback.
```

### Commands

1. Create a disposable workspace and confirm the required SQLite DBs exist.
2. Export `SPECKIT_FAIL_STEP=causal-edges-init` for the command runtime.
3. Record pre-run checksums for the active resolved profile Memory MCP database and downstream DBs that can be affected by rollback.
4. Run `/doctor:update` through the real runtime.
5. Approve prompts through snapshot and dependency execution until the injected `causal-edges-init` failure fires.
6. Capture the failure prompt and select rollback.
7. Capture the rollback transcript and `.doctor-update.last-run.json`.
8. Compare the affected DB checksum to the pre-run snapshot or copied baseline.
9. Unset `SPECKIT_FAIL_STEP` after the scenario.

### Expected

The command loads `doctor_update.yaml`, snapshots the in-scope SQLite DBs, reaches `causal-edges-init`, and fails only because `SPECKIT_FAIL_STEP=causal-edges-init` requested a synthetic failure. Interactive mode offers retry from start, rollback snapshot and exit, or leave as-is. Selecting rollback restores the active resolved profile Memory MCP database and any downstream affected DBs from snapshots and records final status as rolled back or failed-with-rollback.

### Evidence

- Environment transcript showing `SPECKIT_FAIL_STEP=causal-edges-init`.
- Prompt transcript showing phase approvals and retry/rollback/leave choices.
- Rollback log entry and state log final status.
- Snapshot path for the affected DB.
- Pre-run and post-rollback checksum comparison proving the affected DB matches the baseline.

### Pass / Fail

- **PASS**: the synthetic failure is caught, interactive mode offers retry/rollback/leave, rollback is selected, the affected DB matches the snapshot baseline, and the state log records rollback.
- **FAIL**: the failure crashes the runtime, no rollback choice appears, rollback is skipped, the affected DB differs from baseline, or the state log omits the failure.
- **SKIP**: failure injection support is unavailable in the current runtime build.
- **UNAUTOMATABLE**: no disposable workspace can safely run a mutating interactive rollback test.

### Failure Triage

If the failure is not injected, verify the runtime propagates `SPECKIT_FAIL_STEP` into the YAML execution environment. If rollback is not offered, inspect `doctor_update.yaml` `failure_options` and Phase 5 failure policy. If checksums differ, treat it as a rollback failure and inspect snapshot restore ordering for the active resolved profile Memory MCP database and downstream DBs.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-338
- Feature name: Doctor update G5 failure injection mid-rebuild
- Command mode: `/doctor:update`
- YAML asset: `doctor_update.yaml`
- Failure injection: `SPECKIT_FAIL_STEP=causal-edges-init`
- Runtime policy: Real execution only; rollback must compare real SQLite files.
- Destructive: Yes; disposable workspace only.
- Feature file path: `23--doctor-commands/doctor-update-G5-confirm-failure-injection.md`
