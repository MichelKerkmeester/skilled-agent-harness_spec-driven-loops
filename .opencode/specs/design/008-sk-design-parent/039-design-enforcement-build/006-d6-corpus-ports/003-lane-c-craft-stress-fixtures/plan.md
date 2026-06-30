---
title: "Implementation Plan: D6-R3 — Lane C craft-stress fixtures"
description: "Grow the sk-design hubRoute gold corpus with three craft-stress public/private fixture pairs (stateful-upload, dense-dashboard, locale-component), preserving the 23/5/0 floor."
trigger_phrases:
  - "d6-r3 lane c craft fixtures plan"
  - "craft stress fixtures design build"
  - "sk-design hubroute corpus grow"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/003-lane-c-craft-stress-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan gates complete and rename phase-deps/effort/enhanced-rollback anchors"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D6-R3 — Lane C craft-stress fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON fixtures (Lane C skill-benchmark corpus) + CommonJS scorer/test |
| **Corpus** | `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/` |
| **Scorer** | `score-skill-benchmark.cjs` (`scoreHubRoute` + `hubRoute` gate) |
| **Guard test** | `scripts/skill-benchmark/tests/design-token-lint.vitest.ts` (route-gold headline guard) |
| **Authoring contract** | `references/skill_benchmark/scenario_authoring.md` (public/private pair, T1–T2 tiers, circularity meter) |
| **Testing** | Vitest (scorer headline guard + full skill-benchmark suite) |

### Overview
This phase ports the designer-skills-main craft surfaces (component state, layout density, localization) into the Lane C skill-benchmark by **GROWING the existing `sk-design/` hubRoute gold corpus** with three new craft-stress public/private fixture pairs: `stateful-upload`, `dense-dashboard`, `locale-component`. Each fixture forces a specific design workflow-mode bundle and is scored by the same per-skill `hubRoute` stage (`scoreHubRoute`) that scores the existing corpus. The corpus is homogeneous — the new fixtures reuse the identical route-gold `expected` schema (`workflowMode` / `routeOutcome` / `forbiddenWorkflowModes` / `minimalPairGroup`) — so a sibling corpus is rejected; growing in place is the spec-faithful path (spec §6 EVIDENCE names `assets/skill_benchmark/fixtures/<skill-id>/`).

The **0-regression invariant is the hard contract**: the prior **23 pass / 5 known-gaps / 0 regressions** floor must hold. New fixtures may only *add* to the pass bucket (clean new gold) or the known-gap bucket (`knownRouteGap: true` when the router silently defaults); they must never flip a prior gold row from pass to fail. The route-gold headline guard test encodes this tally and is the enforcement point.

> **GROW vs SIBLING decision (resolved): GROW `fixtures/sk-design/`.** Rationale: (1) spec §6 EVIDENCE points at the per-`<skill-id>` directory convention; (2) spec §2 WHY frames these as sk-design craft surfaces; (3) the scorer's `hubRoute` gate is per-skill (`loadPairs('sk-design')` → `routeSkillResources({ skillRoot: SKDESIGN })`) and the new fixtures are schema-homogeneous with the existing 28 route-gold rows; (4) "grows the pass count, 0-regression invariant" is exactly the GROW semantics. A byte-stable sibling would fragment a homogeneous corpus for no scoring benefit.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec deliverable, fixture shape, and home confirmed (spec §3/§4/§6)
- [x] TRUE current baseline tally captured by running the scorer/guard test (not assumed) — 28 routeRows / 23 pass
- [x] "proof fields" interpretation resolved against the spec and the two scorers — route-gold `expected` block
- [x] Per-surface expected workflow-mode bundle derived from sk-design mode registry + router replay

### Definition of Done
- [x] Three craft-stress pairs authored (T2 holdout primary; T1 derived twin to publish the meter)
- [x] Each public prompt passes `contamination-lint.cjs` (domain language, no identity leaks)
- [x] Each fixture admits to one router key; gold set to pass OR `knownRouteGap: true` per router replay
- [x] 23/5/0 floor intact: prior 23 pass + 5 known-gaps unchanged, 0 regressions (now 34/29/5/0)
- [x] Headline guard test numerics reconciled to the new totals (28/23 → 34/29); suite green
- [x] T1↔T2 circularity meter published and within authoring bounds
- [x] Evergreen: no spec IDs/paths embedded in any fixture file

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Public/private fixture pair, GROW-in-place into the per-skill route-gold corpus. Public = the only material crossing the dispatch boundary; private = scorer-only gold.

### Key Components
- **Public fixture** (`<scenarioId>.public.json`): `{ scenarioId, tier, public: { prompt, runtime, mutationBoundary, outputContract }, provenance }`. `prompt` is domain language only — must NOT name the skill, triggers, intent keys, mode names, resource paths/basenames, or commands.
- **Private fixture** (`<scenarioId>.private.json`): `{ scenarioId, expected: { skillId, mode, advisorLane, intentKeys[], resources[], negativeActivation, workflowMode, routeOutcome, forbiddenWorkflowModes[], minimalPairGroup }, rubric: { usefulnessChecks[], harmChecks[] } }`. `workflowMode` is a string for `single`, an ordered array for `orderedBundle`.
- **`scoreHubRoute`** (`score-skill-benchmark.cjs:387`): applicable only when `routeOutcome` + `workflowMode` present; pass requires exact mode-set match AND no `forbiddenWorkflowModes` hit; empty router result → `firstFailingStage: 'silent-default'`.
- **`hubRoute` gate** (`score-skill-benchmark.cjs:773`): `regressions` = applicable-fail rows where `knownGap !== true`; `knownGaps` = applicable-fail rows where `knownGap === true`; gate `failed` iff `regressions > 0`.
- **Headline guard test** (`design-token-lint.vitest.ts:83`): asserts exact `routeRows` length, `passed` count, `knownGaps`, `regressions`, `failed` — the no-regression enforcement point.

### Data Flow
1. Author public prompt in domain language for the craft surface.
2. `contamination-lint.cjs` rejects any identity leak before scoring.
3. `routeSkillResources({ skillRoot: SKDESIGN, taskText: prompt })` returns the actual route.
4. Set private gold: if actual == intended route → clean gold (pass); if actual == `[]` (silent default) → `knownRouteGap: true`.
5. `scoreHubRoute` scores each row; the gate aggregates pass / knownGaps / regressions.
6. Guard test asserts the post-add tally; full suite confirms no regression.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Baseline
- [x] Run the scorer / headline guard test to capture the REAL current tally — confirmed 28 routeRows / 23 pass / 5 known-gaps / 0 regressions on disk before any edit
- [x] Read sk-design mode registry/modes (`interface`, `foundations`, `motion`, `audit`, `md-generator`) and the register dials to derive each craft surface's intended mode bundle
- [x] Resolve the "proof fields" interpretation (route-gold `expected` proof expectations vs DESIGN_BOUNDARY_PROOF token) — resolved to the route-gold reading; decision recorded in spec OPEN QUESTIONS

### Phase 2: Core Authoring
- [x] Author `stateful-upload` pair (component state surface)
- [x] Author `dense-dashboard` pair (layout density surface)
- [x] Author `locale-component` pair (localization surface)
- [x] Author T1 derived twins to enable the T1↔T2 circularity meter
- [x] Run `contamination-lint.cjs` on each public prompt; revise until clean
- [x] Router-replay each prompt; set gold to clean-pass or `knownRouteGap: true`

### Phase 3: Verification
- [x] Run the scorer; confirm prior 23 pass + 5 known-gaps unchanged, 0 regressions
- [x] Reconcile the headline guard test numerics (routeRows length, passed) to the new totals — 28/23 → 34/29; knownGaps/regressions unchanged at 5/0
- [x] Publish the T1↔T2 score-gap circularity meter; confirm within authoring bounds
- [x] Run the full skill-benchmark vitest suite green
- [x] Confirm evergreen: grep every new fixture for spec IDs/paths → none

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contamination | Each public prompt has no identity leak | `contamination-lint.cjs` |
| Route replay | Each prompt admits to one router key | `routeSkillResources` / `router-replay.cjs` |
| Headline guard | Prior 23/5/0 floor + new totals | `design-token-lint.vitest.ts` route-gold guard |
| Full suite | No cross-fixture regression | `scripts/skill-benchmark/tests/*.vitest.ts` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `score-skill-benchmark.cjs` `scoreHubRoute` | Internal | Green | No route-gold scoring |
| `contamination-lint.cjs` | Internal | Green | Cannot guard prompt leaks |
| `routeSkillResources` / `router-replay.cjs` | Internal | Green | Cannot derive actual route / set gold |
| sk-design mode registry | Internal | Green | Cannot derive mode bundles |
| `scenario_authoring.md` | Internal | Green | No authoring/tier/meter contract |
| Headline guard test | Internal | Green | No-regression enforcement weakened |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new fixture flips a prior gold row to fail (regression > 0), or the guard test cannot be reconciled without lowering the prior-23 floor.
- **Procedure**: Remove the offending `<scenarioId>.public.json` / `<scenarioId>.private.json` pair, revert the guard-test numeric edit to the captured baseline, re-run the suite to confirm 23/5/0 restored.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup & Baseline) ──> Phase 2 (Core Authoring) ──> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup & Baseline | None | Core Authoring |
| Core Authoring | Setup & Baseline (baseline + bundle map + proof decision) | Verification |
| Verification | Core Authoring | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup & Baseline | Low | 30-45 minutes |
| Core Authoring (3 surfaces + T1 twins) | Medium | 2-3 hours |
| Verification (guard reconcile + meter + suite) | Low-Medium | 1-1.5 hours |
| **Total** | | **3.5-5.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Baseline tally captured from the scorer (real numbers, on disk) — 28/23/5/0
- [x] Guard-test pre-edit numerics recorded for clean revert — `toHaveLength(28)` / `passed.toBe(23)`
- [x] No prior fixture file touched (additive-only change)

### Rollback Procedure
1. **Immediate**: Delete the newly added craft-stress `*.public.json` / `*.private.json` pairs.
2. **Guard test**: Revert the `routeRows` length / `passed` numeric edit to the captured baseline.
3. **Verify**: Re-run the headline guard test → prior 23/5/0 floor restored, gate `failed: false`.
4. **Confirm**: Full skill-benchmark vitest suite green.

### Data Reversal
- **Has data migrations?** No — additive static JSON fixtures only.
- **Reversal procedure**: File deletion + single guard-test numeric revert; no state to migrate.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
