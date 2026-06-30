# Iteration 001 — Correctness

## Files reviewed
- `query_expansion.py`:1-255 — 016 identifier expansion implementation
- `chunkers/code_aware.py`:1-224 — 015 tree-sitter chunker with fallback
- `path_utils.py`:1-80 — 014 mirror dedup helpers
- `query.py`:1-684 — 014+016+017 integration (mirror dedup, expansion, RRF)
- `config.py`:1-606 — 015/016/017/018/nomic env vars and defaults
- `reranker.py`:1-223 — 018 path-class boost and prefix dispatch
- `registered_embedders.py`:1-167 — nomic promotion _DEFAULT_NAME
- `indexer.py`:1-100 — 015 dispatch to CodeAwareSplitter
- `tests/test_query_expansion.py`:1-119 — expansion unit tests
- `tests/test_code_aware_chunker.py`:1-100 — chunker unit tests
- `decision-record.md`:1-407 — ADR history for context

## Findings

### P1 — Query expansion shipped opt-in default-false without root cause analysis
**File**: `config.py`:24
**Evidence**: `_DEFAULT_QUERY_EXPANSION = False  # 016 empirical: ON regressed 14/13/12 → 12/12/12 on corrected fixture; ships opt-in pending 017 RRF tuning`
**Why it matters**: The 016 query expansion feature was empirically found to regress hit rate (14/13/12 → 12/12/12) and was shipped opt-in default-false. However, there is no documented root cause analysis of why the regression occurred. The expansion logic in `query_expansion.py` appears syntactically correct, but the empirical regression suggests either a semantic bug in the expansion logic, an interaction with the retrieval pipeline that wasn't understood, or a measurement artifact. Shipping a feature opt-in due to unexplained regression is a correctness risk — the bug may still exist and could affect users who enable it.
**Suggested fix**: Perform root cause analysis on the query expansion regression. Test hypotheses: (a) Does expansion generate noisy variants that dilute signal? (b) Is the FTS5 clause construction incorrect? (c) Is there a bug in synonym application or identifier variant generation? (d) Is the regression actually a measurement artifact from the corrected fixture? Document findings in the ADR record and either fix the bug or document why the regression is acceptable for opt-in use.
**Dimension(s)**: correctness

### P2 — Tree-sitter chunker silently falls back on all exceptions
**File**: `chunkers/code_aware.py`:51-61
**Evidence**: 
```python
try:
    parser = Parser(spec.load_language())
    source_bytes = text.encode("utf-8")
    tree = parser.parse(source_bytes)
except Exception as exc:  # pragma: no cover - environment-specific parser failure
    logger.warning(
        "Falling back to RecursiveSplitter for %s after tree-sitter failure: %s",
        language,
        exc,
    )
    return self.fallback_split(text, language)
```
**Why it matters**: The chunker catches all exceptions and silently falls back to RecursiveSplitter. While this is defensive programming, it means that tree-sitter grammar bugs, encoding issues, or other real problems will be silently ignored. Users won't know that code-aware chunking failed for their files. This could mask correctness bugs in the grammar specifications or the chunking logic.
**Suggested fix**: Consider narrowing the exception catch to specific expected failures (e.g., `OSError` for missing grammar, `UnicodeEncodeError` for encoding issues). Add a metric or counter to track how often fallback occurs, so operators can detect if tree-sitter is failing systematically for certain languages or file patterns.
**Dimension(s)**: correctness, maintainability

### P2 — Path canonicalization logic assumes prefixes end with slash after normalization
**File**: `path_utils.py`:24, `config.py`:135-140
**Evidence**: 
```python
# path_utils.py:24
value = value if value.endswith("/") else f"{value}/"
# config.py:135-140
def _normalize_mirror_prefix(prefix: str) -> str:
    normalized = prefix.strip()
    if not normalized:
        return ""
    return normalized if normalized.endswith("/") else f"{normalized}/"
```
**Why it matters**: The normalization logic ensures prefixes end with `/`, which is then used in `startswith()` checks. This is correct for the current usage, but the logic is duplicated between `path_utils.py:_normalized_prefixes()` and `config.py:_normalize_mirror_prefix()`. If one is updated and the other isn't, inconsistency could introduce bugs. Additionally, the logic doesn't handle Windows-style paths with backslashes, though this may be intentional given the Unix-focused codebase.
**Suggested fix**: Consolidate the normalization logic into a single shared utility function. Add a comment clarifying that Unix-style forward slashes are expected and backslashes are not supported. Consider adding a validation check that rejects backslash-containing prefixes on Unix systems.
**Dimension(s)**: correctness, maintainability

### P2 — Config validation for RRF parameters doesn't check semantic consistency
**File**: `config.py`:561-578
**Evidence**: The RRF parameters are parsed independently with individual bounds checks:
```python
hybrid_vector_weight = _parse_float_env("COCOINDEX_HYBRID_VECTOR_WEIGHT", _DEFAULT_HYBRID_VECTOR_WEIGHT, 0.0, 2.0)
hybrid_fts5_weight = _parse_float_env("COCOINDEX_HYBRID_FTS5_WEIGHT", _DEFAULT_HYBRID_FTS5_WEIGHT, 0.0, 2.0)
hybrid_rrf_k = _parse_int_env("COCOINDEX_HYBRID_RRF_K", _DEFAULT_HYBRID_RRF_K, 1, 500)
```
**Why it matters**: There is no validation that the RRF parameters are semantically consistent with each other. For example, if `hybrid_vector_weight` is set to 0.0, the vector lane is effectively disabled, but the code doesn't warn about this. If `hybrid_rrf_k` is set to 1, RRF degenerates to a no-op, but this isn't flagged. The 017 empirical sweep locked these values at (K=60, V=0.9, F=0.5) for a reason, but users can override to nonsensical combinations without warning.
**Suggested fix**: Add cross-parameter validation after parsing individual values. Warn if vector_weight or fts5_weight are at extreme boundaries (0.0 or 2.0). Warn if rrf_k is at the minimum (1) or if both weights are near 0. Document the empirical basis for the locked defaults in the code comments.
**Dimension(s)**: correctness, documentation

### P2 — Reranker path-class boost reads env on every call
**File**: `reranker.py`:20-47
**Evidence**: 
```python
def _apply_path_class_boost(
    scores: list[float],
    head: list[QueryResult],
) -> list[float]:
    flag = os.environ.get("COCOINDEX_RERANK_PATH_CLASS_BOOST", "").strip().lower()
    if flag not in {"1", "true", "yes", "on"}:
        return scores
    # ... lazy import and parse on every call
    from .config import _DEFAULT_PATH_CLASS_FACTORS, _parse_json_dict_env
    factors = _parse_json_dict_env("COCOINDEX_RERANK_PATH_CLASS_FACTORS", _DEFAULT_PATH_CLASS_FACTORS)
```
**Why it matters**: The function reads environment variables and performs JSON parsing on every rerank call. This is intentional (per comment: "Reads env on every call so bench lane swaps + tests can change behavior without daemon restart"), but it has a correctness risk: if the env var is set to invalid JSON mid-run, the parse will fail and fall back to defaults on every call, potentially causing performance degradation or inconsistent behavior. The warning is logged, but the function continues with defaults.
**Suggested fix**: Cache the parsed factors and only re-parse when the env var changes. Add a counter to track how many times parse failures occur, and log an error if it happens repeatedly. Consider whether the dynamic reload is worth the complexity — tests could use a dedicated test config instead.
**Dimension(s)**: correctness, performance

### P2 — Default embedder consistency not enforced at runtime
**File**: `registered_embedders.py`:156-167, `config.py`:13
**Evidence**: 
```python
# registered_embedders.py:140
_DEFAULT_NAME = "sbert/nomic-ai/CodeRankEmbed"
# config.py:13
_DEFAULT_MODEL = "sbert/nomic-ai/CodeRankEmbed"
# registered_embedders.py:156-167
def default_embedder() -> EmbedderMetadata:
    metadata = get_embedder_metadata(_DEFAULT_NAME)
    if metadata is None:
        raise RuntimeError(f"Default embedder {_DEFAULT_NAME!r} not found in MANIFESTS — registry and config.py have drifted")
```
**Why it matters**: The consistency between `_DEFAULT_NAME` in `registered_embedders.py` and `_DEFAULT_MODEL` in `config.py` is only enforced by a test (per comment "Should match `cocoindex_code.config._DEFAULT_MODEL`. Enforced by test."). If the test is not run or is disabled, these constants could drift apart, causing config validation to fail at runtime. The enforcement should be at the module level or import time, not just in tests.
**Suggested fix**: Move the consistency check to module load time in `registered_embedders.py` or `config.py`. Have one module import the default from the other to eliminate duplication. Alternatively, define the default in a single location and import it in both modules.
**Dimension(s)**: correctness, maintainability

## Dimension coverage delta
- correctness: covered
- security: not-yet
- traceability: not-yet
- maintainability: partial
- code-quality: not-yet
- architecture: not-yet
- tests: partial
- documentation: partial
- performance: partial
- embedder-agnosticism: not-yet
- reranker-agnosticism: not-yet
- reproducibility: not-yet

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 1
New P2 in this iter: 5
