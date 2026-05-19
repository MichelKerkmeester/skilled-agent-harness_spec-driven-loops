# Codex Iteration 004 — tests

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: tests for the production-default reranker and rerank-off path.
- Scope: `test_rerank_dispatch.py`, `query.py`, `rerankers_jina_v3.py`.
- Devin coverage: iter 004 found BGE opt-in validation missing and iter 003 tracked the Lane A bug as untracked.
- Adversarial angle: check whether tests prove the paths operators will actually use, not just config parsing.
- Evidence plan: cite tests that mock dispatch only, then cite the real query/rerank integration lines they do not cover.

## Cross-reference to devin pass
- Building on devin iter 004: confirms opt-in reranker validation is thin and expands it to the default Jina adapter path.
- Devin finding [004:opt-in BGE not tested] (EXPANDED): neither BGE nor the real Jina adapter is exercised end to end.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_dispatch.py`:14-89
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`:806-823
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`:127-190

## Findings

### P2 — reranker tests mock dispatch but miss real default-adapter failure modes
**File**: `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_dispatch.py`:44-79
**Evidence**:
```python
fake_module = type(sys)("cocoindex_code.rerankers_jina_v3")
fake_module.JinaRerankerAdapter = FakeJinaAdapter
...
adapter = reranker_module.get_reranker_adapter(_DEFAULT_RERANK_MODEL)
```
The test proves prefix dispatch chooses a fake class. It does not instantiate `JinaRerankerAdapter`, cover malformed `COCOINDEX_RERANK_JINA_MAX_DOC_CHARS`, or cover `query_codebase()` with `COCOINDEX_RERANK=false`.
**Why it matters**: The known Lane A issue and the default Jina adapter both live below this mocked boundary. The current tests can pass while the production path fails.
**Suggested fix**: Add lightweight adapter tests with a fake model object and direct `JinaRerankerAdapter.rerank()` calls. Add a `query_codebase()` integration test with a stub embedder/db fixture for rerank-on and rerank-off.
**Dimension(s)**: tests, correctness, maintainability

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: covered
- tests: covered
- documentation: partial
- performance: partial
- reproducibility: partial

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 1
