---
title: "Feature Specification: Spec-Kit Memory MCP — External Mining"
description: "Mine galadriel + aionforge for evidence-backed, code-mapped improvements to the Spec-Kit Memory MCP 5-channel RRF retrieval, causal graph, decay, and continuity."
trigger_phrases:
  - "028 speckit memory mining"
  - "memory mcp retrieval improvements"
  - "query class routing memory"
  - "edge based bitemporal currentness"
  - "idempotent async consolidation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed memory child spec for the deep-research loop"
    next_safe_action: "Run /deep:research:auto on this folder (ceiling 18 @0.02)"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-001-speckit-memory"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Spec-Kit Memory MCP — External Mining

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Memory MCP fuses five channels (vector, FTS5, BM25, causal-graph, degree) via RRF with FSRS power-law decay, but has no query-class routing, uses flag-based fact currentness, blocks on synchronous consolidation, and does not guarantee deterministic recall serialization. The external systems encode mature alternatives to each.

### Purpose
Produce evidence-backed, code-mapped improvement candidates for the Memory MCP by mining galadriel and aionforge, ranked by leverage and effort. PRIMARY target of packet 028.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of `external/aionforge-memory-development/docs/**` and `external/galadriel-public-main 2/**`.
- Mapping external techniques to specific Memory MCP modules (channel fusion, save path, recall rendering, causal graph).
- Candidate proposals with citations and effort estimates.

### Out of Scope
- Implementing the candidates.
- Touching the other three subsystems (covered by sibling phases).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate cites an external source and an internal module | Source path + internal file named per candidate |
| REQ-002 | Candidates cover query-class routing, edge-based supersession, idempotent async consolidation, rank-time decay, and cache-friendly serialization | All five themes addressed in research.md |
| REQ-003 | Candidates ranked by leverage × effort | Ranked table in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains ≥6 code-mapped candidates, each citing an external source and an internal Memory MCP module.
- **SC-002**: All five themes (query-class routing, edge-based supersession, idempotent async consolidation, rank-time decay, cache-friendly serialization) are addressed and ranked.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Early convergence | Fewer iterations than budget | Broaden scope / add key questions, then resume a new generation |
| Dependency | External doc readability | Weak or unsupported mappings | Cite file:line per candidate; mark inferences |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which of aionforge's 8 RRF signals and 5 query classes improve the existing 5-channel fusion, and which conflict with it?
- How would edge-based supersession/contradiction (vs is_current flags) integrate with the existing causal graph and the off-state soft-delete tombstones?
- Can the save path be split into a fast episode-write plus deterministic async consolidation with content-addressed IDs without breaking continuity?
- What is the smallest change that makes recall serialization byte-identical for prompt-cache reuse?
- Does galadriel's zero-token local retrieval model suggest a budget-free recall tier?
- Which candidates generalize to the code-graph, skill-advisor, or deep-loop subsystems?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research output**: See `research/research.md`.
- **Parent Spec**: See `../spec.md`.
<!-- /ANCHOR:related-docs -->
