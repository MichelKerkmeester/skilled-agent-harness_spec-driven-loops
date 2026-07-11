---
title: "Verification Checklist: Stage-aware Lane C skill-benchmark scorer"
description: "Verification Date: 2026-07-11"
trigger_phrases:
  - "verification"
  - "checklist"
  - "stage aware scorer"
  - "holdout"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/061-stage-aware-scorer"
    last_updated_at: "2026-07-11T21:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level 2 checklist"
    next_safe_action: "Implement, then verify each item with evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/061-stage-aware-scorer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Stage-aware Lane C skill-benchmark scorer

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P0] Pristine Mode-A baseline captured before edits (the frozen before)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Loader sk-doc path: `negativeActivation = stage === 'negative'`
- [ ] CHK-011 [P0] Loader sk-code path: emits `stage` on every scenario
- [ ] CHK-012 [P0] `scoreScenario` attaches `row.stage` (default `routing` for the legacy no-scenario shape)
- [ ] CHK-013 [P0] `aggregate()` fitted aggregate excludes holdout; separate `holdoutScore` + `generalizationGap`
- [ ] CHK-014 [P0] `coverage` gains `holdout` + `negative`; `generalization` block added
- [ ] CHK-015 [P1] `build-report.cjs` stage column + generalization/circularity section
- [ ] CHK-016 [P1] `playbook-generator.cjs` threads per-spec `stage` through render
- [ ] CHK-017 [P0] No dimension weight, D5 gate, or verdict threshold changed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `skill-benchmark.vitest.ts` runs green including new tests
- [ ] CHK-021 [P0] Stage-aware unit tests: `row.stage`, fitted/holdout/gap math, coverage buckets
- [ ] CHK-022 [P0] Adversarial staged-fixture proof: holdout excluded, gap computed, `stage: negative` inverts
- [ ] CHK-023 [P0] Score-preserving unit assertion: stage-less rows yield the same `aggregateScore`
- [ ] CHK-024 [P1] Re-baseline across every corpus: 0 deltas on fitted `aggregateScore` vs the frozen baseline
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Consume side wired for all three stages (routing/holdout/negative)
- [ ] CHK-FIX-002 [P0] All new report fields additive (existing field names/meanings unchanged)
- [ ] CHK-FIX-003 [P0] Legacy `scoreScenario({routerResult, expected})` shape unaffected (stage defaults `routing`)
- [ ] CHK-FIX-004 [P0] Adversarial staged-fixture proof executed and passing
- [ ] CHK-FIX-005 [P1] The 3 stage classes × their aggregate handling documented in `decision-record.md`
- [ ] CHK-FIX-006 [P1] Re-baseline evidence pinned to the frozen baseline JSONL, not a re-derived one
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix diff, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] Scope held to the 5 named files (no unrelated runtime code touched)
- [ ] CHK-032 [P1] No change to the D5 structural hard gate or verdict thresholds
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] `decision-record.md` records the stage-split semantics + score-preserving invariant
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No stray temp/scratch output committed
- [ ] CHK-051 [P1] Re-baseline scratch surfaces kept out of the repo
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending — filled when implementation + re-baseline land.
<!-- /ANCHOR:summary -->
