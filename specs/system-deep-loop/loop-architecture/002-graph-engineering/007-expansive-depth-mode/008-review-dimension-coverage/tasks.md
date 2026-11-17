---
title: "Tasks: Close the out-of-contract review dimension gap (D10)"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review dimension coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Close the out-of-contract review dimension gap (D10)

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

`R` is `.skilled/skills/system-deep-loop/runtime`. Run every `npm test` from `R`. ADR-001 chose support; the enforce tasks were removed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Get the operator's choice between enforce and support and record it as ADR-001 `Accepted` with one Operator Decisions row (`decision-record.md`). Verify: `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line. Done 2026-11-17: support.
- [ ] T002 Capture the baseline of the REQ-004 suites (`R/tests/`). Verify: `npm test -- tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0 and the pass count is written in `goal.md` section 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Seed `buildDimensionCoverage` from the configured dimensions, defaulting to `REQUIRED_DIMENSIONS` when none are configured (`R/scripts/reduce-state.cjs`). Verify: `npm test -- tests/unit/deep-review-state-reducer.vitest.ts` passes with a `performance` coverage case.
- [ ] T006 Route the strategy lists, both Next Focus fallbacks and the dashboard rows through the configured list (`R/scripts/reduce-state.cjs`). Verify: `rg -n "REQUIRED_DIMENSIONS" R/scripts/reduce-state.cjs` shows it only as the default and the export.
- [ ] T007 Relax the four-name rule to allow configured custom names (`.skilled/commands/deep/assets/deep-review.yaml`). Verify: `rg -n 'canonical dimension' .skilled/commands/deep/assets/deep-review.yaml` shows the new wording.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add the custom dimension case (`R/tests/integration/review-depth-convergence.vitest.ts`). Verify: the case asserts `missingDimensions` excludes `performance` once covered, and passes.
- [ ] T010 Add a review-pivot case with a covered custom dimension (`R/tests/integration/divergent-pivot.vitest.ts`). Verify: the case accepts `all_dimensions_clean` and seeds no `unswept-dimension` for `performance`.
- [ ] T011 Rerun the T002 suites and compare with the baseline (`R/tests/`). Verify: the same command exits 0 and the pass count rose only by the new cases.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The T011 rerun matches the baseline plus the new cases
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001 gates every implementation task)
<!-- /ANCHOR:cross-refs -->

---
