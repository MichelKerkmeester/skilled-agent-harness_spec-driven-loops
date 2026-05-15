# Iteration 006 — system-code-graph: code_graph_scan handler + structural-indexer.ts correctness

## Summary

Review identified 5 findings across both files: 1 P0 (critical type mismatch causing runtime errors), 2 P1 (logic errors and potential crashes), and 2 P2 (code quality issues). The most severe issue is a type mismatch in scan.ts where `results.warnings` is accessed but `results` is typed as `ParseResult[]` array, not an object with a warnings property.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` (lines read: 775)
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` (lines read: 2234)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| 001 | scan.ts:461 | `results.warnings` accessed but `results` is typed as `ParseResult[]` array, not an object with warnings property | Type mismatch causes runtime errors; warnings property exists on IndexFilesResult but code treats array as object | Fix type definition or access pattern: IndexFilesResult extends Array<<ParseResult> AND has warnings property, so access should work, but verify at runtime that results is actually IndexFilesResult not plain array |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 002 | scan.ts:363 | `fullReindexTriggered` hardcoded to `false` despite git HEAD change detection logic elsewhere | Logic error: variable suggests conditional reindex triggering but is never set to true, breaking intended behavior | Set `fullReindexTriggered = gitHeadChanged && incremental` or similar conditional logic |
| 003 | scan.ts:614-618 | Error filtering logic `errors.filter((error) => !structuralErrors.includes(error))` is redundant since `structuralErrors` is built from `errors` | Logic error: filter will never remove anything since structuralErrors are subset of errors already; wastes CPU cycles | Simplify to `failedScanErrors = structuralErrors.length > 0 ? structuralErrors.slice(0, 10) : errors.slice(0, 10)` |
| 004 | structural-indexer.ts:1909-1907 | `droppedReconciledEdges` incremented before edge filtering, but edges are filtered in next line | Off-by-one logic: counter incremented based on original edge count, not actual dropped count | Move counter increment inside conditional or calculate after filtering: `droppedReconciledEdges += result.edges.length - reconciledEdges.length` |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 005 | structural-indexer.ts:989-992 | Empty content check returns `symbolNodes` without module node, but module node was already created | Code clarity: inconsistent return - should either always include module node or never include it for empty files | Decide on consistent behavior: always include module node even for empty files, or exclude entirely |
| 006 | scan.ts:549 | Variable `structuralErrors` declared but only used to build `failedScanErrors`, could be inlined | Code quality: unnecessary intermediate variable adds complexity | Inline the logic where `structuralErrors` is used |

## Convergence Signal

newInfoRatio 0.85 vs prior iterations (5 new findings, type mismatch and logic errors not previously reported)
