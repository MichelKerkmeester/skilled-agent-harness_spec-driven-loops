# Iteration 001: Correctness

## Focus
Reviewed storage port adapter implementations for behavior-preserving correctness.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0000

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- **F002**: VectorStore.clear semantics are broader than the interface wording. The interface says the port removes vector records, but the better-sqlite adapter deletes `vec_memories`, `active_memory_projection`, and every `memory_index` row, which is a full memory-index clear rather than vector-only cleanup. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:79-97] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:264-271]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| n/a | n/a | n/a | n/a | Correctness pass only. |

## Assessment
- New findings ratio: 1.0000
- Dimensions addressed: correctness
- Novelty justification: Initial pass over the adapters found one low-risk semantic mismatch.

## Ruled Out
- GraphTraversal adapter delegates to existing BFS helpers without changing traversal mechanics. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/graph-traversal.ts:53-79]
- Maintenance checkpoint mode is constrained by the `CheckpointOptions` union. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/maintenance.ts:15-18]

## Dead Ends
- No P0 correctness drift found in lexical, graph, maintenance, or contention adapters.

## Recommended Next Focus
Run the security pass over SQL interpolation, retry policy, and traversal ID handling.
Review verdict: PASS
