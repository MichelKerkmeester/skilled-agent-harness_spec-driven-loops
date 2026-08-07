# Iteration 001 — P1 Closure Verification

## Files / DBs / commands read

- `settings.py`:117-123 — default_user_settings() now derives model from _DEFAULT_MODEL
- `registered_embedders.py`:147-148 — DEFAULT_EMBEDDER_NAME set to "sbert/nomic-ai/CodeRankEmbed"
- `config.py`:13,15 — _DEFAULT_MODEL derives from DEFAULT_EMBEDDER_NAME
- `config.py`:561-579 — Production uses COCOINDEX_HYBRID_* env vars (not COCOINDEX_RRF_*)
- `rerankers_jina_v3.py`:136-141 — Bounded parsing with _parse_int_env(1..50000)
- `daemon.py`:397-399,454-455 — Re-raises after logging; yields IndexResponse(success=False)
- `query.py`:38-39 — _HYBRID_PATH_CLASS_SHIFT=0.01, _HYBRID_CANONICAL_RESOURCE_BOOST=0.02
- `run-phase2-smoke.sh`:58 — Uses ${COCOINDEX_CODE_EMBEDDING_MODEL:-sbert/BAAI/bge-code-v1}
- `evidence/query-expansion-root-cause-analysis.md` — Full RCA for query expansion regression
- `README.md`:69 — Correctly documents nomic default and hybrid/rerank default-on

**Commands run:**
- `mcp_server/.venv/bin/python -m pytest tests/test_settings.py -v` — 20 passed
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_config.py -v` — 35 passed
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_rerankers_jina_v3.py -v` — 7 passed
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_daemon.py -v` — 15 passed
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_dedup_mirrors.py -v` — 8 passed
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_rerank_matrix_analyze.py -v` — 1 passed
- `rg -i "default-off|GTE|BGE.*default|EmbeddingGemma.*default"` — No stale default-off/GTE/BGE default claims in user-facing docs

## Findings (P0/P1/P2/INFO)

### P1-A: Fresh daemon settings default to Nomic — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**: 
  - `settings.py:13` imports `_DEFAULT_MODEL` from config
  - `settings.py:121` uses `model=_DEFAULT_MODEL` in default_user_settings()
  - `registered_embedders.py:147` sets `DEFAULT_EMBEDDER_NAME = "sbert/nomic-ai/CodeRankEmbed"`
  - `config.py:15` sets `_DEFAULT_MODEL = DEFAULT_EMBEDDER_NAME`
- **Why it matters**: Fresh installs now correctly use the promoted nomic embedder instead of the obsolete google/embeddinggemma-300m
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P1-A

### P1-B: RRF rollback env names match production — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - `rg "COCOINDEX_RRF_K|COCOINDEX_RRF_VECTOR|COCOINDEX_RRF_FTS"` — No matches in codebase
  - `config.py:561-579` shows production reads COCOINDEX_HYBRID_RRF_K, COCOINDEX_HYBRID_VECTOR_WEIGHT, COCOINDEX_HYBRID_FTS5_WEIGHT
  - Test `test_adr_020_documented_rrf_env_vars_take_effect` passes
- **Why it matters**: Operator rollback commands now work correctly with production env var names
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P1-B

### P1-C: Jina max-doc-chars env parsing is bounded — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - `rerankers_jina_v3.py:136-141` uses `_parse_int_env("COCOINDEX_RERANK_JINA_MAX_DOC_CHARS", _DEFAULT_MAX_DOC_CHARS, 1, 50000)`
  - Test `test_jina_adapter_invalid_max_doc_chars_falls_back` passes
- **Why it matters**: Malformed env var can no longer crash the reranker before the protected model call
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P1-C

### P1-D: Index failures return failure responses — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - `daemon.py:397-399` re-raises after logging: `except Exception: logger.exception(...); raise`
  - `daemon.py:454-455` catches and yields: `except Exception as e: yield IndexResponse(success=False, message=str(e))`
  - Test `test_update_index_reports_project_update_failure` passes
- **Why it matters**: Index failures now correctly propagate to clients as failure responses instead of silently succeeding
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P1-D

### P1-E: Phase 2 smoke harness honors embedder override — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - `run-phase2-smoke.sh:58` uses `export COCOINDEX_CODE_EMBEDDING_MODEL="${COCOINDEX_CODE_EMBEDDING_MODEL:-sbert/BAAI/bge-code-v1}"`
  - Shell syntax check passed per implementation-summary
- **Why it matters**: Harness now respects embedder override for nomic reproduction, contradicting the old unconditional BGE export
- **Recommendation**: None — fix is correct
- **Original-finding link**: 019 P1-E

### P1-F: Rerank matrix analyzer skips failed runs — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - Test `test_rerank_matrix_analyzer_skips_failed_runs` passes
  - Implementation-summary cites fix at `rerank-matrix-analyze.py:57-66` (excludes success=false and hit_rate=0+latency>25s)
- **Why it matters**: Failed and timeout runs no longer pollute the rerank matrix verdict
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P1-F

### P1-G: Operator docs match shipped defaults — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - `README.md:69` correctly documents nomic-ai/CodeRankEmbed as default and hybrid/rerank as default-on
  - Static rg audit found no stale default-off/GTE/BGE/EmbeddingGemma default claims in user-facing docs
- **Why it matters**: User-facing docs now match production defaults, reducing operator confusion
- **Recommendation**: None — fix is correct
- **Original-finding link**: 019 P1-G

### P1-H: Hybrid boosts scaled to RRF — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - `query.py:38-39` sets `_HYBRID_PATH_CLASS_SHIFT = 0.01` and `_HYBRID_CANONICAL_RESOURCE_BOOST = 0.02`
  - Test `test_hybrid_boosts_do_not_override_strong_rrf_lead` passes
  - ADR-022 documents the decision
- **Why it matters**: Additive boosts no longer swamp calibrated RRF scores (typical rank-1 RRF ~0.023 under K=60,V=0.9,F=0.5)
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P1-H

### P1-I: Query expansion regression has RCA — VERIFIED_CLOSED
- **Severity**: P1 (verified closed)
- **Evidence**:
  - `evidence/query-expansion-root-cause-analysis.md` provides thorough RCA with concrete examples from rerank-score traces
  - ADR-019 appended with mechanism (test/doc displacement amplified by broad FTS5 and dense fanout)
- **Why it matters**: Future operators can now understand why query expansion is opt-in and what fix direction is needed
- **Recommendation**: None — RCA is thorough and actionable
- **Original-finding link**: 019 P1-I

## Updates to review.md

Created initial review.md with P1 closure table showing 9/9 VERIFIED_CLOSED.

## Convergence signal

New findings vs prior iter: 0 (first iteration)
