# Iteration 9 - Readiness Contract Auto-Rescan Opportunity

## METADATA
- Iteration: 9 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 8 - readiness contract auto-rescan opportunity

## INVESTIGATION
Read the research charter, available prior iterations (`iteration-001.md` through `iteration-006.md`; iterations 007-008 were not present on disk), the native-rerun synthesis, and the native trial log. Traced `code_graph/lib/readiness-contract.ts`, `code_graph/lib/ensure-ready.ts`, and all production call sites found for `ensureCodeGraphReady()`: query, context, detect-changes, and verify.

The focus was whether a readiness result such as `{ freshness: "stale", action: "full_scan" }` has a production path that auto-rescans when the scope is unambiguous. The answer is no for current read/verification handlers. The underlying helper can perform inline full scans when `allowInlineFullScan` is enabled, but all production read-like call sites explicitly disable it.

## FINDINGS
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` - `code_graph_query` disables inline full scans with `allowInlineFullScan:false`, and `shouldBlockReadPath()` then blocks every `full_scan` readiness result whose `inlineIndexPerformed` is not true; recommended remediation: add a guarded auto-rescan path for mechanically safe `stale/full_scan` cases, or add a structured reason code that lets the handler distinguish safe broad drift from destructive scope drift before blocking.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166` - `code_graph_context` mirrors the same policy: `allowInlineIndex:true` permits selective repair, but `allowInlineFullScan:false` forces stale/full-scan states into `requiredAction:"code_graph_scan"` instead of auto-rescanning; recommended remediation: centralize read-path readiness policy so query/context/verify make one shared, testable decision about safe full rescans.
- P2 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:32` - `ReadyResult` exposes `freshness`, `action`, optional `files`, `inlineIndexPerformed`, and a free-form `reason`, but no machine-readable full-scan cause or safety classification; recommended remediation: add fields such as `reasonCode`, `scopeDrift`, `candidateManifestDrift`, or `autoFullScanSafety` so future auto-rescan logic does not parse human strings.
- P2 `.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:284` - tests explicitly lock the current read-path policy as "refuses inline full scan" when `allowInlineFullScan:false`, but there is no production caller or regression fixture that enables guarded inline full-scan for unambiguous stale states; recommended remediation: add a fixture for the desired safe-auto-rescan case before changing handler defaults.

## EVIDENCE
Native rerun established the user-visible failure this dimension is trying to reduce:

```text
../002-native-deferred-trial-rerun/synthesis-report-native-rerun.md:13 - first includeSkills scan succeeded, then read queries failed on candidate manifest drift.
../002-native-deferred-trial-rerun/synthesis-report-native-rerun.md:52 - backlog recommends either auto-rescan with union scope or actionable failure.
../002-native-deferred-trial-rerun/trials/trial-log.jsonl:2 - N-CG-002 blocked with "candidate manifest drift ... inline full scan skipped for read path".
../002-native-deferred-trial-rerun/trials/trial-log.jsonl:3 - N-CG-003 same blocked read-path failure.
../002-native-deferred-trial-rerun/trials/trial-log.jsonl:4 - N-CG-004 same blocked read-path failure.
```

`readiness-contract.ts` only decorates the ready result; it does not decide or trigger rescans:

```text
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241-248
buildReadinessBlock(readiness) returns the original readiness fields plus canonicalReadiness and trustState.
```

`ensure-ready.ts` has the inline full-scan machinery, but it is option-gated:

```text
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:44-47
EnsureReadyOptions includes allowInlineIndex and allowInlineFullScan.

.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:496-499
allowInlineFullScan defaults to allowInlineIndex.

.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:527-535
If state.action is full_scan and allowInlineFullScan is false, the helper returns inlineIndexPerformed:false and appends "inline full scan skipped for read path".

.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:548-573
If full_scan is allowed, the helper runs indexWithTimeout(), updates graph scope/git head/candidate manifest, then returns inlineIndexPerformed:true.
```

Production read/verification call sites found:

```text
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089-1092
ensureCodeGraphReady(process.cwd(), { allowInlineIndex:true, allowInlineFullScan:false })

.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166-169
ensureCodeGraphReady(process.cwd(), { allowInlineIndex:true, allowInlineFullScan:false })

.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:154-156
ensureCodeGraphReady(canonicalRootDir, { allowInlineIndex: args.allowInlineIndex ?? false, allowInlineFullScan:false })

.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:249-252
ensureCodeGraphReady(canonicalRootDir, { allowInlineIndex:false, allowInlineFullScan:false })
```

Blocking behavior is explicit:

```text
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-789
shouldBlockReadPath returns true for action="full_scan" when inlineIndexPerformed is not true.

.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:799-804
fallbackDecision tells callers to run code_graph_scan, not an automatic rescan.

.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:62-73
context blocks crashed readiness and full_scan without inlineIndexPerformed.

.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:89-93
context fallbackDecision also points to code_graph_scan.
```

Existing tests document the current behavior:

```text
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:284-300
The helper "refuses inline full scan for read paths" when allowInlineFullScan:false.

.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:190-214
Query returns an explicit blocked contract when readiness requires full_scan.
```

Search evidence:

```text
rg "ensureCodeGraphReady\\(|allowInlineFullScan\\s*:\\s*true|allowInlineFullScan\\s*:\\s*false" .opencode/skills/system-spec-kit/mcp_server/code_graph .opencode/skills/system-spec-kit/mcp_server/tests
Production matches all used allowInlineFullScan:false; no production allowInlineFullScan:true match was found.
```

## NEW INSIGHTS
- The auto-rescan capability already exists in `ensureCodeGraphReady()`; the missing piece is not a new indexer primitive, but a guarded production policy for when a full scan is safe to run inline.
- `readiness-contract.ts` is the wrong place to implement auto-rescan. It is a payload decorator and trust-state mapper. The decision belongs in `ensure-ready.ts` or a shared read-path policy wrapper above the handlers.
- The current contract cannot express why `full_scan` is required except through `reason`. That is acceptable for operator messaging, but too weak for automated safety decisions.
- The existing caution is justified by prior P0 findings: scope-mismatched or zero-node full scans can be destructive. Any auto-rescan remediation must first classify the cause and guard against zero-node promotion.

## OPEN QUESTIONS
- Which full-scan causes should be considered safe for inline auto-rescan: candidate-manifest drift, HEAD drift with tracked-file intersection, broad stale mtimes, or only an explicit allowlist?
- Should guarded auto-rescan be opt-in via a tool argument/env flag first, or become the default once zero-node persistence and parse-error overwrite risks are fixed?
- Should the blocked payload include a structured `reasonCode` immediately, even before changing auto-rescan behavior, so native operators can distinguish manifest drift from scope mismatch?
