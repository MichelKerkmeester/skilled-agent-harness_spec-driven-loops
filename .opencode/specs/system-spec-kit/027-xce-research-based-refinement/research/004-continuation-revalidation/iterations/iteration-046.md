# Iteration 046: Causal Edge Tombstones

## Focus
Revalidated prior finding 004 against current causal edge delete, unlink, bulk-delete, stale cleanup, CLI cleanup, and health auto-repair paths. The narrow interpretation used here is "which current code paths can remove causal edges or remove memory rows that imply causal-edge cleanup, and which of them lack a tombstone/audit surface."

## Findings
1. The core deletion primitives still hard-delete active causal edges without a tombstone read-before-delete path: `deleteEdge()` executes `DELETE FROM causal_edges WHERE id = ?`, and `deleteEdgesForMemory()` executes `DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?`; both only invalidate degree cache on changes. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:747] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:764] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:767]
2. Normal memory deletion, spec-folder bulk deletion through `memory_delete`, tier-based `memory_bulk_delete`, manual `memory_causal_unlink`, and health auto-repair all still route to those hard-delete primitives rather than a tombstone/audit helper. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:117] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:213] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:248] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:252] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:941] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:872]
3. Stale index cleanup is a worse surface than prior wording suggested: `memory-index.ts` deletes stale `memory_index` rows via `vectorIndex.deleteMemory(staleRecordId)` and records history, but does not call `causalEdges.deleteEdgesForMemory()` or any tombstone helper before deleting the row. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:456] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:470] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:473] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:496] [INFERENCE: absence of any causalEdges call in .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:456-494]
4. The non-MCP CLI bulk-delete path also deletes memories in a transaction and then calls `causalEdges.deleteEdgesForMemory()`, but it suppresses edge-cleanup errors; this is an additional tombstone/audit integration surface not listed in the 004 spec file table. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/cli.ts:385] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/cli.ts:396] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:147]
5. The existing 004 spec scope is directionally correct but should be expanded/clarified to include the actual `memory-crud-delete.ts` filename, stale cleanup's missing causal-edge cleanup, manual unlink's `handlers/causal-graph.ts` surface, and CLI bulk-delete if the CLI remains supported. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:127] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:130] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:132] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:133] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:151]

## Ruled Out
- No evidence was found that current code already has a `causal_edge_tombstones` table or sweep helper in the inspected deletion paths; current scope remains implementation, not mere wiring. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:764]
- Treating mutation ledger/history rows as edge tombstones is ruled out because the cited rows record memory deletion history or operation metadata, not source/target/relation snapshots for each deleted causal edge. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:102] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:260]

## Dead Ends
- Searching only for direct `deleteEdge()` callers undercounts the risk: stale cleanup deletes memory rows without direct causal-edge cleanup, creating a delayed orphan-edge scenario instead of an immediate edge delete. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:470] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:865]

## Edge Cases
- Ambiguous input: "stale cleanup paths" could mean direct causal-edge stale cleanup or stale `memory_index` cleanup; this iteration used the latter because current code has `deleteStaleIndexedRecords()`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:496]
- Contradictory evidence: none.
- Missing dependencies: no `resource-map.md` exists in the artifact root, so prior flat packet docs and current code were used instead. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-state.jsonl:1]
- Partial success: complete for code/document revalidation; no runtime execution was performed by scope.

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743-775`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:117-118`, `:213`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:248-258`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:900-942`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:456-502`
- `.opencode/skills/system-spec-kit/mcp_server/cli.ts:385-396`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/spec.md:127-155`

## Assessment
- New information ratio: 0.70
- Questions addressed: exact missing tombstone/audit surfaces for current causal delete/unlink/bulk-delete/stale cleanup paths.
- Questions answered: prior finding 004 remains valid; add stale cleanup and CLI-specific clarifications.

## Reflection
- What worked and why: reading current deletion primitives plus all call sites exposed the difference between active edge hard-delete and memory-row stale cleanup.
- What did not work and why: relying on the 004 spec's file table alone missed filename drift and CLI coverage.
- What I would do differently: next pass should inspect tests for expected delete behavior before implementation planning.

## Recommended Next Focus
For reducer promotion: update phase 004 scope to name `handlers/memory-crud-delete.ts`, `handlers/causal-graph.ts`, `handlers/memory-index.ts` stale cleanup, and `cli.ts` bulk-delete as tombstone/audit surfaces.
