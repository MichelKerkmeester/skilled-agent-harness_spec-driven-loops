---
title: "D6-R3 — Lane C craft-stress fixtures"
description: "Grow the sk-design route-gold corpus with six craft-stress scenarios (3 T2 holdout primaries + 3 T1 derived twins = 12 fixtures) across stateful-upload, dense-dashboard, and locale-component, each carrying the route-gold expected block (workflowMode / routeOutcome / forbiddenWorkflowModes / minimalPairGroup), reconciling the headline guard in-phase from 28/23 to 34/29 and holding 5 known-gaps / 0 regressions."
trigger_phrases:
  - "d6-r3 lane c craft fixtures"
  - "craft stress fixtures design build"
  - "sk-design route gold corpus grow"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/003-lane-c-craft-stress-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and record proof-fields-fork + corpus-growth rules"
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
# D6-R3 — Lane C craft-stress fixtures

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
| **Enforcement class** | enforceable |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D3 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design route-gold corpus scored 28 route rows with 23 passing, and it never stressed the harder real-world craft surfaces. designer-skills-main isolated three of them — component state, layout density, and localization — that sk-design covers in prose but does not exercise in the benchmark. Without gold-scored scenarios for those surfaces, the router can silently mis-route a stateful, dense, or localized brief and nothing in the corpus catches it.

### Purpose
Grow the existing per-skill route-gold corpus in place with six craft-stress scenarios — `stateful-upload`, `dense-dashboard`, and `locale-component`, each as a T2 holdout primary plus a T1 derived twin — so each forces a specific design workflow-mode bundle and is scored by the same `hubRoute` stage as the existing rows. Every scenario carries the route-gold `expected` block (`workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, `minimalPairGroup`); no new proof token is introduced. The growth is additive: it may only add to the pass bucket or the known-gap bucket, never flip a prior gold row. The phase that grows the corpus also reconciles the headline guard in `design-token-lint.vitest.ts`, so the new 34/29/5/0 tally becomes the baseline later phases preserve.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author three T2 holdout public/private pairs (`stateful-upload`, `dense-dashboard`, `locale-component`) under the sk-design fixture root, each with the route-gold `expected` block
- Author three T1 derived twins (paraphrased + decontaminated) to publish the T1↔T2 circularity meter
- Reconcile the route-gold headline guard in `design-token-lint.vitest.ts` from `toHaveLength(28)`/`passed.toBe(23)` to `toHaveLength(34)`/`passed.toBe(29)`, holding `knownGaps` 5 and `regressions` 0

### Out of Scope
- Any change to `score-skill-benchmark.cjs`, `router-replay.cjs`, or the existing fixtures — this is additive growth, not a scorer or corpus rewrite
- A separate `DESIGN_BOUNDARY_PROOF` proof token — the proof-fields fork resolved to the existing route-gold `expected` block
- A sibling corpus directory — growing `fixtures/sk-design/` in place is the spec-faithful path
- Tuning the router so a known-gap scenario flips to pass — known gaps are recorded, not chased here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `…/fixtures/sk-design/sk-design-craft-stateful-upload-holdout-001.{public,private}.json` | Create | T2 holdout pair for the component-state surface; route-gold `expected` block |
| `…/fixtures/sk-design/sk-design-craft-stateful-upload-derived-001.{public,private}.json` | Create | T1 derived twin for stateful-upload |
| `…/fixtures/sk-design/sk-design-craft-dense-dashboard-holdout-001.{public,private}.json` | Create | T2 holdout pair for the layout-density surface |
| `…/fixtures/sk-design/sk-design-craft-dense-dashboard-derived-001.{public,private}.json` | Create | T1 derived twin for dense-dashboard |
| `…/fixtures/sk-design/sk-design-craft-locale-component-holdout-001.{public,private}.json` | Create | T2 holdout pair for the localization surface |
| `…/fixtures/sk-design/sk-design-craft-locale-component-derived-001.{public,private}.json` | Create | T1 derived twin for locale-component |
| `…/scripts/skill-benchmark/tests/design-token-lint.vitest.ts` | Modify | Reconcile the route-gold headline guard: `toHaveLength(28)→(34)`, `passed.toBe(23)→(29)`; `knownGaps`/`regressions` unchanged at 5/0 |
| `…/scripts/skill-benchmark/score-skill-benchmark.cjs` | Unchanged | Scorer is reused as-is; not edited |
| `…/scripts/skill-benchmark/router-replay.cjs` | Unchanged | Replay tool is reused as-is; not edited |

The fixture root is `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/`.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author all three named craft surfaces | `stateful-upload`, `dense-dashboard`, and `locale-component` each ship a T2 holdout pair; no partial set |
| REQ-002 | Every fixture uses the route-gold `expected` schema | Each private fixture declares `workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, and `minimalPairGroup`, consistent with the existing corpus; no `DESIGN_BOUNDARY_PROOF` token |
| REQ-003 | No regression against the prior floor | The prior 23 pass rows still pass; the 5 known-gaps are unchanged; `regressions === 0` — no prior gold row flips |
| REQ-004 | Reconcile the headline guard in-phase | `design-token-lint.vitest.ts` asserts `toHaveLength(34)` and `passed.toBe(29)` with `knownGaps` 5 and `regressions` 0; the guard passes against the grown corpus |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Publish the T1↔T2 circularity meter | Each surface ships a T1 derived twin (paraphrased + decontaminated); the T1↔T2 score gap is computed and within authoring bounds |
| REQ-006 | Stay additive and evergreen | Existing fixtures, `score-skill-benchmark.cjs`, and `router-replay.cjs` untouched; no spec/packet/phase IDs in any fixture |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The route-gold headline recomputed via the vitest aggregate path returns `routeRows=34`, `passed=29`, `knownGaps=5`, `regressions=0`, matching the updated guard assertion.
- **SC-002**: The six new scenarios added exactly 6 rows and 6 passes (28→34 rows, 23→29 pass); the prior 23 pass rows and the 5 known-gaps are unchanged, and no prior gold row flipped.
- **SC-003**: Every new fixture JSON parses; the change set is the twelve new fixtures plus the single guard assertion only; `score-skill-benchmark.cjs` and `router-replay.cjs` are untouched; and the evergreen scan is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Logic-sync | Spec wrote "proof fields"; the corpus already scores a route-gold `expected` block | A separate `DESIGN_BOUNDARY_PROOF` token would add a second proof surface the scorer does not read | **Resolved: use the route-gold `expected` block.** `workflowMode` / `routeOutcome` / `forbiddenWorkflowModes` / `minimalPairGroup` is the proof the `hubRoute` stage enforces |
| Logic-sync | Growing the corpus changes the headline the guard asserts | A guard left at 28/23 fails against a corpus it no longer describes | **Resolved: corpus-growth-must-update-the-guard.** The phase that adds route-gold fixtures reconciles the headline assertion in the same phase (28/23 → 34/29) |
| Risk | The new headline becomes a moving target for later phases | Later phases could drift the floor without noticing | **Resolved: 34/29/5/0 is the new baseline.** It grew by exactly the six clean passes; `knownGaps`/`regressions` held at 5/0, so it is a stable floor to preserve |
| Risk | Whether the three surfaces are the right stress set is judgment | The gate proves route conformance, never that the craft set is complete or hardest | Documented honesty: route conformance is enforceable; curation of the stress set stays advisory |
| Risk | A new fixture could flip a prior gold row | A regression would break the 0-regression invariant | Additive-only: a new scenario is set to clean-pass or `knownRouteGap: true`; verification confirms `regressions === 0` before completion |
| Dependency | `score-skill-benchmark.cjs` `scoreHubRoute` + `router-replay.cjs` | Green | Reused as-is to route and score; not edited |
| Dependency | `design-token-lint.vitest.ts` route-gold guard | Green | The no-regression enforcement point; reconciled in-phase |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The growth is additive only — no existing fixture, `score-skill-benchmark.cjs`, or `router-replay.cjs` is mutated, and no prior gold row flips.
- **NFR-I02**: The corpus stays homogeneous — every new fixture reuses the route-gold `expected` schema, so the same `hubRoute` stage scores old and new rows identically.

### Consistency
- **NFR-C01**: The corpus and its headline guard stay in lockstep — the phase that grows the corpus reconciles the guard's `toHaveLength` and `passed` numerics in the same change, so the two cannot drift apart.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Gold setting
- **Clean route**: a prompt that admits to its intended router key is set to clean-pass and adds to the pass bucket.
- **Silent default**: a prompt the router returns `[]` for is set to `knownRouteGap: true` and adds to the known-gap bucket, not the regression bucket.
- **Forbidden hit**: a routed mode that lands in `forbiddenWorkflowModes` fails `scoreHubRoute`; the gold is fixed until the scenario routes cleanly or is recorded as a known gap.

### No-regression
- **Prior row flip**: any new fixture that flips a prior gold row from pass to fail raises `regressions` above 0 and blocks; the offending pair is removed.
- **Headline mismatch**: if the recomputed tally does not equal `toHaveLength(34)`/`passed.toBe(29)`, the guard fails and the corpus or the assertion is reconciled before completion.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Thirteen artifacts — twelve new fixture files (three surfaces × two tiers × public/private) and one guard assertion. The scorer, the replay tool, and the existing corpus are read-only inputs.
- **Risk concentration**: The only judgment-bearing surface is the *choice and prompt content* of each craft scenario; everything else (route conformance, the no-regression tally, the headline reconcile) is structural and the scorer plus the guard bite on it. The blast radius is the sk-design route-gold corpus only.

<!-- /ANCHOR:complexity -->
---

## 7. OPEN QUESTIONS

- Did "proof fields" mean a separate `DESIGN_BOUNDARY_PROOF` token? **RESOLVED: No.** The corpus already scores a route-gold `expected` block (`workflowMode` / `routeOutcome` / `forbiddenWorkflowModes` / `minimalPairGroup`) through the `hubRoute` stage; the new fixtures reuse it, so no second proof surface is introduced.
- Must the headline guard be updated in the same phase that grows the corpus? **RESOLVED: Yes.** The corpus-growth contract makes the growing phase own the headline assertion it changes; the guard moved from 28/23 to 34/29 in-phase, with `knownGaps`/`regressions` held at 5/0.
- Is 34/29/5/0 a moving target or a baseline? **RESOLVED: Baseline.** It grew by exactly the six clean new passes and the known-gap/regression counts held, so later phases preserve it as a floor rather than recomputing from scratch.

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
- Additive corpus growth: 6 craft-stress route-gold scenarios (12 fixtures) across stateful-upload, dense-dashboard, locale-component (3 T2 holdout + 3 T1 derived)
- Proof-fields fork resolved to the route-gold expected block (workflowMode / routeOutcome / forbiddenWorkflowModes / minimalPairGroup), NOT a DESIGN_BOUNDARY_PROOF token
- Logic-syncs recorded in RISKS/OPEN QUESTIONS: corpus-growth-must-update-the-guard; 34/29/5/0 is the new baseline
- Enforcement split: route conformance + no-regression tally enforceable, craft-stress-set curation advisory; GENERATED_METADATA regenerated by the orchestrator
-->
