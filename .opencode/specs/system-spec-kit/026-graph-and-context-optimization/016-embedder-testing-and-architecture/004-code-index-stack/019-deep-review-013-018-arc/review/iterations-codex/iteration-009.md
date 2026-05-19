# Codex Iteration 009 — reranker agnosticism

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: reranker-agnosticism and hidden BGE assumptions.
- Scope: `config.py`, `reranker.py`, `rerankers_jina_v3.py`, 018 bench script.
- Devin coverage: iter 004 found path-class boosts may be BGE-tuned.
- Adversarial angle: see whether the BGE-tuned path-class boost can still modify Jina scores.
- Evidence plan: cite shared boost helper and Jina adapter call site.

## Cross-reference to devin pass
- Building on devin iter 004: expands path-class factor documentation into an actual hidden assumption in the default Jina path.
- Devin finding [004:path-class boost factors] (EXPANDED): the BGE-era boost helper composes into Jina if the flag is enabled.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:29-39
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py`:20-47
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`:173-175

## Findings

### P2 — Jina adapter still applies the BGE-era path-class boost when the flag is on
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`:173-175
**Evidence**:
```python
# Shared with CrossEncoderRerankerAdapter so both candidates compose identically.
scores = _apply_path_class_boost(scores, head)
```
The shared helper multiplies reranker scores by factors originally documented as "ADR-015 Phase 2" defaults. Jina native scores can be negative, and multiplicative factors have different semantics across score distributions.
**Why it matters**: The operator principle says reranker alternatives should remain wide and honest. Applying BGE-tuned multipliers to Jina without score-normalization guidance is a hidden reranker assumption.
**Suggested fix**: Gate default path-class factors by reranker family, or document/test score-distribution behavior for Jina before allowing the boost flag to compose with it.
**Dimension(s)**: reranker-agnosticism, architecture, documentation

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- embedder-agnosticism: covered
- reranker-agnosticism: covered
- reproducibility: covered

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 1
