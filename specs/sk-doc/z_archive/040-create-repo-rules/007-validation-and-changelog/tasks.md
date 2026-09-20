---
title: "Tasks: Phase 7: Validation, Changelog and Closeout"
description: "Ordered tasks for closing the packet on evidence: choose a genuinely borderline refusal before choosing the accept case, run both through the mode, write the changelog that materializes the directory in git, follow the symlink, validate recursively and reconcile."
trigger_phrases:
  - "closeout tasks"
  - "exercise the mode"
  - "changelog symlink"
  - "recursive validation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: Validation, Changelog and Closeout

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

- [x] T001 Capture the corpus md5, so the exercise provably writes nothing into `repo-rules/`
- [x] T002 Choose the borderline refusal case and write it down BEFORE choosing the accept case
- [x] T003 Confirm phases 3-6 closed and the mode is reachable
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the refusal case; confirm the output names the failed test and the destination
- [x] T005 Run the accept case end to end; keep the produced rule as evidence
- [x] T006 Check the produced rule against the phase-3 structural assertions
- [x] T007 Check it against the phase-4 standards, which is the harder bar
- [x] T008 Attempted the advisor smoke test — unreachable, recorded as NOT RUN
- [x] T009 Write `changelog/v1.0.0.0.md` to the changelog mode's format
- [x] T010 Create `.opencode/changelog/sk-doc/create-repo-rule`, matching the sibling naming
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Follow the symlink to a real directory containing the version file
- [x] T012 Confirm the corpus is unchanged
- [x] T013 Run `validate.sh --recursive --strict` on the parent; take the first RESULT per folder
- [x] T014 Reconcile the parent: phase map, status, and completion claims agreeing
- [x] T015 Report the verdict honestly, including any defect found and the phase it belongs to
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both exercise outputs kept, whatever the verdict
- [x] `scratch/` cleaned
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **The mode under test**: `.opencode/skills/sk-doc/sk-create-repo-rule/`
- **Symlink convention**: `.opencode/changelog/sk-doc/`
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

- [x] CHK-010 [P0] No defect found by the exercise is patched in this phase
- [x] CHK-011 [P0] The refusal case was chosen before the accept case
- [x] CHK-012 [P1] The changelog matches the format its siblings use
- [x] CHK-013 [P1] The symlink name matches the sibling convention
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Recursive validation passes for the parent and all seven children
- [x] CHK-022 [P0] The symlink was followed, not merely created
- [x] CHK-023 [P1] A check that could not run is recorded as not run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

The defect class at closeout is certifying something that was never used.

- [x] CHK-FIX-001 [P0] Any defect found is classed and attributed to its owning phase
- [x] CHK-FIX-002 [P0] Producer inventory: both exercise paths run, not one
- [x] CHK-FIX-003 [P0] Consumer inventory: the corpus checked unchanged after both runs
- [x] CHK-FIX-004 [P0] Not applicable - no security surface
- [x] CHK-FIX-005 [P1] Matrix axes: 2 paths x (structure, standards, refusal naming)
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to the landing commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the changelog or the exercise outputs
- [x] CHK-031 [P0] The symlink points inside the repository
- [x] CHK-032 [P1] The exercise wrote nothing outside this phase folder and the mode's changelog
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] Parent status, phase map and completion claims agree
- [x] CHK-042 [P1] The verdict on the mode is stated plainly, including if it is unfavourable
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



