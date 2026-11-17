---
title: "Tasks: Completed-Run Extension (--extend=N)"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "completed run extension tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Completed-Run Extension (--extend=N)

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

Shell variables: `S` is `.skilled/skills/system-deep-loop`, `C` is `.skilled/commands/deep/assets`, `SSK` is `.skilled/skills/system-spec-kit/runtime/cli/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 List every hand-written `run_resumed` handler the new stem needs a twin in (`$S/runtime/lib/`, `$S/runtime/scripts/`, `$S/deep-research/scripts/reduce-state.cjs`). Verify: `rg -n 'run_resumed' $S/runtime $S/deep-research/scripts` output is copied into `scratch/run-resumed-sites.txt` and covers the reducers, projections, filters and stem-producer tables named in `spec.md` §3.
- [ ] T002 Record the test baseline before any edit (`$S/runtime`). Verify: `npx vitest run` in `$S/runtime` prints its pass and fail counts, saved to `scratch/baseline.txt`.
- [ ] T003 Record the operator's answers, or acceptance of the recommended defaults, for open questions 1 to 4 (`spec.md`). Verify: `rg -n 'Open question [1-4]' spec.md` prints four lines and each carries a decision.
- [ ] T004 Trace every `:confirm` branch from `step_classify_session` onward for a config with status `initialized` (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `scratch/confirm-branch-trace.md` lists each branch with file:line and its classification, and every one lands on `resume`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the `deep_research.run_extended` stem with its payload fields and a stem-producer table row (`$S/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts`). Verify: `rg -n 'run_extended' $S/runtime/lib/deep-research-ledger-schema` prints the schema, type and producer-table lines.
- [ ] T006 Add the `deep_review.run_extended` stem with its payload fields and a stem-producer table row (`$S/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts`, `deep-review-ledger-types.ts`). Verify: `rg -n 'run_extended' $S/runtime/lib/deep-review-ledger-schema` prints the schema, type and producer-table lines.
- [ ] T007 Add the legacy `run_extended` row upcast (`$S/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`). Verify: the upcast suite case for a legacy `run_extended` row passes under `npx vitest run`.
- [ ] T008 [P] Handle the stem in the research typed reducer's routing table and every `assertNeverStem` switch (`$S/runtime/lib/deep-research-reducers/deep-research-reducer.ts`). Verify: `npx tsc --noEmit` in `$S/runtime` exits 0.
- [ ] T009 [P] Handle the stem in the review typed reducer's routing table and every `assertNeverStem` switch (`$S/runtime/lib/deep-review-reducers/deep-review-reducer.ts`). Verify: `npx tsc --noEmit` in `$S/runtime` exits 0.
- [ ] T010 Write the stem back into the state log in both legacy projections (`$S/runtime/lib/legacy-projections/deep-research-contract.ts`, `deep-review-state-contract.ts`). Verify: `node $S/runtime/scripts/check-projection-coverage.cjs` exits 0.
- [ ] T011 Add the stem to the lifecycle-event filters and add `completed-continue` to `LIVE_LINEAGE_MODES` (`$S/deep-research/scripts/reduce-state.cjs`, `$S/runtime/scripts/reduce-state.cjs`). Verify: `rg -n 'LIVE_LINEAGE_MODES = ' $S/runtime/scripts/reduce-state.cjs` prints a set that includes `completed-continue`.
- [ ] T012 Move `completed-continue` from `lineage.deferredModes` to `lineage.allowedModes` in research and add the mode to the review flat lineage fields (`$S/deep-research/assets/deep-research-config.json`, `$S/deep-review/assets/deep-review-config.json`). Verify: `node -e` reading the research config prints `completed-continue` in `allowedModes` and not in `deferredModes`.
- [ ] T013 Add the `--extend=N` and `--extend-minutes=M` parameters and the lineage param value, rejecting a non-positive or non-integer value before the lock (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n 'extend' $C/deep-research.yaml $C/deep-review.yaml` prints the param lines in both files.
- [ ] T014 Add the locked pre-classify extension step after `step_acquire_lock` and before `step_classify_session`, computing `continuedFromRun`, `maxIterations`, `maxDurationMinutes` and status `initialized`, leaving `createdAt` untouched (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: in both files the new step's line number sits between the `step_acquire_lock:` and `step_classify_session:` lines printed by `rg -n`.
- [ ] T015 Append `run_extended` through the gateway from the pre-classify step and apply the chosen `resumed` handling in `on_resume` (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n 'run_extended' $C/deep-research.yaml $C/deep-review.yaml` prints the append in both files.
- [ ] T016 Add the synthesis snapshot step with the name chosen for open question 2 (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n -e 'synthesis-v' -e 'review-report-v' $C/deep-research.yaml $C/deep-review.yaml` prints the snapshot step in both files.
- [ ] T017 Replace `note_deferred_branches` and the YAML comment lines so only `fork` stays deferred (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n 'completed-continue.*deferred' $C` prints nothing.
- [ ] T018 Document `--extend=N` and `--extend-minutes=M` in the `--lineage-mode` rows (`.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md`). Verify: `rg -n 'extend=' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints a row in each.
- [ ] T019 [P] Update the lifecycle branch contract and the snapshot rule, and state the `stopPolicy: convergence` window (`$S/deep-research/references/protocol/loop-protocol.md`, `$S/deep-review/references/protocol/loop-protocol.md`). Verify: `rg -n 'completed-continue' $S/deep-*/references/protocol/loop-protocol.md` shows no line calling it deferred and one line naming the convergence window.
- [ ] T020 [P] Update the remaining deferred-wording lines (`$S/deep-review/assets/review-mode-contract.yaml`, `$S/deep-review/references/state/state-format.md`, both quick references, `$S/deep-research/SKILL.md`, `$S/deep-research/assets/deep-research-strategy.md`, `.skilled/agents/deep-research.md`, `.skilled/agents/deep-review.md`, `$S/deep-review/README.md`). Verify: `rg -n -e 'completed-continue.*deferred' -e 'deferred.*completed-continue' .skilled --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' --glob '!**/fixtures/**'` prints nothing.
- [ ] T021 Update the two assertions that pin the deferred wording (`$SSK/deep-review-contract-parity.vitest.ts:126`, `$SSK/deep-review-reducer-schema.vitest.ts:120-121`). Verify: `npx vitest run deep-review-contract-parity deep-review-reducer-schema` in the `system-spec-kit` runtime exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Add the ledger-schema, upcast and `append-mode-event-legacy-seam` cases for `run_extended` (`$S/runtime/tests/unit/deep-research-ledger-schema.vitest.ts`, `deep-review-ledger-schema.vitest.ts`, `append-mode-event-legacy-seam.vitest.ts`). Verify: `npx vitest run ledger-schema append-mode-event-legacy-seam` exits 0.
- [ ] T023 Add the `run_extended` projection case and the reducer Lifecycle-section parity case (`$S/runtime/tests/unit/deep-research-reducers.vitest.ts`, `deep-review-reducers.vitest.ts`). Verify: `npx vitest run reducers` exits 0 and the projection case asserts the event in the state log.
- [ ] T024 Add the 7-of-10 plus `--extend=3` cap case and the duration-ceiling case that starts after the old budget (`$S/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts`, `$SSK/deep-review-auto-restart-contract.vitest.ts`). Verify: both suites exit 0; the cap case asserts `maxIterations == 10` and the duration case asserts one dispatch.
- [ ] T025 Add the double-terminal telemetry case (two `completed` rows for one sessionId) (the telemetry ledger suite under `$S/runtime/tests/unit/`). Verify: the case passes under `npx vitest run`.
- [ ] T026 Run both guard scripts (`$S/runtime/scripts/check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs`). Verify: each exits 0.
- [ ] T027 Rerun the whole suite and compare with the baseline (`$S/runtime`). Verify: `npx vitest run` prints no new failure against `scratch/baseline.txt`.
- [ ] T028 Add and walk one playbook entry per loop that extends a completed fixture run (`$S/deep-research/manual-testing-playbook/`, `$S/deep-review/manual-testing-playbook/`). Verify: the walked entry records one `run_extended` row, the snapshot file and the original sessionId.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] A fixture run extended from 7 of 10 with `--extend=3` ends at 10 iterations in one session, and the deep-loop suite shows no new failure against the baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Design source**: `../research/research.md` §19 and §20 Slice A; verification rows F1, F6, F7, F8, F16 to F19 in `../scratch/opus-verification-log.md`
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

A blocked task is marked `[B]` with the blocker named on the line; a `[B]` task blocks close until it is resolved or the operator defers it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Open questions 1 to 4 decided (T003) and the `:confirm` trace written (T004)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npx tsc --noEmit` in the deep-loop runtime exits 0
- [ ] CHK-011 [P0] `node --check` passes on both edited `reduce-state.cjs` files
- [ ] CHK-012 [P1] Invalid `--extend` and `--extend-minutes` values exit with a usage error before the lock
- [ ] CHK-013 [P1] No code comment embeds a spec path, phase number or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Playbook entry walked for both loops
- [ ] CHK-022 [P1] Duration-ceiling and second-extension cases pass
- [ ] CHK-023 [P1] Non-complete run and invalid-value cases rejected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] D11 is classed `cross-consumer`: one new stem with many consumers.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed from `rg -n 'run_resumed'` (T001).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the stem, the config fields, the docs and the two `system-spec-kit` assertions.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix; the input validation cases are covered by CHK-023.
- [ ] CHK-FIX-005 [P1] Matrix axes from `plan.md` (loop, stopPolicy, start time, extension count) and their rows are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] N/A: the change reads no process-wide state beyond the existing config and lock.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential is read or written by the extension step
- [ ] CHK-031 [P0] `--extend` and `--extend-minutes` accept positive integers only
- [ ] CHK-032 [P1] The config mutation and the event append run under the loop lock
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `loop-protocol.md` snapshot line and the YAML snapshot step use the same name
- [ ] CHK-042 [P2] Changelog notes the new opt-in flag
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified (status Planned)
<!-- /ANCHOR:summary -->

---
