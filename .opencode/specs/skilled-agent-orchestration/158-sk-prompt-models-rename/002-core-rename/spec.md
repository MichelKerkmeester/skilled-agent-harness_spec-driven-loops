---
title: "Feature Specification: Phase 2: core-rename"
description: "git mv the skill folder sk-prompt-small-model -> sk-prompt-models and update its own identity (name:, skill_id), internal back-links, and model_profiles.json profile_refs."
trigger_phrases:
  - "sk-prompt-models core rename"
  - "git mv sk-prompt-small-model"
  - "skill identity rename"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/002-core-rename"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/002-core-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: core-rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-reference-inventory |
| **Successor** | 003-cross-skill-and-code-refs |
| **Handoff Criteria** | Folder moved; skill identity + internal back-links + profile_refs updated; internal links resolve under the new path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-prompt-models-rename specification — the skill itself.

**Scope Boundary**: Only the skill's OWN folder + files. Cross-skill references are phase 3; commands/specs are phases 4–5.

**Dependencies**:
- Phase 1 reference map (which files inside the folder carry the token).

**Deliverables**:
- `git mv .opencode/skills/sk-prompt-small-model .opencode/skills/sk-prompt-models` (untracked files move with it).
- Skill identity updated: `SKILL.md` `name:` + `<!-- Keywords -->`, `graph-metadata.json` `skill_id`, `description.json`, `README.md`.
- Internal back-links updated: `references/models/*.md`, `_index.md`, `pattern_index.md` (the `../../../sk-prompt-small-model/...` links break on rename), and `assets/model_profiles.json` `profile_ref` strings (×5).

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After `git mv`, the skill's own internal references still name the old folder: `references/models/*.md` link `../../../sk-prompt-small-model/...` (now a dead path), `model_profiles.json` carries `profile_ref: "sk-prompt-small-model/references/models/..."`, and the `name:`/`skill_id` still say the old name. These break self-navigation and the card-sync guard's registry checks.

### Purpose
Move the folder and make the skill internally consistent under `sk-prompt-models` so its own links, identity, and registry resolve before any external reference is touched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` the folder (preserves history; untracked new files travel with it).
- `name:` + Keywords in `SKILL.md`; `skill_id` in `graph-metadata.json`; `description.json`; `README.md`.
- Internal back-links in `references/models/*.md` + `_index.md` + `pattern_index.md`.
- `assets/model_profiles.json` `profile_ref` strings (×5).

### Out of Scope
- The `derived` blocks of graph-metadata/description.json (regenerated in phase 6, not hand-edited).
- Any reference OUTSIDE the folder (phases 3–5).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-small-model/` → `sk-prompt-models/` | git mv | Folder move (benchmarks/** + references/models/** travel inside) |
| `…/sk-prompt-models/SKILL.md` | Modify | `name:` + Keywords |
| `…/sk-prompt-models/graph-metadata.json` | Modify | `skill_id` (NOT the derived block) |
| `…/sk-prompt-models/description.json` | Modify | identity fields |
| `…/sk-prompt-models/README.md` | Modify | name mentions |
| `…/sk-prompt-models/references/models/*.md`, `_index.md`, `pattern_index.md` | Modify | `../../../sk-prompt-small-model/...` back-links |
| `…/sk-prompt-models/assets/model_profiles.json` | Modify | `profile_ref` strings (×5) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Folder moved | `.opencode/skills/sk-prompt-models/` exists; the old folder is gone; git tracks the move |
| REQ-002 | Identity updated | `SKILL.md` `name: sk-prompt-models`; `graph-metadata.json` `skill_id: sk-prompt-models` |
| REQ-003 | Internal links resolve | Every `../../../sk-prompt-models/...` back-link + every `profile_ref` resolves to a real file under the new path |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No residual self-reference | `rg "sk-prompt-small-model" .opencode/skills/sk-prompt-models` returns 0 (excluding frozen benchmark logs, if any) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The renamed folder is internally consistent — identity, back-links, and profile_refs all say `sk-prompt-models` and resolve.
- **SC-002**: `git status` shows the move as a rename, history preserved.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the move + edits, **When** `rg "sk-prompt-small-model" .opencode/skills/sk-prompt-models` runs, **Then** it returns 0 live hits.
- **Given** `model_profiles.json`, **When** each `profile_ref` is resolved, **Then** the target `.md` exists under `sk-prompt-models/references/models/`.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing the derived metadata block by hand | Stale/inconsistent index | Edit only `skill_id`/identity; regenerate derived blocks in phase 6 |
| Risk | Untracked new files not moving | Orphaned glm-5.2.md / benchmarks/008 | Confirm `mv` carried untracked files; `ls` the new folder |
| Risk | A back-link missed | Dead self-link | Post-edit `rg` sweep of the new folder returns 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — folder + identity + internal refs are fully determined by phase 1's map.
<!-- /ANCHOR:questions -->
