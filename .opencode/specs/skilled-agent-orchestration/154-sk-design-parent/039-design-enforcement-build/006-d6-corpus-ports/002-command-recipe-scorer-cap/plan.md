---
title: "Implementation Plan: commandRecipe Scorer Adapter (D2/D3 Cap)"
description: "Insert a deterministic commandRecipe validity phase into the Lane C scenario scorer that caps D2/D3 credit when a command's recipe is undefined or invalid, plus a recipeMissRate reducer. Additive and gold-gated."
trigger_phrases:
  - "command recipe scorer cap"
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
    recent_action: "Mark plan gates done and rename phase-deps, effort, enhanced-rollback anchors"
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
# Implementation Plan: commandRecipe Scorer Adapter (D2/D3 Cap)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS `.cjs`) |
| **Framework** | Lane C skill-benchmark scorer (deep-improvement) |
| **Storage** | None — reads JSON gold fixtures + the sk-design `command-metadata.json` projection |
| **Testing** | Vitest (`tests/skill-benchmark.vitest.ts`) + the `run-skill-benchmark` integration runner |

### Overview
Insert a deterministic `commandRecipe` validity phase into the per-scenario scorer that runs **before the resource-recall (D2) lane**. The phase validates a command's recipe through five ordered sub-checks — metadata validity, wrapper drift, arg fixture, route/bundle, choreography witness — and **caps the D2 (discovery) and D3 (efficiency) contributions** when the recipe is undefined or fails any sub-check. A `recipeMissRate` reducer surfaces the miss signal alongside the existing route-telemetry signals.

The lane is **additive and gold-gated**: it mirrors the existing soft-cap pattern (the surface-mismatch D1 cap) and the existing gold-gated lane pattern (the hubRoute and toolSurface lanes), so any scenario that carries no recipe gold returns `applicable:false`, applies no cap, and scores byte-identically to today. The cap is the enforcement that makes the sibling command-recipe projection a *measurable* failure instead of free credit.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target scorer and its existing cap/lane patterns read and understood — the soft-cap + gold-gated lane patterns cloned
- [x] Recipe-gold schema agreed (the `commandRecipe` expected fields + the `command-metadata.json` shape the lane reads) — normalizers extended to carry recipe gold
- [x] Pre-change baseline captured (hubRoute pass/known-gap/regression tally, existing Vitest green, D2/D3 aggregate on the sk-design fixtures) — hubRoute 28/23/5/0 baseline captured
- [x] Cap ceiling decided against the existing surface-mismatch precedent — `RECIPE_INVALID_CAP = 0.25`

### Definition of Done
- [x] A missing/invalid-recipe fixture scores a capped D2/D3; a valid-recipe fixture passes uncapped — invalid+missing clamp D2/D3 to `0.25`; valid uncapped
- [x] A no-recipe-gold scenario is unaffected (D2/D3 byte-identical, `applicable:false`) — negative control `applicable:false`, byte-identical to baseline
- [x] `recipeMissRate` is emitted — `reduceRecipeMiss` surfaces `recipeMissRate` under advisory-signals/run-quality, never in the aggregate
- [x] No-regression contract holds (hubRoute tally unchanged, existing Vitest green, no new hard verdict gate) — hubRoute 28/23/5/0; `0` BLOCKED/hardGate
- [x] Honest enforcement note recorded (code-enforced cap vs advisory choreography quality) — recipe presence/witness enforceable, execution quality advisory

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive scorer lane — clones two patterns already in the scenario scorer: the **soft cap** (the surface-mismatch clamp on D1) and the **gold-gated lane** (the hubRoute / toolSurface lanes that return `applicable:false, pass:true` when no gold is present). No new hard verdict gate is introduced; the cap is a deterministic clamp, not a blocker.

### Key Components
- **`loadCommandMetadata(skillRoot)`** — cached loader for the sk-design recipe projection, modeled on the existing mode-registry loader (same module-level cache discipline).
- **`scoreCommandRecipe({ expected, skillRoot, routerResult, observed })`** — the five-sub-check evaluator returning `{ applicable, valid, firstFailingStage, missReasons[] }`; returns `applicable:false, valid:true` when no recipe gold exists (the additive guard).
- **D2/D3 cap application** — inside the scenario scorer, after D2/D3 are computed: when the recipe lane is `applicable` and not `valid`, clamp both scores to the recipe-invalid cap and tag the row `recipeCapped:true`.
- **Funnel ordering** — add a `recipe-invalid` stage to the failing-stage order map and to the first-failing-stage resolver, positioned after the backend/tool-surface stages and before the routed-intra / discovery stages.
- **`reduceRecipeMiss(rows)`** — aggregate reducer producing `recipeMissRate` plus a per-sub-check breakdown (metadata / wrapper / arg / route / choreography), modeled on the existing route-telemetry reducer and shared rate helper.
- **Recipe-gold normalization** — extend the scenario-gold normalizers to carry the `commandRecipe` expected fields from the fixture.
- **Exports** — add the new scorer + reducer to the module exports for unit testing.

### Data Flow
1. The scenario scorer reads recipe gold from the scenario's expected block and loads the live `command-metadata.json` from the target skill root.
2. `scoreCommandRecipe` runs the five ordered sub-checks; it reports the first failing sub-check and the full miss-reason list.
3. When the lane is applicable and the recipe is invalid, D2 and D3 are clamped to the recipe-invalid cap and the row is tagged `recipeCapped`.
4. The first-failing-stage funnel records `recipe-invalid` in its ordered position.
5. The aggregate reducer rolls per-scenario recipe results into `recipeMissRate` + a sub-check breakdown, surfaced under the advisory-signals block and run-quality block (never folded into the weighted aggregate).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Baseline
- [x] Read the scenario scorer end-to-end; locate the surface-mismatch cap, the hubRoute / toolSurface gold-gated lanes, the failing-stage order map, and the route-telemetry reducer as the templates to clone — clone targets identified
- [x] Capture the pre-change baseline: hubRoute pass/known-gap/regression tally, the full Vitest suite result, and the D2/D3 aggregate over the sk-design fixtures — hubRoute 28/23/5/0 baseline captured
- [x] Confirm the recipe-gold schema and the recipe-invalid cap ceiling (parity with the surface-mismatch precedent unless fixtures require otherwise) — `RECIPE_INVALID_CAP = 0.25` confirmed

### Phase 2: Core Implementation
- [x] Add the recipe-invalid cap constant beside the existing surface-mismatch cap constant — `RECIPE_INVALID_CAP = 0.25` added
- [x] Add the cached `command-metadata.json` loader modeled on the mode-registry loader — `loadCommandMetadata` cached, degrades safely on absent/unparseable metadata
- [x] Implement `scoreCommandRecipe` with the ordered sub-checks and the `applicable:false` no-gold guard — returns `{ applicable, valid, firstFailingStage, missReasons[] }`
- [x] Extend the scenario-gold normalizers to carry the `commandRecipe` expected fields — recipe gold normalized through
- [x] Apply the D2/D3 clamp in the scenario scorer, gated on `applicable && !valid`, tagging `recipeCapped` — both `d2.score` and `d3.score` clamped to `0.25`, `recipeCapped:true`
- [x] Wire the `recipe-invalid` stage into the failing-stage order map and the first-failing-stage resolver — `recipe-invalid` stage wired
- [x] Implement `reduceRecipeMiss` and surface `recipeMissRate` under advisory-signals + run-quality — surfaced, never in the aggregate
- [x] Add the new scorer + reducer to the module exports — `scoreCommandRecipe`, `reduceRecipeMiss`, `loadCommandMetadata`, `RECIPE_INVALID_CAP` exported

### Phase 3: Verification
- [x] Add scorer unit tests: each sub-check fails as expected; a valid recipe passes; the cap clamps both D2 and D3; the no-gold guard leaves scores untouched — `skill-benchmark.vitest.ts` recipe-lane tests added
- [x] Author the four gold fixtures (valid recipe, missing recipe, invalid recipe, no-recipe negative control) under the sk-design fixture root — four recipe-only fixture pairs under `fixtures/sk-design/`
- [x] Score the sk-design fixtures; confirm `recipeMissRate` is present and the capped rows are correct — invalid+missing capped, valid uncapped, `recipeMissRate` surfaced (orchestrator-verified, no pipe-masking)
- [x] Re-run the no-regression checks; confirm the hubRoute tally is unchanged from the Phase 1 baseline — hubRoute 28/23/5/0 unchanged; recipe-only fixtures not hubRoute-applicable
- [x] Record the honest enforcement note and the no-regression delta — recorded in `implementation-summary.md` and spec OPEN QUESTIONS

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `scoreCommandRecipe` per-sub-check pass/fail, the no-gold `applicable:false` guard, the D2/D3 clamp via the scenario scorer, `reduceRecipeMiss` math | Vitest |
| Integration | `run-skill-benchmark` over the sk-design fixtures: capped rows, `recipeMissRate` presence, sub-check breakdown | run-skill-benchmark runner |
| Regression | hubRoute pass/known-gap/regression tally unchanged; existing Vitest green; D2/D3 unchanged for no-recipe rows; verdict cascade unchanged | Vitest + baseline delta |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-design `command-metadata.json` recipe projection (prerequisite sibling deliverable) | Internal | Pending | Lane degrades to `applicable:false` everywhere; cap never bites until the projection lands |
| Parseable hub-router projection + gated hubRoute scorer lane | Internal | In place | Recipe route/bundle sub-check leans on the existing route lane |
| Existing scorer machinery (mode-registry loader, soft-cap + gold-gated lane patterns, rate helper) | Internal | In place | Clone targets unavailable; would require bespoke implementation |
| Vitest harness + run-skill-benchmark runner | Internal | In place | No deterministic verification path |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The cap bites a no-recipe-gold scenario, the hubRoute tally shifts, or the existing Vitest suite regresses.
- **Procedure**: Revert the scorer edit. Because the lane is additive and gated on recipe gold, reverting restores byte-identical scoring. Remove the added fixtures and unit tests.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup & Baseline) ──> Phase 2 (Core) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup & Baseline | None | Core |
| Core | Setup & Baseline | Verify |
| Verify | Core | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup & Baseline | Low | 30-45 minutes |
| Core Implementation | Medium | 2-3 hours |
| Verification (fixtures + tests + delta) | Medium | 1.5-2.5 hours |
| **Total** | | **4-6 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Pre-change baseline captured (hubRoute tally, Vitest result, D2/D3 aggregate) — hubRoute 28/23/5/0 captured before edits
- [x] No-recipe-gold negative control authored and confirmed unaffected — `applicable:false`, byte-identical to baseline
- [x] Change confirmed additive (single scorer file + additive fixtures/tests; no shared-gate edits) — referenced surfaces untouched

### Rollback Procedure
1. **Immediate**: Revert the scorer file to its pre-change state
2. **Tests/fixtures**: Remove the added recipe fixtures and unit tests
3. **Verify**: Re-run the Vitest suite and confirm the hubRoute tally matches the Phase 1 baseline
4. **Confirm**: No advisory-signal or run-quality consumer breaks on the removed `recipeMissRate` key

### Data Reversal
- **Has data migrations?** No — scorer logic + JSON fixtures only
- **Reversal procedure**: Git revert of the scorer file and fixture/test additions

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
