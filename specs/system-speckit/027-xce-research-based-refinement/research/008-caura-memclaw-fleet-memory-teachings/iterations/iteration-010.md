# Iteration 010 — performance: latency + token-efficiency

**Status:** insight · **Findings:** 5 · **newInfoRatio:** 0.84 · **tokens:** 107648 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Mechanism
Token-efficiency techniques:

- MemClaw’s core token-efficiency claim is recall-by-slice, not full transcript replay: “recall returns the relevant slice, not the full transcript,” with 96-98% token savings versus full context. Evidence: `docs/performance.md:23-31`, `README.md:283-289`.
- Result count is tightly bounded at the API schema: `SearchRequest.top_k` defaults to 5 and is capped at 20. Evidence: `core-api/src/core_api/constants.py:124-126`, `core-api/src/core_api/schemas.py:303-319`.
- Search overfetches internally, then trims to the requested `top_k` after similarity filtering, preserving quality without expanding the returned payload. Evidence: `core-api/src/core_api/constants.py:468-479`, `core-api/src/core_api/pipeline/steps/search/execute_scored_search.py:52-63`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:20-40`.
- LLM brief generation uses a narrower prompt representation than the raw API result: only `type`, optional `title`, optional non-active `status`, and dated `content` are exposed to the summarizer. Evidence: `core-api/src/core_api/services/recall_service.py:44-65`.
- The summary itself is capped at 1000 output tokens. Evidence: `core-api/src/core_api/constants.py:477-479`, `core-api/src/core_api/services/recall_service.py:174-179`.
- Important caveat: `memclaw_recall` always returns full `results`; `include_brief=true` adds a brief rather than replacing the result list. Evidence: `core-api/src/core_api/mcp_server.py:452-576`.
- Important caveat: raw `MemoryOut` includes full `content`, `metadata`, timestamps, lifecycle fields, entity links, similarity, recall tracking, and contradiction fields. Evidence: `core-api/src/core_api/schemas.py:221-257`, `core-api/src/core_api/services/memory_service.py:188-227`.

Latency techniques:

- Published latency is explicitly warm-cache/fleet-shaped: 23ms p50 / 27ms p95 search, with docs warning that cold-cache p50 is higher and the optimizer assumes warm pgvector cache. Evidence: `docs/performance.md:7-11`, `docs/performance.md:27-31`, `docs/performance.md:60-66`.
- Query embeddings are cached by normalized query plus model, vector dimension, instruction, and tenant; concurrent cold misses share a per-process in-flight future. Evidence: `core-api/src/core_api/services/memory_service.py:2594-2707`.
- Redis is used as the cache backend when configured, with graceful miss/fallback behavior. Evidence: `core-api/src/core_api/cache.py:1-65`, `core-api/src/core_api/config.py:101-101`.
- Embedding and entity/graph boost run concurrently; entity boost can degrade to vector-only search without cancelling a completed embedding. Evidence: `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:141-214`.
- Search uses GIN full-text indexes and HNSW vector indexes. Evidence: `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:68-90`, `core-storage-api/src/core_storage_api/database/migrations/versions/012_vector_dim_1024.py:210-228`.
- Storage-side scoring blends vector similarity, FTS, freshness, recall boost, temporal/date boosts, status penalty, and entity boost in one ranked query. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:885-1118`.
- Fleet latency protection includes per-tenant route/storage bulkheads, request timeouts, and managed-platform rate limits. Evidence: `core-api/src/core_api/middleware/per_tenant_concurrency.py:1-28`, `core-api/src/core_api/middleware/request_timeout.py:1-14`, `README.md:693-705`.

## Teachings for Spec Kit Memory
- **Claim** · Prefer summary/slice-first recall outputs over full artifact dumps when a tool has an explicit token budget. **Evidence** · MemClaw frames token efficiency as returning the relevant slice rather than full transcript, and measures tokens sent to the answering LLM. `docs/performance.md:23-31`. **Maps-to** · new sub-packet: token-budgeted recall output shaping for Spec Kit Memory MCP tools. **Verdict** · ADAPT. **Risk** · Over-trimming can remove the evidence needed for coding decisions. **Confidence** · High. **Why it transfers (or not)** · Spec Kit Memory is local, so latency matters less, but every returned token competes directly with the agent’s context budget.

- **Claim** · Keep internal overfetch, but trim the external payload to the tool’s budgeted `top_k` or token budget after relevance filtering. **Evidence** · MemClaw overfetches by `SEARCH_OVERFETCH_FACTOR` and then trims to final `top_k`. `core-api/src/core_api/constants.py:468-479`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:37-40`. **Maps-to** · new sub-packet: budget-aware candidate overfetch and final trimming. **Verdict** · ADOPT. **Risk** · If trimming is count-based only, long hits can still exceed token budgets. **Confidence** · High. **Why it transfers (or not)** · Local search can afford extra internal candidates; only the final MCP response needs to stay small.

- **Claim** · Use field selection by output mode: compact recall should emit title/summary/snippet/evidence lines, while full content should require an explicit expanded mode. **Evidence** · MemClaw’s LLM summarizer formats only selected fields, but raw `MemoryOut` still emits full content and many metadata fields. `core-api/src/core_api/services/recall_service.py:44-65`, `core-api/src/core_api/schemas.py:221-257`. **Maps-to** · new sub-packet: compact versus expanded memory result schemas. **Verdict** · ADAPT. **Risk** · Too many modes can confuse callers unless defaults are simple. **Confidence** · High. **Why it transfers (or not)** · The selected-field prompt transfers well; MemClaw’s raw response shape is too verbose for Spec Kit’s per-tool tokenBudget design.

- **Claim** · Treat LLM summaries as a replacement option, not an additive payload, when token budget is tight. **Evidence** · MemClaw’s `include_brief` adds `brief` while still returning full `results`. `core-api/src/core_api/mcp_server.py:564-576`. **Maps-to** · new sub-packet: summary-only recall mode for `memory_match_triggers` / `memory_context` style outputs. **Verdict** · ADAPT. **Risk** · Summary-only mode may hide source nuance; include citations and allow expansion. **Confidence** · Medium-high. **Why it transfers (or not)** · The optional brief idea transfers, but additive brief-plus-full-results is not token-efficient enough for coding-agent context budgets.

- **Claim** · Reject most fleet-latency machinery for local Spec Kit Memory unless there is measured contention. **Evidence** · MemClaw’s latency docs explicitly justify warm-cache optimization at millions of recall calls/day, and per-tenant bulkheads/rate limits target noisy-neighbor fleet behavior. `docs/performance.md:23-31`, `core-api/src/core_api/middleware/per_tenant_concurrency.py:1-28`, `README.md:932-937`. **Maps-to** · 027 child `008-caura-memclaw-fleet-memory-teachings`. **Verdict** · REJECT. **Risk** · A local multi-agent setup could eventually need lightweight contention controls. **Confidence** · High. **Why it transfers (or not)** · Single-user/local usage rarely has tenant storms, distributed replicas, or DDoS pressure; token-budget shaping is the higher-value transfer.

## Negative knowledge
- Warm-cache benchmark assumptions are weak guidance for Spec Kit Memory. MemClaw publishes warm-cache p50/p95 and tells operators to validate expected concurrency because the optimizer assumes warm pgvector cache. Evidence: `docs/performance.md:31-31`, `docs/performance.md:60-66`.
- Distributed Redis query-embedding cache plus per-process stampede guards are fleet latency machinery. Useful if repeated identical queries arrive concurrently, but likely unnecessary complexity for one local coding agent. Evidence: `core-api/src/core_api/services/memory_service.py:2599-2612`, `core-api/src/core_api/services/memory_service.py:2632-2690`.
- Per-tenant route/storage bulkheads solve noisy-neighbor fleet contention, not single-user recall token pressure. Evidence: `core-api/src/core_api/middleware/per_tenant_concurrency.py:1-28`, `core-api/src/core_api/config.py:195-219`.
- Managed-platform rate limits and DDoS floors are irrelevant to local memory recall output quality. Evidence: `README.md:693-705`, `README.md:932-937`.
- Adding an LLM brief without suppressing raw results is negative knowledge for token efficiency: it improves usability but can increase payload size unless summary-only mode exists. Evidence: `core-api/src/core_api/mcp_server.py:564-576`.

## Open questions
- Should Spec Kit Memory define response profiles such as `compact`, `evidence`, and `full`, each with hard token budgets?
- Should `memory_match_triggers` return summary-only candidates by default, with a follow-up expansion tool for full context?
- What is the best citation granularity for compact memory slices: spec path only, line ranges, or extracted snippets with source anchors?
- Should internal overfetch be token-aware, not just count-aware, so one long artifact cannot dominate the budget?
- Are there measured local workloads where query-embedding caching materially helps, or should it stay out until proven?

DELTA_JSON: {"iteration":"010","focus":"performance: latency + token-efficiency","findingsCount":5,"newInfoRatio":0.84,"topVerdicts":["ADAPT: summary/slice-first recall outputs with citations and explicit expansion","REJECT: fleet warm-cache bulkheads/rate-limit machinery for local single-user memory"],"sources":["docs/performance.md:23","docs/performance.md:31","core-api/src/core_api/schemas.py:314","core-api/src/core_api/pipeline/steps/search/post_filter_results.py:37","core-api/src/core_api/services/recall_service.py:44","core-api/src/core_api/mcp_server.py:564","core-api/src/core_api/services/memory_service.py:2599","core-api/src/core_api/middleware/per_tenant_concurrency.py:1"]}
