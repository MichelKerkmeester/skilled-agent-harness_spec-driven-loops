# Iteration 3: Memory-Correctness Real Impact and Reproducibility

## Focus
Assess whether entity-density cache staleness and atomic-save ordering can affect normal single-user retrieval or graph-channel routing.

## Findings

1. Entity-density is a process-local token cache used by the query router to activate the graph channel for entity-rich short queries [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4]. It refreshes lazily on a 60-second TTL or by explicit invalidation [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:8].

2. The cache is built from `memory_index.title` and `memory_index.trigger_phrases` joined to high-degree causal sources [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:80]. `memory_update` can change title or trigger phrases [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91], then calls `runPostMutationHooks('update', ...)` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306].

3. The generic mutation hooks clear trigger, tool, constitutional, graph-signal, degree, and co-activation caches [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20], but they do not call `invalidateEntityDensityCache`. Direct search found explicit entity-density invalidation in save, bulk-delete, vector-index delete paths, and causal relation backfill, not in the generic update/delete hook [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:13] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:22].

4. `memory_delete` similarly runs post-mutation hooks after deletes [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:248], but the hook path omits entity-density invalidation. That makes stale positive or stale negative graph-channel triggers plausible until TTL or another invalidating mutation.

5. Atomic save writes the pending file, calls `indexPrepared`, then promotes the pending file to the final path [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360]. `indexPrepared` delegates into `processPreparedMemory`, whose transaction creates the memory row before promotion [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2534]. If promotion fails after successful indexing, the database can point at content that was never durably promoted.

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `001-mcp-core/review/deep-review-findings-registry.json`

## Assessment
newInfoRatio: 0.52

Novelty justification: the iteration converted known P1s into concrete runtime impact and reproducibility boundaries.

Confidence: high that the stale-cache window exists; high that atomic ordering permits DB/file divergence on promotion failure; medium on frequency because no runtime test was executed in this read-only lineage.

## Reflection
Worked: reading the exact invalidation sites clarified blast radius and boundedness.

Failed: direct reproduction was not run because the charter is read-only and this lineage must not mutate outside its artifact directory.

Ruled out: "single-user means no impact." The stale-cache and promotion-order cases are ordinary local operational failures, not only adversarial races.

## Recommended Next Focus
Security severity calibration under the local MCP threat model.
