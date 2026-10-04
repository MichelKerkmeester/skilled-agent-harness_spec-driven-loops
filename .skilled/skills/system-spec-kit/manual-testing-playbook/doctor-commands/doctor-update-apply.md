---
title: "DOC-359 -- Doctor update apply"
description: "Manual scenario validating that /doctor:update apply shows its complete plan, asks once before writing, applies only planned and decided parts, and keeps a rollback record before its first target write."
version: 1.0.0.0
id: doctor-commands-doctor-update-apply
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-359 -- Doctor update apply

## 1. OVERVIEW

This scenario validates the mutating apply action of `/doctor:update`. Apply builds a plan from the current check or from a recorded alignment run, shows the complete plan, requests exactly one startup approval before its first release-managed write, applies the planned writes, runs the post-apply battery and keeps a rollback path.

The scenario runs the plan as a dry run first, confirms the dry run writes nothing, declines the approval once to prove that no release-managed write happens without an unambiguous yes, then approves and captures the apply result, the rollback record and the released lock. Units without decisions are skipped and reported with their reason. Everything happens inside a disposable copy that is discarded at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the plan is shown before any write, one approval gates every release-managed write, only planned and decided parts change, and `<runDir>/rollback.json` exists before any target file is written.
- Playbook ID: DOC-359.
- Real user request: `Apply the release update I aligned and keep a way to undo it.`
- Prompt: `Apply the release update I aligned and keep a way to undo it.`
- Preconditions: A disposable copy with a completed alignment run that includes at least one `take-release` file and at least one unit left undecided, an absent engine lock, a committed `.skilled/release/base.json` when an earlier record-base wrote it, and a runtime that can execute `/doctor:update` with Bash access.
- Expected execution process: Prepare the alignment run, record the baseline, run the dry-run plan, capture the plan and its `planDigest`, decline once, approve once, capture the apply result, the rollback record and the lock state, then compare the checkout with the baseline.
- Expected signals: Preflight runs `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json --dry-run`. An absent lock continues. A running or unreadable lock shows the lock template, leaves the lock in place and stops with `STATUS=FAILED`. The dry run executes `node .skilled/commands/doctor/scripts/release-update.cjs apply --repo . --json --dry-run [--decisions <path>] [--release <tag>] [--scope <value>] [--remote <value>] [--offline] [--include-prerelease]`, writes no release file, rollback record or lock, and returns `writes`, `skippedUnits`, `appliedUnits`, `followUps` and `planDigest`. The full plan is shown as `Release Apply Plan`, including added, replaced and deleted paths, every skipped unit with its reason and the paths of a unit skipped for undecided files. A user-supplied `--dry-run` stops with `STATUS=DRY_RUN` and writes no state log. Without `--dry-run` the plan is shown again and one prompt asks `Apply exactly this release plan to the checkout?` with `Reply yes to approve the planned writes, or no to leave release-managed files unchanged.` Only an unambiguous `yes` approves. An explicit `no` or an ambiguous answer performs no release-managed write and reports `STATUS=DECLINED`, and cancellation reports `STATUS=CANCELLED ACTION=cancelled`. The engine apply call carries `--plan-digest <dry-run planDigest>`, acquires `.skilled/release/.apply.lock` and refuses when the lock already exists, writes `<runDir>/rollback.json` before the first target file write, applies only the planned writes, then updates `.skilled/release/base.json` and `.skilled/release/divergence.json`, and releases the lock in its finally path. After the engine returns, the lock is absent, `rollback.json` exists and its `paths` array names every written path with its before and after entry, and the result lists `written`, `added`, `deleted`, `skippedUnits`, `appliedUnits` and `followUps`. Every unplanned checkout file keeps its baseline content. The result block is `Doctor Update Apply`, reporting `STATUS=APPLIED` when every planned write completed, the partial status when only some did, and otherwise one of `STATUS=ROLLED_BACK`, `STATUS=DECLINED`, `STATUS=CANCELLED`, `STATUS=DRY_RUN` or `STATUS=FAILED`. The state log `.skilled/release/runs/.doctor-update.last-run.json` carries `writes`, `startup_approved`, `battery`, `reindex`, `rollback` and `final_status`. The battery table `Post-apply checks` records each applicable check, and a skipped advisor rebuild is reported as `reindex=skipped` with the stale-index warning and never as a silent success.
- Desired user-visible outcome: A complete plan, one approval prompt, writes limited to the plan, a skipped list with reasons, a rollback record that names every written path, and a released lock.
- Pass/fail: PASS if the dry run writes nothing, the declined approval writes nothing, the approved run writes only planned paths, `<runDir>/rollback.json` exists before the first target write, the lock is absent afterward, and undecided units are skipped with their reason.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Apply the release update I aligned and keep a way to undo it.
```

### Commands

1. Create a disposable copy of the repository.
2. Prepare a completed alignment run. Follow the align flow for one unit that includes at least one `take-release` file and record an answer for every presented file. Leave a second `customized`, `conflict` or `removed` unit undecided. When an earlier record-base wrote `.skilled/release/base.json`, commit it before applying.
3. Record the baseline: `git status --porcelain`, the sha256 of every file in the alignment plan, and `test -e .skilled/release/.apply.lock` which must report the lock absent.
4. Run `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json --dry-run` and confirm the lock is absent.
5. Run `/doctor:update apply --decisions=<runDir>/decisions.json --dry-run` through the real runtime and capture the complete `Release Apply Plan`, every skipped unit with its reason, the follow-up checks and the `planDigest`.
6. Confirm no lock, no rollback record, no state log and no release-managed file changed after the dry run.
7. Run `/doctor:update apply --decisions=<runDir>/decisions.json` and answer `no` or an ambiguous word at the approval prompt. Capture `STATUS=DECLINED`, the state log and the unchanged targets.
8. Run the same command again, approve with `yes`, and capture the engine result.
9. Confirm `.skilled/release/.apply.lock` is absent, `<runDir>/rollback.json` exists and names every written path, and only the planned paths changed against step 3.
10. Capture the result block, the state log, the `Post-apply checks` table and the advisor rebuild outcome.
11. Discard the disposable copy and confirm the live working copy is unchanged.

### Expected

The preflight clears the lock state and the dry run shows the complete plan without writing anything. The plan names each added, replaced and deleted path, every skipped unit with its reason, and the follow-up checks. No lock, rollback record or state log exists after the dry run.

The approval prompt appears once, after the plan. An explicit no or an ambiguous answer performs no release-managed write and reports `STATUS=DECLINED`, and only an unambiguous yes continues. On approval the engine writes `rollback.json` before its first target file write, then applies only the planned writes, updates the release records and releases its lock in the finally path. Units without decisions stay skipped and their files stay unchanged.

The result lists the written, added and deleted paths and the applied and skipped units. The battery table records each applicable check, and the advisor rebuild outcome is reported even when it is skipped or fails, because a skipped rebuild is never a silent success.

### Evidence

- The lock state before the run and the `unlock --dry-run` output.
- The complete dry-run plan with the `planDigest`, the skipped reasons and the follow-up checks.
- The observation that no lock, rollback record, state log or target file exists after the dry run.
- The declined approval result with `STATUS=DECLINED` and the unchanged targets.
- The approved apply result with `written`, `added`, `deleted`, `appliedUnits` and `skippedUnits`.
- The `<runDir>/rollback.json` content with its `paths` entries.
- The lock check after the engine returns.
- The state log, the `Post-apply checks` table and the advisor rebuild outcome.

### Pass / Fail

- **Pass**: The dry run writes nothing, the declined approval writes nothing, the approved run writes only planned paths, `<runDir>/rollback.json` exists before the first target write, the lock is absent afterward, and undecided units are skipped with their reason.
- **Fail**: A release-managed write happens without the one approval, a write lands outside the plan, `rollback.json` is missing after an apply, the lock remains after the engine returns, or an undecided unit is written.

### Failure Triage

If the preflight stops on the lock, inspect the lock template and the unlock dry-run output rather than removing a lock by hand. If the plan misses a decided file, inspect the alignment run's `decisions.json` and the `--decisions` path. If a write lands outside the plan, the canonical path validator or the engine plan is at fault. If `rollback.json` is missing, inspect the engine's write order, because the record must precede every target file write. If a target refuses because it has staged or unstaged changes, inspect the target cleanliness rule in `doctor-update-apply.yaml`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-apply.yaml](../../../../commands/doctor/assets/doctor-update-apply.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:update apply

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-359
- Feature name: Doctor update apply
- Command mode: `/doctor:update apply`
- YAML asset: `doctor-update-apply.yaml`
- Mutation boundary: only release-managed paths named in the approved apply plan, `.skilled/release/base.json`, `.skilled/release/divergence.json`, `.skilled/release/.apply.lock`, `<runDir>/rollback.json` and the run's state log change, plus any post-apply write counterpart approved separately. Everything happens inside the disposable copy, which is discarded at the end.
- Feature file path: `doctor-commands/doctor-update-apply.md`
