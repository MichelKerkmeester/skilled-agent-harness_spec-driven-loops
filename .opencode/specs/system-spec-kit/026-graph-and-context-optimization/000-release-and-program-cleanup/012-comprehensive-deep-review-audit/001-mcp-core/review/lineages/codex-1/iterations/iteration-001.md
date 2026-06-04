# Iteration 001 - Correctness

Focus: mutation hooks, update/delete cache invalidation, and embedding reconcile dry-run/apply parity.

## Findings

### F001 - P1 - `memory_update` and `memory_delete` leave entity-density cache stale

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:244`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:136`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159`

`runPostMutationHooks()` clears trigger matcher, tool, constitutional, graph-signal, degree, and coactivation caches, then returns a result object with those lanes only. `memory_update` and `memory_delete` call that hook after successful mutations, but neither calls `invalidateEntityDensityCache()`. The entity-density score uses cached high-degree memory title/trigger tokens, so update/delete can leave routing decisions stale until the 60s TTL expires.

Bulk delete is not affected because it imports and calls the entity-density invalidation helper directly after commit.

Claim adjudication:

```json
{
  "findingId": "F001",
  "claim": "memory_update and memory_delete mutate fields used by entity-density routing or remove contributing rows, but their post-mutation hook does not invalidate the entity-density cache.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:244",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:136",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159"
  ],
  "counterevidenceSought": "Checked direct invalidation imports/calls in update/delete/bulk-delete/save, mutation hook result fields, mutation hook tests, and entity-density commit hook tests.",
  "alternativeExplanation": "The 60s TTL eventually refreshes the cache, so this is not permanent corruption; however the routing signal can be stale immediately after confirmed mutations.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if update/delete invoke invalidateEntityDensityCache directly or runPostMutationHooks grows an entity-density invalidation lane covered by tests."
}
```

### F002 - P1 - Reconcile dry-run undercounts success-coverage repairs

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:356`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:84`

`computeSuccessCoverage()` counts `success` rows only when the row is missing from `active_vec.vec_memories_rowids`. Dry-run uses that value for the planned `repair_success_missing_active_vector_to_retry` count. Apply mode, when `repairSuccessCoverage` is true, updates `success` rows when either the rowid marker is missing or the active dimension-table row is missing. A `success` row with `vec_memories_rowids` present but `vec_<dim>` absent is therefore repaired by apply but not counted by dry-run.

The test fixture includes exactly that dim-only missing row and labels it as covered by rowids, which explains why current tests do not catch the dry-run/apply mismatch.

Claim adjudication:

```json
{
  "findingId": "F002",
  "claim": "Dry-run planned success-coverage repair counts only missing rowid rows, while apply repairs rows missing either the rowid marker or the active dimension vector.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281",
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361",
    ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409",
    ".opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:84"
  ],
  "counterevidenceSought": "Checked computeBuckets for OR parity, plannedMutations construction, apply repair SQL, and vector coverage tests for dim-only missing rows.",
  "alternativeExplanation": "The rowids table may be treated as the canonical vector-presence source for diagnostics, but the apply SQL explicitly treats dimension-table absence as repairable too.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if dry-run coverage is changed to match apply or the apply repair intentionally narrows to rowid-only absence."
}
```

## Coverage Notes

- Save and bulk-delete cache invalidation were checked and did not reproduce F001.
- Reconcile active-shard verification and dimension-table validation were checked before recording F002.

Review verdict: CONDITIONAL
