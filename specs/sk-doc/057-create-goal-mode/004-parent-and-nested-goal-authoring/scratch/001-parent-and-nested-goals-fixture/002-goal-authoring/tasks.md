---
title: "Tasks: Phase 2: goal-authoring"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: goal-authoring

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

- [x] T001 [P0] Read each child specification and acceptance-criteria source. Evidence: the goal-authoring scope names the child's own sources at `spec.md:74`.
- [x] T002 [P0] Confirm the shared goal template and authoring standards before drafting. Evidence: both resources are named in `spec.md:44`.
- [x] T003 [P1] Record the parent-binding boundary for this phase. Evidence: child binding stays in the parent goal at `spec.md:110`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Author each child goal from its own specification and acceptance criteria. Evidence: the three phase-local goals use the three child source pairs.
- [x] T005 [P0] Give each child goal one purpose sentence, decisions and three to five criteria. Evidence: every goal has one objective, a decisions table and four criteria.
- [x] T006 [P1] Keep parent binding out of all child goals. Evidence: none of the three child goals contains a binding anchor or section.
- [x] T007 [P1] Close each criterion with a single-line evidence citation. Evidence: all acceptance verification cells cite one task line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Compare every child goal with that child's own source pair. Evidence: the objective and criteria match the local phase purpose and requirements.
- [x] T009 [P0] Check the child-goal structure and binding boundary. Evidence: all three child goals have decisions and no binding section.
- [x] T010 [P1] Confirm the criteria remain phase-local and independently checkable. Evidence: each criterion names an observable goal result.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All goal-authoring tasks are checked and carry short evidence.
- [x] Each child goal uses its own source pair and has three to five local criteria.
- [x] No child goal contains a binding section.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|-------------------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Goal requirements are documented in `spec.md`. Evidence: phase requirements appear at `spec.md:103`.
- [x] CHK-002 [P0] The authoring approach is defined in `plan.md`. Evidence: the plan describes source-derived goals at `plan.md:30`.
- [x] CHK-003 [P1] The source pairs and goal standards are available. Evidence: each source file and the shared template are present.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code lint target exists for this documentation-only phase. Evidence: the phase adds no code at `spec.md:80`.
- [x] CHK-011 [P0] No executable code or console surface changed. Evidence: the plan covers Markdown goal documents at `plan.md:25`.
- [x] CHK-012 [P1] Source conflicts stop authoring rather than being resolved silently. Evidence: the error case is recorded at `spec.md:168`.
- [x] CHK-013 [P1] All goal decisions and criteria follow the same phase boundary. Evidence: the child goals cite their own specification and criteria.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are Met. Evidence: every row has task-line evidence in `acceptance-criteria.md`.
- [x] CHK-021 [P0] The three child goals were checked against their own sources. Evidence: T008 records the source review.
- [x] CHK-022 [P1] No criterion crosses into another phase. Evidence: the boundary is stated at `spec.md:74`.
- [x] CHK-023 [P1] No child goal contains a binding section. Evidence: T006 records the structure check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No code finding is being fixed in this phase. Evidence: the phase changes goal documents only.
- [x] CHK-FIX-002 [P0] All six child source files were read. Evidence: T001 records review of all three source pairs.
- [x] CHK-FIX-003 [P0] No code helper, policy or consumer changed. Evidence: this phase changes only fixture documents.
- [x] CHK-FIX-004 [P0] Adversarial code tests do not apply. Evidence: no executable behavior is in scope at `spec.md:80`.
- [x] CHK-FIX-005 [P1] The matrix covers three source pairs and three child goals. Evidence: each goal is matched with one local source pair.
- [x] CHK-FIX-006 [P1] No process-wide environment or global state is read. Evidence: authoring uses Markdown sources and the goal template.
- [x] CHK-FIX-007 [P1] Acceptance evidence uses stable paths and individual line numbers. Evidence: each verification cell cites one task line.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret was added. Evidence: all outputs are documentation.
- [x] CHK-031 [P0] No runtime input surface was introduced. Evidence: executable behavior is out of scope at `spec.md:80`.
- [x] CHK-032 [P1] No authentication surface changed. Evidence: the phase modifies no code or runtime policy.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, criteria, goal and summary describe the same phase. Evidence: the purpose is recorded at `spec.md:64`.
- [x] CHK-041 [P1] No code comments changed. Evidence: all retained anchors are template structure.
- [x] CHK-042 [P2] No README update applies. Evidence: no README is in this phase's file list at `spec.md:84`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No task-created temporary files were added. Evidence: the phase scratch folder retains only its existing `.gitkeep`.
- [x] CHK-051 [P1] The phase scratch folder has no generated output. Evidence: no scratch artifact was needed for goal authoring.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-25
<!-- /ANCHOR:summary -->

---
