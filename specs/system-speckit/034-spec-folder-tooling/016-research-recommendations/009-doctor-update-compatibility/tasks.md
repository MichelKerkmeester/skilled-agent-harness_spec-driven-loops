---
title: "Tasks: External-user compatibility path for /doctor:update"
description: "Wire the check and action, build collision checking, test preview and approval flows."
trigger_phrases:
  - "doctor update compatibility tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: External-user compatibility path for /doctor:update

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

- [ ] T001 Create fixture v3 repo with old-era packets for testing (tests/)
- [ ] T002 Read Phase 8 era report output format and error cases (repo-era.mjs usage)
- [ ] T003 [P] Design path map collision detection algorithm (sketch on paper or in comments)
- [ ] T030 Confirm phases 005, 006, 008 and 010 have landed before this phase ships (parent D2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement path map collision-check function in upgrade-legacy.mjs (new function, location to choose; does not modify existing functions)
- [ ] T005 Build compatibility section in doctor-update-check.yaml that calls era report (doctor-update-check.yaml:new section)
- [ ] T006 Create doctor-update-compat-action.yaml workflow: preview, collision check, approval, move, upgrade (doctor-update-compat-action.yaml)
- [ ] T007 Update doctor/_routes.yaml to point the existing "spec-kit version migration" phrase to the new compatibility action workflow (doctor/_routes.yaml:update existing route)
- [ ] T008 Add compatibility menu option to doctor presentation assets (doctor-update-presentation.txt)
- [ ] T009 Update doctor/update.md with external-user workflow documentation (update.md:new section)
- [ ] T010 Add error handling for dirty trees, interrupted moves, and failed repairs
- [ ] T011 Add parser/action guard to detect partial or complete v3 layout moves and handle appropriately (show both, skip move step if complete, or recommend finishing if partial)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Test path map collision checker with fixture paths, add cases to `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` or `.skilled/commands/doctor/scripts/tests/*.test.cjs`
- [ ] T013 Test /doctor:update check calls era report and shows results (manual or bash test)
- [ ] T014 Test compatibility action workflow: preview, approval, move, upgrade on fixture v3 repo
- [ ] T015 Test edge cases: dirty tree rejection, interrupted move recovery, failed packet handling
- [ ] T016 Full integration test: fixture v3 repo through check → preview → approve → apply → validation passes
- [ ] T017 Update spec.md, plan.md for closure (this folder)
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

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



