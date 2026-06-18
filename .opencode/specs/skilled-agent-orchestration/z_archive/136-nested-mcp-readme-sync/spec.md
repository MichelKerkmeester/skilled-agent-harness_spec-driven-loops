---
title: "Feature Specification: nested MCP README sync"
description: "Sync three nested mcp_server READMEs with their real tool sets, fixing stale tool listings surfaced by the packet-135 QA audit."
trigger_phrases:
  - "nested mcp readme sync"
  - "nested code readme freshness"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-nested-mcp-readme-sync"
    last_updated_at: "2026-06-07T18:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synced 3 nested mcp_server READMEs with their tool sets"
    next_safe_action: "Return to packet 135 phase 024 (skills index README)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tools/README.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "nested-readme-sync-136"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three pre-existing stale nested READMEs from the 135 QA: skill-advisor tools/README.md (added skill_graph_propagate_enhances in 3 spots), skill-advisor handlers/README.md (added the skill-graph/ subhandlers), code-graph handlers/README.md (added code_graph_classify_query_intent to the entrypoints table)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: nested MCP README sync

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The packet-135 QA audit (two read-only gpt-5.5-fast reviewers) found three nested `mcp_server` READMEs that had drifted behind their real tool sets. These are pre-existing, outside packet 135's top-level-README scope, but the operator asked to bring the related code READMEs up to date.

### Purpose

Sync the three nested READMEs with the live tool descriptors and handlers so an operator reading them sees the complete MCP surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `system-skill-advisor/mcp_server/tools/README.md`: add `skill_graph_propagate_enhances`.
- `system-skill-advisor/mcp_server/handlers/README.md`: add the `skill-graph/` subhandlers.
- `system-code-graph/mcp_server/handlers/README.md`: add `code_graph_classify_query_intent`.

### Out of Scope

- Any SKILL.md, code or behavior change. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/tools/README.md` | Modify | Add the fifth skill-graph tool descriptor |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/README.md` | Modify | Document the skill-graph handler subdirectory |
| `.opencode/skills/system-code-graph/mcp_server/handlers/README.md` | Modify | Add the classify-query-intent entrypoint row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Nested READMEs match their real tool sets | Each lists every tool or handler the source registers |
| REQ-002 | Structure stays valid | `validate_document.py --type readme` reports 0 issues on each |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Additions are HVR-clean | No em dashes, double-hyphen separators, semicolons or Oxford-comma lists in the new prose |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three nested READMEs validate with 0 issues and list their full tool sets.
- **SC-002**: The added tool names match the live descriptors and handlers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A tool name typo | Misleading reference | Names copied from the live descriptors verified during the 135 QA |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The stale listings and the correct tool sets were verified against source.
<!-- /ANCHOR:questions -->
