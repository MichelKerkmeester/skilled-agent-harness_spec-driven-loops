# Iteration 007 - RQ-B2 Memory backend LLM-curated context assembly

## Focus

RQ-B2 asks whether `memory_context` assembly should become LLM-curated, XCE-style dynamic packaging instead of deterministic/rule-based response shaping.

Verdict: ADAPT, but defer active mode until an eval proves lift. Add an optional post-retrieval curator behind a default-off flag, keep deterministic packaging as the fallback, and treat the LLM output as a packaging plan rather than a ranking authority. The current code already has intent-aware retrieval, causal traversal, response profiles, progressive disclosure, caching, and trace metadata; the missing piece is not candidate discovery, but task-aware selection from an overfetched candidate pool.

## Actions Taken

- Read `memory-context.ts`. `memory_context` chooses quick/deep/focused/resume strategies, forwards deep/focused to `handleMemorySearch`, auto-routes intent to deterministic response profiles, enforces token budget, then wraps the response with metadata (`memory-context.ts:953-1031`, `memory-context.ts:1595-1607`, `memory-context.ts:1642-1808`).
- Read `memory-search.ts`. `memory_search` executes the V2 pipeline, then applies community fallback, folder boost, canonical-source filtering, session goal refinement, extra metadata assembly, `formatSearchResults`, progressive disclosure, cache storage, session dedup, telemetry, eval logging, feedback logging, and profile formatting (`memory-search.ts:985-1097`, `memory-search.ts:1107-1319`, `memory-search.ts:1360-1625`).
- Read `pipeline/README.md` and stage modules. The 4-stage pipeline returns ranked results and metadata; Stage 3 owns rerank and aggregation, Stage 4 only filters/annotates and must preserve ordering/score immutability (`pipeline/README.md:15-40`, `pipeline/README.md:95-111`, `stage3-rerank.ts:6-26`, `stage4-filter.ts:6-35`).
- Read `stage4-filter.ts`. Stage 4 applies state filters, optional tier limits, TRM evidence-gap annotation, and a final `config.limit` cap (`stage4-filter.ts:128-195`, `stage4-filter.ts:264-317`).
- Read `causal-boost.ts`. Current graph use is already intent-aware: causal boost maps intent to edge priorities, limits traversal depth, injects neighbors, and has separate graph-context injection metadata (`causal-boost.ts:9-15`, `causal-boost.ts:52-76`, `causal-boost.ts:518-673`, `causal-boost.ts:680-784`).
- Read response/profile modules. Existing response profiles are deterministic templates: quick, research, resume, and debug. Progressive disclosure adds a rule-based summary/snippet/cursor layer (`profile-formatters.ts:4-21`, `profile-formatters.ts:85-99`, `progressive-disclosure.ts:4-12`).
- Read LLM precedent. Stage 1 already has optional LLM reformulation with cache-hit bypass, exact call budget, fail-open fallback, and shared TTL cache (`stage1-candidate-gen.ts:1140-1225`, `llm-reformulation.ts:321-338`, `llm-reformulation.ts:348-371`, `llm-cache.ts:4-15`, `llm-cache.ts:39-41`, `llm-cache.ts:85-127`).
- Read XCE README. XCE's transferable package shape is a single context call that combines search, architectural context, traceability, and relationships; it is not merely a ranked list (`external/README.md:22-27`, `external/README.md:111-119`, `external/README.md:129-136`, `external/README.md:240-245`).

## Findings

### F-iter007-001 - LLM curation belongs after retrieval, not inside the scoring stages

Verdict: ADAPT. LOC estimate: ~45-75 production LOC for integration seam and metadata plumbing, assuming a separate curator module.

Evidence: The pipeline contract is deliberately retrieval-oriented: Stage 1 generates candidates, Stage 2 scores/fuses, Stage 3 reranks/aggregates, and Stage 4 filters/annotates (`pipeline/README.md:33-40`, `pipeline/README.md:95-111`). Stage 4 explicitly promises that ordering from Stage 3 is preserved and score fields are not mutated (`stage4-filter.ts:6-19`, `stage4-filter.ts:128-134`, `stage4-filter.ts:311-317`). `memory_context` already wraps the strategy result after retrieval and before the final MCP response (`memory-context.ts:1642-1808`).

Implication: do not let an LLM curator mutate `score`, `rrfScore`, `intentAdjustedScore`, or retrieval ordering in the canonical result set. The safer shape is:

1. Run deterministic retrieval.
2. Build a curation input from the top overfetched candidates plus query intent, causal metadata, confidence, tiers, and source paths.
3. Let the LLM return an ordered package plan: selected IDs, sections, rationale labels, omissions, and risk flags.
4. Attach that package as `data.curatedContext` or apply it only to presentation output when active.

This keeps ranking auditable and makes deterministic fallback trivial.

### F-iter007-002 - The current caller limit blocks the proposed top-2K curator unless retrieval and presentation budgets split

Verdict: ADAPT_WITH_PIPELINE_BUDGET_SPLIT. LOC estimate: ~50-90 production LOC plus ~40-70 tests.

Evidence: `memory_search` passes the caller's `limit` into the pipeline config (`memory-search.ts:900-929`, `memory-search.ts:947-950`). Stage 4 then enforces that same `config.limit` as a final cap after filtering (`stage4-filter.ts:305-309`). Only after that does `memory_search` build formatting metadata and call `formatSearchResults` (`memory-search.ts:1107-1127`, `memory-search.ts:1255-1266`).

Implication: a "top-2K candidates + user intent" curator cannot be inserted as a pure formatter today, because the formatter sees the already-capped list. Add separate knobs:

- `retrievalCandidateLimit` or `curationCandidateLimit`, bounded hard, e.g. 100-300 first, not 2K initially.
- `presentationLimit`, preserving the current external `limit` behavior.
- `curationTokenBudget`, computed before the LLM call.

Without this split, the curator mostly rearranges the same top-N list and is unlikely to beat deterministic packaging.

### F-iter007-003 - Existing deterministic response profiles are a useful baseline, not the target design

Verdict: DEFER_ACTIVE_UNTIL_EVAL. LOC estimate: ~0 for baseline; ~60-100 production LOC for shadow comparison instrumentation.

Evidence: Existing profiles already produce different package shapes: `quick` returns top result plus omission count, `research` returns results plus evidence digest/follow-ups, `resume` returns state/nextSteps/blockers, and `debug` preserves trace (`profile-formatters.ts:4-21`, `profile-formatters.ts:73-119`). `memory_context` auto-selects these profiles from detected intent when no caller profile is supplied (`memory-context.ts:1595-1607`). Progressive disclosure already adds a rule-based summary/snippet/cursor layer with its own flag (`progressive-disclosure.ts:4-12`, `memory-search.ts:1294-1308`).

Implication: active LLM packaging should not ship merely because it is more flexible. Its quality bar should be a held-out eval that compares:

- deterministic full response,
- deterministic `research`/`resume` profile,
- deterministic progressive disclosure,
- LLM curated package in shadow mode.

Primary metrics should include task success, cited-source correctness, missed-critical-context rate, token count, latency, and nondeterministic variance across repeated runs. This is a Phase 005 eval-harness candidate, not a free-standing rollout.

### F-iter007-004 - Causal context is already intent-aware, but it is still row-level; packaging can add chain-level structure

Verdict: ADAPT_AS_CHAIN_AWARE_PRESENTATION. LOC estimate: ~70-130 production LOC for causal-chain extraction and package schema fields, plus ~60-100 tests.

Evidence: `causal-boost` already maps task intent to edge priority orderings (`causal-boost.ts:52-76`), computes intent-aware traversal scores (`causal-boost.ts:518-536`, `causal-boost.ts:566-607`), injects graph-discovered neighbors (`causal-boost.ts:647-673`), and exposes graph-context metadata with related IDs and edge types (`causal-boost.ts:680-784`). The formatter can attach graph evidence per result when present (`search-results.ts:890-916`).

Implication: the strongest LLM-curation use case is not "make ranking smarter"; it is "turn causal row evidence into a coherent context package." The package schema should explicitly support:

- `causalChain`: ordered selected result IDs and relation labels.
- `tierExemplars`: one or more representatives per importance/memory-state tier.
- `directEvidence`: high-confidence rows to read first.
- `supportingContext`: rows useful after direct evidence.
- `omittedButAvailable`: important skipped rows with reasons.

That matches the proposed "first N from causal chain, then 1 exemplar per tier" shape without erasing the deterministic ranking evidence.

### F-iter007-005 - Cache and fail-open patterns already exist, but the curation key must include candidate identity

Verdict: ADAPT_WITH_CACHE_REUSE. LOC estimate: ~35-70 production LOC if extending `llm-cache` mode, or ~70-110 LOC for a dedicated curator cache; ~40-80 tests.

Evidence: The existing LLM cache is a TTL in-process singleton, defaulting to one hour and 500 entries (`llm-cache.ts:4-15`, `llm-cache.ts:39-41`, `llm-cache.ts:58-127`). LLM reformulation builds a normalized query/mode cache key, returns cache hits without an LLM call, calls the LLM once on miss, caches valid results, and returns fallback on disable/failure (`llm-reformulation.ts:321-338`, `llm-reformulation.ts:348-371`). `memory_search` also has a tool-level cache keyed from query args and causal-edge generation (`memory-search.ts:900-938`).

Implication: same-intent same-candidate-set caching is feasible, but the current `LlmCacheKey` only supports `mode: 'reformulation' | 'hyde'` and query text (`llm-cache.ts:21-27`). Add either:

- `mode: 'context_curation'` plus `candidateSetHash`, `intent`, `profile`, `version`, and `packagePolicy`, or
- a dedicated `context-curation-cache.ts` with the same TTL/LRU pattern.

Candidate-set hashing should use ordered IDs plus score/provenance version, not raw content, so cache keys stay small and stable. Cache hits must still pass the deterministic fallback validator.

### F-iter007-006 - Active rollout should be default-off because nondeterminism affects retrieval trust

Verdict: ADAPT_SHADOW_FIRST. LOC estimate: ~90-160 production LOC for flags, schema validation, timeout, fallback, and telemetry; ~80-140 tests.

Evidence: Existing LLM search features already treat LLM calls as optional, budgeted, cached, and fail-open (`stage1-candidate-gen.ts:1140-1149`, `stage1-candidate-gen.ts:1221-1224`). `memory_search` records final result IDs and scores for eval logging (`memory-search.ts:1493-1527`) and logs search-shown/result-cited feedback in shadow paths (`memory-search.ts:1529-1598`). XCE's claimed benefit comes from a context call that combines search, architecture context, relationships, and traceability, but that README is a product claim, not direct evidence that LLM packaging improves this memory backend (`external/README.md:22-27`, `external/README.md:188-199`, `external/README.md:240-245`).

Implication: ship in this order:

1. `SPECKIT_CONTEXT_CURATOR=false` default.
2. `SPECKIT_CONTEXT_CURATOR_MODE=shadow|active`, shadow first.
3. Hard timeout, e.g. 1500-2500 ms, with deterministic fallback.
4. Strict JSON schema: selected IDs must exist in candidate set; no invented file paths or facts.
5. Telemetry: cache hit/miss, timeout, parse failure, selected IDs, omitted high-rank IDs, token/cost estimate, eval outcome.
6. Active mode only after Phase 005 held-out tasks show lift over deterministic profiles.

## Questions Answered

- Can `memory_context` assembly become LLM-curated? Yes, but as an optional post-retrieval packaging stage, not as a replacement for deterministic retrieval or scoring.
- Should it be default-on? No. The added latency, cost, and nondeterminism affect a hot retrieval path, so default-off and shadow-first are the right rollout.
- Where should it hook in? After deterministic retrieval/canonical filtering/goal refinement and before `formatSearchResults` or profile formatting, but only after adding a split between retrieval candidate budget and presentation limit.
- Should it use top-2K candidates immediately? No. The current `limit` path prevents that, and 2K is probably too large for a first active design. Start with bounded overfetch, measure, then raise if eval shows benefit.
- What should the LLM return? A package plan over existing IDs: causal chain IDs, tier exemplars, direct/supporting/omitted buckets, rationale labels, and confidence/risk notes. It must not invent content or mutate scores.
- Can existing cache infrastructure help? Yes. Reuse or extend `llm-cache`/tool-cache patterns, but key by intent plus candidate-set hash, not query text alone.
- Dependencies? Requires the shipped 4-stage pipeline. Depends strongly on Phase 005 eval harness for active rollout. Optional dependency on RQ-B1, because semantic trigger matching can improve the upstream candidate set but is not required for curation.
- LOC estimate? Approximately ~290-485 production LOC plus ~220-390 tests: integration seam/budget split (~95-165), curator prompt/schema/parser (~100-170), cache (~35-110), flags/timeout/telemetry/fallback (~90-160). Documentation/eval fixtures may add ~40-80.
- Verdict? ADAPT as opt-in/shadow LLM curation; DEFER active mode until eval proves lift.

## Questions Remaining

- What held-out task set should represent memory-context quality: resume tasks, implementation planning tasks, debugging tasks, or mixed?
- What is the first active candidate budget: 50, 100, 300, or 2K?
- Should the curator package be a new `profile: "curated"` or a separate `curation` option that can compose with existing profiles?
- Should active curation ever reorder the visible `data.results`, or should it only add `data.curatedContext` beside deterministic results?
- Which model/provider is acceptable for the "small LLM" path under local/offline and CI constraints?

## Next Focus

RQ-B3 - Session-trace bounded causal-edge inference. Investigate whether session traces can infer new causal edges under existing NFR-R01 caps, strength ceilings, and audit constraints.
