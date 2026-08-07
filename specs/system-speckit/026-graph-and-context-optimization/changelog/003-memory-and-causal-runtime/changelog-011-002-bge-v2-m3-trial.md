---
title: "bge-reranker-v2-m3 off-the-shelf trial: HOLD verdict"
description: "Phase C/D benchmark for BAAI/bge-reranker-v2-m3 against the spec-memory 50-probe fixture. The model matched the OFF quality baseline with zero per-probe improvement, exceeded the p95 latency cap by 10x. The rerank sidecar was unresponsive after the run. Verdict: HOLD."
trigger_phrases:
  - "bge-reranker-v2-m3 trial"
  - "bge v2 m3 spec-memory benchmark"
  - "rerank decision arc phase 2"
  - "cross-encoder hold verdict"
  - "rerank sidecar bge hold"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc`

### Summary

The spec-memory rerank arc had already ruled out two off-the-shelf cross-encoders: Qwen3-Reranker-0.6B timed out on CPU plus OOM'd on MPS at 50-doc batches. ms-marco-MiniLM-L-6-v2 regressed 6 hits below the OFF baseline. The hypothesis for Phase 2 was that a stronger generalist model, BAAI/bge-reranker-v2-m3 (568M parameters, Apache-2.0, multilingual diverse-text training), would close the gap without fine-tuning.

The Phase C/D benchmark ran the same 50-probe fixture against the bge-v2-m3 model already loaded in the local sidecar. Per-probe deltas vs the OFF baseline were identical across all 50 probes: hit-rate@5 held at 0.12, recall@5 at 0.12. NDCG@10 held at 0.11 with 44 of 50 probes still missing at @5. The p95 latency reached 10591 ms, over 9500 ms beyond the +500 ms cap. After the run, the sidecar stopped responding to `/health` checks.

All three failure classes are wide failures, not close calls. No source patch was made. Phase 3 (fine-tune) inherits bge-v2-m3 as the established comparison floor.

### Added

- `evidence/bge-v2-m3-bench-2026-05-21.json` (NEW): per-probe console metrics reconstructed from the completed replay run, preserving all 50 fixture results with hit and latency values
- `evidence/phase-ab-prep-2026-05-21.md` (NEW): Phase A/B sidecar allowlist prep log, recording the HuggingFace revision pin and warmup confirmation

### Changed

- None. No source files were modified. `cross-encoder.ts` was left pointing at `cross-encoder/ms-marco-MiniLM-L-6-v2` because the HOLD verdict blocks the default flip.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Pre-run sidecar health (`curl -sf http://localhost:8765/health`) | PASS. `model_loaded: true`, `model_name: BAAI/bge-reranker-v2-m3`, `queue_depth: 0` |
| 50-probe fixture completion | PASS. All 50 probes ran without crash or OOM |
| Hit-rate@5 gate (>= 0.18) | FAIL. Achieved 0.12, matched OFF baseline |
| Recall@5 gate (>= 0.17) | FAIL. Achieved 0.12, needs 0.17 |
| Recall misses gate (<= 22) | FAIL. 44 of 50 probes missed at @5 |
| Ranking inversions gate (= 0) | PASS. Zero ranking inversions |
| p95 latency gate (<= 1057.529 ms) | FAIL. Achieved 10591.245 ms, 9533 ms over cap |
| Post-run sidecar health | FAIL. `curl` exit 28, HTTP 000 (timeout) |
| Packet strict-validate (`validate.sh --strict`) | PASS. Exit 0 |
| Arc parent strict-validate | PASS. Exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `evidence/bge-v2-m3-bench-2026-05-21.json` | Created | Per-probe benchmark metrics for all 50 fixture probes. Reconstructed from console output because the process blocked on post-run health before serializing rows. |
| `evidence/phase-ab-prep-2026-05-21.md` | Created | Phase A/B allowlist and sidecar prep log with HuggingFace revision SHA and warmup confirmation. |

### Follow-Ups

- Investigate the sidecar post-run health timeout before running Phase 3. A model that hangs the sidecar after a 50-probe batch is a lifecycle risk for production use.
- Confirm whether the 16 stale `gold_memory_ids` in the current `memory_index` would materially affect recall scores if refreshed. The fixture was authored against an earlier index snapshot.
- Phase 3 (fine-tune) uses bge-v2-m3 as the model to beat. The HOLD outcome establishes 0.12 hit-rate@5 and 10591 ms p95 as the off-the-shelf ceiling for this corpus.
