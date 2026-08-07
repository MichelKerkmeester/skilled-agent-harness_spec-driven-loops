# Iteration 1 (DeepSeek lineage): Mem0 — extraction / fusion / scoring

> Model: **DeepSeek v4 Pro** (`deepseek/deepseek-v4-pro --variant high`), read-only opencode seat; orchestrator-written. newInfoRatio 0.9, 5 findings.

## Focus
Mine Mem0's memory pipeline — fact extraction, ADD/UPDATE/DELETE/NOOP merge logic, retrieval scoring, dedupe/consolidation — for techniques that improve the Memory MCP, novelty-tagged vs already-mined prior art (aionforge/galadriel [028], OpenLTM/memclaw [027]).

## Actions
Seat read `external/mem0/{memory/main.py, utils/scoring.py, utils/entity_extraction.py, configs/prompts.py}` and cross-referenced internal `mcp_server/lib/search/hybrid-search.ts`, `lib/eval/bm25-baseline.ts`.

## Findings (5)
1. **M0-entity-store-boost** (NET-NEW, H/M) — separate entity vector index (proper names, quoted text, noun compounds) with many-to-many memory links; at search time matched entities boost linked memories by similarity × count-penalty. Evidence: `mem0/memory/main.py:_compute_entity_boosts() L1577-1657` + `utils/entity_extraction.py:extract_entities() L123-144`. Maps-to: `lib/search/hybrid-search.ts` (fusion/scoring) + our existing entity-extractor (no separate entity index today).
2. **M0-adaptive-additive-fusion** (NET-NEW, M/M) — additive `(semantic+bm25+entity_boost)/max_possible` with a channel-gated adaptive divisor (1.0/2.0/2.5) + a semantic threshold gate BEFORE combining; an alternative to uniform RRF. Evidence: `mem0/utils/scoring.py:score_and_rank() L60-138` (gate L111, divisor L97-101). Maps-to: `hybrid-search.ts:544-672` `fuseResultsMulti`.
3. **M0-bm25-sigmoid-calibration** (EXTENDS aionforge, M/L) — BM25 sigmoid normalization params (midpoint, steepness) chosen from a query-term-count lookup (short→steeper/lower, long→flatter/higher). Evidence: `mem0/utils/scoring.py:get_bm25_params() L16-40`, `normalize_bm25() L43-54`. Maps-to: BM25 channel calibration pre-fusion.
4. **M0-entity-cardinality-penalty** (NET-NEW, M/L) — quadratic penalty on high-cardinality link nodes: `weight = 1/(1 + 0.001*(numLinked-1)^2)` so e.g. "AI" can't dominate. Evidence: `mem0/memory/main.py L1645-1647`. Maps-to: `hybrid-search.ts` degree-boost channel.
5. **M0-llm-memory-linking** (EXTENDS memclaw, M/H) — extraction prompt emits `linked_memory_ids` per fact, building an implicit relationship graph at write time (vs our post-hoc explicit `memory_causal_link`). Evidence: `mem0/configs/prompts.py:ADDITIVE_EXTRACTION_PROMPT L692-701` + Example 10 L843-858. Maps-to: `handlers/causal-graph.ts` / `causal-links-processor.ts`.

## Next Focus
Graphiti bi-temporal invalidation (MiMo lineage) + Letta memory tiers (Kimi) + Cognee ECL (Opus). Then deeper Mem0 update-merge logic (DeepSeek iter 2).
