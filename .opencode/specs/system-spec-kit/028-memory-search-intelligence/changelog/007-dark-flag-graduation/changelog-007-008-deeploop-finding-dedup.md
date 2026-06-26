---
title: "Changelog: Deep-Loop Finding Dedup Benchmark [007-dark-flag-graduation/008-deeploop-finding-dedup]"
description: "Chronological changelog for the deep-loop finding dedup benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/008-deeploop-finding-dedup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation`

### Summary

This phase benchmarked three default-off deep-loop fan-out capabilities on the production merge and pool path: the near-duplicate finding dedup `SPECKIT_FANOUT_NEAR_DUP_DEDUP`, the lag-ceiling gauge, and the progress-heartbeat gauge. A labeled multi-worker fan-out finding set (17 source records across research and review lineages grounded in the real registry shape) was driven through the production `mergeResearchRegistries` and `mergeReviewRegistries` exports off vs on. The dedup collapsed every labeled near-duplicate restatement with pooled precision 1.0 and distinct-finding recall 1.0, removed 7 of 17 records as noise, kept the strongest severity on review collapse, and was byte-identical when off. The lag-ceiling fired exactly one warning when on and zero when off. The progress-heartbeat fired 43 steady records over a 2s run at a 0.05s cadence when on and zero when off. Verdict: GRADUATE for all three. No production default was flipped. The graduation flip is a separate evidence-gated decision this phase recommends but does not enact.

### Added
- `scripts/dedup-benchmark.mjs`: labeled fan-out finding set and dedup precision and distinct-finding recall harness over the production merge exports.
- `scripts/gauge-benchmark.mjs`: lag-ceiling and progress-heartbeat cadence and silence harness over the production pool and runner.
- `results/dedup-metrics.json`: per-path and aggregate dedup metric rollup (precision, recall, noise reduction, severity preservation, byte-identity).
- `results/gauge-metrics.json`: lag and heartbeat gauge metric rollup (events when on, zero events when off).
- `benchmark-results.md`: full data tables and three GRADUATE verdicts.

### Changed
- No shared production code was edited. All harnesses are read-only against the production modules and synthesize their own fixtures.

### Fixed
- Nothing corrected. This is a new benchmark phase with no prior measurement to supersede.

### Verification
- `node scripts/dedup-benchmark.mjs` exit 0, rebuilds `results/dedup-metrics.json`, reads no corpus or database.
- `node scripts/gauge-benchmark.mjs` exit 0, rebuilds `results/gauge-metrics.json`, reads no corpus or database.
- Pooled dedup precision 1.0 and distinct-finding recall 1.0 confirmed from `results/dedup-metrics.json`.
- Zero false-positive collapses across research and review paths confirmed from `results/dedup-metrics.json`.
- Lag-ceiling one warning when on, zero when off confirmed from `results/gauge-metrics.json`.
- Progress-heartbeat 43 records when on, zero when off confirmed from `results/gauge-metrics.json`.
- `validate.sh --strict` on this phase exits clean.

### Files Changed
- `scripts/dedup-benchmark.mjs`: new labeled fan-out set and dedup harness.
- `scripts/gauge-benchmark.mjs`: new lag-ceiling and progress-heartbeat harness.
- `results/dedup-metrics.json`: new dedup metric rollup.
- `results/gauge-metrics.json`: new gauge metric rollup.
- `benchmark-results.md`: new data tables and three GRADUATE verdicts.

### Follow-Ups
- The operator-facing default cadence for the progress-heartbeat is not yet picked. A production flip should tune the cadence to the typical lineage runtime so the signal is informative without being chatty.
- The lag-ceiling threshold that best separates a healthy slow lineage from a stuck one is a configuration question the benchmark does not settle and depends on the deployment's lineage timeout budget.
- The graduation flip for all three capabilities is a separate evidence-gated decision to be driven after the full suite verdicts land.
