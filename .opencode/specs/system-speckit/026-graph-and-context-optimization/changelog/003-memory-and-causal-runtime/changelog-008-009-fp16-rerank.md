---
title: "fp16 Cross-Encoder Weights on MPS: Third Orthogonal Lever Falsified"
description: "Qwen3-Reranker-0.6B loaded in fp16 on Apple Silicon MPS to halve weight memory. Phase A smoke passed at 1.1s with no OOM. Full bench reproduced the OOM pattern from packets 007 and 008 because production spec docs are 4-8x longer than the smoke fixture. fp16 cuts weight memory but not the MPS kernel-scratch allocations causing the ceiling breach. RERANK_TORCH_DTYPE env handler remains in code as a useful operator tunable."
trigger_phrases:
  - "fp16 rerank mps"
  - "rerank torch dtype"
  - "half precision qwen reranker"
  - "mps oom fp16 bench"
  - "009 fp16 rerank hold"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

Packet 007 found that Qwen3-Reranker-0.6B on Apple Silicon MPS OOMs at the default 50-doc batch. Packet 008 tried capping the batch size and also held. This packet attacked from the weights side: loading in fp16 instead of fp32 cuts model memory roughly in half (~750 MB vs ~1.5 GB) and was expected to reduce per-call activation memory too.

Phase A added the `RERANK_TORCH_DTYPE` env handler to `rerank_sidecar.py:_load_model` and confirmed Qwen loads cleanly in `torch.float16` on MPS. A 50-doc lorem-ipsum smoke returned HTTP 200 in 1.1s with no OOM. Phase D ran the same 50-probe A/B fixture used in packets 004, 007 and 008 against production spec docs. MPS OOMs reappeared: sidecar crashed mid-bench and only 23 of 150 probes reached the cross-encoder before fallback fired. All three decision gates failed. fp16 cuts weight tensor memory but the binding constraint is MPS kernel-scratch buffer allocations (76 GiB and 135 GiB attempts recorded), which are dtype-independent. The `RERANK_TORCH_DTYPE` handler stays in the sidecar as an opt-in operator tunable. Three orthogonal runtime levers exhausted. Packet 010 domain fine-tune path is the remaining candidate.

### Added

- `RERANK_TORCH_DTYPE` env handler in `rerank_sidecar.py:_load_model` accepting `float16`, `fp16`, `half`, `bfloat16`, `bf16` (default unset, preserves fp32 behavior)
- `RERANK_TORCH_DTYPE` added to `scripts/start.sh` env allowlist
- `benchmarks/benchmark-2026-05-21-fp16-rerank/` with fixture, two arm run files and `benchmark_report.md` documenting the smoke-vs-bench divergence

### Changed

- `rerank_sidecar.py:_load_model` now passes `model_kwargs={"torch_dtype": ...}` to `CrossEncoder` when `RERANK_TORCH_DTYPE` is set

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| Phase A python smoke: `dtype: torch.float16` on `mps:0`, 596M params | PASS |
| Phase B sidecar warmup: `status:warmed` in 2847 ms | PASS |
| Phase C 50-doc OOM smoke: HTTP 200 in 1122 ms, 50 sigmoid scores, sidecar PID alive | PASS |
| Phase D bench Gate 1 (HR delta >= +0.02): Arm B 52/150 vs Arm A 54/150, delta -0.013 | FAIL |
| Phase D bench Gate 2 (p95 delta <= +500 ms): p95 10900 ms vs baseline 1112 ms, delta +9788 ms | FAIL |
| Phase D bench Gate 3 (reach >= 0.95): 23/150 probes reached cross-encoder, reach 0.153 | FAIL |
| Verdict: HOLD. `RERANK_TORCH_DTYPE` handler stays in sidecar. Defaults unchanged. | HOLD |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | `RERANK_TORCH_DTYPE` env handler added in `_load_model`. Supports float16, fp16, half, bfloat16, bf16. Defaults to fp32 when unset. |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | `RERANK_TORCH_DTYPE` added to the env allowlist. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-fp16-rerank/benchmark_report.md` (NEW) | Full A/B bench report with §1-§8 documenting smoke-vs-bench divergence and verdict. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-fp16-rerank/rerank-ab-fixture.json` (NEW) | 50-probe fixture reused from packets 004, 007 and 008. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-fp16-rerank/runs/arm-a-off.jsonl` (NEW) | Arm A baseline run, 150 rows. |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-fp16-rerank/runs/arm-b-fp16.jsonl` (NEW) | Arm B MPS fp16 run, 150 rows. 23 cross-encoder reaches before OOM cascades. |

### Follow-Ups

- Investigate whether stacking packet 008 cap-top_k with this packet's fp16 dtype narrows the MPS kernel-scratch allocation further.
- Consider bf16 bench only if a future model variant shows dtype-sensitive OOM behavior distinct from Qwen3-Reranker-0.6B.
- Revisit fp16 on CUDA hardware if deployment target expands beyond single-user Apple Silicon.
