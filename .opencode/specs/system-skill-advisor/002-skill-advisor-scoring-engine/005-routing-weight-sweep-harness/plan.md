---
title: "Implementation Plan: Lane weight sweep harness and intent-prompt corpus"
description: "Extend types + scoreAdvisorPrompt + ablation.ts, author corpus, run sweep, emit recommendation."
trigger_phrases:
  - "weight sweep harness plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/005-routing-weight-sweep-harness"
    last_updated_at: "2026-05-13T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Lane weight sweep harness and intent-prompt corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Extend the advisor scoring core with a `laneWeightsOverride` knob, add a `runLaneWeightSweep` function, author a 20-30 prompt corpus split today-correct vs intent-described, sweep candidate vectors, emit a markdown recommendation. Research output only; `lane-registry.ts` stays at the 015/002 weights.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015/001 + 015/002 shipped on main.
- [x] Existing `runLaneAblation` semantics understood (on/off ablation only).
- [x] Existing fixture corpus locations inventoried.

### Definition of Done
- [x] Type extension lands without changing existing call sites.
- [x] Sweep function exists and returns a structured report.
- [x] Corpus checked in with 20-30 entries balanced 50/50.
- [x] Vitest sweep test passes and emits the markdown artifact.
- [x] Recommendation justified by numbers.
- [x] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest |
| **Framework** | Spec Kit MCP server scoring core |
| **Storage** | Static fixture file; markdown artifact under packet's `research/` subdir |
| **Testing** | Vitest |

### Approach
1. Type extension: `AdvisorScoringOptions.laneWeightsOverride?: Partial<Record<ScorerLane, number>>`.
2. Fusion path in `scoreAdvisorPrompt`: when override present, merge over `DEFAULT_SCORER_WEIGHTS` for the listed lanes.
3. New `runLaneWeightSweep` in `scorer/ablation.ts`: iterates vectors, evaluates each against the corpus, returns `SweepReport`.
4. Corpus file: `skill_advisor/tests/scorer/fixtures/intent-prompt-corpus.ts` with typed entries.
5. Vitest test runs the sweep and emits markdown to `003-weight-sweep-harness/research/sweep-results.md`.
6. `implementation-summary.md` recommendation table copied from the markdown artifact.

### Candidate weight vectors (sweep input)
| Vector | explicit | lexical | graph_causal | derived | semantic |
|--------|----------|---------|--------------|---------|----------|
| V0-baseline-015-002 | 0.42 | 0.28 | 0.13 | 0.12 | 0.05 |
| V1-pre-015-002      | 0.45 | 0.30 | 0.15 | 0.15 | 0.00 |
| V2-slightly-higher  | 0.40 | 0.28 | 0.13 | 0.12 | 0.07 |
| V3-medium           | 0.38 | 0.27 | 0.12 | 0.12 | 0.11 |
| V4-aggressive       | 0.35 | 0.25 | 0.12 | 0.13 | 0.15 |
| V5-explicit-heavy   | 0.50 | 0.25 | 0.10 | 0.10 | 0.05 |
| V6-cosine-dominant  | 0.30 | 0.20 | 0.10 | 0.10 | 0.30 |

V6 is the diagnostic extreme; if it still preserves today-correct routings, the lane's directional signal is sound but probably too small at 0.05 to matter.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm cosine lane is live in fresh process (skip — already verified post-015/002).
- Read current `scoreAdvisorPrompt` to find the weight-merge insertion point.

### Phase 2: Implementation
- Extend types.ts.
- Extend scoreAdvisorPrompt to merge override.
- Add `runLaneWeightSweep`.
- Author corpus.
- Vitest test that runs the sweep.
- Emit markdown artifact under packet's `research/`.
- Update implementation-summary.md.

### Phase 3: Verification
- Vitest sweep test passes.
- Typecheck clean.
- Strict spec validate.
- Strict spec validate parent 015.
- Dist rebuild.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Type extension | Backward compat | Existing scorer tests still pass without modification |
| Override behavior | Single-lane override changes only that lane's score | Vitest unit test |
| Sweep semantics | Iterates vectors, produces stable report shape | Vitest using small 2-vector probe |
| Corpus coverage | Today-correct entries route correctly with baseline weights | Sanity vitest run before sweep |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015/001 + 015/002 must be on main (they are).
- Vitest + existing scorer infra.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert. No live behavior to roll back; this packet adds research and unused infrastructure.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 015/001 + 015/002 shipped | Cosine lane must be live |
| Phase 2 | Phase 1 | Type extension before sweep can run |
| Phase 3 | Phase 2 | Tests run after harness exists |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Type extension | ~10 LOC |
| Fusion override merge | ~30 LOC |
| Sweep function | ~80 LOC |
| Fixture corpus | ~120 LOC (20-30 entries) |
| Vitest sweep + markdown emission | ~150 LOC |
| Implementation summary recommendation | ~40 LOC of doc |
| **Total** | **~430 LOC** |

Codex gpt-5.5 high dispatch: 10-20 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Vitest sweep test fails or takes >60s.
- Override break existing scorer call sites.

### Recovery
1. Revert the implementation commit.
2. Run Vitest skill_advisor to confirm restoration.

### Data Safety
No production data touched. Research artifacts can be deleted with the packet.
<!-- /ANCHOR:enhanced-rollback -->
