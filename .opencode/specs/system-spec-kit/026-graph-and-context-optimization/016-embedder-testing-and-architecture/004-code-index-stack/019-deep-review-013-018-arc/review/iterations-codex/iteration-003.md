# Codex Iteration 003 — maintainability

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: maintainability of config boundaries.
- Scope: `config.py`, `reranker.py`, and Jina adapter reuse of reranker helpers.
- Devin coverage: iter 001 noted per-call env parsing; iter 004 noted path-class factors may be reranker-specific.
- Adversarial angle: identify dead config fields and direct env reads that make daemon behavior hard to reason about.
- Evidence plan: cite config fields loaded into `Config` and the later direct reads that ignore those fields.

## Cross-reference to devin pass
- Building on devin iter 001: expands "reads env on every call" into an architecture boundary violation.
- Devin finding [001:reranker env parsing] (EXPANDED): `Config.rerank_path_class_*` is parsed but not the source of truth.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:472-474,593-600,642-644
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py`:20-47
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`:32-37,173-175

## Findings

### P2 — path-class boost has two configuration authorities
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:593-600
**Evidence**:
```python
rerank_path_class_boost = _parse_bool_env("COCOINDEX_RERANK_PATH_CLASS_BOOST", False)
rerank_path_class_factors = _parse_json_dict_env("COCOINDEX_RERANK_PATH_CLASS_FACTORS", ...)
```
But reranking does not consume those `Config` fields. `_apply_path_class_boost()` rereads the same env vars directly on every rerank call, and Jina imports that helper.
**Why it matters**: Operators and tests cannot reason about a single config snapshot. Some settings require daemon restart; this one mutates mid-process. That weakens the code-over-bandaids principle because behavior depends on ambient env state rather than explicit config.
**Suggested fix**: Pass parsed boost settings into the adapter or expose a small immutable rerank config object. If dynamic env reload is required for benches, isolate it behind a bench-only override.
**Dimension(s)**: maintainability, architecture, code-quality

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: covered
- tests: partial
- documentation: partial
- performance: partial
- reproducibility: partial

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 1
