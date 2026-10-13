---
title: "Tasks: Surface tie order warning"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "surface tie order warning tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Surface tie order warning

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

- [x] T001 Create the worktree from origin/main and record the baseline: invariants suite 99 of 99, seven hub doctors exit 0
- [x] T002 Inventory the `tieBreak` checks (5e, 5i) and any doc that lists doctor check ids; record ADR-001 and ADR-002 (`decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add check 5l and call it after 5i (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`)
- [x] T004 Add the three 5l tests and the `addNamedSurfaces` fixture helper (`parent-skill-check-invariants.test.cjs`)
- [x] T005 Correct the section heading range to 5a-5l (`parent-skill-check.cjs`)
- [x] T006 Add one sentence on a hand edit of `tieBreak` to the sk-code guide (`README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the three tests against the old and new checker; record T1 to T3
- [ ] T008 Run `/deep:review :auto` for 5 iterations; fix and record each finding as an RV row
- [ ] T009 Fill the ledger, run `check-goal.cjs`, strict `validate.sh` and the gate battery
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every criterion in `goal.md` rerun and passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Goal**: See `goal.md`
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

- [ ] CHK-010 [P0] Changed scripts pass `node --check`
- [ ] CHK-011 [P0] No new console errors or warnings in the live gates
- [ ] CHK-012 [P1] The 5l message names the misplaced surface and both fixes
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Ledger rows T1 to T3 recorded with before and after verdicts
- [ ] CHK-022 [P1] Edge cases in `spec.md` checked
- [ ] CHK-023 [P1] The before-change run restored the new checker afterwards
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
- [ ] CHK-031 [P0] The check reads two JSON files it already parses and executes nothing new
- [ ] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments keep the durable why and no packet labels
- [ ] CHK-042 [P2] README updated: one sentence in the sk-code guide
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

**Verification Date**: 2026-10-13
<!-- /ANCHOR:summary -->
