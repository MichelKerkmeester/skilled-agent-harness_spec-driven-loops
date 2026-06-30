---
title: "Changelog: Deterministic-Ranking Benchmark [005-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark]"
description: "Chronological changelog for the deterministic-ranking benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Benchmarked the 041 `SPECKIT_DETERMINISTIC_RANKING` flag against the real corpus to decide whether it can graduate to default-on. A read-only in-process harness embedded each of the twelve benchmark queries once and drove the production `executePipeline` six times per query, three flag-off and three flag-on, so only ranking varied across the 72 cells. Flag-ON ranking is perfectly reproducible at determinism 1.0, but removing the wall-clock recency inputs diverges materially from the current default on 5 of 12 queries, mean top-K overlap 0.69 and Kendall tau 0.73. Recency is load-bearing on real-match queries and the corpus carries no ground-truth that the deterministic order is better, so the verdict is STAY DEFAULT-OFF and keep the flag as an opt-in reproducibility tool. This phase ships measured data and a verdict, not code.

### Added

- A reproducible benchmark harness in `scripts/deterministic-ranking-benchmark.mjs`, opening a read-only backup of the live 17,599-row corpus with the active `nomic-embed-text-v1.5` embedder, embedding once and reusing the embedding across the 72 runs so only ranking varies.
- `results/metrics.json`, the per-query determinism reading and the off-vs-on divergence triplet of top-10 Jaccard overlap, Kendall tau and mean composite-score delta.
- `benchmark-results.md`, the per-query rows, the aggregate means and the verdict.

### Changed

- No production code changed. The run is read-only against a corpus backup, with the flag toggled only through `process.env` inside the run, so no flag default was changed and no memory record was written.

### Fixed

- No fixes recorded. This phase measures the flag and records a graduation verdict, it does not change behavior.

### Verification

- Flag-ON reproducibility - PASS, mean determinism 1.0 across all twelve queries, stable within a run and across separate process invocations.
- Off-vs-on divergence - mean top-K overlap 0.686 and mean Kendall tau 0.731, both below a 0.95 graduation bar, mean score delta 0.0047 so the reordering is the whole story.
- Material divergence - 5 of 12 queries past the 0.8 overlap bar, `agent` and `deep-loop` keeping about 18% of the top-10, `routing` at 0.429, `semantic-search` at 0.667 and `quality` flipping to a negative rank correlation at overlap 0.333.
- Divergence localized to real matches - off-corpus and maximally-vague queries (`kubernetes`, `authentication`, `the-thing-with-confidence`) show zero divergence at overlap 1.0 and tau 1.0, so recency does useful work only where competing matches exist.
- Reproduce - `node scripts/deterministic-ranking-benchmark.mjs` rebuilds `results/metrics.json` from the backup with byte-identical flag-ON orderings across runs.
- Docs gate - PASS, `validate.sh --strict` on this phase exits clean.

### Files Changed

- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark/scripts/deterministic-ranking-benchmark.mjs`: created the read-only 72-cell graduation harness.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark/results/metrics.json`: created the per-query determinism and divergence data.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark/benchmark-results.md`: created the per-query rows and the verdict.

### Follow-Ups

- Per the stay-off verdict and the operator directive to remove benchmark-rejected stay-off flag code, the `SPECKIT_DETERMINISTIC_RANKING` flag and its gated branches were removed, reverting to the default recency-on ranking. The always-on trigger id tie-break that shipped alongside it was kept as the pure-win part.
- Revisiting deterministic ranking later would be a fresh implementation gated on a labeled-relevance benchmark showing it does not lose relevant results, not just a reproducibility argument.
- The flag code is being removed in a subsequent change per the STAY DEFAULT-OFF verdict, since no measured win justifies carrying it. The opt-in reproducibility use is recorded so the deletion is a considered call rather than a loss of capability.
