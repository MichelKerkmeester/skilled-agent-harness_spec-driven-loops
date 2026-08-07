# Codex Iteration 015 — score-scale and final cross-check

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: final architecture/code-quality cross-check from sidecar reports.
- Scope: `query.py`, `fusion.py`, `config.py`, `reranker.py`.
- Devin coverage: iter 004 touched path-class/reranker agnosticism, but did not quantify score-scale coupling.
- Adversarial angle: check whether heuristic boosts swamp the calibrated RRF layer.
- Evidence plan: cite RRF formula and heuristic additions.

## Cross-reference to devin pass
- Building on devin iter 004: expands RRF/reranker agnosticism from documentation caveat into score-scale coupling.
- Devin finding [004:RRF lock] (EXPANDED): locked RRF scores are later modified by larger heuristic constants.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`:473-487
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py`:42-67
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:19-21

## Findings

### P1 — hybrid heuristic boosts can dominate calibrated RRF scores
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`:473-487
**Evidence**:
```python
score = fused.rrf_score
...
score += 0.05
...
score += 0.10
```
With defaults `K=60`, `V=0.9`, `F=0.5`, a rank-1 hit in both RRF lanes contributes about `0.9/61 + 0.5/61 = 0.023`. The implementation boost `0.05` and canonical boost `0.10` are larger than the whole two-lane fused score.
**Why it matters**: The 017 RRF calibration can be swamped before reranking. This is a hidden architecture coupling between retrieval math and path/canonical heuristics, and it can make "RRF is a no-op" a self-fulfilling result.
**Suggested fix**: Convert heuristics into explicit tie-breakers or scale them relative to observed RRF ranges. Rebench after the scale change.
**Dimension(s)**: architecture, correctness, reranker-agnosticism, reproducibility

## Dimension coverage delta (codex pass)
- architecture: covered
- correctness: covered
- code-quality: covered
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- embedder-agnosticism: covered
- reranker-agnosticism: covered
- reproducibility: covered

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 1
New P2 in this iter: 0
