# Iteration 001 - Empirical-gap mapping

## Preflight reasoning
- Focus: map what the 18-probe corrected fixture and current index do not cover.
- Hypotheses: the fixture is strong for the 013-018 regression arc but weak as a production-representativeness sample; non-Python language support is under-exercised.
- Evidence to gather: fixture categories, repo/index language mix, mcp_server file mix, missing language fixtures, and benchmark per-probe misses.
- Falsification test: broad multi-language, multi-path-class, production-like probes would weaken the claim.
- Expected surprise level: medium; the benchmark may intentionally optimize a narrow internal retrieval slice.

## Hypotheses going in
- H1: The corrected 18-probe fixture over-samples internal spec-kit and CocoIndex retrieval questions, so a 14/18 score cannot imply production robustness.
- H2: Tree-sitter language support exists for multiple languages, but the local benchmark/repo shape gives limited evidence for Go/Rust/Java/etc.

## Evidence gathered
- Command output: `.venv/bin/ccc status` reported `Chunks: 83793`, `Files: 8493`, with `typescript: 61050`, `javascript: 11158`, `python: 4471`, `bash: 3616`, `markdown: 3464`, and only tiny HTML/CSS/JSON/text tails.
- Command output: `rg --files | awk ... | sort -nr | head -20` reported repo file extensions led by `15636 .md`, `3483 .json`, `1622 .ts`, `1289 .jsonl`, `158 .sh`, `119 .py`, `103 .js`.
- Command output: `rg --files .opencode/skills/mcp-coco-index/mcp_server | awk ...` reported the scoped server surface is `43 .py`, `11 .md`, `9 .jsonl`, `2 .csv`, `1 .toml`.
- Command output: `find .opencode/skills/mcp-coco-index/mcp_server -type f \( -name '*.go' -o -name '*.rs' -o -name '*.java' -o -name '*.swift' -o -name '*.kt' -o -name '*.php' -o -name '*.rb' -o -name '*.sql' \) | head -20` returned no rows.
- Command output from fixture parser: `count 18`, difficulty `{'easy': 5, 'medium': 7, 'hard': 6}`, categories `{'mk-spec-memory-embedder': 2, 'mk-spec-memory-handler': 1, 'cocoindex-code': 6, 'spec-kit-script': 2, 'vitest-case': 2, 'rescue-layer': 2, 'code-graph-lib': 3}`.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:91` through `:100` shows the best lane at `14/18`; `:104` through `:127` records repeated misses, with probes 5/12/13 common hard spots.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/grammars.py:76` through `:133` supports TS/TSX/JS/Python/Go/Rust/Java grammars, but this iteration found no in-scope Go/Rust/Java fixture files under `mcp_server`.

## Findings (severity-tagged)
- **FINDING-001-A** [severity: HIGH-LATENT-RISK]:
  - **What**: The corrected fixture is a regression benchmark for the internal 013-018 arc, not a production coverage claim. It under-represents the indexed repo's dominant Markdown/JSON/TypeScript shape and does not exercise the non-Python tree-sitter languages that the chunker advertises.
  - **Why deep-review couldn't catch this**: Deep-review validates shipped behavior against the packet fixture. It does not ask whether the fixture is representative of future repositories, language mixes, or operator workloads.
  - **Evidence**: Fixture parser output above; `ccc status` output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/grammars.py:76-133`; empty `find` output for Go/Rust/Java/Swift/Kotlin/PHP/Ruby/SQL under `mcp_server`.
  - **What to do**: Add a follow-on "023A fixture coverage expansion" packet: stratified probes by language, path_class, repository role, file size, and query style, with at least one Go/Rust/Java fixture if those grammars remain supported.

- **FINDING-001-B** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: The winning lane leaves stable blind spots: probes 5, 12, and 13 remain common misses in the benchmark matrix, so the arc improved average score without producing an error taxonomy for the residual failures.
  - **Why deep-review couldn't catch this**: A review can verify the lane chose the best available model/reranker combo. It will not automatically require a separate taxonomy of misses that no shipped change claimed to solve.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:104-127` lists common misses; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/results.csv:2-7` preserves the lane scores.
  - **What to do**: Add a small failure-analysis notebook/report that labels every missed probe by failure mode: chunking, lexical gap, semantic gap, path-class bias, reranker inversion, or fixture ambiguity.

## Hypotheses that FAILED falsification
- The hypothesis that the scoped CocoIndex server already contains non-Python/JS/TS fixture files failed. The `find` command returned no matching Go/Rust/Java/Swift/Kotlin/PHP/Ruby/SQL files under `mcp_server`.
- The hypothesis that the 18-probe fixture is balanced across arbitrary production file types failed. The fixture categories are concentrated in spec-kit, code-graph, and CocoIndex internals.

## Updates to research.md
- Added the empirical-gap map: fixture composition, repo/index language mix, and the first follow-on packet idea for stratified benchmark coverage.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

