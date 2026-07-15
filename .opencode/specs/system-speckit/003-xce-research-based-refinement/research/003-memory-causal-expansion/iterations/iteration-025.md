# Iteration 006 - RQ-B1 Memory backend semantic trigger matching

## Focus

RQ-B1 asks whether `memory_match_triggers` should graduate from lexical/regex trigger matching to embedding-based semantic similarity using the existing Voyage-4 1024-dim embedding stack and cache.

Verdict: ADAPT with feature flag. Keep lexical/regex as the precision path and add an optional semantic fallback/union stage. Do not replace lexical matching. Do not make per-prompt embeddings unconditional.

## Actions Taken

- Read `trigger-matcher.ts`. Current matching loads canonical spec docs and `_memory.continuity` rows from `memory_index`, extracts trigger phrases, normalizes them, builds a Unicode-aware token/ngram candidate index, and runs boundary regex matching (`trigger-matcher.ts:201-210`, `trigger-matcher.ts:407-545`, `trigger-matcher.ts:772-807`, `trigger-matcher.ts:859-880`).
- Read `memory-triggers.ts`. The handler validates input/session scope, calls `matchTriggerPhrasesWithStats(prompt, limit * 2)`, applies tenant/spec/user/agent scope filtering afterward, then activates matched memories in working memory and co-activation when cognitive mode is enabled (`memory-triggers.ts:183-238`, `memory-triggers.ts:287-329`, `memory-triggers.ts:360-380`).
- Read adjacent cognitive modules. `attention-decay`, `working-memory`, `tier-classifier`, and `co-activation` rank, decay, and spread already-selected memories. They do not generate semantic trigger candidates.
- Read `embedding-cache.ts`. Persistent cache rows are keyed by `(content_hash, model_id, dimensions)`, store raw embedding BLOBs, update `last_used_at` on hit, and support dimension variants (`embedding-cache.ts:45-55`, `embedding-cache.ts:72-97`, `embedding-cache.ts:123-149`).
- Read save embedding pipeline. Memory save already computes a normalized-content cache key, checks the persistent embedding cache, generates a provider embedding on miss, and stores the BLOB after quality gate (`embedding-pipeline.ts:114-130`, `embedding-pipeline.ts:143-169`).
- Read provider selection. Auto mode prefers Voyage when `VOYAGE_API_KEY` is present, with default model `voyage-4`; configured dimensions are derived from provider/model unless `EMBEDDING_DIM` overrides them (`factory.ts:88-101`, `factory.ts:235-284`, `factory.ts:325-364`).
- Read semantic precedent. `embedding-expansion.ts` is already a feature-flagged semantic broadening stage that suppresses itself for simple queries and fails closed to identity results (`embedding-expansion.ts:13-20`, `embedding-expansion.ts:155-218`). `memory-summaries.ts` provides a local cosine helper and BLOB-to-Float32 conversion pattern (`memory-summaries.ts:25-76`, `memory-summaries.ts:161-190`).
- Read XCE external README. XCE's transferable idea is not a SaaS dependency; it is semantic "find by meaning" plus steering that calls semantic context before blind reads (`external/README.md:22-27`, `external/README.md:101-119`, `external/README.md:192-199`).

## Findings

### F-iter006-001 - Lexical trigger matching should remain the primary precision path

Verdict: ADAPT, not ADOPT-as-replacement. LOC estimate: ~0 for preserving current path; semantic work should be additive.

Evidence: Current triggers deliberately preserve exact command and phrase behavior: normalized trigger phrases become regexes with Unicode-aware boundaries, while CJK phrases use substring matching to avoid whitespace assumptions (`trigger-matcher.ts:224-244`). Candidate generation uses Unicode tokens plus 2-3 gram keys to avoid scanning every cached phrase when possible (`trigger-matcher.ts:247-253`, `trigger-matcher.ts:407-421`, `trigger-matcher.ts:859-880`). Sorting is deterministic and explainable: matched phrase count first, then importance weight (`trigger-matcher.ts:798-807`).

Implication: semantic matching must UNION with lexical results, never replace them. Explicit triggers such as `/memory:save`, `save context`, and exact continuity phrases are a control surface, not fuzzy search queries. If lexical returns a strong command-style match, semantic expansion should skip by default.

### F-iter006-002 - A semantic fallback is justified for paraphrase recall

Verdict: ADAPT_WITH_FEATURE_FLAG. LOC estimate: ~130-210 production LOC for a semantic trigger module and handler integration, plus ~80-140 tests.

Evidence: XCE's public value proposition is semantic retrieval: "find code by meaning, not just text matching" (`external/README.md:192-199`). The current trigger matcher has no paraphrase path: it compares prompt text to stored trigger phrases through boundary regexes only (`trigger-matcher.ts:749-819`). Existing memory search already supports embedding query generation and vector search with cosine distance over `vec_memories` (`vector-index-queries.ts:190-270`, `vector-index-queries.ts:584-598`).

Implication: add an optional second stage:

1. Run lexical matching first.
2. If lexical returns zero matches, or only weak/non-command matches, embed the prompt.
3. Compare prompt embedding against precomputed trigger phrase embeddings.
4. Merge semantic hits with lexical hits, preserving lexical precedence.

This catches paraphrases such as "save the current state" when the stored trigger is "save context", while keeping explicit phrases exact.

### F-iter006-003 - Existing Voyage/cache infrastructure can be reused, but trigger embeddings need their own index metadata

Verdict: ADAPT. LOC estimate: ~90-140 production LOC for schema/backfill plus ~60-100 tests.

Evidence: Provider auto-resolution already chooses Voyage when a real `VOYAGE_API_KEY` exists and defaults that provider to `voyage-4` (`factory.ts:88-101`, `factory.ts:325-364`). The persistent cache already stores BLOB embeddings by content hash, model, and dimensions (`embedding-cache.ts:45-55`). Save-time embedding code already demonstrates the lookup/generate/store pattern against that cache (`embedding-pipeline.ts:143-169`).

Implication: do not extend `trigger_phrases` JSON with embeddings. Keep `trigger_phrases` as human-authored source data and add derived index metadata, for example:

- `memory_trigger_embeddings(memory_id, phrase, phrase_hash, model_id, dimensions, embedding_status, updated_at)`
- Use `embedding_cache` for the actual phrase BLOB keyed by `phrase_hash + model_id + dimensions`.
- Load semantic trigger rows into an in-memory cache beside `triggerCache`.

This reuses cache storage and eviction while keeping the phrase-to-memory mapping queryable, migratable, and rebuildable.

### F-iter006-004 - Cold start should be handled by memory indexing/backfill, not by synchronous trigger calls

Verdict: ADAPT. LOC estimate: ~50-90 production LOC in `memory_index_scan`/save retry path plus ~40-70 tests.

Evidence: `memory_match_triggers` has tight latency assumptions: `trigger-matcher` warns at 30ms and classifies under-50ms as PASS (`trigger-matcher.ts:132-160`), while the handler warns when total latency exceeds 100ms (`memory-triggers.ts:255-265`, `memory-triggers.ts:331-354`). Query embeddings can involve provider calls and timeout/circuit-breaker behavior (`embeddings.ts:673-724`), which does not fit a cold-start backfill inside a trigger call.

Implication: backfill trigger phrase embeddings during `memory_index_scan`, memory save, or retry/reindex workflows. At runtime, semantic matching should only use already-indexed trigger embeddings. If a phrase has no embedding, mark it skipped in telemetry and preserve lexical behavior.

### F-iter006-005 - Thresholds must start conservative and graduate through shadow telemetry

Verdict: ADAPT_WITH_SHADOW_FIRST. LOC estimate: ~60-100 production LOC for flags, thresholds, telemetry, and eval logging.

Evidence: The current handler records trigger eval results as binary scores of `1.0` (`memory-triggers.ts:255-265`). That is safe for exact matches but too coarse for semantic matches. Existing embedding expansion already uses a guard-heavy, feature-flagged design that can return identity on disable, simple-query suppression, invalid embeddings, or no candidates (`embedding-expansion.ts:155-218`). Summary embedding search computes cosine locally and over-fetches before sorting (`memory-summaries.ts:161-190`), which is a reusable pattern for small trigger sets.

Implication: use a new flag family:

- `SPECKIT_SEMANTIC_TRIGGERS=false` initially.
- `SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow|union`, with `shadow` first.
- `SPECKIT_SEMANTIC_TRIGGER_THRESHOLD=0.84` as a conservative starting point, not a final truth.
- `SPECKIT_SEMANTIC_TRIGGER_MARGIN=0.04` to require top-hit separation.
- `SPECKIT_SEMANTIC_TRIGGER_MAX=3` to cap downstream activation.

The exact cutoff should be tuned from trigger goldens and shadow logs. Test candidate thresholds around 0.78, 0.82, 0.86, and choose the highest-recall threshold that keeps false activation acceptable. Until that eval exists, active union should require both threshold and margin.

### F-iter006-006 - False positives are more expensive here than in ordinary search

Verdict: ADAPT_WITH_GUARDS. LOC estimate: ~40-80 production LOC for activation weighting and diagnostics.

Evidence: Trigger matches are not just returned. In cognitive mode, each matched memory is activated, assigned working-memory attention `1.0`, and then passed into co-activation spreading (`memory-triggers.ts:360-380`). Tier filtering then decides whether HOT/WARM content is injected (`memory-triggers.ts:155-168`, `memory-triggers.ts:390-430`). A wrong semantic trigger can therefore move unrelated memory into the active context path.

Implication: semantic hits should carry `matchSource: "semantic"`, `semanticScore`, and matched trigger phrase. In active mode, either:

- require a stricter threshold/margin before normal activation, or
- activate semantic-only hits with reduced attention, for example `min(0.85, semanticScore)`, while lexical hits keep `1.0`.

Do not let semantic-only hits masquerade as exact trigger phrase matches in eval logs or response metadata.

## Questions Answered

- Should `memory_match_triggers` graduate to embedding-based semantic similarity? Yes, but as a hybrid optional stage. The right verdict is ADAPT, not ADOPT, because exact triggers are a control surface and semantic false positives affect cognitive activation.
- Why hybrid, not replacement? Lexical matching preserves command precision, Unicode boundary behavior, CJK substring support, deterministic ordering, and very low latency. Semantic matching adds paraphrase recall.
- When should the embedding call happen? Only when `SPECKIT_SEMANTIC_TRIGGERS` is enabled and lexical matching is empty or weak. Strong lexical command matches should short-circuit semantic matching.
- Where should the threshold start? Shadow mode should log threshold bands first. A conservative active starting point is `0.84` cosine plus `0.04` top-hit margin and max 3 semantic hits, pending eval calibration.
- How should cold start work? Backfill trigger embeddings through `memory_index_scan`, save/retry indexing, or an explicit maintenance task. Runtime trigger calls should skip missing trigger embeddings rather than generating them synchronously.
- Storage: extend JSON or add table? Add a derived table/index. Keep `trigger_phrases` JSON as source text. Use `embedding_cache` for BLOB storage and a trigger-specific table for phrase-to-memory metadata.
- LOC estimate? Approximately ~280-430 production LOC plus ~180-280 tests for a guarded hybrid implementation: semantic matcher/cache loader (~130-210), schema/backfill (~90-140), flags/telemetry/activation guards (~60-100). Documentation/eval fixtures may add ~30-60.
- Risk? False positives can mis-prioritize cognitive tiers because trigger matches activate working memory and co-activation. Mitigate with feature flags, shadow logs, threshold + margin, source-tagged telemetry, and reduced semantic-only activation.
- Verdict? ADAPT with feature flag, shadow-first rollout, lexical precedence, and backfilled trigger embeddings.

## Questions Remaining

- What trigger golden set should define acceptable false activation rate for semantic-only matches?
- Should semantic-only trigger hits activate working memory at a reduced score, or should they only retrieve content without activation until proven?
- Should trigger embeddings use raw trigger phrases only, or a weighted text like `title + trigger phrase + spec folder slug`?
- Should semantic trigger telemetry be folded into the existing eval logger as a new `fusionMethod`, for example `trigger-hybrid`, or kept as separate trigger diagnostics?

## Next Focus

RQ-B2 - Memory backend LLM-curated context assembly. Investigate whether `memory_context` should move from rule-based templates toward XCE-style dynamic packaging, and where the trust/latency boundary should sit.
