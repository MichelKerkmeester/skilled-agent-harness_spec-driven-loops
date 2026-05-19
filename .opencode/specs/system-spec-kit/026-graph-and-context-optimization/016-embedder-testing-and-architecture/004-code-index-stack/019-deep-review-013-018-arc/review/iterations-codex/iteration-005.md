# Codex Iteration 005 — documentation

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: documentation accuracy against production defaults.
- Scope: `README.md`, `cocoindex_code/README.md`, `SKILL.md`, `INSTALL_GUIDE.md`, `config.py`.
- Devin coverage: iter 004 caught the Jina throwaway header; iter 003 caught ADR placement.
- Adversarial angle: find docs that tell operators the opposite of the production defaults.
- Evidence plan: cite docs lines and compare to config constants.

## Cross-reference to devin pass
- Building on devin iter 004: expands adapter-header drift into broader operator documentation drift.
- Devin finding [004:Jina header] (EXPANDED): multiple user-facing docs still describe pre-018/pre-nomic behavior.

## Files reviewed
- `.opencode/skills/mcp-coco-index/README.md`:69-91,199-208,330-333
- `.opencode/skills/mcp-coco-index/SKILL.md`:18,270-280
- `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`:95-102
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:13,19-24,560-580

## Findings

### P1 — operator docs contradict the shipped default retrieval stack
**File**: `.opencode/skills/mcp-coco-index/README.md`:69-91
**Evidence**:
```markdown
Hybrid search ... and cross-encoder rerank are opt-in v1.2.0 features (default OFF).
...
Cross-encoder rerank ... Local GTE multilingual reranker
```
Production config defaults hybrid and rerank to true and sets the reranker to `jinaai/jina-reranker-v3`. The same README also calls the nomic default "Jina-code default" and includes duplicate `nomic-ai/CodeRankEmbed` rows.
**Why it matters**: This is active operator guidance. A user reading the docs would expect vector-only default behavior and a GTE reranker, while production starts hybrid + Jina rerank by default.
**Suggested fix**: Update all public docs to name the actual defaults: `COCOINDEX_HYBRID=true`, `COCOINDEX_RERANK=true`, `jinaai/jina-reranker-v3`, and `sbert/nomic-ai/CodeRankEmbed`. Remove duplicate/stale embedder rows and update INSTALL_GUIDE's old EmbeddingGemma line.
**Dimension(s)**: documentation, reproducibility, architecture

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: covered
- tests: covered
- documentation: covered
- performance: partial
- reproducibility: partial

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 1
New P2 in this iter: 0
