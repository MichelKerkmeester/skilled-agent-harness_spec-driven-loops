---
title: "Verification Checklist: Standing route-gold corpus + minimal pairs"
description: "Verification evidence for the sk-design route-gold fixtures, schema extension, routing replay, contamination lint, and evergreen constraint."
trigger_phrases:
  - "route gold corpus checklist"
  - "sk-design fixtures verification"
  - "minimal pair checklist"
importance_tier: "normal"
contextType: "planning"
---
# Verification Checklist: Standing route-gold corpus + minimal pairs

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

- [ ] CHK-001 [P0] Schema extension documented in spec.md and plan.md
  - **Evidence**: `expected.workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`minimalPairGroup` shape captured in plan.md §3
- [ ] CHK-002 [P0] Real fixture corpus root confirmed
  - **Evidence**: `assets/skill_benchmark/fixtures/` is the root; new `sk-design/` subdir is the only fixture target
- [ ] CHK-003 [P1] Route-vs-lint reconciliation decided
  - **Evidence**: routing-corpus gate reuses `lintFixture` with identity-scoped vocab (skill id + 5 mode names + resource basenames), not full keyword vocab

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every fixture is a valid public/private JSON pair sharing one `scenarioId`
  - **Evidence**: each `*.public.json` has a matching `*.private.json` under `sk-design/`
- [ ] CHK-011 [P0] Private gold carries the four new route fields with valid enums
  - **Evidence**: `workflowMode` ∈ {interface,foundations,motion,audit,md-generator}; `routeOutcome` ∈ {single,orderedBundle,defer}
- [ ] CHK-012 [P1] `minimalPairGroup` shared across both arms of each pair; null otherwise
  - **Evidence**: pair members share one group id; alias/holdout fixtures use null
- [ ] CHK-013 [P1] Schema doc edit confined to `scenario_authoring.md` §2 (fixture structure)
  - **Evidence**: only the fixture-structure section gains the route fields

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Alias fixtures route to their mode (single) under `router-replay.cjs`
  - **Evidence**: interface/foundations/motion/audit/md-generator each land on `expected.workflowMode`
- [ ] CHK-021 [P0] Must-pass minimal pairs route to distinct outcomes
  - **Evidence**: `redesign the ui`→interface vs `review the ui`→audit; `ui build`→interface vs `ui critique`→audit; `design tokens`→foundations single vs `design tokens from url`→orderedBundle
- [ ] CHK-022 [P0] `forbiddenWorkflowModes` never selected in any fixture's route
  - **Evidence**: replay output shows zero forbidden-mode intents across the corpus
- [ ] CHK-023 [P1] Standing-gap fixtures recorded, not gated
  - **Evidence**: `redesign the menu` (interface gold) and the 4 hint-free holdouts route `[]` now; gold retained as the measure the gated `hubRoute` stage fails against

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Contamination lint clean on every public prompt
  - **Evidence**: identity-scoped `lintFixture` returns `passed: true` for all scenarios (no skill id / mode names / resource basenames leaked)
- [ ] CHK-031 [P0] Private gold never duplicated into the public half
  - **Evidence**: `workflowMode`/`routeOutcome`/forbidden/group live only in `*.private.json`
- [ ] CHK-032 [P1] No scorer modification in this phase
  - **Evidence**: `score-skill-benchmark.cjs` and `router-replay.cjs` unchanged; change is additive corpus + doc only

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: all three reflect the final fixture set and route fields
- [ ] CHK-041 [P1] D3-R2 coupling noted without building the scorer
  - **Evidence**: implementation-summary.md states the corpus is consumed by the gated `hubRoute` stage (next phase)
- [ ] CHK-042 [P2] Per-skill fixture index/README updated if present
  - **Evidence**: fixtures README mentions the new `sk-design/` corpus

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Evergreen: no spec/packet/phase IDs in any fixture or schema-doc file
  - **Evidence**: `rg` for `D3-R3`/`039`/`003-`/`.opencode/specs/` across `sk-design/` + `scenario_authoring.md` → zero hits
- [ ] CHK-051 [P1] Fixtures live only under the corpus root
  - **Evidence**: all new files under `assets/skill_benchmark/fixtures/sk-design/`

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: planned
**Verified By**: pending execution

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
