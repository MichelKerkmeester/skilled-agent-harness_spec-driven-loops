# Iteration 2: MCP Contract Drift And Memory Correctness

## Focus

Verify the MCP contract-drift and memory-correctness clusters directly in source: tool schema fields, handler options, entity-density cache invalidation, and atomic save ordering.

## Findings

1. The `memory_embedding_reconcile` public contract has no single generated source of truth. The MCP tool schema advertises `mode: "dry-run" | "apply"` and still exposes `activeOnly`, while the Zod allowed-parameter list separately permits `activeOnly`, `missingFailureScope`, `maskedFailedPolicy`, `providerFailurePolicy`, `requireActiveShard`, and `repairSuccessCoverage`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583]

2. The handler/runtime uses `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`, but `activeOnly` is only typed and whitelisted; it is not read in the reconcile implementation. The implementation always reads and verifies the active embedder/shard after deriving `mode`, so `activeOnly` is advertised as a knob without runtime effect. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:19] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:301] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:302] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:321]

3. Operator documentation and catalog text still describe the old `dryRun:false` switch, while the handler tells operators to run `memory_embedding_reconcile({ mode: "apply" })`. This is direct evidence that docs/catalog are hand-maintained peers, not generated from the active handler/schema contract. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955] [SOURCE: file:.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:76]

4. Entity-density cache staleness has a reproducible retrieval-routing impact. The cache is built from high-degree memory titles and trigger phrases, has a 60-second TTL, and is used by the query router to preserve graph routing when enough query terms hit high-degree memories. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:8] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:21] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:112] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:247]

5. `memory_update` changes title and trigger phrases, then runs post-mutation hooks and clears the general search cache through the vector-index mutation path, but the post-mutation hooks do not invalidate entity-density and the vector-index update only calls `clear_search_cache()`. Save and bulk delete have explicit entity-density invalidators, proving the missing update invalidation is an omitted hook rather than a missing capability. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:92] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:68] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:198] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:30]

6. The entity-density staleness is reproducible without a full MCP call: the integration test seeds a high-degree memory, verifies the density score is positive, updates `trigger_phrases` directly, observes the old query still scores positive, then explicit invalidation drops the score to zero. Under normal single-user MCP operation, the same stale cache window can preserve graph routing for an old trigger or miss a new one until invalidation, TTL expiry, or restart. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:102] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:110] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:112] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:114] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:116] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:118]

7. Atomic save ordering is a narrower consistency risk. The atomic wrapper writes a pending file, calls `indexPrepared`, then promotes the pending file with `renameSync`. The save processing commits the DB transaction before file finalization paths can warn about post-commit file persistence failure. That creates a crash/failure window where a DB row exists before the final file is promoted, but successful saves continue to promote immediately after indexing. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2638] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2657] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3627]

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`

## Assessment

- `newInfoRatio`: 0.72
- Novelty justification: Direct source reads confirm two research questions: drift is caused by divergent hand-maintained contracts, and memory impact is real for entity-density routing but narrower for atomic-save ordering.
- Confidence: High for `activeOnly` being ignored and `dryRun:false` drift. High for entity-density stale-cache impact because a test demonstrates it. Medium for atomic-save blast radius because the failure requires a crash or file-persistence failure in a narrow window.

## Reflection

What worked: Direct code reads separated cosmetic documentation drift from runtime-affecting drift.

What failed: There is no single manifest that maps docs/catalog/playbook fields to runtime fields, so generator absence is inferred from separate source files and drift evidence rather than proven by a formal "no generator exists" artifact.

Ruled out: Entity-density staleness is not full memory corruption; it is stale routing signal corruption. Atomic-save ordering is not continuous corruption during successful saves; it is a crash-window inconsistency.

## Recommended Next Focus

Investigate metadata-drift systemic-ness across 026/027: graph-metadata derivation, description metadata, resource-map stale rows, changelog rollups, and completion status surfaces.
