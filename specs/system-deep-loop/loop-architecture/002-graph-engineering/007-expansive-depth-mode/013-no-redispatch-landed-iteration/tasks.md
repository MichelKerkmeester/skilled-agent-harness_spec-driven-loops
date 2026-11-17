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

- [ ] T001 Record the baseline of the four suites and the full runtime suite (`S/runtime/tests/unit/`). Verify: `cd S/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts tests/unit/loop-counters-derivation.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0, and its pass count and the pass and fail counts of `cd S/runtime && npx vitest run` are written in `goal.md` §4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Write the reason-table case: an `executor_missing` fixture and a `findings_not_enumerated` fixture, each with narrative, state record and delta removed in turn (`S/runtime/tests/unit/verify-iteration.vitest.ts`). Verify: the case passes on the current script and asserts `iteration_file_missing`, `state_record_missing` and `delta_file_missing`.
- [ ] T003 Write the YAML assertion over both `redispatch_once` rules: each contains the shared literal `Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.` and names none of `iteration_file_missing`, `state_record_missing`, `delta_file_missing`, `route_proof_missing` or `route_proof_mismatch` (`S/runtime/tests/unit/verify-iteration.vitest.ts`). Verify: it fails on the current YAMLs because neither rule carries the literal.
- [ ] T008 Write the landed-plus-error-row fixture: one landed `type: iteration` record, then the `if_other_failure` row (`status: error`, `findingsCount: 0`) for the same iteration number (`S/runtime/tests/unit/loop-counters-derivation.vitest.ts`, `deep-research-reduce-state.vitest.ts`, `deep-review-state-reducer.vitest.ts`). Verify: the cases pass on the current code and assert today's end state, the error row superseding the landed record.
- [ ] T004 Add the shared clause to the research rule (`C/deep-research.yaml:1539`). Verify: `grep -n 'redispatch_once:.*executor_missing, findings_not_enumerated or ledger_backing_missing' C/deep-research.yaml` prints one line.
- [ ] T005 Add the same clause, word for word, to the review rule (`C/deep-review.yaml:1634`). Verify: the T004 grep on `C/deep-review.yaml` prints one line and the T003 assertion passes.
- [ ] T009 Update the verify step `command_note` in both YAMLs, which says a non-zero exit triggers `on_failure.redispatch_once`, to name the three skipped reasons (`C/deep-research.yaml:1514`, `C/deep-review.yaml:1590`). Verify: `grep -n 'triggers on_failure.redispatch_once' C/deep-research.yaml C/deep-review.yaml` prints lines that also name `executor_missing`.
- [ ] T010 Regenerate both compiled contracts as the last implementation task (`C/compiled/deep-research.contract.markdown`, `C/compiled/deep-review.contract.markdown`). Verify: `node S/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` and `--command deep/review --write` exit 0, then `node S/runtime/scripts/check-contract-drift.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Rerun the four suites and the full runtime suite from the final state (`S/runtime/tests/unit/`). Verify: the T001 commands exit as at baseline, the four-suite pass count equals the baseline plus the new cases, the full suite shows no new failure, and the existing "append-only redispatch added a corrected one" case still passes.
- [ ] T007 Confirm both rules still cap the redispatch at one (`C/deep-research.yaml`). Verify: `grep -c 'Never re-dispatch a given iteration more than once' C/deep-research.yaml C/deep-review.yaml` prints 1 for each file.
- [ ] T011 Write the playbook scenario through `/create:manual-testing-playbook system-deep-loop update --path S/runtime/manual-testing-playbook`, landing under `executor/`, then walk it. No hand edit to the package. Verify: the package index lists the new scenario, and the walk shows an `executor_missing` failure on a landed iteration spends no second dispatch.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Both YAML rules carry the shared exclusion clause, the four suites pass, both contracts show no drift, and the playbook scenario exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` §13 D14 and §20 Slice M; `../scratch/opus-verification-log.md` F5
<!-- /ANCHOR:cross-refs -->

---
