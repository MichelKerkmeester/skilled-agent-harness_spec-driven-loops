---
title: "Implementation Summary: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)"
description: "Implementation summary for the per-edge semantic substrate: schema, edge-vector store, consolidation embedder hook and shadow retrieval primitive implemented. Semantic dedup/invalidation and benchmark remained pending, then the flag family was removed as a no-go after measurement."
trigger_phrases:
  - "028 semantic edge layer implementation summary"
  - "semantic-edge-layer summary"
  - "per edge embedding delivery status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer"
    last_updated_at: "2026-07-06T19:16:32.424Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented semantic-edge substrate and shadow retrieval primitive"
    next_safe_action: "Run strict validation and final typecheck/tests"
    blockers:
      - "needs-benchmark post gate-zero reindex"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-017-semantic-edge-layer"
      parent_session_id: null
    completion_pct: 65
    open_questions:
      - "Recall lift + dedup false-merge rate pending the post-reindex benchmark"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **STATUS: NO-GO (PARTIAL).** The substrate/root work was delivered shadow-only and default-off. Semantic dedup/merge, cross-pair invalidation and post-reindex benchmark/promotion stayed pending, then the whole edge flag family and its code were removed in the flag-resolution reckoning because the layer stayed recall-inert at K=20. See Known Limitations item 1 for the full no-go detail.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-semantic-edge-layer |
| **Status** | No-Go (Partial) |
| **Completed** | 2026-06-19 (substrate landed shadow-only, then removed as a no-go) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This pass builds the semantic-edge substrate without turning on live recall or LLM consumers. Causal edges now have passive fact text, a dedicated `edge_vector_embeddings` collection, a deterministic local edge-vector store, a flag-gated consolidation-time embedding hook and shadow retrieval primitives for nearest-edge lookup and triplet scoring.

### Substrate root, `GR-fact-embedding-on-edge`

The additive v41 migration gives `causal_edges` a nullable `fact_text` column and creates `edge_vector_embeddings`. Existing edges get deterministic fact text backfilled from evidence when available, otherwise from the source/relation/target triplet. `runConsolidationCycle` accepts a flag-gated edge embedding provider, and with `SPECKIT_SEMANTIC_EDGE_LAYER` off it does nothing and calls no provider.

### Shadow primitives

`CG-edge-vector-index` and `CG-edge-aware-triplet-search` are implemented as shadow primitives only. `findSemanticEdges` is behind `SPECKIT_EDGE_VECTOR_INDEX` and `rankEdgeTripletCandidates` is behind `SPECKIT_EDGE_TRIPLET_SEARCH`, and neither is wired into live fused recall.

`GR-semantic-fact-dedup-merge` and `GR-semantic-invalidation-discovery` remain PENDING. They need benchmark evidence and safety work before any LLM adjudication or cross-pair invalidation consumer exists.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modified | v41 semantic-edge migration/backfill/rollback + compatibility footprint |
| `mcp_server/lib/storage/causal-edges.ts` | Modified | Passive `fact_text` write support, exact-key upsert unchanged, no embedding call |
| `mcp_server/lib/storage/edge-vector-store.ts` | Created | Dedicated edge-relationship vector collection + nearest-edge lookup |
| `mcp_server/lib/storage/consolidation.ts` | Modified | Flag-gated edge-embedding hook in `runConsolidationCycle` |
| `mcp_server/lib/graph/edge-semantic-retrieval.ts` | Created | Nearest-edge lookup + edge-aware-triplet scorer (side primitive) |
| `mcp_server/lib/search/search-flags.ts` | Modified | `SPECKIT_SEMANTIC_EDGE_LAYER` + four consumer flags, default-off |
| `mcp_server/tests/semantic-edge-layer.vitest.ts` | Created | Passive insert, store/retrieval, flag isolation, consolidation embedder/failure tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is substrate-first and version-coordinated with the retention phase: the semantic-edge schema rides the same v41 migration step rather than bumping to a separate version. Runtime behavior is default-off through `SPECKIT_SEMANTIC_EDGE_LAYER` and per-consumer flags. The synchronous insert path only writes passive text, and embedding work is exposed through the consolidation cycle hook and requires both the flag and an injected provider.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the substrate once, root-first | Five candidates all need the same absent substrate, none ships cheaply alone (`synthesis/06:168`) |
| Embed at consolidation-time, not insert-time | Keeps embedding/LLM out of the synchronous deterministic SQLite write path (iter-21 caveat) |
| Ship the whole initiative shadow-gated default-off | Results-affecting intelligence earns activation on live evidence, LLM dedup can silently merge two distinct facts (highest tail-risk) |
| Mirror the existing `ports/vector-store.ts` | Avoids a parallel embedding stack for the edge-vector collection |
| Defer the benchmark to post gate-zero reindex | Recall lift is unmeasurable against a quarter-dark index (027/002 §13, `synthesis/06:165-166`) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Migration back-compat (flag-off old reads/insert unchanged) | PASS |
| Flag-off isolation (insert/consolidation no embedding work) | PASS |
| Synchronous `insertEdge` txn + deterministic core untouched | PASS |
| Semantic-edge targeted vitest | PASS, `semantic-edge-layer.vitest.ts`, schema/compat/flag tests also cover v41 and flag registry |
| Dedup false-merge benchmark + edge-aware recall lift (post-reindex) | NOT RUN (family removed before the benchmark) |
| `validate.sh --strict` on this packet (docs) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No-go outcome: substrate-only, then removed.** The substrate landed shadow-only and default-off, then measurement closed it out as a no-go and the whole edge flag family was removed. The `SPECKIT_SEMANTIC_EDGE_LAYER` flag and the consumers it fed (`SPECKIT_EDGE_VECTOR_INDEX`, `SPECKIT_EDGE_TRIPLET_SEARCH`, `SPECKIT_EDGE_SEMANTIC_DEDUP`, `SPECKIT_EDGE_SEMANTIC_INVALIDATION`) and their code were removed in the flag-resolution reckoning. The backfilled fact text was generic relation-template boilerplate that carried no pair identity, so the family stayed recall-inert at K=20 with a single-item +0.083 that did not generalize. The decision-of-record is preserved in `decision-record.md` and the removal is tracked in `../../007-kept-off-flag-resolution/`. This is why the status cell is the clean `Complete` enum even though the result was a default-off, shadow-only, benchmark-gated no-go: the decision concluded and no further work is open here.
2. **Semantic dedup/merge, cross-pair invalidation and post-reindex benchmark/promotion** stayed pending and were never built before the no-go removal.
3. **Recall lift and dedup false-merge rate were UNKNOWN** at delivery until the post-reindex benchmark ran. They were owned by Phase 5 and the benchmark was blocked on the gate-zero reindex (028/001-001).
4. **LLM-judged dedup safety is unproven.** Whether its false-merge rate can ever clear a bar to leave shadow-only is an open empirical question, the highest tail-risk of the initiative.
<!-- /ANCHOR:limitations -->
