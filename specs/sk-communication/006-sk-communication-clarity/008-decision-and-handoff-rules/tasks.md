---
title: "Tasks: Phase 8: decision-and-handoff-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "decision and handoff tasks"
  - "qualifier against the tiers"
  - "duplication scan"
  - "edit not append"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: decision-and-handoff-rules

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

- [ ] T001 Confirm phase 2 recorded the error-reporting resolution, including the qualifier's exact form
- [ ] T002 Capture the baseline: what each of the three files currently says about close-outs and causes
- [ ] T003 [P] Re-read the five allocation rows
- [ ] T004 Locate the existing restate-the-request step, so reader triage can be distinguished from it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write reader triage before drafting, stating its distinction from the existing restate step
- [ ] T006 Write the concrete time-estimate clause
- [ ] T007 Edit the handback rule's existing obligation to carry the closing contract, rather than appending a second one
- [ ] T008 Write the state-restatement cadence as a cadence, not a preference
- [ ] T009 Write the unconfirmed-cause qualifier into the evidence rule
- [ ] T010 Read the qualifier beside the three tiers and revise until it cannot be read as licence
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the duplication scan across all three files together
- [ ] T012 Read the qualifier against the three tiers and confirm an unconfirmed cause still cannot be asserted
- [ ] T013 Confirm the handback change is an edit and not an append
- [ ] T014 Confirm reader triage states its distinction from the existing restate step
- [ ] T015 Read every added clause and confirm it names its prevented failure
- [ ] T016 Confirm the scoped diff touches only the three files and, if widened, the router
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
- [ ] CHK-003 [P1] Baseline of what the three files say about close-outs and causes, captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every clause traces to one of the five allocation rows
- [ ] CHK-011 [P0] The qualifier leaves the evidence rule's three tiers governing, verified by reading them together
- [ ] CHK-012 [P1] No file gained a section where a sentence in an existing section would do
- [ ] CHK-013 [P1] Each clause follows its host file's existing shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Duplication scan run across all three files together, not one at a time
- [ ] CHK-022 [P1] The handback change confirmed as an edit rather than an append
- [ ] CHK-023 [P1] Adversarial readings of the qualifier attempted: a cause with no status, a status that reads as confirmation, a fix with no cause
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate carries a finding class, and the evidence-rule clause is treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run over every file stating close-out content
- [ ] CHK-FIX-003 [P0] Consumer inventory run for every document citing the three files
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [ ] CHK-FIX-005 [P1] Matrix axes listed: file by candidate, five rows
- [ ] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or private identifier enters a rule file
- [ ] CHK-031 [P0] No verification standard is weakened; the qualifier narrows a reporting shape only
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
