# Iteration 002 — Security

## Files reviewed
- `config.py`:110-344 — JSON parsing from env vars
- `path_utils.py`:31-42 — path manipulation and prefix matching
- `query.py`:116-251 — SQL construction with parameterized queries
- `fts_index.py`:88-134 — FTS5 query normalization and SQL construction
- `query_expansion.py`:128-156 — synonym application with product()
- `sweep-rrf.sh`:1-207 — bench harness shell script
- `sweep-rrf.py`:51-107 — JSON parsing from env vars in bench harness

## Findings

### P2 — JSON parsing from env vars lacks length limits
**File**: `config.py`:110-132, 184-246
**Evidence**: 
```python
def _parse_json_string_list_env(var_name: str) -> list[str]:
    raw_value = os.environ.get(var_name, "")
    if not raw_value.strip():
        return []
    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError as exc:
        raise ValueError(f"{var_name} must be a JSON array of strings") from exc
```
**Why it matters**: The JSON parsing functions (`_parse_json_string_list_env`, `_parse_json_dict_env`, etc.) read environment variables and parse them with `json.loads()` without any length limits. While `json.loads()` is safe from arbitrary code deserialization (unlike `pickle`), an attacker who can set env vars could supply megabytes of JSON to cause memory exhaustion or DoS. This is particularly relevant for `COCOINDEX_MIRROR_PREFIXES`, `COCOINDEX_CODE_EXCLUDED_PATTERNS`, `COCOINDEX_TREE_SITTER_LANGUAGES`, and `COCOINDEX_RERANK_PATH_CLASS_FACTORS`. The code validates types but not size.
**Suggested fix**: Add length limits to raw env var values before JSON parsing (e.g., max 10KB per var). Add limits on the number of items in parsed arrays/dicts (e.g., max 100 items). Log warnings when limits are hit and fall back to defaults.
**Dimension(s)**: security, performance

### P2 — Path prefix validation doesn't reject malicious patterns
**File**: `config.py`:160-181, `path_utils.py`:31-42
**Evidence**: 
```python
def _parse_canonical_mirror_env(mirror_prefixes: list[str]) -> str:
    raw_value = os.environ.get("COCOINDEX_CANONICAL_MIRROR", _DEFAULT_CANONICAL_MIRROR)
    stripped = raw_value.strip()
    if not stripped:
        logger.warning("Ignoring empty COCOINDEX_CANONICAL_MIRROR; falling back to %r", _DEFAULT_CANONICAL_MIRROR)
        return _normalize_mirror_prefix(_DEFAULT_CANONICAL_MIRROR)
    recognized = set(_DEFAULT_MIRROR_PREFIXES) | set(mirror_prefixes)
    normalized = _normalize_mirror_prefix(stripped)
    if stripped.endswith("/") or normalized in recognized:
        return normalized
```
**Why it matters**: The canonical mirror validation checks if the value ends with `/` or is in the recognized set, but doesn't validate against malicious patterns. An attacker who can set `COCOINDEX_CANONICAL_MIRROR` could potentially set it to `../../` or other path traversal patterns. While the downstream usage is `startswith()` checks (which are safe), the validation doesn't explicitly reject suspicious patterns. Additionally, the code doesn't validate that mirror prefixes are absolute paths or don't contain null bytes.
**Suggested fix**: Add explicit validation to reject path traversal patterns (`../`, `..\\`), null bytes, and other suspicious characters. Validate that prefixes are either absolute paths or clearly relative safe patterns. Consider restricting mirror prefixes to alphanumeric, hyphen, underscore, and forward slash only.
**Dimension(s)**: security

### P2 — FTS5 query normalization doesn't escape double quotes in tokens
**File**: `fts_index.py`:88-91, `query_expansion.py`:166-168
**Evidence**: 
```python
# fts_index.py:88-91
def _normalize_fts_query(query: str) -> str:
    tokens = [token.strip() for token in TOKEN_RE.findall(query) if token.strip()]
    return " OR ".join(f'"{token}"' for token in tokens)
# query_expansion.py:166-168
def _quote_fts5_phrase(value: str) -> str:
    escaped = _FTS5_QUOTE_RE.sub('""', value)
    return f'"{escaped}"'
```
**Why it matters**: The FTS5 query normalization quotes tokens with double quotes but doesn't handle the case where a token already contains a double quote. The `query_expansion.py` version does escape double quotes (substituting `"` with `""`), but the `fts_index.py` version does not. This could lead to malformed FTS5 queries if user input contains quotes. While this is unlikely to cause SQL injection (FTS5 MATCH clauses are not full SQL), it could cause query errors or unexpected behavior.
**Suggested fix**: Apply the same double-quote escaping logic from `query_expansion.py` to `fts_index.py:_normalize_fts_query()`. Ensure consistent escaping across both code paths.
**Dimension(s)**: security, correctness

### P2 — Query expansion synonym cap is per-word, not total
**File**: `query_expansion.py`:14, 128-156
**Evidence**: 
```python
_SYNONYM_CAP = 8  # caps combinations per synonym application
def apply_synonyms(words: list[str], synonym_dict: dict[str, list[str]]) -> list[list[str]]:
    # ...
    for candidate in islice(product(*choices), _SYNONYM_CAP):
```
**Why it matters**: The `_SYNONYM_CAP = 8` limits the number of synonym combinations per call to `apply_synonyms()`, but this is called once per phrase candidate. If a query has multiple content words and each has many synonyms, the total number of variants could still explode. The `_MAX_EXPANDABLE_CONTENT_WORDS = 4` limits the number of words, but 4 words with 5 synonyms each could still generate `5^4 = 625` combinations before the `islice(product(*choices), _SYNONYM_CAP)` kicks in. The cap applies to the Cartesian product, not the total expansion.
**Suggested fix**: Consider adding a total variant limit (e.g., max 20 total variants across all synonym applications) in addition to the per-product cap. Document the interaction between `_MAX_EXPANDABLE_CONTENT_WORDS`, `_SYNONYM_CAP`, and the actual total variant count.
**Dimension(s)**: security, performance

### P2 — Bench harness JSON parsing lacks validation
**File**: `sweep-rrf.py`:51-60, 82-95
**Evidence**: 
```python
def _parse_json_list(raw_value: str, default: list[int] | list[float], var_name: str) -> list[Any]:
    if not raw_value.strip():
        return list(default)
    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError as exc:
        raise ValueError(f"{var_name} must be a JSON array") from exc
    if not isinstance(parsed, list):
        raise ValueError(f"{var_name} must be a JSON array")
    return parsed
```
**Why it matters**: The bench harness JSON parsing functions are similar to the production config parsing but lack some validation. For example, there's no length limit on the input, and the validation for numeric values happens later in `parse_grid_from_env()`. This is less critical since these are bench tools not production code, but it could still be abused if the harness is run on untrusted input.
**Suggested fix**: Add length limits and item count limits similar to the production config parsing. Consider reusing the validation functions from `config.py` if possible to avoid duplication.
**Dimension(s)**: security

### P2 — Shell script bench harness doesn't validate environment variables
**File**: `sweep-rrf.sh`:9-18, 136-141
**Evidence**: 
```python
FIXTURE="${COCOINDEX_RRF_SWEEP_FIXTURE:-$SCRIPT_DIR/code-retrieval-fixture-corrected.json}"
export COCOINDEX_RRF_K="$rrf_k"
export COCOINDEX_RRF_VEC_WEIGHT="$vec_weight"
export COCOINDEX_RRF_FTS_WEIGHT="$fts_weight"
```
**Why it matters**: The shell script uses environment variables directly without validation. If an attacker can set `COCOINDEX_RRF_SWEEP_FIXTURE` to an arbitrary path, they could cause the script to read unintended files. Similarly, the RRF parameters are exported without validation. While this is a bench tool, it could be abused in CI/CD environments if env vars are controlled by untrusted sources.
**Suggested fix**: Add validation for critical environment variables like `FIXTURE` to ensure they point to expected paths. Validate that numeric parameters are within expected ranges. Consider using `set -u` (which is already set with `set -uo pipefail`) to catch unset variables.
**Dimension(s)**: security

## Dimension coverage delta
- correctness: covered
- security: covered
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
New P1 in this iter: 0
New P2 in this iter: 6
