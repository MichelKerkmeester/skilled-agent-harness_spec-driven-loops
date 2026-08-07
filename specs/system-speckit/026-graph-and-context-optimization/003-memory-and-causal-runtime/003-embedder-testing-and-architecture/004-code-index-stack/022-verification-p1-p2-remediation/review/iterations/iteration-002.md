# Iteration 002 — P2 Closure Verification

## Files / DBs / commands read

- `config.py:45-46` — _MAX_JSON_ENV_BYTES=10_000, _MAX_JSON_LIST_ITEMS=100
- `config.py:117-148` — _parse_json_string_list_env with _validate_json_env_size and item count limits
- `path_utils.py:12-26` — normalize_mirror_prefix rejects path traversal, null bytes, backslashes, unsafe chars
- `chunkers/code_aware.py:47-49` — fallback_count property added
- `chunkers/code_aware.py:61,75` — Narrowed exception catches (ImportError, OSError, RuntimeError, TypeError, ValueError, UnicodeEncodeError, UnicodeDecodeError, AttributeError)
- `chunkers/code_aware.py:98` — fallback_split increments _fallback_count
- `fts_index.py:13,95-97` — _FTS5_QUOTE_RE = re.compile(r'"') replaces embedded quotes with ""
- `registered_embedders.py:147-148` — DEFAULT_EMBEDDER_NAME with nomic default notes
- `decision-record.md:16-25` — Stack-local ADR index linking ADR-016 through ADR-023
- `018-rerank-matrix-rebench/implementation-summary.md:66-68` — Lane A known issue documented
- `013-018/spec.md` — Cross-packet dependency notes added
- `benchmarks/benchmark-2026-05-19/benchmark_report.md:27,56,332` — Provisional n=1 caveat, bge-code-v1-validated RRF lock
- `benchmarks/README.md:77,114` — n=1 evidence policy documentation

**Commands run:**
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_config.py mcp_server/tests/test_path_utils.py mcp_server/tests/test_rrf_config.py -v` — 49 passed (P2 batch 1 + 3)
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_code_aware_chunker.py -v` — 14 passed (P2 batch 2)
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_registered_embedders.py -v` — 13 passed (P2 batch 3)
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_reranker.py mcp_server/tests/test_rerankers_jina_v3.py mcp_server/tests/test_rerank_dispatch.py -v` — 25 passed (P2 batch 4)
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_query_expansion.py -v` — 17 passed (P2 batch 5)
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_fts_index.py -v` — 9 passed (P2 batch 6)
- `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_daemon.py -v` — 15 passed (P2 batch 7, already ran in iter 1)

## Findings (P0/P1/P2/INFO)

### P2 Batch 1: Security hardening — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `config.py:45-46` sets _MAX_JSON_ENV_BYTES=10_000, _MAX_JSON_LIST_ITEMS=100
  - `config.py:117-148` implements _validate_json_env_size and item count validation
  - `path_utils.py:17-25` rejects null bytes, backslashes, path traversal (..), unsafe chars
  - Tests test_json_string_list_env_rejects_oversized_raw_value, test_json_string_list_env_rejects_too_many_items, test_normalize_mirror_prefix_rejects_malicious_patterns pass
- **Why it matters**: JSON env-var parsing and mirror prefix validation now defend against DoS and path traversal attacks
- **Recommendation**: None — fixes are correct and tested
- **Original-finding link**: 019 P2 #6, #7, #10, #11; C-P2-009

### P2 Batch 2: Tree-sitter chunker observability — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `chunkers/code_aware.py:47-49` adds fallback_count property
  - `chunkers/code_aware.py:61,75` narrows exception catches to specific expected failures
  - `chunkers/code_aware.py:62-66,76-80` logs specific fallback reasons
  - `chunkers/code_aware.py:98` increments _fallback_count
  - Tests test_parser_load_failure_falls_back_with_counter, test_definition_extraction_failure_falls_back_with_counter pass
- **Why it matters**: Tree-sitter fallbacks are now observable and specific, masking fewer real problems
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P2 #1

### P2 Batch 3: Config dedup and consistency — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `path_utils.py:12-26` centralizes mirror prefix normalization via normalize_mirror_prefix
  - `registered_embedders.py:147-148` sets DEFAULT_EMBEDDER_NAME with nomic default notes
  - `config.py:13,15` derives _DEFAULT_MODEL from DEFAULT_EMBEDDER_NAME
  - Tests test_default_matches_config, test_default_notes_describe_current_promotion, test_registry_documents_dimension_migration_requirements pass
- **Why it matters**: Single source of truth for default embedder, centralized mirror normalization, documented dimension migration
- **Recommendation**: None — fixes are correct and tested
- **Original-finding link**: 019 P2 #2, #3, #5, #17; C-P2-001, C-P2-005

### P2 Batch 4: Reranker coverage and hardening — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `reranker.py` implements path_class_factor_parse_is_cached (test passes)
  - `rerankers_jina_v3.py` removes throwaway language, adds explicit path class factor tests
  - `test_rerank_dispatch.py` adds test_bge_opt_in_dispatches_to_cross_encoder
  - Tests test_path_class_factor_parse_is_cached, test_jina_adapter_ignores_default_path_class_boost_without_explicit_factors, test_bge_opt_in_dispatches_to_cross_encoder pass
- **Why it matters**: Reranker dispatch is now tested, path-class factors are cached, BGE opt-in is verified, Jina throwaway language removed
- **Recommendation**: None — fixes are correct and tested
- **Original-finding link**: 019 P2 #4, #18, #20; C-P2-002, C-P2-006

### P2 Batch 5: Query expansion improvements — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `query_expansion.py` implements total variant cap (test_expand_query_caps_total_variant_pool_for_fts5 passes)
  - `query_expansion.py` reorders to prioritize synonym phrases (test_expand_query_prioritizes_synonym_phrases_over_identifier_spellings passes)
  - Tests test_expand_query_caps_total_variant_pool_for_fts5, test_expand_query_prioritizes_synonym_phrases_over_identifier_spellings pass
- **Why it matters**: Query expansion now has total variant budget and better ordering for semantic utility
- **Recommendation**: None — fixes are correct and tested
- **Original-finding link**: 019 P2 #9; C-P2-003

### P2 Batch 6: FTS5 quote escaping — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `fts_index.py:13,95-97` implements _quote_fts5_phrase with _FTS5_QUOTE_RE.sub('""', value)
  - Test test_fts_query_normalization_escapes_embedded_quotes passes
- **Why it matters**: FTS5 queries now safely handle user-supplied quotes
- **Recommendation**: None — fix is correct and tested
- **Original-finding link**: 019 P2 #8

### P2 Batch 7: Daemon lifecycle hardening — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `daemon.py:397-399,454-455` re-raises index failures (already verified in iter 1 P1-D)
  - Additional daemon lifecycle tests pass (test_async_daemon_main_closes_lifetime_lock_on_shutdown, etc.)
- **Why it matters**: Index failures propagate correctly, daemon lifecycle is more robust
- **Recommendation**: None — fixes are correct and tested
- **Original-finding link**: C-P2-007, C-P2-008

### P2 Batch 8: RRF sweep breadth — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `benchmarks/benchmark-2026-05-19/benchmark_report.md:332` documents RRF lock as bge-code-v1-validated
  - `benchmarks/benchmark-2026-05-19/benchmark_report.md:27,56` marks nomic promotion as provisional n=1
  - `benchmarks/README.md:77,114` documents n=1 evidence policy
- **Why it matters**: RRF lock scope is now documented, n=1 evidence is marked provisional with replay policy
- **Recommendation**: None — documentation is correct
- **Original-finding link**: 019 P2 #19; C-P2-004, C-P2-010

### P2 Batch 9: Documentation and traceability — VERIFIED_CLOSED
- **Severity**: P2 (verified closed)
- **Evidence**:
  - `decision-record.md:16-25` provides stack-local ADR index linking ADR-016 through ADR-023
  - `020-deep-review-p1-p2-remediation/decision-record.md` contains ADR-022 and ADR-023
  - `018-rerank-matrix-rebench/implementation-summary.md:66-68` documents Lane A known issue
  - `013-018/spec.md` files contain cross-packet dependency notes (verified via grep)
  - `registered_embedders.py` documents dimension migration requirements (test passes)
- **Why it matters**: ADRs are discoverable, Lane A bug is tracked, dependencies are explicit, dimension migration is documented
- **Recommendation**: None — documentation is correct and tested
- **Original-finding link**: 019 P2 #12, #13, #14, #15, #16, #21

## Updates to review.md

Updated review.md with P2 closure table showing 31/31 VERIFIED_CLOSED across 9 batches.

## Convergence signal

New findings vs prior iter: 0
