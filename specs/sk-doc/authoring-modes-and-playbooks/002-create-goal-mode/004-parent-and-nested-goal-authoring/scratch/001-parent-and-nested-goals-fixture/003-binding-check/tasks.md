---
title: "Tasks: Phase 3: binding-check"
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
# Tasks: Phase 3: binding-check

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

- [x] T001 [P0] Read the parent's complete Phase Documentation Map. Evidence: it names the three phases at `spec.md:104`.
- [x] T002 [P0] List every direct numbered child folder and compare exact names. Evidence: the disk set is `001-source-audit`, `002-goal-authoring` and `003-binding-check`.
- [x] T003 [P1] Read all three child goals before writing the parent binding. Evidence: each child goal is present in its mapped folder.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Add exactly one backticked parent target for each direct child folder. Evidence: the binding table has the three mapped goal paths.
- [x] T005 [P0] Compare map, direct-folder and target names as exact sets. Evidence: all three sets contain the same three names.
- [x] T006 [P1] Close acceptance criteria with individual task-line citations. Evidence: every verification cell names one task line.
- [x] T007 [P1] Refresh parent and child derived metadata before the final gate. Evidence: metadata refresh commands were run for all four folders.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Confirm each backticked target resolves to a child goal file. Evidence: all three target files exist.
- [x] T009 [P0] Run recursive strict validation after the final metadata refresh. Evidence: `RESULT: PASSED` for all four folders on the 37 rules the writer can serve under scratch.
- [x] T010 [P1] Confirm the final output has no `SPECDOC_SUFFICIENCY_006` finding. Evidence: 0 in the full run.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All binding-check tasks are checked and carry short evidence.
- [x] The map, direct-child folders and binding targets name the same three folders.
- [x] Recursive strict validation reports `RESULT: PASSED` with no sufficiency finding.
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

- [x] CHK-001 [P0] Binding requirements are recorded in `spec.md`. Evidence: the requirements appear at `spec.md:103`.
- [x] CHK-002 [P0] The three-set check is defined in `plan.md`. Evidence: the plan names map, folder and binding sets at `plan.md:58`.
- [x] CHK-003 [P1] The child goal targets are available. Evidence: all three mapped goal files exist.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code lint target exists for this documentation-only phase. Evidence: `spec.md:80` excludes code changes.
- [x] CHK-011 [P0] No executable code or console surface changed. Evidence: this phase changes the parent goal only.
- [x] CHK-012 [P1] Missing targets remain a stop condition. Evidence: `spec.md:168` records the missing-goal case.
- [x] CHK-013 [P1] The parent outcome follows the phase map without changing child decisions. Evidence: the parent goal binds each mapped child.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are Met or the final validator criterion remains explicitly open. Evidence: statuses match the recorded command result.
- [x] CHK-021 [P0] Map, disk and binding targets were compared by exact folder name. Evidence: T005 records the three equal sets.
- [x] CHK-022 [P1] A target with a different folder name is treated as a mismatch. Evidence: `spec.md:165` states the exact-name boundary.
- [x] CHK-023 [P1] Missing targets and validator failures remain visible. Evidence: `spec.md:168` and `spec.md:169` specify both stop conditions.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No code finding is being fixed in this phase. Evidence: the scope is parent-goal verification only.
- [x] CHK-FIX-002 [P0] All parent map entries and direct folders were inventoried. Evidence: T001 and T002 record the two sets.
- [x] CHK-FIX-003 [P0] No code helper, policy or consumer changed. Evidence: only fixture documentation is in scope.
- [x] CHK-FIX-004 [P0] Adversarial code tests do not apply. Evidence: this phase adds no executable behavior.
- [x] CHK-FIX-005 [P1] The comparison matrix contains map names, folder names and target names. Evidence: T005 records all three sets.
- [x] CHK-FIX-006 [P1] No process-wide environment or global state is read. Evidence: verification uses the filesystem and packet validator.
- [x] CHK-FIX-007 [P1] Evidence is pinned to individual path and line citations. Evidence: all acceptance rows cite one task line.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret was added. Evidence: all outputs are documentation.
- [x] CHK-031 [P0] No runtime input surface was introduced. Evidence: the phase changes no executable behavior.
- [x] CHK-032 [P1] No authentication surface changed. Evidence: no code or runtime policy is in scope.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, criteria, goal and summary describe the same binding check. Evidence: the phase purpose is at `spec.md:64`.
- [x] CHK-041 [P1] No code comments changed. Evidence: all retained anchors are template structure.
- [x] CHK-042 [P2] No README update applies. Evidence: no README appears in the phase file list at `spec.md:84`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No task-created temporary files were added. Evidence: the phase scratch folder retains only its existing `.gitkeep`.
- [x] CHK-051 [P1] The phase scratch folder has no generated output. Evidence: no scratch artifact was needed for binding verification.
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
