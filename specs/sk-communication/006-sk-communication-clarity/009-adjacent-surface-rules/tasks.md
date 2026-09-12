---
title: "Tasks: Phase 9: adjacent-surface-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "adjacent surface tasks"
  - "confirm the target file"
  - "additive template"
  - "owning gate run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: adjacent-surface-rules

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

- [ ] T001 Confirm phase 2 adopted both candidates, or only one, and record which
- [ ] T002 Read the code skill's own routing to confirm which file actually owns comment guidance, rather than trusting a path pattern
- [ ] T003 [P] Read the existing comment-hygiene hard blocker in full, so the addition can name it as winning
- [ ] T004 Capture the baseline: which existing rule files validate against the current template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the present-state comment rule to the file the code skill's routing named
- [ ] T006 State in that addition that the existing hard blocker wins on any collision
- [ ] T007 Add the example-and-repair ingredient to the repo-rule template, additively
- [ ] T008 Confirm the template change requires no new section in an existing rule file
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the code skill's own gate and read its output and exit status
- [ ] T010 Run the documentation skill's own gate and read its output and exit status
- [ ] T011 Validate a sample of existing rule files against the changed template with no edits
- [ ] T012 Read the comment addition beside the hard blocker and attempt the exception reading
- [ ] T013 Confirm no communication rule text or wording-standard text was copied into either surface
- [ ] T014 Confirm the scoped diff touches only the two surfaces
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
- [ ] CHK-003 [P1] The code skill's real target file confirmed by reading its routing, not assumed from a path pattern
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Both additions trace to adopted rows in phase 2's decision record
- [ ] CHK-011 [P0] The comment addition names the existing hard blocker as winning on collision
- [ ] CHK-012 [P1] The template change is additive and requires no new section anywhere
- [ ] CHK-013 [P1] Each addition follows its host asset's existing shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Both owning skills' gates pass from the final state, output and exit status read
- [ ] CHK-022 [P1] A sample of existing rule files validated against the changed template unedited
- [ ] CHK-023 [P1] The exception reading of the comment addition attempted and rejected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate carries a finding class, and the template change is treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run over every asset stating comment guidance
- [ ] CHK-FIX-003 [P0] Consumer inventory run over rule files authored from the template
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [ ] CHK-FIX-005 [P1] Matrix axes listed: surface by candidate, two rows, two gates
- [ ] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or private identifier enters either surface
- [ ] CHK-031 [P0] Nothing added relaxes the comment-hygiene hard blocker or any verification standard
- [ ] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Any code comment touched states present behaviour rather than past approaches, which is the rule this phase adds
- [ ] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes
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
| P0 Items | 13 | 0/13 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---
