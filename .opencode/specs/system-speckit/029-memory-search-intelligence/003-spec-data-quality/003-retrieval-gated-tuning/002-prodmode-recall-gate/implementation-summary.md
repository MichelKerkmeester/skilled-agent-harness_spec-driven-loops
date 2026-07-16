---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will build a prod-window recall gate over the completeRecall@3/@5/@8 columns plus an order-sensitive NDCG@K companion, from a multi-target gold set, a PROMOTION and REGRESSION wrapper, and a stored baseline. No code change has landed."
trigger_phrases:
  - "prod mode recall gate"
  - "complete recall at 3"
  - "spec corpus golden"
  - "run spec recall gate"
  - "retrieval regression gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/003-retrieval-gated-tuning/002-prodmode-recall-gate"
    last_updated_at: "2026-07-06T18:49:47.122Z"
    last_updated_by: "markdown-agent"
    recent_action: "Round-2 remediation: reframed gate for @3/@5/@8, corrected floor-versus-cap read"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-prodmode-recall-gate |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Multi-target spec-corpus gold set

The phase will author a `spec-corpus-golden.json` whose every citable-class query carries a relevance set. Today the shipped goldens are single-target and saturate, so they hide wins because a single-target query has nothing to be incomplete about. The new gold set gives completeRecall multiple targets per query across the @3/@5/@8 columns, so every citable query contributes a measurable incompleteness and the metric stops saturating. The `hard_negative` class is expected-NOT-citable (absence is the correct signal), so it is excluded from the completeRecall gated pool rather than seeded with fabricated targets, which resolves the contradiction with the multi-target mandate.

### Prod-window recall gate

The phase will build a `run-spec-recall-gate.mjs` wrapper with a PROMOTION mode and a REGRESSION mode that read only the prod-lens completeRecall@3/@5/@8 columns plus an order-sensitive NDCG@K companion with a top1 guard. The @3/@5/@8 window lets the gate read the rank 4-8 band the 027 floor sweep and C1/C4 exist to move, the order-sensitive companion makes a PROMOTION pass imply a better reader experience rather than only window membership, and ceiling-aware delta mode keeps a sub-1.0 K/N ceiling on a multi-target class from reading as a regression. PROMOTION asserts the prod completeRecall rises over a stored baseline while NDCG@K holds or rises and top1 does not fall, and REGRESSION asserts none of those reads falls below the baseline by more than the configured tolerance. The gate emits a real recall-verdict exit code distinct from the existing crash handler at line 357, so a retrieval-class change can be promoted only on a measured prod-column rise that also holds ranking quality, and regressed when any read falls.

### Stored baseline and shared-metric reuse

The phase will write a `spec-recall-baseline.json` that records the prod-column completeRecall@3/@5/@8, NDCG@K and top1 per class and overall, with a per-class headline-K, a generated-at stamp and source DB path. It will reuse the exports the unchanged `run-eval-v2.mjs` already provides (`buildSearchLenses`, `meanCompleteRecallProfile` and `MEASURABILITY_CLASSES` are exported today) so the gate consumes the prod lens and the measurability classes rather than re-implementing the lenses, plus the pure `computeNDCG` and `computeMRR` from the shared `dist/lib/eval/eval-metrics.js` the harness already imports for the order-sensitive companion. The baseline freezes only after the first non-saturating prod run.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-corpus-golden.json` | Planned create | Multi-target gold set, one relevance set per citable-class query, `hard_negative` excluded from the completeRecall pool |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-spec-recall-gate.mjs` | Planned create | PROMOTION and REGRESSION gate reading only the prod-lens completeRecall@3/@5/@8 columns plus the order-sensitive NDCG@K and top1, ceiling-aware |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json` | Planned create | Stored prod-column completeRecall@3/@5/@8, NDCG@K and top1 baseline with a per-class headline-K and provenance |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Verify only | The prod lens and class exports already exist, the gate reuses them with no modify |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js` | Verify only | The pure `computeNDCG` and `computeMRR` already exist here, the gate reuses them for the order-sensitive companion with no modify |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence authors the multi-target gold set first, then builds the gate against the harness copy DB reading the prod-window @3/@5/@8 columns plus the order-sensitive NDCG@K and top1, then freezes the first baseline from a non-saturating prod run. The regression proof that a degraded prod profile exits with the recall-verdict code, the promotion proof that a measured rise that holds ranking quality passes while an unchanged profile and a top1-degrading window-membership rise both fail, and the ceiling-awareness proof that a class at its K/N ceiling does not trip REGRESSION, land with the gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read only the prod lens, never the eval lens | The eval lens runs `forceAllChannels` with no truncation and overstates prod recall, so an eval-lens or external @K read would repeat the 028 saturation mistake |
| Read the @3/@5/@8 prod-window columns, not @3 alone | `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-3 minimum guarantee, not a cap, so @5/@8 are real prod reads, and they carry the rank 4-8 band the 027 sweep and C1/C4 exist to move |
| Add an order-sensitive NDCG@K companion with a top1 guard | completeRecall is pure set membership, so a window-membership rise can degrade the rank-1 result the reader sees first, and a PROMOTION should imply a better reader experience |
| Run ceiling-aware delta mode | completeRecall@K is bounded at K/N below 1.0 for any class with more targets than K, so a fixed floor is unreachable and a sub-1.0 ceiling must not read as a regression |
| Exclude `hard_negative` from the completeRecall pool | The class is expected-NOT-citable, so forcing it to carry multiple targets would invert its semantics and `meanCompleteRecallProfile` skips zero-ground-truth queries anyway |
| Reuse the harness lenses and shared metrics through their exports | The dual-mode harness and the eval-metrics module already ship, so a thin wrapper avoids forking the lens body and the eval-versus-prod measurement drift |
| Freeze the baseline only after a non-saturating run | A baseline frozen on a saturating gold set would mis-calibrate the per-class headline-K and thresholds |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned gate command is `node run-spec-recall-gate.mjs --mode regression` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| A degraded scratch prod profile fails REGRESSION mode with the recall-verdict code | PLANNED, not yet run |
| A measured prod completeRecall@3/@5/@8 rise that holds NDCG@K and top1 passes PROMOTION mode, while an unchanged profile and a top1-degrading window-membership rise both fail | PLANNED, not yet run |
| A multi-target class at its K/N ceiling does not trip REGRESSION | PLANNED, not yet run |
| The gold set has no single-target citable query, every citable query carries a class tag, and `hard_negative` is excluded from the completeRecall pool | PLANNED, not yet run |
| The gate refuses an eval-lens input | PLANNED, not yet run |
| A missing baseline seeds a first baseline rather than scoring as complete | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Baseline precondition.** The first baseline cannot freeze until a multi-target prod run measures non-saturating, so the per-class headline-K and thresholds stay uncalibrated until then.
3. **Open headline-K question.** Which K (@3/@5/@8) carries each measurability class headline, given the K/N ceiling that bounds completeRecall@K below 1.0 for any class with more targets than K, is unresolved until the first prod baseline.
4. **Harness-lens optimism.** The harness prod lens passes `includeContent:false`, so token-budget truncation is inert and the prod-column reads are an optimistic upper bound on true production recall that returns content. The gate delta mode partially cancels this bias.
<!-- /ANCHOR:limitations -->

---
