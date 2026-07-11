# Iteration 1: Internal Baseline Map + Q1/Q2 Hypotheses

## Focus
Reconnaissance. Locate the live Spec-Kit Memory MCP modules implementing (a) hybrid channel-fusion RRF, (b) save/index path, (c) recall rendering/serialization, (d) causal-graph store, (e) FSRS decay. Read aionforge `docs/retrieval.md` (8-signal set, RRF k=60, 5-class query router). Produce a code-anchored baseline map and first candidate hypotheses for Q1 (signal mapping) and Q2 (where a query-class classifier + per-class weights would live). NOT proposing implementations.

All internal paths are relative to `.opencode/skills/system-spec-kit/`. The aionforge doc path is `.opencode/specs/system-speckit/028-memory-search-intelligence/external/aionforge-memory-development/docs/retrieval.md`.

## Actions Taken
1. Grep/Glob over `mcp_server/` to enumerate the `lib/search/` tree (~80 source modules) and locate fusion/RRF, channel-assembly, classifier, causal, and FSRS symbols.
2. Read the core RRF module `shared/algorithms/rrf-fusion.ts` (full) and the pipeline fusion stage `mcp_server/lib/search/pipeline/stage2-fusion.ts` header + signal contract.
3. Read aionforge `docs/retrieval.md` (full) — signals, RRF mechanics, query-class router, high-precision path, recall bundle, degrade, determinism.
4. Read `query-router.ts`, `query-classifier.ts`, `intent-classifier.ts` to find the internal routing/classification axes.
5. Grep-confirmed causal-graph store, FSRS write-back, recall serialization, and degree-channel anchors.

## Findings

### Internal baseline — module map (CONFIRMED, file:line)
1. **Core RRF fusion** is `shared/algorithms/rrf-fusion.ts`. Default smoothing constant `DEFAULT_K = 40` (NOT 60), explicitly "optimized for ~1000-memory corpus" with `SPECKIT_RRF_K` runtime override [SOURCE: shared/algorithms/rrf-fusion.ts:37-38, 150-164]. Source channel labels: `vector, fts, bm25, graph, degree, keyword` [SOURCE: shared/algorithms/rrf-fusion.ts:12-19]. Fusion reads rank position only (`1/(k+i+1)`), accumulates per-source, applies a convergence/overlap bonus for multi-source hits [SOURCE: shared/algorithms/rrf-fusion.ts:308-388].
2. **Channels are gated/assembled at runtime**, not fixed at 5: `['vector','fts5']` always, then `bm25` if enabled, `graph` if graph-unified enabled, `degree` if degree-boost enabled [SOURCE: mcp_server/context-server.ts:911-914]. So "5-channel" is the maximal active set, flag-gated.
3. **Graph channel gets a 1.5x default weight boost** when no explicit weight is supplied — `GRAPH_WEIGHT_BOOST = 1.5`, rationale "curated causal edges are higher-signal" [SOURCE: shared/algorithms/rrf-fusion.ts:40-42, 302].
4. **The real ranking brain is a 4-stage pipeline**, not raw RRF. `stage2-fusion.ts` documents a fixed **13-step signal-application order** (session boost, recency fusion, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing-effect write-back, intent weights, artifact routing, feedback signals, retrieval rescue, artifact limiting, anchor+validation metadata) with a hard invariant "every score modification happens exactly once here" [SOURCE: mcp_server/lib/search/pipeline/stage2-fusion.ts:21-45]. Stages: `stage1-candidate-gen → stage2-fusion → stage3-rerank → stage4-filter` [SOURCE: mcp_server/lib/search/pipeline/ directory].
5. **Causal-graph store** is `lib/storage/causal-edges.ts` (insert at :434, :561); table schema `causal_edges` defined in `lib/search/vector-index-schema.ts:1107` and :1775; **soft-delete tombstones** `causal_edge_tombstones` in `lib/causal/sweep.ts:70`. Traversal/boost (weighted BFS, intent-aware edge priors, hop decay, freshness) in `lib/search/causal-boost.ts:1-19` [SOURCE: lib/storage/causal-edges.ts:434, lib/search/vector-index-schema.ts:1107, lib/causal/sweep.ts:70, lib/search/causal-boost.ts:5-15].
6. **FSRS** has two parts: rank-time *structural freshness* `lib/search/fsrs.ts` = `fsrs_stability * graph_centrality_normalized` (central nodes decay slower) [SOURCE: lib/search/fsrs.ts:26-44]; AND an **access-time write-back** `strengthenOnAccess()` doing `UPDATE memory_index` when `trackAccess=true` (the "testing effect", step 3 of the 13) [SOURCE: lib/search/pipeline/stage2-fusion.ts:14, 28, 574-615].
7. **Degree channel** weight is capped at 0.15: `DEGREE_BOOST_CAP = 0.15`, `DEGREE_CHANNEL_WEIGHT = DEGREE_BOOST_CAP`, constitutional memories excluded [SOURCE: lib/search/graph-search-fn.ts:53-56, 567].
8. **Recall serialization** today flows through `lib/response/envelope.ts:99 serializeEnvelope`. No content-derived stable-ordering ("SerializationId") and no untrusted-XML wrapper were found in this pass — a likely gap for Q5/Q8 (INFERENCE, negative evidence: grep for `serializ|render|untrusted|stable.?prefix` returned only envelope/JSON helpers) [SOURCE: lib/response/envelope.ts:99-136; INFERENCE: based on absence of SerializationId/untrusted-tag matches in lib/response + lib/search].

### Internal classification axes (CONFIRMED) — anchors Q2
9. The internal system has **two orthogonal classifiers, neither of which is a retrieval-shape query-class router**:
   - `query-classifier.ts` → **complexity tier** `simple|moderate|complex` (term count, stop-word ratio) → drives channel-*subset* selection [SOURCE: lib/search/query-classifier.ts:13, 28-29].
   - `intent-classifier.ts` → **task intent** `add_feature|fix_bug|refactor|security_audit|understand|find_spec|find_decision` → `IntentWeights {recency, importance, similarity, contextType}` [SOURCE: lib/search/intent-classifier.ts:13, 58-63, 67-75].
   - `query-router.ts` fuses these into a `RouteResult {tier, channels, classification, queryPlan, qualityFallback}` — the tier→channel map (`simple/moderate/complex` channel subsets) and authority/BM25 preservation live here [SOURCE: lib/search/query-router.ts:36-52, 68-75].

### aionforge baseline (CONFIRMED) — anchors Q1/Q2
10. aionforge ships **8 signals**: `Lexical, LexicalAnchor, Dense, Support, Graph, Recency, Importance, Trust`. Lexical/anchor/dense/support/graph are *search* signals; Trust/Importance/Recency are *re-ranks* that only reorder already-surfaced candidates and can never widen recall [SOURCE: retrieval.md:34-37, 45-54].
11. RRF is the weighted sum of `1/(k+rank+1)` with validated default **k=60**; per-mode weights are how intent enters; **a zero weight elides the signal entirely** (4 levels HEAVY 1.0 / MODERATE 0.6 / LIGHT 0.3 / OFF 0.0) [SOURCE: retrieval.md:79-92, 130-133].
12. **5-class query router is mandatory, not optional**: `SingleHopFactual, MultiHop, Temporal, Entity, Quote`, classified by most-specific-first regexes (quoted phrase→Quote; temporal markers→Temporal; 1-2 title-case tokens→Entity; associative cues→MultiHop; else→SingleHopFactual). Each class → a `RetrievalProfile` = per-signal weights + behavior flags `graph_expansion, bitemporal_filter, exact_rerank, quote_phrase, restrict_to_fact_kinds`. Graph expansion is gated by class because "indiscriminate graph expansion measurably hurts simple single-hop precision while it helps multi-hop recall" [SOURCE: retrieval.md:108-143, 187-207].
13. aionforge **never writes back at rank time** — decayed importance is computed at rank time and never persisted; a recall never touches `last_access` [SOURCE: retrieval.md:316-319]. Session-diversity cap default 3 demotes single-session dominance [SOURCE: retrieval.md:289-293]. Graceful embedder degrade: dense skipped, lexical/graph-by-name still run, `embedder_available:false` flag [SOURCE: retrieval.md:296-301].

### BASELINE MAP — internal 5-channel vs aionforge 8-signal
| aionforge signal | internal equivalent (file:line) | relationship |
|---|---|---|
| Lexical (BM25) | bm25 channel + fts5 channel | overlapping (internal splits FTS5 vs in-mem BM25) |
| LexicalAnchor | none found (term-match bonus `fuseScoresAdvanced` is closest) | GAP / partial [rrf-fusion.ts:408-425] |
| Dense (vector + exact rerank) | vector channel + stage3-rerank | present |
| Support (1-hop SUPPORTS expansion) | causal-boost BFS / co-activation spreading | analogous, different edge semantics [causal-boost.ts] |
| Graph (Personalized PageRank) | graph channel + graph-signals + degree | present, different algorithm |
| Recency (re-rank) | recency fusion step 1a + IntentWeights.recency | present [stage2-fusion.ts:26] |
| Importance (decay-at-rank) | fsrs.ts structural freshness (rank-time) | present but ALSO writes back [stage2-fusion.ts:574] |
| Trust (reliability-folded) | none found | GAP |

## Questions Answered
- **Q1 (PARTIAL)**: Channel fusion is implemented in `shared/algorithms/rrf-fusion.ts` and orchestrated by the 13-step `stage2-fusion.ts`. Of aionforge's 8 signals: Lexical/Dense/Graph/Recency/Importance have internal equivalents; **LexicalAnchor and Trust are GAPS**; Support maps loosely to causal-boost/co-activation. Candidate conflict: aionforge's "zero-weight elides signal" + re-ranks-never-widen discipline contrasts with the internal "every signal always contributes, applied once" model — adding aionforge re-rank semantics risks double-counting against the internal G2 double-weighting guard [SOURCE: stage2-fusion.ts:11, 37-40]. (Hypothesis, needs a later iteration to confirm conflict surface.)
- **Q2 (PARTIAL)**: A query-class classifier + per-class weights would live alongside `query-router.ts` (the existing `RouteResult` is the insertion seam), reusing `query-classifier.ts`'s feature-extraction scaffold. Crucially the internal classifiers are *complexity* and *task-intent* axes — **orthogonal** to aionforge's *retrieval-shape* classes — so this is an additive third axis, not a replacement [SOURCE: query-router.ts:36-52, query-classifier.ts:13, intent-classifier.ts:13]. Per-class weights would feed `fuseResultsMulti`'s existing `RankedList.weight` field (already supports per-channel weights, honors explicit 0) [SOURCE: rrf-fusion.ts:83-87, 298-306].

## Questions Remaining
- Q3 (causal graph + bi-temporal currentness edges): store located (`causal-edges.ts`, tombstones in `sweep.ts`) but SUPERSEDED_BY/CONTRADICTS edge semantics not yet read.
- Q4 (save/index path split into episode-write + async consolidation): save path module NOT yet located — next focus.
- Q5 (byte-identical recall serialization): `envelope.ts` found, but no content-derived ordering / stable-prefix cache — likely a gap.
- Q6 (decay as pure rank-time function): KEY CONTRAST FOUND — internal `strengthenOnAccess` writes back to `memory_index` on access [stage2-fusion.ts:603], aionforge never does [retrieval.md:316-319].
- Q7 (session-diversity cap): aionforge cap=3 understood; internal result-assembly/cap location not yet read.
- Q8 (untrusted-XML wrapper): aionforge `recalled-memory-context` wrapper understood; internal wrapper NOT found — likely a gap.
- Q9 (graceful embedder-degrade): aionforge behavior understood; internal vector-channel fallback path not yet read.
- Q10 (cross-cutting generalization): deferred until candidates firm up.

## Next Focus
Iteration 2: Locate and map the **memory save/index path** (Q4) — find the `memory_save`/`memory_index_scan` handlers in `context-server.ts` and the write/consolidation modules — and read the causal-graph **edge semantics** (Q3: SUPERSEDED_BY/CONTRADICTS or equivalent relations in `causal-edges.ts` + tombstone reconciliation in `lib/causal/sweep.ts` / `reconsolidation.ts`). Goal: anchor Q3/Q4 with file:line and assess the episode-write vs async-consolidation split + content-addressed idempotent IDs.
