---
title: "Implementation Plan: Standing route-gold corpus + minimal pairs"
description: "Extend the private gold schema with route fields and author sk-design alias/holdout/adversarial fixtures the gated hubRoute stage scores against."
trigger_phrases:
  - "route gold corpus plan"
  - "sk-design routing fixtures"
  - "minimal pair fixtures"
  - "hub-router replay corpus"
importance_tier: "normal"
contextType: "planning"
---
# Implementation Plan: Standing route-gold corpus + minimal pairs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON fixtures (public/private pairs) + Node CJS verification |
| **Router under test** | `.opencode/skills/sk-design/hub-router.json` (projected by `router-replay.cjs`) |
| **Replay/lint tools** | `router-replay.cjs`, `contamination-lint.cjs` (`lintFixture` export) |
| **Corpus root** | `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/` (new) |

### Overview
Add four route fields to the scorer-only private gold (`expected.workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, `minimalPairGroup`) and author a standing sk-design fixture set in three tiers: alias (each mode's aliases route to that mode), holdout (hint-free domain prompts), and adversarial minimal pairs (near-identical prompts that flip mode or silent-default). Routing is verified deterministically by replaying every fixture through `router-replay.cjs` against `hub-router.json`; hint-freeness is gated by reusing the contamination lint with an identity-scoped vocabulary. This corpus is the standing gold the next-phase gated `hubRoute` stage scores against; that scorer is NOT built here.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Router source confirmed: sk-design has no inline `INTENT_SIGNALS`/`RESOURCE_MAP`, so `router-replay.cjs` falls back to `hub-router.json` projection (5 modes, weight 4, ambiguity delta 1)
- [x] Real fixture corpus root located (`assets/skill_benchmark/fixtures/`); no `sk-design/` dir exists yet
- [x] Route-vs-lint tension identified and resolved (identity-scoped lint vocab; see §3)
- [x] All 21 candidate prompts empirically replayed against the live router

### Definition of Done
- [ ] Private gold schema extended with the four route fields + documented shape
- [ ] Alias, holdout, and adversarial minimal-pair fixtures authored under the corpus root
- [ ] Every must-pass fixture routes correctly under `router-replay.cjs`; forbidden modes never selected
- [ ] Contamination lint (identity-scoped) reports clean on every public prompt
- [ ] No spec/packet/phase IDs or spec paths embedded in any fixture or schema-doc file

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Public/private fixture pairs (legacy Mode A corpus) keyed by scenario id, one new `sk-design/` skill directory. Gold lives only in `*.private.json`; the dispatch-boundary half (`*.public.json`) carries the prompt.

### Schema extension (exact location + shape)
Add to each `*.private.json` `expected` block (alongside the existing `skillId`/`mode`):

```jsonc
"expected": {
  "workflowMode": "interface",                 // one of: interface|foundations|motion|audit|md-generator
  "routeOutcome": "single",                    // single | orderedBundle | defer
  "forbiddenWorkflowModes": ["audit"],         // modes that MUST NOT appear in the route
  "minimalPairGroup": "mp-ui-redesign-vs-review" // shared id across a pair; null for non-paired fixtures
}
```
`orderedBundle` carries `workflowMode` as an ordered array (top-ranked first, honoring `routerPolicy.tieBreak`). Document the field shape in `scenario_authoring.md` §2 (fixture structure) so the contract is discoverable; do NOT name any spec/packet/phase id in that doc.

### Route-vs-lint reconciliation (the load-bearing decision)
`router-replay.cjs` routes by lowercased-substring keyword match; the full `contamination-lint.cjs buildBannedVocab()` bans the SAME router keywords (it pulls `parseRouter` keywords for sk-design, which projects every hub-router alias). Running the full CLI would flag the very alias keywords the router needs, making "routes correctly AND lint clean" unsatisfiable. Resolution: the routing-corpus gate reuses the exported `lintFixture({ publicText, bannedVocab })` with an IDENTITY-scoped vocab only — `sk-design`, the five mode names, and resource path basenames from `routerSignals[*].resources` — matching the brief's contract ("no skill/mode names leaked"). Domain keywords are the legitimate routing surface. Alias prompts additionally avoid mode-name substrings, so they stay clean even under identity vocab.

### Data flow (verification)
1. Public prompt fed to `router-replay.cjs --skill sk-design --task "<prompt>"`.
2. Replay projects `hub-router.json` → mode-keyed intents → substring scores → selected intents.
3. Selected intents compared to private `expected.workflowMode`/`routeOutcome`; `forbiddenWorkflowModes` checked absent.
4. Public prompt fed to identity-scoped `lintFixture` → must report `passed: true`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema extension
- [ ] Add `workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`minimalPairGroup` to the private `expected` shape
- [ ] Document the shape in `scenario_authoring.md` §2 (no embedded IDs/paths)

### Phase 2: Author fixtures (all empirically grounded below)
- [ ] **Alias (single, T1)** — one per mode: `make it look good`→interface, `oklch palette`→foundations, `micro-interactions`→motion, `production hardening`→audit, `capture website css`→md-generator
- [ ] **Adversarial minimal pairs (T3)** — must-pass-now: `redesign the ui`→interface / `review the ui`→audit (group `mp-ui-redesign-vs-review`); `ui build`→interface / `ui critique`→audit (group `mp-ui-build-vs-critique`); `design tokens`→foundations `single` (forbidden md-generator) / `design tokens from url`→`orderedBundle` [foundations, md-generator] (group `mp-tokens-single-vs-bundle`)
- [ ] **Adversarial silent-default pair (T3, standing gap)** — the brief's canonical pair: `animate the menu`→motion (routes now) / `redesign the menu`→interface gold but currently routes `[]` (group `mp-menu-animate-vs-redesign`); recorded as standing gap, NOT a this-phase gate
- [ ] **Holdout (T2, hint-free)** — gold = correct mode, current routing recorded: `fix the visual hierarchy of the dashboard`→foundations (routes now); `tune the easing so the drawer feels less abrupt when it opens`→motion gold/`[]` now; `this landing page feels generic and templated; give it a point of view`→interface gold/`[]` now; `go over the checkout screen and list what is broken or sloppy`→audit gold/`[]` now; `pull the visual styling off this live site into a reusable spec`→md-generator gold/`[]` now

### Phase 3: Verification
- [ ] Replay every fixture through `router-replay.cjs`; record intents per fixture
- [ ] Assert must-pass fixtures land on `expected.workflowMode`; pairs land on distinct outcomes; forbidden modes absent
- [ ] Run identity-scoped contamination lint on every public prompt → all clean
- [ ] Confirm no spec/packet/phase IDs or paths in any corpus/schema file

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Routing replay | Every fixture prompt → intents vs `expected.workflowMode`/`routeOutcome`/forbidden | `router-replay.cjs` |
| Minimal-pair flip | Paired prompts route to distinct outcomes (or recorded silent-default for the gap pair) | `router-replay.cjs` |
| Contamination | Public prompts free of skill id + 5 mode names + resource basenames | `lintFixture` (identity vocab) |
| Evergreen lint | grep corpus + schema doc for spec/packet/phase IDs and `.opencode/specs/` paths | `rg` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `hub-router.json` | Internal | Green | No routing target to score against |
| `router-replay.cjs` | Internal | Green | Cannot verify fixture routing |
| `contamination-lint.cjs` (`lintFixture`) | Internal | Green | Cannot gate hint-freeness |
| `scenario_authoring.md` | Internal | Green | Schema shape undocumented |
| D3-R2 gated `hubRoute` scorer | Internal | Not built (next phase) | Corpus is consumed there; coupling noted, not built here |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fixtures fail to route as gold, or contamination lint flags a leak that cannot be paraphrased away
- **Procedure**: Remove the new `fixtures/sk-design/` directory and revert the `scenario_authoring.md` schema edit; the existing corpus and scorer are untouched (additive-only)

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema) ──> Phase 2 (Author fixtures) ──> Phase 3 (Verify routing + lint)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema | None | Author fixtures |
| Author fixtures | Schema | Verify |
| Verify | Author fixtures | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema extension + doc | Low | 45 minutes |
| Author fixtures (≈16 scenarios) | Medium | 2-3 hours |
| Verification (replay + lint + evergreen grep) | Low | 1 hour |
| **Total** | | **3.75-4.75 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Existing corpus + `score-skill-benchmark.cjs` confirmed untouched (additive-only change)
- [ ] New `sk-design/` directory is the only fixture mutation
- [ ] Schema-doc edit is confined to `scenario_authoring.md` §2

### Rollback Procedure
1. **Remove**: delete `assets/skill_benchmark/fixtures/sk-design/`
2. **Revert doc**: undo the `scenario_authoring.md` §2 schema addition
3. **Verify**: existing fixtures still load; `router-replay.cjs` unchanged
4. **Notify**: flag to the D3-R2 owner that the gold corpus was rolled back

### Data Reversal
- **Has data migrations?** No (static JSON gold only)
- **Reversal procedure**: directory delete + single doc revert; no DB/state to unwind

<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Schema extension + fixture set + route-vs-lint reconciliation
- All example prompts empirically replayed against the live hub-router
-->
