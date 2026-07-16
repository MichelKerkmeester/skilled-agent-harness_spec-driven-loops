---
title: "023B Fixture Calibration: Expanded Retrieval Fixture and Perturbation Harness"
description: "Expanded the mcp-coco-index retrieval benchmark from 18 regression probes to 73 calibration probes with a repeated-run sweep harness, residual miss taxonomy and ROBUST verdict gates. Closed 13 HIGH and MED findings from the deep-research arc."
trigger_phrases:
  - "023B fixture calibration"
  - "expanded retrieval fixture"
  - "calibration perturbation harness"
  - "ROBUST verdict gates"
  - "residual miss taxonomy"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

The corrected 18-probe fixture established a regression floor but could not measure production retrieval coverage. It had single-run binary scoring, no residual miss taxonomy and no evidence for RRF K, hybrid boost, rerank top-K or fusion choices.

023B expanded the fixture to 73 probes spanning six profile categories: 18 original, 15 architecture-invariant, 10 multilingual/code-switched, 5 short, 5 long and path-class-stratified probes with at least five truth targets per class. A Python helper (`calibration_perturbation.py`) provides fixture schema validation, mean/stddev/CI95 aggregation, RRF flat-line variance checks and residual miss classification. A shell runner (`run-expanded-bench.sh`) supports `--runs 3` for statistical confirmation and covers RRF K, boost, rerank top-K and fusion-alternative lanes. Evidence docs define the ROBUST gates, default-change recommendation and miss taxonomy. Defaults were held unchanged because the full n>=3 sweep was not run inside this packet. Thirteen HIGH and MED findings from the deep-research arc were closed or explicitly routed.

### Added

- Expanded fixture `code-retrieval-fixture-expanded-v2.json` with 73 probes across six profile categories
- `calibration_perturbation.py` aggregation and taxonomy helper with mean/stddev/CI95 and RRF flat-line variance assertion
- `run-expanded-bench.sh` long-run sweep runner supporting `--runs 3` across RRF K, boost, rerank top-K and fusion alternative lanes
- Evidence docs in `evidence/` covering ROBUST verdict gates, calibration recommendation, residual miss taxonomy and expanded calibration summary
- Live smoke run output `evidence/runs/lane-sample-smoke-run-1.json` with documented 3/5 hit result

### Changed

- Fixture profile expanded from regression-floor-only to stratified calibration with per-probe difficulty, category, truth path-class breakdown and predicted failure mode annotations
- Residual miss classification now maps misses to 023C diagnostic counter fields

### Fixed

- `run-expanded-bench.sh` used `GROUPS` as a local bash variable, which is a bash-readonly builtin array. The assignment silently failed and caused every lane to be skipped. Renamed to `LANE_GROUPS`.
- Harness files were not staged in the initial commit and were missing from the shipped state. Added in a follow-on commit on 2026-05-20.

### Verification

| Check | Result |
|-------|--------|
| Fixture validation | PASS, 73 probes with required profile/path-class counts |
| `.venv/bin/python -m pytest tests/test_calibration_perturbation.py -q` | PASS, 4 passed in 0.01s |
| Live smoke run | PASS, 3/5 hits in `lane-sample-smoke-run-1.json` |
| `.venv/bin/python -m pytest tests/ -q` | PASS, 227 passed in 18.65s |
| `.venv/bin/ruff check cocoindex_code tests .../calibration_perturbation.py` | PASS, All checks passed |
| `validate.sh .../023-deep-research-arc-blind-spots/007-fixture-calibration --strict` | PASS, Errors: 0 Warnings: 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/code-retrieval-fixture-expanded-v2.json` (NEW) | 73-probe expanded calibration fixture |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/SOURCE.md` (NEW) | Probe authorship and truth-validation method notes |
| `011-rerank-model-fit-investigation/research/phase2-bench/calibration_perturbation.py` (NEW) | Aggregation, CI95, fixture validation, RRF flat-line assertion and residual miss taxonomy helper |
| `011-rerank-model-fit-investigation/research/phase2-bench/run-expanded-bench.sh` (NEW) | Long-run sweep runner with `--runs 3` and LANE_GROUPS fix |
| `007-fixture-calibration/evidence/robust-verdict-gates.md` (NEW) | ROBUST gate thresholds and measurable acceptance criteria |
| `007-fixture-calibration/evidence/calibration-recommendation.md` (NEW) | Default-change recommendation pending full n>=3 sweep |
| `007-fixture-calibration/evidence/residual-miss-taxonomy.md` (NEW) | Miss classifier mapped to 023C diagnostic counter fields |
| `007-fixture-calibration/evidence/runs/lane-sample-smoke-run-1.json` (NEW) | Sample smoke run output documenting 3/5 hits |

### Follow-Ups

- Schedule the full `--runs 3` sweep when about 60 minutes of operator time is available. The harness is ready but the release-grade run was deferred.
- Wire CombMNZ and average fusion alternatives into production `query.py` after the full sweep confirms which lane wins.
- Expose 023C diagnostic counters through the CLI search path so the taxonomy classifier receives populated data instead of empty diagnostics on smoke runs.
