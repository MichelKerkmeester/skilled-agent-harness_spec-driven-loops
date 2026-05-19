# Iteration 014 - Calibration fixture-fit perturbation [PASS-2]

## Pass 1 claim under attack
- HIGH-LATENT-RISK #4 / FINDING-003-A, FINDING-010-B: calibration confidence is inflated by narrow fixture and boost dominance.

## Hypotheses going in
- H1: The "knife-edge calibration" version is false if RRF perturbations keep the same hit/miss pattern.
- H2: Fixture narrowness survives if new probes expose gaps not represented by the 18-probe fixture.

## Evidence gathered
- Existing perturbation parse:
  - `baseline-bge-rrf-K30-V0p7-F0p7`: `12/18`, misses `[5, 10, 12, 13, 14, 18]`, median `1766ms`.
  - `baseline-bge-rrf-K60-V0p9-F0p5`: `12/18`, same misses, median `1652ms`.
  - `baseline-bge-rrf-K90-V0p7-F0p7`: `12/18`, same misses, median `1959ms`.
  - `baseline-bge-rrf-K120-V0p7-F0p7`: `12/18`, same misses, median `1717ms`.
  - Jina lanes across K30/K60/K90/K120 all stayed `14/18`, same misses `[5, 12, 13, 14]`.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:104-127` shows identical embedder hit/miss pattern and repeated misses.
- New probe command output:
  - `P2-new-1 document prompt prefix applied during indexing EmbeddingGemma`: top-5 did not include local `shared.py` or `indexer.py`; it returned prompt-system material from `system-spec-kit`.
  - `P2-new-2 search request offset budget clamp max offset path fanout`: top-5 included `protocol.py`, `observability.py`, and `client.py`, but not `query.py`.
  - `P2-new-3 daemon effective embedder fingerprint per project model dimension`: top-5 included `registered_embedders.py`, but not `daemon.py`.
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:38-39` still has additive hybrid boosts; `:541-582` dedups before rerank; `:818-824` applies rerank after candidate selection.

## Pass-1 attack outcome
- [FALSIFIED]: The strongest fixture-fit claim is too knife-edge. RRF K and weight perturbations in existing evidence do not change hit patterns.
- [STRENGTHENED]: The fixture-narrowness claim survives. Three new blind-spot probes missed at least one core expected local file in top-5, even while the original fixture stays flat.

## Findings (severity-tagged)
- **FINDING-014-A** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: FALSIFIES-#4]:
  - **What**: RRF calibration is flat, not fragile, on the current fixture. K30/K60/K90/K120 and nearby V/F settings preserve the same hit/miss patterns within each reranker lane.
  - **Why Pass 1 / deep-review missed this**: Pass 1 emphasized numeric boost gaps and underweighted the empirical flat-line across perturbation rows.
  - **Evidence**: Perturbation parse above; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/*rrf-K*.results.jsonl`.
  - **What to do**: Stop describing RRF as knife-edge. Describe it as low-information: the fixture cannot discriminate RRF values.

- **FINDING-014-B** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#4]:
  - **What**: New probes hit real blind spots: prompt-policy, request-budget, and daemon-fingerprint queries do not reliably retrieve all core implementation files.
  - **Why Pass 1 / deep-review missed this**: The original 18 probes were built around previous arc targets, not future governance invariants.
  - **Evidence**: New probe command output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:727-728`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:317-348`.
  - **What to do**: Add a Pass-2 mini-fixture category for "architecture invariant queries" before more tuning.

- **FINDING-014-C** [severity: LOW-CURIOSITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: The current winner's stability may come from reranker dominance, not RRF quality. Jina lanes stay `14/18` under RRF perturbation, while BGE lanes stay lower.
  - **Why Pass 1 / deep-review missed this**: Pass 1 already noticed reranker lift but did not reframe RRF as nondiscriminative under the fixture.
  - **Evidence**: Perturbation parse above; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:91-100`.
  - **What to do**: Use stratified perturbation with reranker-off, reranker-on, and top-K sweeps.

## Hypotheses that FAILED falsification (valuable!)
- "RRF K near 60 is a brittle optimum" failed on existing perturbation rows.
- "The fixture is broad enough to catch architecture-invariant retrieval misses" failed on the three new probes.

## Updates to research-pass-2.md
- Added "flat-line calibration" and three new architecture-invariant probe results.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

