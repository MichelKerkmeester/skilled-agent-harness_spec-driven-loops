---
title: "Summary: 016/004/018 Rerank Matrix Re-Bench"
description: "Implementation summary for the non-shared tranche of the final reranker verdict packet: matrix harness, analyzer, dispatch tests, packet docs, and handoff awaiting 016/017 commits."
trigger_phrases:
  - "016/004/018 summary"
  - "rerank matrix summary"
  - "final reranker verdict handoff"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench"
    last_updated_at: "2026-05-19T17:55:00Z"
    last_updated_by: "main-agent"
    recent_action: "jina-v3 locked as production default; ADR-021 shipped"
    next_safe_action: "Commit 018 + close arc"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
      - "evidence/rerank-matrix-results.md"
      - "evidence/phase2-comparison-018-final.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004018"
      session_id: "016-004-018-summary"
      parent_session_id: "016-004-018"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Summary: 016/004/018 Rerank Matrix Re-Bench

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Partial: Phase 1-2 + docs complete; Phase 3-5 blocked |
| Updated | 2026-05-19 |
| Level | 2 |
| Scope | New harness, analyzer, dispatch tests, packet docs, metadata |
| SpawnAgent | Not used |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Implemented the non-shared tranche allowed while 016 and 017 are still in flight.

### Harness

`rerank-matrix-bench.sh` now supports:

| Capability | Status |
|---|---|
| Lane A no-rerank ablation | Implemented with `COCOINDEX_RERANK=false` and `COCOINDEX_RERANK_ENABLED=false` for forward compatibility |
| Lane B BGE baseline | Implemented with `BAAI/bge-reranker-v2-m3` |
| Lane C BGE + path-class | Implemented with `COCOINDEX_RERANK_PATH_CLASS_BOOST=true` |
| Lane D jina-v3 | Implemented with `jinaai/jina-reranker-v3` and adapter override `jina_v3` |
| Optional Lane E mxbai | Auto-added if `rerankers_mxbai.py` exists |
| Matrix controls | `--resume`, `--lanes`, `--iterations`, `FIXTURE_OVERRIDE` |
| Per-run JSON | Writes `evidence/runs/lane{ID}-iter{N}.json` with env, metrics, per-probe rows, and artifact paths |

The harness uses the existing corrected fixture and path extraction logic adapted from `run-phase2-smoke.sh`. The legacy smoke script itself always runs its own three lanes, so the matrix harness runs its own single-lane loop to avoid contaminating the run shape.

### Known Issues

Lane A no-rerank ablation remains a deferred follow-up from the final 018 verdict: the bench path observed a 32-sec/probe timeout shape when rerank was disabled. Current runtime reads `COCOINDEX_RERANK`; the harness also exported legacy `COCOINDEX_RERANK_ENABLED` for compatibility, but the bug should be tracked as a Lane A dispatch/timeout issue rather than as evidence against the final Jina-v3 default. Packet 020 records the follow-up and keeps Lane A evidence out of production-default claims.

### Analyzer

`rerank-matrix-analyze.py` loads normalized run JSONs and emits:

| Output | Status |
|---|---|
| Per-lane summary | Implemented |
| Mean and stddev hit rate | Implemented |
| Per-probe majority heatmap | Implemented |
| p50/p95/p99 latency means | Implemented |
| Peak RSS max | Implemented |
| 5-criterion decision matrix | Implemented |
| Deterministic picker | Implemented |
| Winner rationale and runner-up scenario | Implemented |

### Dispatch Tests

`tests/test_rerank_dispatch.py` adds five tests covering ablation config, model override config, default BGE adapter dispatch, jina-v3 override dispatch, and model-keyed adapter cache behavior.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-bench.sh` | Created | Matrix bench harness |
| `../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py` | Created | Matrix result aggregator and picker |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_dispatch.py` | Created | Rerank dispatch and ablation tests |
| `plan.md` | Created | L2 plan |
| `tasks.md` | Created | Task ledger and blockers |
| `checklist.md` | Created | Verification checklist |
| `implementation-summary.md` | Created | Handoff and current state |
| `description.json` | Created | Packet metadata |
| `graph-metadata.json` | Created | Graph metadata |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The work honored the parallel execution boundary. Because `git log --oneline -15` did not show both `feat(016/004/016)` and `feat(016/004/017)`, this pass did not edit `config.py`, `cocoindex_code/README.md`, or the bake-off `decision-record.md`, and did not run the full matrix or production-default lock.

Sequential-thinking MCP was invoked five times before edits. Each call returned `user cancelled MCP tool call`; this summary records the cancellation rather than claiming the tool succeeded.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|---|---|
| Use the existing Phase 2 bench folder | Keeps the matrix beside the corrected fixture and legacy smoke harness |
| Run a single-lane loop instead of invoking legacy smoke per lane | The legacy script hardcodes three lanes and would create contaminated matrix runs |
| Set both `COCOINDEX_RERANK` and `COCOINDEX_RERANK_ENABLED` | Current code reads `COCOINDEX_RERANK`; the extra var is harmless and future-compatible with the spec wording |
| Default `COCOINDEX_CODE_DIR` to repo `.cocoindex_code` in the harness | Avoids sandbox/user-home daemon lock failures while preserving operator override |
| Do not use SpawnAgent | The task was bounded enough after the commit gate blocked shared work |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|---|---|
| Sequential-thinking MCP | Attempted five times; each returned `user cancelled MCP tool call` |
| SpawnAgent | Not used |
| `bash -n rerank-matrix-bench.sh` | PASS |
| `python -m py_compile rerank-matrix-analyze.py tests/test_rerank_dispatch.py` | PASS |
| `python -m pytest tests/test_rerank_dispatch.py -q` | PASS: 5 passed |
| A+B smoke subset | BLOCKED: daemon smoke did not complete reliably in sandbox; invalid partial artifacts removed |
| Full matrix | BLOCKED until 017 commit is visible |
| Strict validation | Pending after metadata refresh |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **PHASE 1-2 + DOCS COMPLETE; AWAITING 016 + 017 COMMITS FOR PHASE 3-5.**
2. The A+B smoke subset could not be completed in this sandbox. The first attempt failed on `~/.cocoindex_code/daemon.spawn-lock` permissions; after adding a repo-local `COCOINDEX_CODE_DIR` default, the daemon call still did not complete reliably. Partial invalid artifacts were removed so the analyzer will not consume them.
3. No production default was changed. No ADR-021 or README final-default update was written. Those require empirical full-matrix numbers on the post-017 pipeline.

## Commit Handoff

No git commit was made. Intended commit scope for this tranche:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-bench.sh`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_dispatch.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/graph-metadata.json`
<!-- /ANCHOR:limitations -->
