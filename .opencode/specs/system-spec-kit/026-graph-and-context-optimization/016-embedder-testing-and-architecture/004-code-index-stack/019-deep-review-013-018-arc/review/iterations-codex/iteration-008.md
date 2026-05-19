# Codex Iteration 008 — embedder agnosticism

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: nomic promotion evidence and embedder metadata drift.
- Scope: `registered_embedders.py`, benchmark report/results docs.
- Devin coverage: iter 003 found missing ADR for nomic; iter 004 found dimension-migration docs missing.
- Adversarial angle: check whether the default's registry guidance still reflects being default.
- Evidence plan: cite `_DEFAULT_NAME` and the stale manifest notes for the same model.

## Cross-reference to devin pass
- Building on devin iter 003: confirms missing ADR is not the only nomic traceability issue.
- Devin finding [003:nomic ADR] (EXPANDED): the registry itself still describes the production default as an alternative.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py`:76-85,140-167
- `.opencode/skills/mcp-coco-index/README.md`:199-208
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/results.csv`:1-4

## Findings

### P2 — nomic is the default but registry guidance still calls it an alternative
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py`:76-85
**Evidence**:
```python
name="sbert/nomic-ai/CodeRankEmbed",
notes="Alternative code-tuned embedder from nomic. Python-leaning training data. Use if jina-code underperforms on your repo.",
...
_DEFAULT_NAME = "sbert/nomic-ai/CodeRankEmbed"
```
**Why it matters**: The operator-facing registry is supposed to explain when to use each embedder. It now tells users the default should be used only if a previous default underperforms.
**Suggested fix**: Update the `notes` field to describe the 2026-05-19 default decision and move the "alternative" wording to the old Jina entry if that model remains registered.
**Dimension(s)**: embedder-agnosticism, documentation, maintainability

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- embedder-agnosticism: covered
- reproducibility: covered

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 1
