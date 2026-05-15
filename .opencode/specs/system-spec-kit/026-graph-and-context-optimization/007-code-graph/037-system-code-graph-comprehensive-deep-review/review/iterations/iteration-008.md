# Iteration 008 — system-code-graph: code_graph_context handler + code-graph-context.ts correctness (neighborhood retrieval)

## Summary

The code_graph_context handler and code-graph-context.ts implementation are generally well-structured with proper error handling, readiness checks, and deadline management. However, I identified one P1 issue regarding node deduplication in neighborhood retrieval that could lead to duplicate entries in the output, and several P2 improvements around edge case handling and query flexibility.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts` (lines read: 416)
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` (lines read: 642)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 008-P1-1 | code-graph-context.ts:372-426 | Node deduplication missing in neighborhood retrieval - the same node can be added multiple times to the nodes array if it appears in both outgoing and incoming edge queries (e.g., a symbol that both calls and is called by another symbol in the neighborhood) | P1 - This causes duplicate entries in graph context output, confusing LLMs and users with redundant symbol information | Add deduplication logic using a Set based on symbolId or fqName before adding nodes to the array |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 008-P2-1 | code-graph-context.ts:389, 395, 411, 417 | Fallback to symbolId when fqName is undefined produces less user-friendly output - nodes display as internal IDs instead of human-readable names | P2 - Affects output readability but doesn't break functionality | Ensure fqName is always populated by seed-resolver, or add a fallback to name field before symbolId |
| 008-P2-2 | code-graph-context.ts:520-528 | Subject resolution only supports exact matches - no fuzzy matching or partial name resolution for subject parameter | P2 - Limits usability when users provide approximate symbol names | Add LIKE query or substring matching for subject resolution fallback |
| 008-P2-3 | code-graph-context.ts:340 | Deadline check uses performance.now() which can be affected by system clock adjustments - should use monotonic clock for reliable timing | P2 - Edge case timing issue on systems with clock adjustments | Use process.hrtime() or similar monotonic timing if available |
| 008-P2-4 | context.ts:67-78 | shouldBlockReadPath function has complex boolean logic that could be simplified for clarity | P2 - Code maintainability improvement | Extract inlineIndexPerformed check to a named constant or helper function |

## Convergence Signal

newInfoRatio 0.75 vs prior iterations (focused on new neighborhood retrieval correctness issues not covered in query handler review)
