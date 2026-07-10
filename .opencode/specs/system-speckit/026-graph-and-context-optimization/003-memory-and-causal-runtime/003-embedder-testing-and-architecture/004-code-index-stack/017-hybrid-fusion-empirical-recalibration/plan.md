---
title: "Plan: 016/004/017 Hybrid Fusion Empirical Recalibration"
description: "Implementation plan for the CocoIndex RRF parameter sweep harness, deterministic picker, config default lock, final bench gate, ADR-020, and packet validation."
trigger_phrases: ["016/004/017 plan", "RRF sweep plan", "hybrid fusion recalibration plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration"
    last_updated_at: "2026-05-19T17:00:00Z"
    last_updated_by: "codex"
    recent_action: "Prepared non-shared sweep harness, analyzer, tests, and packet docs"
    next_safe_action: "Wait for feat(016/004/016), then run sweep and lock defaults"
    blockers:
      - "Missing git commit feat(016/004/016); shared code/docs and full sweep are intentionally deferred"
    key_files:
      - "../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh"
      - "../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_rrf_config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004017"
      session_id: "016-004-017-plan"
      parent_session_id: "016-004-017"
    completion_pct: 45
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 016/004/017 Hybrid Fusion Empirical Recalibration

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet re-grounds CocoIndex hybrid RRF defaults on measured post-016 retrieval behavior. The safe first pass builds the reusable sweep wrapper, deterministic analyzer, picker tests, and packet docs while the shared-file lock is active. After `feat(016/004/016)` appears in `git log`, the next pass can update `config.py`, run the 64-cell sweep, lock the picked defaults, append ADR-020, update the README, and run strict validation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Concurrency | No edits to `config.py`, `query.py`, README, ADR, full sweep, or final gate before `feat(016/004/016)` exists |
| Harness | `sweep-rrf.sh` parses JSON-list grid env vars, supports `--resume`, writes per-cell JSON, and invokes the analyzer |
| Analyzer | `sweep-rrf.py` deterministically picks by hit rate, p95, default-distance, then tuple order |
| Tests | Focused tests cover grid defaults, overrides, invalid values, and picker tiebreak/cap behavior |
| Future phases | Phase 3-5 evidence must be produced only after the 016 commit and post-016 DB state are available |
| Docs | Packet docs must state the active blocker honestly |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The wrapper lives next to `run-phase2-smoke.sh` because it orchestrates that harness directly and reuses its corrected fixture support. The analyzer is a pure Python module with importable helpers so unit tests can verify grid parsing and deterministic picking without launching the daemon or running a benchmark. Per-cell JSON is the stable interface between expensive bench execution and repeatable analysis.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Sweep Harness

- Add `sweep-rrf.sh`.
- Parse `COCOINDEX_RRF_SWEEP_K_VALUES`, `COCOINDEX_RRF_SWEEP_VEC_WEIGHTS`, and `COCOINDEX_RRF_SWEEP_FTS_WEIGHTS`.
- For each cell, set both requested `COCOINDEX_RRF_*` names and current legacy `COCOINDEX_HYBRID_*` names for compatibility.
- Write `evidence/cells/cell-K*-V*-F*.json`.

### Phase 2: Analyzer And Tests

- Add `sweep-rrf.py`.
- Emit top-cell, heatmap, latency, decision, and probe-note sections.
- Add focused tests for grid parsing and picker determinism.

### Phase 3: Full Sweep

- Blocked until `feat(016/004/016)` exists.
- Run all 64 cells against the corrected fixture.
- Generate `evidence/sweep-results.md`.

### Phase 4: Lock Defaults And Final Gate

- Blocked until Phase 3 has evidence.
- Update shared config/query env contract and defaults.
- Run final no-env corrected bench as `phase2-comparison-017-recalibrated.md`.

### Phase 5: ADR, README, Validation

- Append ADR-020.
- Update `cocoindex_code/README.md`.
- Refresh metadata and strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| `python -m pytest tests/test_rrf_config.py -q` | Sweep grid env contract and deterministic picker rules |
| `bash -n sweep-rrf.sh` | Shell syntax |
| `python -m py_compile sweep-rrf.py` | Analyzer syntax |
| Full MCP server pytest | Required after shared config/query edits |
| Phase 2 smoke bench | Required after 016 commit before default lock |
| Strict validation | Required before completion claim |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `feat(016/004/016)` must land before the full sweep or shared-file edits.
- Existing post-015/post-016 CocoIndex DB; no `ccc reset` or `ccc index`.
- Corrected fixture from packet 013.
- Post-016 comparison file for baseline p95 and probe deltas.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before defaults are locked, rollback is deleting the new sweep scripts, tests, and packet docs. After defaults are locked, runtime rollback is `COCOINDEX_HYBRID_RRF_K=60 COCOINDEX_HYBRID_VECTOR_WEIGHT=0.7 COCOINDEX_HYBRID_FTS5_WEIGHT=0.7` plus a daemon restart.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. L2: PHASE DEPENDENCIES

```
Phase 1 (Harness) -> Phase 2 (Analyzer/tests) -> 016 commit -> Phase 3 (Sweep) -> Phase 4 (Defaults/final gate) -> Phase 5 (ADR/docs/validate)
```

| Phase | Depends On | Blocks |
|---|---|---|
| Harness | Spec, current bench harness, current config/query reads | Analyzer and future sweep |
| Analyzer/tests | Per-cell JSON contract | Full sweep decision report |
| Full sweep | `feat(016/004/016)` and stable DB | Default lock |
| Defaults/final gate | Picked cell evidence | ADR and README |
| ADR/docs/validate | Final bench evidence | Commit handoff |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. L2: EFFORT ESTIMATION

| Phase | Complexity | Status |
|---|---|---|
| Harness | Medium | Implemented |
| Analyzer/tests | Medium | Implemented |
| Full sweep | Medium | Blocked by missing 016 commit |
| Defaults/final gate | Medium | Blocked by missing sweep evidence |
| ADR/docs/validate | Medium | Partially prepared; final docs blocked |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No shared runtime defaults changed while 016 is uncommitted.
- [x] Harness sets old and new RRF env names so it can bridge current and future config contracts.
- [ ] Final rollback env vars documented in ADR-020 after defaults are picked.

### Rollback Procedure
1. If still pre-sweep, remove the new sweep files and tests.
2. If defaults are locked later, export the inherited values and restart `ccc`.
3. Re-run the corrected fixture if operator confidence requires runtime proof.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: configuration/env rollback only; no database reversal is required.
<!-- /ANCHOR:enhanced-rollback -->
