---
title: "Feature Specification: Code-Graph Extraction and Isolation [system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation/spec]"
description: "The system-code-graph extraction and standalone-MCP isolation track: extraction, extraction design and decision record, standalone-MCP topology pivot, and three-way isolation."
trigger_phrases:
  - "code graph extraction and isolation"
  - "system-code-graph extraction"
  - "standalone mcp isolation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation"
    last_updated_at: "2026-05-26T17:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase-parent map during the 026 wave-4 phase work."
    next_safe_action: "Resume or plan a child phase folder listed in the Phase Documentation Map."
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Code-Graph Extraction and Isolation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-26 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/004-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-code-graph extraction and standalone-MCP isolation track: extraction, extraction design and decision record, standalone-MCP topology pivot, and three-way isolation.

### Purpose
Own navigation, the child-phase map, and aggregate status for this theme. Each child phase folder owns its own planning, execution, and verification.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the child phase folders for this theme and their aggregate status.
- Provide the navigation map from this theme to each child phase folder.

### Out of Scope
- Per-child implementation detail (lives in each child phase folder).
- Phase history narration (lives in the root `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-system-code-graph-extraction/` … `004-three-way-isolation-finalize/` | Modify | children | Per-child work lives in the child phase folders |
| `spec.md`, `graph-metadata.json`, `description.json` | Modify | this | Theme navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. The Status column reports child state.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-system-code-graph-extraction/` | Extraction | complete |
| 002 | `002-extraction-design-and-decision-record/` | Extraction design and decision record | complete |
| 003 | `003-standalone-mcp-topology-pivot/` | Standalone-MCP topology pivot | complete |
| 004 | `004-three-way-isolation-finalize/` | Three-way isolation finalize | complete |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently.
- This parent tracks aggregate progress via the map; per-child detail stays in the children.
- Deferred and abandoned children remain in place with explicit status; they are not removed.
- Use `/spec_kit:resume` on a child folder to resume it.
- Run `validate.sh --recursive` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-system-code-graph-extraction` | `004-three-way-isolation-finalize` | Earlier children stable before later children build on them | Each child validates independently |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Deferred children are tracked in place and resumed via their folders when prioritized.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
