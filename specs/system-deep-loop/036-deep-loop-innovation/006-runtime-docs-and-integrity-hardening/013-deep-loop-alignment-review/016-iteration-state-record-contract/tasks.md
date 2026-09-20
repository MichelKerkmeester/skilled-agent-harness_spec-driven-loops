---
title: "Tasks: Phase 16: iteration-state-record-contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "iteration record tasks"
  - "iteration contract verification checklist"
  - "run field migration tasks"
  - "reducer iteration numbering tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: iteration-state-record-contract

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

- [x] T001 Inventory every writer and reader of the iteration-number field across `system-deep-loop`, the command templates and the agents
- [x] T002 Confirm no fan-out run is active in the checkout and no changed file carries another session's edits
- [x] T003 Baseline the two reducer suites (22 passed) and the compiled contract's freshness (identical to the compiler's output)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the regression test and watch it fail on `| undefined |` (`runtime/tests/unit/deep-review-state-reducer.vitest.ts`)
- [x] T005 Read the dashboard row's number through `getIterationRun()` (`runtime/scripts/reduce-state.cjs`)
- [x] T006 Write `iteration` beside `run` in the error-path iteration record (`commands/deep/assets/deep-research-auto.yaml`)
- [x] T007 Regenerate the compiled contract that records the template's hash (`commands/deep/assets/compiled/deep-research.contract.md`)
- [x] T008 [P] Name `iteration` as required and `run` as legacy in both state documents and the two reference examples
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run the two reducer suites (23 passed)
- [x] T010 Run the whole runtime suite (154 files, 2,681 passed, 8 skipped, 0 failed)
- [x] T011 Re-check contract freshness, document validation, comment hygiene, leaf manifests and the trigger index
- [x] T012 Search again for any writer that still records `run` alone, with a control that flags the pre-change template
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (not applicable; every check is automated)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
- [x] CHK-003 [P1] Dependencies identified and available (operator decision taken; checkout quiet)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check reduce-state.cjs` exit 0; YAML parses)
- [x] CHK-011 [P0] No console errors or warnings introduced
- [x] CHK-012 [P1] Error handling implemented (not applicable; the change reads through an existing helper)
- [x] CHK-013 [P1] Code follows project patterns (uses the reducer's own `getIterationRun()`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (not applicable; automated)
- [x] CHK-022 [P1] Edge cases tested (`run`-only records stay covered by 36 existing fixtures)
- [x] CHK-023 [P1] Error scenarios validated (error-path record now carries `iteration`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`, one field read by several reducers and written by several templates.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: a multi-line search over templates, agents, code and documents finds no `run`-only writer after the change, and flags the pre-change template when run against it.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: every non-test reader of `run` or `iteration` in `system-deep-loop` classified as changed, already tolerant, event-only or inert.
- [x] CHK-FIX-004 [P0] Adversarial cases: record with `iteration` only, `run` only, both, and neither are covered by the helper's fallback order.
- [x] CHK-FIX-005 [P1] Matrix axes listed: which key the record carries, and whether it is an iteration or an event record.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant (not applicable; no process-wide state is read)
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff against `HEAD` 78419bddb3a on `skilled/v4.0.0.0`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (not applicable; no new input)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (the regression test states why; comment hygiene check clean)
- [x] CHK-042 [P2] README updated (not applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (session scratchpad, outside the repository)
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-16
<!-- /ANCHOR:summary -->
