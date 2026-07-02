# Dimension

ADR-001 compliance deep audit for orphaned local weighted-walk implementations across the whole repository. Focus: confirm there is no surviving second graph-walk engine, commented-out local walker, stray implementation file, or test import pointing at a local walker instead of the shared Memory MCP traversal substrate.

# Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` - severity definitions and evidence rules loaded before final severity calls.
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:122` - deep-review verdict mapping loaded for final line discipline.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/decision-record.md:146` - ADR near-miss context inspected.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20` - resolver for compiled Memory MCP traversal module inspected.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32` - dynamic import of shared traversal module inspected.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:35` - local alias to imported `collectWeightedWalk` inspected.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:515` - `computeBoundedPersonalizedPageRank` inspected.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:528` - PPR reachability call confirmed to use `collectMemoryWeightedWalk`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts:121` - legitimate shared `collectWeightedWalk` implementation inspected.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/graph-traversal.ts:57` - adapter passthrough inspected and confirmed to delegate to shared implementation.
- `.opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:64` - test fake inspected and confirmed to delegate to shared implementation.
- `.worktrees/0008-findings-remediation/.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts:121` - no-ignore worktree mirror hit inspected; it is a mirror of the legitimate shared implementation, not a PPR-local implementation.

# Findings by Severity

## P0

None.

## P1

None.

## P2

None.

# Traceability Checks

- Broad repository Grep for `collectWeightedWalk|computeWeightedWalk|localWeightedWalk|localWalk|weightedWalkResult` returned expected shared implementation, code-graph dynamic import, adapter/test passthroughs, docs/logs, and a worktree mirror; no implementation-shaped local PPR walker was confirmed.
- Narrow implementation-shaped Grep over code files for weighted-walk/local-walk definitions found only `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20,32,35` and `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts:121`.
- No-ignore `rg` over hidden and worktree code files found shared source/dist, adapter declarations, test fake passthroughs, and the `.worktrees/0008-findings-remediation` mirror; no `localWeightedWalk`, `computeWeightedWalk`, `localWalk`, or lowercase `weightedWalkResult` implementation survived.
- Manual inspection confirmed `code-graph-context.ts` imports `WeightedTraversalEdge`/`WeightedWalkResult` types from the Memory MCP compiled traversal and calls `collectMemoryWeightedWalk` inside PPR reachability rather than defining an internal weighted walk.
- Manual inspection confirmed adapters and fakes call the shared `collectWeightedWalk(options)` rather than duplicating traversal logic.

# Verdict

No orphaned local-walker implementation trace was found. The repository contains the legitimate shared Memory MCP walker, compiled dist mirrors, adapter/test passthroughs, historical documentation/log references, and a separate worktree mirror of the same shared implementation. None constitute a new ADR-001 violation.

# Next Dimension

Continue with the next batch-assigned review dimension; no remediation workstream is required from iteration 16.

Review verdict: PASS
