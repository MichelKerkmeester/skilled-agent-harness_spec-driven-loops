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

`R` is `.skilled/skills/system-deep-loop/runtime`. Run every `npm test` from `R`. `L` is `R/lib/deep-research-ledger-schema`. ADR-001 chose option 1 (widen the upcast); the option 2 tasks were removed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Get the operator's choice between option 1 and option 2 and record it as ADR-001 `Accepted` with one Operator Decisions row (`decision-record.md`). Verify: `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line. Done 2026-11-17: option 1.
- [ ] T002 Capture the baseline of the REQ-007 suites (`R/tests/unit/`). Verify: `npm test -- tests/unit/append-mode-event-cli.vitest.ts tests/unit/append-mode-event-legacy-seam.vitest.ts tests/unit/check-projection-coverage.vitest.ts tests/unit/deep-research-projections-contract.vitest.ts tests/unit/verify-iteration.vitest.ts tests/integration/convergence-script.vitest.ts` exits 0 and the pass count is written in `goal.md` section 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Copy `findingsCount`, `keyQuestions` and the route-proof and telemetry fields into the `iteration_completed` data (`L/legacy-compatibility.ts`). Verify: `npm test -- tests/unit/append-mode-event-legacy-seam.vitest.ts` passes with a new case asserting both fields survive the upcast.
- [ ] T004 Add the new optional fields to the `deep_research.iteration_completed` stem rule (`L/deep-research-ledger-schema.ts`). Verify: a row carrying them passes `isData`, and a row with an unlisted field still fails, in the ledger-schema suite.
- [ ] T005 Extend `IterationCompletedData` to carry the new fields (`L/deep-research-ledger-types.ts`). Verify: `npm run typecheck` from `R` exits 0.
- [ ] T006 Write the new keys into the projected `iteration` row (`R/lib/legacy-projections/deep-research-contract.ts`). Verify: `npm test -- tests/unit/deep-research-projections-contract.vitest.ts tests/unit/check-projection-coverage.vitest.ts` passes with the new keys asserted.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add the findings-gate-runs case: the leaf record claims `findingsCount: 3`, nothing enumerates them, and the field reaches the gate only through a gateway-projected state row (`R/tests/unit/verify-iteration.vitest.ts`). Verify: the case asserts reason `findings_not_enumerated`, fails when run before the source change is applied, and passes after it.
- [ ] T010 Add the `focusAlignment` case: an answered question outside the record's key questions, with `keyQuestions` supplied only through the gateway-projected state row (`R/tests/integration/convergence-script.vitest.ts`). Verify: the case asserts `guards.focusAlignment` status `failed`, reports `notEvaluated` on the unchanged tree, and passes after the change.
- [ ] T011 Add the REQ-004 regression fixture: findings enumerated, answered questions inside key questions (`R/tests/unit/verify-iteration.vitest.ts`). Verify: the fixture passes verification and reports `focusAlignment` `passed`.
- [ ] T012 Rerun the T002 suites and compare with the baseline (`R/tests/`). Verify: the same command exits 0 and the pass count rose only by the new cases.
- [ ] T013 Write the changelog entry announcing both checks on every research run (`.skilled/skills/system-deep-loop/changelog/`). Verify: `rg -n 'focusAlignment' .skilled/skills/system-deep-loop/changelog/` prints the new entry.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The T012 rerun matches the baseline plus the new cases
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001 gates every implementation task)
<!-- /ANCHOR:cross-refs -->

---
