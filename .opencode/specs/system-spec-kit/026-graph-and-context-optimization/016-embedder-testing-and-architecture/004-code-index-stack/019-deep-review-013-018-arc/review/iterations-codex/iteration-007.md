# Codex Iteration 007 — reproducibility

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: benchmark reproducibility and fixture claims.
- Scope: 017 evidence directory, `sweep-rrf.py`, `sweep-rrf.sh`, 017 spec.
- Devin coverage: iter 004 noted RRF lock was based on BGE only.
- Adversarial angle: test whether the claim "grid/harness future-proof" matches the actual evidence set.
- Evidence plan: cite the default 64-cell grid, the 7 evidence cells, and spec status language.

## Cross-reference to devin pass
- Building on devin iter 004: confirms RRF lock scope was narrower than the reusable harness implies.
- Devin finding [004:RRF lock] (EXPANDED): the harness can run a broad grid, but committed evidence contains only seven cells.

## Files reviewed
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.py`:16-19,63-95
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/spec.md`:46,124
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/evidence/cells/`:7 committed `cell-K*-V*-F*.json` files

## Findings

### P2 — RRF "future-proof" harness is broader than the evidence used to lock defaults
**File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/spec.md`:46
**Evidence**:
```markdown
7-cell sweep showed RRF tuning is a NO-OP on hit rate ...
```
The analyzer defaults define a 4 x 4 x 4 grid, but the committed evidence has seven cell JSONs. The spec does disclose seven cells, yet also frames the harness as re-runnable for future embedder/reranker swaps.
**Why it matters**: The lock is valid only for the sampled cells, not for the full default grid. The future-proofing is in the harness, not the current conclusion.
**Suggested fix**: Mark the 017 verdict as "7-cell local neighborhood sweep" and reserve "representative grid" language for a full grid run. Record the exact omitted ranges in the evidence summary.
**Dimension(s)**: reproducibility, documentation, performance

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: partial
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- reproducibility: covered

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 1
