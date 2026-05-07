# Iteration 10 - code_graph_verify + tests/ coverage gaps

## METADATA
- Iteration: 10 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 9 - code_graph_verify coverage of scope mismatches + tests/ coverage gaps

## INVESTIGATION
Read the research charter, all prior iteration files present on disk, the native-rerun synthesis, and the native-rerun trial log. The first file listing showed `iteration-001.md` through `iteration-006.md`; a final reconciliation found and read `iteration-007.md` and `iteration-009.md` as well. `iteration-008.md` was not present in the requested `research/iterations/` folder at verification time.

Traced `code_graph_verify` through:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/*.vitest.ts`

`code_graph_verify` checks the following:

- `rootDir` stays inside the workspace and `batteryPath` stays under an allowlisted `assets/code-graph-gold-queries.json` location.
- `ensureCodeGraphReady()` returns `fresh`; otherwise it returns `status: "blocked"` and does not run probes.
- The gold battery schema, pass policy, query category filter, source file fields, and expected symbol lists are valid.
- Each gold query runs an `outline` probe against `source_file` with `limit: 200`.
- Returned node `name` and `fqName` values contain all `expected_top_K_symbols`.
- Overall and edge-focus pass rates meet battery policy.
- `persistBaseline: true` stores the last verification result.

Answer to the scope-mismatch question: `code_graph_verify` does not directly test scope mismatches. It inherits whatever `ensureCodeGraphReady()` reports, but the handler has no scope arguments and the verify tests mock readiness rather than exercising stored-scope/active-scope drift through the verify entrypoint.

Coverage answers:

- (a) Scope-policy drift: partially covered outside `code_graph_verify`. `code-graph-scope-readiness.vitest.ts` covers env-derived stored/active fingerprint drift and the intentional per-call trust exception. `code-graph-scan.vitest.ts` covers `includeSkills` pass-through. There is no verify-entry regression that proves `code_graph_verify` blocks with an actionable scope-mismatch readiness envelope, and no test for the default-scope maintainer mismatch from the native failure chain.
- (b) 0-node persistence regression: not covered. Tests cover normal stale-file removal and empty-graph read blocking, but not a populated DB followed by a full scan whose candidate result set has `totalNodes === 0`.
- (c) Parser-crash recovery: not covered. Tests cover formatting of parse errors in scan output and atomic rollback on thrown DB writes, but not preserving a previous successful file graph when a later parse result has `parseHealth: "error"` with zero nodes.

## FINDINGS
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:153` - `code_graph_verify` gates only on generic readiness and then runs the gold battery; because it has no expected-scope input and no scope-specific assertion, a verify run cannot prove the active maintainer scope matches the graph scope beyond whatever `ensureCodeGraphReady()` happens to classify; recommended remediation: add a scope-aware verify preflight/result field and a verify-handler test that seeds a stored default/env scope mismatch and asserts the returned readiness explains the required `code_graph_scan` flags.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:285` - scan coverage asserts normal full-reindex stale-file removal, but does not cover the native regression shape where a populated graph is followed by a full scan returning zero nodes; recommended remediation: add a regression test that seeds tracked files/non-zero stats, mocks `indexFiles()` to return `[]` or only zero-node parse-error results, and asserts the old graph is preserved or the scan is quarantined instead of calling `removeFile()` across the prior index.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:671` - parser-error coverage only verifies workspace-relative error formatting after a `parseHealth: "error"` result, while persistence still replaces nodes/edges for that result; recommended remediation: add parser-crash recovery tests around `persistIndexedFileResult()` or the scan handler that seed a previous clean graph, feed a zero-node `parseHealth: "error"` result such as `memory access out of bounds`, and assert prior nodes/edges remain available with diagnostics stored separately.
- P2 `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts:331` - verify-handler tests mock `ensureCodeGraphReady()` and cover only a generic stale readiness envelope, so they do not exercise the real stored-scope/active-scope mismatch branch used by read-path tools; recommended remediation: add one integration-style verify test using a temp DB and the real readiness path, or add a focused mock assertion that the scope-mismatch reason is preserved verbatim in the verify response.

## EVIDENCE
Read-first packet evidence:

```text
research/deep-research-strategy.md lists focus dimension 9 as code_graph_verify coverage of scope mismatches + tests/ coverage gaps.
research/iterations/iteration-001.md through iteration-007.md and iteration-009.md were present and read; iteration-008.md was absent at verification time.
../002-native-rerun/synthesis-report-native-rerun.md records native code graph as OVERHEAD due to scope policy, drift detector, parser crash, and zero-node persistence failures.
../002-native-rerun/trials/trial-log.jsonl records N-CG-005: totalNodes=0 after previousTotalNodes=56843, parserCrashCount=10, parserCrashMessage="memory access out of bounds".
```

What `code_graph_verify` checks:

```text
verify.ts:97-139 resolves and allowlists rootDir/batteryPath.
verify.ts:153-165 calls ensureCodeGraphReady() and blocks unless freshness is fresh.
verify.ts:167-174 loads/applies the category-filtered gold battery and executes it through handleCodeGraphQuery.
verify.ts:176-178 persists the baseline only when persistBaseline is true.
gold-query-verifier.ts:270-303 runs an outline probe for each gold query source_file.
gold-query-verifier.ts:319-353 compares returned node name/fqName values against expected_top_K_symbols.
gold-query-verifier.ts:378-400 computes pass rates and the final passed boolean.
```

Scope mismatch coverage:

```text
ensure-ready.ts:293-310 compares active and stored scope fingerprints only when stored scope is not source="scan-argument".
code-graph-scope-readiness.vitest.ts:102-130 tests env-derived stored/active scope drift blocks reads.
code-graph-scope-readiness.vitest.ts:136-152 tests per-call stored scope is trusted despite env drift.
code-graph-scan.vitest.ts:345-369 tests includeSkills:true pass-through.
code-graph-scan.vitest.ts:372-397 tests includeSkills:false overrides an env opt-in.
code-graph-scan.vitest.ts:400-422 tests granular includeSkills pass-through.
code-graph-verify.vitest.ts:331-354 tests only a mocked generic stale readiness response.
```

Zero-node persistence gap:

```text
scan.ts:292-298 full scans remove every tracked file absent from the current indexFiles() result set.
scan.ts:301-329 persists each current result and accumulates totalNodes/totalEdges, with no previous-nonzero guard in this block.
scan.ts:335-342 persists git/provenance/scope metadata after the scan.
code-graph-scan.vitest.ts:285-343 asserts normal full-reindex removal of /workspace/removed.ts.
No code_graph/tests/*.vitest.ts hit was found for a populated graph followed by a full scan returning totalNodes=0 with preservation/quarantine expectations.
```

Parser-crash recovery gap:

```text
ensure-ready.ts:464-482 persists any ParseResult by upserting the file, replacing nodes, replacing edges, and finalizing the file row.
code-graph-scan.vitest.ts:671-697 covers parse error path formatting only.
code-graph-atomic-persistence.vitest.ts:56-142 covers transaction rollback for thrown DB operations using a clean parse result.
code-graph-indexer.vitest.ts:1252-1255 covers empty files as recovered with zero nodes.
No code_graph/tests/*.vitest.ts hit was found for memory access out of bounds, parser backend runtime crashes, or preserving a previous clean graph after parseHealth="error".
```

Test glob:

```text
code_graph/tests/*.vitest.ts matched 17 files:
code-graph-atomic-persistence.vitest.ts
code-graph-busy-timeout.vitest.ts
code-graph-candidate-manifest.vitest.ts
code-graph-context-handler.vitest.ts
code-graph-cross-file-edges.vitest.ts
code-graph-indexer.vitest.ts
code-graph-metadata-shape.vitest.ts
code-graph-ops-hardening.vitest.ts
code-graph-query-handler.vitest.ts
code-graph-resolve-subject-typed.vitest.ts
code-graph-scan.vitest.ts
code-graph-scope-readiness.vitest.ts
code-graph-seed-resolver.vitest.ts
code-graph-siblings-readiness.vitest.ts
code-graph-stale-mtime-vs-hash.vitest.ts
code-graph-verify.vitest.ts
edge-drift.vitest.ts
```

## NEW INSIGHTS
- `code_graph_verify` is a gold-outline verifier, not a full scan/readiness invariant verifier. Its name can imply broader health coverage than the code provides.
- Iteration 9 already identified the verify call site's `allowInlineFullScan:false`; this pass adds that the verify tests do not exercise scope-mismatch readiness through the verify entrypoint.
- Scope-policy drift has unit coverage in readiness and scan pass-through tests, but not at the `code_graph_verify` entrypoint and not for the maintainer-default-scope mismatch that caused the native zero-node chain.
- The test suite has pieces adjacent to parser-crash recovery, but no test asserts the preservation invariant that matters after a parser backend crash.
- The native 0-node persistence failure remains a cross-cutting regression shape: it requires scan pruning, persistence policy, prior DB state, and candidate result counts in one test. Existing tests isolate those components and miss the failure chain.

## OPEN QUESTIONS
- Should `code_graph_verify` remain a gold-query-only tool, or should it grow explicit health checks for scope policy, zero-node protection, and parser diagnostics?
- Should zero-node protection live in `handleCodeGraphScan()` only, or should the DB layer reject destructive promotion of an empty candidate graph when prior stats are nonzero?
- Should parser-crash recovery preserve prior nodes for only `parseHealth: "error"`, or also for severe drops where `parseHealth: "recovered"` returns zero nodes for a previously non-empty file?
