---
title: "Implementation Plan: Lane evidence damping + sweep recommendation"
description: "Add per-lane damping factor; extend sweep; sweep 7×≥4 combos against 24 + 22 corpora; recommend damping config."
trigger_phrases:
  - "lane damping plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/008-routing-confidence-calibration"
    last_updated_at: "2026-05-14T02:15:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Lane evidence damping + sweep recommendation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Add a per-lane evidence damping factor (default-off) to `explicit_author` and `lexical`. Extend the existing sweep harness to test damping configurations alongside the 7 weight vectors. Run against both the 24-prompt and 22-harder corpora. Emit a delta report. Recommend a concrete damping config OR document "no-go" with rationale.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015 advisory at `scratch/next-steps-advisory.md` on main.
- [x] 015/003 sweep harness + 015/004 seed helper on main.
- [x] 015/008 skill-side graph_causal populated on main.

### Definition of Done
- [x] Damping math implemented + default-off in lane-registry.
- [x] Sweep extended to cover damping dimension.
- [x] Report emitted with concrete deltas.
- [x] Recommendation in implementation-summary.
- [x] Strict validation passes.
- [x] Vitest skill_advisor stays at known plugin-bridge baseline.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest |
| **Framework** | Spec Kit MCP server skill-advisor scoring |
| **Storage** | Markdown report under packet's research/ |
| **Testing** | Vitest sweep + strict spec validate |

### Approach
1. Add a `lane-registry.ts` field (or sibling config) for `dampingThreshold` and `dampingFloor` per lane. Default: undefined / disabled.
2. In `scorer/fusion.ts`, when a lane has damping config AND its rawScore < dampingThreshold, scale its weighted contribution by `dampingFloor` (a value in [0.0, 1.0], default 0.0 means full damp, 1.0 means no damp).
3. Extend `AdvisorScoringOptions` with a `dampingOverride` (per-lane Partial) so the sweep can test configurations without changing the registry.
4. Add `runLaneDampingSweep(args: { cases, vectors, dampingConfigs, ... })` to `scorer/ablation.ts`. Or extend `runLaneWeightSweep` to accept a damping dimension. Codex picks.
5. Extend `lane-weight-sweep.vitest.ts` with at least 4 damping configurations:
   - **D0 control**: no damping (matches 015/003-008 sweep behavior)
   - **D1 light**: explicit threshold 0.2, floor 0.5; lexical threshold 0.2, floor 0.5
   - **D2 medium**: explicit threshold 0.3, floor 0.3; lexical threshold 0.3, floor 0.3
   - **D3 aggressive**: explicit threshold 0.4, floor 0.1; lexical threshold 0.4, floor 0.1
   - (codex may add more or pick different thresholds based on observed rawScore distributions)
6. Run the sweep against BOTH corpora; emit a single combined markdown report.
7. Recommendation: pick the (weight-vector, damping-config) pair that maximizes harder-corpus intent-described accuracy subject to `today-correct-accuracy >= 0.95`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Read `scorer/fusion.ts` damping insertion point.
- Read `scorer/lane-registry.ts` for config layout.
- Read `scorer/types.ts` for `AdvisorScoringOptions` shape.
- Read `scorer/ablation.ts` `runLaneWeightSweep` signature.

### Phase 2: Implementation
- Add damping types + config fields.
- Add damping math in fusion.
- Extend sweep harness with damping dimension.
- Author the 4 damping configs.
- Run sweep against both corpora.
- Emit markdown report.
- Update implementation-summary recommendation.

### Phase 3: Verification
- typecheck PASS.
- vitest skill_advisor: 1 failure (known plugin-bridge baseline).
- npx tsc --build refresh dist.
- Strict validate this packet + parent 015.
- Confirm REQ-002 today-correct floor held.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Damping math correctness | Unit test of damping function with fixture inputs | Vitest |
| Default-off invariant | Damping disabled → fusion output byte-identical to pre-damping | Vitest snapshot |
| Sweep coverage | 7 weights × ≥4 damping configs × 2 corpora | Sweep test asserts row count |
| Today-correct floor | Recommended config keeps 24-corpus today-correct >= 0.95 | Sweep test asserts threshold |
| Strict | Spec packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015/003 sweep harness (`runLaneWeightSweep`).
- 015/004 seed helper.
- 015/008 skill-side graph_causal populated.
- 015 advisory.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert. Damping default-off means revert restores existing behavior byte-for-byte.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 015 line stabilized | Damping is the next-step lever |
| Phase 2 | Phase 1 | Author after discovery |
| Phase 3 | Phase 2 | Verify after authoring |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Damping types + math | ~80 LOC |
| Sweep extension | ~120 LOC |
| 4+ damping configs in test | ~60 LOC |
| Report writer extension | ~80 LOC |
| Vitest unit tests | ~150 LOC |
| Implementation summary | ~80 LOC of doc |
| **Total** | **~570 LOC** |

cli-codex gpt-5.5 high fast: 12-20 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Damping config flips today-correct routing.
- Vitest skill_advisor adds new failures.
- Recommend latency regresses >50ms p50.

### Recovery
1. Revert this commit.
2. Confirm vitest restoration.
3. Run live advisor_recommend probe to confirm routing baseline.

### Data Safety
Damping is default-off in lane-registry; revert is byte-for-byte.
<!-- /ANCHOR:enhanced-rollback -->
