---
title: "Search RAG Measurement-Driven Implementation: W3-W7 Dispositions"
description: "Five deferred search and RAG workstreams measured with the Phase D harness. Three shipped as additive or default-on code. Two stayed opt-in because synthetic evidence did not justify production defaults."
trigger_phrases:
  - "search rag measurement implementation"
  - "W3 trust tree"
  - "W4 conditional rerank"
  - "W5 shadow learned weights"
  - "rag workstream dispositions"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/004-search-rag-measurement-implementation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Phase C had identified five search and RAG optimization workstreams (W3-W7) but deferred all of them until Phase D delivered a measurement harness. With the harness in place, Phase E ran each workstream through a baseline-variant-decision cycle and produced 11 JSON measurement snapshots as evidence.

Three workstreams shipped. W3 (composed RAG trust tree) landed as an additive helper in `lib/rag/trust-tree.ts`. W4 (conditional rerank gate) shipped default-on after the gate's internal ambiguity triggers were confirmed to skip rerank on simple queries, preserving latency. W5 (shadow learned weights) shipped as diagnostic-only output: it emits a `_shadow` field alongside live advisor scores without touching live registry weights. Two workstreams stayed opt-in. W6 (CocoIndex duplicate-density calibration) showed precision gains on fixture queries but carries overfetch cost, so it requires `SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH=1` to activate. W7 (degraded-readiness stress cells) shipped as focused test coverage for stale, empty, full-scan-required, unavailable code-graph states with no runtime behavior change.

All five decisions are backed by measurement JSON that records baseline metrics, variant metrics. The harness covered 11 files and 20 tests at exit.

### Added

- `mcp_server/lib/rag/trust-tree.ts` trust-tree composer (W3) that combines `memory.responsePolicy`, code-graph readiness, advisor trust state. Causal provenance signals are also composed.
- `mcp_server/lib/search/rerank-gate.ts` conditional rerank gate (W4) with internal triggers for ambiguity, authority, weak-evidence. Multi-channel disagreement is also a trigger.
- `mcp_server/lib/search/cocoindex-calibration.ts` duplicate-density telemetry (W6) behind the `SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH` flag
- `mcp_server/stress_test/search-quality/measurement-fixtures.ts` baseline and variant runner shared by all W3-W7 tests
- `mcp_server/stress_test/search-quality/measurement-output.vitest.ts` JSON measurement writer that persists 11 snapshot files under `measurements/`
- W3-W7 focused test files: `w3-trust-tree.vitest.ts`, `w5-shadow-learned-weights.vitest.ts`. Four `w7-degraded-*.vitest.ts` files cover degraded-readiness states.
- 11 measurement JSON files under `measurements/` covering baseline and variant per workstream plus the Phase D harness snapshot

### Changed

- `mcp_server/stress_test/search-quality/corpus.ts` extended with eight new fixture cases for W3-W6 and four W7 degraded-readiness cells
- `system-skill-advisor` scorer schema and `advisor-recommend` handler extended with W5 `_shadow` output alongside live scores. Live lane weights were not modified.
- `mcp_server/lib/search/pipeline/stage3-rerank.ts` updated to route through the W4 rerank gate

### Fixed

- None. Additive and opt-in changes only.

### Verification

| Check | Result |
|-------|--------|
| Phase D baseline JSON | PASS. Wrote `baseline-20260429T032525Z.json`. |
| W3-W7 measurement writer runs | PASS. Wrote 10 JSON files. |
| `npx vitest run mcp_server/stress_test/search-quality/ mcp_server/tests/query-plan-emission.vitest.ts` | PASS. 11 files. 20 tests. |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| Strict packet validator | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/stress_test/search-quality/corpus.ts` | Modified | Extended corpus with eight fixture cases for W3-W6 and four W7 degraded-readiness cells. |
| `mcp_server/stress_test/search-quality/measurement-fixtures.ts` | Created (NEW) | Shared baseline and variant runner for all W3-W7 workstreams. |
| `mcp_server/stress_test/search-quality/measurement-output.vitest.ts` | Created (NEW) | Vitest harness that writes JSON measurement snapshots to `measurements/`. |
| `mcp_server/lib/rag/trust-tree.ts` | Created (NEW) | W3 trust-tree composer. Combines memory policy, code-graph readiness, advisor trust state. Causal signals included. |
| `mcp_server/lib/search/rerank-gate.ts` | Created (NEW) | W4 conditional rerank gate. Internal triggers determine when rerank fires. Default-on. |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Modified | Routing updated to call through the W4 rerank gate. |
| `mcp_server/lib/search/cocoindex-calibration.ts` | Created (NEW) | W6 duplicate-density telemetry. Activates via `SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH`. |
| `mcp_server/stress_test/search-quality/w3-trust-tree.vitest.ts` | Created (NEW) | W3 focused tests. |
| `mcp_server/stress_test/search-quality/w5-shadow-learned-weights.vitest.ts` | Created (NEW) | W5 shadow weights tests. |
| `mcp_server/stress_test/search-quality/w7-degraded-*.vitest.ts` | Created (NEW) | Four W7 degraded-readiness coverage tests for stale, empty, full-scan, unavailable graph states. |

### Follow-Ups

- Synthetic benchmark scope: measurements prove fixture behavior, not production retrieval quality. Real-world lift from W3 and W4 should be confirmed once the harness runs against a broader corpus.
- Promote W6 to default-on if a production corpus confirms the duplicate-density precision gain without overfetch regressions. Current evidence is fixture-only.
- `rerank-gate.ts` and `cocoindex-calibration.ts` were removed in a later cleanup pass that stripped vestigial CocoIndex integration from the memory stack. The W4 gate logic was absorbed into `stage3-rerank.ts` directly.
