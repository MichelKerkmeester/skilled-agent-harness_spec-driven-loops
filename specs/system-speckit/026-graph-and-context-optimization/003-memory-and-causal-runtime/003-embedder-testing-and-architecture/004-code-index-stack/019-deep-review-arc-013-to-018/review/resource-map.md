# Resource Map — 016/004/013-018 CocoIndex Pipeline Arc + Nomic Promotion

## File × Dimension Review Matrix

| File | correctness | security | traceability | maintainability | code-quality | architecture | tests | documentation | performance | embedder-agnosticism | reranker-agnosticism | reproducibility |
|------|-------------|----------|-------------|----------------|-------------|-------------|-------|----------------|------------|---------------------|---------------------|----------------|
| query_expansion.py | ✓ | - | - | - | - | - | ✓ | - | - | - | - | - |
| chunkers/code_aware.py | ✓ | - | - | ✓ | - | - | ✓ | - | - | - | - | - |
| chunkers/grammars.py | - | - | - | - | - | - | - | - | - | - | - | - |
| chunkers/__init__.py | - | - | - | - | - | - | - | - | - | - | - | - |
| chunkers/README.md | - | - | - | - | - | - | - | ✓ | - | - | - | - |
| path_utils.py | ✓ | ✓ | - | ✓ | - | - | - | - | - | - | - | - |
| query.py | - | ✓ | - | - | - | - | - | - | - | - | ✓ | - |
| config.py | ✓ | ✓ | - | ✓ | - | - | ✓ | ✓ | - | ✓ | ✓ | - |
| reranker.py | - | - | - | ✓ | - | - | - | - | ✓ | - | ✓ | - |
| rerankers_jina_v3.py | - | - | ✓ | - | - | - | - | ✓ | - | - | ✓ | - |
| registered_embedders.py | ✓ | - | ✓ | ✓ | - | - | - | - | - | ✓ | - | - |
| fts_index.py | - | ✓ | - | - | - | - | ✓ | - | - | - | - | - |
| indexer.py | - | - | - | - | - | - | - | - | - | - | - | - |
| test_query_expansion.py | - | - | - | - | - | - | ✓ | - | - | - | - | - |
| test_code_aware_chunker.py | - | - | - | - | - | - | ✓ | - | - | - | - | - |
| test_path_utils.py | - | - | - | - | - | - | - | - | - | - | - | - |
| test_dedup_mirrors.py | - | - | - | - | - | - | - | - | - | - | - | - |
| test_config.py | - | - | - | - | - | - | ✓ | - | - | - | - | - |
| test_fts_index.py | - | - | - | - | - | - | ✓ | - | - | - | - | - |
| test_rrf_config.py | - | - | - | - | - | - | - | - | - | - | - | - |
| test_rerank_dispatch.py | - | - | - | - | - | - | - | - | - | - | - | ✓ |
| sweep-rrf.sh | - | ✓ | - | - | - | - | - | - | - | - | - | - |
| sweep-rrf.py | - | ✓ | - | - | - | - | - | - | - | - | - | - |
| rerank-matrix-bench.sh | - | - | - | - | - | - | - | - | - | - | - | - |
| rerank-matrix-analyze.py | - | - | - | - | - | - | - | - | - | - | - | - |
| decision-record.md | - | - | ✓ | - | - | - | - | ✓ | - | - | - | - |
| Git commits (8364bdd5b, 38d4e2d62, 1638f6835) | - | - | ✓ | - | - | - | - | - | - | - | - | - |
| Spec folders (013-018) | - | - | ✓ | - | - | - | - | ✓ | - | - | - | - |
| cocoindex_code/README.md | - | - | - | - | - | - | - | ✓ | - | - | - | - |
| SKILL.md | - | - | - | - | - | - | - | ✓ | - | - | - | - |
| README.md | - | - | - | - | - | - | - | ✓ | - | - | - | - |
| INSTALL_GUIDE.md | - | - | - | - | - | - | - | ✓ | - | - | - | - |
| benchmarks/README.md | - | - | - | - | - | - | - | ✓ | - | - | - | - |
| benchmark-2026-05-19/ | - | - | - | - | - | - | - | ✓ | - | - | - | - |

## Legend

- ✓ = Dimension reviewed for this file
- - = Dimension not reviewed for this file

## Notes

- **Correctness**: Focused on core implementation files (query_expansion.py, chunkers, path_utils, config, reranker)
- **Security**: Focused on input validation, JSON parsing, path manipulation, SQL construction
- **Traceability**: Focused on ADR locations, spec folder structure, git commit hygiene, decision documentation
- **Maintainability**: Focused on code duplication, error handling patterns, configuration complexity
- **Performance**: Focused on env var parsing overhead, fallback performance, synonym expansion limits
- **Embedder-agnosticism**: Focused on embedder registry, dimension migration, path-class boost factors, RRF lock generalization
- **Reranker-agnosticism**: Focused on adapter dispatch, opt-in retention, jina v3 adapter status
- **Reproducibility**: Focused on RRF lock embedder specificity, bench harness determinism
- **Tests**: Focused on test file existence and coverage of new functionality
- **Documentation**: Focused on ADR documentation, file headers, spec folder completeness, migration guides
- **Architecture**: Not covered (deferred due to convergence)
- **Code-quality**: Not covered (deferred due to convergence)
