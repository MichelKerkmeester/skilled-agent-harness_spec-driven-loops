# Codex Iteration 001 — architecture

## Sequential-thinking preflight
- MCP status: attempted twice; runtime returned `user cancelled MCP tool call`.
- Focus: architecture, config ownership, and env-var contract boundaries.
- Scope: `config.py`, `query.py`, `sweep-rrf.sh`, 017 spec artifacts.
- Devin coverage: iter 004 flagged RRF generalization as P2, but did not check whether documented rollback knobs are wired.
- Adversarial angle: find the hidden hardcode where future-proof env names exist in specs/harnesses but production only reads the old names.
- Evidence plan: cite production parser lines plus spec/harness lines naming the mismatched env vars.

## Cross-reference to devin pass
- Building on devin iter 004: expands the RRF agnosticism concern from "tested on one embedder" to a live configuration contract mismatch.
- Devin finding [004:RRF lock] (EXPANDED): the documented future-proof knobs are not production knobs.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:561-578
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/spec.md`:91-102,124-125
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh`:136-141

## Findings

### P1 — documented RRF rollback/env names do not affect production
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:561-578
**Evidence**:
```python
hybrid_vector_weight = _parse_float_env("COCOINDEX_HYBRID_VECTOR_WEIGHT", ...)
hybrid_fts5_weight = _parse_float_env("COCOINDEX_HYBRID_FTS5_WEIGHT", ...)
hybrid_rrf_k = _parse_int_env("COCOINDEX_HYBRID_RRF_K", ...)
```
The 017 spec promises `COCOINDEX_RRF_K`, `COCOINDEX_RRF_VEC_WEIGHT`, and `COCOINDEX_RRF_FTS_WEIGHT` as the new defaults/rollback surface, while the sweep harness exports both old and new names. Production only reads the `COCOINDEX_HYBRID_*` names.
**Why it matters**: An operator following the packet rollback instructions can set the documented `COCOINDEX_RRF_*` variables and get no behavior change. This is a live reproducibility and rollback defect, not only documentation drift.
**Suggested fix**: Add production aliases for the `COCOINDEX_RRF_*` names or update the spec/rollback docs to only name `COCOINDEX_HYBRID_*`. Add a test that `COCOINDEX_RRF_K=90` changes `Config.from_env().hybrid_rrf_k`.
**Dimension(s)**: architecture, reproducibility, documentation

## Dimension coverage delta (codex pass)
- architecture: partial
- code-quality: not-yet
- maintainability: partial
- tests: partial
- documentation: partial
- performance: not-yet
- reproducibility: partial

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 1
New P2 in this iter: 0
