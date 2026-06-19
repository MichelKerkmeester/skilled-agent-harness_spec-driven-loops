---
title: "Implementation Summary: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)"
description: "Planning-stage summary for the per-edge semantic substrate. NOT YET IMPLEMENTED — Wave-2 prove-first, shadow-gated; this records the intended delivery and the PENDING status of all five edge-intelligence candidates against the Wave-0 shipped record."
trigger_phrases:
  - "028 semantic edge layer implementation summary"
  - "semantic-edge-layer summary"
  - "per edge embedding delivery status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-stage doc; all five candidates PENDING (not in Wave-0)"
    next_safe_action: "Land the additive migration + edge-vector store (T005/T006)"
    blockers:
      - "schema-migration: substrate gate-zero + needs-benchmark post gate-zero reindex"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-017-semantic-edge-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Recall lift + dedup false-merge rate pending the post-reindex benchmark"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **STATUS: PENDING — NOT YET IMPLEMENTED.** This is a planning-stage summary for a Wave-2 prove-first, shadow-gated initiative. None of `semantic-edge-layer`, `GR-fact-embedding-on-edge`, `CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-semantic-fact-dedup-merge`, or `GR-semantic-invalidation-discovery` appears in the Wave-0 shipped record (`../../../030-memory-search-intelligence-impl/spec.md` §14), so nothing here is delivered. The sections below describe the intended delivery so the packet reads end-to-end; they will be rewritten with evidence once the work runs.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer |
| **Completed** | PENDING |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. When this packet runs, the causal graph's edges stop being exact-key-blind SQLite rows and start carrying fact text plus a relationship vector, so edges can be retrieved by semantic similarity and inform dedup, invalidation, and ranking. The shape of the build is fixed by one constraint: the memory-ID graph has no episode model and runs no LLM in the synchronous insert path, so the substrate is added at consolidation-time, off the foreground turn, and never touches the synchronous `insertEdge` txn.

### Substrate root — `GR-fact-embedding-on-edge` (planned, gate-zero)

An additive migration gives `causal_edges` a nullable `fact_text` column and a dedicated edge-vector collection (mirroring `ports/vector-store.ts`); a flag-gated pass in `runConsolidationCycle` (`consolidation.ts:499`) embeds each edge's fact text into it. This is the substrate every other candidate consumes.

### Four consumers (planned, shadow-only)

You will be able to look an edge up by its relationship vector (`CG-edge-vector-index`), score results by node + edge + node distances (`CG-edge-aware-triplet-search`), collapse paraphrased-but-equal edges via LLM-judged adjudication over semantically-retrieved candidates (`GR-semantic-fact-dedup-merge`), and discover invalidation candidates across different node pairs by semantic similarity (`GR-semantic-invalidation-discovery`). Each sits behind its own default-off flag and reads the one substrate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/storage/causal-edges.ts` | Modified (planned) | Additive `fact_text` column; exact-key upsert (`:350-352`) unchanged |
| `mcp_server/lib/storage/edge-vector-store.ts` | Created (planned) | Dedicated edge-relationship vector collection + nearest-edge lookup |
| `mcp_server/lib/storage/consolidation.ts` | Modified (planned) | Flag-gated edge-embedding pass in `runConsolidationCycle` (`:499`) |
| `mcp_server/lib/graph/edge-semantic-retrieval.ts` | Created (planned) | Nearest-edge lookup + edge-aware-triplet scorer (side primitive) |
| `mcp_server/lib/graph/contradiction-detection.ts` | Modified (planned) | Shadow-gated cross-pair invalidation; same-pair (`:85-93`) unchanged when off |
| `mcp_server/lib/search/search-flags.ts` | Modified (planned) | `SPECKIT_SEMANTIC_EDGE_LAYER` + four consumer flags, default-off |
| `mcp_server/__tests__/` | Created (planned) | Migration back-compat, isolation, embedder, false-merge benchmark |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended approach is substrate-first, consolidation-time, shadow-gated, benchmark-post-reindex: land the additive migration and edge-vector store with a back-compat test, add the flag-gated consolidation embedder, build the nearest-edge and triplet retrieval primitives as a shadow side-channel, then layer LLM-judged dedup and cross-pair invalidation — each default-off and never merging or closing a live edge on uncertainty. The recall/dedup benchmark runs only after the gate-zero corpus reindex (028/001-001) lands, and its numbers gate every promotion. Nothing is deployed; the work is branch-only and every flag stays off until the numbers justify flipping it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the substrate once, root-first | Five candidates all need the same absent substrate; none ships cheaply alone (`synthesis/06:168`) |
| Embed at consolidation-time, not insert-time | Keeps embedding/LLM out of the synchronous deterministic SQLite write path (iter-21 caveat) |
| Ship the whole initiative shadow-gated default-off | Results-affecting intelligence earns activation on live evidence; LLM dedup can silently merge two distinct facts (highest tail-risk) |
| Mirror the existing `ports/vector-store.ts` | Avoids a parallel embedding stack for the edge-vector collection |
| Defer the benchmark to post gate-zero reindex | Recall lift is unmeasurable against a quarter-dark index (027/002 §13, `synthesis/06:165-166`) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Migration back-compat (flag-off old reads/insert byte-identical) | PENDING |
| Flag-off isolation (insert/consolidation/recall/contradiction byte-identical) | PENDING |
| Synchronous `insertEdge` txn + deterministic core untouched | PENDING |
| Dedup false-merge benchmark + edge-aware recall lift (post-reindex) | PENDING |
| `validate.sh --strict` on this packet (docs) | PASS (planning docs) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a Wave-2 prove-first design packet; none of the five candidates has shipped (absent from 030 §14).
2. **Recall lift and dedup false-merge rate are UNKNOWN** until the post-reindex benchmark runs; they are owned by Phase 5 and the benchmark is blocked on the gate-zero reindex (028/001-001).
3. **LLM-judged dedup safety is unproven.** Whether its false-merge rate can ever clear a bar to leave shadow-only is an open empirical question — the highest tail-risk of the initiative.
<!-- /ANCHOR:limitations -->
