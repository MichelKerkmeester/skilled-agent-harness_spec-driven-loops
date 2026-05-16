# Iteration 1: Correctness

## Focus
D1 Correctness — Two-client lifecycle, retry policy, partial-connect edge cases, tool-name routing, stderr capping, and concurrency safety in `run-mcp-direct.mjs`.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 1 (`run-mcp-direct.mjs`, 591 lines)
- New findings: P0=0 P1=2 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.28

## Findings

### P1 — Required

- **F001**: `finally` cleanup throws TypeError on null client — `run-mcp-direct.mjs:581`
  - **Evidence**: Line 581: `connection.client?.close().catch(() => {})`. When `connectSharedClient` returns `client: null` (partial connect failure), `null?.close()` evaluates to `undefined`, then `.catch(() => {})` throws `TypeError: Cannot read properties of undefined (reading 'catch')`. This is a synchronous throw inside the `.map()` callback, causing `Promise.all` to never execute. Both client close and stderr stream end are skipped for ALL connections. The TSV summary IS written (line 580 executes first), but daemon processes may leak.
  - **Category**: correctness
  - **Recommendation**: Guard with a null check: `connection.client ? connection.client.close().catch(() => {}) : Promise.resolve()`. Alternatively, wrap in try/catch: `try { await connection.client?.close(); } catch {}`.
  - **Claim adjudication**:
    ```json
    {
      "findingId": "F001",
      "claim": "`connection.client?.close().catch(() => {})` at line 581 throws TypeError when `client` is null, aborting cleanup for all connections.",
      "evidenceRefs": [
        "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs:581",
        "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs:281-294"
      ],
      "counterevidenceSought": "Checked if `.catch()` is valid on undefined in Node.js ESM — confirmed it is not. Checked if the MCP SDK's `Client.close()` returns a non-Promise that doesn't need `.catch()` — irrelevant since the expression fails before `.close()` is called when client is null.",
      "alternativeExplanation": "If both clients always connect successfully (which the smoke run demonstrated), the bug is latent. However, the `connectSharedClient` function explicitly returns `client: null` as a supported failure mode, and the spec mandates 'partial connect failure emits a diagnostic row and falls back to memory-only behavior'.",
      "finalSeverity": "P1",
      "confidence": 0.92,
      "downgradeTrigger": "If the MCP SDK guarantees `Client.close()` always succeeds synchronously without returning a Promise, the `?.` chain pattern would still need review but the practical impact would be lower.",
      "transitions": [
        { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
      ]
    }
    ```

- **F002**: No timeout on `client.connect()` — `run-mcp-direct.mjs:273`
  - **Evidence**: Line 273: `await client.connect(transport)` inside `connectSharedClient`. Unlike `callTool` (which has a 120s race-with-timeout at line 189-197), there is no timeout wrapping the `client.connect()` call. If the daemon process starts but hangs during the MCP handshake (e.g., due to a stuck background scan), the runner hangs indefinitely. The `waitForCocoIndexDaemonIdle` check (line 297-316) runs AFTER connect, so it cannot prevent a connect hang.
  - **Category**: correctness
  - **Recommendation**: Wrap `client.connect(transport)` in `Promise.race` with a timeout (e.g., 60s), similar to the `callTool` pattern at line 189-197. The timeout should trigger the catch path that emits a diagnostic row.
  - **Claim adjudication**:
    ```json
    {
      "findingId": "F002",
      "claim": "`client.connect(transport)` at line 273 has no timeout, so a hung daemon during MCP handshake causes the runner to hang indefinitely.",
      "evidenceRefs": [
        "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs:272-273",
        "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs:189-197"
      ],
      "counterevidenceSought": "Checked whether the MCP SDK's `StdioClientTransport` or `Client.connect()` has built-in timeout behavior — SDK source not installed locally, but the runner already wraps `callTool` in a timeout (line 189-197), suggesting connect timeouts are not provided by the SDK. Checked if `waitForCocoIndexDaemonIdle` covers the hang — it runs after connect (line 550-557 guard), so it doesn't.",
      "alternativeExplanation": "If the MCP SDK `Client.connect()` has an internal timeout (e.g., 30s), the finding would be a P2 documentation gap rather than a P1 correctness issue. Without SDK source, this can't be confirmed.",
      "finalSeverity": "P1",
      "confidence": 0.82,
      "downgradeTrigger": "If MCP SDK documentation or source confirms a built-in connect timeout on `StdioClientTransport`.",
      "transitions": [
        { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
      ]
    }
    ```

### P2 — Suggestion

- **F003**: `parseObjectLiteral` uses `Function()` constructor as JSON.parse fallback — `run-mcp-direct.mjs:138`
  - **Evidence**: Line 138: `const value = Function('"use strict"; return (' + trimmed + ');')();`. When `JSON.parse()` fails on tool call arguments, the `Function()` constructor evaluates the string as JavaScript. This allows arbitrary code execution from playbook content. While playbook files are trusted repository content (not user input), this is an unnecessary code-execution surface that violates the principle of least privilege. A safer approach would be a hand-rolled JS object literal parser or restricting to JSON5.
  - **Category**: correctness (also security-adjacent)
  - **Recommendation**: Replace with a safe object-literal parser (e.g., a simple tokenizer that only handles string/number/boolean/null literals and nested objects/arrays, rejecting function calls and expressions). Alternatively, require playbook argument blocks to be valid JSON.

- **F004**: `responseFailureMessage` may miss error patterns — `run-mcp-direct.mjs:203-209`
  - **Evidence**: The function checks only `response.isError`, `parsed.error`, and `parsed.success === false`. Other common MCP tool error patterns (e.g., `parsed.status === 'error'`, `parsed.code` with non-zero value, `parsed.result.error`) would be missed. This means `callScenarioTool` at line 216-238 could return a response with an undetected error, causing `runGenericScenario` at line 466 to count it as a success.
  - **Category**: correctness
  - **Recommendation**: Add broader error detection: check `parsed?.status === 'error'`, `parsed?.code !== undefined && parsed?.code !== 0`, or treat any response where `structuredContent` parsing failed as suspect. Consider logging unrecognized response shapes for forensic debugging.

- **F005**: `runGenericScenario` fail-fast loses parallel-call information — `run-mcp-direct.mjs:447-476`
  - **Evidence**: Lines 447-476 execute calls sequentially and return immediately on first error (`return { scenario, verdict: 'FAIL', ... }`). If a scenario has multiple tool calls (e.g., 3 cocoindex searches), only the first failing call is reported; the others are never attempted. This makes debugging multi-call scenarios harder because the operator doesn't know whether later calls would also fail.
  - **Category**: correctness
  - **Recommendation**: Collect results for all calls before deciding the verdict. A partial-success verdict (e.g., "2/3 calls succeeded") gives the operator more information. Alternatively, log attempted-but-unreached calls as SKIP with a "not reached due to prior failure" reason.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | spec.md:73-86 | Scope section describes two-client architecture; implementation matches. |
| checklist_evidence | pass | hard | checklist.md:62-66 | CHK-012 claims "both clients close in finally" — technically true for success path, but broken for partial-connect as documented in F001. |

## Assessment
- New findings ratio: 0.28 (5 findings across 591 lines; most of the code is correct)
- Dimensions addressed: correctness
- Novelty justification: 5 novel findings. No prior review of this code path exists. F001 (null-client cleanup) is the highest-impact finding as it violates the documented partial-connect resilience contract. F002 (connect timeout) is a robustness gap. F003-F005 are edge-case improvements.
- The code is well-structured overall: two-client architecture is sound, retry policy is reasonable (3 attempts with 8s backoff), stderr capping is correct at the boundary, and tool-name routing unambiguously disambiguates by server name.

## Ruled Out
- **Data races between daemon stdout/stderr streams**: Node.js is single-threaded with async I/O. The two `StdioClientTransport` instances have independent stdout/stderr streams. The `connections` array is only read/written sequentially in `main()`. No concurrent mutation risk.
- **selectClientForServer returning wrong client for `spec_kit_memory`**: The function checks `clients.spec_kit_memory ?? clients.memory ?? null` at line 127. The actual `clients` object uses keys `spec_kit_memory` and `cocoindex_code` (line 566-569), matching the first check. The fallback keys (`memory`, `cocoindex`) exist only in test fixtures.
- **Stderr log cap silently drops entire chunk at boundary**: Line 250 writes `buffer.subarray(0, remaining)` to capture partial chunk up to the cap. The remaining bytes are dropped but the cap notice is appended at line 253. This is correct documented behavior.

## Dead Ends
None.

## Recommended Next Focus
D2 Security — Evaluate command injection surface in `StdioClientTransport` args, `Function()` constructor code-execution risk (F003 spans both correctness and security), env variable propagation, and stderr log sensitivity.
