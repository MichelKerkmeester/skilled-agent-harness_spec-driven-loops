# Benchmark 2026-05-20 Expanded

This folder contains the 023B expanded retrieval fixture and Qwen3 reranker default-flip report.

Fixture: `code-retrieval-fixture-expanded-v2.json`

Composition:

- 18 original corrected probes retained as the regression floor.
- 15 architecture-invariant probes.
- 10 multilingual/code-switched probes.
- 5 short-query probes.
- 5 long-query probes.
- Path-class coverage across implementation, tests, docs, generated, vendor, and spec-research targets.

Execution harness:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-expanded-bench.sh`
- Aggregation and taxonomy helpers live in `calibration_perturbation.py` beside the runner.
