# Iteration 007 — system-code-graph: code_graph_query handler + code-graph-db.ts correctness (outline, calls, imports, blast_radius operations)

## Summary

Review identified 4 findings across both files: 1 P1 (snapshot consistency issue in blast_radius) and 3 P2 (input validation and code duplication issues). The query handler demonstrates robust error handling and dangling edge detection, but lacks transaction wrapping for blast_radius operations that other operations have for snapshot stability.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` (lines read: 1526)
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` (lines read: 1244)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 001 | query.ts:1334-1371 | blast_radius operation lacks transaction wrapping while other operations (transitiveTraversal, calls_from, calls_to, imports_from, imports_to) use transactions per F-002-A2-03 for snapshot stability under concurrent writers | Inconsistent snapshot stability - concurrent index passes could shift results between the multiple DB queries in computeBlastRadius (queryImportDependentsForBlastRadius + buildHotFileBreadcrumbs) | Wrap blast_radius DB queries in a transaction: `graphDb.getDb().transaction(() => computeBlastRadius(...))()` |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 002 | code-graph-db.ts:1011 | resolveSubjectFilePath uses LIKE query with user input without escaping SQL wildcards (% and _), which could cause unintended matches | User input containing wildcards could match unexpected file paths, leading to incorrect resolution | Escape wildcards in subject before LIKE query, or use exact matching only |
| 003 | query.ts:1138 | limit parameter has no validation to ensure it's a positive integer before use in slice operations and loop conditions | If limit is 0 or negative, slice(0, limit) returns empty array and while loops may not execute, causing unexpected behavior | Add validation: `const safeLimit = Math.max(1, Math.min(limit ?? 50, 1000))` |
| 004 | query.ts:1140 | maxDepth parameter has no validation to ensure it's a positive integer before use in traversal depth checks | If maxDepth is 0 or negative, transitive traversal may not behave as expected (loops may not execute) | Add validation: `const safeMaxDepth = Math.max(1, args.maxDepth ?? 3)` |
| 005 | query.ts:673-679, code-graph-db.ts:1193-1199 | Duplicate edge metadata sanitization functions (sanitizeEdgeMetadataReadString and sanitizeEdgeMetadataString) with identical logic | Code duplication increases maintenance burden and risks drift if one is updated but not the other | Consolidate into a single shared utility function imported by both modules |

## Convergence Signal

newInfoRatio 0.75 vs prior iterations (4 new findings focused on transaction consistency, input validation, and code duplication not previously reported)
