---
title: "Phase Parent 011 — Coco Memory Context Extras"
description: "Phase parent for two independent presentation-layer tracks: Coco exemplars and memory context curation. Child phases own implementation plans, tasks, checklists, and continuity."
trigger_phrases:
  - "027 phase 011"
  - "coco memory context extras"
  - "coco exemplars track"
  - "memory curator track"
  - "phase parent 011"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded phase parent"
    next_safe_action: "Resume a child phase"
    blockers: []
    key_files: ["spec.md", "description.json", "graph-metadata.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Coco Memory Context Extras

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | phase-parent |
| **Created** | 2026-05-09 |
| **Branch** | `main` |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement` |
| **Packet ID** | `system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras` |
| **Hard Dependency** | `system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork` |
| **Soft Dependencies** | `006-code-graph-adoption-eval`, `008-memory-semantic-triggers`, `009-feedback-reducers` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pt-03 RQ-A4 identified that Coco queries have no governed way to show prior helpful examples for similar searches. Pt-03 RQ-B2 identified that memory context retrieval can return deterministic ranked results, but it cannot package those results into an intent-aware context plan without a caller doing that work manually.

### Purpose
This phase parent coordinates two orthogonal presentation-layer tracks. Track A adds Coco exemplar infrastructure in Python under `.opencode/skills/mcp-coco-index/`; Track B adds memory curator packaging in TypeScript under `.opencode/skills/system-spec-kit/mcp_server/lib/search/`. Neither track changes ranking authority or canonical result ordering.

The audit narrative stays binding: Coco exemplars surface "what helped before" in a separate group, and memory curation returns `data.curatedContext` as a post-retrieval plan. Both tracks stay default-off, shadow-first, and gated by Phase 006 lift evidence before active rollout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Track A child phases for Coco exemplar schema, retrieval, and maintenance.
- Track B child phases for context curator prompt/schema work and memory-search integration.
- Parent-level dependency metadata and child routing.
- Default-off rollout requirements, deterministic fallback, and Phase 006 eval gate.

### Out of Scope
- Parent-level implementation plans, task tables, checklists, decision records, or summaries.
- Ranking-score mutation for either track.
- Cross-track fusion between Coco exemplars and memory curated context.
- Code changes outside the child phase scopes.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/examples_schema.py` | Create | `001-exemplars-schema` | Exemplar schema and SQLite migration |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/exemplar_retriever.py` | Create | `002-exemplars-retriever` | Exemplar lookup and separate response group |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/exemplar_maintenance.py` | Create | `003-exemplars-maintenance` | TTL, cap, reconciliation, and clear operation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context_curator.ts` | Create | `004-curator-prompt` | Prompt, parser, schema validation, and cache extension |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-search.ts` | Modify | `005-curator-integration` | Budget split and curator hook integration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each child phase is independently executable. Planning, task tracking, verification checklists, and continuity live in the child folders.

### Track A: Coco Exemplars

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 1 | [001-exemplars-schema/](001-exemplars-schema/) | `examples_schema.py` plus SQLite migration | `001-cocoindex-complete-fork` | Pending |
| 2 | [002-exemplars-retriever/](002-exemplars-retriever/) | `exemplar_retriever.py` query-time retrieval | `001-exemplars-schema`, `001-cocoindex-complete-fork` | Pending |
| 3 | [003-exemplars-maintenance/](003-exemplars-maintenance/) | `exemplar_maintenance.py` TTL and reconciliation | `001-exemplars-schema`, `002-exemplars-retriever`, `001-cocoindex-complete-fork` | Pending |

### Track B: Memory Curator

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 4 | [004-curator-prompt/](004-curator-prompt/) | `context_curator.ts` prompt, parser, and cache extension | None | Pending |
| 5 | [005-curator-integration/](005-curator-integration/) | `memory-search.ts` budget split and hook wiring | `004-curator-prompt` | Pending |

### Phase Transition Rules

- Track A and Track B can proceed in parallel.
- Within Track A, run phases 001, 002, then 003.
- Within Track B, run phase 004 before phase 005.
- Each child phase MUST pass `validate.sh --strict` independently before implementation begins.
- Run `validate.sh --recursive` on this parent when checking aggregate phase structure.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 001-exemplars-schema | 002-exemplars-retriever | Schema contract and migration plan are stable | Child 001 strict validation exits 0 |
| 002-exemplars-retriever | 003-exemplars-maintenance | Retriever contract defines exemplar identity and stale-hit behavior | Child 002 strict validation exits 0 |
| 004-curator-prompt | 005-curator-integration | Curator output schema, parser, and cache key are stable | Child 004 strict validation exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at the parent level. Child packets carry implementation-specific questions and decision points.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Graph Metadata**: `graph-metadata.json`
- **Discovery Metadata**: `description.json`
- **Child packets**: `001-exemplars-schema/`, `002-exemplars-retriever/`, `003-exemplars-maintenance/`, `004-curator-prompt/`, `005-curator-integration/`
