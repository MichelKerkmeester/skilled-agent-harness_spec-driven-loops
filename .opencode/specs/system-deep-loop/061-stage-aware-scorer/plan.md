---
title: "Implementation Plan: Stage-aware Lane C skill-benchmark scorer"
description: "Wire the consume side of benchmark scenario stages under a score-preserving invariant: loader honors stage, scorer splits fitted/holdout + generalization gap, report renders the split, verified by a pristine-baseline before/after re-baseline."
trigger_phrases:
  - "implementation"
  - "plan"
  - "stage aware scorer"
  - "holdout"
  - "skill benchmark"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/061-stage-aware-scorer"
    last_updated_at: "2026-07-11T21:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level 2 plan from ground-truth read + pristine baseline"
    next_safe_action: "Phase 1 — loader stage wiring"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/061-stage-aware-scorer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Stage-aware Lane C skill-benchmark scorer

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
The `stage` axis is already produced (generator emits `stage:`, loader parses it) but not consumed. The plan wires the consume side in the smallest score-preserving way: honor `stage: negative` on load, emit `stage` uniformly, thread it into rows, and split `aggregate()` into fitted/holdout with additive fields. The correctness anchor is a **pristine baseline captured before any edit**, so the score-preserving invariant (fitted == prior for stage-less corpora) is a hard before/after check, not a claim.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `skill-benchmark.vitest.ts` runs green including the new stage-aware, adversarial, and score-preserving tests.
- Re-baseline diff across every scored corpus shows 0 deltas on fitted `aggregateScore`.
- The adversarial staged-fixture test proves holdout exclusion + gap + `stage: negative` inversion.
- No dimension weight, D5 gate, or verdict threshold changed (grep-confirmed on the diff).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Data flow: `loadPlaybookScenarios` → per-scenario `{ stage, negativeActivation, ... }` → `scoreScenario` attaches `row.stage` (default `routing`) → `aggregate()` partitions rows by stage. `fittedRows = rows where stage != 'holdout'`; `aggregateScore = avg(modeAScore over fittedRows)`; `holdoutRows = rows where stage == 'holdout'`; `holdoutScore = avg(modeAScore over holdoutRows)`; `generalizationGap = fitted − holdout`. Negatives are a within-fitted adversarial subset scored by the existing inversion machinery (`negativeActivation` drives D1-intra/D2/D3 + `scoreD1Inter(negative)`); the aggregate only *counts* them for coverage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | File | Nature |
|---------|------|--------|
| Corpus loader | `load-playbook-scenarios.cjs` | sk-doc `negativeActivation` from stage; sk-code emits `stage` |
| Scorer | `score-skill-benchmark.cjs` | `row.stage`; fitted/holdout split; `generalization` block; coverage buckets |
| Report renderer | `build-report.cjs` | stage column + generalization/circularity section |
| Fixture generator | `playbook-generator.cjs` | thread per-spec `stage` through render |
| Tests | `tests/skill-benchmark.vitest.ts` | stage-aware + adversarial + score-preserving |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1 — Loader stage wiring
sk-doc path: `negativeActivation = stage === 'negative'`. sk-code path: add `stage: negativeActivation ? 'negative' : 'routing'`.

### Phase 2 — Scorer split + report
`scoreScenario` attaches `row.stage`. `aggregate()` partitions fitted/holdout, computes `holdoutScore` + `generalizationGap`, adds `holdout`/`negative` coverage + a `generalization` block. `build-report.cjs` renders the stage column + generalization section. `playbook-generator.cjs` threads `stage`.

### Phase 3 — Tests + re-baseline
Add stage-aware, adversarial staged-fixture, and score-preserving unit tests. Re-run Mode-A across every corpus; diff fitted `aggregateScore` against the pristine baseline (must be 0 deltas).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- Unit: `scoreScenario` attaches `row.stage`; `aggregate()` fitted/holdout/gap math; coverage buckets.
- Adversarial: a synthetic set of {routing, holdout, negative} rows proves holdout is excluded from fitted, gap is computed, and `stage: negative` inverts.
- Score-preserving: a stage-less row set yields the same `aggregateScore` before and after (the unit analog of the corpus re-baseline).
- System: Mode-A router-replay re-baseline over every corpus, diffed against the frozen baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- `advisor-probe.cjs` `scoreD1Inter({ negative })` — existing inversion lane (unchanged).
- `router-replay.cjs` — deterministic Mode-A router (unchanged).
- The pristine baseline JSONL captured before edits — the before side of the delta.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Each file edit is independent; `git checkout -- <path>` reverts one without the others. The additive report fields and stage split are inert on any corpus that declares no stage, so a partial revert cannot corrupt an existing report shape.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

| Phase | Depends On | Rationale |
|-------|-----------|-----------|
| Phase 1 | Pristine baseline captured | The score-preserving delta needs a frozen before |
| Phase 2 | Phase 1 | The scorer reads the `stage` the loader emits |
| Phase 3 | Phase 2 | Tests + re-baseline verify the split against baseline |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 | XS | 2 small loader edits |
| Phase 2 | S | ~40 LOC scorer + ~15 LOC report + generator thread |
| Phase 3 | M | ~60 LOC tests + the corpus re-baseline sweep |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK

If the re-baseline shows any non-zero delta on a stage-less corpus, the fitted-aggregate partition is wrong: revert `score-skill-benchmark.cjs` `aggregate()` to `avg((r) => r.modeAScore)` over all rows, re-run the baseline to confirm restoration, then re-derive the partition so holdout exclusion is a no-op when `holdoutRows` is empty. The loader and report edits are independent and need not be reverted for a scorer-only regression.
<!-- /ANCHOR:enhanced-rollback -->
