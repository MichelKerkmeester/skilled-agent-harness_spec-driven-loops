---
title: "Tasks: Phase 2: synthesis-and-decisions"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "synthesis tasks"
  - "allocation tasks"
  - "adr tasks"
  - "duplicate assignment check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: synthesis-and-decisions

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

- [ ] T001 Confirm each phase 001 lineage wrote a non-empty research.md at its exact path
- [ ] T002 Open one sampled citation per lineage and confirm it resolves
- [ ] T003 [P] Re-read the current stack so classification is against the code and the rules, not against memory of them
- [ ] T004 Build the merged recommendation list, deduplicated by what each asks for rather than by wording
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Assign a verdict to every row: adopt, reject, or already-covered
- [ ] T006 For every adopted row, name exactly one owning document
- [ ] T007 For every adopted row, name the specific failure it prevents, and reject rows that cannot name one
- [ ] T008 Write an ADR for each contested recommendation (`decision-record.md`)
- [ ] T009 Write an ADR resolving the em-dash-to-colon contradiction, naming which document changes (`decision-record.md`)
- [ ] T010 Diagnose each lineage disagreement as underspecified question or thin evidence, and record which
- [ ] T011 Answer the reader-profile question: always-binding rule, or operator-selected mode that stays off
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Confirm every row carries a verdict and no row is blank
- [ ] T013 Scan the owning-document column for any recommendation assigned twice
- [ ] T014 Confirm each proposed new rule file names why the existing documents cannot carry it
- [ ] T015 Confirm the rejection list carries a reason per rejection
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
- [ ] CHK-003 [P1] Phase 001 artifacts verified by inspection rather than by its own summary
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Not applicable, this phase writes documents and runs no build
- [ ] CHK-011 [P0] Every adopted row names a failure specific enough to argue with
- [ ] CHK-012 [P1] Every verdict traces to the lineage finding it came from
- [ ] CHK-013 [P1] ADR numbering is stable, and a changed decision supersedes rather than edits
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Duplicate-assignment scan run over the owning-document column
- [ ] CHK-022 [P1] Already-covered rows checked against the actual document text, not its summary
- [ ] CHK-023 [P1] Each lineage disagreement carries a diagnosis rather than a count
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Not applicable, this phase fixes nothing
- [ ] CHK-FIX-002 [P0] Not applicable, no producer class changes
- [ ] CHK-FIX-003 [P0] Not applicable, no helper, policy or schema field changes
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic in scope
- [ ] CHK-FIX-005 [P1] The allocation table's axes are recommendation and owning document, and the rows are the table itself
- [ ] CHK-FIX-006 [P1] Not applicable, nothing here reads process-wide state
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase 001 lineage directories, which are immutable once settled
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or key value enters the decision record
- [ ] CHK-031 [P0] Delegate findings treated as claims to check, not facts to transcribe
- [ ] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Not applicable, no code comments written in this phase
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
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---

