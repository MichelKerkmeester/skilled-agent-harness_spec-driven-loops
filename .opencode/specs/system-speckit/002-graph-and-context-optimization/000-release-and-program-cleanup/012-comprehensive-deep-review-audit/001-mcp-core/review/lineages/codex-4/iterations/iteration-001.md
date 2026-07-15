# Iteration 001 - Correctness

Focus: mutation cache invalidation and reconcile dry-run/apply parity.

## Files Reviewed

| File | Coverage |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Shared post-mutation hook contract |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | `memory_update` mutation flow |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | Underlying update/delete storage behavior |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | Cached graph-channel preservation signal |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | Reconcile buckets, coverage, and apply SQL |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts` | Current coverage expectations |

## Findings

### F001 - P1 - memory_update leaves entity-density cache stale after title or trigger phrase changes

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:92`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:494`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:81`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:96`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:112`

`memory_update` accepts `title` and `triggerPhrases`, then calls `vectorIndex.updateMemory(...)` and the shared post-mutation hook. The entity-density cache is built from `memory_index.title` and `memory_index.trigger_phrases`, but `update_memory` only clears the generic search cache after updating those fields. `runPostMutationHooks` also clears trigger, tool, constitutional, graph-signal, degree, and coactivation caches, but not entity-density.

The impact is bounded by the 60s entity-density TTL, but during that window graph-channel routing can be based on pre-update terms. This is release-relevant because the target slice explicitly covers memory mutation freshness and graph-channel routing.

Fix: call `invalidateEntityDensityCache()` after successful update mutations. The cleaner shape is to add it to `runPostMutationHooks` and expand `MutationHookResult`/feedback so all write handlers share one invalidation contract.

Claim adjudication:

| Field | Value |
|---|---|
| findingId | F001 |
| claim | `memory_update` can leave entity-density cache stale after changing title or trigger phrases. |
| evidenceRefs | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:112` |
| counterevidenceSought | Checked save, delete, bulk-delete, update storage helper, shared mutation hooks, and entity-density tests. Delete and bulk-delete have direct invalidation paths; update does not. |
| alternativeExplanation | Generic search-cache clearing could look sufficient, but entity-density has independent module state and an explicit invalidation API. |
| finalSeverity | P1 |
| confidence | 0.88 |
| downgradeTrigger | Downgrade if update storage or shared mutation hooks are patched to invalidate entity-density after fields used by `buildIndex`. |

### F002 - P1 - repairSuccessCoverage dry-run undercounts success rows missing only the active dimension vector

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:285`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:417`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:420`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:84`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:89`

`computeSuccessCoverage()` reports success rows missing the rowid marker only. The apply repair path for `repairSuccessCoverage` resets success rows missing either `vec_memories_rowids` or the active `vec_<dim>` row. That means dry-run `plannedMutations` can say fewer rows will be repaired than apply actually mutates.

The existing vector-coverage test codifies the same drift: row 3 has `vec_memories_rowids` but lacks `vec_768`, and the test still expects only two missing rows. The module header says both active vector surfaces are required, and the apply SQL follows that stricter model.

Fix: make `computeSuccessCoverage()` use the same OR predicate as the repair SQL, then add a regression where a `success` row is rowid-present and dimension-missing.

Claim adjudication:

| Field | Value |
|---|---|
| findingId | F002 |
| claim | Dry-run under-reports `repairSuccessCoverage` rows when the rowid surface exists but the active dimension vector row is absent. |
| evidenceRefs | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:417`; `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:84` |
| counterevidenceSought | Checked missing-vector buckets and apply SQL for the intended predicate; those paths already use either-surface-missing logic. |
| alternativeExplanation | Rowid could be intended as the single canonical vector presence marker, but apply repair and the file header require both surfaces. |
| finalSeverity | P1 |
| confidence | 0.90 |
| downgradeTrigger | Downgrade if a schema invariant proves rowid-present/dimension-missing success rows cannot exist. |

## Ruled Out

- `memory_delete` is not the same bug as F001 in the current code: `vectorIndex.deleteMemory()` routes to `delete_memory_from_database()`, which calls `invalidateEntityDensityCache()` after a successful delete.
- `memory_bulk_delete` also has explicit handler-level invalidation after a real delete.
- `memory_save` invalidates after the main save and again after background enrichment.

Review verdict: CONDITIONAL
