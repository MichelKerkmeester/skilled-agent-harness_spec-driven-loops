---
title: "Feature Specification: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)"
description: "Add the per-edge embedding substrate the SQLite-only causal graph lacks, so edges carry fact text + a relationship vector and can be retrieved semantically. One coherent consolidation-time build that unlocks edge-vector-index, edge-aware-triplet-search, fact-embedding-on-edge, semantic-fact-dedup-merge and semantic-invalidation-discovery together, not five separate ships. Wave-2, prove-first, shadow-gated default-off."
trigger_phrases:
  - "028 semantic edge layer"
  - "per edge embedding causal graph"
  - "GR-fact-embedding-on-edge"
  - "semantic edge retrieval substrate"
  - "edge vector index triplet search"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer"
    last_updated_at: "2026-07-04T17:50:57.515Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented semantic-edge substrate"
    next_safe_action: "Run strict validation and final typecheck/tests"
    blockers:
      - "shared-infra-dep: gate-zero corpus reindex (028/001-001) precedes any recall benchmark"
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
      - "What recall lift do edge vectors actually buy, measured against the reindexed corpus, before any default-on promotion?"
      - "Can LLM-judged semantic dedup/merge be made safe enough that it never silently collapses two distinct facts (highest tail-risk of the five sub-candidates)?"
    answered_questions: []
---

# Feature Specification: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The internal causal graph stores edges in SQLite only: an edge is a `(source_id, target_id, relation, source_anchor, target_anchor)` tuple with no fact text and no relationship vector, so edges never inform ranking and can only be deduped/invalidated on an exact key over the same node pair [CONFIRMED: `lib/storage/causal-edges.ts:350-352` exact-key upsert; `lib/graph/contradiction-detection.ts:85-93` same-pair-only; 0 grep hits for `embedding|vector|fact_text|cosine|similarity` in `causal-edges.ts`]. Research (028/007, iters 19/21) found **five** separately-surfaced edge-intelligence candidates that all need the **same missing substrate**, per-edge embeddings + semantic edge retrieval, and consolidated them into one Wave-2 initiative: build the layer once and `CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-fact-embedding-on-edge`, `GR-semantic-fact-dedup-merge` and `GR-semantic-invalidation-discovery` unlock together.

**Key Decisions**: This is a **consolidation-time/async** layer, not an insert-path tweak. The memory-ID graph has no episode model and no LLM in the synchronous SQLite insert path, so per-edge embedding and semantic retrieval are added off the foreground turn (`runConsolidationCycle`, `consolidation.ts:499`). The whole initiative is built **shadow-gated default-off** with telemetry from day one, never a "Wave-1 follow-on that just turns on."

**Critical Dependencies**: The gate-zero corpus reindex (028/001 `001-corpus-reindex-gate-zero`) is the precondition for measuring any recall lift, you cannot benchmark edge-vector retrieval against a quarter-dark index. The fact-embedding sub-candidate (`GR-fact-embedding-on-edge`) is the substrate root. The other four consume it.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | No-Go (Partial) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-speckit/028-memory-search-intelligence/001-speckit-memory |
| **Wave** | Wave-2 (prove-first, shadow-gated) |
| **Candidates** | semantic-edge-layer, GR-fact-embedding-on-edge (root), unlocking CG-edge-vector-index, CG-edge-aware-triplet-search, GR-semantic-fact-dedup-merge, GR-semantic-invalidation-discovery |
<!-- /ANCHOR:metadata -->

### Current Implementation Status

| Candidate / Capability | STATUS | Evidence |
|------------------------|--------|----------|
| `semantic-edge-layer` substrate | **DONE** | `causal_edges.fact_text`, `edge_vector_embeddings`, v41 additive migration/backfill/rollback, compatibility fixture |
| `GR-fact-embedding-on-edge` | **DONE** | `runConsolidationCycle` flag-gated edge embedding hook + deterministic edge-vector storage |
| `CG-edge-vector-index` | **DONE (shadow primitive)** | `edge-vector-store.ts` + `edge-semantic-retrieval.ts` nearest-edge lookup behind `SPECKIT_EDGE_VECTOR_INDEX`, not wired into live recall |
| `CG-edge-aware-triplet-search` | **DONE (shadow primitive)** | `scoreEdgeAwareTriplet` + `rankEdgeTripletCandidates` behind `SPECKIT_EDGE_TRIPLET_SEARCH`, not wired into live fused recall |
| `GR-semantic-fact-dedup-merge` | **PENDING** | Benchmark/LLM adjudication work remains blocked on false-merge evidence and post-reindex benchmark |
| `GR-semantic-invalidation-discovery` | **PENDING** | Cross-pair invalidation consumer remains shadow-only design work, same-pair contradiction path unchanged |
| Post-reindex benchmark/promotion | **PENDING (BLOCKED)** | Blocked on `../001-corpus-reindex-gate-zero`, no promotion without measured recall/dedup lift |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The causal graph is **substrate-blind at the edge**. Each edge is an exact-key SQLite row with no fact text and no vector:
- Dedup/upsert keys strictly on `(source_id, target_id, relation, source_anchor, target_anchor)`, so paraphrased-but-equal edges become near-duplicates rather than collapsing [CONFIRMED: `causal-edges.ts:350-352`; `007/research.md` iter-21: "dedups ONLY on exact ... 0 grep hits for semantic/fuzzy/embedding across the insert path"].
- Invalidation/contradiction discovery is **same-pair only**. It queries strictly `WHERE source_id = ? AND target_id = ?`, so a superseding fact about a *different* node pair is never found [CONFIRMED: `contradiction-detection.ts:85-93`; `temporal-edges.ts:81-96`].
- Edges have no relationship vector, so triplet-style ranking that scores node + *edge* + node distances (Cognee `brute_force_triplet_search.py:263-287`, `node_edge_vector_search.py:12,131-145`) is impossible. Edges never inform ranking at all [CONFIRMED: `007/research.md` iter-19 #4/#5; 0 vector hits in `causal-edges.ts`].

Five candidates, `CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-fact-embedding-on-edge`, `GR-semantic-fact-dedup-merge`, `GR-semantic-invalidation-discovery`, independently surfaced across DeepSeek (Cognee, iter-19) and Opus-native (Graphiti, iter-21) mining, and each one bottoms out on the **same** absent substrate [CONFIRMED: `synthesis/06-memory-systems-findings.md:105-113,168`; `roadmap.md:329`].

### Purpose
Build the per-edge semantic substrate **once**, off the foreground turn, so edges carry fact text + a relationship vector and can be retrieved semantically, unlocking the five edge-intelligence candidates as one coherent initiative instead of five quick wins that can't ship cheaply, **without** touching the deterministic synchronous insert path or the existing fused-recall ranking until live evidence earns it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A **schema migration** adding edge fact text + a per-edge relationship embedding to the causal graph (a `fact_text` column on `causal_edges` plus a dedicated edge-vector collection mirroring the existing memory vector-store port), additive and back-compatible.
- A **consolidation-time edge embedder**: at `runConsolidationCycle`, embed each edge's relationship/fact text and write it to the edge-vector collection, off the foreground turn, never in the synchronous insert path.
- **Semantic edge retrieval** primitives over the new substrate: nearest-edge lookup by relationship vector, and an edge-aware-triplet scorer (node + edge + node distances), built but kept out of the live fused recall path until promoted.
- The four consuming sub-candidates, each as a **shadow-gated default-off** capability over the substrate: edge-vector-index (storage+lookup), edge-aware-triplet-search (ranking primitive), semantic-fact-dedup-merge (LLM-judged collapse over semantically-retrieved candidates), semantic-invalidation-discovery (cross-pair contradiction candidates).
- A **shadow telemetry + benchmark harness** measuring recall lift, dedup precision/recall and false-merge rate against the reindexed corpus so promotion is evidence-based.

### Out of Scope
- Any **synchronous insert-path** change. `insertEdge` stays the exact-key SQLite upsert it is today (`causal-edges.ts:350-352`), and embedding happens at consolidation, not at write.
- Adopting an **episode model** or LLM-in-the-insert-path (gated, there is no episode model, that is a separate schema-level build) [CONFIRMED: `synthesis/06:156`, iter-21 caveat].
- **Default-on activation** of any sub-candidate. Every results-affecting piece ships shadow-only and earns activation on live evidence (027 doctrine; `synthesis/06:167`).
- Changing the deterministic fused-recall ranking (`hybrid-search.ts`, Stage-2 fusion order), the edge-aware scorer is a side primitive until promoted.
- Re-verifying `CG-graph-neighborhood-projection` and `CG-content-hash-reprocessing-trigger` (flagged unverified vs `enableCausalBoost`/reindex, explicitly NOT part of this layer) [CONFIRMED: `synthesis/06:170`; iter-19 #6].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Add an additive `fact_text` column + read/write of the per-edge relationship text, with `insertEdge` exact-key upsert (`:350-352`) otherwise UNCHANGED |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/edge-vector-store.ts` | Create | Dedicated edge-relationship vector collection (mirrors the existing `ports/vector-store.ts` port), store + nearest-edge lookup |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts` | Modify | In `runConsolidationCycle` (`:499`), embed each edge's fact text → edge-vector collection (consolidation-time, off the foreground turn) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/edge-semantic-retrieval.ts` | Create | Semantic nearest-edge lookup + edge-aware-triplet scorer (node + edge + node distances), side primitive, not wired into live fused recall |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts` | Modify | Add a shadow-gated cross-pair invalidation-candidate path over semantic edge retrieval, with the same-pair path (`:85-93`) UNCHANGED when the flag is off |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Add default-off `SPECKIT_SEMANTIC_EDGE_LAYER` (substrate) + per-sub-candidate shadow flags |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/` | Create | Migration back-compat test, flag-off isolation test, consolidation-time embedder test, dedup false-merge benchmark |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The schema migration is additive and back-compatible | `causal_edges` gains `fact_text` (nullable) + an edge-vector collection exists, existing rows/queries unaffected, a migration test proves old `insertEdge`/read paths return byte-identical results with the layer flag off |
| REQ-002 | The synchronous insert path is untouched | `insertEdge` still upserts on the exact `(source_id, target_id, relation, source_anchor, target_anchor)` key (`causal-edges.ts:350-352`), and grep + diff confirm no embedding/vector call added to the synchronous write txn |
| REQ-003 | Per-edge embedding runs at consolidation-time only, behind a default-off flag | With `SPECKIT_SEMANTIC_EDGE_LAYER` off, `runConsolidationCycle` output is byte-identical to baseline and no embedding work runs, and with it on, edge fact text is embedded into the edge-vector collection off the foreground turn |
| REQ-004 | Every results-affecting sub-candidate is shadow-gated default-off | The four consumers (edge-vector lookup in ranking, triplet search, semantic dedup/merge, cross-pair invalidation) are each individually flagged off, and with all flags off, live recall + contradiction-detection output is byte-identical to baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `GR-fact-embedding-on-edge` substrate is the build root and the other four consume it | The edge-vector store + consolidation-time embedder land first, and edge-vector-index lookup, triplet scorer, semantic dedup and cross-pair invalidation are layered on top and reference the same collection (no parallel substrate) |
| REQ-006 | Semantic dedup/merge cannot silently collapse two distinct facts | LLM-judged merge runs exact-key fast-path first, then candidate facts from semantic retrieval, then an LLM `resolve_edge`-style adjudication (Graphiti `edge_operations.py:684-749` shape). A false-merge benchmark reports precision/recall and the merge stays shadow-only until the false-merge rate clears a recorded bar |
| REQ-007 | Cross-pair semantic invalidation is endpoint-agnostic over the substrate | The new path gathers invalidation candidates by semantic edge similarity across *different* node pairs (not just `source_id=?,target_id=?`), mirroring Graphiti `EDGE_HYBRID_SEARCH_RRF` (`edge_operations.py:407-418`). Same-pair `contradiction-detection.ts:85-93` behavior is preserved when the flag is off |
| REQ-008 | Recall/dedup lift is measured against the reindexed corpus | A harness reports edge-aware-triplet recall lift, dedup precision/recall and false-merge rate after the gate-zero reindex. Promotion of any sub-candidate cites real numbers, not structural inference |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `SPECKIT_SEMANTIC_EDGE_LAYER` and all sub-candidate flags off, the synchronous insert path, consolidation cycle, fused recall and same-pair contradiction detection are byte-identical to the pre-change baseline (substrate is invisible until activated), and the schema migration is proven back-compatible.
- **SC-002**: With the substrate on, per-edge fact text is embedded at consolidation-time into a dedicated edge-vector collection, semantic nearest-edge retrieval works, and the benchmark reports concrete edge-aware recall lift, dedup precision/recall and false-merge rate against the reindexed corpus, the evidence used for each per-sub-candidate promotion decision.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | LLM-judged dedup silently merges two distinct facts | High | Exact-key fast-path first, LLM adjudication shadow-only, false-merge benchmark gates promotion (REQ-006), highest tail-risk of the five per `synthesis/06:167` |
| Risk | Embedding work creeps into the synchronous insert path | High | Embedding strictly at `runConsolidationCycle`, insert-path diff = zero (REQ-002, REQ-003) |
| Risk | Treating five candidates as five quick wins (none ships cheaply alone) | Med | Build the substrate once as one initiative, substrate-root-first sequencing (REQ-005), `synthesis/06:168` |
| Risk | Promoting on structural inference instead of measured lift | Med | Shadow telemetry + benchmark from day one, promotion cites numbers (REQ-008), 027 doctrine `synthesis/06:167` |
| Dependency | Gate-zero corpus reindex (028/001 `001-corpus-reindex-gate-zero`) | High | Reindex is the precondition for any recall benchmark, build substrate behind flag in parallel, benchmark only post-reindex |
| Dependency | Existing vector-store port (`ports/vector-store.ts`) | Med | Mirror the established port for the edge-vector collection, do not invent a parallel embedding stack |
| Dependency | No episode model in the memory-ID graph | Med | Layer is consolidation-time/async by design, episode adoption is explicitly out of scope (`synthesis/06:156`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Flag-off path adds zero measurable latency to insert, consolidation, recall and contradiction detection (byte-identical output, no embedding executed).
- **NFR-P02**: Consolidation-time embedding cost is bounded by edges-per-cycle × embed cost and runs off the foreground turn, and the benchmark reports added consolidation wall-time (no fixed SLA pre-prototype, UNKNOWN until measured).

### Security
- **NFR-S01**: Edge fact text and embeddings stay inside the existing local SQLite + vector-store boundary. No new external capability or data egress is introduced.

### Reliability
- **NFR-R01**: A failed embed or LLM adjudication during consolidation degrades gracefully, the edge keeps its exact-key behavior and the cycle completes. No exception propagates to the synchronous insert/recall paths.

---

## 8. EDGE CASES

### Data Boundaries
- Edge with null/empty fact text: skipped by the consolidation embedder (no vector written), exact-key behavior unchanged.
- Pre-migration edges (no `fact_text`): treated as un-embedded. The consolidation cycle backfills them lazily, and flag-off readers never see the new column.

### Error Scenarios
- Embed provider unavailable at consolidation: the cycle logs and continues with un-embedded edges (graceful degrade, mirrors the C9 recall-degrade doctrine), no synchronous path is affected.
- LLM `resolve_edge` adjudication failure mid-dedup: fall back to exact-key behavior (do NOT merge on uncertainty), record the abort in shadow telemetry.
- Cross-pair invalidation returns a high-similarity but semantically-unrelated edge: shadow-only, never auto-closes a live edge until the candidate is promoted on measured precision.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Files: ~7 (schema migration, new edge-vector store, new retrieval module, 3 modified, tests). Systems: Memory MCP storage + graph |
| Risk | 22/25 | Schema migration: Y. Silent false-merge tail-risk: Y. Results-affecting intelligence: Y. Breaking change if substrate leaks into live ranking: Y |
| Research | 15/20 | Seams CONFIRMED (edge storage, same-pair invalidation, 0 vector hits). Recall/dedup lift empirical (prove-first, unmeasured) |
| Multi-Agent | 5/15 | Single workstream, five sub-candidates over one substrate, sequenced root-first |
| Coordination | 9/15 | Depends on gate-zero reindex + the existing vector-store port. Five consumers must be sequenced and individually flagged |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Semantic dedup silently merges two distinct facts | H | M | Exact-key fast-path + LLM adjudication + false-merge benchmark, shadow-only until precision clears bar (REQ-006) |
| R-002 | Embedding leaks into the synchronous insert path | H | L | Consolidation-time only, insert-path diff = zero (REQ-002/003) |
| R-003 | Migration breaks existing edge reads/queries | H | L | Additive nullable column + edge-vector collection, back-compat migration test (REQ-001) |
| R-004 | Shipped five-as-quick-wins, substrate under-built | M | M | One coherent substrate-first initiative, root-first sequencing (REQ-005) |
| R-005 | Benchmark shows no recall lift worth the substrate cost | M | M | Prove-first, sub-candidates stay shadow-off / dropped if numbers fail (REQ-008) |

---

## 11. USER STORIES

### US-001: Edges become semantically retrievable (Priority: P2)

**As a** maintainer of the causal graph, **I want** each edge to carry fact text and a relationship vector built at consolidation-time, **so that** edges can be retrieved by semantic similarity and inform ranking, dedup and invalidation instead of being exact-key-blind SQLite rows.

**Acceptance Criteria**:
1. Given the substrate flag is on, When consolidation runs, Then each edge's fact text is embedded into the edge-vector collection and a nearest-edge semantic lookup returns relevant edges across different node pairs.

### US-002: The deterministic path is protected until evidence earns activation (Priority: P0)

**As a** maintainer of the deterministic insert + recall paths, **I want** the entire semantic edge layer shadow-gated default-off with no insert-path change, **so that** existing callers keep byte-identical behavior and no LLM-judged merge can silently corrupt the graph before its false-merge rate is measured.

**Acceptance Criteria**:
1. Given every flag is off, When insert, consolidation, recall and contradiction detection run, Then output is byte-identical to baseline and no embedding/LLM-merge code executes.

---

## 12. OPEN QUESTIONS

- What edge-aware-triplet recall lift do edge vectors actually buy against the reindexed corpus, and is it worth the substrate + consolidation cost? (UNKNOWN until the gate-zero reindex + benchmark run, `synthesis/06:165-166`.)
- Can LLM-judged semantic dedup/merge be tuned so its false-merge rate is acceptably low, or must it stay permanently shadow-only? (UNKNOWN, empirical, highest tail-risk per `synthesis/06:167`.)
- Should the edge-vector collection share the memory vector-store backend or live in its own collection/file, and what is the right embedding model for short relationship/fact strings? (To resolve in plan/ADR.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Source research**: `../../research/roadmap.md` (MEMORY-SYSTEMS ADDENDUM, "Two new initiatives", `:329`), `../../research/synthesis/06-memory-systems-findings.md` (New initiative A, `:105-113,168`), `../research/external-memory-systems/research.md` (+ `iterations/iteration-0{19,21}.md`, `deltas/iter-0{19,21}.jsonl`)
- **Confirmed seams (live code)**: `lib/storage/causal-edges.ts:350-352` (exact-key upsert), `lib/graph/contradiction-detection.ts:85-93` (same-pair-only), `lib/graph/temporal-edges.ts:81-96`, `lib/storage/consolidation.ts:499` (`runConsolidationCycle`)
- **Shared-infra dependency**: `../001-corpus-reindex-gate-zero` (gate-zero reindex, precondition for any recall benchmark)
- **Shipped record (Wave-0)**: Wave-0 record, none of `semantic-edge-layer` / `GR-fact-embedding-on-edge` / `CG-edge-vector-index` / `CG-edge-aware-triplet-search` / `GR-semantic-fact-dedup-merge` / `GR-semantic-invalidation-discovery` appear in the 13-row status table (never shipped), confirming PENDING

---

<!--
LEVEL 3 SPEC (~175 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
