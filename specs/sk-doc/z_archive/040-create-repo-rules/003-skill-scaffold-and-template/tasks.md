---
title: "Tasks: Phase 3: Skill Scaffold and Templates"
description: "Ordered tasks for scaffolding the mode packet and authoring both templates from the phase-2 contract rather than from a shipped rule, then proving the result by generating a real rule and running the same structural assertions the shipped corpus passes."
trigger_phrases:
  - "scaffold tasks"
  - "template authoring"
  - "structural parity"
  - "generated sample"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: Skill Scaffold and Templates

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

- [x] T001 Inspect three sibling nested modes to confirm what a mode root carries - no `description.json`, no `graph-metadata.json`
- [x] T002 Capture md5 baselines for the corpus and the hub registration files, so non-disturbance is provable
- [x] T003 Scaffold the tree from `target-tree.md`, honouring all four deferrals
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Seed `references/` with the two contract documents that govern generation
- [x] T005 Write `references/README.md` routing decision-tests first, anatomy second
- [x] T006 Author `assets/repo-rule-template.md` from the anatomy contract, corpus unopened
- [x] T007 Author `assets/repo-rules-router-template.md` from the router's measured structure
- [x] T008 Author `SKILL.md` to the `sk-create-skill` section contract, decision tests as step 1
- [x] T009 Give `SKILL.md` create, revise and retire routes, since a rule is revisable
- [x] T010 Author `README.md` for a reader outside the workflow
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Generate a real rule from the template
- [x] T012 Run the corpus assertions against the generated rule and a shipped rule, and compare
- [x] T013 Confirm the tree matches `target-tree.md` and all four deferrals are absent
- [x] T014 Confirm the corpus and the hub registration files are unchanged
- [x] T015 Confirm every packet document parses as YAML
- [x] T016 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Structural parity demonstrated, not asserted
- [x] `scratch/` holds only the generated sample used as evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Contract consumed**: `../002-inventory-and-skill-contract/`
- **Packet built**: `.opencode/skills/sk-doc/sk-create-repo-rule/`
- **Scaffold contract followed**: `.opencode/skills/sk-doc/sk-create-skill/`
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
- [x] CHK-003 [P0] Sibling mode root inspected rather than assumed
- [x] CHK-004 [P1] Baselines captured before the first write
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Templates authored from the contract, not copied from a shipped rule
- [x] CHK-011 [P0] `SKILL.md` runs the decision tests before authoring on every path
- [x] CHK-012 [P1] Nothing scaffolded that the target tree defers
- [x] CHK-013 [P1] `SKILL.md` points at the decision tests rather than embedding them
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Generated rule passes all 11 assertions a shipped rule passes
- [x] CHK-022 [P1] Both templates covered: rule and router
- [x] CHK-023 [P1] Corpus and hub confirmed unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

The defect class this phase guards against is a template that reproduces the corpus by copying it, which would hide a wrong contract until first real use.

- [x] CHK-FIX-001 [P0] Finding class recorded as `class-of-bug`: a contract that cannot generate is a contract defect, not one template's problem
- [x] CHK-FIX-002 [P0] Producer inventory: three sibling mode roots inspected before assuming the packet shape
- [x] CHK-FIX-003 [P0] Consumer inventory: none exist - nothing routes to the mode until phase 6; recorded rather than skipped
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser or redaction surface
- [x] CHK-FIX-005 [P1] Matrix axes listed: 2 templates x 5 element classes
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state is read
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any packet document
- [x] CHK-031 [P0] Not applicable - the packet is documents; nothing executes
- [x] CHK-032 [P1] `SKILL.md` forbids editing `AGENTS.md` beyond a pointer, so the mode cannot weaken a gate
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] `SKILL.md` names the revise and retire routes even though their mechanics are deferred
- [x] CHK-042 [P1] Parent Phase Documentation Map updated from Pending
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
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



