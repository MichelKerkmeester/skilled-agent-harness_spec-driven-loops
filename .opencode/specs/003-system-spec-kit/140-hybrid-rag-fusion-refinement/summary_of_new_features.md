---
title: Summary of new and updated features
description: Every improvement delivered or planned in the Hybrid RAG Fusion Refinement program, grouped by functional area with expanded descriptions.
---

# Summary of new and updated features

## Contents

- [Bug fixes and data integrity](#bug-fixes-and-data-integrity)
  - [Graph channel ID fix (G1)](#graph-channel-id-fix-g1)
  - [Chunk collapse deduplication (G3)](#chunk-collapse-deduplication-g3)
  - [Co-activation fan-effect divisor (R17)](#co-activation-fan-effect-divisor-r17)
  - [SHA-256 content-hash deduplication (TM-02)](#sha-256-content-hash-deduplication-tm-02)
- [Evaluation and measurement](#evaluation-and-measurement)
  - [Evaluation database and schema (R13-S1)](#evaluation-database-and-schema-r13-s1)
  - [Core metric computation (R13-S1)](#core-metric-computation-r13-s1)
  - [Observer effect mitigation (D4)](#observer-effect-mitigation-d4)
  - [Full-context ceiling evaluation (A2)](#full-context-ceiling-evaluation-a2)
  - [Quality proxy formula (B7)](#quality-proxy-formula-b7)
  - [Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)](#synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a)
  - [BM25-only baseline (G-NEW-1)](#bm25-only-baseline-g-new-1)
  - [Agent consumption instrumentation (G-NEW-2)](#agent-consumption-instrumentation-g-new-2)
  - [Scoring observability (T010)](#scoring-observability-t010)
- [Graph signal activation](#graph-signal-activation)
  - [Typed-weighted degree channel (R4)](#typed-weighted-degree-channel-r4)
  - [Co-activation boost strength increase (A7)](#co-activation-boost-strength-increase-a7)
  - [Edge density measurement](#edge-density-measurement)
- [Scoring and calibration](#scoring-and-calibration)
  - [Score normalization](#score-normalization)
  - [Cold-start novelty boost (N4)](#cold-start-novelty-boost-n4)
  - [Interference scoring (TM-01)](#interference-scoring-tm-01)
  - [Classification-based decay (TM-03)](#classification-based-decay-tm-03)
  - [Folder-level relevance scoring (PI-A1)](#folder-level-relevance-scoring-pi-a1)
  - [Embedding cache (R18)](#embedding-cache-r18)
  - [Double intent weighting investigation (G2)](#double-intent-weighting-investigation-g2)
  - [RRF K-value sensitivity analysis (FUT-5)](#rrf-k-value-sensitivity-analysis-fut-5)
- [Query intelligence](#query-intelligence)
  - [Query complexity router (R15)](#query-complexity-router-r15)
  - [Relative score fusion in shadow mode (R14/N1)](#relative-score-fusion-in-shadow-mode-r14n1)
  - [Channel min-representation (R2)](#channel-min-representation-r2)
  - [Confidence-based result truncation (R15-ext)](#confidence-based-result-truncation-r15-ext)
  - [Dynamic token budget allocation (FUT-7)](#dynamic-token-budget-allocation-fut-7)
- [Memory quality and indexing](#memory-quality-and-indexing)
  - [Verify-fix-verify memory quality loop (PI-A5)](#verify-fix-verify-memory-quality-loop-pi-a5)
  - [Signal vocabulary expansion (TM-08)](#signal-vocabulary-expansion-tm-08)
  - [Pre-flight token budget validation (PI-A3)](#pre-flight-token-budget-validation-pi-a3)
  - [Spec folder description discovery (PI-B3)](#spec-folder-description-discovery-pi-b3)
- [Governance](#governance)
  - [Feature flag governance](#feature-flag-governance)
- [Planned: feedback and quality (sprint 4)](#planned-feedback-and-quality-sprint-4)
- [Planned: pipeline refactor (sprint 5)](#planned-pipeline-refactor-sprint-5)
- [Planned: indexing and graph (sprint 6)](#planned-indexing-and-graph-sprint-6)
- [Planned: long horizon (sprint 7)](#planned-long-horizon-sprint-7)

---

## Bug fixes and data integrity

### Graph channel ID fix (G1)

The graph search channel had a 0% hit rate in production. Zero. The system was designed as a 4-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.

### Chunk collapse deduplication (G3)

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed at the call site in `memory-search.ts` (not the function definition) so dedup runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

### Co-activation fan-effect divisor (R17)

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

The fix applies a `1 / sqrt(neighbor_count)` divisor that scales down score contributions from highly connected nodes. After the change, no single memory appears in more than 60% of co-activation results. The divisor includes proper bounds checks so there is no division-by-zero risk and output stays capped.

### SHA-256 content-hash deduplication (TM-02)

Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

---

## Evaluation and measurement

### Evaluation database and schema (R13-S1)

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers record every retrieval event asynchronously without blocking the response path. Every tuning decision from Sprint 1 onward is backed by data from this schema, which makes it the single most consequential piece of infrastructure in the program.

### Core metric computation (R13-S1)

Nine metrics run against logged retrieval data. The four primary ones are MRR@5 (how high does the right answer rank?), NDCG@10 (are results ordered well?), Recall@20 (do we find everything relevant?) and Hit Rate@1 (is the top result correct?).

Five diagnostic metrics add depth: inversion rate counts pairwise ranking mistakes, constitutional surfacing rate tracks whether high-priority memories appear in top results, importance-weighted recall favors recall of critical content, cold-start detection rate measures whether fresh memories surface when relevant and intent-weighted NDCG adjusts ranking quality by query type.

This battery of metrics means you can diagnose where the pipeline fails, not just whether it fails.

### Observer effect mitigation (D4)

Measurement infrastructure should not degrade the system it measures. A health check compares search p95 latency with eval logging enabled versus disabled and fires an alert when overhead exceeds 10%. In practice, measured overhead stays within the 5ms p95 budget. If the eval database becomes unavailable (disk full, file lock, corruption), search continues normally with logging silently disabled. The system never blocks a user query to record an evaluation metric.

### Full-context ceiling evaluation (A2)

How good could retrieval be if the system had perfect recall? To answer that, an LLM receives all memory titles and summaries and ranks them for each ground truth query. The resulting MRR@5 score is the theoretical upper bound. The gap between this ceiling and actual hybrid performance tells you how much room for improvement exists. A 2x2 matrix alongside the BM25 baseline puts both numbers in context: the BM25 floor shows the minimum, the LLM ceiling shows the maximum, and the hybrid pipeline sits somewhere between.

### Quality proxy formula (B7)

Manual evaluation does not scale. You cannot hand-review every query across every sprint.

The quality proxy formula produces a single 0-1 score from four components: `avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs automatically on logged data and flags regressions without human review.

The weights were chosen to prioritize relevance over speed while still penalizing latency spikes. Correlation testing against the manual ground truth corpus confirmed the proxy tracks real quality well enough for regression detection.

### Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)

A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).

At least 30 queries are hand-written natural language, not derived from trigger phrases. That last detail matters: if your ground truth comes from the same trigger phrases the system already matches against, you are testing the system against itself.

Hard negative queries are included to verify that irrelevant memories rank low. The corpus also incorporates findings from the G-NEW-2 agent consumption analysis, so queries reflect how agents actually use the system rather than how a spec author imagines they do.

### BM25-only baseline (G-NEW-1)

Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number.

### Agent consumption instrumentation (G-NEW-2)

The retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`) now log consumption patterns: what queries agents send, how many results come back, which results get selected and which get ignored.

An initial pattern report identified at least five distinct consumption categories across the agent ecosystem. These patterns are more revealing than you might expect. They expose mismatches between what the system returns and what agents actually use, which directly informs ground truth design and optimization priorities.

### Scoring observability (T010)

Novelty boost values and interference score distributions are logged at query time via 5% sampling to a `scoring_observations` table. Each observation captures memory ID, query ID, the novelty boost value, interference penalty, score before and after and the delta.

The 5% sample rate keeps storage costs low while still catching calibration drift. A try-catch wrapper guarantees that telemetry failures never affect scoring results. If the observation write fails, the search result is unchanged and the failure is swallowed silently.

---

## Graph signal activation

### Typed-weighted degree channel (R4)

A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. When a memory has zero edges, the channel returns 0 rather than failing.

### Co-activation boost strength increase (A7)

The co-activation boost multiplier jumped from 0.1x to 0.25-0.3x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2.

The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable. A dark-run measurement sequence isolates A7 contribution by comparing R4-only results against R4+A7 results.

### Edge density measurement

A SQL query computes the edges-per-node ratio from the `causal_edges` table. This number determines how much graph signal the system can extract. If density falls below 0.5, the system flags an escalation decision for auto entity extraction (R10) in a future sprint. The R4 exit gate is density-conditional: when graph coverage is too thin, the gate evaluates R4 implementation correctness (unit tests, zero-return behavior) rather than demanding the +2% MRR@5 lift that would be unreasonable with a sparse graph. That conditional gating is a pragmatic design choice. No point holding a feature to a metric it cannot influence.

---

## Scoring and calibration

### Score normalization

The RRF fusion system and composite scoring system had a 15:1 magnitude mismatch. RRF scores fell in the 0-0.07 range while composite scores covered the full 0-1 range. Composite dominated purely because of scale, not because it was better.

Min-max normalization now maps both outputs to a 0-1 range, letting actual relevance determine ranking instead of which scoring system happens to produce larger numbers. Single-result queries and equal-score edge cases normalize to 1.0.

The normalization is batch-relative (the same memory can score differently across different queries), which is expected behavior for min-max. Runs behind the `SPECKIT_SCORE_NORMALIZATION` flag.

### Cold-start novelty boost (N4)

FSRS temporal decay biases against recent items. A memory indexed 2 hours ago has barely any retrievability score, even when it is exactly what you need.

The novelty boost applies an exponential decay (`0.15 * exp(-elapsed_hours / 12)`) to memories under 48 hours old, counteracting that bias. At indexing time, the boost is 0.15. After 12 hours, it drops to about 0.055. By 48 hours, it is effectively zero.

The boost applies before FSRS decay and caps the composite score at 0.95 to prevent runaway inflation. One side effect: memories with high base scores (above 0.80) see diminished effective boost because the cap clips them. That is intentional. High-scoring memories do not need extra help.

### Interference scoring (TM-01)

Memories in dense similarity clusters tend to crowd out unique results. If you have five near-identical memories about the same topic, all five can occupy the top results and push out a different memory that might be more relevant.

Interference scoring penalizes cluster density: for each memory, the system counts how many neighbors exceed 0.75 cosine similarity within the same spec folder, then applies a `-0.08 * interference_score` penalty after the N4 novelty boost.

Both the threshold (0.75) and coefficient (-0.08) are provisional. They will be tuned empirically after two R13 evaluation cycles, tracked as FUT-S2-001. Runs behind the `SPECKIT_INTERFERENCE_SCORE` flag.

### Classification-based decay (TM-03)

Not all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.

FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability, and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.

The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.

### Folder-level relevance scoring (PI-A1)

A damped aggregation formula (`(1/sqrt(M+1)) * SUM(MemoryScore(m))`) combines individual memory scores into a folder-level relevance score. The `1/sqrt(M+1)` damping factor prevents large folders from dominating by volume. Without it, a folder with 200 memories would outscore a folder with 10 memories even when the 10-memory folder contains more relevant content per item.

This scoring enables two-phase retrieval: first rank folders by aggregated score, then search within the top-ranked folders. The feature requires normalized memory scores from the score normalization module to produce meaningful comparisons. Runs behind the `SPECKIT_FOLDER_SCORING` flag.

### Embedding cache (R18)

Embedding API calls are the most expensive operation in the indexing pipeline. The embedding cache stores generated embeddings in a SQLite table keyed by SHA-256 content hash and model ID. On re-index, the system checks the cache first.

A hit returns the stored embedding in microseconds instead of making a network round-trip that costs money and takes hundreds of milliseconds. LRU eviction via `last_used_at` prevents unbounded cache growth, and the `INSERT OR REPLACE` strategy handles model upgrades cleanly.

The cache has no feature flag because cache misses fall through to normal embedding generation with zero behavioral change.

### Double intent weighting investigation (G2)

A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.

System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.

A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The investigation is documented in `scratch/wave-2-S2-A3-investigation.md`.

### RRF K-value sensitivity analysis (FUT-5)

The K parameter in Reciprocal Rank Fusion controls how much rank position matters. A low K amplifies rank differences while a high K compresses them.

A grid search over K values {20, 40, 60, 80, 100} measured MRR@5 delta per value using Kendall tau correlation for ranking stability. The optimal K was identified and documented. Before this analysis, K was chosen by convention rather than measurement. Now it is empirically grounded.

---

## Query intelligence

### Query complexity router (R15)

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers based on term count, character count, trigger phrase presence and stop-word ratio. Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.

When the `SPECKIT_COMPLEXITY_ROUTER` flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.

### Relative score fusion in shadow mode (R14/N1)

RRF has been the fusion method since day one, but is it the best option? Relative Score Fusion runs alongside RRF in shadow mode to find out.

Three RSF variants are implemented: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). RSF results are logged for evaluation comparison but do not affect actual ranking.

Kendall tau correlation between RSF and RRF rankings is computed at sprint exit to measure how much the two methods diverge. If RSF consistently outperforms, a future sprint can switch the primary fusion method with measured evidence.

### Channel min-representation (R2)

A strong vector channel can monopolize the top-k results, pushing out graph and lexical results entirely. Channel min-representation fixes that.

After fusion, the system checks that every channel which returned results has at least one representative in the top-k window. Results below a 0.2 quality floor are excluded from promotion because forcing a bad result into the top-k is worse than missing a channel.

Promoted items are appended to the result list and the entire set is re-sorted by score so ranking integrity is preserved. The net effect: you see results from diverse retrieval strategies rather than one dominant channel. Runs behind the `SPECKIT_CHANNEL_MIN_REP` flag.

### Confidence-based result truncation (R15-ext)

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.

Edge cases are handled: NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.

### Dynamic token budget allocation (FUT-7)

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

---

## Memory quality and indexing

### Verify-fix-verify memory quality loop (PI-A5)

Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.

If the second attempt still fails, a third try runs with stricter trimming. After two failed retries, the memory is rejected outright.

Rejection rates are logged per spec folder so you can spot folders that consistently produce low-quality saves. This loop catches problems at write time rather than letting bad data pollute search results.

### Signal vocabulary expansion (TM-08)

The trigger matcher originally recognized six signal categories. Two new categories from the true-mem 8-category vocabulary were added: CORRECTION signals (words like "actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want").

Correction signals matter because they indicate the user is fixing a prior misunderstanding, which means different memories are relevant. Preference signals help the system detect intent behind requests like "I prefer the JSON format" where matching on preference-associated memories improves retrieval accuracy.

### Pre-flight token budget validation (PI-A3)

Before assembling the final response, the system estimates total token count across all candidate results and truncates to the highest-scoring candidates when the total exceeds the configured budget. The truncation strategy is greedy: highest scores first, never round-robin. For `includeContent=true` queries where a single result overshoots the budget, a summary (first 400 characters) replaces raw content rather than returning nothing. Overflow events are logged with query ID, candidate count, total tokens, budget limit and the number of results after truncation. This prevents the response from blowing through the caller's context window.

### Spec folder description discovery (PI-B3)

A cached one-sentence description per spec folder (derived from spec.md) is stored in a `descriptions.json` file. The `memory_context` orchestration layer checks these descriptions before issuing vector queries. If the target folder can be identified from the description alone, the system skips full-corpus search entirely. This is a lightweight routing optimization that reduces unnecessary computation for scoped queries where the user already has a specific folder in mind.

---

## Governance

### Feature flag governance

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled. A governance framework caps active flags at six, enforces a 90-day lifespan per flag and requires a monthly sunset audit. Each sprint exit includes a formal review: flags with positive metrics are permanently enabled, flags with negative metrics are removed and inconclusive flags receive a 14-day extension with a hard deadline. The B8 signal ceiling limits active scoring signals to 12 until automated evaluation (R13) is mature enough to validate new signals reliably.

---

## Planned: feedback and quality (sprint 4)

### MPAB chunk-to-memory aggregation (R1)

When a memory file splits into chunks, each chunk gets its own score. Mean-Plus-Average-Bonus aggregation will combine those chunk scores into a single memory-level score. Guards handle the edge cases: N=0 returns 0, N=1 returns the raw score and N>1 applies MPAB with index-based max removal. The aggregation adds `_chunkHits` metadata so you can see how many chunks contributed to the final score. Runs behind the `SPECKIT_DOCSCORE_AGGREGATION` flag.

### Learned relevance feedback (R11)

The system currently ignores what you do with search results. Learned relevance feedback changes that. User selection behavior trains a `learned_triggers` column stored separately from the main content and explicitly excluded from the FTS5 index to prevent contamination (the single biggest risk in this feature). Ten safeguards protect against noise: a 100-word denylist, rate cap of 3 learned triggers per 8 hours, 30-day TTL decay, FTS5 isolation, noise floor (top-3 only), rollback mechanism, provenance audit log, one-week shadow period, 72-hour minimum memory age and sprint gate review. Activation requires 28 calendar days of R13 evaluation logging. The safeguards may seem excessive, but FTS5 contamination is irreversible in production, so the caution is earned.

### Shadow scoring and channel attribution (R13-S2)

Full A/B comparison infrastructure will run alternative scoring in parallel, logging results without affecting live ranking. The key new metric is Exclusive Contribution Rate: how often each channel is the sole source for a result in the top-k window. This metric answers the question "would results change if we removed this channel?" which is more useful than raw per-channel accuracy. Ground truth Phase B adds implicit feedback collection from user selections, growing the evaluation corpus automatically.

### Negative feedback confidence signal (A4)

When you mark a memory as not useful via `memory_validate(wasUseful: false)`, that signal currently only affects the confidence score. A4 will wire it into composite scoring as a demotion multiplier with a 0.3 floor and gradual decay. Repeated negative feedback causes measurable ranking reduction. The 0.3 floor prevents a memory from being buried entirely by a few bad ratings since it might still be relevant to other queries.

### Chunk ordering preservation (B2)

When multi-chunk results collapse back into a single memory, chunks are currently reordered by score. That breaks reading flow. B2 will sort chunks by their original `chunk_index` so the consuming agent reads content in document order. A small change, but one that affects readability of every multi-chunk result.

### Pre-storage quality gate (TM-04)

A multi-layer quality gate on memory save will add structural validation (Layer 1), content quality scoring with a signal density threshold of 0.4 or higher (Layer 2) and semantic dedup rejecting saves above 0.92 cosine similarity to existing memories (Layer 3). The gate starts in warn-only mode for two weeks before enforcing rejections. That ramp-up period lets you observe what would be rejected without losing data while the thresholds are being validated.

### Reconsolidation-on-save (TM-06)

After embedding generation, the save pipeline will check the top-3 most similar memories in the same spec folder. Similarity above 0.88 triggers a merge where content is combined and a frequency counter increments. Similarity between 0.75-0.88 triggers replacement: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores as a new complement. A checkpoint is required before first enable because the merge operation is destructive. Runs behind the `SPECKIT_RECONSOLIDATION` flag.

### LLM-judge ground truth generation (G-NEW-3 phase C)

An LLM judge will generate relevance labels for query-selection pairs, expanding the ground truth corpus to at least 200 pairs. Phase C depends on Phase B (implicit feedback collection) accumulating 200 query-selection pairs first. R11 learned trigger mutations cannot be enabled until this corpus size is reached. The dependency chain is deliberate: collect data, label it, validate the system, then let the system learn.

---

## Planned: pipeline refactor (sprint 5)

### 4-stage pipeline refactor (R6)

The retrieval pipeline will be restructured into four bounded stages: Candidate Generation (5 channels execute), Fusion and Signal Integration (RRF and all scoring signals applied once to prevent G2-style double-weighting), Rerank and Aggregate (cross-encoder, MMR, MPAB) and Filter and Annotate (presentation layer). Stage 4 enforces a "no score changes" invariant via TypeScript type guards and runtime assertions. If code in Stage 4 attempts to modify a score, it fails at compile time. The refactor is conditional on Sprint 2 normalization results. If normalization resolves the scoring issues cleanly, the full refactor may be unnecessary. Decomposed into 8 sub-tasks (T002a through T002h). Runs behind the `SPECKIT_PIPELINE_V2` flag.

### Spec folder pre-filter (R9)

When you specify a spec folder in your query, the search currently runs the full corpus and then filters. R9 will restrict the search to that folder before running the pipeline, avoiding computation on memories that will be discarded anyway. For unscoped queries, nothing changes. This is a latency optimization for the common case where you know which folder you care about.

### Query expansion (R12)

Embedding-based query expansion will broaden retrieval for complex queries by generating additional search terms from the query embedding neighborhood. When R15 classifies a query as "simple", expansion is suppressed because expanding a trigger-phrase lookup would add noise. If expansion produces no additional terms, the original query proceeds unchanged. Mutual exclusion with R15 ensures the two features do not interfere. Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag.

### Template anchor optimization (S2)

Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) will become an independent scoring dimension in the composite scoring model, expanding it from five factors to seven. Memories with well-defined anchors score higher because anchors indicate structured, retrievable content. Missing anchors are handled gracefully: the dimension contributes zero rather than penalizing. Applied in Stage 2 of the pipeline.

### Validation signals as retrieval metadata (S3)

Spec document validation metadata (from `validate.sh` passes) will integrate into the scoring layer as an additional ranking dimension in Stage 2. A validated spec.md scores slightly higher than an unvalidated one. Missing validation signals are omitted without penalty. The effect is small but directionally correct: well-maintained documentation should rank above neglected documentation when both are relevant.

### Dual-scope memory auto-surface (TM-05)

Memory auto-surface hooks will fire at two lifecycle points beyond explicit search: tool dispatch (when an agent calls a tool, relevant memories surface automatically) and session compaction (when context is compressed, critical memories are re-injected). Each hook point has a per-point token budget of 4,000 tokens maximum. The hooks extend the existing auto-surface configuration in `hooks/auto-surface.ts`.

### Constitutional memory as expert knowledge injection (PI-A4)

Constitutional-tier memories will receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality." Existing constitutional memory content is parsed to identify rule patterns and extract directives automatically. Deferred from Sprint 4 per review recommendation REC-07.

### Tree thinning for spec folder consolidation (PI-B1)

A bottom-up merge strategy will thin small files during spec folder context loading. Files under 200 tokens have their summary merged into the parent document. Files under 500 tokens use their content directly as the summary, skipping separate summary generation. Memory file thresholds differ: 300 tokens for thinning and 100 tokens for text-is-summary. The optimization runs before Stage 1 in `generate-context.js` and does not affect scoring logic.

### Progressive validation for spec documents (PI-B2)

The `validate.sh` script currently returns binary pass/fail. Progressive validation will add four levels: Detect (identify violations), Auto-fix (apply safe mechanical corrections like missing dates, heading levels and whitespace with before/after diff logging), Suggest (present non-automatable issues with guided options) and Report (structured output with exit 0/1/2 compatibility). A dry-run mode previews all changes before applying them so you can review corrections before they land.

---

## Planned: indexing and graph (sprint 6)

### Anchor-aware chunk thinning (R7)

Anchor markers in indexed content will influence chunk scoring so that anchor-bearing chunks rank higher than content-only chunks. A thinning threshold drops low-scoring chunks from the index entirely, reducing storage and search noise. The constraint: Recall@20 must stay within 10% of the pre-thinning baseline. If thinning costs too much recall, the threshold is raised until the constraint is met.

### Encoding-intent capture at index time (R16)

An `encoding_intent` field will classify content type (code, prose, structured data) at index time and store it alongside the embedding as metadata. In Sprint 6, this is capture only with no retrieval-time scoring impact. The intent is to build a labeled dataset that future sprints can use for type-aware retrieval (searching for code differently than searching for prose). Runs behind the `SPECKIT_ENCODING_INTENT` flag.

### Spec folder hierarchy as retrieval structure (S4)

Spec folder paths from memory metadata will be parsed into an in-memory hierarchy tree. The graph search function will traverse this tree so that parent and sibling memories surface as contextual results alongside direct matches. This makes your spec folder organization a direct retrieval signal rather than metadata that only serves filtering.

### Lightweight consolidation (N3-lite)

Four sub-components handle ongoing memory graph maintenance. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation (one says "always" and the other says "never"). Hebbian edge strengthening adds +0.05 per retrieval cycle with caps and 30-day decay of 0.1 to reinforce frequently co-retrieved memories. Staleness detection flags edges unfetched for 90 or more days. Edge bounds enforcement caps nodes at 20 edges and limits auto-generated edges to strength 0.5. The system surfaces full contradiction clusters rather than isolated pairs because contradictions often involve more than two memories. Runs behind the `SPECKIT_CONSOLIDATION` flag.

### Graph centrality and community detection (N2)

Three new graph capabilities extend existing centrality computation in `fsrs.ts`. Graph momentum tracks temporal degree delta over a 7-day sliding window to detect memories gaining connections. Causal depth signal normalizes max-depth paths from root memories to give deeper causal chains more weight. Community detection starts with connected components via BFS and escalates to Louvain modularity when clusters are too coarse. The target: graph channel attribution above 10% of final top-k results. Sprint 6b is gated on a feasibility spike because the N2c community detection component alone carries a 40-80 hour estimate with production quality concerns.

### Auto entity extraction (R10)

Rule-based heuristics will extract entities from memory content using noun-phrase extraction (via `compromise` npm or similar), gated on edge density below 1.0. Auto-extracted entities are tagged with `created_by='auto'` and capped at strength 0.5 to limit their influence until validated. The false positive rate must stay below 20% on manual review of at least 50 sampled entities. Also gated on Sprint 6b behind a feasibility spike.

---

## Planned: long horizon (sprint 7)

### Memory summary generation (R8)

Extractive or TF-IDF key-sentence summaries will serve as a pre-filter in the search pipeline, reducing search space for large corpora. The feature activates only when the system exceeds 5,000 active memories with embeddings. Below that threshold, the overhead is not worth the savings. The pre-filter must add less than 50ms to p95 search latency. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag.

### Smarter memory content generation (S1)

Content extraction heuristics for markdown sources will improve with heading-aware extraction, code-block stripping and list normalization. Right now, raw markdown (including code fences and nested lists) gets embedded as-is, which dilutes the embedding quality with formatting noise. Quality is verified via manual review of at least 10 before/after samples, targeting measurable improvement in 8 out of 10 samples.

### Cross-document entity linking (S5)

Entity resolution across documents will use exact-match plus normalized-alias matching for verified entities. The feature activates when the system exceeds 1,000 active memories or 50 verified entities. If R10 auto-entity false positive rates from Sprint 6 are not confirmed below 20%, linking restricts to manually verified entities only. That restriction is a safety valve: bad entities create bad links that degrade retrieval. Runs behind the `SPECKIT_ENTITY_LINKING` flag.

### Full reporting and ablation study framework (R13-S3)

A full evaluation dashboard will provide historical trend visualization and per-sprint, per-channel metric views. The ablation study framework is the more interesting part: it enables or disables individual retrieval channels and measures Recall@20 delta per component. "What happens if we turn off the graph channel?" becomes a question with a measured answer rather than speculation. This is the only P1 requirement in Sprint 7.

### INT8 quantization evaluation (R5)

Current production metrics (active memory count, p95 search latency, embedding dimensions) will be measured against activation criteria: more than 10K memories, more than 50ms latency or more than 1,536 dimensions. If any criterion is met, INT8 quantization is evaluated using a custom quantized BLOB with KL-divergence calibration, explicitly not using sqlite-vec's `vec_quantize_i8` function. Original float vectors are preserved alongside the quantized version. The decision is documented regardless of outcome because "not yet needed" is a valid and useful finding.
