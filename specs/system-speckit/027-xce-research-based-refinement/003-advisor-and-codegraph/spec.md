---
title: "Feature Specification: Advisor and Code Graph (Phase Parent)"
description: "Phase-parent for the shared BFS traversal helper retained by both skill-advisor and code-graph consumers."
trigger_phrases:
  - "027 advisor and code graph"
  - "causal traversal bfs"
  - "xce feature adoption advisor codegraph"
  - "skill advisor cross session reconnect"
  - "advisor state spec folder leak"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/003-advisor-and-codegraph"
    last_updated_at: "2026-06-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Record that codegraph-specific nested content moved under the system-code-graph track"
    next_safe_action: "Resume or validate a child phase folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration narratives, renamed-from, X to Y history
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Advisor and Code Graph (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph carried recursive-CTE traversals that defeated its indexes and needed a shared snapshot-equivalent BFS helper. That helper is also consumed by the skill-advisor's own skill-graph queries, so it stays here as shared infrastructure rather than moving with the advisor-only work.

### Purpose
Own the shared BFS helper so it remains visible as shared infrastructure for both code-graph and skill-advisor consumers. The codegraph-specific nested feature-adoption content moved to `system-code-graph/009-advisor-codegraph-shared-features/`; the advisor-only phases moved to `system-skill-advisor/009-advisor-and-codegraph-migrated-items/`.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below. Program-level history and consolidation narrative live in the 027 root `../context-index.md` and `../timeline.md` — not here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared app-level BFS traversal helper for the code graph (also consumed by skill-advisor).
- The retained `001-causal-traversal-bfs/` child phase.

### Out of Scope
- Memory-store and search work (track 002).
- Shared transport, command, and dependency layers (track 004).
- Advisor-only work: moved to `system-skill-advisor/009-advisor-and-codegraph-migrated-items/`.
- Codegraph-specific nested feature-adoption work: moved to `system-code-graph/009-advisor-codegraph-shared-features/`.
- Implementation detail at the parent level.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| child phase folders `[0-9][0-9][0-9]-*/` | Modify/Create | all | Per-phase implementation lives in the child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-causal-traversal-bfs/` | Replace the recursive-CTE graph traversals with a shared snapshot-equivalent BFS helper | Complete |

The former codegraph-specific nested phase parent moved to `system-code-graph/009-advisor-codegraph-shared-features/`.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| (per-child) | (next child) | Each child ships and validates independently under tolerant policy | Per-child strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open at the parent level; per-phase questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md`.
- **Program history**: See `../context-index.md` and `../timeline.md` at the 027 root.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
