---
title: "Spec: 016/004/017 Hybrid Fusion — Empirical RRF Recalibration"
description: "Re-grounds CocoIndex's hybrid (dense + FTS5) RRF fusion parameters (k, vec_weight, fts_weight) on EMPIRICAL evidence from the post-013/014/015/016 corrected pipeline instead of inherited defaults. Sweeps the small parameter grid against the 18-probe corrected fixture under bge-code-v1, picks the best-on-fixture config, freezes it as the new default, and documents the tradeoff (recall, precision, latency) per config. Embedder-agnostic, reranker-agnostic, future-proof: the grid+harness can be re-run any time the corpus, embedder, or reranker changes."
trigger_phrases:
  - "016/004/017 hybrid recalibration"
  - "RRF parameter sweep"
  - "vec_weight fts_weight tuning"
  - "cocoindex hybrid fusion"
  - "COCOINDEX_RRF_K"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration"
    last_updated_at: "2026-05-19T14:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored spec.md alongside in-flight 015 dispatch"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast after 016 commits"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004017"
      session_id: "016-004-017"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "How wide should the grid be — 3x3x3 (9 vec_weight × 9 fts_weight × 5 k values = 405)? Or coarser 3x3x3 = 27?"
      - "Is dense-only / fts-only ablation part of THIS packet or a follow-on?"
    answered_questions:
      - "Why now and not earlier? The current RRF defaults (k=60, both weights 0.7) are inherited — never empirically tuned on THIS corpus + embedder + reranker. With 013/014/015/016 hardening, we have a stable baseline; sweeping NOW captures genuine signal, not noise from a broken pipeline."
      - "Will this lock the config? Yes — picked config becomes the new default with ADR documenting evidence + rollback plan."
      - "Embedder-agnostic? Yes — sweep is fixture-driven and can be re-run for any future embedder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/004/017 Hybrid Fusion — Empirical RRF Recalibration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Draft (spec written 2026-05-19) |
| Type | Empirical configuration sweep — bench harness + analyzer + new defaults |
| Owner | cli-codex gpt-5.5 high fast (dispatched by main agent after 016 commits) |
| Parent | `../spec.md` (004-code-index-stack) |
| Position in arc | 5 of 6 (depends on stable pipeline from 013/014/015/016) |
| Sibling packets | 013 (shipped), 014 (shipped), 015 (in-flight), 016 (after 015), 018 (rerank matrix — after 017) |
| Triggered by | Current RRF defaults (k=60, vec_weight=0.7, fts_weight=0.7) are inherited convention, never measured against THIS corpus/embedder/reranker. After 013-016 stabilize the pipeline, those defaults may no longer be optimal. Empirical sweep is the only way to know. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CocoIndex's hybrid fusion uses **Reciprocal Rank Fusion (RRF)**:

```
score(doc) = vec_weight / (k + vec_rank(doc)) + fts_weight / (k + fts_rank(doc))
```

The current defaults (`k=60`, `vec_weight=0.7`, `fts_weight=0.7`) come from a generic RRF reference, not from this codebase's measurements. With 4 packets of pipeline hardening landing in the same arc:

- **013** — corrected the bench fixture (probe 10 fixture-truth + path-extraction false-misses)
- **014** — collapses 4 runtime mirrors → 1 canonical (cleaner candidate set)
- **015** — tree-sitter chunking (bodies, not import headers)
- **016** — query expansion (identifier bridging)

the candidate-set composition has materially changed. The OPTIMAL `k`, `vec_weight`, and `fts_weight` against the NEW pipeline are unknown. Sweeping them is cheap (one bench run per cell), and freezes the result as ADR-backed defaults.

What "best" means here:
1. **Primary**: highest hit rate on the 18-probe corrected fixture (>14/18, ideally 16+).
2. **Secondary**: lowest p95 latency.
3. **Tiebreak**: smallest config delta from inherited defaults (less disruptive rollback).

Result of this packet: one new default config locked in `config.py`, ADR-020 documenting all configs swept + evidence-based rationale, and a reusable sweep harness so this exercise can be repeated for any future embedder, reranker, or corpus.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Sweep harness** — `phase2-bench/sweep-rrf.sh` (NEW shell wrapper) + `phase2-bench/sweep-rrf.py` (NEW Python analyzer). Wrapper iterates the parameter grid; analyzer aggregates per-cell hit rate + p95 latency + per-probe outcomes into `sweep-results.md`.
- **Parameter grid** (default — operator can override via env):
  - `k ∈ {30, 60, 90, 120}` (4 values)
  - `vec_weight ∈ {0.5, 0.7, 0.9, 1.0}` (4 values)
  - `fts_weight ∈ {0.3, 0.5, 0.7, 0.9}` (4 values)
  - Total cells: 4 × 4 × 4 = **64**
  - Bounded by `COCOINDEX_RRF_SWEEP_K_VALUES`, `COCOINDEX_RRF_SWEEP_VEC_WEIGHTS`, `COCOINDEX_RRF_SWEEP_FTS_WEIGHTS` JSON-list env vars (operator-configurable for future re-runs with different grids).
- **Per-cell run**: each cell sets `COCOINDEX_RRF_K`, `COCOINDEX_RRF_VEC_WEIGHT`, `COCOINDEX_RRF_FTS_WEIGHT` env vars, restarts daemon, runs `run-phase2-smoke.sh` against the corrected fixture, captures the per-probe hit/miss + latency + dense top-K composition.
- **Aggregator output** (`evidence/sweep-results.md`):
  - **Table 1**: best 10 cells by hit rate, ties broken by p95 latency.
  - **Table 2**: per-probe heatmap — which (k, vec_weight, fts_weight) cells solve each previously-failing probe.
  - **Table 3**: latency vs hit-rate scatter (text approximation).
  - **Decision**: picked config + 3-sentence rationale.
- **New defaults** in `config.py`: `COCOINDEX_RRF_K`, `COCOINDEX_RRF_VEC_WEIGHT`, `COCOINDEX_RRF_FTS_WEIGHT`. Defaults updated to the picked cell. Env-override path (operator can revert via env var) preserved.
- **ADR-020** appended to `004-spec-memory-embedder-bake-off/decision-record.md`:
  - Grid swept
  - Picked cell + rationale
  - Rollback path (`COCOINDEX_RRF_K=60 COCOINDEX_RRF_VEC_WEIGHT=0.7 COCOINDEX_RRF_FTS_WEIGHT=0.7` reverts to pre-017 defaults)
  - Caveat: any embedder or reranker swap may require re-sweep
- **Test coverage**:
  - `tests/test_rrf_config.py` ≥4 tests: env-var parsing, default fallback, invalid-value handling, integration with `_run_hybrid_search()`.
  - Existing pytest suite must stay green.
- **Bench gate**: post-sweep, validate the picked config against the corrected fixture one final time as a sanity check. Save as `evidence/phase2-comparison-017-recalibrated.md`. Compare against post-016 baseline.

Out of scope:
- Reranker swap (that's 018)
- Embedder swap (out of arc)
- Per-query adaptive RRF weights (deferred; would require ML)
- Non-RRF fusion (linear weighted sum, etc.) — sticking with RRF this packet
- Sweeping > 64 cells (operator can opt-in via env, but default grid kept tractable)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `phase2-bench/sweep-rrf.sh` exists, iterates 4×4×4 grid by default. Each cell sets env vars, restarts ccc daemon, runs the 18-probe corrected bench, captures hit-rate + latency + per-probe outcomes to a per-cell JSON file. Skippable cells (already run): supports `--resume`. |
| R2 | `phase2-bench/sweep-rrf.py` (NEW) aggregates per-cell JSONs into `sweep-results.md`. Aggregator emits Table 1 (top-10 by hit rate), Table 2 (per-probe heatmap), Table 3 (latency scatter), and a final picked-config recommendation. |
| R3 | Grid configurable via `COCOINDEX_RRF_SWEEP_K_VALUES`, `COCOINDEX_RRF_SWEEP_VEC_WEIGHTS`, `COCOINDEX_RRF_SWEEP_FTS_WEIGHTS` JSON-list env vars. Defaults: `[30,60,90,120]`, `[0.5,0.7,0.9,1.0]`, `[0.3,0.5,0.7,0.9]`. |
| R4 | `config.py` has `COCOINDEX_RRF_K`, `COCOINDEX_RRF_VEC_WEIGHT`, `COCOINDEX_RRF_FTS_WEIGHT` env vars with the picked-cell defaults. `query.py` reads from config. Backward compat: env override falls through. |
| R5 | Picked-cell defaults are derived from the sweep results — NOT pre-decided. The picked cell maximizes hit rate, ties broken by p95 latency, then by smallest delta from `(60, 0.7, 0.7)`. |
| R6 | `evidence/sweep-results.md` written with all three tables + decision rationale. ≥1 sentence per probe explaining why the picked cell flipped (or didn't flip) it relative to the pre-017 baseline. |
| R7 | ADR-020 appended to `004-spec-memory-embedder-bake-off/decision-record.md`. Cover: defect (inherited defaults), fix (empirical sweep), picked cell, grid swept, rollback path, future re-sweep guidance. |
| R8 | Final bench gate run: with picked-cell defaults active (no env overrides), run `run-phase2-smoke.sh` against corrected fixture, save as `evidence/phase2-comparison-017-recalibrated.md`. Hit rate ≥ post-016 baseline (no regression). |
| R9 | ≥4 unit tests in `tests/test_rrf_config.py`. Existing tests green. |
| R10 | Strict-validate PASSED on the 017 packet. |
| R11 | `cocoindex_code/README.md` "Hybrid search" section updated with new defaults + tuning guidance. |
| R12 | Latency: picked cell's p95 stays within 15% of post-016 baseline. If best-hit-rate cell exceeds 15%, prefer the next-best cell that meets latency. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1-R12 satisfied.
- Sweep covers ≥64 cells; aggregator output is human-readable.
- New defaults locked in `config.py` with ADR-backed rationale.
- Final-gate bench ≥ post-016 baseline.
- Existing + new tests green.
- Strict-validate PASSED.
- Sweep harness reusable for future embedder/reranker/corpus changes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Phase 1 — sweep harness (~60 min):
1. `sweep-rrf.sh`:
   - Parse grid from env vars (defaults: 4×4×4).
   - For each cell: set 3 env vars, restart ccc daemon, run `run-phase2-smoke.sh` with cell-specific `OUTPUT_TAG`, capture per-probe + per-latency JSON to `cells/cell-K{k}-V{vec}-F{fts}.json`.
   - `--resume` skips cells whose JSON already exists.
   - Total wall: 64 cells × ~30 sec/cell = ~30 min.
2. `sweep-rrf.py`:
   - Load all `cells/cell-*.json`.
   - Build pandas-style table (or pure-Python equivalent).
   - Sort by hit_rate desc, then by p95_ms asc, then by `|cell - (60, 0.7, 0.7)|` asc.
   - Emit Table 1 (top 10), Table 2 (heatmap), Table 3 (latency scatter), Decision.
3. Smoke-test on a 4-cell subset before running full grid.

Phase 2 — config integration (~30 min):
1. Add 3 new env vars to `config.py` with current defaults `(60, 0.7, 0.7)`. Will be updated to picked cell in Phase 4.
2. Wire to `query.py:_run_hybrid_search()` (or wherever RRF math lives). Replace any hard-coded constants.
3. ≥4 tests in `tests/test_rrf_config.py`.

Phase 3 — run sweep (~30-60 min wall):
1. Restart ccc daemon for clean state.
2. Run `bash phase2-bench/sweep-rrf.sh` with default grid.
3. Aggregator emits `sweep-results.md`.
4. Inspect: which cells maximize hit rate? Latency? Any surprise interaction effects?

Phase 4 — lock new defaults + final gate (~30 min):
1. Update `config.py` defaults to picked cell values.
2. Restart ccc daemon (no env overrides).
3. Run `run-phase2-smoke.sh` one more time as the FINAL GATE. Save as `evidence/phase2-comparison-017-recalibrated.md`.
4. Compare against post-016 baseline. Must be ≥ hit rate. Document any probe deltas.

Phase 5 — docs + ADR + validate (~30 min):
1. ADR-020.
2. Update `cocoindex_code/README.md`.
3. L2 packet docs.
4. Strict-validate. Iterate.

Total: ~3-4 hours wall (mostly the 30-60 min sweep itself).
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Sweep finds NO config better than current defaults**: picked cell = current defaults. ADR documents the sweep result (no regression, no improvement). Acceptable outcome — proves defaults are well-tuned.
- **Best-hit-rate cell has poor latency**: trade off per R12 (15% p95 cap). Pick next-best meeting cap. ADR documents the choice.
- **Bench variance dominates**: per-cell hit rate may flap on edge probes due to non-determinism. Mitigation: rerun close-tie cells 2-3x; aggregator uses mean hit rate when re-runs exist.
- **64-cell sweep wall time too long**: cap by env var (`COCOINDEX_RRF_SWEEP_K_VALUES='[60,90]'` halves the grid). Or `--resume` for interruptible runs.
- **k <= 0 or weight <= 0 corner cases**: validators reject in `config.py`; sweep harness skips invalid cells with logged warning.
- **Daemon restart overhead** (~5-10 sec per cell): unavoidable for clean env-var pickup. Mitigation: keep cell count tractable; 64 × 10 sec = ~11 min just for restarts (acceptable).

Dependencies:
- 013 SHIPPED (corrected fixture).
- 014 SHIPPED (clean candidate set).
- 015 SHIPPED (body chunks).
- 016 SHIPPED (expanded queries).
- Stable `target_sqlite.db` built under bge-code-v1 (post-015 re-index).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Sweep harness completes in ≤90 min wall (default 64-cell grid).
- **NFR-P02**: Per-cell run ≤45 sec (bench harness + daemon restart).
- **NFR-P03**: Picked cell p95 within 15% of post-016 baseline.

### Reliability
- **NFR-R01**: `--resume` correctly skips already-completed cells.
- **NFR-R02**: Aggregator is deterministic given the same input cell JSONs.
- **NFR-R03**: Rollback via env vars produces byte-identical pre-017 behavior.

### Compatibility
- **NFR-C01**: Sweep harness is embedder-agnostic — can re-run against any future embedder by changing only `COCOINDEX_CODE_EMBEDDING_MODEL`.
- **NFR-C02**: Aggregator format is reusable for any future RRF-style fusion config.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Multiple cells tie on hit rate AND latency**: tiebreak by smallest `(|k-60| + |vec-0.7| + |fts-0.7|)`. If still tied, pick the lexicographically first.
- **Picked cell has WORSE hit rate than current defaults**: sanity-check error. Fail the bench gate; log diagnostic; keep current defaults; document the anomaly.
- **Daemon refuses to restart**: log and skip the cell; continue. Aggregator marks the cell as `error`.
- **Bench harness crashes mid-cell**: `--resume` re-runs the failed cell on retry.
- **Empty grid** (operator overrides all 3 grid env vars to `'[]'`): error out before running anything.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|------:|-------|
| Scope | 20/25 | Sweep harness + aggregator + 3 env vars + tests + ADR + docs + final gate |
| Risk | 14/25 | Behavior change in RRF math; rollback env reverts; sweep itself is read-only |
| Research | 16/20 | Empirical exercise — risk lives in grid breadth + variance handling, not in algorithmic novelty |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- **Per-cell rerun count?** Start at 1; rerun 2-3x ONLY for the top-5 by hit rate (variance dominates near optimum).
- **Beyond bge-code-v1?** Out of scope here. ADR-020 documents how to re-sweep when embedder changes.
- **Should the aggregator pick the cell, or should the operator manually pick from `sweep-results.md`?** Aggregator picks (per R5 rules), operator can override by editing `config.py` defaults manually.
- **Latency cap = 15% — too strict?** Acceptable for now. Operator can opt-out by editing the picker logic. ADR documents this knob.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Arc parent: `../spec.md` (004-code-index-stack)
- Predecessor packets (shipped): `../013-bench-harness-and-fixture-audit/`, `../014-mirror-dedup-canonical-preference/`, `../015-code-aware-chunking-tree-sitter-stage-b/`, `../016-query-expansion-identifier-bridging/`
- Trigger evidence: current RRF defaults `(60, 0.7, 0.7)` documented in `cocoindex_code/query.py` + 011 phase-2 bench shows the candidate set is the bottleneck; fusion tuning is the leverage on the cleaned candidate set.
- Successor packet: `../018-rerank-matrix-rebench/` (depends on stable hybrid config from 017)
- ADR target: `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` (append ADR-020)
- Bench harness reused: `../011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh`
<!-- /ANCHOR:cross-links -->
