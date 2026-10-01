---
title: "Tasks: Phase 43: label-finding-fixes"
description: "Ordered tasks for the three label-finding fixes: baselines, one worker brief per fix, suite reruns, the cross-family review and the closure gates."
trigger_phrases:
  - "label finding fixes tasks"
  - "stop rater gold fix tasks"
  - "goal verifier clamp fix tasks"
  - "goal lint model arm tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 43: label-finding-fixes

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

- [x] T001 Baseline every suite a fix touches (S, from the repository root). Evidence: score-stop-rater 36 pass, goal-core 74, goal-slice 24, score-verifier-labeled-set 12, build-verifier-fixture 5, count-pi-goal-nudges 3, goal-pi 22, score-goal-lint 8, lint-goal-criteria 12, check-goal 16, template-parity 4, all 0 failing. The 003 scorer printed `clamp_defects: 11`
- [x] T002 Write one brief per fix (`build/fix/`, git-ignored). Evidence: `027.md`, `003.md` and `006a.md`, each naming its files, its change and its suites, with Gate 3 pre-resolved for the child worker
- [x] T003 [P] Create this phase and bind it (../goal.md, ../spec.md). Evidence: `create.sh --phase` wrote the scaffold, the parent gained binding row 043 and `goal.cjs packet` reads 3,999, `packet_budget=ok`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 027 gold and lineage filter (`score-stop-rater.cjs`, its vitest file, its catalog entry), Luna 6 max. Evidence: commit `55c33b363e`, suite 41 pass and 0 failing, census `sampled 25` with `no gold 72`
- [x] T005 [P] 003 evidence clamp (`goal-core.cjs`, `goal-core.test.cjs`, `score-verifier-labeled-set.test.cjs`, the goal README), SWE 2 max. Evidence: commit `5543f6861e`, goal-core 78 pass and the five other goal suites at their baselines, 0 failing
- [ ] T006 006 Jev arm (`score-goal-lint.cjs`, `score-goal-lint.test.cjs`), Luna 6 max, brief `006a.md`. Check: the suite passes with the stub-`jev` cases, and the three neighboring suites pass unchanged
- [ ] T007 006 Deem arm (the same two files), after T006. Check: the four `deem arm skipped:` lines against a stub `cli-deem` and no server start
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Document the 006 arms in the sk-create-goal docs that describe the scorer. Check: `validate_document.py` exits 0 on each changed doc
- [ ] T009 One DeepSeek V4.1 Flash review of the three fixes. Check: P0 and P1 fixed, P2 recorded in `goal.md`
- [ ] T010 Closure: `repair-derived.cjs --apply`, `validate.sh --strict` on this phase and the parent, `check-goal.cjs` on both. Check: `RESULT: PASSED` on each
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-01
<!-- /ANCHOR:summary -->

---



