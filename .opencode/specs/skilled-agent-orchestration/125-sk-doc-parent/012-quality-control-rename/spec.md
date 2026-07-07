---
title: "Feature Specification: Rename packet doc-quality -> create_quality_control"
description: "Rename the sk-doc doc-quality workflow packet to create_quality_control across its directory, hub configs, SKILL.md, and the /doc:quality command, with 0 broken links and 0 canon-check warnings."
trigger_phrases:
  - "quality control rename"
  - "125 sk-doc phase 012"
  - "doc-quality packet rename"
  - "create_quality_control"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/012-quality-control-rename"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Spec/plan/tasks authored; rename not yet started"
    next_safe_action: "Inventory every doc-quality reference repo-wide before renaming"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Rename packet doc-quality -> create_quality_control

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | `011-smart-router-alignment/` |
| **Predecessor** | `011-smart-router-alignment/` |
| **Successor** | `013-shared-refs-reorg/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc `doc-quality` workflow packet (built in the original phase map's `012-doc-quality/`) is named as if it were a mode or feature flag rather than a create-* authoring packet, which is inconsistent with the hub's naming convention and undersells what the packet actually does: validate, score, and optimize an existing document — the same job the bound `/doc:quality` command already describes.

### Purpose
Rename the packet directory and every reference to it from `doc-quality` to `create_quality_control`, preserving the exact same workflow behavior, with zero broken links and zero warnings from the parent-skill canon checker.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `.opencode/skills/sk-doc/doc-quality/` to `.opencode/skills/sk-doc/create_quality_control/`.
- Update `mode-registry.json` (`workflowMode`, `packet`, `packetSkillName`, and the `backendKind` label), `hub-router.json` (`tieBreak` list, weighted-route key, resource path, `doc-quality-aliases` class name), `description.json`, and `graph-metadata.json`.
- Update the packet's own `SKILL.md` name and aliases.
- Update the `/doc:quality` command (`.opencode/commands/doc/quality.md`) target path.
- Sweep every other repo reference to the old packet name/path.

### Out of Scope
- Changing the packet's actual validate/score/optimize behavior.
- Renaming the `/doc:quality` command itself (only its internal target path changes).
- Router alignment (011), the shared/references reorg (013), and the markdown agent sync (014) — each is its own phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/doc-quality/` -> `.opencode/skills/sk-doc/create_quality_control/` | Rename | Packet directory and its contents |
| `.opencode/skills/sk-doc/mode-registry.json` | Update | `workflowMode`/`packet`/`packetSkillName` keys for the renamed packet |
| `.opencode/skills/sk-doc/hub-router.json` | Update | `tieBreak` list, route weight entry, resource path, alias class name |
| `.opencode/skills/sk-doc/description.json` | Update | Packet name in the packet inventory |
| `.opencode/skills/sk-doc/graph-metadata.json` | Update | Packet name and resource paths |
| `.opencode/skills/sk-doc/create_quality_control/SKILL.md` | Update | Packet name and aliases |
| `.opencode/commands/doc/quality.md` | Update | Target path repointed to the renamed packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Packet directory renamed with zero content loss | `create_quality_control/` contains everything `doc-quality/` had; old path no longer exists |
| REQ-002 | Every hub config reflects the new packet name | `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` all updated; `parent-skill-check.cjs` passes with 0 warnings |
| REQ-003 | Zero broken links repo-wide from the rename | Link checker reports 0 broken references to the old `doc-quality` path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `/doc:quality` command resolves and behaves identically post-rename | Manual invocation reaches the renamed packet and completes its validate/score/optimize flow |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs` passes with 0 warnings after the rename.
- **SC-002**: Repo-wide link checker reports 0 broken links introduced by this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reference to `doc-quality` is missed outside the hub's own config files | Silent broken link or stale advisor alias | Repo-wide grep sweep before and after the rename, not just the known config set |
| Dependency | `hub-router.json` alias/weight structure | An incomplete update could make the packet unroutable | Update `mode-registry.json` first (source of truth), then propagate to `hub-router.json`/`description.json`/`graph-metadata.json` in that order |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the `doc-quality-aliases` hub-router class also be renamed, or kept as an internal class name distinct from the packet's own name? Default: rename it to `quality-control-aliases` for consistency, since it is internal routing metadata, not a public-facing string.
<!-- /ANCHOR:questions -->
