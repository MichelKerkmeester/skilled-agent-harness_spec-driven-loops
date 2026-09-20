---
title: "Implementation Plan: D3 efficiency N/A for routed-nothing positive scenarios"
description: "One-branch scoreD3 fix + unit test + before/after re-baseline proving fitted aggregates are byte-identical and only routed-nothing holdout scores move to their honest 0."
trigger_phrases:
  - "implementation"
  - "plan"
  - "d3 efficiency not applicable"
  - "routed nothing scoring"
  - "skill benchmark"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/018-routed-nothing-efficiency-na"
    last_updated_at: "2026-07-11T22:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan executed: scoreD3 guard + test + re-baseline"
    next_safe_action: "Complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/062-routed-nothing-efficiency-na"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: D3 efficiency N/A for routed-nothing positive scenarios

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
`scoreD3` credits `score: 1` to a positive scenario that routed nothing, flooring a total recall miss at 31. The fix adds one guard: routed-nothing-with-positive-gold returns `null` (efficiency undefined), mirroring the existing no-positive-gold branch. Correctness is anchored to a before/after re-baseline that isolates this change (post-061 `after` vs post-fix `after2`), proving no fitted aggregate moves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `skill-benchmark.vitest.ts` green with the new routed-nothing test; full deep-improvement suite has 0 new regressions.
- Re-baseline: 0 fitted-aggregate changes across all 33 corpora (after vs after2).
- Routed-nothing holdouts drop 31 → 0; routed-something holdouts unchanged.
- No dimension weight, D5 gate, verdict threshold, or D3 negative/no-gold branch changed (grep-confirmed).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`scoreD3({ negative, d1intra, routerResult, expected })`: after the `negative` branch and the `no-positive-gold → null` branch, add `if (routed === 0) return { score: null, proxy: 'no-routing', ... }` before the over-routing computation. `modeAScore` already drops a null D3 from its weighted set, so a routed-nothing positive row normalizes over D1-intra + D2 alone.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | File | Nature |
|---------|------|--------|
| Scorer | `score-skill-benchmark.cjs` | `scoreD3` routed-nothing guard → null |
| Tests | `tests/skill-benchmark.vitest.ts` | routed-nothing → D3 null → score 0 assertion |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1 — Blast radius
Scan all corpora for positive scenarios that route nothing, split by stage — confirm 0 fitted, only holdout affected.

### Phase 2 — Fix + test
Add the `scoreD3` routed-nothing guard; add the unit test.

### Phase 3 — Re-baseline
Re-run Mode-A across every corpus; diff fitted aggregate post-061 vs post-fix (must be 0 changes); confirm the expected holdout drops.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- Unit: a positive scenario with expected gold and empty router result → `d3.score === null`, `d3.proxy === 'no-routing'`, `modeAScore === 0`.
- System: before/after corpus re-baseline (after vs after2) — 0 fitted deltas, holdout drops where routed-nothing.
- Regression: full deep-improvement suite failure set unchanged (+1 passing test).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- Packet 061 (fitted/holdout split) — the reporting that exposed the salvage.
- The 061 re-baseline JSONL (`after.jsonl`) — the post-061 side of the isolated diff.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Single-hunk change in `scoreD3`; `git checkout -- score-skill-benchmark.cjs` restores the prior salvage. The test edit is independent. No data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

| Phase | Depends On | Rationale |
|-------|-----------|-----------|
| Phase 1 | 061 re-baseline present | The blast-radius scan reads the post-061 reports |
| Phase 2 | Phase 1 | Only fix once the blast radius is confirmed contained |
| Phase 3 | Phase 2 | Re-baseline verifies fitted-unchanged + holdout-honest |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 | XS | one blast-radius scan |
| Phase 2 | XS | one guard + one test |
| Phase 3 | S | corpus re-baseline sweep + diff |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK

If the re-baseline shows any fitted-aggregate change, a fitted scenario routes nothing and the assumption is wrong: revert the `scoreD3` guard, re-run to confirm restoration, and re-scope the fix to holdout-stage rows only rather than all positive scenarios.
<!-- /ANCHOR:enhanced-rollback -->
