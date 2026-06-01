---
title: "Rerank Arc Phase 008: Cap Rerank Top-K Bench and HOLD Verdict"
description: "Added a SPECKIT_RERANK_LOCAL_MAX_DOCS env override to cap the local rerank batch and re-benched Qwen3-Reranker-0.6B on MPS at cap=10. All three decision gates failed. The batch-size hypothesis was falsified. The env override stays as a useful operator tunable."
trigger_phrases:
  - "cap rerank top-k"
  - "speckit_rerank_local_max_docs override"
  - "mps oom batch size hypothesis"
  - "rerank local max docs cap"
  - "008 cap top-k hold verdict"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

Packet 007 showed Qwen3-Reranker-0.6B on Apple Silicon MPS crashing with a 76 GiB MTLBuffer allocation when spec-memory sent its default 50-document batch to the local rerank endpoint. The working hypothesis was that smaller batches would fit inside GPU memory. This packet added a `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override to `cross-encoder.ts` that clamps the local provider's batch to 10 documents, then ran a fresh 3x50-probe A/B bench under that cap.

All three decision gates failed at cap=10: hit-rate dropped 0.013 below baseline, p95 latency ballooned to 11016 ms. Sidecar reach fell to 14.7%. More critically, the OOM worsened rather than improved, with allocations of 76 GiB and 135 GiB recorded during the bench run. Apple Silicon's MPS framework appears to reserve full attention-graph buffers regardless of input batch shape. The batch-size hypothesis was falsified.

The env override remains in source post-HOLD as a useful operator tunable for cost-per-document API quota scenarios. The model pin in `cross-encoder.ts:54` was reverted to `ms-marco-MiniLM-L-6-v2` after the bench.

### Added

- `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override in `cross-encoder.ts:478` that applies `Math.min(providerCap, parsed)` for the local provider only
- Benchmark directory `benchmarks/benchmark-2026-05-21-cap-top-k/` with fixture, two arm run files plus a benchmark report documenting the HOLD verdict

### Changed

- `cross-encoder.ts` local provider batch path now reads `SPECKIT_RERANK_LOCAL_MAX_DOCS` before computing `providerCap`. Cloud providers (Voyage, Cohere) are unaffected.
- Model pin in `cross-encoder.ts:54` reverted to `cross-encoder/ms-marco-MiniLM-L-6-v2` after the bench (had been set to Qwen for the bench run).

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| Gate 1 (hit-rate delta >= +0.02) | FAIL. Observed -0.013 (52/150 vs 54/150 baseline). |
| Gate 2 (p95 delta <= +500 ms) | FAIL. Observed +9885 ms (11016 ms vs 1130 ms baseline). |
| Gate 3 (sidecar reach >= 0.95) | FAIL. Observed 0.147 (22 of 150 rows reached cross-encoder). |
| MPS OOM reproduced | Confirmed. 76 GiB and 135 GiB MTLBuffer allocations at cap=10. |
| Env override stays in dist | Confirmed. `SPECKIT_RERANK_LOCAL_MAX_DOCS` present in compiled output. |
| Model pin reverted | Confirmed. `cross-encoder.ts:54` restored to ms-marco-MiniLM-L-6-v2. |
| Strict packet validation | Passed. `validate.sh --strict` exit 0. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | `SPECKIT_RERANK_LOCAL_MAX_DOCS` env read added at line 478. Local provider batch capped via `Math.min`. Model pin reverted to ms-marco post-bench. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-cap-top-k/benchmark_report.md` (NEW) | HOLD verdict report with per-arm aggregates. Gate evaluations plus OOM evidence included. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-cap-top-k/rerank-ab-fixture.json` (NEW) | 50-probe fixture reused from packets 004 and 007. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-cap-top-k/runs/arm-a-off.jsonl` (NEW) | 150-row Arm A run. Sidecar off. Positional scoring baseline. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-cap-top-k/runs/arm-b-cap10.jsonl` (NEW) | 150-row Arm B run. Sidecar on, cap=10, MPS. Cross-encoder reached 22 rows. |

### Follow-Ups

- Test additional batch-size values (5, 15, 20) only if future evidence suggests the 10-doc OOM was borderline rather than structural.
- Test CPU device at cap=10 if a future packet determines the MPS buffer reservation is the sole constraint and CPU overhead is acceptable.
- Investigate fp16 weights as an orthogonal memory lever (covered by packet 009).
