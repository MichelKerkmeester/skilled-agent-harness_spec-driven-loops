---
title: "Feature Specification: Refresh .opencode/commands to match the new sk-doc setup"
description: "Repoint every stale sk-doc template/reference/packet path in .opencode/commands to the dissected, renamed, flattened structure produced by phases 011-013."
trigger_phrases:
  - "commands refresh sk-doc"
  - "125 sk-doc phase 015"
  - "command yaml repoint"
  - "create command template paths"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/015-commands-refresh"
    last_updated_at: "2026-07-07T06:40:27.201Z"
    last_updated_by: "claude-opus"
    recent_action: "Enumerated stale command refs; repointed 4 skill_creation refs + 1 label"
    next_safe_action: "Confirm all command resource paths resolve, then close"
    blockers: []
    key_files:
      - ".opencode/commands/create/assets/create_parent_skill_auto.yaml"
      - ".opencode/commands/create/assets/create_parent_skill_confirm.yaml"
      - ".opencode/commands/create/README.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Refresh .opencode/commands to match the new sk-doc setup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | `012-quality-control-rename/`, `013-shared-refs-reorg/` |
| **Predecessor** | `013-shared-refs-reorg/` |
| **Successor** | `014-markdown-agent-sync/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `.opencode/commands/` surface (the `/create:*` and `/doc:*` command files plus their `assets/` presentation and resource YAMLs) cited the pre-refactor sk-doc layout: hub-root `assets/`/`references/` facades, the deleted `*_creation.md` monoliths, the pre-regroup `create-skill/references/skill_creation/` path, the `doc-quality` packet name, and `shared/references/global/`. Left stale, `/create:*` and `/doc:*` would load or point at paths that no longer exist.

### Purpose
Bring every command reference into agreement with the structure produced by phases 011-013 so each command resolves its real resources. In practice most of this had already converged (via the packet rename in 012, the reference flatten in 013, and the concurrent packet optimization); this phase closes the residual gap and verifies resolution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint `create-skill/references/skill_creation/` citations to the regrouped `create-skill/references/parent_skill/` location.
- Correct stale display labels that still name deleted monoliths.
- Verify every `.opencode/skills/sk-doc/...` resource path cited by `create_*` command YAMLs resolves on disk.

### Out of Scope
- Rewriting command behavior or workflow, only resource/reference paths.
- Command files owned by a concurrent lane while dirty (repointed in the working tree, committed by their owner).
- The markdown-agent sync (phase 014).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/commands/create/assets/create_parent_skill_{auto,confirm}.yaml` | Update | `skill_creation/` -> `parent_skill/` for the two regrouped reference docs |
| `.opencode/commands/create/README.txt` | Update | Correct a stale monolith label to the route-map README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No command cites a deleted or moved sk-doc path | `rg` finds zero `skill_creation/`, `_creation.md` monolith link, hub-root facade, `doc-quality`, or `references/global/` reference under `.opencode/commands/` |
| REQ-002 | Every command resource path resolves | Each `.opencode/skills/sk-doc/...(.md|.json)` cited by `create_*` command YAMLs exists on disk |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Edits stay 0-leak on the shared branch | Only the named command files are committed; concurrently-dirty command files are left to their owner |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero stale sk-doc structural references remain under `.opencode/commands/`.
- **SC-002**: All command-cited sk-doc resource paths resolve (0 broken).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 012 + 013 must land first | Command repoints target the renamed/flattened paths | Sequenced after 012 and 013 committed |
| Risk | Concurrent lane holds some command YAMLs dirty | 0-leak commit cannot include them | Repoint in the working tree; exclude from this commit; owner commits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Memory-filename templates such as `[timestamp]_agent_creation.md` are output-naming patterns, not references to the deleted monoliths, and are intentionally left unchanged.
<!-- /ANCHOR:questions -->
