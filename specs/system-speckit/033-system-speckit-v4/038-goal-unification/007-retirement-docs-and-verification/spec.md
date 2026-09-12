---
title: "Feature Specification: Retirement, docs and verification"
description: "Retire or demote the legacy goal state store per ADR-2, update READMEs, SKILL and hook-system docs, write the changelog entry, and run the full verification sweep with a deep review."
trigger_phrases:
  - "goal state store retirement"
  - "goal hook readme update"
  - "goal unification verification"
  - "goal unification changelog"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retirement, docs and verification

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-speckit-command-integration |
| **Successor** | None |
| **Handoff Criteria** | See the parent Phase Handoff Criteria row for this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Goal unification: packet goal.md as the single goal surface across runtimes specification.

**Scope Boundary**: Nothing left describes or depends on the JSON goal store beyond what ADR-2 keeps, and every gate is green from the final state.

**Dependencies**:
- 006-speckit-command-integration Complete

**Deliverables**:
- `.opencode/skills/.state/goal/` retirement or demotion with a migration note for both key schemes
- `.opencode/hooks/goal/README.md` and `goal-plugin.md` via sk-create-readme
- system-spec-kit SKILL.md, hook-system.md and feature catalog deltas via sk-create-skill

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The store, its locks and archive, the hook README and plugin doc, the spec-kit SKILL section and the changelog all describe the old model.

### Purpose
Nothing left describes or depends on the JSON goal store beyond what ADR-2 keeps, and every gate is green from the final state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/.state/goal/` retirement or demotion with a migration note for both key schemes
- `.opencode/hooks/goal/README.md` and `goal-plugin.md` via sk-create-readme
- system-spec-kit SKILL.md, hook-system.md and feature catalog deltas via sk-create-skill
- `CHANGELOG-v4.0.0.0.md` entry
- MEMORY.md policy note per ADR-5
- Full verification sweep and a /deep:review pass

### Out of Scope
- New behavior; this phase only retires, documents and verifies

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/.state/goal/` | Delete/Modify | Per ADR-2 |
| `.opencode/hooks/goal/README.md` | Modify | New model |
| `.opencode/hooks/goal/goal-plugin.md` | Modify | New model |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Goal section |
| `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` | Modify | Entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Store retired or demoted with a migration note | ADR-2 site matches disk state |
| REQ-002 | All docs describe the packet-backed model | grep for the old state path finds only the migration note |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every gate green from the final state | Command outputs recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive validate --strict on 036 passes
- **SC-002**: Goal suites, plugin tests, drift check and hygiene gate pass
- **SC-003**: deep review reports no P0 or P1
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting the store breaks a live session | Data loss | Named rollback: restore from git; ask before delete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open at scaffold time
<!-- /ANCHOR:questions -->

---


