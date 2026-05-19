# Codex Iteration 002 — code-quality

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: code-quality around adapter-specific parsing and fail-soft behavior.
- Scope: `rerankers_jina_v3.py`, `reranker.py`, `test_rerank_dispatch.py`.
- Devin coverage: iter 004 confirmed Jina doc drift and opt-in BGE validation gaps, but did not inspect adapter-specific env parsing.
- Adversarial angle: find the model-bandaid path where production defaults can be broken by one malformed operator env var.
- Evidence plan: cite the unguarded `int()` conversion and compare it to config.py's bounded parsers.

## Cross-reference to devin pass
- Building on devin iter 004: expands the "jina adapter still throwaway" concern into an executable production-path bug.
- Devin finding [004:Jina header] (EXPANDED): the adapter is not just mislabeled; it bypasses the configuration parser discipline.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`:145-153
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:347-441
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_dispatch.py`:44-79

## Findings

### P1 — invalid `COCOINDEX_RERANK_JINA_MAX_DOC_CHARS` can crash the default reranker path
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`:145-153
**Evidence**:
```python
max_doc_chars = int(
    os.environ.get("COCOINDEX_RERANK_JINA_MAX_DOC_CHARS", _DEFAULT_MAX_DOC_CHARS)
)
docs = [c.content[:max_doc_chars] for c in head]
try:
    results = model.rerank(query, docs)
```
The `int()` conversion runs before the protected model call. `COCOINDEX_RERANK_JINA_MAX_DOC_CHARS=bad` raises `ValueError`; a negative value silently slices documents to nearly empty strings. The shared `Config` parser already has bounded int/float helpers, but this adapter bypasses them.
**Why it matters**: Jina v3 is the production default. One malformed env var can turn every reranked search into an exception after the model loads, violating the fail-soft contract used elsewhere.
**Suggested fix**: Parse this value through a bounded config helper with fallback, e.g. `1..50000`, and test invalid, zero, and negative values.
**Dimension(s)**: code-quality, correctness, maintainability

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: partial
- tests: partial
- documentation: partial
- performance: not-yet
- reproducibility: partial

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 1
New P2 in this iter: 0
