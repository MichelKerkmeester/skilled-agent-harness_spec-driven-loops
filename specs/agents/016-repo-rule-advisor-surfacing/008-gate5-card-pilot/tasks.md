---
title: "Tasks: Gate 5 card pilot"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate 5 card pilot tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate 5 card pilot

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

- [ ] T001 Confirm `check-repo-rules.cjs` ignores a `cards/` subdirectory
- [ ] T002 Check the arm C size condition against the post-003 `AGENTS.md`
- [ ] T003 Compute block length and sample size from the phase 004 baseline and commit `preregistration.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the generator and generate the 13 cards (`build-rule-cards.cjs`)
- [ ] T005 Add check 11 (`check-repo-rules.cjs`)
- [ ] T006 Write pytest for determinism and drift
- [ ] T007 Prepare the arm B router variant and the arm C `AGENTS.md` variant
- [ ] T008 Run the rotating blocks
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Analyze per arm and apply the decision rule (`results/`)
- [ ] T010 Commit the winning arm, or remove the rejected artifacts
- [ ] T011 Run the checker and the phase 003 guard on the final state
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
- [ ] CHK-003 [P1] Predecessor handoff criteria met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Changed scripts pass their existing lint or syntax checks
- [ ] CHK-011 [P1] New code follows the surrounding file's patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Generator deterministic and check 11 catches drift
- [ ] CHK-021 [P0] Pre-registration committed before block 1
- [ ] CHK-022 [P0] Each arm at sample size
- [ ] CHK-023 [P1] Arm C size condition recorded
- [ ] CHK-024 [P1] No unused card artifacts remain
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Consumer inventory in `plan.md` affected surfaces is complete
- [ ] CHK-FIX-002 [P1] Evidence is pinned to a commit SHA, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No transcript text, secret or credential in any committed artifact
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary files in scratch/ only, cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 2/7 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
