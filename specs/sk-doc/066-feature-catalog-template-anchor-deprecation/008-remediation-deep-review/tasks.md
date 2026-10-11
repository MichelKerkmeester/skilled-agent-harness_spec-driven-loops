---
title: "Tasks: Phase 8: remediation-deep-review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "remediation deep review tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: remediation-deep-review

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

- [x] T001 Read the `/deep:review` contract, its auto YAML and the cli-pi skill
- [x] T002 Smoke-test the DevPass route: one-turn `PONG`
- [x] T003 Create the review config, strategy and registry, record the run opening through the append gateway, take the lock (`review/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Iteration 1, correctness of the bulk scripts and their edits (`review/iterations/iteration-001.md`)
- [x] T005 Iteration 2, security (`review/iterations/iteration-002.md`)
- [x] T006 Iteration 3, traceability of phase claims (`review/iterations/iteration-003.md`)
- [x] T007 Iteration 4, maintainability and prevent-overengineering (`review/iterations/iteration-004.md`)
- [x] T008 Iteration 5, broadened correctness on sampled catalog docs (`review/iterations/iteration-005.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-prove each iteration finding and write `review/review-report.md`
- [x] T010 Record the synthesis close-out, mark the config complete, release the lock
- [x] T011 Run `validate.sh --strict` on this phase and `--recursive --strict` on the parent
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

- [x] CHK-010 [P0] Code passes lint/format checks: not applicable, no product code written
- [x] CHK-011 [P0] No console errors or warnings: each iteration check printed OK
- [x] CHK-012 [P1] Error handling implemented: a failed iteration check redispatches once
- [x] CHK-013 [P1] Code follows project patterns: state written only through the append gateway
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: each kept finding re-proved
- [x] CHK-022 [P1] Edge cases tested: the sk-vision environment gap excluded
- [x] CHK-023 [P1] Error scenarios validated: no DevPass limit was hit
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: recorded per finding in the report
- [x] CHK-FIX-002 [P0] Same-class producer inventory: whole-tree changelog scan for F-001
- [x] CHK-FIX-003 [P0] Consumer inventory: not applicable, review only
- [x] CHK-FIX-004 [P0] Security/path/parser fixes: not applicable
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md
- [x] CHK-FIX-006 [P1] Hostile env variant: not applicable
- [x] CHK-FIX-007 [P1] Evidence pinned to the reviewed commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: reviewed content treated as data
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: not applicable
- [x] CHK-042 [P2] README updated (if applicable): not applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: driver scripts stayed in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-10
<!-- /ANCHOR:summary -->

---
