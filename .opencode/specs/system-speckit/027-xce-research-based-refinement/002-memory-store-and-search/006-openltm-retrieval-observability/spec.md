---
title: "008 — OpenLTM Retrieval & Memory Observability"
description: "Make memory retrieval inspectable: an actual-ranker why_ranked breakdown, inline contradiction/supersession warnings, an explicit degraded-vector signal, and maintenance counters — all keyed to document path/anchor, derived from OpenLTM research phase 010."
trigger_phrases:
  - "027 phase 008"
  - "openltm retrieval observability"
  - "why_ranked actual ranker"
  - "inline contradiction supersession warning"
  - "vector degradation signal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/006-openltm-retrieval-observability"
    last_updated_at: "2026-06-10T13:03:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped retrieval observability surfaces"
    next_safe_action: "Use trace/debug and health surfaces when diagnosing recall"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-08-010-openltm-phase-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Derived from research/010-openltm-memory-architecture-teachings (corrected Priority 3)."
      - "Storage-fit: DOC-ANALOG — surfaces key to doc path/anchor, not memory row IDs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 008 — OpenLTM Retrieval & Memory Observability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 (OpenLTM-derived, retrieval/observability) |
| **Predecessor** | `007-memclaw-derived-memory-hardening` |
| **Successor** | `009-openltm-continuity-resilience` |
| **Source** | `../research/010-openltm-memory-architecture-teachings/research.md` §8 + `sub-packet-proposals.md` (corrected Priority 3) |
| **Handoff Criteria** | Defined during planning; all surfaces additive and read-only to the ranking. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

OpenLTM-derived observability phase. Both OpenLTM and our store are single-user and local, so the value is design, not scale. OpenLTM's recall is weaker than ours (it does keyword-first candidate generation; we run fused vector/BM25/FTS/graph/trigger search with FSRS), so we adopt **observability**, not its ranking. The hard constraint from research phase 010 is the storage-model difference: our memories are authored documents, so every surface here keys to a **document path/anchor**, never an OpenLTM-style memory row ID.

**Scope Boundary**: read-only/additive observability over the existing retrieval + maintenance paths. No change to ranking, scoring, decay, or write paths.

**Dependencies**: none hard. Coordinates with `003-memory-index-causal-lifecycle` (causal edges already store `contradicts`/`supersedes`) and `008-openltm`-sibling resilience work in `009`.

**Deliverables**: a `why_ranked` trace, inline conflict warnings, a degraded-vector signal, and maintenance counters — all behind existing trace/health surfaces.

**Changelog**: on close, refresh the matching `../changelog/` entry using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Memory retrieval is hard to inspect. There is no compact, per-result explanation of *why* a memory ranked from the actual fused ranker; contradictions and supersessions are stored as causal edges but are not surfaced where agents consume results; degraded vector search (e.g. the local ollama embedder/shard unavailable) can silently fall back to lexical-only without signalling; and maintenance (index scan, embedding reconcile, retention) lacks last-run counters for operator trust.

### Purpose
Give operators and agents a faithful, additive view into retrieval and memory health — a real-ranker `why_ranked`, inline conflict warnings, an explicit degraded-vector signal, and maintenance counters — without altering any ranking or write behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Actual-ranker `why_ranked`**: an opt-in, per-result breakdown of the *real* fused ranker's contributions (vector / BM25 / FTS / graph / trigger / FSRS / importance / recency), exposed via the existing trace surface (`memory_search(includeTrace)`, `memory_context(profile=debug)`), keyed to document path/anchor.
- **Inline contradiction/supersession warnings**: when retrieved memories are linked by `contradicts`/`supersedes` causal edges, surface a compact "verify before applying" warning in the retrieval/context response, not only in graph-debug tools.
- **Degraded-vector signal**: an explicit recall-time indicator (via `memory_health` / search trace) when semantic search is unavailable or the active vector shard is degraded, so answers are not silently lexical-only.
- **Maintenance observability counters**: last-run counts and stale-candidate reports for `memory_index_scan`, `memory_embedding_reconcile`, and retention sweep.

### Out of Scope
- Any change to ranking, scoring, decay (FSRS), or write paths — these surfaces are read-only/additive.
- OpenLTM's display-only blended score (it does not match their actual sort key) — rejected as negative knowledge in research §6.
- Row-ID-keyed traces — superseded by document path/anchor keying.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| memory search / context handlers | Modify | Emit doc-anchor `why_ranked` trace under `includeTrace`/`profile=debug`. |
| retrieval response formatter | Modify | Inline contradiction/supersession warning when edges present. |
| `memory_health` / embedder status surface | Modify | Expose degraded-vector signal + maintenance counters. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `why_ranked` must be derived from the actual fused ranker, not a separate display formula. | Trace output lists the real per-channel contributions that produced the order; the explanation cannot disagree with the ranking. |
| REQ-002 | Every retrieval/observability surface keys to a document path/anchor, never a memory row ID. | All emitted identifiers resolve to a spec-doc path + anchor; no opaque row IDs leak to consumers. |
| REQ-003 | Inline `contradicts`/`supersedes` warnings surface where agents consume memories. | When two returned memories are linked by such an edge, the retrieval/context response carries a compact warning; suppression of a superseded doc only happens with verified record state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Provide an explicit degraded-vector signal at recall time. | When the embedder/shard is unavailable, the search trace and `memory_health` report degraded state instead of silently returning lexical-only results. |
| REQ-005 | Provide maintenance counters for scan / reconcile / retention. | `memory_health` (or equivalent) reports last-run counts and stale-candidate totals for each maintenance pass. |
| REQ-006 | All surfaces are additive and read-only to ranking and writes. | Enabling any surface does not change result order, decay, or persisted state; surfaces are opt-in. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `why_ranked` trace can be produced for a retrieval and its channel contributions match the actual order.
- **SC-002**: A retrieval that includes a `contradicts`/`supersedes` pair shows an inline warning keyed to the documents involved.
- **SC-003**: With the embedder disabled, retrieval reports a degraded-vector signal rather than silently degrading.
- **SC-004**: `memory_health` reports last-run + stale-candidate counters for scan, reconcile, and retention.
- **SC-005**: Enabling the surfaces leaves ranking, decay, and persisted state unchanged (verified by stack-appropriate tests).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A separate `why_ranked` computation could drift from the ranker (OpenLTM's exact failure). | Med | Derive the trace from the ranker's own intermediate scores; do not recompute. |
| Risk | Inline conflict warnings could be noisy on large result sets. | Low | Only warn when an explicit `contradicts`/`supersedes` edge connects two returned items. |
| Dependency | Causal edge vocabulary (`contradicts`/`supersedes`) owned by `003-memory-index-causal-lifecycle`. | Low | Consume existing edges; do not redefine the vocabulary here. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `why_ranked` be opt-in per call (`includeTrace`) only, or also available as a sampled background diagnostic?
- Should the degraded-vector signal be advisory only, or also gate which channels contribute to ranking until recovery?
<!-- /ANCHOR:questions -->
