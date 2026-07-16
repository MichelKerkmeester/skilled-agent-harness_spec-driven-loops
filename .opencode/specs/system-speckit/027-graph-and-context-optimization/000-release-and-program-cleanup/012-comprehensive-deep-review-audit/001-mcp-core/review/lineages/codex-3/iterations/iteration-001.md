# Iteration 001 - Correctness

## Focus

Correctness pass over the mutation hook path, update/delete/bulk-delete invalidation behavior, entity-density cache ownership, and embedding reconcile dry-run/apply parity.

## Findings

### F001 - P1 - memory_update leaves entity-density cache stale after title or trigger phrase changes

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91] `memory_update` accepts title changes.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:92] `memory_update` accepts trigger phrase changes.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306] The handler runs the shared post-mutation hook after the DB update.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:4] The shared hook imports trigger matcher, tool cache, constitutional cache, graph signal cache, coactivation cache, and degree cache helpers, but not entity-density invalidation.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97] The hook result contract returns those cache outcomes only.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:9] Entity-density refresh is lazy on a 60s TTL unless `invalidateEntityDensityCache()` is called.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619] The lower-level update path clears the generic search cache, not the entity-density cache.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:112] The integration test demonstrates a raw trigger-phrase update leaves the warm entity-density result stale until explicit invalidation.

Impact: updating a high-degree memory's title or trigger phrases can leave graph-channel preservation routing on old tokens, or miss new tokens, for up to the TTL. Save and bulk-delete paths invalidate explicitly; update does not.

Concrete fix: wire `invalidateEntityDensityCache()` into the shared post-mutation hook or into the `memory_update` success path, extend `MutationHookResult` and feedback fields if the hook owns it, and add a regression proving `memory_update({ triggerPhrases })` refreshes entity-density without waiting for TTL.

Claim adjudication packet:

- findingId: F001
- claim: `memory_update` can mutate fields consumed by entity-density scoring without invalidating the entity-density cache.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306`, `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:4`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:9`
- counterevidenceSought: checked `memory_delete`, `memory_bulk_delete`, `memory_save`, and `vector-index-mutations.ts`; delete and bulk-delete have invalidation, update does not.
- alternativeExplanation: generic search-cache invalidation might be intended to cover all routing caches, but entity-density is a separate module-level cache with its own invalidator.
- finalSeverity: P1
- confidence: 0.86
- downgradeTrigger: downgrade to P2 only if entity-density routing is documented as allowed to remain stale for the full TTL after metadata updates.

### F002 - P1 - success-coverage dry-run undercounts rows missing only the active dimension vector

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281] `computeSuccessCoverage()` receives the dimension table name but does not use it.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:285] Dry-run coverage counts only missing `vec_memories_rowids` rows.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361] `repairSuccessCoverage` reports planned repair rows from that coverage count.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409] Apply mode enters the repair branch.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:419] Apply mode repairs success rows missing the rowid surface or the active dimension-table vector.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:83] The test fixture includes a success row missing the dimension vector.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:89] The test expects the dry-run count to exclude that dimension-only missing row.

Impact: an operator running dry-run with `repairSuccessCoverage: true` can see fewer planned mutations than apply will perform. The safety promise of a dry-run preview is weaker exactly on the success-coverage repair path.

Concrete fix: make `computeSuccessCoverage()` use the same rowid-or-dimension missing predicate as the apply repair update. Update the Vitest fixture so the rowid-present/dimension-missing success row is counted in dry-run and repaired in apply.

Claim adjudication packet:

- findingId: F002
- claim: dry-run planned success-coverage repair count can be lower than the apply mutation count.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:419`, `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:83`
- counterevidenceSought: checked the apply repair branch and the coverage test; apply uses an OR predicate and the test excludes dimension-only missing rows from dry-run coverage.
- alternativeExplanation: maintainers might consider `vec_memories_rowids` the authoritative coverage surface, but apply mode already treats a missing dimension table vector as repair-worthy.
- finalSeverity: P1
- confidence: 0.91
- downgradeTrigger: downgrade only if apply is changed not to repair dimension-only missing success rows.

## Clean Checks

- `memory_delete` was not carried as an active stale-cache finding because `vectorIndex.deleteMemory()` delegates to `delete_memory_from_database()`, which invalidates entity-density after successful deletes.
- `memory_bulk_delete` explicitly invalidates entity-density after no-op and successful delete paths.
- `memory_save` invalidates after save and after background enrichment completion.

Review verdict: CONDITIONAL
