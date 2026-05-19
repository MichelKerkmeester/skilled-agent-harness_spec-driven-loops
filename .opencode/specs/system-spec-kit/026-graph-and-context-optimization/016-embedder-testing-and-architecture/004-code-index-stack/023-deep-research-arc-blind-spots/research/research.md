# Deep Research 023 - Running Synthesis

## Executive summary
After 10 iterations, the 013-018 retrieval arc looks **contingent**: robust enough for the corrected 18-probe internal fixture, but not yet hardened against future model swaps, wider repo shapes, non-768 embedders, production-scale query cost, or operator install drift.

The important shift is that most risks are not isolated implementation bugs. They are hidden contracts: 768d schema assumptions, query/document prompt asymmetry, dedup-before-rerank ordering, reranker license/governance, and calibration knobs validated on a narrow fixture.

## Empirical-gap map
- The current index has 83,793 chunks and 8,493 files, dominated by TypeScript, JavaScript, Python, Bash, and Markdown.
- The corrected fixture has 18 probes: 5 easy, 7 medium, 6 hard, concentrated in `cocoindex-code`, `code-graph-lib`, `spec-kit-script`, `mk-spec-memory-*`, `rescue-layer`, and `vitest-case`.
- The scoped `mcp_server` surface is only `43 .py`, `11 .md`, `9 .jsonl`, `2 .csv`, `1 .toml`; a search for Go/Rust/Java/Swift/Kotlin/PHP/Ruby/SQL files under it returned no rows.
- Follow-on need: stratified fixture coverage by language, path_class, file size, path role, and query type.

## External landscape diff
- `nomic-ai/CodeRankEmbed` remains a sensible 768d MIT-licensed default: Hugging Face API reported 383,262 downloads and MIT license.
- `jinaai/jina-reranker-v3` is the default reranker but is CC BY-NC 4.0. That is a governance risk for commercial/on-prem operators.
- Jina code embeddings 1.5B advertises 1536d default embeddings, Matryoshka dimensions, task-specific prefixes, and 15+ language support.
- BGE-Code-v1 and Jina cards show task/query/passage formatting patterns that exceed the current query-prompt-only metadata.
- `sentence-transformers` is currently 5.5.0 on PyPI, while the benchmark environment recorded 5.4.1.

## Calibration sensitivity
- RRF `(K=60,V=0.9,F=0.5)` is low-confidence as an optimum. The 017 evidence ran seven successful local cells, all with the same `12/18` hit rate and same hit/miss pattern.
- Synthetic perturbation showed adjacent RRF gaps of about `0.000142-0.000238`, while hybrid additive boosts are `0.01` and `0.02`.
- Reranker `top_k=20` is load-bearing but not isolated in a cutoff sensitivity study.
- Needed study: joint perturbation over RRF values, hybrid boosts, vector boosts, and rerank top-K, with rank-flip counts and confidence intervals.

## Architectural blind spots
- Active vector table schema is `embedding float[768]`.
- Registry includes 2048d SFR and 1024d Stella candidates and references schema migration needs.
- Daemon `ProjectRegistry` stores one `_embedder` for all loaded projects.
- Restart detection watches package version and global settings mtime, but benchmark evidence showed env-var restart surprises.

## Adversarial / red-team surface
- `fetch_k = (limit + offset) * 4`; path filters can trigger full scans; multi-language KNN can fan out per language.
- FTS injection looks mitigated by tokenization, quoting, and bound `MATCH ?` parameters.
- Tree-sitter chunking has fallback behavior, but nested/generated/minified/pathological chunks near thresholds need fuzzing.
- Symlink/mirror behavior is not proven exploitable; it needs a targeted fixture before making a stronger claim.

## Implicit contracts inventory
- Embedder metadata must include dimension, license, query prompt, document prompt, task mode, and model-specific requirements.
- Index metadata must store the resolved embedder/prompt/dimension policy used at indexing time.
- Mirror/content dedup must happen before rerank to avoid spending reranker capacity on aliases.
- Reranker fallback must be observable, not only graceful.
- Daemon status must expose effective config/model fingerprints.

## Theoretical critique
- RRF is defensible: the original paper reports it outperforming Condorcet and CombMNZ in several TREC settings.
- Local evidence does not prove rank-only fusion is best here. Alternatives like normalized score fusion, CombMNZ-like fusion, or learned weights remain untested.
- Binary top-5 on 18 probes with `n=1` is regression-grade, not statistical-confidence-grade.
- Multilingual/code-switched developer queries are not covered, despite recent IR literature and model cards highlighting language/task variability.

## Operator UX gaps
- Global `ccc` failed locally with `ModuleNotFoundError: No module named 'tree_sitter'`, while venv `ccc` worked.
- Reindex cost is material: benchmark rows reported about 25 minutes for nomic and 10 minutes for bge on this repo.
- Searches wait for indexing, but the user-facing progress/config story is thin.
- Model swaps need preflight estimates, backup/rollback guidance, and explicit license prompts.

## Test + observability coverage gaps
- Verification passed: `172 passed in 15.68s`.
- Coverage command failed because pytest did not recognize `--cov`, even though `pytest-cov` is declared under dev extras.
- Observability logs stage timing/result counts but lacks vector/FTS overlap, dedup loss, rerank input/output, boost flips, fallback counters, and config fingerprints.
- Absence search found no runtime tests for non-768 embedder behavior or per-project incompatible embedder states.

## Cross-cutting amplification
- **Schema + landscape + daemon**: non-768 external models plus 768d schema plus global daemon embedder make future adapter additions risky unless dimension-flex metadata lands first.
- **Fixture + calibration + observability**: a narrow fixture can make RRF/boost/top-K settings look stable while telemetry is too thin to explain future misses.
- **License + install drift + fallback**: CC BY-NC defaults, stale CLI entrypoints, expensive reindex, and silent reranker fallback combine into operator trust risk.

## Recommended follow-on packets
1. **023A Dimension-flex embedder architecture**: per-dimension vector tables, embedder fingerprint metadata, prompt/license schema, per-project daemon checks.
2. **023B Fixture expansion + calibration study**: stratified fixture, residual miss taxonomy, RRF/boost/top-K perturbations, graded relevance where possible.
3. **023C Retrieval observability**: per-query candidate counters, boost flip logs, reranker fallback counters, daemon status fingerprints.
4. **023D Operator doctor + model-swap UX**: stale CLI detection, dependency checks, model license warnings, reindex cost estimate, rollback guidance.
5. **023E Adversarial/fuzz tests**: offset/path cost clamps, chunking fuzz, punctuation-heavy FTS recall, symlink/mirror fixture.

