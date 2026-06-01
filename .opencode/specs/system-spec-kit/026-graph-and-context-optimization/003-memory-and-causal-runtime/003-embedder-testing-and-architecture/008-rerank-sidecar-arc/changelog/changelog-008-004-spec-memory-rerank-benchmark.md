---
title: "Rerank Sidecar Arc Phase 004: spec-memory A/B Benchmark"
description: "A 50-probe controlled A/B benchmark comparing positional-fallback scoring against Qwen3-Reranker-0.6B on spec-memory's own corpus. Arm B fell back on all 250 rows producing a HOLD verdict. Phase 005 promotion is deferred pending sidecar timeout and device-tuning remediation."
trigger_phrases:
  - "spec-memory rerank benchmark"
  - "qwen vs positional fallback"
  - "rerank ab benchmark hold"
  - "rerank sidecar arc phase 004"
  - "cat-24 benchmark fixture"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

Cocoindex's earlier benchmark showed Qwen3-Reranker-0.6B winning by only +1 hit out of 73 probes on code chunks. Because spec-memory indexes natural-language prose with paraphrase queries, that code-retrieval evidence was insufficient to justify promoting Qwen as the default reranker. A controlled A/B benchmark was needed to produce domain-specific evidence before phase 005 could make a promotion decision.

A 50-probe fixture was authored by combining 10 probes from cat-24/409 with 12 from cat-13/416-418 plus 28 fresh current-corpus paraphrase probes. Both arms ran n=5 times against a snapshot of the live memory index. Arm A (positional-fallback baseline) and Arm B (Qwen sidecar) each produced 250 JSONL rows. Arm B recorded 250 out of 250 rows with `scoringMethod=fallback`, indicating the sidecar degraded to the baseline path on every probe. The measured hit-rate delta was +0.4 pp. MRR delta was +0.004. p95 latency delta was +9832.7 ms. All three metrics fail the promotion gates defined in the spec. The verdict is HOLD. Phase 005 will keep Qwen opt-in and treat sidecar timeout remediation as a prerequisite for any future promotion attempt.

### Added

- `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json` (NEW): 50-probe deterministic fixture combining cat-24/409 with cat-13/416-418 plus fresh paraphrase probes
- `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md` (NEW): sk-doc 10-section benchmark report with HOLD verdict in section 8
- `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/results.csv` (NEW): per-arm aggregate metrics including hit-rate, MRR@10, p95/p50/p99 latency plus 95% CI bounds
- `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe.jsonl` (NEW): 500 combined rows (50 probes, 2 arms, 5 runs each)
- `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/SOURCE.md` (NEW): fixture provenance and pointer to this spec packet
- A/B harness scripts in `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/` (NEW): `run-ab.sh`, `run_arm.sh`, `run_arm.py`, `aggregate.py`, `generate_report.py`

### Changed

- None. Benchmark-only phase producing new artifacts.

### Fixed

- None. Benchmark-only phase producing new artifacts.

### Verification

| Check | Result |
|---|---|
| Fixture size | 50 probes |
| Gold ID verification | 50/50 `gold_memory_ids` resolve |
| Arm A rows | 250 |
| Arm B rows | 250 |
| Combined rows | 500 |
| Hit-rate delta | +0.4 pp |
| MRR@10 delta | +0.004 |
| p95 latency delta | +9832.7 ms |
| Arm B scoring | 250/250 fallback rows |
| Verdict | HOLD |
| sk-doc validate (`validate_document.py`) | Exit 0 |
| Strict packet validate (`validate.sh --strict`) | Exit 0 |

### Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/SOURCE.md` (NEW) | Fixture provenance and spec-packet pointer |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md` (NEW) | sk-doc 10-section benchmark report, HOLD verdict in section 8 |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json` (NEW) | 50-probe deterministic fixture file |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/results.csv` (NEW) | Per-arm aggregate metrics with CI bounds |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe.jsonl` (NEW) | 500 raw per-probe result rows |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe-arm-a.jsonl` (NEW) | Arm A per-probe rows |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe-arm-b.jsonl` (NEW) | Arm B per-probe rows |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-ab.sh` (NEW) | Top-level A/B harness orchestrator |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.py` (NEW) | Per-arm runner invoking `memory_search` via JSON-RPC |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/aggregate.py` (NEW) | Aggregation script computing hit-rate, MRR, latency percentiles |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py` (NEW) | Report generator applying the promotion decision rule |

### Follow-Ups

- Address sidecar timeout and device-tuning issues before attempting any future promotion benchmark. The HOLD verdict reflects a production-path failure. The actual Qwen quality on spec-memory prose is still unknown.
- Re-run the benchmark with the sidecar confirmed active (verify `scoringMethod != fallback` on at least a sample of Arm B rows before accepting results).
- Evaluate cross-machine p95 latency on hardware representative of production before using latency numbers as a promotion gate input.
- Consider expanding the fixture to 100 or more probes to reduce confidence interval width if a future benchmark produces a borderline delta.
- Add non-English paraphrase probes if spec-memory is extended to multi-language content.
