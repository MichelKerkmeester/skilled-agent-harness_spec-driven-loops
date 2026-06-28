---
title: "Tasks: Standing route-gold corpus + minimal pairs"
description: "Ordered build tasks for the sk-design route-gold fixtures plus a verification task that replays every fixture through router-replay."
trigger_phrases:
  - "route gold corpus tasks"
  - "sk-design fixtures tasks"
  - "minimal pair authoring tasks"
importance_tier: "normal"
contextType: "planning"
---
# Tasks: Standing route-gold corpus + minimal pairs

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

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Schema (45m)

- [ ] T001 Add `workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`minimalPairGroup` to the private `expected` shape (`assets/skill_benchmark/fixtures/sk-design/*.private.json`) [20m]
- [ ] T002 Document the field shape + allowed enums in the fixture-structure section (`deep-improvement/references/skill_benchmark/scenario_authoring.md` §2) [25m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Author fixtures (2-3 hours)

### Alias fixtures (T1, single — must route now)
- [ ] T003 [P] `make it look good`→interface (`sk-design/sk-design-alias-interface-001.{public,private}.json`) [15m]
- [ ] T004 [P] `oklch palette`→foundations (`sk-design/sk-design-alias-foundations-001.*.json`) [15m]
- [ ] T005 [P] `micro-interactions`→motion (`sk-design/sk-design-alias-motion-001.*.json`) [15m]
- [ ] T006 [P] `production hardening`→audit (`sk-design/sk-design-alias-audit-001.*.json`) [15m]
- [ ] T007 [P] `capture website css`→md-generator (`sk-design/sk-design-alias-mdgen-001.*.json`) [15m]

### Adversarial minimal pairs (T3, must route now)
- [ ] T008 Pair `mp-ui-redesign-vs-review`: `redesign the ui`→interface / `review the ui`→audit (`sk-design/sk-design-mp-redesign-ui-00{1,2}.*.json`) [20m]
- [ ] T009 Pair `mp-ui-build-vs-critique`: `ui build`→interface / `ui critique`→audit (`sk-design/sk-design-mp-ui-build-00{1,2}.*.json`) [20m]
- [ ] T010 Pair `mp-tokens-single-vs-bundle`: `design tokens`→foundations `single` (forbidden md-generator) / `design tokens from url`→`orderedBundle` [foundations, md-generator] (`sk-design/sk-design-mp-tokens-00{1,2}.*.json`) [25m]

### Adversarial silent-default pair (T3, standing gap — NOT a this-phase gate)
- [ ] T011 Pair `mp-menu-animate-vs-redesign`: `animate the menu`→motion (routes now) / `redesign the menu`→interface gold, current `[]` silent-default (`sk-design/sk-design-mp-menu-00{1,2}.*.json`) [20m]

### Holdout fixtures (T2, hint-free — gold = correct mode, current route recorded)
- [ ] T012 [P] `fix the visual hierarchy of the dashboard`→foundations (routes now) (`sk-design/sk-design-holdout-foundations-001.*.json`) [15m]
- [ ] T013 [P] `tune the easing so the drawer feels less abrupt when it opens`→motion gold / `[]` now (`sk-design/sk-design-holdout-motion-001.*.json`) [15m]
- [ ] T014 [P] `this landing page feels generic and templated; give it a point of view`→interface gold / `[]` now (`sk-design/sk-design-holdout-interface-001.*.json`) [15m]
- [ ] T015 [P] `go over the checkout screen and list what is broken or sloppy`→audit gold / `[]` now (`sk-design/sk-design-holdout-audit-001.*.json`) [15m]
- [ ] T016 [P] `pull the visual styling off this live site into a reusable spec`→md-generator gold / `[]` now (`sk-design/sk-design-holdout-mdgen-001.*.json`) [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (1 hour)

### Routing replay
- [ ] T017 Replay EVERY fixture: `node router-replay.cjs --skill .opencode/skills/sk-design --task "<prompt>"`; capture intents per scenario [25m]
- [ ] T018 Assert must-pass set (alias + T008/T009/T010) lands on `expected.workflowMode`/`routeOutcome`; assert minimal pairs route to distinct outcomes [15m]
- [ ] T019 Assert `forbiddenWorkflowModes` never appears in any fixture's selected intents [5m]
- [ ] T020 Record standing-gap outcomes (T011 interface arm + non-routing holdouts) as the measured router gap — gold retained, no this-phase failure [5m]

### Contamination + evergreen
- [ ] T021 Run identity-scoped `lintFixture` on every public prompt → all `passed: true` [5m]
- [ ] T022 grep corpus + `scenario_authoring.md` for spec/packet/phase IDs and `.opencode/specs/` paths → zero hits [5m]

### Documentation
- [ ] T023 Note the D3-R2 coupling in `implementation-summary.md` (corpus is consumed by the gated `hubRoute` stage; scorer NOT built here) [5m]
- [ ] T024 Mark all checklist items with evidence [5m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Must-pass fixtures route correctly under `router-replay.cjs`
- [ ] Minimal pairs route to distinct outcomes; forbidden modes never selected
- [ ] Identity-scoped contamination lint clean on every public prompt
- [ ] Checklist.md fully verified

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
- Ordered: schema -> author fixtures -> verify
- Effort estimates per task
- T017-T022 are the explicit replay + contamination + evergreen verification tasks
-->
