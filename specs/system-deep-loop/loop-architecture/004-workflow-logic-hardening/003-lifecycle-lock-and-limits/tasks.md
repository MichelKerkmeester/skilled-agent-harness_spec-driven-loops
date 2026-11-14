---
title: "Tasks: Phase 3: lifecycle-lock-and-limits"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "lifecycle lock and limits tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: lifecycle-lock-and-limits

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`P` is `specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/003-lifecycle-lock-and-limits`. `A` is `.skilled/commands/deep/assets`. `NPM` is `npm --prefix .skilled/skills/system-deep-loop/runtime test --`. Every command runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the start commit in the Progress table (`$P/goal.md`). Verify: `rg -n 'start commit' $P/goal.md` prints a line that holds the output of `git rev-parse --short HEAD`.
- [ ] T002 Save the full runtime suite result on the start commit (`$P/scratch/baseline-suite.txt`). Verify: `rg -n 'Tests ' $P/scratch/baseline-suite.txt` prints one summary line with the passed and failed counts.
- [ ] T003 Write restart tests for flag binding, step order, the absence of a post-lock `mv`, prior lineage binding, config values and the recorded event in all four workflows (`.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts` exits 1 on the start commit with failures named for research auto, research confirm, review auto and review confirm.
- [ ] T004 Write lock lifetime tests for the derived `--ttl-ms`, the refresh before and after dispatch and a `loop-lock.cjs status` check that reports `stale:false` 3600 seconds after a refresh at the derived TTL (`.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-lock-lifetime.vitest.ts`). Verify: `$NPM tests/unit/workflow-lock-lifetime.vitest.ts` exits 1 on the start commit.
- [ ] T005 Add a test that enumerates every terminal path after a successful acquire in the four workflows (`halt: true`, fail-closed lost lock, halting `on_fail`, cancel choice) and requires each to name `step_release_lock`, while pre-acquire halts must not name it (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-lock-release.vitest.ts`). Verify: `$NPM tests/unit/deep-research-lock-release.vitest.ts` exits 1 on the start commit and the existing nonce tests still pass.
- [ ] T006 Write duration tests for the step in all four files, its stop reason in `STOP_REASONS` and its route to synthesis (`.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-max-duration.vitest.ts`). Verify: `$NPM tests/unit/workflow-max-duration.vitest.ts` exits 1 on the start commit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Restart surface and lineage (F06)
- [ ] T007 Parse `--restart` and `--lineage-mode=auto|resume|restart` into `lineage_mode` with default `auto` (`.skilled/commands/deep/research.md`). Verify: `rg -c -- '--restart|--lineage-mode' .skilled/commands/deep/research.md` prints a number above 0.
- [ ] T008 Add the `lineage_mode` setup row and flag routing as the review presentation shows them (`$A/deep-research-presentation.txt`). Verify: `rg -c 'lineage_mode' $A/deep-research-presentation.txt` prints a number above 0.
- [ ] T009 Add a top-level `step_apply_lifecycle_request` that binds `prior_session_id` and `prior_generation` from the old config and then archives the packet (`$A/deep-research-auto.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research auto restart order'` exits 0.
- [ ] T010 List `lineage_mode` in `step_preflight_contract` `required_values_present` (`$A/deep-research-auto.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research flags'` passes its research auto case.
- [ ] T011 Replace the classifier `on_restart` branch so it neither moves the packet nor appends a row (`$A/deep-research-auto.yaml`). Verify: `rg -n 'mv \{state_paths.packet_dir\}' $A/deep-research-auto.yaml` prints only the line inside `step_apply_lifecycle_request`.
- [ ] T012 Write restart lineage values into `step_create_config` when `lineage_mode` is `restart` (`$A/deep-research-auto.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research auto config lineage'` exits 0.
- [ ] T013 Add `step_record_restarted_run` after `step_create_state_log` that appends `deep_research.run_restarted` through the gateway (`$A/deep-research-auto.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research auto restarted event'` exits 0.
- [ ] T014 List `lineage_mode` in `step_preflight_contract` `required_values_present` (`$A/deep-research-confirm.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research flags'` exits 0.
- [ ] T015 Make `on_restart_choice` bind the prior lineage, archive the packet contents while the held lock file stays in place and recreate the prompt, iteration and delta directories (`$A/deep-research-confirm.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research confirm restart'` exits 0.
- [ ] T016 Write restart lineage values into `step_create_config` (`$A/deep-research-confirm.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research confirm config lineage'` exits 0.
- [ ] T017 Add `step_record_restarted_run` after `step_create_state_log` and drop the pre-open `restarted` append (`$A/deep-research-confirm.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'research confirm restarted event'` exits 0.
- [ ] T018 Bind `prior_session_id` and `prior_generation` in `step_apply_lifecycle_request` before its move and remove the post-lock move from `on_restart` (`$A/deep-review-auto.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'review auto restart'` exits 0.
- [ ] T019 Write restart lineage values into `step_create_config` and `step_create_findings_registry` (`$A/deep-review-auto.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'review auto config lineage'` exits 0.
- [ ] T020 Make `on_restart_choice` bind the prior lineage, archive the packet contents while the held lock file stays in place and recreate the prompt, iteration and delta directories (`$A/deep-review-confirm.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'review confirm restart'` exits 0.
- [ ] T021 Write restart lineage values into `step_create_config` and `step_create_findings_registry` (`$A/deep-review-confirm.yaml`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts -t 'review confirm config lineage'` exits 0.
- [ ] T022 Mark `deep_research.run_restarted` spoken with both research workflow producers (`.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`). Verify: `$NPM tests/unit/check-ledger-stem-producers.vitest.ts tests/unit/workflow-restart-lifecycle.vitest.ts -t 'restart projection'` exits 0 and the projection case finds the restart row in the projected state log.

### Lock lifetime (F09, D3)
- [ ] T023 Derive `--ttl-ms` from `timeoutSeconds` and refresh the lock right before and after dispatch (`$A/deep-research-auto.yaml`). Verify: `$NPM tests/unit/workflow-lock-lifetime.vitest.ts -t 'deep-research-auto'` exits 0.
- [ ] T024 Derive `--ttl-ms` from `timeoutSeconds` and refresh the lock right before and after dispatch (`$A/deep-research-confirm.yaml`). Verify: `$NPM tests/unit/workflow-lock-lifetime.vitest.ts -t 'deep-research-confirm'` exits 0.
- [ ] T025 Derive `--ttl-ms` from `timeoutSeconds` and refresh the lock right before and after dispatch (`$A/deep-review-auto.yaml`). Verify: `$NPM tests/unit/workflow-lock-lifetime.vitest.ts -t 'deep-review-auto'` exits 0.
- [ ] T026 Derive `--ttl-ms` from `timeoutSeconds` and refresh the lock right before and after dispatch (`$A/deep-review-confirm.yaml`). Verify: `$NPM tests/unit/workflow-lock-lifetime.vitest.ts -t 'deep-review-confirm'` exits 0.

### Shared release (F09, D4)
- [ ] T027 Add `step_release_lock`, route every terminal path to it and remove `applies_to` (`$A/deep-research-auto.yaml`). Verify: `$NPM tests/unit/deep-research-lock-release.vitest.ts -t 'deep-research-auto'` exits 0.
- [ ] T028 Add `step_release_lock` and route every terminal path to it (`$A/deep-research-confirm.yaml`). Verify: `$NPM tests/unit/deep-research-lock-release.vitest.ts -t 'deep-research-confirm'` exits 0.
- [ ] T029 Add `step_release_lock`, route every terminal path to it and remove `applies_to` (`$A/deep-review-auto.yaml`). Verify: `$NPM tests/unit/deep-research-lock-release.vitest.ts -t 'deep-review-auto'` exits 0.
- [ ] T030 Add `step_release_lock` and route every terminal path to it (`$A/deep-review-confirm.yaml`). Verify: `$NPM tests/unit/deep-research-lock-release.vitest.ts -t 'deep-review-confirm'` exits 0.

### Duration limit (F10, D5)
- [B] T031 Add `step_check_max_duration` at the top of the loop with stop reason `maxDurationReached` and a route to synthesis (`$A/deep-research-auto.yaml`). Verify: `$NPM tests/unit/workflow-max-duration.vitest.ts -t 'deep-research-auto'` exits 0.
- [B] T032 Add `step_check_max_duration` at the top of the loop with stop reason `maxDurationReached` and a route to synthesis (`$A/deep-research-confirm.yaml`). Verify: `$NPM tests/unit/workflow-max-duration.vitest.ts -t 'deep-research-confirm'` exits 0.
- [B] T033 Add `step_check_max_duration` at the top of the loop with stop reason `maxDurationReached` and a route to synthesis (`$A/deep-review-auto.yaml`). Verify: `$NPM tests/unit/workflow-max-duration.vitest.ts -t 'deep-review-auto'` exits 0.
- [B] T034 Add `step_check_max_duration` at the top of the loop with stop reason `maxDurationReached` and a route to synthesis (`$A/deep-review-confirm.yaml`). Verify: `$NPM tests/unit/workflow-max-duration.vitest.ts -t 'deep-review-confirm'` exits 0.

### Generated contracts
- [ ] T035 Regenerate the research contract from the changed sources (`$A/compiled/deep-research.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research` exits 0 and reports no digest drift.
- [ ] T036 Regenerate the review contract from the changed sources (`$A/compiled/deep-review.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review` exits 0 and reports no digest drift.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T037 Run the four phase test files (`.skilled/skills/system-deep-loop/runtime/tests/unit/`). Verify: `$NPM tests/unit/workflow-restart-lifecycle.vitest.ts tests/unit/workflow-lock-lifetime.vitest.ts tests/unit/deep-research-lock-release.vitest.ts tests/unit/workflow-max-duration.vitest.ts` exits 0.
- [ ] T038 Run the full runtime suite and compare it with the baseline (`$P/scratch/final-suite.txt`). Verify: `npm --prefix .skilled/skills/system-deep-loop/runtime test` exits 0 or its failed count is not above the count in `$P/scratch/baseline-suite.txt`, and no newly failing test is named.
- [ ] T039 Restart a scratch copy of a research packet in auto mode (`$P/scratch/restart-drill/`). Verify: `ls $P/scratch/restart-drill/research_archive` lists one timestamped folder and `rg -o '"generation": *[0-9]+' $P/scratch/restart-drill/research/deep-research-config.json` prints the archived generation plus one.
- [ ] T040 Confirm the duration field now has readers (`$A/deep-research-auto.yaml`). Verify: `rg -c 'maxDurationMinutes' $A/deep-research-auto.yaml $A/deep-research-confirm.yaml $A/deep-review-auto.yaml $A/deep-review-confirm.yaml` prints a count of 2 or more for each file.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Task T037 printed exit 0 for the four phase test files on the final tree.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal and decisions**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task stays `[B]` while phase 001 has not added `maxDurationReached` to the enum, and the blocker is recorded in `$P/goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `rg -c '^\| REQ-0' $P/spec.md` prints 11.
- [ ] CHK-002 [P0] `rg -n 'D3 Lock Lifetime Decision' $P/plan.md` prints one line.
- [ ] CHK-003 [P1] `rg -c 'YOUR_VALUE_HERE' $P/../001-deterministic-stop-decision/spec.md $P/../002-persisted-loop-state-and-failure-policy/spec.md` prints 0 for both.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node -e "for (const f of process.argv.slice(1)) require('yaml').parse(require('fs').readFileSync(f,'utf8'))" .skilled/commands/deep/assets/deep-re*-{auto,confirm}.yaml` exits 0, run with `NODE_PATH=.skilled/skills/system-spec-kit/node_modules`.
- [ ] CHK-011 [P0] `npm --prefix .skilled/skills/system-deep-loop/runtime run typecheck` exits 0.
- [ ] CHK-012 [P1] `rg -c 'step_release_lock' .skilled/commands/deep/assets/deep-re*-{auto,confirm}.yaml` prints a count above 1 for each of the four files.
- [ ] CHK-013 [P1] `rg -c 'applies_to: \[' .skilled/commands/deep/assets/deep-re*-{auto,confirm}.yaml` prints no file.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] T003 to T006 each printed exit 1 on the start commit, recorded in `goal.md` section 4.
- [ ] CHK-021 [P0] T037 exits 0 on the final tree.
- [ ] CHK-022 [P1] T038 shows no failure absent from `$P/scratch/baseline-suite.txt`.
- [ ] CHK-023 [P1] T039 lists one archive folder and the incremented generation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] `goal.md` section 4 names a class per finding: F06 `cross-consumer`, F09 `class-of-bug`, F10 `instance-only`.
- [ ] CHK-FIX-002 [P0] `rg -n 'mv \{state_paths.packet_dir\}|--ttl-ms|halt: true|fail closed' .skilled/commands/deep/assets/deep-re*.yaml` output is saved to `$P/scratch/producer-inventory.txt` before T009.
- [ ] CHK-FIX-003 [P0] `rg -n 'lineage_mode|prior_session_id|prior_generation|run_restarted|maxDurationMinutes' .skilled --glob '*.ts' --glob '*.cjs' --glob '*.md' --glob '*.yaml'` output is saved to `$P/scratch/consumer-inventory.txt` before T009.
- [ ] CHK-FIX-004 [P0] The restart test covers a missing old config, a corrupt old config and an existing archive target. `rg -c 'missing old config|corrupt old config|archive target exists' .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` prints 3.
- [ ] CHK-FIX-005 [P1] The restart test names all 16 rows of the loop by mode by lifecycle matrix in plan.md. `rg -c 'it\(' .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` prints 16 or more.
- [ ] CHK-FIX-006 [P1] The lock lifetime test sets its own temp lock path and fake clock, and `rg -n 'process.env' .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-lock-lifetime.vitest.ts` prints no line.
- [ ] CHK-FIX-007 [P1] `goal.md` section 4 pins the evidence to the fix commit from `git rev-parse --short HEAD`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'token|secret|password' .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-*.vitest.ts` prints no line.
- [ ] CHK-031 [P0] The restart test asserts the archive target resolves inside `{state_paths.archive_root}`. `rg -c 'archive_root' .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` prints a number above 0.
- [ ] CHK-032 [P1] `rg -c -- '--nonce \{captured_acquire_nonce\}' .skilled/commands/deep/assets/deep-re*-{auto,confirm}.yaml` prints a count above 0 for each file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -c 'step_apply_lifecycle_request|step_release_lock|step_check_max_duration' $P/spec.md $P/plan.md $P/tasks.md` prints a number above 0 for each file.
- [ ] CHK-041 [P1] `rg -n 'F06|F09|F10' .skilled/commands/deep/assets/deep-re*.yaml` prints no line, so no finding id lands in a workflow comment.
- [ ] CHK-042 [P2] `rg -c -- '--restart' .skilled/commands/deep/research.md` prints a number above 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] After T039, `ls -A $P/scratch` lists only `.gitkeep`, `baseline-suite.txt`, `final-suite.txt`, `producer-inventory.txt` and `consumer-inventory.txt`.
- [ ] CHK-051 [P1] `ls $P/scratch/restart-drill` fails with no such file after T039 evidence is copied into `goal.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
