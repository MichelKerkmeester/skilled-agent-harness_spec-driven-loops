---
title: "Plan: spec-memory MPS rerank promotion candidate [template:level_1/plan.md]"
description: "Five-phase plan for the MPS A/B: load smoke, harness setup, two-arm run, decision-rule application, arc parent closeout."
trigger_phrases:
  - "007 mps plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Begin Phase A — MPS load smoke"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: spec-memory MPS rerank promotion candidate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five short phases asking one decisive question: does MPS speed up Qwen enough to clear the spec-memory promotion gates? Whole packet should take ~60 minutes wall clock if MPS works on first try, ~90 minutes with op-fallback surprises.

| Phase | What | Wall clock |
|-------|------|-----------|
| A | MPS load smoke | ~5 min |
| B | Harness setup + sidecar restart with MPS | ~5 min |
| C | A/B run (3 × 50 probes per arm) | ~30-50 min |
| D | Decision rule + report | ~10 min |
| E | Arc parent update + commit | ~5 min |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Decision rule (same shape as phase 004 + 2026-05-20 re-run):

```
PROMOTE iff
  arm_b_hit_rate >= arm_a_hit_rate + 0.02       (≥3 hits / 150)
  AND arm_b_p95_ms <= arm_a_p95_ms + 500
  AND arm_b_sidecar_reach_rate >= 0.95
  AND pytest still green
ELSE HOLD.
```

Auxiliary gates (all required):

- Strict-validate exit 0 on this packet + arc 008 parent.
- Cocoindex pytest still 232 passing (we do not modify cocoindex source).
- Spec-memory build emits a fresh `dist/` if Phase E ships PROMOTE.

If gates 1+2 pass but gate 3 fails, the failure mode is "Qwen still too slow even on MPS"; HOLD and recommend fine-tune.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

This packet does NOT change any source code unless the verdict is PROMOTE.

### Sidecar device routing

`scripts/rerank_sidecar.py:_load_model` already passes `kwargs["device"] = DEVICE` when `RERANK_DEVICE` is set. PyTorch + sentence-transformers handle MPS via the standard `device='mps'` arg. The sidecar's env allowlist in `start.sh` includes `PYTORCH_ENABLE_MPS_FALLBACK=1` so any unimplemented op falls back to CPU rather than crashing.

### Single-device per process

This packet uses ONE sidecar with `RERANK_DEVICE=mps` for the duration of the bench. Cocoindex is not exercised. If PROMOTE, a follow-on may consider per-model device assignment (Qwen-MPS for spec-memory, Qwen-CPU for cocoindex), but that's design surface we don't need to add until the simpler "MPS for everyone" answer is in.

### Bench harness reuse

Phase 004's `run_arm.py` is unchanged. Same 50-probe fixture. Same dispatch shape. Only the sidecar's env changes between the prior bench and this one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — MPS load smoke

1. Confirm Qwen3-Reranker-0.6B is cached (`~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots/e61197ed...`).
2. Stop any running sidecar.
3. Start sidecar with `RERANK_DEVICE=mps`.
4. `POST /warmup` with default model.
5. Issue a 3-document `/rerank` smoke; assert HTTP 200 + bounded scores.
6. Inspect uvicorn log for `RuntimeError`, `MPSNDArray`, or `aten op` warnings.

Acceptance: warmup returns `status:warmed`; smoke rerank 200 with `latency_ms` < 2000 ms; no hard errors.

### Phase B — Harness setup

1. Create `benchmarks/benchmark-2026-05-21-spec-memory-mps/` folder.
2. Copy the canonical 50-probe fixture.
3. Confirm `cross-encoder.ts:54` is Qwen for this bench (NOT ms-marco). Edit + rebuild TS if not.
4. Sidecar already has Qwen in its default allowlist.

Acceptance: bench dir + fixture; spec-memory build emits dist referencing Qwen.

### Phase C — A/B run

1. Run Arm A: `SPECKIT_CROSS_ENCODER=false RERANKER_LOCAL=false`, 3 × 50 probes.
2. Run Arm B: `SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true`, sidecar serving Qwen-MPS, 3 × 50 probes.
3. Per-probe rows: `rerank_provider`, `scoringMethod`, `latency_ms`, `hit_at_10`, `reciprocal_rank` (phase 004 schema).

Acceptance: two JSONL files, 150 rows each, schema matches phase 004.

### Phase D — Decision rule + report

1. Aggregate both arms: hit-rate, MRR, latency percentiles, sidecar reach.
2. Apply the four decision gates literally.
3. Write `benchmark_report.md` (~150 lines, phase 004 shape).
4. Record verdict in §8 RECOMMENDATIONS.

Acceptance: report has the verdict + per-gate pass/fail + numbers.

### Phase E — Closeout

If PROMOTE: flip `cross-encoder.ts:54` to Qwen; flip `SPECKIT_CROSS_ENCODER` default to true; rebuild; update arc parent.
If HOLD: leave source untouched; arc parent stays closed; record verdict + deferred path in `implementation-summary.md`.

Either way: tasks marked `[x]`; strict-validate exit 0; commit `feat(016/008/007): spec-memory mps rerank — <PROMOTE|HOLD>`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Phase A smoke**: single curl `/rerank` request. Pass if 200 + sigmoid scores.
- **Phase C bench**: 3 runs × 50 probes per arm via the phase 004 harness. Pass if both arms write 150 rows each with no SystemExit / Exception from the harness.
- **Phase D gate evaluation**: programmatic Python aggregate; per-gate boolean recorded in the report.
- **Phase E (PROMOTE only)**: cocoindex pytest must still emit 232 passing. Spec-memory build must compile without TS errors. Any flag-routing test failure forces a revert.
- **Rollback**: stop sidecar; `unset RERANK_DEVICE`; restart. Source-code reversion if PROMOTE was applied: revert `cross-encoder.ts:54` + `search-flags.ts`; rebuild.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Multi-model sidecar refactor (commit `9349f5f4a`) — load-bearing because Arm B benefits from per-model dispatch even though this packet exercises only one model.
- Phase 004 harness (`benchmark-2026-05-20-rerank-ab/scripts/run_arm.{sh,py}`) — reused as-is.
- Canonical 50-probe fixture (`benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json`) — apples-to-apples comparison.
- Qwen3-Reranker-0.6B local snapshot at the pinned revision.
- Spec-memory build (`npm run build`) — emits `dist/` consumed by the bench harness.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If MPS load crashes the sidecar:

1. Stop sidecar (`pkill -TERM -f rerank_sidecar`).
2. `unset RERANK_DEVICE` or set to `cpu`.
3. Restart; sidecar reverts to CPU Qwen (the pre-007 state).
4. Mark this packet HOLD with the MPS load failure as the recorded reason.

No source code changes in Phase A-D, so revert is a process restart only. If Phase E ships PROMOTE and a regression surfaces, revert `cross-encoder.ts:54` + `search-flags.ts` defaults and rebuild.
<!-- /ANCHOR:rollback -->
