---
title: "Feature Specification: Code Graph — External Mining"
description: "Mine aionforge edge-based bi-temporal lifecycle, idempotent IDs, PPR expansion, and readiness semantics for the tree-sitter→SQLite code graph."
trigger_phrases:
  - "028 code graph mining"
  - "code graph edge lifecycle"
  - "non destructive reindex"
  - "ppr impact ranking"
  - "code graph readiness watermark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed code-graph child spec for the deep-research loop"
    next_safe_action: "Run /deep:research:auto on this folder (ceiling 12 @0.03)"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-002-code-graph"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Code Graph — External Mining

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
The code graph (tree-sitter→SQLite typed edges) mutates edges destructively on incremental reindex, lacks idempotent edge IDs and a hard readiness watermark, ranks impact with flat edge walks, and skips doc-lane symbols. Aionforge encodes non-destructive bi-temporal lifecycle, content-addressed IDs, quarantine-not-wedge recovery, and generation-checked readiness.

### Purpose
Produce evidence-backed, code-mapped improvement candidates for the code graph by mining the external systems, ranked by leverage and effort.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of `external/aionforge-memory-development/docs/**` and relevant galadriel retrieval notes.
- Mapping techniques to the scan, edge-write, and retrieval code paths.

### Out of Scope
- Implementing the candidates.
- Touching the other three subsystems.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate cites an external source and an internal module | Source path + internal file named per candidate |
| REQ-002 | Candidates cover non-destructive reindex, idempotent edge IDs, PPR impact ranking, rank-time edge-weight learning, doc-lane extraction, readiness watermark | All themes addressed |
| REQ-003 | Candidates ranked by leverage × effort | Ranked table in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains code-mapped candidates, each citing an external source and an internal code-graph module (scan, edge-write, or retrieval path).
- **SC-002**: Candidates cover non-destructive reindex, idempotent edge IDs, PPR impact ranking, rank-time edge-weight learning, doc-lane extraction, and the readiness watermark.
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

- Can incremental reindex supersede stale edges with closed validity windows instead of deleting them, enabling as-of-last-green-scan impact queries?
- Do content-addressed edge IDs plus transient/fatal parse classification remove the single-poison-file wedge?
- Does Personalized-PageRank seeding improve impact ranking over flat edge walks at acceptable cost?
- Can edge-weight learning fold a rank-time reliability multiplier without corrupting the deterministic structural graph?
- Is a zero-token local doc-lane symbol pass worth adding?
- Should readiness become a hard generation watermark (stale = error) rather than a hint?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research output**: See `research/research.md`.
- **Parent Spec**: See `../spec.md`.
<!-- /ANCHOR:related-docs -->
