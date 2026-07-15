---
title: "Feature Specification: Graph Impact and Affordance [system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/spec]"
description: "Deliver the external-project adoption uplift: a code-graph phase runner, edge-explanation and impact display, skill-advisor affordance evidence, and memory causal-trust display."
trigger_phrases:
  - "026 graph impact and affordance"
  - "external project adoption uplift"
  - "affordance evidence display"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/005-graph-impact-and-affordance"
    last_updated_at: "2026-05-26T17:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase-parent map during the 026 wave-4 phase work."
    next_safe_action: "Resume or plan a child phase folder listed in the Phase Documentation Map."
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Feature Specification: Graph Impact and Affordance

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Deferred |
| **Created** | 2026-05-26 |
| **Branch** | `002-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deliver the external-project adoption uplift: a code-graph phase runner, edge-explanation and impact display, skill-advisor affordance evidence, and memory causal-trust display. Most of this track is planned and deferred in place.

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
| `001-code-graph-phase-runner/` … `006-deep-research-review/` | Modify | children | Per-child work lives in the child phase folders |
| `spec.md`, `graph-metadata.json`, `description.json` | Modify | this | Theme navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. The Status column reports child state.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-code-graph-phase-runner/` | Code-graph phase runner and detect-changes | deferred |
| 002 | `002-edge-explanation-impact-uplift/` | Edge explanation and impact uplift | deferred |
| 003 | `003-skill-advisor-affordance-evidence/` | Skill-advisor affordance evidence display | deferred |
| 004 | `004-memory-causal-trust-display/` | Memory causal-trust display layer | deferred |
| 005 | `005-deep-review-findings/` | Deep-review findings for the adoption track | abandoned |
| 006 | `006-deep-research-review/` | Deep research and review spike for adoption | abandoned |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently.
- This parent tracks aggregate progress via the map; per-child detail stays in the children.
- Deferred and abandoned children remain in place with explicit status; they are not removed.
- Use `/spec_kit:resume` on a child folder to resume it.
- Run `validate.sh --recursive` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-code-graph-phase-runner` | `006-deep-research-review` | Earlier children stable before later children build on them | Each child validates independently |
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
