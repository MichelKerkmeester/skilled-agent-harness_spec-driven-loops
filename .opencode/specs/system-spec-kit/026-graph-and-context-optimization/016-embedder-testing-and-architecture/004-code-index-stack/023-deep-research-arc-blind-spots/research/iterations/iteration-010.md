# Iteration 010 - Synthesis + cross-cutting amplification

## Preflight reasoning
- Focus: combine the prior nine iterations and identify risks that become more serious together than alone.
- Hypotheses: the strongest risks are not single bugs; they compound across external model drift, schema rigidity, calibration uncertainty, and weak observability.
- Evidence to gather: prior iteration findings, benchmark rows, schema/model metadata, daemon lifecycle, and test/observability gaps.
- Falsification test: the top risks already have contract tests, dimension-flex migration, license metadata, and production diagnostics.
- Expected surprise level: high; iteration 010 should prioritize interactions rather than repeat prior evidence.

## Hypotheses going in
- H1: Schema-lock plus external model drift plus global daemon state is the highest latent risk cluster.
- H2: Fixture narrowness plus calibration/boost dominance plus weak observability can create false confidence after a green benchmark.

## Evidence gathered
- Iteration 001 evidence: current index is 83,793 chunks/8,493 files with a TS/JS/Python/Bash/Markdown skew; fixture is 18 internal probes concentrated in CocoIndex/spec-kit/code-graph categories.
- Iteration 002 evidence: Jina code embeddings 1.5B exposes 1536d/Matryoshka dimensions and task-specific prefixes; default Jina reranker v3 is CC BY-NC 4.0; `sentence-transformers` moved from bench `5.4.1` to PyPI `5.5.0`.
- Iteration 003 evidence: synthetic RRF adjacent gaps (`0.000142-0.000238`) are far below hybrid additive boosts (`0.01`, `0.02`), and the seven-cell RRF sweep produced identical hit/miss patterns.
- Iteration 004 evidence: active schema is `embedding float[768]`; registry includes 1024d/2048d opt-ins; daemon `ProjectRegistry` stores one `_embedder` across loaded projects.
- Iteration 005 evidence: `fetch_k=(limit+offset)*4`, path filters can full-scan, and multi-language search fans out per language.
- Iteration 006 evidence: query prompts are first-class only on query side, document prompt policy is not metadata, and rerank assumes dedup already happened.
- Iteration 007 evidence: RRF is theoretically defensible, but local evaluation is binary top-5, 18 probes, and `n=1 pending 3-run confirmation`.
- Iteration 008 evidence: global `ccc` failed on `tree_sitter` while venv `ccc` worked; model swaps can require 10-25 minute reindexes.
- Iteration 009 evidence: 172 tests pass, but coverage command failed in the active venv and status/observability omit key model/retrieval diagnostics.

## Findings (severity-tagged)
- **FINDING-010-A** [severity: HIGH-LATENT-RISK]:
  - **What**: The largest risk is a three-way amplification: non-768 external models are arriving, the schema is fixed at 768d, and the daemon holds one global embedder across projects. Any serious future embedder swap can become a schema migration, daemon restart, and multi-project correctness problem at once.
  - **Why deep-review couldn't catch this**: Each packet can be correct locally: registry docs warn about dimension changes, daemon restart works for current settings, and the default 768d lane passes. The combined future failure mode spans packets 013-018, the nomic promotion, and external model drift.
  - **Evidence**: Iteration 002 model-card/API evidence; iteration 004 schema/daemon evidence; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:125-142`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:317-348`.
  - **What to do**: First follow-on packet should be "dimension-flex + embedder fingerprint architecture", before adding more model adapters.

- **FINDING-010-B** [severity: HIGH-LATENT-RISK]:
  - **What**: Fixture narrowness and calibration uncertainty amplify each other. If the fixture under-samples production query shapes, then RRF/boost/top-K settings may be fixture-fit while observability is too thin to explain misses after deployment.
  - **Why deep-review couldn't catch this**: Deep-review can certify the current fixture result. It cannot prove the fixture captures unseen query distributions or that the telemetry will diagnose a future miss.
  - **Evidence**: Iteration 001 fixture/parser evidence; iteration 003 RRF/boost perturbation evidence; iteration 009 observability evidence; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:25-27`, `:104-127`, `:136-149`.
  - **What to do**: Second follow-on packet should combine fixture expansion, calibration perturbation, and per-query telemetry rather than treating them as separate improvements.

- **FINDING-010-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Operator trust risk is a compound of non-commercial model defaults, stale CLI entrypoints, expensive reindexes, and silent reranker fallback. None is necessarily catastrophic alone; together they make the system feel unpredictable under model swaps.
  - **Why deep-review couldn't catch this**: These are experience and governance risks after ship, not code-vs-spec defects.
  - **Evidence**: Iteration 002 Jina license evidence; iteration 006 fallback evidence; iteration 008 global CLI/reindex evidence; iteration 009 observability evidence.
  - **What to do**: Third follow-on packet should add `ccc doctor`, license warnings, model-swap preflight, and daemon status fingerprints.

## Hypotheses that FAILED falsification
- The hypothesis that the retrieval arc is fragile in the sense of "current default likely broken" failed. The benchmark and tests still support the current default under the corrected fixture.
- The hypothesis that convergence could be declared after iteration 7 failed by instruction and by substance: iterations 8-10 uncovered concrete operator and amplification risks not visible in earlier iterations.

## Updates to research.md
- Added cross-cutting amplification and priority-ordered packet stack.

## NO-EARLY-STOP confirmation
- Iteration 10 reached exactly. Proceeding to final synthesis; no convergence-stop was used.

