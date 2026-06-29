---
title: "Tasks: commandRecipe Scorer Adapter (D2/D3 Cap)"
description: "Task breakdown for the commandRecipe validity phase + D2/D3 cap + recipeMissRate reducer in the Lane C scenario scorer, with explicit baseline and no-regression verification tasks."
trigger_phrases:
  - "command recipe scorer cap tasks"
  - "commandRecipe d2 d3 cap"
  - "skill-benchmark recipe lane"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/002-command-recipe-scorer-cap"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task done with one-line evidence and canonical phase headers"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: commandRecipe Scorer Adapter (D2/D3 Cap)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

**Primary target**: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the scenario scorer; map the surface-mismatch cap, the hubRoute + toolSurface gold-gated lanes, the failing-stage order map, and the route-telemetry reducer as clone templates (`scripts/skill-benchmark/score-skill-benchmark.cjs`) [15m] — Done: clone targets identified
- [x] T002 [P] Capture the pre-change baseline: hubRoute pass/known-gap/regression tally + full Vitest result + D2/D3 aggregate over the sk-design fixtures (`scripts/skill-benchmark/tests/skill-benchmark.vitest.ts`, `assets/skill_benchmark/fixtures/sk-design/`) [15m] — Done: hubRoute 28/23/5/0 baseline captured before edits
- [x] T003 [P] Confirm the recipe-gold schema and the recipe-invalid cap ceiling against the surface-mismatch precedent (`scripts/skill-benchmark/score-skill-benchmark.cjs`) [10m] — Done: `RECIPE_INVALID_CAP = 0.25` confirmed

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Constants & Loaders
- [x] T004 Add the recipe-invalid cap constant beside the surface-mismatch cap constant (`score-skill-benchmark.cjs`) [10m] — Done: `RECIPE_INVALID_CAP = 0.25`
- [x] T005 Add the cached `command-metadata.json` loader modeled on the mode-registry loader (`score-skill-benchmark.cjs`) [20m] — Done: `loadCommandMetadata` cached; degrades safely on absent/unparseable metadata

### Recipe Lane
- [x] T006 Implement `scoreCommandRecipe` with the ordered sub-checks — metadata validity, wrapper drift, arg fixture, route/bundle, choreography witness — returning `{ applicable, valid, firstFailingStage, missReasons[] }` (`score-skill-benchmark.cjs`) [45m] — Done: lane runs before the D2 resource-recall lane
- [x] T007 Add the `applicable:false` no-recipe-gold guard so scenarios without recipe gold are untouched (`score-skill-benchmark.cjs`) [10m] — Done: negative control returns `applicable:false`, byte-identical to baseline
- [x] T008 Extend the scenario-gold normalizers to carry the `commandRecipe` expected fields (`score-skill-benchmark.cjs`) [20m] — Done: recipe gold normalized through

### Cap, Funnel & Reducer
- [x] T009 Apply the D2/D3 clamp in the scenario scorer, gated on `applicable && !valid`, tagging the row `recipeCapped` (`score-skill-benchmark.cjs`) [20m] — Done: both `d2.score` and `d3.score` clamped to `0.25`, `recipeCapped:true`
- [x] T010 Wire the `recipe-invalid` stage into the failing-stage order map and the first-failing-stage resolver (between the backend/tool-surface stages and routed-intra/discovery) (`score-skill-benchmark.cjs`) [15m] — Done: `recipe-invalid` stage wired; capped fixtures report `firstFailingStage:"recipe-invalid"`
- [x] T011 Implement `reduceRecipeMiss` and surface `recipeMissRate` under advisory-signals and run-quality (`score-skill-benchmark.cjs`) [25m] — Done: `recipeMissRate` surfaced, never in the weighted aggregate
- [x] T012 Add `scoreCommandRecipe` + `reduceRecipeMiss` to the module exports (`score-skill-benchmark.cjs`) [5m] — Done: scorer, reducer, loader, and cap constant exported

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T013 Test each `scoreCommandRecipe` sub-check fails as expected and a valid recipe passes (`tests/skill-benchmark.vitest.ts`) [25m] — Done: recipe-lane tests added
- [x] T014 Test the cap clamps BOTH D2 and D3 via the scenario scorer, and the no-gold guard leaves scores untouched (`tests/skill-benchmark.vitest.ts`) [20m] — Done: capped-both-dims and no-gold-guard cases asserted
- [x] T015 [P] Test `reduceRecipeMiss` rate math (`tests/skill-benchmark.vitest.ts`) [15m] — Done: `recipeMissRate` aggregation asserted

### Fixtures
- [x] T016 [P] Author the valid-recipe fixture (D2/D3 uncapped) (`assets/skill_benchmark/fixtures/sk-design/`) [15m] — Done: `sk-design-command-recipe-valid.{public,private}.json`
- [x] T017 [P] Author the missing-recipe and invalid-recipe fixtures (D2/D3 capped) (`assets/skill_benchmark/fixtures/sk-design/`) [20m] — Done: `...-missing` and `...-invalid` pairs, both capped
- [x] T018 [P] Author the no-recipe-gold negative-control fixture (unaffected) (`assets/skill_benchmark/fixtures/sk-design/`) [10m] — Done: `...-no-recipe-negative-control` pair, `applicable:false`

### Integration & No-Regression
- [x] T019 Score the sk-design fixtures; confirm `recipeMissRate` present and capped rows correct [15m] — Done: invalid+missing `{valid:false, firstFailingStage:"recipe-invalid"}` D2/D3 capped; valid uncapped; `recipeMissRate` surfaced (orchestrator-verified, no pipe-masking)
- [x] T020 Re-run the no-regression checks; confirm the hubRoute tally is unchanged from the T002 baseline (`tests/skill-benchmark.vitest.ts`) [15m] — Done: hubRoute 28/23/5/0 unchanged; `0` BLOCKED/hardGate; `node --check` clean

### Documentation
- [x] T021 Record the honest enforcement note (recipe presence/witness enforceable vs execution-quality advisory) and the no-regression delta in `implementation-summary.md` [15m] — Done: recorded in implementation-summary and spec OPEN QUESTIONS
- [x] T022 Mark all checklist items with evidence (`checklist.md`) [10m] — Done: checklist fully `[x]` with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All unit tests passing
- [x] Scoring the fixtures emits `recipeMissRate` and correct capped rows
- [x] hubRoute tally unchanged from baseline; existing Vitest green
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit baseline + no-regression verification tasks
-->
