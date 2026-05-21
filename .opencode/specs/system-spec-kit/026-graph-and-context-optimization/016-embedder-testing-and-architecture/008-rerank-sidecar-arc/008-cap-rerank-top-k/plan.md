---
title: "Plan: cap spec-memory rerank top-k [template:level_1/plan.md]"
description: "Four-phase plan: env override + rebuild + A/B + decision."
trigger_phrases:
  - "008 cap top-k plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Begin Phase A"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: cap spec-memory rerank top-k

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Four phases. Whole packet should take ~45 min wall clock.

| Phase | What | Wall clock |
|-------|------|-----------|
| A | Env override + rebuild | ~5 min |
| B | Sidecar restart with MPS | ~5 min |
| C | A/B run (3 × 50 probes) | ~25 min |
| D | Decision + report + closeout | ~10 min |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Same as packet 007:

```
PROMOTE iff
  arm_b_hit_rate >= arm_a_hit_rate + 0.02
  AND arm_b_p95_ms <= arm_a_p95_ms + 500
  AND arm_b_sidecar_reach_rate >= 0.95
  AND pytest still green
ELSE HOLD.
```

Auxiliary: strict-validate exit 0 on packet + arc parent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Single env override in cross-encoder.ts. Before computing `providerCap` at line ~478:

```ts
const localOverride = process.env.SPECKIT_RERANK_LOCAL_MAX_DOCS;
if (provider === 'local' && localOverride) {
  const parsed = Number.parseInt(localOverride, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    PROVIDER_CONFIG.local.maxDocuments = parsed;  // runtime override
  }
}
```

Or cleaner — compute it inline rather than mutating the const. Either way the effect is the same: when the env is set, the slice point shrinks.

The head/tail split at lines 478-484 already produces `cross-encoder` rows for the head and `cross-encoder-tail` rows for the tail — that's the existing audit trail. We're shrinking the head.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Env override

1. Edit `cross-encoder.ts` around line 478 to honor `SPECKIT_RERANK_LOCAL_MAX_DOCS`.
2. `npm run build`.
3. Smoke that the dist/ has the env read (grep).

### Phase B — Sidecar restart

1. Stop any running sidecar.
2. `RERANK_DEVICE=mps bash scripts/start.sh`.
3. Warmup Qwen.
4. Verify `/health` returns Qwen loaded.

### Phase C — A/B run

1. Pin `cross-encoder.ts:54` to Qwen for the bench (same as packet 007). Rebuild.
2. Arm A: `SPECKIT_CROSS_ENCODER=false` 3 × 50 probes.
3. Arm B: `SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true RERANK_DEVICE=mps SPECKIT_RERANK_LOCAL_MAX_DOCS=10` 3 × 50 probes.
4. Aggregate.

### Phase D — Decision + closeout

Per the gates above. On PROMOTE: flip the local provider's maxDocuments default in cross-encoder.ts:57, flip SPECKIT_CROSS_ENCODER default in search-flags.ts, rebuild. On HOLD: revert source to ms-marco at cross-encoder.ts:54, leave defaults untouched.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Phase A: grep dist/ for the env read.
- Phase B: curl `/health` after warmup; expect Qwen in loaded_models.
- Phase C: harness writes 150 rows per arm. Pass if both files complete.
- Phase D: programmatic gate evaluation.
- Rollback: revert cross-encoder.ts changes; rebuild.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 004 harness (`run_arm.sh` / `run_arm.py`) — reused.
- Multi-model sidecar (`9349f5f4a`) — load-bearing.
- Qwen3-Reranker-0.6B local snapshot at the pinned revision.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Revert `cross-encoder.ts` changes (env read + Qwen pin).
2. Rebuild spec-memory TS.
3. Stop MPS sidecar; restart on CPU if needed.
4. Mark packet HOLD with the recorded reason.

Source changes are localized; revert is a single git checkout + rebuild.
<!-- /ANCHOR:rollback -->
