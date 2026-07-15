# Iteration 9 — traceability — spec-packet-017

**Verdict:** FAIL

Adversarial traceability review of the 017 spec packet (spec.md + implementation-summary.md) against the shipped implementation in `.opencode/skills/system-spec-kit/mcp_server`. Dispatched to gpt-5.5-fast (high). Real verdict returned.

## Findings

- **[P1] R2 overstates opt-out semantics because full-auto paths bypass the false env flags**
  - File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on/spec.md` (line 102)
  - Evidence: Spec says "Each feature is disabled by setting its env to `false`". Shipped code still enables work in explicit full-auto paths: `shouldRunPostInsertEnrichment` returns `plannerMode === 'full-auto' || isPostInsertEnrichmentEnabled()` at handlers/save/post-insert.ts:143-144, reconsolidation uses `plannerMode === 'full-auto' || isSaveReconsolidationEnabled()` at handlers/save/reconsolidation-bridge.ts:497, and quality auto-fix uses `mode === 'full-auto' || isQualityAutoFixEnabled()` at handlers/quality-loop.ts:591.
  - Recommendation: Either make the false env flags authoritative even in full-auto/replay paths, or amend R2/docs to state that the opt-out applies to default planner-first saves and can be overridden by explicit full-auto/backfill modes.

- **[P1] R6 and SC-003 claim full-suite completion while verification is still incomplete and current full test run is not green**
  - File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on/spec.md` (line 106)
  - Evidence: Spec says "R6: Full test suite green" and SC-003 says affected suites are green. The implementation summary says "Full suite: in progress" at implementation-summary.md:81 and "Live: pending" at implementation-summary.md:82. A current `npm run test` in `.opencode/skills/system-spec-kit/mcp_server` reported multiple failed test files and then timed out after 120000 ms.
  - Recommendation: Do not mark R6/SC-003 as satisfied until the full suite completes green, or downgrade the spec/implementation-summary status to reflect partial verification with the exact passing checks only.

- **[P2] R3 names the wrong response field for async enrichment status**
  - File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on/spec.md` (line 103)
  - Evidence: Spec says the response reports `enrichmentStatus = deferred`. The shipped response schema exposes `postInsertEnrichment?: PostInsertOperationResult` at handlers/save/types.ts:190 and assigns it with `result.postInsertEnrichment = postInsertEnrichment` at handlers/save/response-builder.ts:430-435; the status is `postInsertEnrichment.status`, with `persistedState` holding the per-step enrichment status.
  - Recommendation: Update R3/SC wording to name the shipped API shape: `postInsertEnrichment.status === 'deferred'` and `postInsertEnrichment.reason === 'async-background'`.
