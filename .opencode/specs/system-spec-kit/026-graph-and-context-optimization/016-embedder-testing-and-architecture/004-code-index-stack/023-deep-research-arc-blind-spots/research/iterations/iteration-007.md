# Iteration 007 - Theoretical critique

## Preflight reasoning
- Focus: ask what the literature and benchmark design imply about fusion, prompts, and evaluation confidence.
- Hypotheses: RRF is a solid baseline but not proof of optimal fusion; public code-retrieval leaderboards and papers increasingly stress language, task, and prompt-specific behavior.
- Evidence to gather: RRF paper, local RRF sweep, model papers/cards, benchmark methodology, and recent IR critique.
- Falsification test: local evidence includes significance testing or broader graded relevance; fusion alternatives were empirically worse on this corpus.
- Expected surprise level: medium; this is more about confidence calibration than discovering a direct bug.

## Hypotheses going in
- H1: RRF is defensible as an unsupervised fusion baseline, but the current evidence does not rule out CombMNZ, score fusion, or learned fusion.
- H2: The benchmark's binary top-5 hit metric and single-run fixture understate uncertainty.

## Evidence gathered
- External evidence: Cormack/Clarke/Buettcher RRF paper `https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf` describes RRF as a simple rank-fusion method and reports it outperforming Condorcet and CombMNZ in several TREC settings at lines 11-17 and 70-85 in the browse capture.
- Local implementation evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py:42-87` uses rank-only RRF for primary ordering and min-max channel scores as tie-breakers.
- Local sweep evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/evidence/sweep-results.md:21-40` shows all successful cells shared the same hit/miss pattern.
- Benchmark methodology evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:136-149` describes an 18-probe top-5 fixture; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:25-27` explicitly notes `n=1 pending 3-run confirmation`.
- External evidence: Jina code embeddings paper `https://arxiv.org/abs/2508.21290` says the suite targets natural-language-to-code, technical QA, and semantic code snippet retrieval across languages at lines 37-39 in the browse capture.
- External evidence: Code-switching IR paper `https://arxiv.org/abs/2604.17632` reports that code-switching degrades retrieval and proposes CS-MTEB, with observed performance declines up to 27%, at lines 37-40 in the browse capture.
- External evidence: CoIR raw leaderboard command showed tasks across AppsRetrieval, CodeFeedback, CodeSearchNet languages, CodeTransOcean, CosQA, StackOverflowQA, and SyntheticText2SQL rather than one internal repo fixture.

## Findings (severity-tagged)
- **FINDING-007-A** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: RRF is a credible baseline, but the local evidence does not prove rank-only fusion is best for this corpus. Because local RRF cells tied, alternatives using score magnitude or learned weights remain unexplored.
  - **Why deep-review couldn't catch this**: The implementation matches its ADR and tests. A theoretical critique asks whether the ADR chose a baseline or exhausted the decision space.
  - **Evidence**: RRF paper URL above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py:42-87`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/evidence/sweep-results.md:21-40`.
  - **What to do**: Add a small ablation runner comparing RRF, CombMNZ-like normalized score fusion, weighted score fusion, and a logistic/linear learned combiner trained only on fixture folds.

- **FINDING-007-B** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: The current evaluation uses binary top-5 hit on 18 probes with `n=1`. That is enough for regression triage, but low-confidence for claims about robust optimum, latency distributions, or model superiority.
  - **Why deep-review couldn't catch this**: Review can verify the benchmark report is honest. It cannot upgrade the statistical design unless the packet asks for it.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:25-27`, `:136-149`; CoIR raw command output listed many task families and languages.
  - **What to do**: Run at least 3 seeds/runs per lane, graded relevance where possible, and confidence intervals for hit-rate and latency deltas.

- **FINDING-007-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: The local fixture does not test multilingual or code-switched developer queries, even though current IR literature and model cards treat language/task variation as core retrieval behavior.
  - **Why deep-review couldn't catch this**: No shipped packet claimed multilingual behavior. The risk arises from future operator expectations and model-card support language.
  - **Evidence**: BGE-Code-v1 model card `https://huggingface.co/BAAI/bge-code-v1` says it supports English/Chinese and 20 programming languages at lines 110-113 in the browse capture; code-switching IR paper URL above; fixture parser output in iteration 001.
  - **What to do**: Add a "multilingual/code-switch query" mini-fixture with English, Dutch, Chinese, and mixed natural-language queries against code symbols.

## Hypotheses that FAILED falsification
- The hypothesis that RRF was an arbitrary or weak choice failed. The RRF paper gives a legitimate baseline rationale.
- The hypothesis that RRF tuning evidence alone establishes a robust optimum failed. Local cells tied and no alternative fusion family was tested.

## Updates to research.md
- Added theoretical critique: RRF is defensible but not exhaustive; current evaluation is regression-grade rather than statistical-confidence-grade; multilingual/code-switch coverage is absent.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

