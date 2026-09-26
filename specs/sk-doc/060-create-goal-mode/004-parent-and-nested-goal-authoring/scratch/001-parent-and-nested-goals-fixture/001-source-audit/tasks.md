---
title: "Tasks: Phase 1: source-audit"
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
# Tasks: Phase 1: source-audit

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

- [x] T001 [P0] Read the parent phase map and identify all child source pairs. Evidence: the map names phases 1 through 3 at `spec.md:104`.
- [x] T002 [P0] Compare mapped folders with every direct numbered child folder. Evidence: both sets are `001-source-audit`, `002-goal-authoring` and `003-binding-check`.
- [x] T003 [P1] Confirm each child folder contains its own specification and acceptance criteria. Evidence: all three source pairs are present in the fixture.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Record the parent map and six child source documents as the audit inventory. Evidence: the parent map defines the three phases at `spec.md:104`.
- [x] T005 [P0] Record the exact map-to-disk name comparison without inferring names. Evidence: the recorded sets contain the same three folder names.
- [x] T006 [P1] Close the phase criteria with evidence tied to the audit work. Evidence: every acceptance row cites one task line.
- [x] T007 [P1] Write the phase goal and summary from this phase's sources. Evidence: the goal states the source-audit purpose and has no binding section.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Check that the source inventory covers the parent map and each child source pair. Evidence: the inventory names all three child folders and their source files.
- [x] T009 [P0] Check that every acceptance criterion has one backticked path and line number. Evidence: all verification cells cite a single task line.
- [x] T010 [P1] Confirm no audit task remains blocked or unverified. Evidence: all source-audit tasks and checklist items are checked with evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All source-audit tasks are checked and carry short evidence.
- [x] The parent map and direct-child folder names match exactly.
- [x] Every acceptance criterion is Met with a single-line citation.
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

- [x] CHK-001 [P0] Requirements are recorded in `spec.md`. Evidence: source and map requirements appear at `spec.md:103`.
- [x] CHK-002 [P0] The audit approach is defined in `plan.md`. Evidence: the plan compares sorted folder names at `plan.md:30`.
- [x] CHK-003 [P1] All source dependencies are available. Evidence: the parent and three child source pairs are present.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code lint target exists for this documentation-only phase. Evidence: code changes are out of scope at `spec.md:78`.
- [x] CHK-011 [P0] No executable code or console surface changed. Evidence: the scope excludes code and validator changes at `spec.md:79`.
- [x] CHK-012 [P1] Missing-source and mismatch stop conditions are recorded. Evidence: the plan compares exact folder names at `plan.md:63`.
- [x] CHK-013 [P1] Spec, plan and task evidence use the same audit boundary. Evidence: the phase boundary is stated at `spec.md:41`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are Met. Evidence: each row has a task-line citation in `acceptance-criteria.md`.
- [x] CHK-021 [P0] The map and direct folders were compared by exact name. Evidence: the three names are recorded in T002.
- [x] CHK-022 [P1] The missing-folder and extra-folder cases are treated as blockers. Evidence: `spec.md:162` records both cases.
- [x] CHK-023 [P1] Missing child sources stop goal authoring. Evidence: `spec.md:164` names the missing-source case.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No code finding is being fixed in this phase. Evidence: code changes are out of scope at `spec.md:80`.
- [x] CHK-FIX-002 [P0] The complete source set was read. Evidence: the parent map and all three child source pairs are listed in T001 and T003.
- [x] CHK-FIX-003 [P0] No changed code helper or consumer exists. Evidence: the phase changes documentation only at `plan.md:25`.
- [x] CHK-FIX-004 [P0] Adversarial code tests do not apply. Evidence: the phase adds no executable code at `spec.md:150`.
- [x] CHK-FIX-005 [P1] The audit matrix covers three mapped and three direct folders. Evidence: T002 records both sets.
- [x] CHK-FIX-006 [P1] No process-wide environment or global state is read. Evidence: the phase uses source review and filesystem inspection at `plan.md:25`.
- [x] CHK-FIX-007 [P1] Evidence uses stable file paths and individual line citations. Evidence: each acceptance verification cell cites a task line.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret was added. Evidence: this phase changes documentation only.
- [x] CHK-031 [P0] No runtime input surface was introduced. Evidence: `spec.md:150` excludes executable behavior.
- [x] CHK-032 [P1] No authentication surface changed. Evidence: no code or runtime policy is in scope at `spec.md:80`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, criteria, goal and summary describe the same audit. Evidence: the source-audit purpose appears at `spec.md:64`.
- [x] CHK-041 [P1] No code comments changed. Evidence: all retained anchors are template structure.
- [x] CHK-042 [P2] No README update applies. Evidence: no README is in this phase's file list at `spec.md:84`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No task-created temporary files were added. Evidence: the phase scratch folder retains only its existing `.gitkeep`.
- [x] CHK-051 [P1] The phase scratch folder has no generated output. Evidence: no scratch artifact was needed for the audit.
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
