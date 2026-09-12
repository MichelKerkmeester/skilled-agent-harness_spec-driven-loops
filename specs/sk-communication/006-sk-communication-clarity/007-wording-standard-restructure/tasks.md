---
title: "Tasks: Phase 7: wording-standard-restructure"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "standard restructure tasks"
  - "consumer enumeration"
  - "exclusion count"
  - "publish language search"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: wording-standard-restructure

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

- [ ] T001 Confirm phase 2 recorded the base-plus-supplement decision
- [ ] T002 Enumerate every consumer of the standard, starting from the research list and re-running the grep rather than trusting it
- [ ] T003 [P] Map each section of the standard to the reply side, the publish side, or neither
- [ ] T004 Record the current exclusion count and the current consumer list as the baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create the supplement and move the publish machinery into it
- [ ] T006 Leave the reply-scoped subsection currently inside a document-structure section on the reply side
- [ ] T007 Land the borrowability test
- [ ] T008 Land the nominalization and stacked-compression pair
- [ ] T009 Land the plain-word test
- [ ] T010 Land the literal-over-figurative rule
- [ ] T011 Land the document scan test on the side phase 2 chose
- [ ] T012 Land the worked exemplar on the side phase 2 chose
- [ ] T013 Retire the scoring-band exclusion
- [ ] T014 Restate the surviving exclusion's reason as message ownership, in the file
- [ ] T015 Update the mode's router and scope gate for the new shape
- [ ] T016 Repoint any consumer whose target filename changed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Open every reply-side consumer and confirm it resolves to the base
- [ ] T018 Open every document-side consumer and confirm it resolves to base plus supplement
- [ ] T019 Search the base for file, score and publish-threshold language and expect nothing
- [ ] T020 Count the exclusion rows and confirm exactly one remains
- [ ] T021 Confirm the base names the supplement
- [ ] T022 Run the documentation skill's own gate and read its output and exit status
- [ ] T023 Confirm the scoped diff touches only the standard's files, the scope gate, the mode router and any repointed pointer
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
- [ ] CHK-003 [P1] Consumer list and exclusion count captured as a baseline before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every added rule traces to one of the six allocation rows
- [ ] CHK-011 [P0] The surviving exclusion states message ownership as its reason, in the file
- [ ] CHK-012 [P1] The base is smaller than the current single file
- [ ] CHK-013 [P1] Both files follow the standard's existing document shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Every consumer opened, not assumed, in both families
- [ ] CHK-022 [P1] The base searched for publish language with an empty result
- [ ] CHK-023 [P1] The reply-scoped subsection confirmed to reach a reply
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate carries a finding class, and the restructure is treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run over every file stating wording guidance
- [ ] CHK-FIX-003 [P0] Consumer inventory re-run rather than inherited from the research
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [ ] CHK-FIX-005 [P1] Matrix axes listed: consumer family by file, four rows
- [ ] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or private identifier enters either file
- [ ] CHK-031 [P0] The scope gate still names every span a rewrite may never touch
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
