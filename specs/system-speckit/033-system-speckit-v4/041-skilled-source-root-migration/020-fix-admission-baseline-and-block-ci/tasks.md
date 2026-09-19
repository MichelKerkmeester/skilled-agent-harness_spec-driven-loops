---
title: "Tasks: Phase 20: fix-admission-baseline-and-block-ci"
description: "Ordered tasks for phase 20."
trigger_phrases:
  - "admission baseline fix tasks"
  - "phase 20 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: fix-admission-baseline-and-block-ci

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

- [ ] T001 Record the admission report as the before state
- [ ] T002 Trace each drift to its compiler or router rule
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Keep command-bridge lanes out of bare prompts (system-deep-loop)
- [ ] T004 Honor explicit mode hints (system-deep-loop)
- [ ] T005 Route the natural-language quality holdout (sk-doc)
- [ ] T006 Correct the stale gold entry (sk-doc playbook)
- [ ] T007 Re-mint and promote the affected manifests
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Rerun admission, parity and the route guard
- [ ] T009 Drop `--warn-only` from the CI step
- [ ] T010 Show a broken gold entry failing CI
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Pending
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Pending
- [ ] CHK-011 [P0] Pending
- [ ] CHK-012 [P1] Pending
- [ ] CHK-013 [P1] Pending
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Pending
- [ ] CHK-021 [P0] Pending
- [ ] CHK-022 [P1] Pending
- [ ] CHK-023 [P1] Pending
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Pending
- [ ] CHK-FIX-002 [P0] Pending
- [ ] CHK-FIX-003 [P0] Pending
- [ ] CHK-FIX-004 [P0] Pending
- [ ] CHK-FIX-005 [P1] Pending
- [ ] CHK-FIX-006 [P1] Pending
- [ ] CHK-FIX-007 [P1] Pending
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Pending
- [ ] CHK-031 [P0] Pending
- [ ] CHK-032 [P1] Pending
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Pending
- [ ] CHK-041 [P1] Pending
- [ ] CHK-042 [P2] Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Pending
- [ ] CHK-051 [P1] Pending
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---



