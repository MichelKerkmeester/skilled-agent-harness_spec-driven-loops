---
title: "Feature Specification: Phase 2 — register leaves + wire pointers + fix smart-routing"
description: "The six new reference files must become advisor-routable leaves and be discoverable from each mode; the stale surface router still lists only 3 of 6 modes."
trigger_phrases:
  - "register cli reference leaves"
  - "leaf manifest regeneration cli"
  - "smart-routing three to six modes"
  - "cli mode pointer links"
  - "surface router model intent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033/002-register-and-wire"
    last_updated_at: "2026-07-29T08:35:29Z"
    last_updated_by: "template-author"
    recent_action: "Author phase-2 spec"
    next_safe_action: "Regenerate leaf-manifest and expand smart-routing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-register-and-wire"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — register leaves + wire pointers + fix smart-routing

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
| **Phase** | 2 of 4 |
| **Predecessor** | 001-author-per-mode-references |
| **Successor** | 003-trim-duplicates |
| **Handoff Criteria** | 6 new leaves registered; `smart-routing.md` covers all 6 modes; pointer links present in each mode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the per-mode provider/model reference decomposition.

**Scope Boundary**: Wiring only — register the new leaves, fix the router, add navigation pointers. No content trimming (Phase 3).

**Dependencies**:
- Phase 1 complete (the six files exist on disk)
- `generate-leaf-manifest.cjs` generator

**Deliverables**:
- Regenerated `leaf-manifest.json` with 6 new leaves
- `smart-routing.md` expanded 3→6 modes + a model-selection intent
- Pointer links from each mode's `SKILL.md` and `cli-reference.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A new reference file is invisible to the advisor until the manifest registers it, and undiscoverable to a reader until the mode's docs link it. Separately, the hub surface router `shared/references/smart-routing.md` still enumerates only 3 of the 6 modes (missing cursor, devin, pi).

### Purpose
Make the six new files advisor-routable and reader-discoverable, and repair the stale surface router to cover all six modes plus a model-selection intent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write` (never hand-edit)
- Expand `smart-routing.md` `INTENT_SIGNALS` + `RESOURCE_MAP` from 3 to 6 modes; add a model-selection intent routing to the new leaves; fix the 3-mode prose; bump its version
- Add a prominent pointer link from each mode's `SKILL.md` (References/Related) and `cli-reference.md` model section to that mode's `providers-and-models.md`

### Out of Scope
- Trimming existing enumerations (Phase 3)
- Any edit to advisor-routing JSON model tokens

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-external-orchestration/leaf-manifest.json` | Modify (generated) | Register 6 new leaves |
| `cli-external-orchestration/shared/references/smart-routing.md` | Modify | 3→6 modes + model-selection intent + version bump |
| `cli-external-orchestration/cli-*/SKILL.md` | Modify | Add pointer link to the mode's new file (×6) |
| `cli-external-orchestration/cli-*/references/cli-reference.md` | Modify | Add pointer link at the model section (×6) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Manifest regenerated with 6 new leaves | `generate-leaf-manifest.cjs --check` clean; each mode's `leaves[]` includes `references/providers-and-models.md` |
| REQ-002 | `smart-routing.md` covers all 6 modes | `INTENT_SIGNALS` + `RESOURCE_MAP` name all six; every `RESOURCE_MAP` path registered in the manifest |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Pointer links added per mode | Each `SKILL.md` + `cli-reference.md` links the mode's `providers-and-models.md` |
| REQ-004 | smart-routing model-selection intent | A model-selection intent routes to the six new leaves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `generate-leaf-manifest.cjs --check` reports fresh (6 new leaves present)
- **SC-002**: `smart-routing.md` `RESOURCE_MAP` paths all resolve on disk and are manifest-registered
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Manifest hand-edited → freshness gate fails | Med | Always regenerate via the generator, never edit by hand |
| Risk | RESOURCE_MAP path not manifest-registered | Med | Update manifest and smart-routing together; verify with `--check` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->
