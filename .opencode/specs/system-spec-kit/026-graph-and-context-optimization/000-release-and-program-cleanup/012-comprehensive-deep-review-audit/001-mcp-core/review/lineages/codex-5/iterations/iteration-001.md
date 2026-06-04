# Iteration 001 - Correctness

Focus: mutation cache freshness and reconcile dry-run/apply predicate parity.

## Findings

### F001 - P1 - memory_update leaves entity-density routing cache stale after title or trigger phrase changes
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:81`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97`

`memory_update` accepts `title` and `triggerPhrases`, and `update_memory()` writes those values into `memory_index`. The entity-density cache is built from `memory_index.title` and `trigger_phrases`, but the update path clears only the general search cache and then runs post-mutation hooks that do not call `invalidateEntityDensityCache()`. Queries can therefore continue using stale entity-density routing data until the 60s TTL expires.

Concrete fix: add entity-density invalidation to successful update mutations that touch `title` or `trigger_phrases`, preferably by expanding `runPostMutationHooks()` so save/update/delete/bulk-delete share the same cache contract.

Claim adjudication:
- findingId: F001
- claim: memory_update can leave entity-density stale after title or trigger phrase changes.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:81`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159`, `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97`
- counterevidenceSought: delete helpers and bulk-delete/save invalidation call sites; delete paths already invalidate, update does not.
- alternativeExplanation: the cache TTL eventually self-heals, but the mutation freshness contract requires immediate invalidation for routing correctness.
- finalSeverity: P1
- confidence: 0.88
- downgradeTrigger: downgrade if update stops mutating title/trigger phrases or post-mutation hooks clear entity-density before release.

### F002 - P1 - memory_embedding_reconcile dry-run under-reports success-coverage repairs for rows missing only the active dimension vector
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:356`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:82`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:87`

`computeSuccessCoverage()` counts only `success` rows missing `active_vec.vec_memories_rowids`. When `repairSuccessCoverage` is enabled, apply resets `success` rows missing either `vec_memories_rowids` or the active `vec_<dim>` table row. A dry-run can therefore report fewer planned `repair_success_missing_active_vector_to_retry` rows than apply actually mutates. The existing vector-coverage test even labels a row with rowid present and dimension row absent as "covered by rowids", which preserves the mismatch.

Concrete fix: make `computeSuccessCoverage()` use the same OR predicate as the apply repair SQL and add a dim-only missing regression.

Claim adjudication:
- findingId: F002
- claim: dry-run success-coverage repair counts can be lower than apply mutations for dim-only missing success rows.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:356`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409`, `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:82`
- counterevidenceSought: retry-eligible missing-vector buckets; those already use the OR predicate.
- alternativeExplanation: rowids may have been intended as the only success-coverage source, but apply treats dimension-table absence as repairable too.
- finalSeverity: P1
- confidence: 0.92
- downgradeTrigger: downgrade if success coverage intentionally ignores dim-only gaps and apply is changed to match.

## Coverage Notes
- Single delete stale-cache concern was checked and not carried forward because the lower-level delete helper invalidates entity-density after successful deletion.
- Save and bulk-delete invalidation were checked as counterevidence; the gap is update-specific.

Review verdict: CONDITIONAL
