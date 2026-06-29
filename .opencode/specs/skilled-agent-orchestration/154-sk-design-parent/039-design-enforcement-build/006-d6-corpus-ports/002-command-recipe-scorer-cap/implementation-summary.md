---
title: "Implementation Summary: commandRecipe Scorer Adapter (D2/D3 Cap)"
description: "Post-build record for the additive gold-gated commandRecipe lane in score-skill-benchmark.cjs: RECIPE_INVALID_CAP=0.25 clamping D2 and D3, the recipeMissRate reducer, the cached loadCommandMetadata loader, the recipe-invalid funnel stage, the four recipe-only fixtures, the verified applicable/valid/firstFailingStage matrix, the no-gold guard (byte-identical, zero regression), the soft-cap-not-hard-gate fact, the unchanged hubRoute 28/23/5/0 headline, and the recipe-presence-enforceable vs execution-quality-advisory split."
trigger_phrases:
  - "d6-r2 command recipe scorer cap implementation summary"
  - "commandRecipe d2 d3 cap recipeMissRate record"
  - "recipe-invalid soft cap no-gold guard summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/002-command-recipe-scorer-cap"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record commandRecipe cap, no-gold guard, recipeMissRate, and hubRoute-unchanged proof"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-command-recipe-scorer-cap |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverable** | `score-skill-benchmark.cjs` (the `commandRecipe` lane, `RECIPE_INVALID_CAP=0.25`, the D2/D3 clamp, `reduceRecipeMiss`/`recipeMissRate`, the cached `loadCommandMetadata`, the `recipe-invalid` funnel stage, the normalizer extension, and the new exports), `skill-benchmark.vitest.ts` (recipe-lane tests), and four recipe-only fixture pairs under `fixtures/sk-design/` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The sibling projection (D6-R1) gave each design command a typed `argumentGrammar` and an ordered `choreography[]`, but the benchmark still handed out D2 and D3 credit without ever checking whether a command carried a valid recipe. This phase closes that gap: a missing or malformed command recipe now lands as a measurable scoring failure instead of free-floating data. It does so safely — the lane only bites when recipe gold is actually present, the clamp is a soft cap rather than a hard verdict gate, and the recipe-only fixtures leave the routing headline exactly where it was.

This is an additive lane, not a rewrite. No existing scorer dimension, reducer, or verdict path was removed or mutated, and four referenced surfaces (`command-metadata.json`, `design-command-surface-check.mjs`, `router-replay.cjs`, `mode-registry.json`) were left untouched. The work touches only the Lane C scorer, its Vitest file, and four fixtures.

### The commandRecipe validity lane

`scoreCommandRecipe({ expected, skillRoot, routerResult })` runs in the per-scenario scorer **before the D2 resource-recall lane** and returns `{ applicable, valid, firstFailingStage, missReasons[] }`. When a scenario carries recipe gold and the recipe is undefined or fails validation, the lane reports `valid:false` with `firstFailingStage:"recipe-invalid"` and a populated `missReasons` list. When a scenario carries no recipe gold, the lane returns `applicable:false` — the gold gate that keeps no-recipe scenarios untouched. A cached `loadCommandMetadata(skillRoot)` reads the live recipe projection and degrades safely: absent or unparseable metadata yields a non-applicable lane rather than a throw.

### The 0.25 cap on D2 and D3

`RECIPE_INVALID_CAP = 0.25`. After D2 and D3 are computed, the scorer checks `dims.commandRecipe.applicable && !dims.commandRecipe.valid`; when that holds it clamps **both** `d2.score` and `d3.score` to the cap with `Math.min(...)` and tags each dimension `recipeCapped:true`. The clamp is a soft cap: it lowers two dimension scores, and it is deliberately **not** part of the verdict cascade, so an invalid recipe never produces a new BLOCKED verdict.

### recipeMissRate and the recipe-invalid funnel stage

`reduceRecipeMiss(rows)` aggregates the per-scenario recipe results into `recipeMissRate`, which is surfaced under the advisory-signals block and the run-quality block and is never folded into the weighted aggregate. A `recipe-invalid` stage was wired into the failing-stage order map and the first-failing-stage resolver so a capped scenario reports its failing stage in the funnel. The scenario-gold normalizers were extended to carry the recipe-gold fields, and `scoreCommandRecipe`, `reduceRecipeMiss`, `loadCommandMetadata`, and `RECIPE_INVALID_CAP` were added to the module exports for unit testing.

### The four recipe-only fixtures

Four fixture pairs under `fixtures/sk-design/` exercise the lane: a valid recipe (uncapped), an invalid recipe and a missing recipe (both capped), and a no-recipe negative control (the no-gold guard). They are intentionally recipe-only — they carry no `workflowMode`/`routeOutcome`, so they are not hubRoute-applicable and the routing headline does not move.

### Verified per-fixture matrix

| Fixture | `applicable` | `valid` | `firstFailingStage` | D2/D3 effect |
|---------|--------------|---------|---------------------|--------------|
| valid | true | true | (none) | uncapped |
| invalid | true | false | `recipe-invalid` | both clamped to `0.25` |
| missing | true | false | `recipe-invalid` | both clamped to `0.25` |
| no-recipe negative control | **false** | true | (none) | no cap — byte-identical to baseline |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modified | Add `RECIPE_INVALID_CAP`, cached `loadCommandMetadata`, `scoreCommandRecipe` (before the D2 lane), the `recipeCapped` D2/D3 clamp, the `recipe-invalid` funnel stage, `reduceRecipeMiss`/`recipeMissRate`, the recipe-gold normalizer extension, and the new exports |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modified | Add recipe-lane unit tests: sub-check pass/fail, the cap clamp on both D2 and D3, the no-gold guard, and `reduceRecipeMiss` math |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-command-recipe-valid.{public,private}.json` | Created | Valid-recipe fixture (D2/D3 uncapped) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-command-recipe-invalid.{public,private}.json` | Created | Invalid-recipe fixture (D2/D3 capped) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-command-recipe-missing.{public,private}.json` | Created | Missing-recipe fixture (D2/D3 capped) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-command-recipe-no-recipe-negative-control.{public,private}.json` | Created | No-recipe negative control (no cap, byte-identical) |

`command-metadata.json`, `design-command-surface-check.mjs`, `router-replay.cjs`, and `mode-registry.json` were left untouched.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 xhigh fast`) added the `commandRecipe` lane ahead of the D2 resource-recall lane, the `0.25` cap on both D2 and D3, the cached `loadCommandMetadata`, the `recipe-invalid` funnel stage, the `reduceRecipeMiss`/`recipeMissRate` reducer, the recipe-gold normalizer extension, and the new exports, plus the Vitest cases and the four recipe-only fixture pairs. The orchestrator then verified the result **independently, without pipe-masking**, by scoring the fixtures directly: the valid fixture returned `{applicable:true, valid:true}`; the invalid and missing fixtures returned `{applicable:true, valid:false, firstFailingStage:"recipe-invalid"}` with D2 and D3 clamped to `0.25`; and the no-recipe negative control returned `{applicable:false, valid:true}` with no cap and D2/D3 byte-identical to baseline — the no-gold guard, proving zero regression. `recipeMissRate` was confirmed surfaced. The cap was confirmed to add **no** hard verdict gate (`0` BLOCKED/hardGate matches; the recipe cap is not in the verdict cascade). Because the four fixtures are recipe-only (no `workflowMode`/`routeOutcome`), they are not hubRoute-applicable, so hubRoute held at 28 routeRows / 23 pass / 5 known-gap / 0 regression unchanged and the `design-token-lint.vitest.ts` 28/23 routing headline needed no update. `node --check` passed; `command-metadata.json`, `design-command-surface-check.mjs`, `router-replay.cjs`, and `mode-registry.json` were confirmed untouched; and the evergreen scan was clean. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live skill, script, or fixture file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the cap a soft clamp, not a hard verdict gate | An invalid recipe should cost discovery/efficiency credit, not halt the run. Clamping `d2.score`/`d3.score` to `0.25` keeps the penalty in the dimension scores and out of the verdict cascade, so `0` BLOCKED/hardGate matches |
| Gold-gate the lane with an `applicable` guard | The cap must only bite when recipe gold is actually present. Returning `applicable:false` for no-recipe scenarios keeps them byte-identical to baseline, which is what makes the negative control a true zero-regression control |
| Clamp BOTH D2 and D3, not just one | The recipe feeds both command specificity (D2) and routing utilization (D3); capping only one would leave half the unearned credit standing |
| Surface `recipeMissRate` as advisory, never in the aggregate | The miss rate is a run-quality signal, not a weighted score. Keeping it under advisory-signals/run-quality leaves every existing scenario's headline math unchanged |
| Author recipe-only fixtures with no route gold | Keeping the fixtures free of `workflowMode`/`routeOutcome` means they are not hubRoute-applicable, so the routing headline (28/23/5/0) stays put and no routing doc needs editing |
| Load `command-metadata.json` through a cached, safe-degrading loader | A missing or unparseable projection must not crash the scorer; degrading to a non-applicable lane keeps the benchmark resilient when the sibling projection is absent |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Valid fixture scores uncapped | PASS, `{applicable:true, valid:true}`; D2/D3 not clamped (orchestrator-verified, no pipe-masking) |
| Invalid + missing fixtures capped | PASS, `{applicable:true, valid:false, firstFailingStage:"recipe-invalid"}`; D2 and D3 both clamped to `0.25` |
| No-gold guard (negative control) | PASS, `{applicable:false, valid:true}`; no cap; D2/D3 byte-identical to baseline → zero regression |
| `recipeMissRate` surfaced | PASS, emitted by `reduceRecipeMiss` under advisory-signals and run-quality; not folded into the weighted aggregate |
| Soft cap, no hard verdict gate | PASS, `0` BLOCKED/hardGate matches; the recipe cap is not in the verdict cascade |
| hubRoute headline unchanged | PASS, recipe-only fixtures are not hubRoute-applicable; hubRoute holds 28 routeRows / 23 pass / 5 known-gap / 0 regression; `design-token-lint.vitest.ts` 28/23 needs no update |
| Script parse | PASS, `node --check` on `score-skill-benchmark.cjs` clean |
| Referenced surfaces untouched | PASS, `command-metadata.json`, `design-command-surface-check.mjs`, `router-replay.cjs`, `mode-registry.json` unchanged |
| Evergreen: no spec/packet/phase IDs in edited code | PASS, evergreen scan clean |
| Scope confined | PASS, change set limited to the scorer, the Vitest file, and the four recipe-only fixtures |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (`graph-metadata.json` source_fingerprint) | EXPECTED, `SOURCE_FINGERPRINT_MISMATCH`; the orchestrator regenerates the synopsis; this is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recipe presence/witness is enforceable; execution quality is not.** The lane proves a recipe is present, parseable, and schema-valid, and clamps D2/D3 when it is not. It cannot prove the choreography was actually *executed well* or that the sequence yields good design. That judgment stays advisory, and the docs say so.
2. **The cap is a soft clamp, not a hard gate.** An invalid recipe lowers `d2.score`/`d3.score` to `0.25`; it never produces a BLOCKED verdict. If a future phase wants recipe validity to be a hard gate, that is a separate, deliberate change to the verdict cascade.
3. **The cap only bites when recipe gold is present.** Scenarios without recipe gold are `applicable:false` and byte-identical to baseline. Until upstream gold actually carries recipes, the cap is dormant for those scenarios by design.
4. **The fixtures are recipe-only.** They exercise the lane in isolation and carry no `workflowMode`/`routeOutcome`, so they do not exercise the routing path and the hubRoute headline (28/23/5/0) is untouched.
5. **GENERATED_METADATA stays stale until the orchestrator regenerates it.** `graph-metadata.json` (`source_fingerprint`) is a generated artifact; this phase does not hand-write it, so `validate.sh --strict` reports `SOURCE_FINGERPRINT_MISMATCH` as an expected residual until a metadata save runs.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Additive gold-gated commandRecipe lane in score-skill-benchmark.cjs; RECIPE_INVALID_CAP=0.25 clamps D2 and D3; reduceRecipeMiss surfaces recipeMissRate under advisory-signals/run-quality
- Verified matrix: valid {applicable:true,valid:true}; invalid+missing {applicable:true,valid:false,firstFailingStage:"recipe-invalid"} D2/D3 capped; negative control {applicable:false,valid:true} byte-identical (no-gold guard, zero regression)
- Soft cap, no hard verdict gate (0 BLOCKED/hardGate); recipe-only fixtures keep hubRoute 28/23/5/0; command-metadata.json/design-command-surface-check.mjs/router-replay.cjs/mode-registry.json untouched; node --check clean; evergreen clean
- Honest split: recipe presence/witness enforceable, execution quality advisory; GENERATED_METADATA SOURCE_FINGERPRINT_MISMATCH regenerated by the orchestrator
-->
