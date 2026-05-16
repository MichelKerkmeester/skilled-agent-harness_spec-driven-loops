# Iteration 5: Stabilization Pass

## Focus
Stabilization pass — Adversarial re-check of P1 findings (F001, F002), scan for overlooked correctness/security issues, verify convergence stability.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability (re-check)
- Files reviewed: 1 (`run-mcp-direct.mjs`)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings

No new findings. All 14 existing findings (2 P1, 12 P2) are confirmed stable.

### Adversarial Re-check: F001 (cleanup TypeError on null client)

- **Claim**: `connection.client?.close().catch(() => {})` at line 581 throws TypeError when `client` is null.
- **Hunter**: Re-read `connectSharedClient` return path at lines 281-294 — explicitly returns `client: null` on connect failure. Re-read `finally` block at lines 579-583 — line 581 is the cleanup path for all connections. Confirmed: `null?.close()` returns `undefined`, `.catch()` on `undefined` throws.
- **Skeptic**: Does the MCP SDK guarantee `Client.close()` succeeds synchronously and doesn't return a Promise? If `close()` is sync, maybe the entire chain works without `.catch()`. But the existing code uses `.catch(() => {})` at line 282 (`await client.close().catch(() => {})`), suggesting `close()` returns a Promise. The fix is the same regardless: guard the call or catch the TypeError.
- **Referee**: Upheld. Severity P1 stands. The null-client path is explicitly supported by `connectSharedClient` (spec: "partial connect failure emits a diagnostic row and falls back to memory-only behavior"). The cleanup should not crash under this supported failure mode.

**Verdict: UPHELD at P1.**

### Adversarial Re-check: F002 (no connect timeout)

- **Claim**: `client.connect(transport)` at line 273 has no timeout, risking indefinite hang.
- **Hunter**: Re-read `callTool` pattern at lines 189-197 — the codebase already wraps MCP calls in `Promise.race` with timeout. The `connectSharedClient` function does not. If a daemon process spawns but hangs during handshake, the runner hangs.
- **Skeptic**: Could the subprocess spawn itself have a timeout? The `StdioClientTransport` is created with `command` and `args` — it spawns the process internally. There's no `timeout` option in the transport options at lines 265-268. The MCP SDK's `Client.connect()` possibly has an internal timeout, but without documented evidence, we must assume it doesn't.
- **Referee**: Upheld. Severity P1 stands. The mitigation is straightforward (add Promise.race, 60s timeout) and the risk is real (daemon hang during handshake = runner hang).

**Verdict: UPHELD at P1.**

### Edge-Case Scan

The following edge cases were re-examined and confirmed correct:

| Edge Case | Verdict | Evidence |
|-----------|---------|----------|
| Both daemons fail to connect | Correct (except F001 cleanup) | Both diagnostics emitted; scenarios SKIP (empty tool sets); F001 then crashes cleanup. |
| CocoIndex connects but `listTools()` returns empty list | Correct | `toolNames` = empty Set; CocoIndex calls SKIP (tool unavailable). |
| `call.parseError` with set `call.server`/`call.tool` | Correct | Availability check passes (tool name exists); parseError check at line 448 catches it; SKIP with parse error detail. |
| `normalizeArguments` with both `num_results` and `limit` set | Correct | Line 119: `normalized.limit === undefined` check prevents overwrite; `num_results` kept as-is. |
| `waitForCocoIndexDaemonIdle` timeout (false return) | Correct | Runner continues; first cocoindex call may fail; 3x retry handles transient failures. |
| `createCappedStderrStream` when transport has no `stderr` | Correct | `transport.stderr?.on('data', ...)` uses optional chaining. |
| `execFileAsync` timeout for `ccc daemon status` | Correct | 5s timeout per probe (line 304); 2s sleep between probes; bounded overall by `timeoutMs`. |

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | — | Unchanged from It-3 (F009). |
| checklist_evidence | partial | hard | — | Unchanged from It-3 (F001). |

## Assessment
- New findings ratio: 0.00 — stabilization confirmed.
- Dimensions addressed: all 4 (re-check)
- Novelty justification: No new findings. This is the expected outcome for a stabilization pass — the review has saturated the codebase. The two P1 findings withstand adversarial scrutiny. No overlooked issues discovered.
- Convergence is confirmed: rolling average (0.04+0.06+0.00)/3 = 0.033, well below 0.08 threshold. All 4 dimensions covered. minStabilizationPasses satisfied (this is pass 1).

## Ruled Out
- **Additional error paths in `callScenarioTool`**: The retry logic correctly handles 3 cases: (1) thrown transient error → retry, (2) thrown non-transient error → throw, (3) response with transient failure → retry, (4) response with non-transient failure → return response, (5) response success → return response. All paths verified correct.
- **`buildLatencyWorkload` duplicates**: The 50 queries are distinct (17 short + 17 medium + 16 long). No duplicates.
- **`writeSummary` partial write**: `fs.writeFileSync` is atomic at the OS level for the full buffer. TSV evidence is complete or absent, never partial.

## Dead Ends
None.

## Recommended Next Focus
Convergence confirmed. Proceed to synthesis. Compile `review-report.md` with all 14 findings (2 P1, 12 P0), verdict CONDITIONAL (P1 findings present, no P0), convergence reasoning, and remediation workstreams.
