---
title: "Implementation Plan: Ablation sweep and promote semantic lane to live"
description: "Sweep candidate lane weight vectors via eval_run_ablation, pick the best, promote in lane-registry.ts."
trigger_phrases:
  - "ablation sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-ablation-sweep-and-promote"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded plan.md"
    next_safe_action: "Wait for 001; then dispatch cli-codex"
    blockers:
      - "Depends on child 001 being shipped"
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Ablation sweep and promote semantic lane to live

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Sweep a small set of candidate lane weight vectors through `eval_run_ablation` against the existing skill-advisor gold battery, pick the vector that maximizes intent-recall without regressing today-correct routings, then promote the cosine lane to `live: true` in `lane-registry.ts` with the chosen weight vector.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [ ] Child 001 shipped: lane code exists, vectors cached.
- [ ] Candidate weight vectors selected and committed to spec.md.

### Definition of Done
- [ ] Ablation results documented for each candidate.
- [ ] Chosen vector promoted in `lane-registry.ts`.
- [ ] ADR-001 written in decision-record.md.
- [ ] Vitest suite still clean.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (registry edit), MCP eval_run_ablation tool (sweep) |
| **Framework** | Spec Kit MCP server |
| **Storage** | `speckit-eval.db` (ablation results) |
| **Testing** | `eval_run_ablation` + Vitest snapshot |

### Approach
1. Pre-write 5-8 candidate weight vectors in spec.md before dispatching.
2. Run `eval_run_ablation` per vector.
3. Tabulate results in implementation-summary.md.
4. Pick winner; edit `lane-registry.ts` with promoted weights.
5. Rerun tests; commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm 001 shipped and dist rebuilt.
- Choose candidate weight vectors.

### Phase 2: Implementation
- Run ablation sweep.
- Tabulate metrics.
- Pick winner.
- Edit `lane-registry.ts`.
- Write ADR-001.

### Phase 3: Verification
- Run Vitest skill_advisor suite.
- Strict validate.
- Probe via cli-opencode.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Ablation sweep | Weight-vector comparison | `eval_run_ablation` per vector |
| Lane promotion math | Weights sum to 1.0 | Vitest assertion |
| No-regression | Today-correct routings stay correct | Vitest snapshot |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- Phase 001 must be shipped, dist must contain the cosine lane code.
- `eval_run_ablation` MCP tool functional.
- Skill-advisor gold battery exists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert restores prior `lane-registry.ts` weights. Lane reverts to shadow-only (live: false). No data migration involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1: Setup | Child 001 shipped | Lane must exist before sweep |
| Phase 2: Implementation | Phase 1 | Need ablation results before promoting |
| Phase 3: Verification | Phase 2 | Test runs after registry edit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Define candidate vectors | <10 LOC |
| Run ablation sweep | tool calls, no LOC |
| Edit lane-registry.ts | ~10 LOC |
| Write ADR-001 | ~50 LOC of doc |
| Vitest weights-sum + snapshot | ~40 LOC |
| **Total** | **~110 LOC** |

Dispatch time on cli-codex gpt-5.5 high: 5-10 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Routing flips on a today-correct fixture after promotion.
- Recommend latency regresses materially.

### Recovery
1. Revert the promotion commit.
2. Run Vitest to confirm restoration.
3. Restart MCP server to pick up reverted dist.

### Data Safety
No data migration. The lane is registered; only its weight changes.
<!-- /ANCHOR:enhanced-rollback -->
