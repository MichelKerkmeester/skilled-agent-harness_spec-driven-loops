---
title: "OFF Baseline Audit: WEIGHT_RERANKER Penalty Decision Gate"
description: "Phase 1 of the rerank decision arc measured the mk-spec-memory OFF baseline on a 50-probe fixture. Hit-rate@5 reached 0.12 against a 0.70 threshold, producing an OFF_DEFICIENT verdict. No source-code patch shipped. Phase 2 bge-v2-m3 trial was unlocked with concrete lift targets derived from this run."
trigger_phrases:
  - "off baseline audit"
  - "weight reranker penalty removal"
  - "off deficient verdict"
  - "rerank decision arc phase 1"
  - "spec memory baseline measurement"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc`

### Summary

`mk-spec-memory` reported `requestQuality: 'weak'` on every `memory_search` call because `WEIGHT_RERANKER=0.20` is a boolean penalty that drops max achievable confidence from 1.00 to 0.80 when no reranker sidecar is running. The penalty was added on an untested assumption that reranking is load-bearing. Before removing it, Phase 1 measured the actual OFF baseline on the existing 50-probe fixture.

The benchmark ran with `SPECKIT_CROSS_ENCODER=false` and `RERANKER_LOCAL=false`. Hit-rate@5 landed at 0.12 against a required 0.70 threshold. NDCG@10 reached 0.11 against 0.65. Forty-four of 50 probes recorded recall misses across all three query categories (arc-context, paraphrase, terminology). The verdict is `OFF_DEFICIENT`: the retrieval path is not finding target documents reliably enough to justify removing the penalty. Phase 2 was unlocked with a concrete lift target of Recall@5 >= 0.17 with recall misses reduced from 44 to 22 or fewer.

No source-code change shipped. The `WEIGHT_RERANKER` constant and the `rerankerFactor` conditional in `confidence-scoring.ts` remain unchanged.

### Added

- Baseline evidence file `evidence/off-baseline-2026-05-21.json` with per-probe hit-rate, NDCG@10, recall@5 and latency data for all 50 fixture probes (113 KB)
- Per-category breakdown table in the implementation summary covering arc-context, paraphrase and terminology query categories
- Failure mode count table listing 44 recall misses, 0 ranking inversions and 0 empty-result probes
- Phase 2 lift targets written to `002-bge-v2-m3-trial/spec.md`: Recall@5 >= 0.17, recall misses <= 22, ranking inversions = 0

### Changed

- Implementation summary `§Verdict` section records `OFF_DEFICIENT` with the numeric gate values and the decision rationale
- Arc parent `011-spec-memory-rerank-decision-arc/spec.md` continuity updated: `recent_action` set to "OFF baseline measured. verdict OFF_DEFICIENT" and `next_safe_action` set to "Dispatch Phase 2 bge-v2-m3 trial with Phase 1 targets"

### Fixed

None.

### Verification

| Check | Result |
|---|---|
| Fixture probes run | 50 of 50. PASS |
| Hit-rate@5 | 0.12 vs threshold 0.70. FAIL (expected at gate. verdict is OFF_DEFICIENT) |
| NDCG@10 | 0.11 vs threshold 0.65. FAIL (expected at gate) |
| Zero-recall categories | 0. PASS |
| Direct handler replay output | `verdict: "OFF_DEFICIENT"`. PASS |
| Strict packet validation | `validate.sh --strict` exit 0. Errors: 0. Warnings: 0. PASS |
| Vitest | Not run. No patch path executed because verdict is OFF_DEFICIENT |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `evidence/off-baseline-2026-05-21.json` (NEW) | Created | Per-probe benchmark output: hit-rate, NDCG@10, recall@5, p50/p95 latency for all 50 fixture probes |
| `001-off-baseline-audit/implementation-summary.md` | Updated | Baseline Numbers table, Penalty Site citation, Verdict section, Failure Analysis table, Commit Handoff list |
| `001-off-baseline-audit/spec.md` | Updated | Status field set to "Complete (OFF_DEFICIENT. no scoring patch)" |
| `001-off-baseline-audit/tasks.md` | Updated | Task completion state recorded |
| `001-off-baseline-audit/graph-metadata.json` | Updated | Derived status and last-save timestamp refreshed |
| `011-spec-memory-rerank-decision-arc/spec.md` | Updated | Arc parent continuity fields reflecting OFF_DEFICIENT outcome |
| `002-bge-v2-m3-trial/spec.md` | Updated | Phase 2 lift targets populated from Phase 1 data |

### Follow-Ups

- Extend the fixture beyond 50 probes before re-running if a future verdict lands near the threshold boundary. The current sample size is statistically thin for borderline cases.
- Add no-reranker regression coverage to the vitest suite so a future `WEIGHT_RERANKER` patch is guarded against silent retrieval regressions outside the benchmark harness.
- Retain the Phase 2 and Phase 3 scaffolds for future re-evaluation if the OFF baseline degrades as the corpus grows.
- Investigate the 16 stale `gold_memory_ids` in the fixture. They were scored against `gold_doc_ids` as a fallback, but updating the fixture to use current memory IDs would eliminate that ambiguity for future runs.
