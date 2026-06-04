# Iteration 048: Statediff Write-Path Reconciliation

## Focus
Revalidated prior finding 006 against current save, scan/index, bulk-delete, mutation-hook, and entity-density cache invalidation paths. The selected interpretation is to identify must-add or must-keep files for a typed action-batch statediff model, not to design the full implementation.

## Findings
1. Entity-density invalidation is still manually wired in save and bulk-delete: `memory-save.ts` defines `invalidateEntityDensityCacheAfterSave()` and calls it after post-insert enrichment, while `memory-bulk-delete.ts` defines `invalidateEntityDensityCacheAfterBulkDelete()` and calls it both for no-op deletes and after successful bulk delete. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:197] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:30] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:258]
2. The entity-density cache itself is a graph-derived subscriber candidate: it indexes memory rows with at least three outgoing `causal_edges`, refreshes lazily on a 60s TTL, and exposes explicit invalidation for mutation entry points. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:9] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:80] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159]
3. Scan stale deletion still has a separate reconciliation branch: `deleteStaleIndexedRecords()` delegates to `deleteIndexedRecordIds()`, which directly deletes `memory_index` rows and records history; scan then runs generic post-mutation hooks only after stale deletes/orphan sweeps. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:456] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:470] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:496] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:527] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:563] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:922]
4. The current shared hook bundle is operation-level, not action-level: it clears trigger, tool, constitutional, graph/degree, and coactivation caches regardless of the exact row/action target. This confirms statediff must either replace or wrap `mutation-hooks.ts` with typed subscribers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:29] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:43] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:56] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:70] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:85]
5. Prior finding 006 is still valid and should retain/add these files: create `lib/storage/statediff.ts`; modify `handlers/memory-index.ts`, `handlers/memory-save.ts`, `handlers/memory-bulk-delete.ts`, `handlers/mutation-hooks.ts`, `hooks/mutation-feedback.ts`, and `lib/storage/causal-edges.ts`; create target-sink files for memory index, embedding, lexical rows, graph edges, and cache notifications. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:156] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:157] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:158] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:159] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:160] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:161] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:162] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:163]
6. A must-add clarification is that `lib/search/entity-density.ts` itself should be listed as a modified/adapter file or explicitly wrapped by a cache-notification target sink, because the spec currently names the handlers and subscriber behavior but not the cache module file. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:153] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:138] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:141]

## Ruled Out
- Ruled out treating existing `runPostMutationHooks('scan')` as the statediff subscriber model: it takes an operation/context object, not a typed target/action batch. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:527] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20]
- Ruled out leaving `memory-bulk-delete.ts` outside scope because current code contains two explicit entity-density invalidation call sites there. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:258]

## Dead Ends
- Looking only at `memory-save.ts` undercounts the reconciliation problem; scan stale deletes and no-op/success bulk-delete branches have separate cache/hook behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:559] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151]

## Edge Cases
- Ambiguous input: "must-add files" could mean additions beyond the phase spec or the complete implementation file set; this iteration reports both the spec-confirmed set and one new explicit file clarification.
- Contradictory evidence: none.
- Missing dependencies: no packet-local `resource-map.md` was present; current code and phase spec were sufficient. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-state.jsonl:1]
- Partial success: complete for code/document revalidation; no runtime statediff prototype was attempted.

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:197-207`, `:2703`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:30-41`, `:151`, `:258`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4-10`, `:78-89`, `:153-163`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:456-502`, `:527-563`, `:922-937`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-105`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/spec.md:134-163`

## Assessment
- New information ratio: 0.65
- Questions addressed: save/index/bulk-delete/mutation-hook/entity-density reconciliation paths and must-add files.
- Questions answered: prior finding 006 remains valid; explicitly add or wrap `lib/search/entity-density.ts` in the file plan.

## Reflection
- What worked and why: following cache invalidation from callers to cache module exposed which parts are operation-level versus target/action-level.
- What did not work and why: relying on line numbers in the older spec is brittle because current save invalidation line has drifted; code revalidation is necessary before implementation.
- What I would do differently: before coding, build an action-to-subscriber matrix to prevent another blanket-hook layer.

## Recommended Next Focus
For reducer promotion: update phase 006 to list `lib/search/entity-density.ts` or a named cache-notification target sink as must-add/modify, and preserve scan stale-delete safety while converting save, scan, bulk-delete, graph-edge, lexical, embedding, and cache hooks to typed action-batch subscribers.
