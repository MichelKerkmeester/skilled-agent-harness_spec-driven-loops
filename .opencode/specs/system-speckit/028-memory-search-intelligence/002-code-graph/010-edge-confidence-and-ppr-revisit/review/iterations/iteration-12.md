# Deep Review Iteration 12

## Dimension

Security deep-dive on the edge-confidence flag, confidence metadata write paths, SQL parameterization, and prototype-pollution exposure in the recovered seeded-PPR context path.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:5`
- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1028`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2048`
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:47`
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:84`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:477`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:701`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:841`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1595`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1941`

## Findings by Severity (P0/P1/P2)

### P0

None.

### P1

None.

### P2

None.

## Traceability Checks

- Env flag fail-safe check: `isCodeGraphEdgeConfidenceDifferentiationEnabled()` returns `env[SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION] === 'true'`, so only the exact lowercase string enables the feature. Typos, uppercase `TRUE`, `1`, `yes`, and other truthy-looking values fail closed. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:5`, `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:7`]
- Structural indexer confidence writes: confidence metadata uses fixed property names produced by `buildEdgeMetadata()` and `buildDifferentiatedCallsEdgeMetadata()`. File-derived strings such as symbol names, module specifiers, and paths are used as `Map` keys or fixed-field values, not as dynamic object property names. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:175`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1033`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1161`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2059`]
- SQL write boundary: structural edge objects are persisted through prepared statements with bound values for `source_id`, `target_id`, `edge_type`, `weight`, and JSON metadata. The dynamic `IN (...)` placeholder lists are generated from array length only; the actual symbol IDs are still bound parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1595`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1603`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1615`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1633`]
- Cross-file resolver confidence writes: reads and updates use fixed SQL text with placeholders, and all file-derived `symbol_id`, edge ID, and JSON metadata values are passed via `.run(...)` parameters. Name bucketing uses `Map<string, CodeNodeRow[]>`, not object-index assignment. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:95`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:117`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:122`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:127`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:159`]
- Seeded-PPR graph traversal: node IDs, edge keys, and file paths are stored in `Map`/`Set` containers (`teleport`, adjacency, edge cache, candidate cache, node summaries, `whyIncludedByFile`). The PPR path does not write SQL, and its graph reads route through `queryEdgesFrom()` / `queryEdgesTo()`, which bind symbol IDs and edge types as prepared-statement parameters. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:481`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:494`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:680`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:712`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:716`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:865`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1941`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1971`]
- Counterevidence sought: searched for loose truthy env parsing, string-interpolated SQL containing symbol names/file paths, dynamic object writes such as `obj[userControlledKey] = value`, and plain object dictionaries keyed by graph strings in the assigned paths. The reviewed occurrences used strict comparison, prepared statements, fixed-field metadata objects, `Map`, or `Set`.

## Verdict

No new security findings in this assigned pass. The reviewed code is fail-safe-closed for the new edge-confidence env flag, keeps graph/file-derived strings out of SQL text, and avoids prototype-pollutable object-key writes in the confidence and seeded-PPR paths.

## Next Dimension

Continue with the orchestrator-assigned next batch dimension after iterations 12-16 are merged; avoid duplicating previously established P1/P2 findings.

Review verdict: PASS
