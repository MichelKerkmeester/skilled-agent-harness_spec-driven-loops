---
title: "Feature Specification: 115/002 — skill dir rename (deep-ai-council → sk-ai-council)"
description: "Parallel-after-001 phase: `git mv .opencode/skills/deep-ai-council .opencode/skills/sk-ai-council` + literal substitution on ~80 internal files (SKILL.md, README.md, description.json, graph-metadata.json, references/, scripts/, feature_catalog/, manual_testing_playbook/). Preserves changelog/v1+v2 as historical."
trigger_phrases:
  - "115 skill dir rename"
  - "deep-ai-council skill rename execution"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-deep-ai-council-rename/002-sk-ai-council-skill-rename"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/002 spec.md"
    next_safe_action: "Author 115/002 plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115002"
      session_id: "115-002-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Scope per 001/scratch/rename-plan.json (when emitted): all files under .opencode/skills/deep-ai-council/ except changelog/v1.0.0.0.md + v2*.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 115/002 — skill dir rename

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 (parallel-eligible after 001) |
| **Status** | Planned |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-preflight-scope-map |
| **Successor** | 006-reindex-validate-reconcile (sequential after 002-005) |
| **Handoff Criteria** | `rg "deep-ai-council" .opencode/skills/sk-ai-council/` returns hits ONLY in `changelog/v1.0.0.0.md` + `v2*.md`; new `changelog/v3.0.0.0.md` documents the rename; `validate.sh --strict` on 002 exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 2 of 6 in 115. Sibling-parallel with 003/004/005 after 001.

**Scope Boundary**: only files under `.opencode/skills/deep-ai-council/` (renamed to `sk-ai-council/`). Excludes `changelog/v1.0.0.0.md` + `v2*.md` (historical version notes preserved).

**Dependencies**: 001-preflight-scope-map emits `scratch/rename-plan.json` with this phase's `file_scope` + `literal_substitution: {deep-ai-council: sk-ai-council}`.

**Deliverables**:
- `git mv .opencode/skills/deep-ai-council .opencode/skills/sk-ai-council`
- ~80 internal files content-updated via `sed -i ''`
- New `changelog/v3.0.0.0.md` documenting the rename
- Updated frontmatter `name:` in SKILL.md → `sk-ai-council`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `deep-ai-council` skill needs to move to the `sk-ai-council` name per parent 115/spec.md naming convention rationale.

### Purpose
Execute the directory rename + internal-file literal substitution. Mechanical refactor; no behavioral changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Directory rename via `git mv`
- All files inside the renamed dir except changelog/v1+v2

### Out of Scope
- Any file outside `.opencode/skills/deep-ai-council/`
- changelog/v1.0.0.0.md + v2*.md (historical)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/` | Rename dir | → `.opencode/skills/sk-ai-council/` |
| `sk-ai-council/SKILL.md`, README.md, description.json, graph-metadata.json | Modify | Literal substitution |
| `sk-ai-council/references/**`, `assets/**`, `scripts/**`, `feature_catalog/**`, `manual_testing_playbook/**` | Modify | Literal substitution where applicable |
| `sk-ai-council/changelog/v3.0.0.0.md` | Create | Rename changelog |
| `sk-ai-council/changelog/v1.0.0.0.md`, `v2*.md` | Preserve | HISTORICAL |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill dir renamed via `git mv` | `ls .opencode/skills/deep-ai-council 2>&1` no-such-file; `ls .opencode/skills/sk-ai-council/SKILL.md` exists |
| REQ-002 | SKILL.md frontmatter `name: sk-ai-council` | grep verification |
| REQ-003 | Live-file `rg "deep-ai-council"` returns 0 hits | rg output |
| REQ-004 | Historical changelog v1+v2 preserved (rg still finds old name there) | git diff --stat on those paths = 0 |

### P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `changelog/v3.0.0.0.md` created with rename rationale | File exists + cites this packet |
| REQ-006 | `validate.sh --strict` on 002 exits 0 | Validator output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git log --follow .opencode/skills/sk-ai-council/SKILL.md` traces back to original.
- **SC-002**: Live-file rg on renamed dir returns 0 hits for `deep-ai-council` (excluding changelog/v1+v2).
- **SC-003**: 002 strict validate exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | 001 rename-plan.json emitted | Phase 002 blocks until 001 complete |
| Risk | sed accidentally edits historical changelog | Explicit exclude list in execution |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none — see parent spec.md §10)
<!-- /ANCHOR:questions -->
