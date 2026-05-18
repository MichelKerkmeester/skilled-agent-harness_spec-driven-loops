# Iteration 3 — Issue B: Drift Detector Code Path Trace

## METADATA
- Iteration: 3 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 2 — Issue B: drift detector code path trace

## INVESTIGATION
Read the research charter, checked the `research/iterations/` folder, and found no prior iteration files present yet. Read the native-rerun synthesis and trial log, then traced the read path from `code_graph_query` through `ensureCodeGraphReady`, `index-scope-policy`, and `readiness-contract`.

The investigated path was:

- `handlers/query.ts` calls `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })`.
- `lib/ensure-ready.ts` runs `detectState(rootDir)` and evaluates empty graph, scope fingerprint drift, git HEAD drift, mtime drift, and candidate manifest drift in that order.
- `lib/index-scope-policy.ts` defines the scope fingerprint format used by the scope mismatch gate.
- `lib/readiness-contract.ts` maps the resulting `ReadyResult` into canonical readiness and trust-state payload fields; it does not decide drift.

## FINDINGS
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:202` — Candidate manifest drift fires from a stored manifest `{count,digest}` compared against `graphDb.getTrackedFiles()`, not from scope hash or git HEAD. The predicate is `stored exists AND (sorted tracked-file count differs OR sha256(sorted tracked-file paths joined by "\n").slice(0,16) differs)`. Because `query.ts` disables inline full scans, any manifest mismatch becomes a blocked read. Recommended remediation: add a regression test that reproduces the native read-after-`includeSkills:true` scan sequence and asserts the manifest baseline is recorded and compared under the same path/scope normalization.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293` — Scope fingerprint drift is a separate earlier full-scan predicate, and per-call scan scopes are explicitly exempted when `storedScope.source === 'scan-argument'`. The native trial's error text was therefore not the scope mismatch branch. Recommended remediation: keep the branch separation, but include active/stored scope and manifest count/digest diagnostics in blocked-read payloads so operators can distinguish scope drift from manifest drift without source tracing.
- P2 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241` — `readiness-contract.ts` only decorates the `ReadyResult`; it cannot explain why candidate manifest drift fired. Recommended remediation: do not route future root-cause work to this file except to verify emitted `canonicalReadiness` and `trustState` fields.

## EVIDENCE
Native-rerun evidence:

- `../002-native-deferred-trial-rerun/trials/trial-log.jsonl` records `N-CG-002`, `N-CG-003`, and `N-CG-004` as blocked with `candidate manifest drift: indexable file set has changed since last scan; inline full scan skipped for read path`.
- `../002-native-deferred-trial-rerun/trials/raw/code-graph-drift-blocks.json` repeats the same reason for `calls_to scoreLexicalLane`, `blast_radius recommend_with_native_advisor`, and `imports_to skill-graph-db.ts`.
- `../002-native-deferred-trial-rerun/trials/raw/code-graph-first-scan.json` records the preceding scan as `code_graph_scan` with args `{ "includeSkills": true }`, `filesIndexed: 9280`, `totalNodes: 56843`, and status `completed`.

Code path evidence:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` calls `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787` blocks reads when `readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:818` emits `code_graph_full_scan_required: ${readiness.reason}`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:527` returns without scanning when state action is `full_scan` and `allowInlineFullScan` is false.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:532` appends `; inline full scan skipped for read path`, matching the native-rerun error suffix.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:179` records a manifest as sorted tracked file count plus a 16-character SHA-256 digest.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:202` loads the stored manifest and returns drift when count or digest differs.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:343` assigns `manifestDrift = detectCandidateManifestDrift(trackedFiles)`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:358` returns stale/full-scan with reason `candidate manifest drift: indexable file set has changed since last scan`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:101` builds the scope fingerprint independently as `code-graph-scope:v2:...`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:302` only fires the scope mismatch gate when the stored scope is not `scan-argument` and stored/active fingerprints differ.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:314` reads git HEAD, and `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:335` treats it as significant only when the diff is not out-of-scope.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241` builds the readiness block from an already-computed `ReadyResult`.

Exact predicate answer:

`candidate manifest drift` is a manifest count/digest predicate over `graphDb.getTrackedFiles()`. It is not the scope hash predicate, not the git HEAD predicate, and not a combined condition. It is evaluated after scope mismatch and significant git HEAD drift; those earlier branches can independently return `full_scan`, but they produce different reason text.

Exact message match:

The native error text matches code by composition. `detectState()` returns `candidate manifest drift: indexable file set has changed since last scan` from `ensure-ready.ts:364`; `ensureCodeGraphReady()` appends `; inline full scan skipped for read path` at `ensure-ready.ts:532`; `query.ts` then wraps that readiness reason in a blocked payload.

## NEW INSIGHTS
- The native trial's wording rules out scope fingerprint drift for the observed blocked reads, because the scope branch emits `code graph scope changed: ...`, not `candidate manifest drift`.
- `readiness-contract.ts` is downstream decoration only; the drift detector lives in `ensure-ready.ts`.
- The candidate manifest compares against DB-tracked paths from `code_files`, not a fresh filesystem candidate walk. That makes the comments about detecting brand-new indexable files look suspect, but proving that as a separate bug needs a focused test/read of the scanner candidate enumeration.
- Existing scope-readiness tests cover scope mismatch and per-call scan-argument trust, but the visible tests only cover manifest persistence round trips, not the read-after-explicit-scan drift sequence from the native rerun.

## OPEN QUESTIONS
- Why did the manifest count/digest differ immediately after a completed `includeSkills:true` scan in the native trial? The code path says it should match if `recordCandidateManifest(graphDb.getTrackedFiles())` ran over the same normalized paths later read by `detectState()`.
- Does `handleCodeGraphScan` skip `recordCandidateManifest()` when parser errors are present but still report status `completed`, leaving an old manifest baseline in place?
- Are tracked file paths stored with different normalization across scan and query roots in the native environment?
