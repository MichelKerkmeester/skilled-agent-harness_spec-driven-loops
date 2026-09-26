---
title: "Tasks: Phase 4: parent-and-nested-goal-authoring"
description: "Unchecked, priority-tagged tasks for the parent and nested goal authoring reference and fixture."
trigger_phrases:
  - "parent goal authoring tasks"
  - "phase binding verification"
  - "goal fixture checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: parent-and-nested-goal-authoring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [P0] | Hard blocker |
| [P1] | Required |
| [P2] | Optional |

**Task Format**: T### [P0/P1/P2] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm phase 003 meets the parent-map incoming handoff and read its authoring rubric (specs/sk-doc/060-create-goal-mode/spec.md:144). Evidence: phase 003 closed with strict `RESULT: PASSED`; its standards and exemplars are loaded by `SKILL.md`.
- [x] T002 [P0] Enumerate every direct child phase directory and reconcile the set with the parent spec Phase Documentation Map before authoring any binding rows (specs/sk-doc/060-create-goal-mode/spec.md:119-129; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080). Evidence: this packet's phase map and disk agree on nine folders; the fixture's map and disk agree on three.
- [x] T003 [P1] Capture pre-phase copies of the existing mode SKILL.md and references/README.md so rollback restores only this phase’s edits. Evidence: deviation, no pre-phase copy was taken before the worker edited both files, and they are untracked. Rollback substitute: remove the lines this phase added, the `parent-and-nested-goals.md` references at `SKILL.md:52`, `SKILL.md:104` and `SKILL.md:151` and the index row at `references/README.md:26`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Create references/parent-and-nested-goals.md with separate top-level, phase-parent, and child-goal workflows; derive each goal from its own spec.md and acceptance-criteria.md (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49-57,75-105). Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md` has separate top-level, phase-parent and nested-child workflows (sections 2 to 4).
- [x] T005 [P0] Define retrofit as a separate operation and render a missing phase-parent goal with inline-gate-renderer.sh --level phase (.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:444-463, 1275-1335, 1492-1504; .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282). Evidence: retrofit is its own operation in section 5; the fixture parent goal was rendered with `inline-gate-renderer.sh --level phase` because the phase scaffold wrote none.
- [x] T006 [P0] Define one binding row per on-disk child, the phase-added row update, parent precedence, and parent-first amendment plus chat-slice resend (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:80-96). Evidence: one row per on-disk child with a STOP on map-versus-disk mismatch (section 3), phase-add (section 5) and parent-first amendment (section 6).
- [x] T007 [P1] Link the reference from references/README.md and add the load step to SKILL.md. Evidence: `references/README.md:26` lists the reference; `SKILL.md:104` loads it at the authoring step.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Create the scratch phase-parent fixture with three child directories, three child goal.md files, and three matching parent binding rows. Evidence: the fixture has three children, three child goals and three exact binding rows.
- [x] T009 [P0] Compare the fixture’s child-directory and binding-row counts, then run validate.sh --strict on every rule except the three generated-metadata rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_CHILD_DRIFT`), which the graph-metadata writer cannot run under a scratch path, and confirm exit 0, RESULT: PASSED, and zero SPECDOC_SUFFICIENCY_006 findings. Evidence: 3 folders and 3 rows; with the approved rule scope, `RESULT: PASSED` for all four folders and exit 0; 0 `SPECDOC_SUFFICIENCY_006` in the full run.
- [x] T010 [P1] Run strict validation on this phase folder and record the Summary line and remaining rule IDs. Evidence: `RESULT: PASSED`, 0 errors and 0 warnings, on 2026-09-26.
- [x] T011 [P1] Reconcile every acceptance row and the phase documents without changing generated metadata. Evidence: every acceptance row carries observed evidence; generated metadata was changed only by the generators.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] [P0] Every P0 task has evidence in the planned reference or fixture.
- [x] [P0] The fixture has three on-disk phase children and three matching parent binding rows.
- [x] [P1] All acceptance criteria have observed evidence or remain Unmet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md.
- **Plan**: See plan.md.
- **Acceptance gate**: See acceptance-criteria.md.
- **Phase objective**: See goal.md.
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

- [x] CHK-001 [P0] Requirements REQ-001 through REQ-007 are testable and traced in acceptance-criteria.md.
- [x] CHK-002 [P0] Plan.md names the files, commands, and observable check for each implementation step.
- [x] CHK-003 [P1] Phase 003’s incoming handoff is confirmed against the parent map.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every repository behavior claim in the reference has a path:line citation or a verified command.
- [x] CHK-011 [P0] The workflow uses the canonical goal template and does not copy it into the mode packet.
- [x] CHK-012 [P1] The reference link in references/README.md resolves.
- [x] CHK-013 [P1] The SKILL.md load step names the correct authoring operations.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria have observed evidence before they are marked Met.
- [x] CHK-021 [P0] The phase-parent fixture passes strict validation and has no SPECDOC_SUFFICIENCY_006 finding.
- [x] CHK-022 [P1] Missing child sources and map-directory mismatches stop authoring without guessed content.
- [x] CHK-023 [P1] The retrofit path covers a phase parent whose goal.md is absent.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No system-spec-kit fix or validator amendment is absorbed into this documentation phase.
- [x] CHK-FIX-002 [P0] The source inventory includes both the parent map and every direct child folder.
- [x] CHK-FIX-003 [P0] Every operation has a named source document and goal output.
- [x] CHK-FIX-004 [P0] A map-directory mismatch case is stated and fails closed.
- [x] CHK-FIX-005 [P1] The operation matrix covers top-level, phase parent, child, retrofit, and phase added.
- [x] CHK-FIX-006 [P1] The workflow keeps session binding and session objective state with the goal hooks (specs/sk-doc/060-create-goal-mode/goal.md:49-54).
- [x] CHK-FIX-007 [P1] Fixture evidence is stored only under this phase’s scratch directory.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Goal writes are scoped to the selected packet’s goal.md files.
- [x] CHK-031 [P0] Missing source documents are reported without fabricated content.
- [x] CHK-032 [P1] No authentication or runtime state surface is added.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, and acceptance-criteria.md describe the same operations and handoff.
- [x] CHK-041 [P1] File paths and renderer flags are verified against repository sources.
- [x] CHK-042 [P2] Optional examples remain within the parent-and-nested-goals reference.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The fixture packet is contained in this phase’s scratch directory.
- [x] CHK-051 [P1] The fixture contains only validation inputs, with no temporary renderer output.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 21/21 |
| P1 Items | 18 | 18/18 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-25
<!-- /ANCHOR:summary -->

---



