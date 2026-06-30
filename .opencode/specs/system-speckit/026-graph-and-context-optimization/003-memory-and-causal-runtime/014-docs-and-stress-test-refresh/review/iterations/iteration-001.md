# Deep Review Iteration 001

## Dimension

- Focus: correctness (+ inventory pass)
- Scope class: complex
- Graph coverage: graphless fallback because code graph status was stale (`git HEAD changed`, stale files over threshold)

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:3`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:1-236`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:1-173`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:1-200`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:1-126`
- `.opencode/bin/lib/launcher-session-proxy.cjs:18-27,113-128,595-605,607-637,753-760`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2181-2315`
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389-498,515-533`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts:233-274,364-397,468-504`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/implementation-summary.md:60-78`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/decision-record.md:285-296`

## Findings by Severity

### P0

- None.

### P1

#### R1-P1-001 [P1] Recycle stress re-models the production replay path instead of driving it

- File: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76`
- Evidence: The stress test defines its own `replayAcrossRecycle()` helper as a "Faithful model of the proxy's replaySnapshot()" and uses it for the load assertions at lines 130 and 151. The real production behavior is in module-private `replaySnapshot()` at `.opencode/bin/lib/launcher-session-proxy.cjs:595-605`, which enqueues socket frames for replayable requests and emits `retryableErrorFrame(id)` to stdout for unsafe pending requests. That function is not exported by `__testing` at `.opencode/bin/lib/launcher-session-proxy.cjs:753-760`, so the stress can pass while the production replay/error-emission path regresses.
- Counterevidence sought: Existing proxy integration tests cover unsafe-tool classification at `mcp_server/tests/launcher-session-proxy.vitest.ts:233-274`, queued-request reattach exhaustion returning `-32001` at `:364-397`, and one replayable request across successful reattach/protocol drift at `:468-504`. They do not cover a successful recycle with an unsafe pending mutation receiving the retryable error while replayable requests are resent.
- Alternative explanation: The model may be intentional because the production replay function is module-private and the stress avoids sockets. That explains the design, but it does not make the stated stress guarantee executable against the production replay path.
- Final severity: P1
- Confidence: 0.84
- Downgrade trigger: Downgrade/close if a test drives `createSessionProxy()` or an exported test-only replay hook through successful reattach with both replayable and unsafe pending requests, asserting fresh-socket replay and exactly one `-32001` retryable client error for unsafe requests.
- Finding class: test-isolation
- Scope proof: Exact search for `checkpoint_restore|memory_delete|embedder_set|unsafe|non-replayable|retryable.*-32001|survivor|replay-me` in `launcher-session-proxy.vitest.ts` found unsafe names only in classifier coverage, not successful-reattach unsafe-pending output assertions.
- Recommendation: Add an integration-style proxy test using fake sockets for the successful recycle path, or expose a narrow `__testing` hook for the real replay function so the stress exercises production replay and error-frame emission instead of a parallel model.

### P2

#### R1-P2-001 [P2] Checkpoint stress assertion masks a missing `snapshotFormat` return field

- File: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:156-158`
- Evidence: The assertion uses `expect(created.snapshotFormat ?? 'v2').toBe('v2')`, so the test still passes if `createCheckpoint()` stops returning `snapshotFormat`. The production v2 path currently returns `snapshotFormat: 'v2'` at `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2294-2302`, so the stronger assertion is cheap and aligned with the actual contract.
- Final severity: P2
- Confidence: 0.91
- Finding class: test-isolation
- Scope proof: Direct read of the stress assertion and production return object shows the field is present today but the test does not require it.
- Recommendation: Change the assertion to `expect(created.snapshotFormat).toBe('v2')` so the stress gate catches a regression in returned checkpoint metadata.

## Traceability Checks

- `spec_code`: Partial. Server metadata is internally consistent: `context-server.ts` advertises `mk-spec-memory` version `1.8.0` and `mcp_server/package.json` is also `1.8.0`.
- `checklist_evidence`: Deferred to the traceability dimension. This correctness inventory used implementation-summary and decision-record anchors only where needed to assess stress-domain claims.
- `skill_agent`: Partial. The stress-domain implementation summary claims the daemon recycle case proves replayable reads survive and unsafe mutations get `-32001`; R1-P1-001 records the executable-path gap.
- `agent_cross_runtime`: Not applicable in this correctness pass.
- `feature_catalog_code`: Deferred to traceability.
- `playbook_capability`: Deferred to traceability.

## Verdict

- Verdict: CONDITIONAL
- Reason: One P1 correctness finding in the stress gate can allow a false-positive pass for successful-recycle unsafe mutation behavior.
- Advisories: One P2 assertion-strength finding.

## Next Dimension

- Recommended next dimension: security.
- Carry forward: Verify stress isolation boundaries and doc safety claims, especially no production DB/socket access and no misleading operator recovery guidance.
Review verdict: CONDITIONAL
