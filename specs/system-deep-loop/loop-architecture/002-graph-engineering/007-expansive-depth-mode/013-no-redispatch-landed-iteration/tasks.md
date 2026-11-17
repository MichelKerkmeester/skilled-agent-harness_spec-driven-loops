---
title: "Tasks: Stop redispatch_once from re-running an iteration that already landed"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "no redispatch landed iteration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Stop redispatch_once from re-running an iteration that already landed

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-deep-loop`. `C` is `.skilled/commands/deep/assets`. Every vitest command runs from `S/runtime`, where the only Vitest config lives.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline of the four suites and the full runtime suite (`S/runtime/tests/unit/`). Verify: `cd S/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts tests/unit/loop-counters-derivation.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0, and its pass count and the pass and fail counts of `cd S/runtime && npx vitest run` are written in `goal.md` §4. Done 2026-11-17: the four suites exit 0 with 4 files and 108 tests passed. Full-suite baseline: the integration tip `c898b3ad9a3` gate (3136 passed, 9 skipped, 1 load-sensitive `fanout-pool` failure recorded in the parent goal log), not rerun in this worktree.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Write the reason-table case: an `executor_missing` fixture and a `findings_not_enumerated` fixture, each with narrative, state record and delta removed in turn (`S/runtime/tests/unit/verify-iteration.vitest.ts`). Verify: the case passes on the current script and asserts `iteration_file_missing`, `state_record_missing` and `delta_file_missing`. Done: two cases, `returns executor_missing only for a landed iteration...` and `returns findings_not_enumerated only for a landed iteration...`, both pass (verify-iteration 43 of 43 before T003).
- [x] T003 Write the YAML assertion over both `redispatch_once` rules: each contains the shared literal `Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.` and names none of `iteration_file_missing`, `state_record_missing`, `delta_file_missing`, `route_proof_missing` or `route_proof_mismatch` (`S/runtime/tests/unit/verify-iteration.vitest.ts`). Verify: it fails on the current YAMLs because neither rule carries the literal. Done: the new describe `workflow redispatch rule skips reasons only a landed iteration returns` printed `2 failed | 43 passed` on the pre-change YAMLs, failing on the missing shared literal.
- [x] T008 Write the landed-plus-error-row fixture: one landed `type: iteration` record, then the `if_other_failure` row (`status: error`, `findingsCount: 0`) for the same iteration number (`S/runtime/tests/unit/loop-counters-derivation.vitest.ts`, `deep-research-reduce-state.vitest.ts`, `deep-review-state-reducer.vitest.ts`). Verify: the cases pass on the current code and assert today's end state, the error row superseding the landed record. Done: the loop-counters case asserts `{ stuckCount: 0, consecutiveFailureCount: 1 }`. The research reducer case asserts the `| 2 | landed focus | - | 0.00 | 0 | error |` row, `convergenceScore` 0 and the latest-error line. The review case asserts `- Iteration: 2 of 5` and the `0.00 | 0/0/0 | error` row. All were read from a native probe of today's reducers before the cases were written.
- [x] T004 Add the shared clause to the research rule (`C/deep-research.yaml:1539`). Verify: `grep -n 'redispatch_once:.*executor_missing, findings_not_enumerated or ledger_backing_missing' C/deep-research.yaml` prints one line. Done (`fd802c23af4`): the grep prints `deep-research.yaml:1683`.
- [x] T005 Add the same clause, word for word, to the review rule (`C/deep-review.yaml:1634`). Verify: the T004 grep on `C/deep-review.yaml` prints one line and the T003 assertion passes. Done (`fd802c23af4`): the grep prints `deep-review.yaml:1772`, and the T003 cases pass, so verify-iteration is 45 of 45.
- [x] T009 Update the verify step `command_note` in both YAMLs, which says a non-zero exit triggers `on_failure.redispatch_once`, to name the three skipped reasons (`C/deep-research.yaml:1514`, `C/deep-review.yaml:1590`). Verify: `grep -n 'triggers on_failure.redispatch_once' C/deep-research.yaml C/deep-review.yaml` prints lines that also name `executor_missing`. Done (`f58d2e58872`): both `command_note` lines end `...triggers on_failure.redispatch_once, except executor_missing, findings_not_enumerated and ledger_backing_missing, which mean the iteration already landed and skip the redispatch.`
- [x] T010 Regenerate both compiled contracts as the last implementation task (`C/compiled/deep-research.contract.markdown`, `C/compiled/deep-review.contract.markdown`). Verify: `node S/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` and `--command deep/review --write` exit 0, then `node S/runtime/scripts/check-contract-drift.cjs` exits 0. Done (`f58d2e58872`): both `--write` runs exit 0, `check-contract-drift.cjs` prints `OK commands=2`, and `check-contract-drift.vitest.ts` plus `stop-policy-yaml-parity.vitest.ts` pass 13 of 13.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the four suites and the full runtime suite from the final state (`S/runtime/tests/unit/`). Verify: the T001 commands exit as at baseline, the four-suite pass count equals the baseline plus the new cases, the full suite shows no new failure, and the existing "append-only redispatch added a corrected one" case still passes. Partly done: the four suites pass 115 (baseline 108 plus 7 new cases), and the append-only redispatch case still passes. Blocked on: the full runtime suite runs in the integration merge gate. Closed 2026-11-18: the full-suite half ran at the integration gate `adedc72e930` (all phases 001-013 merged): 190 files, 3358 passed, 11 skipped, 0 failed, against baseline `c9d8ff4` with 3095 passed and 0 failed, with no new failure.
- [x] T007 Confirm both rules still cap the redispatch at one (`C/deep-research.yaml`). Verify: `grep -c 'Never re-dispatch a given iteration more than once' C/deep-research.yaml C/deep-review.yaml` prints 1 for each file. Done: `grep -c` prints 1 for each file.
- [x] T011 Write the playbook scenario through `/create:manual-testing-playbook system-deep-loop update --path S/runtime/manual-testing-playbook`, landing under `executor/`, then walk it. No hand edit to the package. Verify: the package index lists the new scenario, and the walk shows an `executor_missing` failure on a landed iteration spends no second dispatch. Partly done: DLR-063 is written at `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` and listed in the package index. Blocked: a live run is needed where verify returns `executor_missing` on a landed iteration. The suite walk in `scratch/walk-DLR-063.txt` pins the reason table and the rule text only. Walked live 2026-11-17 (DLR-063), PASS: a real landed research iteration 5 passed verify, then, with its `iteration_start` row removed, failed with `executor_missing iteration 5 ran under executor kind 'cli-pi' but neither its iteration record nor its iteration_start row ... names an executor` (exit 1). Applying `redispatch_once` skipped the second dispatch: receipts stayed at 10 total (2 for i5), and the error row landed through the gateway (`deep-research.ledger.iteration-completed`, seq 19). Contrast: with the delta moved aside, verify returned `delta_file_missing`, which keeps its one redispatch.
- [x] T012 Write the changelog entry for this operator-visible defect fix through `/create:changelog` in `S/changelog/` (cross-phase handoff §3). Verify: the folder holds a new entry naming the landed-iteration redispatch skip. Done: `.skilled/skills/system-deep-loop/changelog/v2.1.5.0.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both YAML rules carry the shared exclusion clause, the four suites pass, both contracts show no drift, and the playbook scenario exists (four suites 115 of 115, drift check `OK commands=2`, DLR-063 written and walked live)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` §13 D14 and §20 Slice M; `../scratch/opus-verification-log.md` F5
<!-- /ANCHOR:cross-refs -->

---
