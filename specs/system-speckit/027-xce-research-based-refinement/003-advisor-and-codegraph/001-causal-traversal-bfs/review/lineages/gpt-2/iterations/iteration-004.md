# Iteration 004: Maintainability

## Focus
Reviewed code comments, test shape, and long-term readability of the BFS cutover after correctness/security/traceability coverage.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 2
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- **F002**: Causal boost comments still describe the removed CTE implementation, `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:7`. The production code now calls `graphTraversal.collectCausalWeightedNeighbors`, but the module header and relation-weight comment still say the traversal is a weighted CTE/CTE walk. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:6-8`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:81-87`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:420-428`]
- **F003**: Latency acceptance test uses a hard wall-clock comparison that may be noisy, `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:226`. The test measures 25 iterations and directly asserts `bfsMs <= cteMs`; the reviewed run passed, but the assertion is sensitive to local scheduler noise. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:226-233`]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | pass | advisory | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/graph-traversal.ts:69-79` | Feature routing exists through the graph traversal adapter. |
| playbook_capability | pass | advisory | `npx vitest run tests/causal-traversal-bfs-equivalence.vitest.ts --reporter verbose` | Focused suite passed 4/4 during review. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: maintainability
- Novelty justification: Two advisory risks found. Neither changes executable behavior or blocks release readiness.

## Ruled Out
- Elevating F002 to P1: stale comments can mislead future maintainers, but the call site itself routes to BFS correctly.
- Elevating F003 to P1: the benchmark passed in this review run with `cte_ms=1.369` and `bfs_ms=1.157`; the concern is flake risk rather than current failure.

## Dead Ends
- No maintainability finding indicated a correctness or security blocker.

## Recommended Next Focus
Stabilization replay across all dimensions and final synthesis.

Review verdict: PASS
