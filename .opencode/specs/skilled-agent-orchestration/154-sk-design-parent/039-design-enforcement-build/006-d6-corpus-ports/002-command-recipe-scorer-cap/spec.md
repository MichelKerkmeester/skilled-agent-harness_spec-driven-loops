---
title: "D6-R2 — commandRecipe scorer adapter (D2/D3 cap)"
description: "Insert a gold-gated commandRecipe validity lane into the Lane C scenario scorer that clamps D2 and D3 to a 0.25 RECIPE_INVALID_CAP when a command recipe is undefined or invalid, surfaces recipeMissRate, and stays a soft cap (no hard verdict gate) with a no-gold guard that keeps no-recipe scenarios byte-identical."
trigger_phrases:
  - "d6-r2 command recipe scorer cap"
  - "command recipe design build"
  - "commandRecipe d2 d3 cap"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/002-command-recipe-scorer-cap"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record D2/D3 0.25 cap, no-gold guard, and soft-cap-not-hard-gate split in spec"
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
# D6-R2 — commandRecipe scorer adapter (D2/D3 cap)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable (presence/witness) |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D2, D3 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sibling command-recipe projection (D6-R1) landed a typed `argumentGrammar` and an ordered `choreography[]` on the sk-design command surface, but a recipe that is missing or malformed was still free-floating data: the Lane C skill-benchmark scorer awarded D2 (command specificity / discovery) and D3 (routing utilization / efficiency) credit without ever asking whether the command actually carried a valid recipe. A projection nobody scores against can rot silently.

### Purpose
Insert a deterministic `commandRecipe` validity lane into the per-scenario scorer that runs **before the D2 resource-recall lane** and clamps both D2 and D3 to a `RECIPE_INVALID_CAP` of `0.25` when a command's recipe is undefined or fails validation. The lane is additive and gold-gated: it mirrors the existing soft-cap precedent and the existing gold-gated lane pattern, so any scenario that carries no recipe gold returns `applicable:false`, applies no cap, and scores byte-identically to today. The cap is a **soft cap** — it clamps a dimension score, it does not add a hard verdict gate — and it surfaces a `recipeMissRate` advisory signal so a missing recipe becomes a *measurable* scoring failure instead of unearned credit.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `commandRecipe` lane in `score-skill-benchmark.cjs`: `scoreCommandRecipe({ expected, skillRoot, routerResult })` returning `{ applicable, valid, firstFailingStage, missReasons[] }`, evaluated before the resource-recall (D2) lane.
- `RECIPE_INVALID_CAP = 0.25` clamping both `d2.score` and `d3.score` (tagging each `recipeCapped:true`) when the lane is `applicable && !valid`.
- A cached `loadCommandMetadata(skillRoot)` loader that degrades safely (absent/unparseable metadata yields a non-applicable lane rather than a throw).
- A `recipe-invalid` stage wired into the failing-stage order map and the first-failing-stage resolver.
- `reduceRecipeMiss(rows)` producing `recipeMissRate`, surfaced under the advisory-signals block and the run-quality block (never folded into the weighted aggregate).
- Recipe-gold extension in the scenario-gold normalizers; new `scoreCommandRecipe`, `reduceRecipeMiss`, `loadCommandMetadata`, and `RECIPE_INVALID_CAP` exports.
- Vitest coverage in `skill-benchmark.vitest.ts` plus four recipe-only fixture pairs under `fixtures/sk-design/` (valid, invalid, missing, no-recipe negative control).

### Out of Scope
- The command-recipe **projection** itself (`argumentGrammar` + `choreography[]` on the SSOT) — owned by sibling phase 001.
- Any **hard verdict gate** for recipe validity — the cap is intentionally soft and stays out of the verdict cascade.
- The `nextOptions[]` handoff grammar (sibling 007) and the broader structural drift audit (sibling 008).
- Judging whether the choreography was *executed well* — only presence/witness of a valid recipe is provable here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Add `RECIPE_INVALID_CAP`, `loadCommandMetadata`, `scoreCommandRecipe`, the D2/D3 clamp, the `recipe-invalid` funnel stage, `reduceRecipeMiss` / `recipeMissRate`, the recipe-gold normalizer extension, and the new exports |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | Add recipe-lane unit tests (sub-check pass/fail, the cap clamp on both D2 and D3, the no-gold guard, `reduceRecipeMiss` math) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/` | Add | Four recipe-only fixture pairs: valid, invalid, missing, no-recipe negative control |
| `command-metadata.json`, `design-command-surface-check.mjs`, `router-replay.cjs`, `mode-registry.json` | Unchanged | Read-only references; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recipe lane before the D2 lane | `scoreCommandRecipe` runs ahead of resource-recall and returns `{ applicable, valid, firstFailingStage, missReasons[] }` |
| REQ-002 | Cap clamps BOTH D2 and D3 | When the lane is `applicable && !valid`, `d2.score` and `d3.score` are each clamped to `0.25` and tagged `recipeCapped:true` |
| REQ-003 | No-gold guard | A scenario with no recipe gold returns `applicable:false`, applies no cap, and scores byte-identically to the pre-change baseline |
| REQ-004 | Soft cap, not a hard gate | The cap stays out of the verdict cascade; no new BLOCKED/hardGate verdict is introduced |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `recipeMissRate` surfaced | `reduceRecipeMiss` emits `recipeMissRate` under advisory-signals and run-quality; it is never folded into the weighted aggregate |
| REQ-006 | Routing headline untouched | The four fixtures are recipe-only (no `workflowMode`/`routeOutcome`), so hubRoute holds at 28 routeRows / 23 pass / 5 known-gap / 0 regression and no routing-headline doc needs an update |
| REQ-007 | Evergreen + safe degrade | `loadCommandMetadata` is cached and degrades on absent/unparseable metadata; no spec/packet/phase id in any edited code comment |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Scoring the four fixtures yields the verified matrix — valid → `{applicable:true, valid:true}` (D2/D3 uncapped); invalid and missing → `{applicable:true, valid:false, firstFailingStage:"recipe-invalid"}` with D2 and D3 clamped to `0.25`.
- **SC-002**: The no-recipe negative control returns `{applicable:false, valid:true}`, applies no cap, and leaves D2/D3 byte-identical to baseline — zero regression (the no-gold guard).
- **SC-003**: `recipeMissRate` is surfaced; the recipe cap adds **no** hard verdict gate (`0` BLOCKED/hardGate matches), the recipe-only fixtures keep hubRoute at 28/23/5/0 unchanged, `node --check` passes, and `command-metadata.json` / `design-command-surface-check.mjs` / `router-replay.cjs` / `mode-registry.json` stay untouched with the evergreen scan clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A soft cap could be mistaken for a hard verdict gate | A reader might assume an invalid recipe BLOCKS the run | **Resolved: soft cap only.** The clamp lowers `d2.score`/`d3.score` to `0.25`; it is not in the verdict cascade. `0` BLOCKED/hardGate matches confirm it |
| Risk | The cap could bite scenarios that legitimately carry no recipe | False penalty + regression on unrelated fixtures | **Resolved: no-gold guard.** `applicable:false` when no recipe gold is present; the negative control is byte-identical to baseline (zero regression) |
| Risk | Recipe-only fixtures could perturb the routing headline | hubRoute tally drift would force a routing-doc update | **Resolved.** The four fixtures carry no `workflowMode`/`routeOutcome`, so they are not hubRoute-applicable; hubRoute holds 28/23/5/0 and the routing headline needs no edit |
| Risk | The lane can only witness presence, not execution quality | Overclaiming would imply the gate certifies good design | **Documented honesty:** recipe presence/parse/schema and the D2/D3 clamp are enforceable; whether the choreography was executed *well* stays advisory |
| Dependency | sk-design `command-metadata.json` recipe projection (sibling 001) | In place | Lane reads it via `loadCommandMetadata`; absent metadata degrades to `applicable:false` |
| Dependency | Node runtime + Vitest harness + the gated hubRoute lane | Green | Required to run the scorer and the no-regression delta; no new packages |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The lane is additive only — no existing scorer dimension, reducer, or verdict path is removed or mutated, and the four referenced surfaces (`command-metadata.json`, `design-command-surface-check.mjs`, `router-replay.cjs`, `mode-registry.json`) stay untouched.
- **NFR-I02**: `recipeMissRate` is surfaced as an advisory signal under advisory-signals and run-quality and is never folded into the weighted aggregate, so the headline score math is unchanged for every existing scenario.

### Reliability
- **NFR-R01**: `loadCommandMetadata` is cached at module scope and degrades safely — an absent or unparseable `command-metadata.json` yields a non-applicable lane rather than a throw, so the scorer never crashes on a missing projection.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Recipe validity
- **Undefined recipe**: a scenario whose command has no defined recipe is `applicable:true, valid:false` with `firstFailingStage:"recipe-invalid"`; D2/D3 are clamped (the *missing* fixture).
- **Malformed recipe**: a scenario with a present-but-invalid recipe is `applicable:true, valid:false`; D2/D3 are clamped (the *invalid* fixture).
- **Valid recipe**: `applicable:true, valid:true`; no clamp, D2/D3 uncapped (the *valid* fixture).

### Gold gating
- **No recipe gold**: a scenario without recipe gold is `applicable:false, valid:true`; no clamp, byte-identical to baseline (the negative control).
- **Absent / unparseable metadata**: `loadCommandMetadata` returns no usable metadata, the lane degrades to non-applicable, and no cap is applied.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Three artifacts — one scorer (`score-skill-benchmark.cjs`: a constant, a cached loader, the `scoreCommandRecipe` lane, the D2/D3 clamp, the `recipe-invalid` funnel stage, the `reduceRecipeMiss` reducer, the normalizer extension, and the exports), one Vitest file, and four recipe-only fixture pairs.
- **Risk concentration**: The only judgment-bearing surface is whether a recipe was executed *well*, which the lane deliberately does not score. Everything the lane does score — recipe presence, parse, schema, the gold gate, and the clamp — is structural and deterministic. The blast radius is the Lane C scorer only; routing and the design command surface stay untouched.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should an invalid recipe BLOCK the run with a hard verdict gate? **RESOLVED: No.** The cap is a soft clamp on `d2.score`/`d3.score` (`RECIPE_INVALID_CAP = 0.25`) and stays out of the verdict cascade. `0` BLOCKED/hardGate matches confirm no hard gate leaked in; a missing recipe is penalized in the dimension scores and surfaced via `recipeMissRate`, not blocked.
- Should the cap apply whenever recipe gold is absent? **RESOLVED: No.** The lane is gold-gated: `applicable:false` when no recipe gold is present, so no-recipe scenarios are byte-identical to baseline and the negative control proves zero regression. The cap only bites when recipe gold is actually present and the recipe fails.
- Does the lane certify the choreography was executed well? **RESOLVED: No.** Only presence/witness of a valid recipe is provable — recipe presence, parse, schema, and the D2/D3 clamp are enforceable; execution quality (whether the choreographed sequence actually produced good design) stays advisory and is not scored.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Additive gold-gated commandRecipe lane in score-skill-benchmark.cjs; RECIPE_INVALID_CAP=0.25 clamps D2 and D3 when a recipe is undefined/invalid; recipeMissRate surfaced
- Verified matrix: valid {applicable:true,valid:true}; invalid+missing {applicable:true,valid:false,firstFailingStage:"recipe-invalid"} D2/D3 capped; negative control {applicable:false,valid:true} byte-identical (no-gold guard, zero regression)
- Soft cap (no hard verdict gate, 0 BLOCKED/hardGate); recipe-only fixtures keep hubRoute 28/23/5/0; command-metadata.json/design-command-surface-check.mjs/router-replay.cjs/mode-registry.json untouched
- Honest split: recipe presence/witness enforceable, execution quality advisory; GENERATED_METADATA regenerated by the orchestrator
-->
