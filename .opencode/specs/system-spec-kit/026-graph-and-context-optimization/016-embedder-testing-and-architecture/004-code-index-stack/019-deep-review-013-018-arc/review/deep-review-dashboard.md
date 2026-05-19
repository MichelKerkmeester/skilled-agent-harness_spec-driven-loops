# Deep Review Dashboard — 016/004/013-018 CocoIndex Pipeline Arc + Nomic Promotion

## Review Configuration
- **Target**: 7 commits on CocoIndex retrieval pipeline (013-018 + nomic promotion)
- **Max iterations**: 20
- **Convergence threshold**: 3 consecutive iterations with zero new P0+P1 findings
- **Review dimensions**: 12 (correctness, security, traceability, maintainability, code-quality, architecture, tests, documentation, performance, embedder-agnosticism, reranker-agnosticism, reproducibility)

## Iteration Progress

### Iteration 001 — Correctness
- **Focus**: correctness
- **Files reviewed**: query_expansion.py, chunkers/code_aware.py, path_utils.py, query.py, config.py, reranker.py, registered_embedders.py, indexer.py, test_query_expansion.py, test_code_aware_chunker.py, decision-record.md
- **Findings**: 1 P1, 5 P2
- **New P0**: 0
- **New P1**: 1
- **New P2**: 5
- **Convergence streak**: 0 (first iteration)

### Iteration 002 — Security
- **Focus**: security
- **Files reviewed**: config.py (JSON parsing), path_utils.py (path manipulation), query.py (SQL construction), fts_index.py (FTS5 normalization), query_expansion.py (synonym cap), sweep-rrf.sh (bench harness), sweep-rrf.py (bench JSON parsing)
- **Findings**: 0 P1, 6 P2
- **New P0**: 0
- **New P1**: 0
- **New P2**: 6
- **Convergence streak**: 1 (first iteration with zero new P0+P1)

### Iteration 003 — Traceability
- **Focus**: traceability
- **Files reviewed**: spec folders (013-018), decision-record.md (ADRs 019-021), git commits (8364bdd5b, 38d4e2d62, 1638f6835)
- **Findings**: 0 P1, 5 P2
- **New P0**: 0
- **New P1**: 0
- **New P2**: 5
- **Convergence streak**: 2 (second iteration with zero new P0+P1)

### Iteration 004 — Embedder-Agnosticism and Reranker-Agnosticism
- **Focus**: embedder-agnosticism, reranker-agnosticism
- **Files reviewed**: rerankers_jina_v3.py, config.py (path-class boost factors), reranker.py, registered_embedders.py, query.py, decision-record.md (ADR-021)
- **Findings**: 0 P1, 5 P2
- **New P0**: 0
- **New P1**: 0
- **New P2**: 5
- **Convergence streak**: 3 (CONVERGED - 3 consecutive iterations with zero new P0+P1)

## P1 Findings Summary
- [001] Query expansion shipped opt-in default-false without root cause analysis

## P2 Findings Summary
- [001] Tree-sitter chunker silently falls back on all exceptions
- [001] Path canonicalization logic assumes prefixes end with slash after normalization
- [001] Config validation for RRF parameters doesn't check semantic consistency
- [001] Reranker path-class boost reads env on every call
- [001] Default embedder consistency not enforced at runtime
- [002] JSON parsing from env vars lacks length limits
- [002] Path prefix validation doesn't reject malicious patterns
- [002] FTS5 query normalization doesn't escape double quotes in tokens
- [002] Query expansion synonym cap is per-word, not total
- [002] Bench harness JSON parsing lacks validation
- [002] Shell script bench harness doesn't validate environment variables
- [003] ADRs for CocoIndex pipeline arc filed under embedder bake-off packet
- [003] ADR-016 and ADR-017 not found in decision record
- [003] Nomic promotion commit lacks ADR reference
- [003] Spec folder 018 implementation-summary.md doesn't reference Lane A bug follow-up
- [003] Cross-packet dependencies not explicitly documented in spec folders
- [004] Path-class boost factors not documented as embedder-agnostic
- [004] Jina v3 adapter file header still marks it as "THROWAWAY"
- [004] RRF lock documented as embedder-agnostic but only tested on bge-code-v1
- [004] Opt-in BGE reranker not tested in post-018 validation
- [004] Embedder registry doesn't document dimension migration requirements

## Dimension Coverage Matrix

| Dimension | Iteration 001 | Iteration 002 | Iteration 003 | Iteration 004 | Status |
|-----------|---------------|---------------|---------------|---------------|--------|
| correctness | covered | - | - | - | complete |
| security | not-yet | covered | - | - | complete |
| traceability | not-yet | - | covered | - | complete |
| maintainability | partial | - | - | - | partial |
| code-quality | not-yet | - | - | - | pending |
| architecture | not-yet | - | - | - | pending |
| tests | partial | - | - | - | partial |
| documentation | partial | - | partial | partial | partial |
| performance | partial | partial | - | - | partial |
| embedder-agnosticism | not-yet | - | - | covered | complete |
| reranker-agnosticism | not-yet | - | - | covered | complete |
| reproducibility | not-yet | - | - | partial | partial |

## Running Totals
- **Total P0**: 0
- **Total P1**: 1
- **Total P2**: 21
- **Total findings**: 22

## Convergence Status
- **Current streak**: 3 iterations with zero new P0+P1
- **Required streak**: 3 consecutive iterations
- **Status**: CONVERGED
- **Next iteration**: SYNTHESIS (final report)
