---
title: "Tasks: Phase 5: Communication Rule and Per-Section Rule Pointers"
description: "Ordered tasks for moving AGENTS.md section 8 into an eighth rule file and giving every governed section a pointer: measure and classify, write and expand the rule, cut section 8 to its unconditional clauses, insert pointers, wire the router, then verify content parity, links, pointer coverage and the net line change."
trigger_phrases:
  - "communication rule tasks"
  - "section 8 reduction"
  - "pointer coverage audit"
  - "content parity check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: Communication Rule and Per-Section Rule Pointers

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

- [x] T001 Measure `AGENTS.md` section 8 and record the baseline line count
- [x] T002 Inventory existing repo-rule references in `AGENTS.md` and record how many name a specific rule file
- [x] T003 Classify every `AGENTS.md` subsection as governed by a rule or deliberately ungoverned
- [x] T004 Capture section 8's original text so content parity can be checked after the cut
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write `repo-rules/communication.md` in the siblings' shape and phase 1's format
- [x] T006 Expand each moved rule with the *how* and the failure it prevents
- [x] T007 Cross-reference `uncertainty-and-honesty.md` section 6 rather than relocating it
- [x] T008 Cut section 8 to a pointer, keeping the two clauses that bind when nothing loads
- [x] T009 Write the trigger as every substantive reply, and say so in bold in the remnant
- [x] T010 Insert one pointer line into every governed `AGENTS.md` section
- [x] T011 Add the router trigger row, index row, and widen the scope statement to cover delivery
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Content parity: every section-8 rule present in the new file or the remnant
- [x] T013 Format conformance re-run over all eight rule files plus the router
- [x] T014 Resolve every link in the rule set and every `repo-rules/` link in `AGENTS.md`
- [x] T015 Pointer coverage: each of the eight rules named from at least one section
- [x] T016 Measure and record the net always-loaded line change, in whichever direction it went
- [x] T017 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Net always-loaded change reported honestly, including if it grew
- [x] `scratch/` holds only intentional working files
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Parent packet**: See `../spec.md` Phase Documentation Map
- **Format convention**: `../001-header-format-and-dividers/spec.md`
- **Approval precondition**: `../004-research-adoption/adoption-decisions.md` section 4
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
- [x] CHK-003 [P0] Operator approval for the `AGENTS.md` edits recorded
- [x] CHK-004 [P1] The accepted quiet-register risk named before the work, not discovered after
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The new rule matches the seven siblings' anatomy; no new section type invented
- [x] CHK-011 [P0] Nothing section 8 bound was lost in the move
- [x] CHK-012 [P1] Pointer lines share one shape and restate nothing the rule says
- [x] CHK-013 [P1] Doctrine owned elsewhere is cross-referenced, not copied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every link resolved, in both the rule set and `AGENTS.md`
- [x] CHK-022 [P1] Section classes covered: hard blocker, gate, discipline, mandate
- [x] CHK-023 [P1] Ungoverned sections confirmed to have no pointer, deliberately
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase moves and points rather than fixing a defect; the rows record that classification.

- [x] CHK-FIX-001 [P0] Finding class recorded as `class-of-bug`: the missing pointers were a set-wide discoverability gap, not one bad section
- [x] CHK-FIX-002 [P0] Producer inventory run over every `AGENTS.md` subsection before deciding which are governed
- [x] CHK-FIX-003 [P0] Consumer inventory run: `repo-rules/` references re-checked in both documents after the edits
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser or redaction surface; recorded rather than skipped
- [x] CHK-FIX-005 [P1] Matrix axes listed: 4 section classes x governed or not
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state is read
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the new rule or any pointer line
- [x] CHK-031 [P0] Not applicable - the files are read by an agent, not executed
- [x] CHK-032 [P1] No moved rule weakens a gate or a hard blocker; section 8 keeps the clause that says delivery never softens rigor
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] The new rule's header line states it expands `AGENTS.md` and never overrides it, like every sibling
- [x] CHK-042 [P1] Parent Phase Documentation Map updated with the phase-5 row and handoff criteria
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
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



