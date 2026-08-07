---
title: "Feature Specification: Phase 4 — hub reconcile + adjacent fixes + validate"
description: "Reconcile hub-level docs to point at the new catalogs, fix the three approved adjacent defects, and run all conformance gates to close the packet."
trigger_phrases:
  - "hub reconcile provider pointers"
  - "version skew reconcile cli"
  - "stale scripts reference removal"
  - "ci skill root metadata gate"
  - "parent skill check validate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033/004-hub-reconcile-and-validate"
    last_updated_at: "2026-07-29T08:35:31Z"
    last_updated_by: "template-author"
    recent_action: "Author phase-4 spec"
    next_safe_action: "Reconcile hub docs and run gates"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-hub-reconcile-and-validate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — hub reconcile + adjacent fixes + validate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-trim-duplicates |
| **Successor** | None |
| **Handoff Criteria** | Hub docs point at catalogs; three adjacent defects fixed; all gates green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** (final) of the per-mode provider/model reference decomposition.

**Scope Boundary**: Hub-level reconcile + the three operator-approved adjacent fixes + validation. No new content authoring.

**Dependencies**:
- Phases 1-3 complete

**Deliverables**:
- Parent `SKILL.md` §1 + `README.md` pointer bullets to the per-mode catalogs
- Version-skew reconcile (`hub-router.json` + `README.md` 1.1.0.0 → 1.2.0.0)
- Stale `cli-opencode/scripts/` reference removed from parent `SKILL.md` + `README.md`
- Changelog entries for changed docs
- All conformance gates green

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub-level docs do not yet point readers at the new per-mode catalogs. Exploration also surfaced three approved adjacent defects: `hub-router.json` and `README.md` lag at version 1.1.0.0 while the rest of the hub is 1.2.0.0, and both the parent `SKILL.md` layout and `README.md` reference a `cli-opencode/scripts/` directory that does not exist on disk.

### Purpose
Reconcile the hub-level documentation and metadata, fix the three approved adjacent defects, and prove the whole packet conforms by running every relevant gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one pointer bullet in parent `SKILL.md` §1/§5 and `README.md` to the per-mode catalogs
- Align `hub-router.json` + `README.md` frontmatter version to 1.2.0.0
- Remove the stale `cli-opencode/scripts/` mentions from parent `SKILL.md` and `README.md`
- Add `changelog/` entries for changed docs
- Run all conformance gates

### Out of Scope
- Any change to advisor-routing JSON model tokens
- Refactoring beyond the three approved adjacent defects

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-external-orchestration/SKILL.md` | Modify | Pointer bullet; remove stale `scripts/` ref |
| `cli-external-orchestration/README.md` | Modify | Pointer bullet; version → 1.2.0.0; remove stale `scripts/` ref |
| `cli-external-orchestration/hub-router.json` | Modify | Version → 1.2.0.0 (no model-token change) |
| `cli-external-orchestration/changelog/*` | Create/Modify | Changelog entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Conformance gates green | `ci-skill-root-metadata.cjs` clean; `parent-skill-check.cjs` passes; `generate-leaf-manifest.cjs --check` fresh |
| REQ-002 | Spec validates | `validate.sh 033-* --strict` (per child + recursive) Errors: 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Three adjacent defects fixed | smart-routing 6 modes (Phase 2); version skew reconciled; stale `scripts/` removed |
| REQ-004 | Advisor routing smoke | `advisor_validate` clean; provider-named prompt routes to correct mode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh` on the parent (recursive, `--strict`) returns Errors: 0
- **SC-002**: Hub still classifies as clean class-H; advisor still routes provider-named prompts correctly
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Version bump misses a co-versioned file | Low | Grep all hub root files for the old version before/after |
| Dependency | Conformance scripts | Low | Scripts are stable under `sk-doc/create-skill/scripts` and `commands/doctor/scripts` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->
