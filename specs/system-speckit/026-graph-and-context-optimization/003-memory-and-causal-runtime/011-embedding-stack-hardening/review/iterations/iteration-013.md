# Deep Review Iteration 013

## Dimension
cache + reindex + router deep: eviction-vs-store ordering, partial-chunk failure, and profile-key/profile-dimension drift.

## Files Reviewed
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:162
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:198
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:371
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:452
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:473
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:426
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:432
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:437
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:446
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:472
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:161
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:169
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:212
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:262
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:264
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:265
- .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:271
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:654
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:671
- .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:682
- .opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts:82
- .opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts:116
- .opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts:168
- .opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache-byte-bounded.vitest.ts:93
- .opencode/skills/system-spec-kit/mcp_server/tests/canonical-vector-shard.vitest.ts:219
- .opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts:83

## Findings by Severity

### P0
None.

### P1

#### DR-013-P1-001 [P1] Factory-backed adapter cache ignores dimensions, so same provider/model profile swaps can reuse the wrong embedding dimension
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:264
- Evidence: getEmbedderAdapter accepts a dimensionsOverride at execution-router.ts:262 and resolves it at execution-router.ts:265, but the direct adapter cache key is only provider:model at execution-router.ts:264. If a cached adapter already exists, execution-router.ts:269-272 returns it without checking the new dimension. The factory-backed adapter captures dimensions at construction time via execution-router.ts:161-184, including the dim passed into createEmbeddingsProvider at execution-router.ts:169. Query generation then derives a profileKey from the active model/dimension at vector-index-queries.ts:654, asks the router for that dimension at vector-index-queries.ts:671, and stores returned vectors under that profile key at vector-index-queries.ts:682-688.
- Claim: Dimension is part of the embedding profile and cache identity, but the router cache omits it. A same provider/model profile swap with a different dimension can keep using the old provider instance while the caller believes it is using the new dimension.
- Counterevidence sought: Checked router tests for dimension resolution, provider/model rotation, batching, and ready exposure. They assert keys such as openai:model-a and voyage:model-b, but do not cover two getEmbedderAdapter calls with the same provider/model and different dimensions. Cache lookup/storage includes profile_key and dimensions, which protects stored rows after the fact, but does not force a dimension-correct provider to be constructed.
- Alternative explanation: Production might never request the same provider/model at two dimensions without clearing router state. That boundary is not enforced: getEmbedderAdapter publicly accepts dimensionsOverride, active profiles include dimension, and query callers build profile keys from active dimension before calling the router.
- Final severity: P1
- Confidence: 0.84
- Downgrade trigger: Downgrade if all production callers prove same provider/model cannot be requested with different dimensions in one process, or if profile activation always calls clearEmbedderExecutionRouterState before any same-model dimension change.
- Finding class: cross-consumer
- Scope proof: rg for getEmbedderAdapter shows reindex and query callers pass dimensions, while execution-router tests cover provider/model rotation but not dimension-only rotation.
- Affected surface hints: ["execution router", "query embedding", "provider profile cache", "embedding cache profile keys"]
- Recommendation: Include the resolved dimension in activeAdapterKey/directAdapters keys, or clear router state on any active profile dimension change. Add a regression test that calls getEmbedderAdapter for the same provider/model with two dimensions and asserts a new provider is constructed.

### P2
None.

## Traceability Checks
- spec_code: partial. Router/cache/reindex behavior was traced to committed implementation lines and tests.
- checklist_evidence: partial. Existing tests cover cache budgets and router chunking, but not same provider/model dimension rotation.
- feature_catalog_code: partial. The embedding profile contract treats dimension as part of identity, but the execution-router cache does not.
- skill_agent: not_applicable.
- agent_cross_runtime: not_applicable.
- playbook_capability: not_applicable.

## Ruled Out
- Cache eviction-vs-store ordering: store writes scoped rows then enforces global/profile/query/entry budgets; direct tests cover global, per-profile, query, and shrink_memory paths.
- Cache profile migration: main legacy migration backfills active profile metadata; shard migration preserves existing profile_key/input_kind and defaults legacy rows intentionally.
- Reindex partial chunk completion: cardinality mismatch throws before writes, processed advances only after both main and shard writes, and active embedder/status completion happen after normal loop completion.
- Router count+byte chunking: chunk assembly respects max count and byte budget, rejects null batch rows, and has tests for count split, byte split, and order preservation.

## Verdict
CONDITIONAL. One new P1 profile-dimension isolation finding was found; no new P0s.

## Next Dimension
Continue line-level adversarial review on remaining non-WAL P1 clusters, especially profile activation and provider singleton invalidation paths.

Review verdict: CONDITIONAL
