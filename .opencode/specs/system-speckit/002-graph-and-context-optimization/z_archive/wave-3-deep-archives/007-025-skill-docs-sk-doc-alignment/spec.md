---
title: "Feature Specification: System-code-graph skill docs sk-doc alignment"
description: "Align system-code-graph skill-level documentation with sk-doc structure, HVR, frontmatter and source-anchor standards without touching README, architecture or source-code files."
trigger_phrases:
  - "011 skill docs sk-doc alignment"
  - "system-code-graph skill docs alignment"
  - "mk-code-index documentation alignment"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-025-skill-docs-sk-doc-alignment"
    last_updated_at: "2026-05-14T17:43:47Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-011"
    recent_action: "Created 011 docs-only alignment packet"
    next_safe_action: "Commit scoped documentation changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/feature_catalog/"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-011-skill-docs-sk-doc-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet 010 has landed, so live MCP namespace references use mk-code-index."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: System-code-graph skill docs sk-doc alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Parent Chain** | `system-spec-kit` -> `002-graph-and-context-optimization` -> `005-code-graph` -> `013-system-code-graph-extraction` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-code-graph skill docs had drift from current sk-doc expectations. `SKILL.md` still referenced old category-22 docs, some catalog entries pointed at stale schema line ranges and playbook prompts used RCAF framing where natural operator prompts fit better.

### Purpose

Bring the scoped skill docs up to sk-doc quality without touching README files, architecture docs, source code, packet 013 or packet 014.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Align `.opencode/skills/system-code-graph/SKILL.md` with current `mk-code-index` namespace, current catalog paths and sk-doc skill structure.
- Align `.opencode/skills/system-code-graph/feature_catalog/**` with current source anchors, trigger phrases, current-reality wording and HVR punctuation.
- Align `.opencode/skills/system-code-graph/manual_testing_playbook/**` with natural operator prompts, current MCP namespace guidance and precise file:line references.
- Create and maintain this 011 Level 1 packet.

### Out of Scope

- README files because packet 013 owns them.
- `architecture.md` because packet 014 owns it.
- Source code, schemas and JSON config files outside this packet.
- System-spec-kit user docs because packet 012 owns that surface.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modify | Refresh runtime routing, current references and success criteria. |
| `.opencode/skills/system-code-graph/feature_catalog/**/*.md` | Modify | Tighten frontmatter, source anchors and current-reality entries. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/**/*.md` | Modify | Refresh root guidance, operator prompts and source-line references. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/025-skill-docs-sk-doc-alignment/` | Create | Track scope, plan, tasks and implementation evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stay docs-only | Git diff contains no source-code or config edits outside the new 011 packet metadata. |
| REQ-002 | Keep packet boundaries | No README, `architecture.md`, packet 013 or packet 014 files are modified. |
| REQ-003 | Use landed MCP rename | Live MCP references use `mk-code-index` and `mcp__mk_code_index__*` where the standalone code graph server is referenced. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Align `SKILL.md` | `SKILL.md` has current paths, complete frontmatter, no stale category-22 routing table entries and no template placeholders. |
| REQ-005 | Align catalog entries | Feature catalog files have current source anchors, deduplicated trigger phrases and concrete current-reality wording. |
| REQ-006 | Align playbook entries | Manual playbook files use natural operator prompts and precise source references for command/YAML checks. |
| REQ-007 | Validate packet | `validate.sh --strict` passes for the 011 spec folder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg` finds no stale `mcp__system_code_graph__*` or `system_code_graph` live namespace references in scoped skill docs.
- **SC-002**: `rg` finds no template placeholders in the 011 packet docs.
- **SC-003**: Strict spec validation exits 0.
- **SC-004**: Commit stages only the 011 packet and edited system-code-graph docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 010 MCP rename | Docs need the correct live server name. | Packet 010 implementation summary shows the rename landed, so use `mk-code-index`. |
| Risk | Parallel README and architecture packets | Cross-packet edits could conflict. | Do not touch README files, packet 013, packet 014 or architecture docs. |
| Risk | Existing dirty worktree | Unrelated changes could be staged by mistake. | Stage only the explicit 011 packet and scoped system-code-graph docs. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
