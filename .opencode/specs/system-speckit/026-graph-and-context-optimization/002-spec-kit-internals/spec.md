---
title: "Feature Specification: Spec-Kit Internals [system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/spec]"
description: "Improve internal spec-kit and skill-system mechanics: the resource-map and deep-loop artifact plumbing, the skill-advisor system, the spec-folder template system, and spec-folder naming policy."
trigger_phrases:
  - "026 spec-kit internals"
  - "skill advisor template system"
  - "spec folder naming policy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals"
    last_updated_at: "2026-05-26T17:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase-parent map during the 026 wave-4 phase work."
    next_safe_action: "Resume or plan a child phase folder listed in the Phase Documentation Map."
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---

# Feature Specification: Spec-Kit Internals

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Improve internal spec-kit and skill-system mechanics: the resource-map and deep-loop artifact plumbing, the skill-advisor system, the spec-folder template system, and spec-folder naming policy.

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
| `001-resource-map-deep-loop-fix/` … `005-orchestrator-placeholder-parity/` | Modify | children | Per-child work lives in the child phase folders |
| `spec.md`, `graph-metadata.json`, `description.json` | Modify | this | Theme navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. The Status column reports child state.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-resource-map-deep-loop-fix/` | resource-map.md template and deep-loop artifact placement and auto-emit | complete |
| 002 | `002-template-levels/` | Manifest-driven spec template system (research, design, implementation) | in progress (85%) |
| 003 | `003-literal-spec-folder-names/` | Concrete-token spec-folder and phase naming policy | deferred |
| 004 | `004-validate-recursive-orchestrator-fix/` | validate.sh --recursive orchestrator fix | see child for status |
| 005 | `005-orchestrator-placeholder-parity/` | Orchestrator placeholder parity | see child for status |

The skill-advisor system (formerly this hub's phase 002) moved to its own dedicated track, `system-skill-advisor/`, on 2026-07-07.

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently.
- This parent tracks aggregate progress via the map; per-child detail stays in the children.
- Deferred and abandoned children remain in place with explicit status; they are not removed.
- Use `/spec_kit:resume` on a child folder to resume it.
- Run `validate.sh --recursive` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-resource-map-deep-loop-fix` | `005-orchestrator-placeholder-parity` | Earlier children stable before later children build on them | Each child validates independently |
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
