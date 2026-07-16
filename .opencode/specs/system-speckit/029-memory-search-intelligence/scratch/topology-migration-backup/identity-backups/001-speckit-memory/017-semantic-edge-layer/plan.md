---
title: "Implementation Plan: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)"
description: "Prove-first plan to build the per-edge embedding substrate once: additive schema migration, a consolidation-time edge embedder + dedicated edge-vector collection, then layer edge-vector-index, triplet search, semantic dedup/merge and cross-pair invalidation as shadow-gated default-off consumers, benchmarked post-reindex before any promotion."
trigger_phrases:
  - "028 semantic edge layer plan"
  - "per edge embedding substrate plan"
  - "GR-fact-embedding-on-edge plan"
  - "edge vector consolidation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer"
    last_updated_at: "2026-07-04T17:50:57.515Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented substrate-first semantic-edge schema, store and embedder hook"
    next_safe_action: "Run strict validation and final typecheck/tests"
    blockers:
      - "shared-infra-dep: gate-zero corpus reindex precedes any recall benchmark"
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
      - "Edge-vector recall lift + dedup false-merge rate pending the post-reindex benchmark"
    answered_questions: []
---
# Implementation Plan: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Memory MCP, `mcp_server/`) |
| **Framework** | Node MCP server, better-sqlite3 storage, existing vector-store port |
| **Storage** | SQLite (`causal_edges`) + a NEW dedicated edge-vector collection (additive migration) |
| **Testing** | Vitest (`mcp_server/__tests__/`) + a recall/dedup benchmark run post gate-zero reindex |

### Overview
Build the per-edge semantic substrate the causal graph lacks, **once**, off the foreground turn. The approach is **substrate-first, prove-first, shadow-gated**: an additive schema migration (`fact_text` on `causal_edges` + a dedicated edge-vector collection mirroring `ports/vector-store.ts`), a consolidation-time embedder that writes edge relationship/fact vectors inside `runConsolidationCycle` (`consolidation.ts:499`), then four consumers layered on top - edge-vector lookup, edge-aware-triplet scoring, LLM-judged semantic dedup/merge and cross-pair semantic invalidation - **each individually default-off** behind `SPECKIT_SEMANTIC_EDGE_LAYER` + per-sub-candidate flags. The synchronous insert path (`causal-edges.ts:350-352` exact-key upsert) and the same-pair contradiction path (`contradiction-detection.ts:85-93`) are never touched while flags are off. Promotion of any consumer is gated on benchmark numbers measured against the reindexed corpus.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Seam confirmed: edges are exact-key SQLite rows with no fact text/vector (`causal-edges.ts:350-352`, 0 grep hits for `embedding|vector|fact_text`) - CONFIRMED in research (iter-21)
- [ ] Seam confirmed: contradiction/invalidation is same-pair only (`contradiction-detection.ts:85-93`) - CONFIRMED (iter-21)
- [ ] Consolidation entry point identified: `runConsolidationCycle` (`consolidation.ts:499`) - CONFIRMED
- [ ] Gate-zero reindex (028/001-001) dependency acknowledged, benchmark deferred until it lands
- [ ] Flag names reserved and default-off semantics agreed (substrate + 4 consumer flags)

### Definition of Done
- [ ] Migration additive + back-compatible (old reads/insert byte-identical, flag-off) - test green
- [ ] Synchronous insert path diff = zero, consolidation-time embedding only
- [ ] All flags off → insert/consolidation/recall/contradiction byte-identical to baseline (isolation)
- [ ] Substrate root (`GR-fact-embedding-on-edge`) lands first, four consumers reference the same collection
- [ ] False-merge benchmark for semantic dedup recorded, merge stays shadow-only until precision clears bar
- [ ] Recall/dedup lift measured post-reindex, per-sub-candidate promotion decisions cite numbers
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared **per-edge semantic substrate** (fact text + relationship vector in a dedicated collection), populated **at consolidation-time** (async, off the foreground turn), with semantic edge retrieval as a side primitive. Five edge-intelligence capabilities consume the one substrate, none ships without it. The deterministic synchronous insert path and the live fused-recall/contradiction paths are unchanged until a consumer is promoted on evidence.

### Key Components
- **Schema migration** (additive): `fact_text` (nullable) on `causal_edges` + a dedicated edge-vector collection (mirrors `ports/vector-store.ts`). Back-compatible - pre-migration edges read as un-embedded.
- **`edge-vector-store.ts`** (new): store an edge's relationship/fact embedding, nearest-edge lookup by vector. The substrate root that `GR-fact-embedding-on-edge` provides and the other four consume.
- **Consolidation-time embedder** (`consolidation.ts` change): inside `runConsolidationCycle`, embed each edge's `fact_text` → edge-vector collection, skips null fact text, degrades gracefully if the embed provider is down. Off the synchronous insert txn.
- **`edge-semantic-retrieval.ts`** (new): nearest-edge semantic lookup + an edge-aware-triplet scorer combining node + edge + node distances (Cognee triplet shape). A side primitive, not wired into live fused recall until promoted.
- **Semantic dedup/merge** (consumer): exact-key fast-path → semantic-retrieval candidates → LLM `resolve_edge`-style adjudication → reuse existing edge identity (append provenance) vs insert near-dup. Shadow-only.
- **Cross-pair invalidation** (`contradiction-detection.ts` change): a shadow-gated path that gathers invalidation candidates by semantic edge similarity across *different* node pairs, same-pair path preserved when flag off.
- **Flags** (`search-flags.ts` change): `SPECKIT_SEMANTIC_EDGE_LAYER` (substrate) + one shadow flag per consumer, all default-off.

### Data Flow
Foreground insert → `insertEdge` exact-key upsert (UNCHANGED, writes `fact_text` only as a passive column) → … later, off-turn … → `runConsolidationCycle` → [flag on?] → embed each edge's fact text → edge-vector collection. Retrieval/dedup/invalidation consumers read the collection through `edge-semantic-retrieval.ts` ONLY when their own shadow flag is on, otherwise live recall + same-pair contradiction detection flow exactly as today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a schema-changing new-substrate build with a hard isolation requirement (a leak corrupts the graph or regresses live ranking), so the affected-surface inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/storage/causal-edges.ts` `insertEdge` | Exact-key SQLite upsert (`:350-352`) | Add passive `fact_text` column read/write, upsert key UNCHANGED | `rg -n "source_anchor|relation" causal-edges.ts`, diff shows no embedding call in the sync txn |
| `causal_edges` schema | Edge rows, no fact text/vector | Additive nullable `fact_text` column + new edge-vector collection | back-compat migration test, old queries byte-identical |
| `lib/storage/consolidation.ts` `runConsolidationCycle` (`:499`) | On-save reconsolidation cycle | Add a flag-gated edge-embedding pass | flag-off byte-identical consolidation output |
| `lib/graph/contradiction-detection.ts` (`:85-93`) | Same-pair invalidation | Add a shadow-gated cross-pair path, same-pair UNCHANGED when off | flag-off diff = behavioral no-op |
| `lib/search/hybrid-search.ts` + Stage-2 fusion | Deterministic fused recall | Not a consumer until a sub-candidate is promoted - UNCHANGED | `git diff` shows zero changes |
| `lib/search/search-flags.ts` | Feature-flag registry | Add `SPECKIT_SEMANTIC_EDGE_LAYER` + 4 consumer flags (default-off) | grep flag defaults, flag-off isolation test |

Required inventories:
- Same-class producers/writers of edges: `rg -n "insertEdge|causal_edges|invalid_at" mcp_server/lib --glob '*.ts'`.
- Consumers of the new substrate: `rg -n "SPECKIT_SEMANTIC_EDGE_LAYER|edge-vector|edgeVector|edge-semantic" mcp_server --glob '*.ts'`.
- Algorithm invariant: semantic dedup MUST NOT merge on adjudication uncertainty (fall back to exact-key), cross-pair invalidation MUST NOT auto-close a live edge while shadow-only. Adversarial cases = paraphrase-equal vs distinct-fact pairs, embed-provider-down at consolidation, high-similarity-but-unrelated cross-pair edge.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Substrate (schema migration + edge-vector store, no consumers)
- [x] Additive v41 migration: nullable `fact_text` on `causal_edges` + dedicated `edge_vector_embeddings` collection (mirrors `ports/vector-store.ts`)
- [x] `edge-vector-store.ts`: store edge embedding + nearest-edge lookup
- [ ] Back-compat test: flag-off old reads/insert byte-identical, pre-migration edges read as un-embedded
- [ ] No consumer, no live-ranking, no contradiction-path change yet

### Phase 2: Consolidation-time embedder (default-off)
- [ ] Add `SPECKIT_SEMANTIC_EDGE_LAYER` default-off flag
- [ ] In `runConsolidationCycle`, flag-gated pass embeds each edge's `fact_text` → edge-vector collection, skips null, degrades on provider-down
- [ ] Isolation test: flag-off consolidation/insert byte-identical to baseline, embedding never in the sync txn

### Phase 3: Retrieval primitives (shadow side-channel)
- [ ] `edge-semantic-retrieval.ts`: nearest-edge lookup + edge-aware-triplet scorer (node + edge + node)
- [ ] Behind `SPECKIT_EDGE_VECTOR_INDEX` / `SPECKIT_EDGE_TRIPLET_SEARCH` shadow flags, NOT wired into live fused recall

### Phase 4: Semantic dedup + cross-pair invalidation (shadow-only)
- [ ] Semantic dedup/merge: exact-key fast-path → semantic candidates → LLM `resolve_edge` adjudication, never merge on uncertainty (`SPECKIT_EDGE_SEMANTIC_DEDUP`)
- [ ] Cross-pair invalidation candidates over semantic retrieval, same-pair preserved when off (`SPECKIT_EDGE_SEMANTIC_INVALIDATION`)

### Phase 5: Benchmark + promotion decision (post-reindex)
- [ ] After the gate-zero reindex (028/001-001) lands, run the harness: edge-aware recall lift, dedup precision/recall, false-merge rate
- [ ] Record numbers, decide per-sub-candidate promote-to-opt-in / keep-shadow / drop on evidence
- [ ] `validate.sh --strict` green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema migration back-compat (old reads/insert byte-identical, flag-off) | Vitest |
| Unit | Substrate isolation (flag-off insert/consolidation/recall/contradiction byte-identical, no embed in sync txn) | Vitest |
| Unit | Consolidation embedder (embeds on, skips null, degrades on provider-down) | Vitest |
| Integration | Nearest-edge semantic lookup + triplet scorer over the edge-vector collection (flag-on) | Vitest |
| Benchmark | Edge-aware recall lift, dedup precision/recall, false-merge rate vs reindexed corpus | Custom harness (post-reindex) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gate-zero corpus reindex (028/001 `001-corpus-reindex-gate-zero`) | Sibling (shared-infra) | Red (precondition) | Cannot benchmark recall lift, substrate can still be built behind flags, but no promotion |
| Existing vector-store port (`ports/vector-store.ts`) | Internal | Green | Lose the established embedding plumbing, would need a parallel stack (avoid) |
| Edge-vector schema migration | Internal | Green (built) | Additive v41 migration shipped in 5308401d95: nullable `fact_text` on `causal_edges` + `edge_vector_embeddings` collection |
| Embed provider availability at consolidation | Internal | Yellow | Embedding pass degrades to un-embedded edges, sync path unaffected (flag-off) |
| No episode model in the memory-ID graph | Constraint | Documented | Layer must stay consolidation-time/async, episode adoption out of scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark shows no recall lift, an unacceptable false-merge rate or any flag-off regression detected.
- **Procedure**: All flags are default-off, so rollback is a no-op for deployed callers. To fully revert: drop the consumer modules and the consolidation embedding pass (branch-only), the additive `fact_text` column + empty edge-vector collection are inert with the flag off and may be left or dropped via a down-migration. The synchronous insert path and live recall were never changed, so there is nothing to restore there.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Substrate) ──► Phase 2 (Embedder, off) ──► Phase 3 (Retrieval primitives, shadow)
                                                         │
                                                         ▼
                                            Phase 4 (Dedup + cross-pair invalidation, shadow)
                                                         │
                                                         ▼
                                            Phase 5 (Benchmark + decision, post-reindex)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Substrate (migration + store) | None | Everything |
| Consolidation embedder | Substrate | Retrieval primitives |
| Retrieval primitives | Embedder | Dedup + invalidation |
| Dedup + cross-pair invalidation | Retrieval primitives | Benchmark |
| Benchmark + decision | All consumers + gate-zero reindex | Promotion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Substrate (migration + edge-vector store) | High | additive migration + new store + back-compat test |
| Consolidation embedder | Med | one flag-gated pass + isolation test |
| Retrieval primitives | Med | nearest-edge lookup + triplet scorer |
| Dedup + cross-pair invalidation | High | LLM adjudication + cross-pair gather + false-merge benchmark |
| Benchmark + decision | Med | harness + post-reindex runs + analysis |
| **Total** | | **High effort overall - schema-changing, real architectural commitment, prove-first per `synthesis/06:113,168`** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All flags confirmed default-off
- [ ] Isolation test green (flag-off byte-identical across insert/consolidation/recall/contradiction)
- [ ] Synchronous insert-path diff = zero
- [ ] Migration back-compat test green

### Rollback Procedure
1. Confirm all flags off (no-op for callers).
2. Revert consumer modules + the consolidation embedding pass (branch-only).
3. Optionally down-migrate the inert `fact_text` column + edge-vector collection.
4. Re-run the existing suite to confirm baseline restored.

### Data Reversal
- **Has data migrations?** Yes (additive `fact_text` column + edge-vector collection).
- **Reversal procedure**: The column is nullable and unread when flag-off, drop via down-migration. The edge-vector collection is separate and can be dropped independently, no existing `causal_edges` data is mutated by the migration.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐   ┌──────────────────────┐   ┌───────────────────────────┐
│  Substrate         │──►│  Consolidation       │──►│  Retrieval primitives     │
│  (migration+store) │   │  embedder (off)      │   │  (edge-vector, triplet)   │
└────────────────────┘   └──────────────────────┘   └─────────────┬─────────────┘
                                                                   ▼
                                          ┌────────────────────────────────────────┐
                                          │  Semantic dedup + cross-pair invalidation │
                                          │  (shadow-only)                            │
                                          └────────────────────┬──────────────────────┘
                                                               ▼
                                          ┌────────────────────────────────────────┐
                                          │  Benchmark + per-candidate decision      │
                                          │  (post gate-zero reindex)                │
                                          └────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Substrate (migration + edge-vector store) | None | Per-edge fact text + vector collection | All consumers |
| Consolidation embedder | Substrate | Populated edge vectors | Retrieval primitives |
| Retrieval primitives | Embedder | Nearest-edge + triplet scoring | Dedup + invalidation |
| Dedup + cross-pair invalidation | Retrieval primitives | Shadow merge/close candidates | Benchmark |
| Benchmark | All consumers + reindex | Recall/dedup/false-merge numbers | Promotion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Substrate (migration + edge-vector store)** - schema change - CRITICAL (gate-zero, nothing builds without it)
2. **Consolidation embedder (default-off)** - off-turn embed pass - CRITICAL
3. **Retrieval primitives** - nearest-edge + triplet - CRITICAL (substrate is useless unread)
4. **Dedup + cross-pair invalidation** - highest tail-risk consumer - CRITICAL for the dedup/invalidation candidates
5. **Benchmark + decision** - evidence harness - CRITICAL (promotion gate, needs the reindex)

**Total Critical Path**: serial - substrate gates the embedder gates retrieval gates the intelligence consumers gates the benchmark.

**Parallel Opportunities**:
- The benchmark harness skeleton + ground-truth edge pairs can be drafted while the substrate is built.
- Retrieval primitives (Phase 3) and dedup/invalidation (Phase 4) can overlap once the embedder lands, since both read the same collection.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Substrate landed | Additive migration back-compat, edge-vector store + lookup | Phase 1 |
| M2 | Edges embedded off-turn | Flag-on consolidation populates vectors, flag-off byte-identical | Phase 2 |
| M3 | Edges semantically retrievable | Nearest-edge + triplet primitives over the collection | Phase 3 |
| M4 | Dedup/invalidation safe | False-merge benchmark recorded, never merge on uncertainty, shadow-only | Phase 4 |
| M5 | Evidence in hand | Recall/dedup lift measured post-reindex, per-candidate decision | Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Substrate-first, consolidation-time, shadow-gated, five candidates as one initiative

**Status**: Accepted

**Context**: Research (iters 19/21) surfaced five edge-intelligence candidates (`CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-fact-embedding-on-edge`, `GR-semantic-fact-dedup-merge`, `GR-semantic-invalidation-discovery`) that all bottom out on the **same** missing substrate - per-edge embeddings + semantic edge retrieval. The memory-ID graph stores edges as exact-key SQLite rows (`causal-edges.ts:350-352`), has no episode model and runs no LLM in the synchronous insert path. Semantic dedup carries the highest tail-risk of the campaign: it can silently merge two distinct facts.

**Decision**: Build the substrate once, root-first (`GR-fact-embedding-on-edge` provides it, the other four consume it). Embed **at consolidation-time** (`runConsolidationCycle`, `consolidation.ts:499`), never in the synchronous insert txn. Ship the whole initiative **shadow-gated default-off** with telemetry from day one and promote each consumer only on benchmark numbers measured against the reindexed corpus. Mirror the existing `ports/vector-store.ts` rather than inventing a parallel embedding stack.

**Consequences**:
- Positive: the deterministic insert + live-recall paths are provably protected, rollback is a no-op (flags off), the five candidates share one substrate instead of five fragile half-builds.
- Negative + mitigation: high upfront cost building the substrate before any payoff, and a schema migration - mitigated by additive/back-compatible migration and reuse of the established vector-store port, LLM-merge tail-risk mitigated by exact-key fast-path + never-merge-on-uncertainty + a gating false-merge benchmark.

**Alternatives Rejected**:
- Ship the five candidates as separate quick wins: rejected - none ships cheaply alone, all need the substrate (`synthesis/06:168`).
- Embed at insert-time: rejected - would inject embedding/LLM into the synchronous deterministic SQLite write path (iter-21 caveat).
- Adopt an episode model to mirror Graphiti/Cognee directly: rejected - out of scope, that is a separate schema-level build (`synthesis/06:156`).

---

<!--
LEVEL 3 PLAN (~215 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
