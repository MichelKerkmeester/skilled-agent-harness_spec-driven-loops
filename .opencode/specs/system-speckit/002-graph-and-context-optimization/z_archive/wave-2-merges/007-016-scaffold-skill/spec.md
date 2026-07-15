---
title: "Feature Specification: Scaffold system-code-graph skill folder (empty shape; no code moves)"
description: "Create the Phase 002 empty system-code-graph skill scaffold and packet docs. No code moves; Phase 003 moves source."
trigger_phrases:
  - "code graph skill scaffold"
  - "system-code-graph scaffold"
  - "002 scaffold-skill"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-2-merges/007-016-scaffold-skill"
    last_updated_at: "2026-05-14T07:54:11Z"
    last_updated_by: "codex"
    recent_action: "Scaffold packet for empty system-code-graph skill folder"
    next_safe_action: "Create empty skill tree and validate packet"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140002"
      session_id: "002-scaffold-skill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase creates an empty skill folder shape only."
      - "Source code stays in system-spec-kit until Phase 003."
      - "ADR-001 Q3 keeps MCP tools co-resident under spec_kit_memory."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Scaffold system-code-graph skill folder (empty shape; no code moves)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `002-scaffold-skill` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
ADR-001 for parent packet 014 accepted a code-graph extraction plan that makes `.opencode/skills/system-code-graph/` the first-class owner of the code-graph subsystem. Before source files can move in Phase 003, the target skill folder needs the empty package shape, metadata, docs, and placeholder directories required by the migration plan.

This packet creates that empty scaffold only. It does not move or edit the live code-graph source under `.opencode/skills/system-spec-kit/mcp_server/code_graph/`.

### Purpose
Create the Phase 002 spec packet and empty `.opencode/skills/system-code-graph/` shape with `SKILL.md`, `README.md`, package metadata, TypeScript/Vitest config placeholders, and empty directories for the future code, database, feature catalog, manual playbook, and references.

ADR-001 Q3 is binding here: the new skill is not a separate MCP server process. Code-graph tools remain registered under `spec_kit_memory`; this skill owns the source-tree shape and package boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create this child packet at `016-scaffold-skill/`.
- Create `.opencode/skills/system-code-graph/` package metadata and operator docs.
- Create empty scaffold directories under `mcp_server/code_graph/`, `mcp_server/database/`, `feature_catalog/`, `manual_testing_playbook/`, and `references/`.
- Update parent 014 `graph-metadata.json` to add this child and make it active.

### Out of Scope
- Moving code from `system-spec-kit/mcp_server/code_graph/`.
- Moving the live SQLite database.
- Rewiring imports, handlers, hooks, commands, agent files, top-level docs, or plugin bridges.
- Scaffolding Phase 003 or later packets.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Phase 002 packet docs exist. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`, and `implementation-summary.md` exist in this folder. |
| REQ-002 | Empty system-code-graph skill shape exists. | Required top-level docs/config plus required empty directories exist under `.opencode/skills/system-code-graph/`. |
| REQ-003 | No code moves occur. | `system-spec-kit/mcp_server/code_graph/` is not modified. |
| REQ-004 | Co-resident MCP topology is documented. | `SKILL.md` and `README.md` state tools remain registered under `spec_kit_memory` per ADR-001 Q3. |
| REQ-005 | Parent metadata points to this child. | Parent `children_ids` includes `002-scaffold-skill` and `derived.last_active_child_id` points here. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validation passes for this packet.
- **SC-002**: `.opencode/skills/system-code-graph/` contains all 14 required scaffold entries checked by the Phase 002 tree validation command.
- **SC-003**: `.opencode/skills/system-spec-kit/mcp_server/code_graph/` has no Phase 002 changes.
- **SC-004**: The new skill docs clearly state Phase 002 scaffold state, Phase 003 source move, and Phase 005 doc migration.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scaffold implies standalone MCP process | Future phases may wire the wrong topology | State co-resident topology in SKILL.md and README, citing ADR-001 Q3. |
| Risk | Placeholder tree accidentally contains migrated code | Phase boundary is violated | Use `.gitkeep` placeholders only in code target directories. |
| Risk | Parent metadata loses manual supersedes entry | Prior packet lineage is damaged | Preserve all unrelated parent metadata fields. |
| Dependency | ADR-001 accepted | Phase 002 follows the locked implementation sequence. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. ADR-001 resolved the topology and phase decomposition. Phase 002 only scaffolds the empty folder.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-Q01 | Quality | Markdown docs keep `_memory.continuity` frontmatter and anchor markers. |
| NFR-Q02 | Safety | No network requests and no source-code moves. |
| NFR-M01 | Maintainability | Placeholder files name which future phase populates each empty area. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- `.opencode/skills/system-code-graph/` may already contain empty placeholder files from earlier preparation; Phase 002 populates them without deleting unrelated placeholders.
- Empty directories require `.gitkeep` files so the scaffold is visible in Git.
- Skill-level `graph-metadata.json` follows the existing system-spec-kit skill metadata shape rather than the spec-packet metadata schema.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | ~0 LOC code; docs/config only | No runtime source changes |
| **Surface area** | Narrow | New packet plus skill scaffold metadata |
| **Risk** | Low | No code moves, no runtime rewiring |
| **Reversibility** | High | Revert deletes scaffold and parent metadata pointer |
<!-- /ANCHOR:complexity -->
