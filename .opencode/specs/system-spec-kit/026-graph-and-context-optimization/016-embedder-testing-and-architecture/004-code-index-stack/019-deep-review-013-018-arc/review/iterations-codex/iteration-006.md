# Codex Iteration 006 — performance

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: performance costs of query expansion when enabled.
- Scope: `query.py`, `query_expansion.py`, `test_query_expansion.py`.
- Devin coverage: iter 001 raised query expansion root cause as P1, but did not isolate one plausible mechanism.
- Adversarial angle: check if the opt-in feature spends extra embedding calls on low-value variants.
- Evidence plan: cite dense variant generation and serial embedding fanout.

## Cross-reference to devin pass
- Building on devin iter 001: expands the query-expansion P1 with a plausible performance/quality mechanism.
- Devin finding [001:query expansion root cause] (EXPANDED): expansion prioritizes identifier spellings over synonyms and embeds variants serially.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query_expansion.py`:187-198,243-249
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`:699-710,730-735
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_query_expansion.py`:75-89

## Findings

### P2 — query expansion serially embeds up to six variants, mostly identifier spellings
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`:699-710
**Evidence**:
```python
if expanded_query.expansion_applied and config.hybrid_enabled:
    dense_queries = expanded_query.dense_variants
query_embeddings = [
    await embedder.embed(dense_query, query_prompt_name)
    for dense_query in dense_queries
]
```
`query_expansion.py` appends phrase + identifier variants before synonym variants, then slices `variant_pool[:max_variants]`. A smoke run for `find files` produced dense variants `findFiles`, `find_files`, `FindFiles`, etc.; synonym variants such as `find paths` were pushed into FTS only.
**Why it matters**: Enabling expansion can multiply embedding latency while not actually sending the most semantic synonym alternatives through dense retrieval. That is a credible contributor to the regression Devin flagged.
**Suggested fix**: Reorder or score variants so dense fanout includes a bounded mix of original, synonym phrase, and identifier forms. Consider parallel embedding or a batch embedder API if available.
**Dimension(s)**: performance, correctness, code-quality

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- reproducibility: partial

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 1
