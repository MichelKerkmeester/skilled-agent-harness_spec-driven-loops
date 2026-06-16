---
title: "Feature Specification: Advisor and Code Graph (Phase Parent)"
description: "Phase-parent for the skill-advisor and code-graph subsystem phases: causal traversal, cross-subsystem feature adoption, and advisor launcher resilience."
trigger_phrases:
  - "027 advisor and code graph"
  - "causal traversal bfs"
  - "xce feature adoption advisor codegraph"
  - "skill advisor cross session reconnect"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author 003-advisor-and-codegraph phase-parent control trio"
    next_safe_action: "Resume or validate a child phase folder"
    blockers: []
    key_files:
      - "spec.md"
      - "001-causal-traversal-bfs/spec.md"
      - "002-xce-feature-adoption-advisor-codegraph/spec.md"
      - "003-skill-advisor-cross-session-reconnect/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 0
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
Two sibling daemons beyond the memory store needed 027's hardening: the skill-advisor lacked launcher resilience and had not adopted the proven write-safety and observability patterns, and the code-graph carried recursive-CTE traversals that defeated its indexes. The advisor and code-graph work is cross-cutting between two subsystems, so it belongs under one themed parent.

### Purpose
Own the advisor and code-graph child phases so each can be resumed and validated independently while the parent keeps the phase map and handoff order visible.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared app-level BFS traversal helper for the code graph.
- XCE feature transfers into skill-advisor and code-graph (observability, provenance guard, packed BM25, BFS, tombstone audit, why-included trace, symbol resolver).
- Skill-advisor owner-lease and reconnecting proxy for transport-drop resilience.

### Out of Scope
- Memory-store and search work (track 002).
- Shared transport, command, and dependency layers (track 004).
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
| 001 | `001-causal-traversal-bfs/` | Replace the recursive-CTE graph traversals with a shared snapshot-equivalent BFS helper | Shipped |
| 002 | `002-xce-feature-adoption-advisor-codegraph/` | XCE feature transfers into the skill-advisor and code-graph skills (observability, provenance, packed BM25, BFS, tombstones) | Complete |
| 003 | `003-skill-advisor-cross-session-reconnect/` | Owner-lease + reconnecting proxy so mk_skill_advisor survives MCP transport drops | Complete |
| 004 | `004-skill-advisor-suite-repair/` | Fix deep-loop-workflows merge fallout in the advisor test suite + align brief-assertion tests with the fable-5 governor | Complete |

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
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
