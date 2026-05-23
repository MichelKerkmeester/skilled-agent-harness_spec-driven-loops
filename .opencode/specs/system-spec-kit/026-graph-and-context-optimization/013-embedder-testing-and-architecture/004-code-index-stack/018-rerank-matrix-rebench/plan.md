---
title: "Plan: 016/004/018 Rerank Matrix Re-Bench"
description: "Implementation plan for the final reranker verdict packet: matrix harness, deterministic analyzer, dispatch tests, deferred production-default lock, ADR-021, and arc closure."
trigger_phrases:
  - "016/004/018 plan"
  - "rerank matrix plan"
  - "final reranker verdict plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench"
    last_updated_at: "2026-05-19T14:35:00Z"
    last_updated_by: "codex"
    recent_action: "Created non-shared harness, analyzer, tests"
    next_safe_action: "Wait for 016 and 017 commits, then run full matrix"
    blockers:
      - "feat(016/004/016) not visible in git log"
      - "feat(016/004/017) not visible in git log"
    key_files:
      - "../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-bench.sh"
      - "../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_dispatch.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004018"
      session_id: "016-004-018-plan"
      parent_session_id: "016-004-018"
    completion_pct: 45
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 016/004/018 Rerank Matrix Re-Bench

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet supplies the final reranker verdict for the 016/004 CocoIndex future-proofing arc. The first safe tranche creates the 4-lane rerank matrix harness, deterministic analyzer, and dispatch tests while avoiding shared files until the concurrent 016 query-expansion and 017 RRF recalibration commits land. The deferred tranche runs the full matrix, locks the production default, writes ADR-021, updates README/default docs, and closes the arc.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Parallel boundary | No edits to `config.py`, `cocoindex_code/README.md`, parent ADR, or production defaults until both 016 and 017 commits are visible |
| Harness | `rerank-matrix-bench.sh` supports A-D lanes, optional E if mxbai exists, 3 iterations by default, `--resume`, and smoke subsets |
| Analyzer | `rerank-matrix-analyze.py` is deterministic for the same run JSONs and emits the summary, heatmap, decision matrix, winner, and runner-up scenario |
| Tests | Dispatch tests cover no-rerank ablation, env override, default adapter, override adapter, and model-keyed cache behavior |
| Bench | Phase 3 full matrix waits for 017 so it measures post-RRF defaults |
| Docs | L2 packet docs and metadata validate; implementation summary clearly hands off blocked Phase 3-5 work |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The harness lives beside the existing Phase 2 smoke runner because it reuses the corrected fixture and path-extraction semantics. It runs a single lane per iteration rather than invoking the legacy smoke script's built-in three-lane loop, then normalizes each run to one JSON file under this packet's `evidence/runs/`. The analyzer consumes only those normalized JSON files, making the picker independent of shell output and repeatable under future re-runs.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Read `spec.md`, current reranker dispatch, jina-v3 adapter, config, legacy smoke harness, corrected fixture, 013-017 state, and recent implementation summaries.
- Attempt sequential-thinking MCP five times before edits.
- Confirm commit boundary: 015 is visible, 016/017 final commits are not.

### Phase 2: Implementation

- Create `rerank-matrix-bench.sh` with lane metadata, env setup, daemon stop, per-probe result capture, per-run JSON output, and `--resume`.
- Create `rerank-matrix-analyze.py` with lane aggregates, per-probe majority heatmap, decision matrix, deterministic picker, and markdown output.
- Add `tests/test_rerank_dispatch.py` for ablation and dispatch behavior.

### Phase 3: Verification

- Run syntax checks for shell and Python.
- Run targeted rerank dispatch pytest.
- Smoke-test A+B lanes once the daemon can run in the operator environment.
- Run the full 12-run matrix only after 017 lands.

### Phase 4: Production Default Lock

- Inspect `rerank-matrix-results.md`.
- Update `config.py` defaults to the picked lane and keep env rollback paths.
- Run final no-env bench as `evidence/phase2-comparison-018-final.md`.

### Phase 5: ADR, Docs, And Arc Closure

- Append ADR-021 to the bake-off decision record.
- Update `cocoindex_code/README.md`.
- Optionally write the parent `arc-shipped-summary.md`.
- Update parent continuity and strict-validate the packet.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| `bash -n rerank-matrix-bench.sh` | Shell syntax and Bash 3-compatible structure |
| `python -m py_compile rerank-matrix-analyze.py tests/test_rerank_dispatch.py` | Python syntax |
| `python -m pytest tests/test_rerank_dispatch.py -q` | Rerank ablation/env/dispatch behavior |
| A+B one-iteration smoke | Harness can produce valid run JSONs in a daemon-capable environment |
| Full matrix + analyzer | Winner selection from all 12 or 15 runs |
| `validate.sh --strict` | Packet documentation contract |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|---|---|---|
| 016 query expansion final commit | Blocked in current `git log -15` | Cannot run final matrix or update shared config/README/ADR |
| 017 RRF recalibration final commit | Blocked in current `git log -15` | Full matrix would measure invalid pre-017 defaults |
| Daemon writable runtime dir | Partially blocked in sandbox | Smoke/full bench must run in operator environment if daemon lock permissions fail |
| Existing corrected fixture | Available | Required for all matrix lanes |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before Phase 4, rollback is deleting the new harness, analyzer, dispatch test, and packet docs. After Phase 4, rollback is setting env vars to the previous production defaults or reverting `config.py`, README, ADR-021, and final evidence docs.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. L2: PHASE DEPENDENCIES

```
Phase 1 -> Phase 2 -> Phase 3 smoke
                    -> wait for 016 + 017 commits -> full matrix -> defaults/ADR/docs
```

| Phase | Depends On | Blocks |
|---|---|---|
| Harness/analyzer/tests | Current spec and reranker dispatch reads | Smoke test |
| Smoke test | Daemon able to create runtime locks | Full matrix confidence |
| Full matrix | 016 and 017 committed | Production default lock |
| ADR/default docs | Full matrix winner | Arc closure |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. L2: EFFORT ESTIMATION

| Phase | Complexity | Status |
|---|---|---|
| Harness | Medium | Implemented, syntax-checked; smoke blocked by daemon runtime behavior |
| Analyzer | Medium | Implemented and syntax-checked |
| Tests | Low | Implemented; targeted pytest passes |
| Full matrix | Medium | Deferred until 017 commit |
| ADR/default/closure | Medium | Deferred until full matrix winner |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production defaults changed in the non-shared tranche.
- [x] Losing adapters remain untouched and opt-in.
- [x] Full matrix is blocked until the upstream commit gate is satisfied.

### Rollback Procedure
1. Remove the two new `rerank-matrix-*` files if the harness path changes.
2. Remove `tests/test_rerank_dispatch.py` if dispatch coverage moves elsewhere.
3. Keep existing reranker adapter code unchanged.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: delete generated bench artifacts if they are invalid; no database reset or re-index is required.
<!-- /ANCHOR:enhanced-rollback -->
