---
title: "Tasks: Phase 6: reply-shape-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "reply shape tasks"
  - "ten candidates"
  - "counterweight cross-reference"
  - "size check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: reply-shape-rules

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

- [ ] T001 Confirm phase 3's split landed and validates, because this phase is blocked on it
- [ ] T002 Capture the baseline: the per-mark instruction set and each half's size before the first edit
- [ ] T003 [P] Re-read the ten allocation rows and the two halves as they stand
- [ ] T004 Assign each candidate to a half by the unit it governs, and record the assignment before writing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the sentence-relation rule into the sentence-mechanics half
- [ ] T006 Write the paragraph-progression rule into the reply-shape half
- [ ] T007 Write the first-line contract, with its positive test as well as its bans
- [ ] T008 Write the mechanism-visibility rule
- [ ] T009 Write the concise-is-not-compressed counterweight
- [ ] T010 Cross-reference the counterweight from every brevity rule in the set
- [ ] T011 Write the numbered-steps rule
- [ ] T012 Write the two-line sufficiency rule
- [ ] T013 Write the visible-item cap, with its completeness safeguard
- [ ] T014 Write the tangent-suppression rule
- [ ] T015 Write the rationale layer in the shape phase 2 chose
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Walk every router row and open every file it names
- [ ] T017 Walk both halves and confirm each is named by at least one row
- [ ] T018 Run the per-mark contradiction scan and compare with the captured baseline
- [ ] T019 Read every added rule and confirm it names a failure specific enough to argue with
- [ ] T020 Follow every counterweight cross-reference and confirm it resolves
- [ ] T021 Check both halves against the recorded size ceiling
- [ ] T022 Confirm the scoped diff touches only the two halves and, if needed, the router
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
- [ ] CHK-003 [P1] Baseline per-mark instruction set and per-half sizes captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every added rule traces to one of the ten allocation rows
- [ ] CHK-011 [P0] No added rule relaxes a hard blocker or a verification standard
- [ ] CHK-012 [P1] Each half is within its recorded ceiling, or the overflow is recorded as a finding
- [ ] CHK-013 [P1] Each rule follows the existing rule-file shape rather than inventing a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Trigger reachability verified in both directions
- [ ] CHK-022 [P1] Per-mark contradiction scan compared against the captured baseline
- [ ] CHK-023 [P1] Every counterweight cross-reference followed and confirmed to resolve
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate carries a finding class, and shared-policy rows are treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run over the root doc, the router and the rule directory
- [ ] CHK-FIX-003 [P0] Consumer inventory run for every document citing either half
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [ ] CHK-FIX-005 [P1] Matrix axes listed: governed unit by candidate, ten rows
- [ ] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential, secret path or private identifier enters a rule file
- [ ] CHK-031 [P0] Not applicable, no input-validation surface in scope
- [ ] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Not applicable, no code comments are written in this phase
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
