---
title: "Tasks: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "state log leaf fields tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Restore the research leaf fields the state-log projection drops (D7, D9)

<!-- SPECKIT_LEVEL: 1 -->

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

`R` is `.skilled/skills/system-deep-loop/runtime`. `L` is `R/lib/deep-research-ledger-schema`. `SUITES` is `tests/unit/append-mode-event-cli.vitest.ts tests/unit/append-mode-event-legacy-seam.vitest.ts tests/unit/check-projection-coverage.vitest.ts tests/unit/deep-research-projections-contract.vitest.ts tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/verify-iteration.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/prompt-pack.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/integration/convergence-script.vitest.ts`. Every `npx vitest run` runs from `R`, as in `cd .skilled/skills/system-deep-loop/runtime && npx vitest run SUITES`; run from any other directory it finds no tests. ADR-001 chose option 1 (widen the upcast); the option 2 tasks were removed and the tasks renumbered.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Get the operator's choice between option 1 and option 2 and record it as ADR-001 `Accepted` (`decision-record.md`). Verify: `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line. Done 2026-11-17: option 1, recorded as OD-001 and the captured question Q001.
- [x] T002 Capture the baseline of the REQ-006 suites (`R/tests/`). Verify: `cd R && npx vitest run SUITES` exits 0 and the pass count is written in `goal.md` section 4. Done: 237 passed, exit 0; recorded in `scratch/baseline.txt` and `goal.md` §4.
- [x] T003 Confirm the `../013-no-redispatch-landed-iteration/` open question on landed-iteration redispatch reasons is decided, or that 013 is scheduled after this phase (`../013-no-redispatch-landed-iteration/spec.md`). Verify: 013's spec states its rule for `findings_not_enumerated`, or this phase's `goal.md` log records the schedule. Done 2026-11-17: decided by the operator, `findings_not_enumerated` skips the redispatch (`../013-no-redispatch-landed-iteration/decision-record.md` ADR-001).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Copy the ten REQ-005 fields into the `iteration_completed` data (`L/legacy-compatibility.ts`). Verify: `cd R && npx vitest run tests/unit/append-mode-event-legacy-seam.vitest.ts` passes with a new case asserting the fields survive the upcast, and the legacy fixtures pass unchanged. Done: `optionalLeafFields`; the legacy-seam case asserts all ten fields on the projected row and the legacy fixtures pass.
- [x] T005 Add the new optional fields to the `deep_research.iteration_completed` stem rule (`L/deep-research-ledger-schema.ts`). Verify: `cd R && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts` passes with a row carrying them accepted and a row with an unlisted field still rejected. Done: the accept case and the unlisted-field reject case pass.
- [x] T006 Extend `IterationCompletedData` to carry the new fields (`L/deep-research-ledger-types.ts`). Verify: `cd R && npm run typecheck` exits 0. Done: `npm run typecheck` exit 0.
- [x] T007 Write the ten keys into the projected `iteration` row (`R/lib/legacy-projections/deep-research-contract.ts`). Verify: `cd R && npx vitest run tests/unit/deep-research-projections-contract.vitest.ts tests/unit/check-projection-coverage.vitest.ts` passes with all ten keys asserted. Done: the ten-key case passes; `check-projection-coverage.cjs` exit 0.
- [x] T008 Scope `focusAlignment` to the latest record that carries both lists, and compare normalized text with a leading question-id prefix such as `Q1: ` removed (`R/scripts/convergence.cjs` :871-885). Verify: the REQ-009 recovery case and the REQ-004 prefixed fixture pass. Done: recovery and `Q1:`-prefixed cases pass (`convergence-script` 102 with `stop-decision`).
- [x] T009 Reword the route-proof comment at :498-501 and the warning text at :567, which say the projection carries no leaf dispatch fields (`R/scripts/verify-iteration.cjs`). Verify: `rg -n "keeps no leaf dispatch fields|carries no leaf dispatch fields" R/scripts/verify-iteration.cjs` prints nothing. Done: the rg prints nothing; verify suite 44 passed.
- [x] T010 Add `findingsCount` and `keyQuestions` to the iteration record shape, describing `keyQuestions` as the exact strategy question text with no id prefix (`.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` :66). Verify: `rg -n '"keyQuestions"' <template>` prints the record-shape line, and a `prompt-pack.vitest.ts` case asserts both fields in the rendered pack. Done: both fields in the record-shape line; prompt-pack case failed before the template edit, passes after.
- [x] T011 Regenerate the research compiled contract as the last implementation step, and again after any merge that changes a digested source; never hand-resolve its digest lines (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`). Verify: `node R/scripts/compile-command-contracts.cjs --command deep/research --write` prints the contract path, and `cd R && npx vitest run tests/unit/check-contract-drift.vitest.ts` exits 0. Done: contract regenerated; `check-contract-drift.cjs` printed `OK commands=2`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Add the findings-gate-runs case: the leaf record claims `findingsCount: 3`, nothing enumerates them, and the field reaches the gate only through a gateway-projected state row (`R/tests/unit/verify-iteration.vitest.ts`). Verify: the case asserts reason `findings_not_enumerated`, fails when run before the source change is applied, and passes after it. Done: failed before the source change (fail-before run, `scratch/baseline.txt`), passes after.
- [x] T013 Add the route-proof survival case: a gateway-projected state row passes route proof on its own (`R/tests/unit/verify-iteration.vitest.ts`). Verify: the result carries no "route proof came from deltas" warning. Done: no "came from deltas" warning on the projected row; failed before.
- [x] T014 Add the `focusAlignment` cases: the latest record answers outside its key questions, with `keyQuestions` supplied only through the gateway-projected state row; and the REQ-009 recovery run (`R/tests/integration/convergence-script.vitest.ts`). Verify: the first asserts `guards.focusAlignment` status `failed` and reports `notEvaluated` on the unchanged tree; the second reports `passed` after the aligned iteration. Done: failed (`notEvaluated`) before; `failed` and recovery `passed` after.
- [x] T015 Add the REQ-004 regression fixtures: findings enumerated with answered questions among key questions, and the generation-2 shape with `Q1: `-prefixed `keyQuestions` (`R/tests/unit/verify-iteration.vitest.ts`, `R/tests/integration/convergence-script.vitest.ts`). Verify: both pass verification and report `focusAlignment` `passed`. Done: the verify regression case and the prefixed and aligned convergence cases pass.
- [x] T016 Add the REQ-010 consumer cases: single-key-question resolution, `sourcesQueried` in the source list, and the dashboard `focusTrack` and `findingsCount` columns (`R/tests/unit/deep-research-reduce-state.vitest.ts`). Verify: `cd R && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts` passes with the three cases listed. Done: three reducer consumer cases pass (36 in the suite before the source edits).
- [x] T017 Rerun the T002 suites and compare with the baseline (`R/tests/`). Verify: `cd R && npx vitest run SUITES` exits 0 and the pass count rose only by the new cases. Done: 10 files, 252 passed, exit 0 (baseline 237 plus 15 new).
- [x] T018 Replay this packet's generation-2 deltas through `verify-iteration` and the convergence guard (`../research/deltas/`). Verify: the count of iterations that now fail either check is written in `goal.md` section 4. Done: `verify` passes 5 of 5; `focusAlignment` fails 4 of 5, recorded in `goal.md` §4 and `implementation-summary.md`.
- [x] T019 Write the changelog entry announcing both checks on every research run and naming the REQ-010 reducer consumers (`.skilled/skills/system-deep-loop/changelog/`). Verify: `rg -n 'focusAlignment' .skilled/skills/system-deep-loop/changelog/` prints nothing, because the entry sits in the deep-research folder. Deviation: the brief names `.skilled/skills/system-deep-loop/deep-research/changelog/`, so the entry is written there, and the same grep against that folder prints the entry. Done: `.skilled/skills/system-deep-loop/deep-research/changelog/v1.15.17.0.md`.
- [x] T020 Write one playbook scenario for the newly live checks through `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` (category `iteration-execution-and-state-discipline/`). Verify: `rg -l "focusAlignment" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` lists the new scenario. Done: DR-067 at `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/focus-alignment-and-findings-gate-read-leaf-fields.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The T017 rerun matches the baseline plus the new cases
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001 gates every implementation task)
<!-- /ANCHOR:cross-refs -->

---
