---
title: "DOC-359 -- Doctor update apply"
description: "Manual scenario validating that /doctor:update apply on the shared update fixture shows its complete plan, asks once before writing, applies only planned and decided parts, and keeps a rollback record before its first target write."
version: 1.1.0.0
id: doctor-commands-doctor-update-apply
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-359 -- Doctor update apply

## 1. OVERVIEW

This scenario validates the mutating apply action of `/doctor:update` against the shared doctor update fixture at `.worktrees/.doctor-update-test-environment`. Apply builds a plan from a recorded alignment run, shows the complete plan, requests exactly one startup approval before its first release-managed write, applies the planned writes, runs the post-apply battery and keeps a rollback path.

The alignment run decides the `customized` `skill:sk-code/sk-code-webflow` unit and defers the `conflict` `skill:sk-git` unit, so the plan writes the two Webflow changelogs plus the release records and skips the deferred unit with its reason. The scenario runs the plan as a dry run first, confirms the dry run writes nothing, declines the approval once to prove that no release-managed write happens without an unambiguous yes, then approves and captures the apply result, the rollback record and the released lock. The fixture is then reset with the recorded rollback, so every applied path returns to its committed content.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the plan is shown before any write, one approval gates every release-managed write, only planned and decided parts change, the deferred unit is skipped with its reason, and `<runDir>/rollback.json` exists before any target file is written.
- Playbook ID: DOC-359.
- Real user request: `Apply the release update I aligned and keep a way to undo it.`
- Prompt: `Apply the release update I aligned and keep a way to undo it.`
- Preconditions: The `/doctor:update` fixture at `.worktrees/.doctor-update-test-environment` with its committed fixture units and committed `.skilled/release/base.json`, an empty `git status --porcelain`, no run directory under `.skilled/release/runs/`, an absent `.skilled/release/.apply.lock`, plus a runtime that can execute `/doctor:update` with Bash access. Node and git available.
- Expected execution process: Move into the fixture, confirm the lock is absent, prepare an alignment run that decides the Webflow unit and defers `skill:sk-git`, record the baseline of the planned files, run the dry-run plan, capture the plan and its `planDigest`, decline once, approve once, capture the apply result, the rollback record and the lock state, then reset the fixture with the engine rollback and delete the run directory.
- Expected signals: Preflight runs `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json --dry-run`. An absent lock continues. A running or unreadable lock shows the lock template, leaves the lock in place and stops with `STATUS=FAILED`. The dry run executes `node .skilled/commands/doctor/scripts/release-update.cjs apply --repo . --json --dry-run [--decisions <path>] [--release <tag>] [--scope <value>] [--remote <value>] [--offline] [--include-prerelease]`, writes no release file, rollback record or lock, and returns `writes`, `skippedUnits`, `appliedUnits`, `followUps` and `planDigest`. The full plan is shown as `Release Apply Plan`, including added, replaced and deleted paths, every skipped unit with its reason, and the follow-up checks. A unit skipped for undecided files would also list its undecided paths. On the fixture the `v4.0.0.2` plan replaces the two `sk-code-webflow` changelogs and `.skilled/release/base.json`, adds `.skilled/release/divergence.json`, and lists `skill:sk-git` under `skippedUnits` with reason `deferred`, so none of its files is written. A user-supplied `--dry-run` stops with `STATUS=DRY_RUN` and writes no state log. Without `--dry-run` the plan is shown again and one prompt asks `Apply exactly this release plan to the checkout?` with `Reply yes to approve the planned writes, or no to leave release-managed files unchanged.` Only an unambiguous `yes` approves. An explicit `no` or an ambiguous answer performs no release-managed write and reports `STATUS=DECLINED`, and cancellation reports `STATUS=CANCELLED ACTION=cancelled`. The engine apply call carries `--plan-digest <dry-run planDigest>`, acquires `.skilled/release/.apply.lock` and refuses when the lock already exists, writes `<runDir>/rollback.json` before the first target file write, applies only the planned writes, then updates `.skilled/release/base.json` and `.skilled/release/divergence.json`, and releases the lock in its finally path. After the engine returns, the lock is absent, `rollback.json` exists and its `paths` array names every written path with its before and after entry, and the result lists `written`, `added`, `deleted`, `skippedUnits`, `appliedUnits` and `followUps`. Every unplanned checkout file keeps its baseline content. The result block is `Doctor Update Apply`, reporting `STATUS=APPLIED` when every planned write completed, the partial status when only some did, and otherwise one of `STATUS=ROLLED_BACK`, `STATUS=DECLINED`, `STATUS=CANCELLED`, `STATUS=DRY_RUN` or `STATUS=FAILED`. The state log `.skilled/release/runs/.doctor-update.last-run.json` carries `writes`, `startup_approved`, `battery`, `reindex`, `rollback` and `final_status`. The battery table `Post-apply checks` records each applicable check, and a skipped advisor rebuild is reported as `reindex=skipped` with the stale-index warning and never as a silent success. The reset runs `node .skilled/commands/doctor/scripts/release-update.cjs rollback --repo . --run <runDir> --json`, requires every written path under `restored` with `skipped` empty, confirms `git status --porcelain` prints nothing, and deletes the run directory.
- Desired user-visible outcome: A complete plan, one approval prompt, writes limited to the plan, the deferred unit skipped with its reason, a rollback record that names every written path, and a fixture that returns to its committed state.
- Pass/fail: PASS if the dry run writes nothing, the declined approval writes nothing, the approved run writes only the two Webflow changelogs plus `.skilled/release/base.json` and `.skilled/release/divergence.json`, `<runDir>/rollback.json` exists before the first target write, the deferred `skill:sk-git` unit is skipped with its reason, the lock is absent afterward, and the reset restores every written path with nothing skipped.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Apply the release update I aligned and keep a way to undo it.
```

### Commands

1. `cd .worktrees/.doctor-update-test-environment`, then confirm `git status --porcelain` prints nothing, no run directory exists under `.skilled/release/runs/` and `test -e .skilled/release/.apply.lock` reports the lock absent.
2. Prepare the alignment run: run `node .skilled/commands/doctor/scripts/release-update.cjs align --repo . --release v4.0.0.2 --offline --scope skill:sk-code/sk-code-webflow,skill:sk-git --json` and note the `runDir`. Record one decision for every presented Webflow file, `keep-local` for `.skilled/skills/sk-code/sk-code-webflow/SKILL.md` and `adopt-release` for its two changelogs, then record a whole-unit defer for `skill:sk-git` with `node .skilled/commands/doctor/scripts/release-update.cjs decide --repo . --run <runDir> --unit skill:sk-git --defer --json`.
3. Record the baseline: `git status --porcelain`, the sha256 of the two Webflow changelogs, the sha256 of `.skilled/release/base.json`, and the lock check from step 1.
4. Run `node .skilled/commands/doctor/scripts/release-update.cjs unlock --repo . --json --dry-run` and confirm the lock is absent.
5. Run `/doctor:update apply --decisions=<runDir>/decisions.json --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-git --dry-run` through the real runtime and capture the complete `Release Apply Plan`, every skipped unit with its reason, the follow-up checks and the `planDigest`.
6. Confirm no lock, no rollback record, no state log and no release-managed file changed after the dry run.
7. Run `/doctor:update apply --decisions=<runDir>/decisions.json --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-git` and answer `no` or an ambiguous word at the approval prompt. Capture `STATUS=DECLINED`, the state log and the unchanged targets.
8. Run the same command again, approve with `yes`, and capture the engine result.
9. Confirm `.skilled/release/.apply.lock` is absent, `<runDir>/rollback.json` exists and names every written path, and only the planned paths changed against step 3.
10. Capture the result block, the state log, the `Post-apply checks` table and the advisor rebuild outcome.
11. Reset the fixture: run `node .skilled/commands/doctor/scripts/release-update.cjs rollback --repo . --run <runDir> --json`, require every written path under `restored` with `skipped` empty, confirm `git status --porcelain` prints nothing, then delete the run directory under `.skilled/release/runs/`.

### Expected

The preflight clears the lock state and the dry run shows the complete plan without writing anything. The plan names each added, replaced and deleted path, every skipped unit with its reason, and the follow-up checks. On the fixture it replaces the two `sk-code-webflow` changelogs and `.skilled/release/base.json`, adds `.skilled/release/divergence.json`, and skips the deferred `skill:sk-git` unit. No lock, rollback record or state log exists after the dry run.

The approval prompt appears once, after the plan. An explicit no or an ambiguous answer performs no release-managed write and reports `STATUS=DECLINED`, and only an unambiguous yes continues. On approval the engine writes `rollback.json` before its first target file write, then applies only the planned writes, updates the release records and releases its lock in the finally path. The deferred unit stays skipped and its files stay unchanged.

The result lists the written, added and deleted paths and the applied and skipped units. The battery table records each applicable check, and the advisor rebuild outcome is reported even when it is skipped or fails, because a skipped rebuild is never a silent success. The reset rollback then returns every written path to its pre-apply content, the fixture prints an empty `git status --porcelain`, and the run directory is deleted.

### Evidence

- The lock state before the run and the `unlock --dry-run` output.
- The alignment run with the three Webflow decisions and the `skill:sk-git` defer reply.
- The complete dry-run plan with the `planDigest`, the skipped `skill:sk-git` reason and the follow-up checks.
- The observation that no lock, rollback record, state log or target file exists after the dry run.
- The declined approval result with `STATUS=DECLINED` and the unchanged targets.
- The approved apply result with `written`, `added`, `deleted`, `appliedUnits` and `skippedUnits`.
- The `<runDir>/rollback.json` content with its `paths` entries for the two changelogs, `.skilled/release/base.json` and `.skilled/release/divergence.json`.
- The lock check after the engine returns.
- The state log, the `Post-apply checks` table and the advisor rebuild outcome.
- The reset rollback result with every written path under `restored`, `skipped` empty and an empty `git status --porcelain`.

### Pass / Fail

- **Pass**: The dry run writes nothing, the declined approval writes nothing, the approved run writes only the two Webflow changelogs plus `.skilled/release/base.json` and `.skilled/release/divergence.json`, `<runDir>/rollback.json` exists before the first target write, the deferred `skill:sk-git` unit is skipped with its reason, the lock is absent afterward, and the reset restores every written path with nothing skipped.
- **Fail**: A release-managed write happens without the one approval, a write lands outside the plan, `rollback.json` is missing after an apply, the lock remains after the engine returns, the deferred unit is written, or the fixture does not return to its committed state.

### Failure Triage

If the preflight stops on the lock, inspect the lock template and the unlock dry-run output rather than removing a lock by hand. If the plan misses a decided file, inspect the alignment run's `decisions.json` and the `--decisions` path. If a write lands outside the plan, the canonical path validator or the engine plan is at fault. If `rollback.json` is missing, inspect the engine's write order, because the record must precede every target file write. If a target refuses because it has staged or unstaged changes, inspect the target cleanliness rule in `doctor-update-apply.yaml`. If `git status --porcelain` is not empty after the reset, inspect the rollback result's `restored` and `skipped` lists.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-apply.yaml](../../../../commands/doctor/assets/doctor-update-apply.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:update apply

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-359
- Feature name: Doctor update apply
- Command mode: `/doctor:update apply`
- YAML asset: `doctor-update-apply.yaml`
- Mutation boundary: only release-managed paths named in the approved apply plan, `.skilled/release/base.json`, `.skilled/release/divergence.json`, `.skilled/release/.apply.lock`, `<runDir>/rollback.json` and the run's state log change, plus any post-apply write counterpart approved separately. The plan writes the `customized` `skill:sk-code/sk-code-webflow` changelogs and the release records, and skips the deferred `conflict` `skill:sk-git` unit. The reset rollback removes every applied write, the run directory is deleted, and the fixture returns to its committed state.
- Feature file path: `doctor-commands/doctor-update-apply.md`
