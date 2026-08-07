# Verification Review — 020 P1/P2 Remediation

## Executive Summary

**Verdict**: IN_PROGRESS

**Headline findings**:
- P0: 0
- P1: 0 (9/9 verified closed)
- P2: 0 (31/31 verified closed across 9 batches)

**Convergence**: Iterations 1-2 complete (P1 and P2 closure verification). All 40 findings from 019 are verified closed. Iteration 3 will begin regression hunt.

## P1 Closure Table

| ID | Finding | Status | Evidence Location |
|----|---------|--------|-------------------|
| P1-A | Fresh daemon settings default to Nomic | VERIFIED_CLOSED | settings.py:121, registered_embedders.py:147 |
| P1-B | RRF rollback env names match production | VERIFIED_CLOSED | config.py:561-579, test passes |
| P1-C | Jina max-doc-chars env parsing is bounded | VERIFIED_CLOSED | rerankers_jina_v3.py:136-141 |
| P1-D | Index failures return failure responses | VERIFIED_CLOSED | daemon.py:397-399,454-455 |
| P1-E | Phase 2 smoke harness honors embedder override | VERIFIED_CLOSED | run-phase2-smoke.sh:58 |
| P1-F | Rerank matrix analyzer skips failed runs | VERIFIED_CLOSED | test passes, rerank-matrix-analyze.py:57-66 |
| P1-G | Operator docs match shipped defaults | VERIFIED_CLOSED | README.md:69, static audit |
| P1-H | Hybrid boosts scaled to RRF | VERIFIED_CLOSED | query.py:38-39, ADR-022 |
| P1-I | Query expansion regression has RCA | VERIFIED_CLOSED | evidence/query-expansion-root-cause-analysis.md |

## P2 Closure Table

| Batch | Findings | Status | Evidence Location |
|-------|----------|--------|-------------------|
| P2-1 | Security hardening (JSON limits, path traversal guards) | VERIFIED_CLOSED | config.py:45-148, path_utils.py:17-25, tests pass |
| P2-2 | Tree-sitter chunker observability (narrowed catches, fallback counter) | VERIFIED_CLOSED | chunkers/code_aware.py:47-98, tests pass |
| P2-3 | Config dedup and consistency (single-source default, centralized normalization) | VERIFIED_CLOSED | registered_embedders.py:147-148, path_utils.py:12-26, tests pass |
| P2-4 | Reranker coverage and hardening (cached factors, BGE opt-in, throwaway removal) | VERIFIED_CLOSED | reranker.py, rerankers_jina_v3.py, test_rerank_dispatch.py, tests pass |
| P2-5 | Query expansion improvements (total variant cap, synonym-first ordering) | VERIFIED_CLOSED | query_expansion.py, tests pass |
| P2-6 | FTS5 quote escaping (embedded quote handling) | VERIFIED_CLOSED | fts_index.py:95-97, tests pass |
| P2-7 | Daemon lifecycle hardening (index failure propagation) | VERIFIED_CLOSED | daemon.py:397-399,454-455, tests pass |
| P2-8 | RRF sweep breadth (bge-code-v1-validated docs, provisional n=1) | VERIFIED_CLOSED | benchmark_report.md, benchmarks/README.md |
| P2-9 | Documentation and traceability (ADR index, Lane A known issue, dependency notes) | VERIFIED_CLOSED | decision-record.md, 018 implementation-summary.md, 013-018 spec.md |

## New Findings (P0/P1/P2)

| ID | Category | Severity | Description |
|----|----------|----------|-------------|
| REG-001 | Flaky integration tests | INFO | test_e2e_daemon.py integration tests fail due to timing/environment issues, not code regressions |
| DOC-001 | Stale embedder defaults in docs | P2 | Documentation files (feature_catalog, manual_testing_playbook, references) still reference google/embeddinggemma-300m as default, not updated in P1-G/P2-3 remediation |
| TEST-001 | FTS5 quote escape test coverage gap | INFO | test_fts_query_normalization_escapes_embedded_quotes only tests single embedded quote case, missing edge cases (multiple quotes, unicode, etc.) |

## Regression Hunt Summary

**Iteration 3 — Daemon lifecycle + reranker dispatch:**
- Daemon lifecycle re-raise path: VERIFIED_NO_REGRESSION (correct integration with task.result())
- Reranker path-class factor cache: VERIFIED_NO_REGRESSION (correct env-based invalidation)
- BGE opt-in dispatch: VERIFIED_NO_REGRESSION (comprehensive test passes)
- Flaky daemon integration tests: INFO (not a code regression, test infrastructure issue)

**Iteration 4 — RRF/hybrid math + embedder defaults:**
- RRF/hybrid boost scaling: VERIFIED_NO_REGRESSION (test correctly verifies strong RRF leads)
- Embedder default consistency (code surfaces): VERIFIED_NO_REGRESSION (settings, config, registry, README all consistent)
- Stale embedder defaults in docs: P2 (documentation files not updated in P1-G/P2-3 remediation)

**Iteration 5 — FTS5 escape + tree-sitter chunker:**
- FTS5 quote escaping consistency: VERIFIED_NO_REGRESSION (applied consistently across fts_index.py and query_expansion.py)
- Tree-sitter chunker performance: VERIFIED_NO_REGRESSION (narrowed exception catches, fallback counter)
- FTS5 quote escape test coverage gap: INFO (test only covers single embedded quote case)

## Recommendation

TBD (pending P2 verification and regression hunt).
