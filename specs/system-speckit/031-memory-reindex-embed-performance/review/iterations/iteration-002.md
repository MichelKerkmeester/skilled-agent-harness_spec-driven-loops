# Deep Review Iteration 002

## Dimension

Correctness — REQ-007 probe collapse (warm-owner MCP startup probe reuse + bounded Darwin `ps` inspection).

## Files Reviewed

| File | Lines touched | Claim verified |
|---|---:|---|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | 410-491 | `maybeBridgeLeaseHolder` forwards its own confirmed-alive deep probe via `initialReadyResult: probe` only after the `if (probe.status !== 'alive')` return at 471, so the forwarded value can never be a forged or partial result. |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | 397-400, 846-871 | `createSessionProxy`'s `initialReadyResult` is `options?.initialReadyResult` (undefined for reattach/cold-start); `start()` uses strict `status === 'alive'` to short-circuit `waitForDaemonReady()`. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | 316-333, 470-491, 1907-1915 | Bridge path forwards `initialReadyResult` (323-332); reattach/cold-start path does not (1909-1915); `readParentPid` `spawnSync` carries the bounded `timeout` option (483-487) and the `result.error` short-circuit handles ETIMEDOUT-kill cleanly. |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts` | 139-189, 191-200, 234-262 | Forwarding test (139-154) and the other REQ-007-adjacent bridge tests assert concrete bridge input; reverting the `initialReadyResult: probe` line makes them fail. |
| `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts` | 478-549 | Three REQ-007 tests assert probe-call counts: skip when `alive` (0), run normally (1), run when `dead` (1). Bypassing the guard — by removing the short-circuit or by shortening it to a truthy check — makes at least one of the three fail. |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md` | 110, 113, 140 | REQ-007 contract text, sources cited, and reattach-path-invariance risk statement. |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/checklist.md` | 176, 178 | CHK-070 ([P0]) and CHK-071 ([P1]) carry the checklist for REQ-007. |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/implementation-summary.md` | 188 | Phase 7 summary claims forwarded probe + bounded `ps` timeout; matches code. |

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

### Verification claims adjudicated (no severity warranted)

#### VERIFY-007-1 — `start()` skips the probe ONLY on strict `status === 'alive'`

- **File:** `.opencode/bin/lib/launcher-session-proxy.cjs:847-849`
- **Spec evidence:** `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md:110`
- **Test evidence:** `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts:478-549` (3-test describe block named `initialReadyResult (REQ-007 probe collapse)`)
- **Claim:** The guard `initialReadyResult && initialReadyResult.status === 'alive'` requires both a truthy `initialReadyResult` AND strict string equality on `'alive'`. A missing-`.status`, null, undefined, or non-`'alive'`-status result all fall through to `waitForDaemonReady()`.
- **Evidence refs:** `launcher-session-proxy.cjs:847` — guard; the bridge-side single producer of `initialReadyResult` in production is `maybeBridgeLeaseHolder`, which only enters the bridge branch at `launcher-ipc-bridge.cjs:485-491` after the `if (probe.status !== 'alive')` return at `:471`, so the forwarded object is always `{status:'alive', reason:...}` from the same deep probe the proxy would have otherwise repeated.
- **Counterevidence sought:** forged/partial `initialReadyResult` injection via the test seam (the `options` injection point at `launcher-session-proxy.cjs:400`). In production there is exactly one caller (`maybeBridgeLeaseHolder` at `launcher-ipc-bridge.cjs:489`) and one trust hand-off (`bridgeStdioThroughSessionProxy` at `mk-spec-memory-launcher.cjs:330`); the only realistic attacker would be an in-process test (covered by the bracketing tests); a hostile caller would still have to already control the launcher's stdin to inject a forged bridge-options object, which is out of band.
- **Alternative explanation:** the strict-equality could be replaced by a truthy check (`initialReadyResult && initialReadyResult.status`) — that would cause `{status:'dead'}` to incorrectly skip the probe. The session-proxy vitest test at `:526-548` (`initialReadyResult: { status: 'dead', reason: 'stale-from-caller' }` → `expect(probeCalls).toBe(1)`) is precisely the regression sentinel for this and passes, so the truthy-fallback regression does not currently exist.
- **Final severity:** no finding — verified correct.
- **Confidence:** 0.99.
- **Downgrade trigger:** if the guard short-circuited on truthy or on a non-strict status check, this would flip to a P1.

#### VERIFY-007-2 — Reattach/cold-start call site is unaffected

- **File:** `.opencode/bin/mk-spec-memory-launcher.cjs:1907-1915`
- **Spec evidence:** `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md:110, 140`
- **Test evidence:** `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts:503-524` (`still runs its own probe when no initialReadyResult is provided (reattach/cold-start path unaffected)`)
- **Claim:** The lease-owner primary path does NOT pass `initialReadyResult`, so `start()` falls through to `waitForDaemonReady(socketPath, probe, connect, log, { maxAttempts: maxColdStartAttempts })`. The prompt's hint "around line 1876-1882" is approximate; the actual call is at 1909-1915 inside the `if (launched)` branch right after `launchServer()`.
- **Evidence refs:** Grep over `.opencode/bin/mk-spec-memory-launcher.cjs` for `createSessionProxy` returns exactly two call sites — line 325 (inside `bridgeStdioThroughSessionProxy`, which DOES forward `initialReadyResult: options.initialReadyResult` at line 330) and line 1909 (the lease-owner startup, which does NOT). Production-side producers and consumers are balanced — only the bridge path forwards the probe result, and only the bridge path needs to.
- **Counterevidence sought:** if a third call site existed and skipped `initialReadyResult: probe` forwarding unintentionally, it would silently fall through to `waitForDaemonReady`. Grep returned only the two expected call sites.
- **Alternative explanation:** none — the two-call-site design (one forwarded, one not) is the documented warm-owner / reattach split per `implementation-summary.md:188`.
- **Final severity:** no finding — verified correct.
- **Confidence:** 0.99.
- **Downgrade trigger:** if a third call site were added without forwarding `initialReadyResult` while it should (e.g., a future "warm-detached" hot-attach path), this would need re-review.

#### VERIFY-007-3 — Bounded `ps` timeout is wired and ETIMEDOUT is handled

- **File:** `.opencode/bin/mk-spec-memory-launcher.cjs:482-491`
- **Spec evidence:** `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md:110`
- **Checklist evidence:** `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/checklist.md:178` (CHK-071)
- **Claim:** `spawnSync` is invoked with `timeout: parsePositiveInteger(process.env.SPECKIT_PS_PROBE_TIMEOUT_MS, 2000)` at line 486; the guard `if (result.error || result.status !== 0 || !result.stdout) return null;` at line 488 short-circuits on `result.error` (which Node sets with code `ETIMEDOUT` when the timeout fires) before any other failure mode is even inspected.
- **Evidence refs:** `mk-spec-memory-launcher.cjs:483-487` (the `spawnSync` options object including the `timeout` key); `mk-spec-memory-launcher.cjs:488` (the `result.error` short-circuit); `mk-spec-memory-launcher.cjs:284-288` (the `parsePositiveInteger` helper ensuring the default 2000ms is applied).
- **Counterevidence sought:** a Node version that sets `result.signal` but NOT `result.error` on timeout-kill — practically nonexistent in modern Node (since at least v14 the timeout option is part of the documented contract and sets an `error` on the result). Even if such a Node existed, the `result.status !== 0` branch would still fire (a killed-by-signal spawn has `status: null`), so the function still returns `null` instead of hanging.
- **Alternative explanation:** none — the bounded timeout is enforced by Node itself and the guard returns `null` on every failure mode I can construct.
- **Final severity:** no finding — verified correct.
- **Confidence:** 0.98.
- **Downgrade trigger:** if `spawnSync` were swapped for a `spawn`+`child.kill` pattern or if the timeout option were inadvertently dropped (e.g., during a future refactor of `readParentPid`), this would need to be re-checked.

#### VERIFY-007-4 — Test assertions are non-vacuous

- **File:** `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts:139-189, 191-200` and `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts:478-549`
- **Spec evidence:** `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md:140`
- **Claim:** Each new test fails if the guard it covers regresses; collectively they pin the forward edge, the absence-of-forward edge, and the strict-`'alive'` status semantics.
- **Evidence refs:**
  - `launcher-ipc-bridge-probe.vitest.ts:139-154` — asserts `bridgeOptions.initialReadyResult.toMatchObject({ status: 'alive' })`. Deleting the `initialReadyResult: probe,` line at `launcher-ipc-bridge.cjs:489` would leave `bridgeOptions.initialReadyResult === undefined` and fail this assertion.
  - `launcher-ipc-bridge-probe.vitest.ts:156-189` — asserts order of resolution when the bridge is async (`['bridge-start', 'bridge-end', 'decision-resolved']`); collateral coverage for the `await Promise.resolve(...)` wrapper at `launcher-ipc-bridge.cjs:485`.
  - `launcher-session-proxy.vitest.ts:479-501` — asserts `probeCalls === 0` when `initialReadyResult: { status: 'alive' }`. Deleting the short-circuit at `launcher-session-proxy.cjs:847-849` would let `waitForDaemonReady` fire → probeCalls = 1 → FAIL.
  - `launcher-session-proxy.vitest.ts:503-524` — asserts `probeCalls === 1` when no `initialReadyResult`. Could only be turned into a vacuous assertion if the test unconditionally seeded probe calls (it does not — `probeCalls` starts at 0 and increments only inside the injected `probe`).
  - `launcher-session-proxy.vitest.ts:526-548` — asserts `probeCalls === 1` when `initialReadyResult: { status: 'dead', reason: 'stale-from-caller' }`. If the guard used a truthy check (`initialReadyResult && initialReadyResult.status`) instead of strict `=== 'alive'`, the `'dead'` would short-circuit → probeCalls = 0 → FAIL.
- **Counterevidence sought:** assertions that would still pass after removing the guard. Every assertion checks either the shape of the bridge input OR a concrete probe-call count; both regress under the relevant removal.
- **Alternative explanation:** none — the three status-sentinel tests cover the truth-table exhaustively (alive → skip, dead → probe, absent → probe), which is exactly the contract the spec demands.
- **Final severity:** no finding — tests are non-vacuous.
- **Confidence:** 0.99.
- **Downgrade trigger:** if a future change made `start()` accept a different status semantic (e.g., renames `'alive'`), the three tests would need updating in lockstep.

## REQ-007 Hypothesis Adjudication

The implementation-summary claim at `implementation-summary.md:188` ("warm-owner path only; reattach/cold-start paths (which never pass this option) are unaffected") is accurate. Three independent verification points (the strict-equality guard, the absent `initialReadyResult` at the lease-owner primary call, the bounded `ps` timeout with `result.error` short-circuit) all confirm the intended behavior with file:line evidence. The session-proxy test suite already counts probe invocations, which is the strictest possible sentinel for probe-collapse regressions.

The bridge-side forwarding is also robust: `maybeBridgeLeaseHolder` short-circuits to a `respawn` decision on any non-`'alive'` deep-probe result (`launcher-ipc-bridge.cjs:471-474`), so the proxy's `initialReadyResult` can never receive a partial/forged/dead result from production code. The only way a forged status could reach the guard is via the test seam (`options?.initialReadyResult`), which is contractually under test control.

Test quality on both files matches or exceeds what is required to catch a regression: each test removes one specific bit of behavior and would fail under the corresponding guard removal. The three-test status-truth-table is a clean semantic pin.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | passed for REQ-007 | Spec `spec.md:110` compared to bridge `:471-491`, session-proxy `:847-849`, launcher `:323-332, 483-487, 1909-1915`. Behavior matches spec text in all four verification points. |
| `checklist_evidence` | passed for CHK-070 and CHK-071 | `checklist.md:176` and `:178` both ticked; the cited evidence (bridge/proxy/launcher/tests) genuinely exercises the warm-owner skip and the bounded `ps` timeout. |
| `feature_catalog_code` | notApplicable | No feature-catalog entry under REQ-007. |
| `skill_agent` | notApplicable | No skill-authoring change. |
| `agent_cross_runtime` | notApplicable | No agent-definition change. |
| `playbook_capability` | notApplicable | No playbook change. |

## SCOPE VIOLATIONS

None. Reviewed files remained read-only; writes are limited to the four authorized review-state paths.

## Verdict

PASS — REQ-007 matches its implementation-summary and spec claims. No new findings; the newFindingsRatio for this dimension is 0.0, so this dimension can be closed on the next convergence pass if it is not revisited.

Caveat: zero-finding dimensions in single-pass review are exactly the case where the "Finding = hypothesis" doctrine matters — these findings are confirmed (not merely inferred) by reading the cited lines and the test assertions, but a regression-introduction experiment (deleting `initialReadyResult: probe,` at `launcher-ipc-bridge.cjs:489` and re-running the focused vitest files) would close the loop deterministically. Recommended only as a follow-up if a future iteration question's confidence; not blocking.

## Next Dimension

Continue correctness into REQ-008 async-ingest `fromScan` fix in `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`'s `processFile` callback, cross-checked against `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts` T47c/T47c-2. Independently verify whether `memory-ingest.ts`'s job-queue crash-replay path has any OTHER call site of the dropped-from-context fix that the implementer might have missed (grep for `fromScan` over `mcp-server/` and `mcp-server/tests/`; expect the producer to be the `processFile` callback and the only consumer to be the test — any third caller is a missed fix site).

## Verification

- `wc -l` over the 8 reviewed files: 512 + 891 + 2018 + 394 + 779 + spec.md + checklist.md + implementation-summary.md (file-scope files plus the three spec docs that were grepped, not counted toward totals per the iteration-001 inventory convention).
- `rg -n "initialReadyResult" .opencode/bin` — exactly 5 matches across the three CJS files; only the production-side producer is `launcher-ipc-bridge.cjs:489`.
- `rg -n "createSessionProxy" .opencode/bin/mk-spec-memory-launcher.cjs` — exactly two call sites: bridge site `:325` (forwards `initialReadyResult`) and reattach site `:1909` (does not).
- `rg -n "spawnSync\(" .opencode/bin/mk-spec-memory-launcher.cjs | rg ps` — the bounded `ps` call is the only `spawnSync('ps', ...)` in the launcher, and it carries the `timeout:` option at `:486`.
- `rg -n "describe\(.\)" .opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts` — three tests under `initialReadyResult (REQ-007 probe collapse)` (`:478, 503, 526`).
- `rg -n "initialReadyResult" .opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts` — one test at `:139` and one test at `:264` (the latter tests `respawn`, not directly REQ-007).

Review verdict: PASS
