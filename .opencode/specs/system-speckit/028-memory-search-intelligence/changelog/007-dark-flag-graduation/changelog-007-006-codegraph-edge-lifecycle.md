---
title: "Changelog: Code-Graph Edge Lifecycle Dark-Flag Benchmark [007-dark-flag-graduation/006-codegraph-edge-lifecycle]"
description: "Chronological changelog for the code-graph edge lifecycle dark-flag benchmark phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/006-codegraph-edge-lifecycle` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation`

### Summary

This phase benchmarked the code-graph edge-lifecycle cluster of three default-off flags and returned a verdict for each. The fan-in rebind benchmark the staleness repair was explicitly gated on was run for the first time, proving force-reparsing importers rebinds cross-file edges correctly on 3 of 3 labeled cases and discriminating on the importer-unchanged kind-flip case. The first pass returned REFINE on the staleness repair and the bitemporal flag. A second refinement pass then built the degree cap and the bitemporal close-and-insert consumer, re-benchmarked both, and lifted the two REFINE verdicts to GRADUATE. Crucially, the bitemporal writer was wired into the proving consumer and confirmed correct, but a deep review of the live graph revealed that the bitemporal `invalid_at` column was NULL across all 70427 edges because the production edge-replace path still hard-deletes superseded edges rather than closing them. That read confirmed the refinement builds the correct machinery and proves the query but does not yet wire the writer into the reindex path, keeping the GRADUATE recommendation honest about the remaining step. The governance flag is CUT: the live data is already vocab-compliant and no current producer can violate the CHECK. No default is flipped by this phase. Final verdicts: edge-staleness repair GRADUATE, bitemporal reads GRADUATE, governance vocab CUT.

### Added

- `scripts/edge-staleness-rebind-benchmark.mjs`: the fan-in rebind benchmark over a labeled rename, kind-flip and move fixture, driving the shipped compiled scan handler and DB lib against a throwaway SQLite database, writing `results/staleness-metrics.json`.
- `scripts/edge-staleness-cost-benchmark.mjs`: the degree-cap cost benchmark measuring a hot 30-importer dependency and a low-fan-in dependency against the new `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP`, writing `results/cost-metrics.json`.
- `scripts/bitemporal-asof-benchmark.mjs`: the smallest proving consumer benchmark exercising `closeEdgesForSources`, `insertEdgeWithValidity` and `asOfEdgesFrom` against a throwaway graph, writing `results/bitemporal-metrics.json`.
- `results/staleness-metrics.json`: per-case rebind-correctness rollup from the rebind benchmark.
- `results/cost-metrics.json`: forced-importer and scan-time rollup from the cost benchmark.
- `results/bitemporal-metrics.json`: as-of read correctness and closed-edge count from the bitemporal benchmark.
- `benchmark-results.md`: data tables and the three measured verdicts grounded strictly in the metrics.

### Changed

- `lib/structural-indexer.ts`: added `getReverseDepDegreeCap` reading `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` (default 0, uncapped) and a filter that drops a refactored dependency from the force-parse expansion when its `queryFileDegrees` importer degree exceeds the cap.
- `lib/code-graph-db.ts`: added `closeEdgesForSources`, `insertEdgeWithValidity` and `asOfEdgesFrom` behind the existing `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` flag. Both refinements are byte-identical when their flag is off.

### Fixed

- No defect fixes. The phase is a benchmark and refinement pass, not a repair to a previously incorrect behavior.

### Verification

 - Rebind benchmark (`node scripts/edge-staleness-rebind-benchmark.mjs`) - PASS, exit 0, rebind-correct on 3 of 3 cases, discriminating on the kind-flip case, deterministic across runs.
 - Cost benchmark (`node scripts/edge-staleness-cost-benchmark.mjs`) - PASS, exit 0, hot 30-importer dependency drops from 30 forced re-parses to 0 under a degree-10 cap, incremental scan from 37.07 ms to 21.10 ms, low-fan-in dependency still rebinds.
 - Bitemporal benchmark (`node scripts/bitemporal-asof-benchmark.mjs`) - PASS, exit 0, as-of read at the past generation returns the old target, current read returns the new one, 1 closed edge recorded, flag-off is a no-op.
 - Typecheck (`npm run typecheck`) - PASS, exit 0.
 - Focused regression suite - PASS, 21 targeted tests across staleness, bitemporal, governance and cross-file, plus 105 in the broader indexer and scan sweep, no regression.
 - Byte-identity (flag off) - PASS, both refinements confirmed byte-identical when their flag is off, proven directly in the benchmarks.
 - Strict validation (`validate.sh --strict`) - PASS, exit 0 on this phase folder.

### Files Changed

- `scripts/edge-staleness-rebind-benchmark.mjs`: fan-in rebind benchmark harness (created).
- `scripts/edge-staleness-cost-benchmark.mjs`: degree-cap cost benchmark harness (created).
- `scripts/bitemporal-asof-benchmark.mjs`: bitemporal close-and-insert proving benchmark (created).
- `results/staleness-metrics.json`: rebind-correctness metrics rollup (created).
- `results/cost-metrics.json`: fan-in cost metrics rollup (created).
- `results/bitemporal-metrics.json`: as-of read correctness metrics rollup (created).
- `benchmark-results.md`: three measured verdicts with data tables (created).
- `lib/structural-indexer.ts`: degree cap added behind `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` (modified).
- `lib/code-graph-db.ts`: `closeEdgesForSources`, `insertEdgeWithValidity` and `asOfEdgesFrom` added behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` (modified).

### Follow-Ups

- Wire `closeEdgesForSources` and `insertEdgeWithValidity` into the `replaceEdges` / `replaceNodes` reindex path behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` before the flag flips. The staleness repair already detects the exact moment a symbol identity changes and is the natural write site.
- Set `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` to a sensible ceiling when flipping the staleness flag. The cost benchmark informs the tuning but does not fix the value.
- Revisit `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` only if an untyped or external edge writer is ever added. Absent that path the CUT verdict stands.
