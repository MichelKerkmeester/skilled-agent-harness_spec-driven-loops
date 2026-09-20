---
title: "Tasks: Phase 5: Integration and Lifecycle Contract"
description: "Ordered tasks for contracting create, revise and retire: read the wiring of all eight shipped rules, derive retire as the inverse, order every path so interruption is safe, then dry-run retire against a shipped rule and confirm the router stays self-consistent."
trigger_phrases:
  - "wiring tasks"
  - "retire derivation"
  - "dry run"
  - "interruption safety"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: Integration and Lifecycle Contract

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

- [x] T001 Record the router's current trigger-row, index-row and rule-file counts as the self-consistency baseline
- [x] T002 Read the wiring of all eight shipped rules: trigger row, index row, governed-section pointer
- [x] T003 Read both phase-1 scope-statement widenings and what triggered each
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Contract the three wiring points, each with what is lost when skipped
- [x] T005 Write the create path in the order phase 1 used: file, rows, pointer
- [x] T006 Write the scope-statement check that runs before a trigger row is added
- [x] T007 Write the revise path, including when a changed firing condition forces the trigger row to change
- [x] T008 State `version` behaviour across all three paths
- [x] T009 Write the retire path as the inverse, ordered pointer-rows-file so an interruption leaves inert rather than broken state
- [x] T010 State the `AGENTS.md` boundary: pointer is mechanical, anything else escalates
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Dry-run create against a shipped rule; confirm it reproduces the actual wiring
- [x] T012 Dry-run retire against a shipped rule on paper; confirm row count still equals file count and every link resolves
- [x] T013 Replay both phase-1 widenings against the scope check; both must be caught
- [x] T014 Replace the `SKILL.md` deferral notes with pointers to this contract
- [x] T015 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Retire dry-run leaves the router self-consistent
- [x] `scratch/` cleaned
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **The worked example**: `../001-repo-rules-router/`
- **Deferral notes this replaces**: `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md`
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
- [x] CHK-003 [P1] Predecessor phase closed and its outputs available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every path is interruptible at a step boundary without leaving a dangling reference
- [x] CHK-011 [P0] No path edits `AGENTS.md` beyond a pointer
- [x] CHK-012 [P1] Retire is stated as the inverse of create, not written separately
- [x] CHK-013 [P1] The router's scope statement is referenced, not copied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Retire dry-run recorded, with counts before and after
- [x] CHK-022 [P1] Both phase-1 widenings replayed against the scope check
- [x] CHK-023 [P1] Interruption states enumerated for all three paths
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Retire has no precedent, which makes it the defect-prone path.

- [x] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug` - a wiring contract that leaves dangling references
- [x] CHK-FIX-002 [P0] Producer inventory: all eight rules' wirings read, no sampling
- [x] CHK-FIX-003 [P0] Consumer inventory: the router and `AGENTS.md` are the consumers; both read-only this phase
- [x] CHK-FIX-004 [P0] Not applicable - no security surface
- [x] CHK-FIX-005 [P1] Matrix axes: 3 paths x 3 wiring points x interrupted/complete
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to the landing commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the contract
- [x] CHK-031 [P0] Not applicable - nothing executes this phase
- [x] CHK-032 [P0] No path can modify a hard blocker or a gate in `AGENTS.md`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] `SKILL.md` no longer says the mechanics are deferred
- [x] CHK-042 [P1] Parent Phase Documentation Map updated from Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



