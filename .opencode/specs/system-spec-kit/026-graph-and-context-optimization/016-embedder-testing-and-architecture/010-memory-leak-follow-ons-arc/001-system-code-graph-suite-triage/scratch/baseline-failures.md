# Baseline Failures: system-code-graph Vitest Suite

Captured: 2026-05-22

Command:

```bash
cd .opencode/skills/system-code-graph
node node_modules/vitest/vitest.mjs run --config vitest.config.ts 2>&1 | tee /tmp/code-graph-suite-baseline.log
```

Summary:

```text
Test Files  12 failed | 45 passed | 1 skipped (58)
Tests       31 failed | 523 passed | 7 skipped (561)
```

Inventory reconciliation:

- Source baseline named `mcp_server/tests/walker-dos-caps.vitest.ts`; live suite path is `mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts`.
- The live suite still has exactly 31 failing tests across 12 files.

| # | File | Test | First Failure Line |
|---|------|------|--------------------|
| 1 | `mcp_server/tests/auto-rescan-policy.vitest.ts` | `blocks when backlog exactly equals threshold (backlog > threshold fails)` | `AssertionError: expected true to be false` |
| 2 | `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `accepts seed with raw_score, path_class, rankingSignals (snake_case wire)` | `TypeError: validateToolArgs is not a function` |
| 3 | `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `accepts seed with rawScore, pathClass, rankingSignals (camelCase)` | `TypeError: validateToolArgs is not a function` |
| 4 | `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `accepts a mixed seed (camelCase + snake_case) without rejecting` | `TypeError: validateToolArgs is not a function` |
| 5 | `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | `parses snake_case + camelCase telemetry fields` | `TypeError: Cannot read properties of undefined (reading 'parse')` |
| 6 | `mcp_server/tests/code-graph-context-handler.vitest.ts` | `counts every remaining anchor when a deadline expires mid-build` | `AssertionError: expected ... to have a length of 1 but got 2` |
| 7 | `mcp_server/tests/code-graph-context-handler.vitest.ts` | `surfaces omittedAnchors for multi-anchor deadline timeouts through the handler payload` | `AssertionError: expected ... to have a length of 1 but got 2` |
| 8 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `warns when fq_name resolution is ambiguous and prefers callable implementation nodes for calls_from` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 9 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `warns when name resolution is ambiguous after fq_name misses and prefers inbound-call candidates for calls_to` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 10 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `re-ranks more than 10 ambiguous name matches after fq_name misses before selecting a calls_to candidate` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 11 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `re-ranks more than 10 ambiguous fq_name matches before selecting a calls_from candidate` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 12 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `adds nested edge evidence metadata without collapsing trust axes` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 13 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `aggregates payload-level edge trust from the weakest returned edge` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 14 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `keeps relationship payloads parseable for the shared query adapter` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 15 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `excludes dangling edges and reports corruption warnings instead of returning raw symbol IDs` | `No "sanitizeEdgeMetadataString" export is defined on the "../lib/code-graph-db.js" mock` |
| 16 | `mcp_server/tests/code-graph-query-handler.vitest.ts` | `returns only the seed node when blast-radius maxDepth is zero` | `AssertionError: expected ... to deeply equal [seed only]` |
| 17 | `mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | `emits canonical readiness fields for 'ccc-status'` | `expected canonicalReadiness missing/unavailable, received ready/live` |
| 18 | `mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | `emits canonical readiness fields for 'ccc-reindex'` | `expected canonicalReadiness missing/unavailable, received ready/live` |
| 19 | `mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | `emits canonical readiness fields for 'ccc-feedback'` | `expected canonicalReadiness missing/unavailable, received ready/live` |
| 20 | `mcp_server/tests/edge-metadata-sanitize.test.ts` | `a sanitizer is referenced at each of 3 documented read-path sites (D7 coverage)` | `AssertionError: expected false to be true` |
| 21 | `mcp_server/tests/graph-payload-validator.vitest.ts` | `fails closed when query emission validation rejects the trust payload` | `promise resolved ... instead of rejecting` |
| 22 | `mcp_server/tests/runtime-detection.vitest.ts` | `detects Codex CLI via CODEX_CLI=1` | `expected codex hook policy mock to be called` |
| 23 | `mcp_server/tests/runtime-detection.vitest.ts` | `returns false when runtime is unknown` | `AssertionError: expected true to be false` |
| 24 | `mcp_server/tests/runtime-detection.vitest.ts` | `returns tool_fallback when hooks are not available` | `expected 'hooks' to be 'tool_fallback'` |
| 25 | `mcp_server/tests/startup-brief.vitest.ts` | `builds graph outline and session continuity when data exists` | `sessionContinuity was null` |
| 26 | `mcp_server/tests/startup-brief.vitest.ts` | `returns empty graph state with summary but no outline for empty indexes` | `expected undefined to be 'absent'` |
| 27 | `mcp_server/tests/startup-brief.vitest.ts` | `reports cocoindex as available when the binary exists` | `AssertionError: expected false to be true` |
| 28 | `mcp_server/tests/symlink-realpath-hardening.vitest.ts` | `blocks memory_save when a safe-looking spec path resolves into z_future` | `Error: Access denied: Path outside allowed directories` |
| 29 | `mcp_server/tests/tree-sitter-parser.vitest.ts` | `TreeSitterParser.isReady returns true for doc language without init` | `AssertionError: expected false to be true` |
| 30 | `mcp_server/tests/tree-sitter-parser.vitest.ts` | `returns error parseHealth when tree has errors and no nodes extracted` | `expected module node array to equal []` |
| 31 | `mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts` | `stops descending spec discovery past the configured max depth and keeps shallower packets indexable` | `relative path escaped temp root via /private/tmp realpath mismatch` |
