---
title: "Tasks: Phase 15: goal-legacy-resume-and-budget-notice"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal legacy resume budget notice tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: goal-legacy-resume-and-budget-notice

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

- [ ] T001 Baseline: run the OpenCode goal suites and the shared hook suites and record the totals
- [ ] T002 Read the resume path and name the suppression reasons the retired caps and budget set (`opencode-goal.js`)
- [ ] T003 Check which docs and playbooks pass `--budget` today (`rg` over `.skilled` and `.opencode`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the failing tests first: a legacy-suppressed record resumes, an unknown reason is left alone, a recorded budget prints the notice (`opencode-goal-lifecycle.test.cjs`, `opencode-goal-capabilities.test.cjs`)
- [ ] T005 Make resume clear a suppression set by a retired reason (`opencode-goal.js`)
- [ ] T006 Print the budget notice (`opencode-goal.js`)
- [ ] T007 Say how a suppressed goal resumes and that the budget is a reading (`goal-plugin.md`, `goal-opencode.md`)
- [ ] T008 Correct limitation 2 in the phase 14 summary (`014-goal-no-budget-stop/implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Negative control: run the new tests against today's plugin and confirm each fails
- [ ] T010 Run OpenCode live with autonomy off, then on, read the plugin status counter past 8, then pause and clear the goal (`scratch/`)
- [ ] T011 Rerun the whole goal gate and the sk-code drift guards and report the delta, then run `validate.sh --strict` on this folder
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

- [ ] CHK-010 [P0] Changed code files pass `node --check` and `bash -n` where they apply
- [ ] CHK-011 [P0] No console errors or warnings in the suite output
- [ ] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start
- [ ] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [ ] CHK-021 [P0] The OpenCode goal suites and the shared hook suites pass in the final state, delta reported
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a class: the stuck record is `class-of-bug`, the silent budget is `instance-only`, the wrong cleanup sentence is `instance-only`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests.
- [ ] CHK-FIX-004 [P0] No path, parser or redaction change is in this phase, so no adversarial table applies.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written
- [ ] CHK-031 [P0] Resume validates the record state before it clears anything
- [ ] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [ ] CHK-042 [P2] README updated where the behavior changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/
- [ ] CHK-051 [P1] scratch/ holds only evidence this packet cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---
