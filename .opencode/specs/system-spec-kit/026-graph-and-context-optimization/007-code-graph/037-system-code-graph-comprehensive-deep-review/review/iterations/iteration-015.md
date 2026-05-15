# Iteration 015 — system-code-graph: Vitest test coverage adequacy across handlers + lib (count + topic coverage gaps)

## Summary

Test coverage is strong for core handlers and most critical lib modules (44 test files in tests/, 13 in stress_test/), but 7 lib modules lack dedicated unit tests: apply-metadata.ts, auto-rescan-policy.ts, exclude-rule-classifier.ts, query-result-adapter.ts, runtime-detection.ts, working-set-tracker.ts, and tree-sitter-parser.ts. While some are indirectly tested through integration tests, the absence of focused unit tests limits confidence in edge-case handling and regression prevention for these modules.

## Files Reviewed

- `.opencode/skills/system-code-graph/vitest.config.ts` (lines read: 18)
- `.opencode/skills/system-code-graph/mcp_server/tests/handlers/classify-query-intent.vitest.ts` (lines read: 35)
- `.opencode/skills/system-code-graph/mcp_server/tests/query-intent-classifier.vitest.ts` (lines read: 94)
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts` (lines read: 97)
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` (lines read: 507)
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` (lines read: 100)
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` (lines read: 100)
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` (lines read: 100)
- `.opencode/skills/system-code-graph/mcp_server/tests/budget-allocator.vitest.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/tests/compact-merger.vitest.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/tests/edge-drift.vitest.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/tests/phase-runner.test.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/tests/detect-changes.test.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/apply-metadata.ts` (lines read: 49)
- `.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/exclude-rule-classifier.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/phase-runner.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/query-result-adapter.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/working-set-tracker.ts` (lines read: 50)
- `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts` (lines read: 50)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 015-001 | `lib/runtime-detection.ts:1-167` | Runtime detection module has no dedicated unit tests despite being a critical security/safety boundary for hook policy detection across multiple AI runtimes (claude-code, codex-cli, copilot-cli, gemini-cli) | Runtime detection is a security-sensitive component that determines hook policy behavior; incorrect detection could lead to unsafe hook execution or missed hook opportunities | Add unit tests covering all runtime detection branches, hook policy edge cases, and environment variable parsing |
| 015-002 | `lib/tree-sitter-parser.ts:1-855` | Tree-sitter parser module (855 lines, complex WASM integration) lacks dedicated unit tests; only indirectly tested through integration tests in scan/siblings-readiness/parser-skip-list | This is a critical parsing component with complex state management (parser health, grammar caching, quarantine logic); failures here break the entire indexing pipeline | Add dedicated unit tests for parser initialization, grammar caching, quarantine logic, error handling, and skip-list integration |
| 015-003 | `lib/auto-rescan-policy.ts:1-128` | Auto-rescan policy module (F-018 safety gate) has minimal test coverage (only referenced in code-graph-cluster-a.vitest.ts line 22) despite being a critical safety guard for inline full-scan authorization | This module prevents unsafe scope-mismatched scans that could wipe populated indexes; insufficient testing risks safety bypass | Add dedicated unit tests covering scope fingerprint matching, parse-diagnostics backlog checks, and all auto-rescan decision branches |
| 015-004 | `lib/exclude-rule-classifier.ts:1-91` | Exclude rule classifier has no test coverage despite being responsible for parsing and validating exclude-rule confidence artifacts (tier classification, pattern loading) | Malformed or misclassified exclude rules could cause incorrect file exclusion/inclusion, affecting index completeness and query accuracy | Add unit tests for JSON schema validation, tier classification logic, pattern loading, and error handling for malformed artifacts |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 015-005 | `lib/apply-metadata.ts:1-49` | Apply metadata module has no dedicated unit tests; only imported in apply-e2e and apply-orchestrator tests | Module is simple (persistApplyMetadata/getLastApplyMetadata) but lacks direct verification of JSON parsing edge cases and error handling | Add lightweight unit tests for happy path, malformed JSON handling, and null/undefined value cases |
| 015-006 | `lib/working-set-tracker.ts:1-162` | Working set tracker (compaction context prioritization) has no test coverage | Module is not currently used in hot paths but represents session state logic that could benefit from regression testing | Add unit tests for file tracking, eviction logic, access counting, and symbol reference management |
| 015-007 | `lib/query-result-adapter.ts:1-247` | Query result adapter has no dedicated test file; likely covered indirectly in query handler tests | Module is a transport adapter with type conversions; indirect coverage may be sufficient for current needs | Consider adding unit tests if adapter complexity grows or if edge cases in parsing are discovered |

## Convergence Signal

newInfoRatio 0.85 vs prior iterations (first dedicated coverage audit identifying 7 previously untested lib modules)
