---
title: "Cross-Cutting Cleanup 002: Search Query RAG Optimization"
description: "Measurement-first remediation for Phase C search and RAG fusion findings. A search-quality harness and telemetry-only query-plan contract shipped before any ranking behavior changes."
trigger_phrases:
  - "search query rag optimization changelog"
  - "search quality harness shipped"
  - "query plan telemetry"
  - "rag optimization measurement layer"
  - "002-search-query-rag-optimization"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/002-search-query-rag-optimization` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Phase C found that search optimization work had no shared outcome evidence. Two P1 findings required resolution before ranking changes could land. The search-quality harness and corpus had to exist first (F-001 and F-020). An explicit query-plan contract was required before query intelligence could be calibrated (F-004).

This packet delivered both. A deterministic search-quality harness now runs fixture queries through injectable channel runners and captures precision, recall, latency, refusal and citation metrics. The query-plan contract (`QueryPlan`) gives the query classifier, router and intent classifier a typed telemetry channel without touching routing behavior. Future RAG trust-tree, rerank, learned-fusion, CocoIndex calibration and degraded-readiness work can now evaluate against measured corpus data instead of intuition.

F-001, F-020 and F-004 are closed. F-002 through F-019 are deferred to workstreams 3 through 7, each of which requires harness data before changes land.

### Added

- Search-quality corpus under `mcp_server/stress_test/search-quality/corpus.ts` covering v1.0.1 and v1.0.2 stress themes plus ambiguous and paraphrase fixtures
- Injectable channel-runner harness (`harness.ts`) that captures per-channel candidates, final relevance, citation policy, refusal policy and latency
- Metrics module (`metrics.ts`) computing precision@k, recall@k, p50/p95/p99 latency, refusal-survival and citation-quality
- Deterministic harness baseline test (`baseline.vitest.ts`) that proves the harness and metric contracts against static runners without touching production databases
- Typed `QueryPlan` contract and builder helpers in `mcp_server/lib/query/query-plan.ts` with `intent`, `complexity`, `artifactClass`, `authorityNeed`, `selectedChannels`, `skippedChannels`, `routingReasons` and `fallbackPolicy` fields
- Query-plan emission test (`mcp_server/tests/query-plan-emission.vitest.ts`) covering simple, moderate, complex, ambiguous and paraphrase patterns

### Changed

- `query-classifier.ts` extended to return `queryPlan` with complexity telemetry beside its existing result shape
- `query-router.ts` extended to populate `selectedChannels`, `skippedChannels` and `routingReasons` in the query-plan
- `intent-classifier.ts` extended to populate `intent` and `authorityNeed` in the query-plan

### Fixed

- Phase C P1 gap: no shared search corpus existed before this packet. Future workstreams can now compare behavior against a labeled baseline.
- Phase C P1 gap: query classifier, router and intent classifier had no shared telemetry contract. Callers could not inspect routing decisions without reading internal state.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run mcp_server/stress_test/search-quality/baseline.vitest.ts mcp_server/tests/query-plan-emission.vitest.ts` | PASS: 2 files, 6 tests |
| `npx vitest run mcp_server/tests/query-classifier.vitest.ts mcp_server/tests/query-router.vitest.ts mcp_server/tests/intent-classifier.vitest.ts` | PASS: 3 files, 167 tests |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| Strict validator for this sub-phase (`validate.sh --strict`) | PASS: 0 errors, 0 warnings |
| Strict validator for source research packet | PASS: 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts` | Created (NEW) | Baseline corpus from v1.0.1 and v1.0.2 stress themes plus ambiguous and paraphrase fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts` | Created (NEW) | Injectable channel-runner harness and capture model |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/metrics.ts` | Created (NEW) | Precision, recall, latency, refusal and citation metrics |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/baseline.vitest.ts` | Created (NEW) | Deterministic harness baseline assertions |
| `.opencode/skills/system-spec-kit/mcp_server/lib/query/query-plan.ts` | Created (NEW) | Typed query-plan contract and builder helpers |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts` | Modified | Adds complexity query-plan telemetry beside existing result shape |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modified | Adds selected/skipped channel and routing-reason query-plan telemetry |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Modified | Adds intent and authority query-plan telemetry |
| `.opencode/skills/system-spec-kit/mcp_server/tests/query-plan-emission.vitest.ts` | Created (NEW) | Canonical query-plan emission coverage |

### Follow-Ups

- Runtime regression measurement is deferred. The harness baseline proves infrastructure only. Future packets should run larger corpus measurements before changing ranking or rerank behavior.
- Workstreams 3 through 7 remain planned. Composed RAG trust tree, conditional rerank, advisor learned weights, CocoIndex overfetch calibration and code graph degraded-readiness stress cells each need harness data before changes land.
