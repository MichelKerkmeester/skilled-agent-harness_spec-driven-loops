---
title: "Tasks: Standing route-gold corpus + minimal pairs"
description: "Ordered build tasks for the sk-design route-gold fixtures plus a verification task that replays every fixture through router-replay."
trigger_phrases:
  - "route gold corpus tasks"
  - "sk-design fixtures tasks"
  - "minimal pair authoring tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/003-route-gold-corpus"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all route-gold corpus build and verification tasks complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
## Phase 1: Setup

### Schema extension (45m)
- [x] T001 Add `workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`minimalPairGroup` to the private `expected` shape (`assets/skill_benchmark/fixtures/sk-design/*.private.json`) [20m] — present in every `*.private.json`
- [x] T002 Document the field shape + allowed enums in the fixture-structure section (`deep-improvement/references/skill_benchmark/scenario_authoring.md`) [25m] — +17 additive lines

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Alias fixtures (T1, single — must route now)
- [x] T003 [P] `make it look good`→interface (`sk-design/sk-design-alias-interface-001.{public,private}.json`) [15m] — replay → interface
- [x] T004 [P] `oklch palette`→foundations (`sk-design/sk-design-alias-foundations-001.*.json`) [15m] — replay → foundations
- [x] T005 [P] `micro-interactions`→motion (`sk-design/sk-design-alias-motion-001.*.json`) [15m] — replay → motion
- [x] T006 [P] `production hardening`→audit (`sk-design/sk-design-alias-audit-001.*.json`) [15m] — replay → audit
- [x] T007 [P] `capture website css`→md-generator (`sk-design/sk-design-alias-mdgen-001.*.json`) [15m] — replay → md-generator

### Adversarial minimal pairs (T3, must route now)
- [x] T008 Pair `mp-ui-redesign-vs-review`: `redesign the ui`→interface / `review the ui`→audit (`sk-design/sk-design-mp-redesign-ui-00{1,2}.*.json`) [20m] — both arms flip as gold
- [x] T009 Pair `mp-ui-build-vs-critique`: `ui build`→interface / `ui critique`→audit (`sk-design/sk-design-mp-ui-build-00{1,2}.*.json`) [20m] — replay → interface / audit
- [x] T010 Pair `mp-tokens-single-vs-bundle`: `design tokens`→foundations `single` (forbidden md-generator) / `design tokens from url`→`orderedBundle` [foundations, md-generator] (`sk-design/sk-design-mp-tokens-00{1,2}.*.json`) [25m] — replay → foundations single / [foundations,md-generator]

### Adversarial silent-default pair (T3, standing gap — NOT a this-phase gate)
- [x] T011 Pair `mp-menu-animate-vs-redesign`: `animate the menu`→motion (routes now) / `redesign the menu`→interface gold, current `[]` silent-default (`sk-design/sk-design-mp-menu-00{1,2}.*.json`) [20m] — replay → motion / [] (gap recorded)

### Holdout fixtures (T2, hint-free — gold = correct mode, current route recorded)
- [x] T012 [P] `fix the visual hierarchy of the dashboard`→foundations (routes now) (`sk-design/sk-design-holdout-foundations-001.*.json`) [15m] — replay → foundations
- [x] T013 [P] `tune the easing so the drawer feels less abrupt when it opens`→motion gold / `[]` now (`sk-design/sk-design-holdout-motion-001.*.json`) [15m] — replay → [] (gap recorded)
- [x] T014 [P] `this landing page feels generic and templated; give it a point of view`→interface gold / `[]` now (`sk-design/sk-design-holdout-interface-001.*.json`) [15m] — replay → [] (gap recorded)
- [x] T015 [P] `go over the checkout screen and list what is broken or sloppy`→audit gold / `[]` now (`sk-design/sk-design-holdout-audit-001.*.json`) [15m] — replay → [] (gap recorded)
- [x] T016 [P] `pull the visual styling off this live site into a reusable spec`→md-generator gold / `[]` now (`sk-design/sk-design-holdout-mdgen-001.*.json`) [15m] — replay → [] (gap recorded)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Routing replay (1h)
- [x] T017 Replay EVERY fixture: `node router-replay.cjs --skill .opencode/skills/sk-design --task "<prompt>"`; capture intents per scenario [25m] — all 18 replayed against `hub-router.json`
- [x] T018 Assert must-pass set (alias + T008/T009/T010) lands on `expected.workflowMode`/`routeOutcome`; assert minimal pairs route to distinct outcomes [15m] — 13/18 on gold; pairs flip to distinct outcomes
- [x] T019 Assert `forbiddenWorkflowModes` never appears in any fixture's selected intents [5m] — zero forbidden-mode intents across the corpus
- [x] T020 Record standing-gap outcomes (T011 interface arm + non-routing holdouts) as the measured router gap — gold retained, no this-phase failure [5m] — 5 silent-defaults gold-labeled, observed `[]` recorded

### Contamination + evergreen
- [x] T021 Run identity-scoped `lintFixture` on every public prompt → all `passed: true` [5m] — clean on all 18
- [x] T022 grep corpus + `scenario_authoring.md` for spec/packet/phase IDs and `.opencode/specs/` paths → zero hits [5m] — evergreen scan clean

### Documentation
- [x] T023 Note the D3-R2 coupling in `implementation-summary.md` (corpus is consumed by the gated `hubRoute` stage; scorer NOT built here) [5m] — recorded in What Was Built + How It Was Delivered
- [x] T024 Mark all checklist items with evidence [5m] — checklist.md fully `[x]` with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Must-pass fixtures route correctly under `router-replay.cjs`
- [x] Minimal pairs route to distinct outcomes; forbidden modes never selected
- [x] Identity-scoped contamination lint clean on every public prompt
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
- Ordered: schema -> author fixtures -> verify
- Effort estimates per task
- T017-T022 are the explicit replay + contamination + evergreen verification tasks
-->
