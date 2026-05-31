---
title: "Phase G: W3-W7 Runtime Wiring and Enterprise Readiness Audit"
description: "Telemetry-first runtime wiring that connects W3-W7 search and RAG decisions into a shared SearchDecisionEnvelope with durable audit surfaces, tenant scope threading plus a real degraded-readiness integration test supplement."
trigger_phrases:
  - "w3 w7 runtime wiring"
  - "search decision envelope"
  - "telemetry first search audit"
  - "phase g runtime wiring"
  - "enterprise readiness audit wiring"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/002-runtime-wiring-enterprise-readiness-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit`

### Summary

Phase F found that W3-W7 search and RAG decision workstreams existed as isolated measured artifacts: W3 (trust tree) and W6 (CocoIndex calibration) were test-only. W5 (advisor shadow) was response-only. W7 (degraded readiness) was fixture-only. W4 (conditional rerank) received an unknown empty QueryPlan that prevented gate telemetry. Without a shared decision envelope, the search stack could not audit trust, rerank, shadow scoring, calibration or degraded-readiness state per request.

Phase G wired all five workstreams into a request-scoped `SearchDecisionEnvelope` (a versioned struct carrying QueryPlan, trust tree, rerank decision, advisor shadow deltas, CocoIndex calibration telemetry, degraded-readiness state, tenant scope, timing plus audit metadata). The envelope attaches to every uncached `memory_search` and `memory_context` call and appends one JSONL audit row via `decision-audit.ts`. Default ranking, refusal, routing plus overfetch behavior are unchanged. Two empty directory stubs left from earlier cleanup passes were removed.

### Added

- Versioned request-scoped decision envelope with pure composition helpers (`mcp_server/lib/search/search-decision-envelope.ts`, NEW).
- W8 vitest coverage for empty, full plus partial envelope composition.
- `queryPlan?: QueryPlan` and decision telemetry slots added to pipeline types (`mcp_server/lib/search/pipeline/types.ts`).
- Real QueryPlan built from query routing and intelligence in `mcp_server/handlers/memory-search.ts` and threaded into Stage 3.
- Append-only shadow delta sink with file rotation for W5 advisor shadow persistence.
- JSONL decision audit sink with SLA metric helpers (`mcp_server/lib/search/decision-audit.ts`, NEW).

### Changed

- W3 trust tree consumed through the envelope composer so every request records a trust snapshot.
- Stage 3 rerank gate now receives a real upstream QueryPlan instead of an unknown empty fallback, enabling gate telemetry on every request.
- W4 tests updated to assert complex-query and high-authority triggers fire with the real plan.
- Advisor `_shadow` recommendations recorded to the append-only sink on each response.
- Python compatibility translation preserves `_shadow` payload through the shim.
- W6 recommended multiplier emitted into envelope telemetry without changing effective overfetch limit.
- `memory_search` and `memory_context` handlers call the audit sink and record one decision row per uncached completed request where an envelope exists.

### Fixed

- W7 fixture files reasserted as fixture-only supplements. A new real degraded code-graph integration test now covers actual isolated degraded state rather than static fixture output.
- Two empty directory stubs removed: the `tmp-test-fixtures/specs/` candidate and a duplicate empty measurements stub under `004-search-rag-measurement-implementation/`.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run` targeting W8, W4, W11, W10, W13, shadow-sink plus Python compat | PASS, exit 0, 7 files and 14 tests. |
| `npx vitest run` targeting full search-quality suite plus query-plan-emission, shadow-sink plus Python compat | PASS, exit 0, 17 files and 32 tests. |
| `npm run typecheck` | PASS, exit 0. |
| `npm run build` | PASS, exit 0. |
| `bash validate.sh ... --strict` on this packet | PASS, exit 0. |
| `rg "buildTrustTree` and `calibrateCocoIndexOverfetch` and `recordSearchDecision"` production consumer scan | PASS, all consumers found. |
| Empty directory audit (`find` follow-up) | PASS, both target directories removed and no paths returned. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/search/search-decision-envelope.ts` (NEW) | Created | Versioned request-scoped envelope, composition helpers, attach utilities. |
| `mcp_server/lib/search/decision-audit.ts` (NEW) | Created | JSONL audit sink and SLA metric helpers. |
| `mcp_server/lib/search/pipeline/types.ts` | Modified | QueryPlan slot and decision telemetry fields added to pipeline contracts. |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Modified | Real QueryPlan threaded in. Unknown empty fallback replaced with telemetry-only unknown plan. |
| `mcp_server/handlers/memory-search.ts` | Modified | Builds and audits SearchDecisionEnvelope per uncached request. |
| `mcp_server/handlers/memory-context.ts` | Modified | Builds and audits SearchDecisionEnvelope per uncached request. |
| `mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts` | Modified | Asserts real-plan triggers for complex-query and high-authority cases. |
| `mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts` (NEW) | Created | Empty, full plus partial envelope composition coverage. |
| `mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts` | Modified | Real isolated code-graph degraded state replaces static fixture output. |
| Two empty directory stubs | Deleted | F-EMPTY-001 cleanup. `tmp-test-fixtures/specs/` and duplicate measurements stub removed. |

### Follow-Ups

- Cached `memory_search` responses do not rebuild full pipeline envelopes. The audit row is emitted only when the pipeline executes and an envelope exists. Cached-path audit coverage is deferred.
- W6 overfetch promotion remains deferred. The envelope reports `recommendedMultiplier` but `effectiveLimit` still follows the existing opt-in flag path. Promotion requires a separate measurement decision.
- Audit retention relies on file rotation only. JSONL rotation caps file size, but dashboards and long-term retention policy are future enterprise-readiness work.
