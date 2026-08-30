---
title: "Tasks: Retirement Read-Path Closure"
description: "Work items and the verification protocol for the five read-paths the checklist retirement left behind."
trigger_phrases:
  - "read path closure tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retirement Read-Path Closure

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:notation -->
## Task Notation

`[P0]` blocks completion · `[P1]` required or explicitly deferred · `[P2]` optional.
A task is done when its evidence cell names something that was actually observed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Record the five controls: what each check reports today while doing nothing
- [x] T002 [P1] Inventory every caller of the shared flag parser before changing it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Phase children honour the requested level instead of being fixed at level 1
- [x] T004 [P0] The upgrade path re-assembles `tasks.md` at the new level, preserving authored content
- [x] T005 [P0] Decide whether the deleted evidence rule needs a blocking successor, and record the reasoning
- [x] T006 [P0] Restore level-2 inference in both modules, keyed on the replacement document
- [x] T007 [P1] The flag parser reports an unrecognized value rather than disabling
- [x] T008 [P1] Sweep the eight reference documents, keeping historical mentions
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Each control observed failing against pre-change code
- [x] T010 [P0] A freshly scaffolded level-2 phase child has the verification region
- [x] T011 [P0] An upgraded packet matches a natively scaffolded one
- [x] T012 [P1] If a successor is proposed, enumerate the id shapes the deleted rule missed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every P0 task above is checked with observed evidence, every row in `acceptance-criteria.md`
is `Met`, `Waived` or `Superseded`, and `validate.sh --strict` reports `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and scope: `spec.md`
- Ordering and rollback: `plan.md`
- Closure gate: `acceptance-criteria.md`
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
- [x] CHK-002 [P0] Ordering and rollback defined in plan.md
- [x] CHK-003 [P1] Flag-parser callers inventoried before the shared helper changes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No fix shares a file with another, so each reverts alone
- [x] CHK-011 [P1] The reference sweep removes instructions and keeps history
- [x] CHK-012 [P1] No new comment embeds an artifact identifier
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All five controls observed failing before their fixes
- [x] CHK-021 [P0] Both level-inference modules exercised, not just read
- [x] CHK-022 [P0] A scaffolded and an upgraded level-2 packet compared directly
- [x] CHK-023 [P1] The evidence-checking decision names why the rule was deleted, not just what replaced it
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 4 | 4/4 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-08-30
<!-- /ANCHOR:summary -->
