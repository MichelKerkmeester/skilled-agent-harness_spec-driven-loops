---
title: "Tasks: Prove the pointer contract, run the failure mutation, and close the packet's acceptance criteria"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Closure and proof for the pointer contract

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

- [x] T001 Confirm phases 001 through 007 each report `RESULT: PASSED` at their own final state (dependency check, no file changed) — Evidence: all seven phase folders report RESULT: PASSED in their own summaries; the packet-level gate re-run from the final state passed (29 checks, 0 failures)
- [x] T002 Locate phase 001-register-and-contract's AC-005 disposition, a restatement in `acceptance-criteria.md` or a decision record. Escalate rather than proceed if neither exists (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/acceptance-criteria.md`, `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/decision-record.md`) — Evidence: phase 001's AC-005 disposition exists in 001-register-and-contract/tasks.md (open-questions-resolved anchor): a recommendation to restate against the declaration surface
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run `node scripts/check-corpus.cjs --render` from the final state and record the literal `RESULT:` line (`scripts/check-corpus.cjs`) — Evidence: RESULT: PASSED literal, 29 checks 0 failures, render assertions present (render:30, settled-render:60, dark-render:30, determinism:30)
- [x] T004 Execute the AC-006 mutation on `heat-matrix.html`, `cp` it aside, add `data-chart-inert="every encoded value is printed beside its mark"` to its root `<figure>`, confirm a named `RESULT: FAILED`, restore from the copy, confirm `RESULT: PASSED` (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html`) — Evidence: FAIL [interaction-hygiene] assets/templates/heat-matrix.html naming the contradiction branch, RESULT: FAILED; restored byte-identical (sha256 746ba037...df720b56), git clean, re-run RESULT: PASSED
- [x] T005 Walk one form per contract class by keyboard, `box-plot.html` for `tooltip`, `waterfall.html` for `terminal`, and one of the six inert forms, confirming every card-revealed value is present in that form's `data-chart-table` and the six `tabindex` controls latch with a focus ring on tab only (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/box-plot.html`, `waterfall.html`) — Evidence: CDP walks over box-plot, waterfall, bar-columns and all six legend forms; Tab reaches legend entries with visible ring, Enter latches, card values all present in the table
- [x] T006 Open each of the 13 tooltip-contract forms with scripting disabled and confirm the figure and table read as they do today (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html`) — Evidence: all 21 templates walked with scripting disabled; six forms compared byte-for-byte against HEAD baseline with identical visible and SVG text
- [x] T007 Confirm first paint on the heaviest form is readable before any pointer logic has run (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/calendar-grid.html`) — Evidence: all 21 templates at Page.loadEventFired carry full figure content; heaviest form is bar-line-composed (35,377 bytes), not calendar-grid; ADR-004
- [x] T008 Grep the corpus for external `src`, `href` and `import` targets and confirm the count matches the pre-packet baseline (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html`, `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html`) — Evidence: checker-pattern grep zero matches at HEAD and final tree across 30 files; no-external check 180 assertions 0 failures
- [x] T009 Record the per-file byte delta with `wc -c` before and after for every file phases 001 through 007 changed, using the measured 7,016-byte figure for an unmodified copy of the excerpt rather than remeasuring it (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/acceptance-criteria.md`) — Evidence: per-file byte table written into acceptance-criteria.md AC-011; card copies 6,306-7,196 bytes vs the 7,016 excerpt
- [x] T010 Write the O3 completeness-question answer, defer with a stated reason or flag a future phase, into `template-contract.md` or a new decision record (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`, `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/decision-record.md`) — Evidence: O3 answer deferred in writing in 008-closure-and-proof/decision-record.md ADR-003, not template-contract.md, per the orchestrator scope lock on skill reference docs
- [x] T011 Fill every row of `acceptance-criteria.md`'s Status, Verification and Waiver columns with the evidence T003 through T010 produced, creating `decision-record.md` entries for any row marked `Waived` or `Superseded` that does not already have one (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/acceptance-criteria.md`, `decision-record.md`) — Evidence: all 11 rows Met or Superseded, none Open; AC-005 Superseded against ADR-001
- [x] T012 Write `acceptance-criteria.md`'s Closure Statement, naming which criteria carried the packet and what was consciously left out (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/acceptance-criteria.md`) — Evidence: Closure Statement written: Closeable Yes
- [x] T013 Reconcile `spec.md`'s Status field and any shipped or current-state claim against the finished `acceptance-criteria.md` (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/spec.md`) — Evidence: parent spec.md status In Progress → Complete; child spec.md Draft → Complete; implementation-summary written to agree
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Re-read every row of `acceptance-criteria.md` and confirm none still reads `Open` (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/acceptance-criteria.md`) — Evidence: re-read complete; no row reads Open
- [x] T015 Confirm no document in the packet claims a completion state another contradicts (`spec.md`, `acceptance-criteria.md`, this phase's own `implementation-summary.md`) — Evidence: spec.md, acceptance-criteria.md and implementation-summary.md all claim the same final state
- [x] T016 Confirm the AC-006 mutation left no working-tree diff outside the documents this phase is scoped to touch (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html`) — Evidence: git status clean for heat-matrix.html after restore; sha256 byte-identical
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
|----------|----------|--------------------|
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

- [x] CHK-010 [P0] Code passes lint/format checks (no code written by this phase; checker corpus runs clean)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (no new error handling; the mutation error path was exercised instead)
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (no input surface touched)
- [x] CHK-032 [P1] Auth/authz working correctly (no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable) (no README change in scope)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (walk harnesses and logs live in the phase scratch/)
- [x] CHK-051 [P1] scratch/ cleaned before completion (walk harnesses deleted after use; gate and mutation logs retained as evidence)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---
