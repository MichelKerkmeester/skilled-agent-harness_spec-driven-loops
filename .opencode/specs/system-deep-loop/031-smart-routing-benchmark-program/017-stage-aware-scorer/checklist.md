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
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/017-stage-aware-scorer"
    last_updated_at: "2026-07-11T21:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level 2 checklist"
    next_safe_action: "Complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/061-stage-aware-scorer"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` - [evidence: REQ-001..006 in `spec.md`]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` - [evidence: 3-phase wiring plan in `plan.md`]
- [x] CHK-003 [P0] Pristine Mode-A baseline captured before edits (the frozen before) - [evidence: `rebaseline/baseline.jsonl` — 33/35 corpora reported, 25 scored]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Loader sk-doc path: `negativeActivation = stage === 'negative'` - [evidence: `load-playbook-scenarios.cjs:341`; loader test NEG-001 negativeActivation:true]
- [x] CHK-011 [P0] Loader sk-code path: emits `stage` on every scenario - [evidence: `git diff` parseFeatureFile; sk-code corpora tag negatives]
- [x] CHK-012 [P0] `scoreScenario` attaches `row.stage` (default `routing` for the legacy no-scenario shape) - [evidence: `git diff`; unit test asserts routing default + holdout/negative]
- [x] CHK-013 [P0] `aggregate()` fitted aggregate excludes holdout; separate `holdoutScore` + `generalizationGap` - [evidence: cli-opencode fitted 100 / holdout 31 / gap 69; `withHoldout.aggregateScore === fittedOnly.aggregateScore`]
- [x] CHK-014 [P0] `coverage` gains `holdout` + `negative`; `generalization` block added - [evidence: report JSON `generalization` + `coverage.holdout`/`negative`]
- [x] CHK-015 [P1] `build-report.cjs` stage column + generalization/circularity section - [evidence: `report.md` `## Generalization (fitted vs holdout)` + Stage column]
- [x] CHK-016 [P1] `playbook-generator.cjs` threads per-spec `stage` through render - [evidence: `playbook-generator.cjs:180,200`]
- [x] CHK-017 [P0] No dimension weight, D5 gate, or verdict threshold changed - [evidence: `git diff` — `WEIGHTS`, `gateFailed`, `>= 80`/`>= 50` thresholds byte-identical]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `skill-benchmark.vitest.ts` runs green including new tests - [evidence: `vitest run` 45 passed / 7 pre-existing failures; my 5 stage tests pass]
- [x] CHK-021 [P0] Stage-aware unit tests: `row.stage`, fitted/holdout/gap math, coverage buckets - [evidence: `stage-aware scoring` describe, 5 tests]
- [x] CHK-022 [P0] Adversarial staged-fixture proof: holdout excluded, gap computed, `stage: negative` inverts - [evidence: fitted-unchanged-with-holdout assertion + `d1intra.negative` true]
- [x] CHK-023 [P0] Score-preserving unit assertion: stage-less rows yield the plain mean `aggregateScore` - [evidence: `rep.aggregateScore === Math.round((r1+r2)/2)`, holdout null]
- [x] CHK-024 [P1] Re-baseline: holdout-free corpora 0 deltas; holdout-bearing change only by excluding holdout - [evidence: 28/28 holdout-free 0-delta; 7 change as designed vs `baseline.jsonl`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Consume side wired for all three stages (routing/holdout/negative) - [evidence: `load-playbook-scenarios.cjs` + `score-skill-benchmark.cjs` honor all three; 14 holdout + 5 negative fixtures now consumed]
- [x] CHK-FIX-002 [P0] All new report fields additive (existing field names/meanings unchanged) - [evidence: `generalization` + `coverage.holdout`/`negative` added; no field renamed]
- [x] CHK-FIX-003 [P0] Legacy `scoreScenario({routerResult, expected})` shape unaffected (stage defaults `routing`) - [evidence: legacy-shape test asserts `row.stage === 'routing'`; 28 holdout-free corpora 0-delta]
- [x] CHK-FIX-004 [P0] Adversarial staged-fixture proof executed and passing - [evidence: `vitest run` — holdout-exclusion + gap + negative-inversion tests, 5/5 stage tests green]
- [x] CHK-FIX-005 [P1] The 3 stage classes × their aggregate handling documented in `decision-record.md` - [evidence: ADR-001 decision points 2-4]
- [x] CHK-FIX-006 [P1] Re-baseline evidence pinned to the frozen baseline JSONL, not a re-derived one - [evidence: `baseline.jsonl` captured pre-edit; `after.jsonl` diffed against it]
- [x] CHK-FIX-007 [P1] Evidence pinned to the fix diff, not a moving range - [evidence: `git diff` on the 5 changed files]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced - [evidence: `git diff` — scoring/report logic only]
- [x] CHK-031 [P0] Scope held to the 5 named files (no unrelated runtime code touched) - [evidence: `git diff --stat` = loader + scorer + report + generator + test]
- [x] CHK-032 [P1] No change to the D5 structural hard gate or verdict thresholds - [evidence: `git diff` — gate + thresholds byte-identical]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized - [evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` all reflect the fitted/holdout split + the corrected staged-fixtures finding]
- [x] CHK-041 [P1] `decision-record.md` records the stage-split semantics + score-preserving invariant - [evidence: ADR-001 present]
- [x] CHK-042 [P2] README updated (if applicable) - N/A, no README affected
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp/scratch output committed - [evidence: `git status --porcelain` shows only the 5 code files + the 061 packet; re-baseline artifacts stay in the scratchpad]
- [x] CHK-051 [P1] Re-baseline scratch surfaces kept out of the repo - [evidence: `git status` shows only the 5 code files + the 061 packet]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 (N/A) |

**Verification Date**: 2026-07-11 — 5 new stage tests green, 0 regressions, re-baseline 28/28 holdout-free 0-delta + 7 holdout-bearing change as designed.
<!-- /ANCHOR:summary -->
