---
title: "spec-memory MPS Rerank Promotion Candidate: HOLD Verdict"
description: "Qwen3-Reranker-0.6B on Apple Silicon MPS delivered a 19x per-call speedup in smoke but triggered GPU out-of-memory at the full 20-doc bench batch shape, crashing the sidecar and failing all three promotion gates. Default stays SPECKIT_CROSS_ENCODER=false."
trigger_phrases:
  - "spec-memory mps rerank promotion"
  - "qwen mps sidecar oom"
  - "speckit_cross_encoder mps hold"
  - "rerank-sidecar mps bench verdict"
  - "008-rerank-sidecar 007 mps"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

Spec-memory's `SPECKIT_CROSS_ENCODER` default remained off after Phase 005 locked a HOLD for CPU because Qwen3-Reranker-0.6B exceeded the MCP rerank-gate timeout on 77 percent of probes. This packet investigated whether routing the sidecar to Apple Silicon MPS would change that verdict. Phase A smoke confirmed a promising signal: 155 ms per 3-doc rerank at ~19x speedup over CPU. Phase C bench (50 probes, 20-doc Stage 3 batches under `memory_search` load) exposed the hard constraint: MPS GPU memory could not hold Qwen's attention forwards at the production batch shape. The sidecar crashed mid-run with `MPS backend out of memory` allocating 76 GB, leaving 116 of 150 Arm B rows degraded to positional fallback. All three promotion gates failed by large margins. HOLD applied: `cross-encoder.ts:54` reverted to `cross-encoder/ms-marco-MiniLM-L-6-v2` and `SPECKIT_CROSS_ENCODER` default stays false.

### Added

- `benchmark-2026-05-21-spec-memory-mps/benchmark_report.md` (NEW): nine-section bench report covering smoke evidence, A/B methodology, Arm A and Arm B result tables, gate evaluations, OOM log excerpt and HOLD verdict with follow-on candidates.
- `benchmark-2026-05-21-spec-memory-mps/runs/arm-a-off.jsonl` (NEW): 150-row Arm A baseline (sidecar OFF).
- `benchmark-2026-05-21-spec-memory-mps/runs/arm-b-mps.jsonl` (NEW): 150-row Arm B v1 run (MPS, without explicit env propagation).
- `benchmark-2026-05-21-spec-memory-mps/runs/arm-b-mps-v2.jsonl` (NEW): 150-row Arm B v2 run (MPS, with `RERANK_DEVICE=mps` exported through bench shell to confirm env propagation was not the bug).
- `benchmark-2026-05-21-spec-memory-mps/rerank-ab-fixture.json` (NEW): canonical 50-probe fixture reused from Phase 004 for apples-to-apples comparison.

### Changed

- Arc 008 parent `spec.md` phase-map row 007 updated to HOLD status.
- Arc 008 parent `graph-metadata.json` derived status restored to complete with `last_active_child_id` repointed to 007.

### Fixed

- `cross-encoder.ts:54` reverted from Qwen to `cross-encoder/ms-marco-MiniLM-L-6-v2` after the HOLD verdict. A post-HOLD Qwen pin would silently route the next opt-in operator to a model the sidecar cannot serve reliably at the bench batch shape.

### Verification

| Check | Result |
|-------|--------|
| Phase A smoke: `/warmup` loaded Qwen in 3.6 s, `/rerank` returned 200 with sigmoid scores at 155 ms for a 3-doc batch | PASS |
| Phase A env check: `ps -E -p $PID` confirmed `RERANK_DEVICE=mps` in the sidecar process env | PASS |
| Phase C bench v2 Arm A (sidecar OFF): hits=51, hit-rate=0.340, p95=1111 ms | PASS (baseline captured) |
| Phase C bench v2 Arm B (Qwen on MPS): hits=49, hit-rate=0.327, p95=11049 ms, sidecar reach=0.23 | FAIL |
| Gate 1 (hit-rate delta >= +0.02): delta=-0.013 | FAIL |
| Gate 2 (p95 delta <= +500 ms): delta=+9938 ms | FAIL |
| Gate 3 (sidecar reach >= 0.95): reach=0.23 | FAIL |
| OOM evidence captured in uvicorn log: `MPS backend out of memory`, `Failed to allocate private MTLBuffer for size 76457536000` | PASS (evidence preserved) |
| `cross-encoder.ts:54` reverted to ms-marco post-HOLD | PASS |
| Strict-validate this packet (`validate.sh --strict`): exit 0 | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/benchmark_report.md` (NEW) | Created | Nine-section A/B bench report with smoke evidence, OOM log, gate evaluations, HOLD verdict |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/rerank-ab-fixture.json` (NEW) | Created | Canonical 50-probe fixture copied from Phase 004 harness unchanged |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/runs/arm-a-off.jsonl` (NEW) | Created | 150-row Arm A result set, sidecar OFF baseline |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/runs/arm-b-mps.jsonl` (NEW) | Created | 150-row Arm B v1 result set, Qwen on MPS without explicit env export |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/runs/arm-b-mps-v2.jsonl` (NEW) | Created | 150-row Arm B v2 result set, Qwen on MPS with `RERANK_DEVICE=mps` exported |
| `.opencode/specs/.../008-rerank-sidecar-arc/spec.md` | Updated | Phase-map row 007 set to HOLD |
| `.opencode/specs/.../008-rerank-sidecar-arc/graph-metadata.json` | Updated | `derived.status` restored to complete. `last_active_child_id` repointed to 007 |

### Follow-Ups

- Cap Stage 3 `HIGH_TOP_K` from 20 to 5-10 and re-bench Qwen on MPS. A smaller attention buffer may fit within the MPS memory ceiling and is the cheapest follow-on candidate.
- Bench `ms-marco` (80 MB) or `BGE` (600 MB) on MPS at the same batch shape. Both have smaller attention footprints than Qwen and should fit. Whether MPS changes the hit-rate ordering penalty seen on the 2026-05-21 CPU ms-marco run remains open.
- Test quantized Qwen (`Qwen3-Reranker-0.6B-Q4_K_M`), which would cut model memory ~3-4x. Requires a new model artifact and revalidation.
- Implement per-model device assignment in the sidecar (Qwen on CPU for cocoindex, ms-marco on MPS for spec-memory opt-in). Not in scope for this packet.
