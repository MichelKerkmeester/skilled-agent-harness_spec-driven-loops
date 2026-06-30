---
title: "Changelog: Retrieval-Class Channel Weights Benchmark [007-dark-flag-graduation/002-retrieval-class-weights]"
description: "Chronological changelog for the Retrieval-Class Channel Weights Benchmark benchmark phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/002-retrieval-class-weights` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation`

### Summary

This phase benchmarked the default-off `SPECKIT_RETRIEVAL_CLASS_ROUTING` flag on the production search path. The flag suppresses the graph and degree channels for single-hop find-one queries. On a labeled set of ten single-hop and eight multi-hop queries driven through the production `executePipeline` against a read-only corpus backup, single-hop precision at one fell from 0.90 off to 0.80 on, a stable -0.10 across three runs, while multi-hop recall at ten held at 0.75 in both states with every multi-hop channel set and top-K byte-identical. The graph and degree channels were pulling the correct packet to rank one on `sh-skill-advisor-daemon`, so suppressing them dropped the answer. The flag lowers precision with no recall benefit. Verdict: CUT.

### Added
- `scripts/retrieval-class-routing-benchmark.mjs`: the prod-path benchmark harness that backs up the live database and active vector shard read-only, drives `executePipeline` flag-off vs flag-on across the labeled set, records the `routeQuery` channel set per query, and writes per-query rows and aggregate deltas to `results/metrics.json`.
- `results/metrics.json`: per-query and aggregate metric rollup for ten single-hop and eight multi-hop queries under both flag states, including the byte-identity flags for all multi-hop rows.
- `benchmark-results.md`: full per-query data tables, the default-off byte-identity evidence and the CUT verdict grounded strictly in the measured deltas.

### Changed
- Nothing in shared production code was modified. The harness imports the production `executePipeline` and `routeQuery` read-only. No query router, search flags file or classifier was edited.

### Fixed
- Nothing. This is a benchmark-only phase. No defect corrections were made to production code.

### Verification
- Prod-path benchmark ran against a read-only corpus backup, embedder `nomic-embed-text-v1.5`, exit 0.
- `results/metrics.json` reports all eighteen per-query rows with channel sets, suppression flags and precision or recall under both flag states, plus aggregate deltas.
- Single-hop precision@1: 0.90 off, 0.80 on, delta -0.10. Multi-hop recall@10: 0.75 off, 0.75 on, delta 0.00.
- All eight multi-hop channel sets and top-K results are byte-identical flag-off vs flag-on, confirmed on the production path.
- Deltas repeated identically across three consecutive deterministic runs.
- `node scripts/retrieval-class-routing-benchmark.mjs` reproduces `results/metrics.json` from the read-only corpus backup, exit 0.
- `validate.sh --strict` on this phase folder exits clean.

### Files Changed
- `scripts/retrieval-class-routing-benchmark.mjs`: prod-path benchmark harness over the labeled set, flag-off vs flag-on.
- `results/metrics.json`: per-query and aggregate metric rollup from the benchmark run.
- `benchmark-results.md`: data tables and CUT verdict grounded in `metrics.json`.
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`: phase spec-doc suite, marked complete with evidence.

### Follow-Ups
- The flat SingleHop suppression branch and the `SPECKIT_RETRIEVAL_CLASS_ROUTING` flag can be deleted. No production default was flipped in this phase.
- An entity-density-aware suppression variant that keeps graph and degree on high-degree single-hop queries was noted as a plausible future refinement but was not pursued here, since the current flag shows no win to refine toward.
