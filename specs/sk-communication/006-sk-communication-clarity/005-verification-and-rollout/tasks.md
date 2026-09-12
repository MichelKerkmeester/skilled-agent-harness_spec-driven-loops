---
title: "Tasks: Phase 5: verification-and-rollout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "verification tasks"
  - "negative control task"
  - "delta report task"
  - "recursive validation task"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: verification-and-rollout

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

- [ ] T001 Confirm the pre-change baseline exists and was captured before phase 003's first edit
- [ ] T002 Draft the case set: cases targeting each adopted rule's named failure, plus control cases no adopted rule covers
- [ ] T003 [P] Draft the rubric with weighted dimensions, a blocking class, and condition labels withheld from the judge
- [ ] T004 Freeze the case set before the first run, so neither condition can be tuned to it afterwards
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Build the runner, which refuses a malformed case set rather than skipping it
- [ ] T006 Run the negative control and confirm a control case's score does not move between conditions
- [ ] T007 Run both conditions and write one result file per condition
- [ ] T008 Record the per-dimension delta, including dimensions that did not move
- [ ] T009 State the release gate in terms this repository can observe, and name what it cannot observe
- [ ] T010 Add the persistence mechanism as opt-in and fail-open, only if phase 002 adopted one
- [ ] T011 Regenerate every runtime surface derived from the repository root doc
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Break the mechanism's flag deliberately and confirm the session still starts at exit zero
- [ ] T013 Compare each regenerated section against its source and confirm they match
- [ ] T014 Run `validate.sh --recursive --strict` on the parent and require an explicit PASSED line
- [ ] T015 Reconcile completion metadata across the parent and all five children
- [ ] T016 Confirm no measured regression stands unfixed or unwaived
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

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
- [ ] CHK-003 [P1] Baseline confirmed to predate phase 003's first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runner and any hook pass the repository's lint and format checks
- [ ] CHK-011 [P0] The mechanism exits zero on every error path and never blocks a session start
- [ ] CHK-012 [P1] The mechanism resolves its own paths relative to its location, not a trusted environment variable
- [ ] CHK-013 [P1] The harness follows the repository's existing benchmark shape rather than inventing a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The negative control ran first and its score did not move
- [ ] CHK-022 [P1] A malformed case set fails the run loudly rather than being skipped
- [ ] CHK-023 [P1] A scoring failure halts the run rather than recording a default score
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each landed change carries a finding class, and the regeneration is treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run: every surface generated from the repository root doc
- [ ] CHK-FIX-003 [P0] Consumer inventory run: every runtime reading a regenerated section, per its own sync manifest
- [ ] CHK-FIX-004 [P0] Adversarial cases exercised: a judge that can infer the condition, a case set edited mid-run, a default score on failure
- [ ] CHK-FIX-005 [P1] Matrix axes listed: condition by case class, four rows
- [ ] CHK-FIX-006 [P1] The mechanism exercised with a hostile environment: missing flag, unreadable flag, absent target file
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not to a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or key value appears in a case, a rubric, or a recorded run
- [ ] CHK-031 [P0] The runner validates its case set before use rather than trusting its shape
- [ ] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Any code comment states present behavior rather than past approaches
- [ ] CHK-042 [P2] Each runtime sync manifest updated if a new derived surface was added
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
| P0 Items | 14 | 0/14 |
| P1 Items | 11 | 0/11 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---

