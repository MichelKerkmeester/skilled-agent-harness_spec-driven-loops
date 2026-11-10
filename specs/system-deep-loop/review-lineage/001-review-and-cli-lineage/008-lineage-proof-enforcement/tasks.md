---
title: "Tasks: Phase 8: lineage-proof-enforcement"
description: "The ordered work for gating a CLI lineage on route proof, reducer output, one state row per iteration and in-bounds citations before it counts as fulfilled."
trigger_phrases:
  - "lineage proof enforcement tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: lineage-proof-enforcement

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Copy the `deepseek-4` lineage shape into a test fixture: 5 iterations, 11 state rows, route proof only in rows 7 to 11 and in the deltas, no dashboard (`runtime/tests/unit/fanout-run.vitest.ts`)
- [ ] T002 [P] Build a research lineage fixture with a registry and no dashboard (`runtime/tests/unit/fanout-merge-reducer-provenance.vitest.ts`)
- [ ] T003 [P] Build an iteration fixture citing line 83 of an 81-line file, and one citing a range `:83-84` (`runtime/tests/unit/verify-iteration.vitest.ts`)
- [ ] T004 Run all three new cases against the current code and record that each fails
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Call `verify` from `verify-iteration.cjs` for every iteration of a CLI lineage before the worker returns at `fanout-run.cjs:3984`, throwing on the first failure (`runtime/scripts/fanout-run.cjs`)
- [ ] T006 Reject a lineage whose state log holds two `type: iteration` rows for one iteration, and decide whether `retainIterationRecords` at `fanout-run.cjs:754-766` still has a caller (`runtime/scripts/fanout-run.cjs`)
- [ ] T007 Measure the reducer's cost on one lineage, then either refuse a missing dashboard at `fanout-merge.cjs:719` or run `reduce-state.cjs` in the worker, recording the choice and the measurement (`runtime/scripts/fanout-merge.cjs` or `runtime/scripts/fanout-run.cjs`)
- [ ] T008 Inventory every reader of the projected iteration row, then add `mode`, `target_agent`, `agent_definition_loaded` and `resolved_route` to it (`runtime/lib/legacy-projections/deep-research-contract.ts`)
- [ ] T009 Repeat T008 for the review projection if the same-class inventory finds it drops the same fields (`runtime/lib/legacy-projections/deep-review-state-contract.ts`)
- [ ] T010 Add the citation-bounds check, reusing spec-kit's resolver in `check-source-tags-helper.mjs` if it can be imported, and report past-end, range past-end and missing file separately (`runtime/scripts/verify-iteration.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Rerun the T004 cases and confirm each now passes
- [ ] T012 Run the whole deep-loop unit suite from the final state and account for the delta against the baseline taken before T005
- [ ] T013 Re-merge the saved 2026-10-12 run and confirm `deepseek-3` and `deepseek-4` are refused or carry a reducer dashboard
- [ ] T014 Record in `implementation-summary.md` the producer of the duplicates with path:line and the choice made in T007
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance row Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] A gate that cannot read its input fails its own lineage and never aborts the run
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Each new fixture failed against the pre-change code
- [ ] CHK-022 [P1] Edge cases tested: range citation, missing file, zero iterations
- [ ] CHK-023 [P1] Error scenarios validated: unreadable dashboard, unreadable state log
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] The citation path resolver has adversarial cases for outside-root, missing file, range and no-line citations.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Cited paths are resolved inside the repository root only
- [ ] CHK-032 [P1] No new file writes outside the lineage folder
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments state the reason for each gate, with no packet or phase numbers
- [ ] CHK-042 [P2] The runtime scripts README names the new gates
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
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-12
<!-- /ANCHOR:summary -->
