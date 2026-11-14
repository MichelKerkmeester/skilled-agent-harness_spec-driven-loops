---
title: "Tasks: Phase 4: workflow-single-source-and-drift-guard"
description: "Ordered tasks to merge the deep-research and deep-review workflow twins into one file per command, move inline scripts into runtime scripts, repoint every reader and guard the result with a failing-first drift test."
trigger_phrases:
  - "workflow single source and drift guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: workflow-single-source-and-drift-guard

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

Every command runs from the repository root unless it starts with `cd`. `R` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/commands/deep/assets`. `P` is `specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/004-workflow-single-source-and-drift-guard`. `OLD` is the pattern `deep-(research|review)-(auto|confirm)\.yaml`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 001 is complete (`$P/../001-deterministic-stop-decision/spec.md`). Verify: `rg -n '^\| \*\*Status\*\*' $P/../001-deterministic-stop-decision/spec.md` prints a row with `Complete`.
- [ ] T002 Confirm phase 002 is complete (`$P/../002-persisted-loop-state-and-failure-policy/spec.md`). Verify: `rg -n '^\| \*\*Status\*\*' $P/../002-persisted-loop-state-and-failure-policy/spec.md` prints a row with `Complete`.
- [ ] T003 Confirm phase 003 is complete (`$P/../003-lifecycle-lock-and-limits/spec.md`). Verify: `rg -n '^\| \*\*Status\*\*' $P/../003-lifecycle-lock-and-limits/spec.md` prints a row with `Complete`.
- [ ] T004 Save the census of the post-fix twins (`$P/scratch/census-before.txt`). Verify: `bash $P/scratch/measure-workflows.sh > $P/scratch/census-before.txt && rg -c 'differing lines' $P/scratch/census-before.txt` prints 2.
- [ ] T005 Save the old-name inventory (`$P/scratch/inventory-before.txt`). Verify: `rg -l "$OLD" .skilled .claude .codex .pi .dsh > $P/scratch/inventory-before.txt && wc -l < $P/scratch/inventory-before.txt` prints a number above 0.
- [ ] T006 Add the drift guard case that fails when a per-mode workflow file exists for the research or review definition and never checks the council definition, which phase `006-ai-council-mode-deprecation` owns (`$R/tests/unit/compile-command-contracts.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/compile-command-contracts.vitest.ts` fails with a message naming `deep-research-confirm.yaml`.
- [ ] T007 Add the drift guard cases for flag parity over the research and review definitions only, using the rule and alias table in `plan.md` section 3 (`$R/tests/unit/compile-command-contracts.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/compile-command-contracts.vitest.ts -t 'flag parity'` fails with messages naming `--dry-run` and `deep-research-auto.yaml`, and `dry_run` and `review.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Merge
- [ ] T008 Record the chosen body for every step and branch that differs between the research twins, the review twins and the failure policy phase 002 settled (`$P/scratch/merge-ledger.md`). Verify: `rg -c '^\| step_' $P/scratch/merge-ledger.md` prints at least the larger auto step count in `census-before.txt`.
- [ ] T009 Create the single research workflow with `execution_mode`, `mode_overrides.confirm`, every step from both twins and confirm checkpoints marked `applies_to: confirm` (`$A/deep-research.yaml`). Verify: `rg -c '^execution_mode:' $A/deep-research.yaml` prints 1 and `rg -c 'applies_to: confirm' $A/deep-research.yaml` prints at least 1.
- [ ] T010 Create the single review workflow on the same pattern (`$A/deep-review.yaml`). Verify: `rg -c '^execution_mode:' $A/deep-review.yaml` prints 1 and `rg -c 'applies_to: confirm' $A/deep-review.yaml` prints at least 1.
- [ ] T080 Carry the confirm Retry, Skip or Cancel gate after three consecutive failed iterations into a block marked `applies_to: confirm` (`$A/deep-research.yaml`). Verify: `rg -n 'Retry' $A/deep-research.yaml` prints the gate and the nearest enclosing `applies_to` line above it reads `applies_to: confirm`.
- [ ] T081 Carry the same gate into the review workflow (`$A/deep-review.yaml`). Verify: `rg -n 'Retry' $A/deep-review.yaml` prints the gate and the nearest enclosing `applies_to` line above it reads `applies_to: confirm`.

### Runtime scripts
- [ ] T011 [P] Extract the started, progress and terminal heartbeat bodies into one script with a `--phase` argument (`$R/scripts/loop-heartbeat.cjs`). Verify: `node $R/scripts/loop-heartbeat.cjs` with no argument exits non-zero and prints a usage line naming `--phase`.
- [ ] T012 [P] Extract the run-now check and restore bodies (`$R/scripts/run-now-sentinel.cjs`). Verify: `node $R/scripts/run-now-sentinel.cjs` with no argument exits non-zero and prints a usage line naming `check` and `restore`.
- [ ] T013 [P] Extract the per-iteration graph upsert body (`$R/scripts/iteration-graph-upsert.cjs`). Verify: `node $R/scripts/iteration-graph-upsert.cjs` with no argument exits non-zero and prints a usage line.
- [ ] T014 [P] Extract the per-executor dispatch bodies into one entry that calls `buildLineageCommand` (`$R/scripts/dispatch-iteration.cjs`). Verify: `node $R/scripts/dispatch-iteration.cjs --executor unknown` exits non-zero and names the eight supported kinds.
- [ ] T015 Replace the research heredocs with calls to the four scripts and collapse the pivot seats into one parameterized pair (`$A/deep-research.yaml`). Verify: `bash $P/scratch/measure-workflows.sh --single` prints at most 2000 bytes on the research `inline heredocs` line and `rg -c 'step_dispatch_pivot_seat_00[23]' $A/deep-research.yaml` prints nothing.
- [ ] T016 Replace the review heredocs and collapse the pivot seats on the same pattern (`$A/deep-review.yaml`). Verify: `bash $P/scratch/measure-workflows.sh --single` prints at most 2000 bytes on the review `inline heredocs` line and `rg -c 'step_dispatch_pivot_seat_00[23]' $A/deep-review.yaml` prints nothing.
- [ ] T017 Tag every dispatch, state-write, reducer-refresh and child-spawn step with `dry_run_boundary` outside any `applies_to` block (`$A/deep-research.yaml`). Verify: `rg -c 'dry_run_boundary' $A/deep-research.yaml` prints at least the count in the research confirm twin from `census-before.txt`.
- [ ] T018 Tag the same boundaries in the review workflow (`$A/deep-review.yaml`). Verify: `rg -c 'dry_run_boundary' $A/deep-review.yaml` prints a number above 7.

### Command surfaces
- [ ] T019 Point both modes at `deep-research.yaml` and drop the confirm-only scope from the Dry-Run Flag section (`.skilled/commands/deep/research.md`). Verify: `rg -c "$OLD" .skilled/commands/deep/research.md` prints nothing and `rg -n 'confirm flow' .skilled/commands/deep/research.md` prints nothing.
- [ ] T020 Point both modes at `deep-review.yaml` and add `--dry-run` to the flag table and the argument hint (`.skilled/commands/deep/review.md`). Verify: `rg -c -- '--dry-run' .skilled/commands/deep/review.md` prints at least 2.
- [ ] T021 Update paths and add the dry-run halt contract (`$A/deep-research-presentation.txt`). Verify: `rg -ci 'dry[-_]run' $A/deep-research-presentation.txt` prints at least 1.
- [ ] T022 Update paths and add the dry-run halt contract (`$A/deep-review-presentation.txt`). Verify: `rg -ci 'dry[-_]run' $A/deep-review-presentation.txt` prints at least 1.
- [ ] T023 [P] Update the research legacy body paths (`$A/legacy/deep-research.body.markdown`). Verify: `rg -c "$OLD" $A/legacy/deep-research.body.markdown` prints nothing.
- [ ] T024 [P] Update the review legacy body paths (`$A/legacy/deep-review.body.markdown`). Verify: `rg -c "$OLD" $A/legacy/deep-review.body.markdown` prints nothing.
- [ ] T025 [P] Reword the mode rows to one workflow per command (`$A/legacy/README.markdown`). Verify: `rg -n 'auto workflow|confirm workflow' $A/legacy/README.markdown` prints nothing.
- [ ] T026 Switch research and review to one `workflowPath` and keep council on its two paths (`$R/scripts/compile-command-contracts.cjs`). Verify: `rg -c "$OLD" $R/scripts/compile-command-contracts.cjs` prints nothing and `rg -c 'deep-ai-council-(auto|confirm)' $R/scripts/compile-command-contracts.cjs` prints 4.
- [ ] T027 Read `workflowPath` when a definition has one (`$R/scripts/check-contract-drift.cjs`). Verify: `cd $R && npx vitest run tests/unit/check-contract-drift.vitest.ts` exits 0.
- [ ] T028 Regenerate the research compiled contract (`$A/compiled/deep-research.contract.markdown`). Verify: `rg -c "$OLD" $A/compiled/deep-research.contract.markdown` prints nothing.
- [ ] T029 Regenerate the review compiled contract (`$A/compiled/deep-review.contract.markdown`). Verify: `rg -c "$OLD" $A/compiled/deep-review.contract.markdown` prints nothing.
- [ ] T030 Update the research handoff to the single workflow with `execution_mode: auto` (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n 'deep-research\.yaml' .skilled/commands/speckit/assets/speckit-complete.yaml` prints 2 lines.

### Readers
- [ ] T031 [P] Update the producer list (`$R/scripts/check-ledger-stem-producers.cjs`). Verify: `rg -c "$OLD" $R/scripts/check-ledger-stem-producers.cjs` prints nothing.
- [ ] T032 [P] Update producer paths (`$R/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`). Verify: `rg -c "$OLD" $R/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` prints nothing.
- [ ] T033 [P] Update producer paths (`$R/lib/deep-review-ledger-schema/deep-review-ledger-types.ts`). Verify: `rg -c "$OLD" $R/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` prints nothing.
- [ ] T034 [P] Update the `YAML_FILES` array (`.skilled/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh`). Verify: the script prints `PASS` and `across 2 workflow YAMLs`.
- [ ] T035 [P] Update the two workflow paths (`.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml`). Verify: `rg -c "$OLD" .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` prints nothing.

### Tests
- [ ] T036 [P] Repoint (`$R/tests/unit/check-ledger-stem-producers.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/check-ledger-stem-producers.vitest.ts` exits 0.
- [ ] T037 [P] Repoint (`$R/tests/unit/deep-research-bookkeeping-emission.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-research-bookkeeping-emission.vitest.ts` exits 0.
- [ ] T038 [P] Repoint (`$R/tests/unit/deep-research-convergence-floor.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-research-convergence-floor.vitest.ts` exits 0.
- [ ] T039 [P] Repoint and assert the call to `iteration-graph-upsert.cjs` (`$R/tests/unit/deep-research-graph-upsert.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-research-graph-upsert.vitest.ts` exits 0.
- [ ] T040 [P] Repoint (`$R/tests/unit/deep-research-lock-release.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-research-lock-release.vitest.ts` exits 0.
- [ ] T041 [P] Repoint (`$R/tests/unit/deep-research-marker-scan.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-research-marker-scan.vitest.ts` exits 0.
- [ ] T042 [P] Repoint (`$R/tests/unit/deep-research-memory-upsert-yaml.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-research-memory-upsert-yaml.vitest.ts` exits 0.
- [ ] T043 [P] Repoint (`$R/tests/unit/deep-research-run-open.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-research-run-open.vitest.ts` exits 0.
- [ ] T044 [P] Repoint (`$R/tests/unit/deep-review-bookkeeping-emission.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-review-bookkeeping-emission.vitest.ts` exits 0.
- [ ] T045 [P] Repoint (`$R/tests/unit/deep-review-lock-refresh.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-review-lock-refresh.vitest.ts` exits 0.
- [ ] T046 [P] Repoint (`$R/tests/unit/deep-review-marker-scan.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-review-marker-scan.vitest.ts` exits 0.
- [ ] T047 [P] Repoint (`$R/tests/unit/deep-review-recovery-baseline-drain.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-review-recovery-baseline-drain.vitest.ts` exits 0.
- [ ] T048 [P] Repoint (`$R/tests/unit/deep-review-stage-skip.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/deep-review-stage-skip.vitest.ts` exits 0.
- [ ] T049 [P] Rewrite to assert each of the eight branches appears once in each single file (`$R/tests/unit/executor-branch-contract.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/executor-branch-contract.vitest.ts` exits 0.
- [ ] T050 [P] Repoint (`$R/tests/unit/fanout-merge.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/fanout-merge.vitest.ts` exits 0.
- [ ] T051 [P] Repoint (`$R/tests/unit/fanout-root-resource-map.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/fanout-root-resource-map.vitest.ts` exits 0.
- [ ] T052 [P] Repoint (`$R/tests/unit/fanout-run.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/fanout-run.vitest.ts` exits 0.
- [ ] T053 [P] Rewrite the auto against confirm comparison as single-file assertions (`$R/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts` exits 0.
- [ ] T054 [P] Repoint (`$R/tests/unit/render-command-contract.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/render-command-contract.vitest.ts` exits 0.
- [ ] T055 [P] Repoint and assert the call to `run-now-sentinel.cjs` (`$R/tests/unit/run-now-yaml-control.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/run-now-yaml-control.vitest.ts` exits 0.
- [ ] T056 [P] Rewrite the auto against confirm comparison as single-file assertions (`$R/tests/unit/stop-policy-yaml-parity.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/stop-policy-yaml-parity.vitest.ts` exits 0.
- [ ] T057 [P] Rewrite the auto against confirm comparison as single-file assertions (`$R/tests/unit/workflow-session-id-parity.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/workflow-session-id-parity.vitest.ts` exits 0.
- [ ] T058 [P] Repoint (`$R/tests/unit/write-containment-yaml-call-sites.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/write-containment-yaml-call-sites.vitest.ts` exits 0.
- [ ] T059 [P] Repoint (`.skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/deep-research-contract-parity.vitest.ts` exits 0.
- [ ] T060 [P] Repoint (`.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts` exits 0.
- [ ] T061 [P] Repoint (`.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/deep-review-auto-restart-contract.vitest.ts` exits 0.
- [ ] T062 [P] Repoint (`.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-reducer-schema.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/deep-review-reducer-schema.vitest.ts` exits 0.

### Retire the twins
- [ ] T063 Delete the research auto twin (`$A/deep-research-auto.yaml`). Verify: `ls $A/deep-research-auto.yaml` exits 1.
- [ ] T064 Delete the research confirm twin (`$A/deep-research-confirm.yaml`). Verify: `ls $A/deep-research-confirm.yaml` exits 1.
- [ ] T065 Delete the review auto twin (`$A/deep-review-auto.yaml`). Verify: `ls $A/deep-review-auto.yaml` exits 1.
- [ ] T066 Delete the review confirm twin (`$A/deep-review-confirm.yaml`). Verify: `ls $A/deep-review-confirm.yaml` exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T067 Run the drift guard on the merged tree (`$R/tests/unit/compile-command-contracts.vitest.ts`). Verify: `cd $R && npx vitest run tests/unit/compile-command-contracts.vitest.ts` exits 0.
- [ ] T068 Prove the guard still bites on a restored twin in a scratch copy (`$P/scratch/guard-negative.txt`). Verify: the guard run against a copy of `$A` that holds `deep-research-confirm.yaml` exits non-zero and the saved output names that file.
- [ ] T069 Run the full runtime suite (`$R/package.json`). Verify: `cd $R && npm test` exits 0 with 0 failed files.
- [ ] T070 Run the typecheck (`$R/tsconfig.json`). Verify: `cd $R && npm run typecheck` exits 0.
- [ ] T071 Run the compiled contract drift check (`$R/scripts/check-contract-drift.cjs`). Verify: `node $R/scripts/check-contract-drift.cjs` exits 0.
- [ ] T072 Save the census of the merged tree (`$P/scratch/census-after.txt`). Verify: `bash $P/scratch/measure-workflows.sh --single > $P/scratch/census-after.txt` exits 0, its `bytes:` lines print at most 140000 for research and 155000 for review, and every name on the `auto-only workflow steps` lines of `census-before.txt` appears on the matching `step key list` line.
- [ ] T073 Rerun the old-name inventory (`$P/scratch/inventory-after.txt`). Verify: `rg -l "$OLD" .skilled/commands .skilled/skills/system-deep-loop/runtime .skilled/skills/system-deep-loop/deep-research/scripts .skilled/skills/system-deep-loop/deep-review/assets .skilled/skills/system-spec-kit/runtime/cli/tests` prints nothing.
- [ ] T074 Dry-run research in auto mode against a scratch spec folder (`$P/scratch/dry-run-research-auto.txt`). Verify: the transcript holds a `dry_run_halt` row and `git status --short` shows no new file under the scratch folder's `research/`.
- [ ] T075 Dry-run research in confirm mode (`$P/scratch/dry-run-research-confirm.txt`). Verify: the transcript holds a `dry_run_halt` row and no executor dispatch line.
- [ ] T076 Dry-run review in auto mode (`$P/scratch/dry-run-review-auto.txt`). Verify: the transcript holds a `dry_run_halt` row and `git status --short` shows no new file under the scratch folder's `review/`.
- [ ] T077 Dry-run review in confirm mode (`$P/scratch/dry-run-review-confirm.txt`). Verify: the transcript holds a `dry_run_halt` row and no executor dispatch line.
- [ ] T078 Write the phase 005 handoff list from `inventory-before.txt` minus the surfaces this phase changed (`$P/implementation-summary.md`). Verify: `rg -c 'phase 005' $P/implementation-summary.md` prints at least 1.
- [ ] T079 Validate the packet (`$P/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cd $R && npm test` exits 0 and the drift guard fails on the scratch copy that restores a twin
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
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

A blocked task is marked `[B]` with the blocking fact on the same line and an `Open question:` in `goal.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `rg -c '^\| REQ-0' $P/spec.md` prints 15.
- [ ] CHK-002 [P0] `rg -n '^## 4' $P/plan.md` prints one line.
- [ ] CHK-003 [P1] T001 to T003 printed `Complete` for phases 001, 002 and 003.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on each of the four new scripts under `$R/scripts/`.
- [ ] CHK-011 [P0] `cd $R && npx vitest run tests/unit/compile-command-contracts.vitest.ts` parses both single workflows without a YAML error.
- [ ] CHK-012 [P1] Each new script exits non-zero on a missing required argument, as T011 to T014 check.
- [ ] CHK-013 [P1] `rg -n 'deep-research-auto|deep-review-auto' $R/scripts` prints nothing, so no script names a twin.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met`.
- [ ] CHK-021 [P0] T074 to T077 transcripts each hold a `dry_run_halt` row.
- [ ] CHK-022 [P1] T068 saved a failing guard run for a restored twin.
- [ ] CHK-023 [P1] The guard passes whether or not phase `006-ai-council-mode-deprecation` has removed `deep-ai-council-auto.yaml` and `deep-ai-council-confirm.yaml`.
- [ ] CHK-024 [P0] T080 and T081 show the Retry, Skip or Cancel gate under `applies_to: confirm` in both single workflows.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] F14 is `class-of-bug` (twin drift), F15 is `cross-consumer` (flag documented in one surface and read in another) and F16 is `instance-only` (file bulk), as recorded in `goal.md`.
- [ ] CHK-FIX-002 [P0] `inventory-before.txt` lists every producer of the old names, and each line is either changed here or named in the phase 005 handoff.
- [ ] CHK-FIX-003 [P0] `rg -n 'autoWorkflowPath|confirmWorkflowPath' .skilled` prints only council lines, or nothing once phase `006-ai-council-mode-deprecation` lands.
- [ ] CHK-FIX-004 [P0] The flag parity guard has one negative case per direction, doc-only flag and workflow-only flag.
- [ ] CHK-FIX-005 [P1] The plan matrix of 2 commands by 2 modes by 2 dry-run states is covered by T074 to T077 and the existing non-dry-run suite.
- [ ] CHK-FIX-006 [P1] The four new scripts read no environment variable that the inline bodies did not read, checked with `rg -n 'process.env' $R/scripts/loop-heartbeat.cjs $R/scripts/run-now-sentinel.cjs $R/scripts/iteration-graph-upsert.cjs $R/scripts/dispatch-iteration.cjs`.
- [ ] CHK-FIX-007 [P1] `implementation-summary.md` pins evidence to the phase commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'API_KEY|TOKEN|SECRET' $R/scripts/dispatch-iteration.cjs` prints only reads that the inline branches already made.
- [ ] CHK-031 [P0] `dispatch-iteration.cjs --executor unknown` exits non-zero, as T014 checks.
- [ ] CHK-032 [P1] N/A for auth. The scripts run locally under the operator's own CLI credentials and add no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `acceptance-criteria.md` all state the 140000 and 155000 byte caps.
- [ ] CHK-041 [P1] Each new script opens with a module header that states its purpose and carries no packet or phase id.
- [ ] CHK-042 [P2] `rg -c -- '--dry-run' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints at least 1 per file.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Census, inventory, ledger and dry-run transcripts live under `$P/scratch/`.
- [ ] CHK-051 [P1] `ls $P/scratch` lists only the files T004 to T077 name and `measure-workflows.sh`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
