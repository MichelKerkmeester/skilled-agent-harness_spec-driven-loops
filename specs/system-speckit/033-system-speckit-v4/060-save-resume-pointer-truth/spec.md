---
title: "Feature Specification: Phase 60: Save and resume pointer truth"
description: "Every save under a track rewrote the track root's tracked graph-metadata.json, and the save and resume docs described a 24-hour pointer limit, a null pointer on parent saves and a mutation-first full-auto mode that the runtime does not have."
trigger_phrases:
  - "save resume pointer truth"
  - "track root pointer store only"
  - "planner mode what each mode writes"
  - "phase parent pointer docs"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 60: Save and resume pointer truth

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 60 of 62 |
| **Predecessor** | 059-phase-map-sync-normalization |
| **Successor** | 061-worktree-build-provisioning |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 60** of the system-spec-kit v4 specification, the fifth of the fix phases planned after phase 051 shipped. It makes the save writer leave a track root's tracked metadata alone and makes the save and resume docs say what the runtime does.

**Scope Boundary**: the pointer walk and `--help` text in `generate-context.ts`, their tests, and the pointer and planner-mode wording in seven save and resume docs. Resume logic does not change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After a save, the writer walks up from the saved packet and rewrites the pointer in every phase-parent ancestor's `graph-metadata.json`, including the track root, the spec-less folder directly under `specs/`. That file is tracked and shared by every packet in the track, so every save under the track changes it, and concurrent sessions conflict on it; phase 059's commit carried a track-root change that was only timestamps. The resume ladder already reads the pointer from the telemetry store first, so the file write buys resume nothing.

The docs also disagree with the runtime. They say resume follows a phase parent's pointer only within 24 hours, and that a save aimed at a parent writes a null pointer. Resume follows any pointer that names an existing child, and a parent-targeted save moves no pointer unless a full-auto save routes into a leaf. `--help` calls full-auto the "legacy mutation-first fallback", although it is the only mode that writes the continuity fields.

### Purpose
A save leaves a track root's tracked file alone, and anyone reading the save and resume docs or `--help` learns what each mode writes and when resume follows a pointer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A track root's pointer written to the telemetry store only; folders with a `spec.md` unchanged.
- `--help` wording for the planner modes.
- Pointer and planner-mode wording in the save workflow, quick reference, skill README, folder routing, both resume workflow assets and the save command.

### Out of Scope
- Resume logic, and whether confirm-mode resume asks before a stale redirect beyond what the confirm workflow asset instructs.
- Removing pointers already written to track-root files; they stop changing, and the next regeneration is the operator's.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify | Store-only pointer at a track root; `--help` planner-mode text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/phase-parent-pointer.vitest.ts` | Modify | Track-root test |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/generate-context-help.vitest.ts` | Create | `--help` wording test |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Resume integration, track roots, planner-mode table |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Modify | Resume ladder and pointer maintenance |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Pointer maintenance |
| `.skilled/skills/system-spec-kit/references/structure/folder-routing.md` | Modify | Parent-targeted saves |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` | Modify | Pointer redirect rule |
| `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | Modify | Pointer redirect rule, confirm before a stale redirect |
| `.skilled/commands/speckit/save.md` | Modify | What every mode refreshes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A save leaves a track root's tracked file alone. | After a save into a packet under a track, the track root's `graph-metadata.json` is byte-identical. |
| REQ-002 | Resume still finds the way down from a track root. | The store's pointer for the track root names the phase parent the save went through. |
| REQ-003 | A phase parent with a `spec.md` behaves as before. | Its `graph-metadata.json` pointer names the saved child. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `--help` says what each planner mode writes. | It says only full-auto writes the continuity fields and no longer says "mutation-first". |
| REQ-005 | The docs match the runtime. | No doc in scope states a 24-hour pointer limit for auto resume or a null pointer written by a parent save; the save workflow carries a planner-mode table. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The track-root test fails against the previous writer.
- **SC-002**: The CLI suite for pointers and saves passes, the CLI project typechecks and its `check` script passes.
- **SC-003**: Both resume workflow assets parse as YAML.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | With generator hardening turned off, resume at a track root reads only the file, whose pointer stops moving | Low | Hardening is on by default, and the operator chose store-only at track roots |
| Dependency | The resume ladder's store-first read | High | Unchanged by this phase; the new test reads the pointer back through the same store API |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose "Store-only at track roots" when approving the plan.
<!-- /ANCHOR:questions -->

---
