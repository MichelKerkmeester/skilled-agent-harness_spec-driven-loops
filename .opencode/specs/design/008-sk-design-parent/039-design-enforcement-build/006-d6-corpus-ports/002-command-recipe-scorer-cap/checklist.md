---
title: "Verification Checklist: commandRecipe Scorer Adapter (D2/D3 Cap)"
description: "Verification checklist for the commandRecipe validity phase + D2/D3 cap + recipeMissRate reducer, with acceptance, fix-completeness, no-regression, and honest enforcement items."
trigger_phrases:
  - "command recipe scorer cap checklist"
  - "commandRecipe d2 d3 cap"
  - "skill-benchmark recipe lane"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/002-command-recipe-scorer-cap"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all items against the scorer, vitest, and four fixtures; add Fix Completeness"
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
# Verification Checklist: commandRecipe Scorer Adapter (D2/D3 Cap)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (recipe phase before resource-recall; cap D2/D3 on undefined/invalid recipe; `recipeMissRate` signal)
  - **Evidence**: spec REQUIREMENTS REQ-001..007 cover the lane-before-D2, the `0.25` clamp on both D2 and D3, the no-gold guard, the soft cap, and `recipeMissRate`
- [x] CHK-002 [P0] Technical approach defined in plan.md (additive soft-cap + gold-gated lane; clone targets named)
  - **Evidence**: plan ARCHITECTURE clones the surface-mismatch soft cap and the hubRoute/toolSurface gold-gated lane; `loadCommandMetadata`, `scoreCommandRecipe`, `reduceRecipeMiss` named
- [x] CHK-003 [P1] Pre-change baseline captured (hubRoute pass/known-gap/regression tally, Vitest green, D2/D3 aggregate on sk-design fixtures)
  - **Evidence**: hubRoute 28 routeRows / 23 pass / 5 known-gap / 0 regression captured before edits

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Change confined to the scenario scorer file plus additive fixtures/tests; no shared-gate or surface-check edits
  - **Evidence**: change set is `score-skill-benchmark.cjs` + `skill-benchmark.vitest.ts` + four recipe-only fixtures; `command-metadata.json`, `design-command-surface-check.mjs`, `router-replay.cjs`, `mode-registry.json` untouched
- [x] CHK-011 [P0] Fix-completeness — the recipe lane is wired, the cap clamps BOTH D2 and D3, `recipeMissRate` reducer emitted, the `recipe-invalid` funnel stage wired, and the new scorer + reducer exported (no stubs/placeholders)
  - **Evidence**: `scoreCommandRecipe` runs before the D2 lane; `recipeCapped` clamps `d2.score` and `d3.score` to `0.25`; `reduceRecipeMiss`/`recipeMissRate` surfaced; `recipe-invalid` stage in the failing-stage order; `scoreCommandRecipe`/`reduceRecipeMiss`/`loadCommandMetadata`/`RECIPE_INVALID_CAP` exported
- [x] CHK-012 [P1] `command-metadata.json` loader is cached and degrades safely (parse failure / absent file → non-applicable, no throw)
  - **Evidence**: `loadCommandMetadata` caches at module scope; absent/unparseable metadata yields a non-applicable lane, no throw
- [x] CHK-013 [P1] Cap follows the existing soft-cap precedent (clamp, not zero; no new hard verdict gate); ceiling justified
  - **Evidence**: `RECIPE_INVALID_CAP = 0.25` clamps via `Math.min`, not zero; not in the verdict cascade; `0` BLOCKED/hardGate matches

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance met — a missing/invalid-recipe fixture scores a capped D2/D3; a valid-recipe fixture passes uncapped
  - **Evidence**: invalid+missing → `{applicable:true, valid:false, firstFailingStage:"recipe-invalid"}`, D2/D3 clamped to `0.25`; valid → `{applicable:true, valid:true}` uncapped (orchestrator-verified, no pipe-masking)
- [x] CHK-021 [P0] No-recipe-gold negative control is byte-identical to baseline (`applicable:false`, no cap)
  - **Evidence**: negative control → `{applicable:false, valid:true}`, no cap; D2/D3 byte-identical to baseline → zero regression (the no-gold guard)
- [x] CHK-022 [P1] An undefined/invalid recipe reports `valid:false` with the correct first failing stage and miss reasons
  - **Evidence**: capped fixtures report `firstFailingStage:"recipe-invalid"` with a populated `missReasons` list
- [x] CHK-023 [P1] `reduceRecipeMiss` rate math verified; scoring the fixtures emits `recipeMissRate`
  - **Evidence**: `reduceRecipeMiss` aggregates per-scenario recipe misses into `recipeMissRate`, surfaced under advisory-signals/run-quality; Vitest asserts the rate math

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Every spec acceptance criterion is met
  - **Evidence**: SC-001..003 hold — the verified matrix, the no-gold guard, `recipeMissRate`, the soft cap, and the unchanged hubRoute headline are all confirmed
- [x] CHK-061 [P0] The cap actually clamps unearned credit (not just records a flag)
  - **Evidence**: `recipeCapped` lowers both `d2.score` and `d3.score` to `0.25` via `Math.min`; the invalid and missing fixtures show the clamp applied
- [x] CHK-062 [P1] No partial lane — the lane, the cap, the funnel stage, the reducer, the normalizer extension, and the exports all shipped together
  - **Evidence**: `scoreCommandRecipe`, the D2/D3 clamp, the `recipe-invalid` stage, `reduceRecipeMiss`/`recipeMissRate`, the recipe-gold normalizer, and the four new exports are all present
- [x] CHK-063 [P1] Rollback path validated as clean
  - **Evidence**: change is additive (scorer + tests + fixtures); revert restores byte-identical scoring; no data migration

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] hubRoute pass/known-gap/regression tally unchanged from baseline (28 routeRows / 23 pass / 5 known-gap / 0 regression)
  - **Evidence**: the four fixtures are recipe-only (no `workflowMode`/`routeOutcome`), so they are not hubRoute-applicable; hubRoute 28/23/5/0 unchanged; `design-token-lint.vitest.ts` 28/23 needs no update
- [x] CHK-031 [P0] Existing Vitest suite green; verdict cascade unchanged (no new BLOCKED verdict)
  - **Evidence**: `0` BLOCKED/hardGate matches; the recipe cap is a soft clamp outside the verdict cascade; `node --check` clean
- [x] CHK-032 [P1] The wrapper-drift sub-check mirrors, does not modify, the surface checker
  - **Evidence**: `design-command-surface-check.mjs` untouched; the recipe lane reads the projection via `loadCommandMetadata` only

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the final scorer shape
  - **Evidence**: all three reflect `scoreCommandRecipe`, `RECIPE_INVALID_CAP=0.25`, the D2/D3 clamp, the `recipe-invalid` stage, and `recipeMissRate`
- [x] CHK-041 [P1] Honest enforcement note recorded — code-enforced (recipe presence/parse/schema and the D2/D3 clamp) vs advisory residual (whether the choreography was executed well)
  - **Evidence**: spec OPEN QUESTIONS and `implementation-summary.md` Known Limitations record the presence/witness-enforceable vs execution-quality-advisory split
- [x] CHK-042 [P2] Evergreen — docs carry no ephemeral artifact IDs, spec-folder paths, phase numbers, or stale line numbers; code structures referenced by name
  - **Evidence**: docs reference `score-skill-benchmark.cjs` structures by name (no line numbers); evergreen scan of the edited code clean

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: no temp artifacts written outside the scorer, the Vitest file, and the four fixtures
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: working tree limited to the in-scope change set; no scratch residue

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification against the scorer, the Vitest file, and the four recipe-only fixtures)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
