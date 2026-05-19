---
title: "Summary: 016/004/017 Hybrid Fusion Empirical Recalibration"
description: "Partial implementation summary for the non-shared RRF sweep harness, deterministic analyzer, focused tests, and packet docs prepared before the 016 commit unlocks shared files and full bench execution."
trigger_phrases: ["016/004/017 summary", "RRF sweep summary", "hybrid fusion recalibration summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration"
    last_updated_at: "2026-05-19T17:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Sweep complete; defaults locked; ADR-020 shipped"
    next_safe_action: "Commit 017 + dispatch 018 matrix bench"
    blockers: []
    key_files:
      - "../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh"
      - "../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
      - "evidence/sweep-results.md"
      - "evidence/phase2-comparison-017-recalibrated.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004017"
      session_id: "016-004-017-summary"
      parent_session_id: "016-004-017"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Summary: 016/004/017 Hybrid Fusion Empirical Recalibration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Partial: non-shared Phase 1-2 + docs complete; Phase 3-5 blocked |
| Updated | 2026-05-19 |
| Level | 2 |
| Scope | Sweep harness, analyzer, focused tests, packet docs, metadata |
| SpawnAgent | Not used |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

PHASE 1-2 + DOCS COMPLETE; AWAITING 016 COMMIT FOR PHASE 3-5.

The safe non-shared slice is in place. `sweep-rrf.sh` can iterate the RRF grid, set per-cell env vars, restart the daemon, call the corrected Phase 2 smoke harness, and write stable cell JSON. `sweep-rrf.py` loads those cell JSON files, computes hit rate and latency metrics, applies the deterministic picker, and writes `evidence/sweep-results.md`.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh` | Created | RRF sweep wrapper with grid env vars, resume, per-cell bench execution, and aggregation |
| `../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.py` | Created | Deterministic analyzer, picker, report writer, and importable test helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rrf_config.py` | Created | Focused tests for sweep grid defaults, overrides, invalid values, and picker behavior |
| `plan.md` | Created | L2 implementation plan |
| `tasks.md` | Created | Task ledger with blockers |
| `checklist.md` | Created | Verification checklist with current evidence |
| `implementation-summary.md` | Created | Partial summary and handoff |
| `description.json` | Created | Packet metadata |
| `graph-metadata.json` | Created | Packet graph metadata |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The implementation respected the parallel-execution lock. `git log --oneline -10` did not include `feat(016/004/016)`, so `config.py`, `query.py`, `README.md`, the bake-off ADR, full sweep execution, and final no-env bench were not touched.

The wrapper sets both the requested future-facing env names (`COCOINDEX_RRF_K`, `COCOINDEX_RRF_VEC_WEIGHT`, `COCOINDEX_RRF_FTS_WEIGHT`) and the current config names (`COCOINDEX_HYBRID_RRF_K`, `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT`). This keeps the harness runnable before and after the later config alias work.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|---|---|
| Put sweep files beside `run-phase2-smoke.sh` | They orchestrate that harness and reuse its fixture/output contract directly |
| Use per-cell JSON as the analyzer interface | Expensive bench runs become resumable, inspectable, and deterministic to re-aggregate |
| Set old and new RRF env names | Current code reads `COCOINDEX_HYBRID_*`; the spec requires `COCOINDEX_RRF_*` after shared-file unlock |
| Enforce the 15 percent p95 cap inside `pick_cell()` | R12 becomes deterministic and testable without manual report interpretation |
| Defer small-grid smoke execution | Any real bench before 016 lands would measure the wrong candidate set |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Status | Evidence |
|---|---|---|
| Sequential-thinking MCP | Attempted, tool canceled | Six calls returned `user cancelled MCP tool call` |
| SpawnAgent | Pass | Not used |
| Shared-file lock | Pass | `feat(016/004/016)` absent from `git log --oneline -10`; shared files not edited |
| Shell syntax | Pass | `bash -n sweep-rrf.sh` |
| Analyzer syntax | Pass | `python -m py_compile sweep-rrf.py` |
| Focused pytest | Pass | `tests/test_rrf_config.py` |
| Full sweep | Blocked | Requires `feat(016/004/016)` |
| Final no-env bench | Blocked | Requires picked defaults |
| Strict validation | Pass for partial packet docs | `validate.sh --strict` returned `RESULT: PASSED`; final completion validation still needs full evidence |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## 6. NFR VERIFICATION

| NFR ID | Target | Status | Evidence |
|---|---|---|---|
| NFR-P01 | Default 64-cell sweep tractable | Prepared | Grid default is 4x4x4; wall-time proof blocked |
| NFR-P02 | Per-cell run bounded | Blocked | Needs post-016 bench execution |
| NFR-P03 | Picked cell p95 within 15 percent | Prepared | Picker enforces optional baseline p95 cap |
| NFR-R01 | `--resume` skips completed cells | Prepared | Wrapper skips existing cell JSONs |
| NFR-R02 | Aggregator deterministic | Pass | Sort key and picker tested |
| NFR-R03 | Rollback via inherited env vars | Pending | ADR/config lock deferred |
| NFR-C01 | Embedder-agnostic sweep | Prepared | Harness delegates embedder choice and does not reset/re-index DB |
| NFR-C02 | Reusable analyzer format | Pass | Cell JSON stores generic per-lane probes/latency/config |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## 7. KNOWN LIMITATIONS

1. Sequential-thinking MCP did not execute successfully. Six required calls were made before edits, but each returned `user cancelled MCP tool call`; this summary records the failure honestly.
2. 016 has not been committed. The 016 summary says full pytest, Phase 2 bench, metadata refresh, and strict validation are pending, and the recent git log does not contain `feat(016/004/016)`.
3. No full sweep or small-grid bench was run. Running any bench now would measure the pre-016 or in-progress 016 candidate set and violate the user's concurrency constraint.
4. Shared config aliases/defaults, `query.py` review edits, README, ADR-020, final bench evidence, and strict validation remain blocked until the 016 commit lands.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:retry -->
## 8. RESUME STEPS

After `feat(016/004/016)` appears in `git log --oneline -10`:

```bash
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3 -m pytest \
  .opencode/skills/mcp-coco-index/mcp_server/tests/test_rrf_config.py -q

COCOINDEX_RRF_SWEEP_CELL_LIMIT=4 \
  bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh --resume

bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh --resume
```

Then update shared config/query/README/ADR files, run the final no-env bench, refresh metadata, and run strict validation.
<!-- /ANCHOR:retry -->

## Commit Handoff

No git commit was made. Intended commit scope for this partial pass:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rrf_config.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration/graph-metadata.json`
