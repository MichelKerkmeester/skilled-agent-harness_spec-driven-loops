---
title: "DOC-360 -- Doctor update rollback"
description: "Manual scenario validating that /doctor:update rollback previews the paths recorded by an apply, asks before restoring, restores paths that still match the applied release, and leaves later edits untouched."
version: 1.0.0.0
id: doctor-commands-doctor-update-rollback
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-360 -- Doctor update rollback

## 1. OVERVIEW

This scenario validates the recovery action of `/doctor:update`. After an apply has written `<runDir>/rollback.json`, rollback previews every path the record can restore, asks once before restoring, and reports any path the engine leaves alone because its content changed after the apply. Clearing a stale lock is the only lock write and it needs its own approval. The workflow never calls `git restore` from its own steps.

The scenario prepares a completed apply, records the pre-apply and post-apply content, runs the preview as a dry run, declines the restore once, then approves it and confirms the restored paths return to their pre-apply content, the lock is absent and the state log exists. The copy is discarded at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the applied checkout is restorable from the apply record, the restore is gated by one approval, and paths changed after apply are left unchanged.
- Playbook ID: DOC-360.
- Real user request: `Undo the release update I applied and leave my later edits alone.`
- Prompt: `Undo the release update I applied and leave my later edits alone.`
- Preconditions: A disposable copy with a completed apply that wrote at least one target file and left `<runDir>/rollback.json`, and a runtime that can execute `/doctor:update` with Bash access.
- Expected execution process: Prepare the apply, record the pre-apply and post-apply content of every written path, run the dry-run preview, decline the restore once, approve it, capture the result, confirm the restored content and the lock state, then discard the copy.
- Expected signals: Phase 1 confirms the current directory is inside the repository, the engine exists and a supplied `--run` resolves to a canonical real directory below `.skilled/release/runs`, with symlinked runs rejected. Phase 2 runs `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json --dry-run`. An absent lock continues without unlocking. A running or unreadable lock shows the lock template, leaves the lock in place and stops with `STATUS=FAILED`. A stale lock is cleared only after a separate approval through `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json`, and a declined approval stops with `STATUS=DECLINED` while cancellation stops with `STATUS=CANCELLED ACTION=cancelled`. When no run is supplied and a stale lock names none, the workflow lists the runs below `.skilled/release/runs` that contain `rollback.json`, newest first, and asks the operator to choose. When a stale lock was cleared and its run has no rollback record, the run ends `STATUS=UNLOCKED`. The preview executes `node .skilled/commands/doctor/scripts/release-update.cjs rollback --repo . --run <runDir> --dry-run --json` and shows `Release Rollback Preview` with `Paths to restore` and `Paths to skip` listing every path, and `--dry-run` ends with `STATUS=DRY_RUN` and no state log. The approval prompt is `Restore the displayed paths from this release update?` with `Reply yes to approve the rollback, or no to leave the checkout unchanged.` A `no` makes no engine write and reports `STATUS=DECLINED`. The real rollback executes `node .skilled/commands/doctor/scripts/release-update.cjs rollback --repo . --run <runDir> --json`. Exit 0 means every recorded path was restored. Exit 1 with `ok` false and a non-empty `skipped` array is a partial rollback, not a failure, while exit 1 with an error is a failure. Each skipped path changed after apply, is listed as left unchanged and is never passed to `git restore`. The result block is `Doctor Update Rollback` with `Lock`, `Restored` and `Skipped`, reporting `STATUS=ROLLED_BACK` when every recorded path was restored, the partial status when any path is skipped, or one of `STATUS=UNLOCKED`, `STATUS=DRY_RUN`, `STATUS=DECLINED`, `STATUS=CANCELLED` and `STATUS=FAILED`. The state log `<runDir>/.doctor-update-rollback.last-run.json` carries `lock`, `restored`, `skipped` and `final_status`, and is written on every terminal path except a dry run and a preflight failure. Every restored file returns to its pre-apply content.
- Desired user-visible outcome: A preview that lists every restorable path, one approval prompt, restored content that matches the pre-apply state, and later edits left alone.
- Pass/fail: PASS if the preview lists the recorded paths, the declined approval writes nothing, the approved run restores the paths whose content still matches the applied release, any path changed after apply is left unchanged and reported, and the lock is absent afterward.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Undo the release update I applied and leave my later edits alone.
```

### Commands

1. Create a disposable copy of the repository.
2. Prepare a completed apply. Follow the align and apply flows for one decided unit that writes at least one target file. Record the pre-apply sha256 of each target before the apply and the post-apply sha256 after it, and confirm `<runDir>/rollback.json` exists and names the written paths.
3. Run `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json --dry-run` and confirm the lock is absent.
4. Run `/doctor:update rollback --run=<runDir> --dry-run` and capture the preview. Confirm `STATUS=DRY_RUN`, that `Paths to restore` and `Paths to skip` list every recorded path, and that no state log was written.
5. Run `/doctor:update rollback --run=<runDir>` and answer `no` at the approval prompt. Capture `STATUS=DECLINED` and confirm no target changed.
6. Run the same command again and approve with `yes`. Capture the result block and the state log.
7. Confirm the `Restored` list matches the preview's restore list, every restored file's sha256 matches its pre-apply value, and `.skilled/release/.apply.lock` is absent.
8. When the preview lists a path under `skipped`, confirm that path changed after apply, that it keeps its current content, that the terminal status is the partial status instead of `STATUS=ROLLED_BACK`, and that no `git restore` ran.
9. Discard the disposable copy and confirm the live working copy is unchanged.

To exercise step 8, edit one applied path after the apply so its content no longer matches the recorded release version. Without such an edit the preview's skip list is empty and the run reports `STATUS=ROLLED_BACK`.

### Expected

The preflight resolves the run and the lock check reports the lock state. The preview lists every recorded path under `Paths to restore` and `Paths to skip` and writes nothing. The approval prompt appears once after the preview, and an explicit no or an ambiguous answer makes no engine write and reports `STATUS=DECLINED`.

On approval the engine restores the paths whose content still matches the applied release, and any path changed after apply is skipped. A full restore reports `STATUS=ROLLED_BACK`, and a run that leaves any path skipped reports the partial status, names each skipped path and says it was left unchanged. The workflow never calls `git restore` from its own steps because the commit state of those paths may have changed since the apply.

The restored files match their pre-apply content, the lock is absent after the run, and the state log records the lock state, the restored paths, the skipped paths and the final status.

### Evidence

- The apply record path and the recorded paths from `<runDir>/rollback.json`.
- The pre-apply and post-apply checksums of every written target.
- The lock check output.
- The preview with `Paths to restore`, `Paths to skip` and `STATUS=DRY_RUN`.
- The declined approval result with `STATUS=DECLINED` and the unchanged targets.
- The approved result block with `Lock`, `Restored`, `Skipped` and the terminal status.
- The post-rollback checksums matching the pre-apply values.
- The state log at `<runDir>/.doctor-update-rollback.last-run.json`.
- The skip-path observation when the preview listed one, with no `git restore` in the transcript.

### Pass / Fail

- **Pass**: The preview lists the recorded paths, the declined approval writes nothing, the approved run restores the paths whose content still matches the applied release, any path changed after apply is left unchanged and reported, and the lock is absent afterward.
- **Fail**: A restore happens without an approval, a path changed after apply is overwritten, a partial rollback is reported as complete, a skipped path is passed to `git restore`, or the lock remains after the run.

### Failure Triage

If the preflight rejects the run, inspect the canonical path rule in `doctor-update-rollback.yaml` and confirm the run sits below `.skilled/release/runs` without a symlink. If the preview lists no restored path, inspect the selected run's `rollback.json`. If a path is skipped unexpectedly, compare its content with the recorded after-entry in `rollback.json`, because rollback only restores paths that still match the applied release. If a lock remains, inspect the lock state output and clear a stale lock only through the documented unlock command with approval.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-rollback.yaml](../../../../commands/doctor/assets/doctor-update-rollback.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:update rollback

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-360
- Feature name: Doctor update rollback
- Command mode: `/doctor:update rollback`
- YAML asset: `doctor-update-rollback.yaml`
- Mutation boundary: only paths listed in `rollback.json` and validated by the engine, the engine-owned `.skilled/release/.apply.lock` after a separate stale-lock approval, and `<runDir>/.doctor-update-rollback.last-run.json`. Every other path and any path the engine reports as skipped stays unchanged, and the disposable copy is discarded at the end.
- Feature file path: `doctor-commands/doctor-update-rollback.md`
