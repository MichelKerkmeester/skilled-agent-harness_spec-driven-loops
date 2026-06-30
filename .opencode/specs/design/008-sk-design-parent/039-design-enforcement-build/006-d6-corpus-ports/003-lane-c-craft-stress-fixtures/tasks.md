---
title: "Tasks: D6-R3 — Lane C craft-stress fixtures"
description: "Task list to grow the sk-design hubRoute corpus with three craft-stress fixture pairs while holding the 23/5/0 floor."
trigger_phrases:
  - "d6-r3 lane c craft fixtures tasks"
  - "craft stress fixtures task list"
  - "sk-design hubroute corpus tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/003-lane-c-craft-stress-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task complete with evidence and canonical phase headers"
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
# Tasks: D6-R3 — Lane C craft-stress fixtures

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

Corpus root (all fixture paths below are under it):
`.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the scorer / headline guard test and record the REAL on-disk tally — pass / knownGaps / regressions and routeRows length (`scripts/skill-benchmark/tests/design-token-lint.vitest.ts`) [15m] — recorded 28 routeRows / 23 pass / 5 known-gaps / 0 regressions
- [x] T002 Reconcile the recorded baseline against the dispatch floor (23/5/0); if the guard test asserts a stale 13/18, note the true count the 10 transform fixtures produced before adding anything [10m] — on-disk floor confirmed 28/23/5/0; guard asserted `toHaveLength(28)`/`passed.toBe(23)`
- [x] T003 [P] Read sk-design modes + register dials; map each craft surface to its intended workflow-mode bundle and `forbiddenWorkflowModes` (`.opencode/skills/sk-design/shared/register.md` + mode SKILL.md set) [15m] — per-surface mode bundle + forbidden set derived
- [x] T004 [P] Resolve the "proof fields" interpretation against the spec + `scoreHubRoute` and `design-dispatch-boundary-proof.cjs`; default to the route-gold `expected` reading; record the decision in checklist evidence [10m] — resolved to the route-gold `expected` block; no `DESIGN_BOUNDARY_PROOF` token

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T2 Holdout Pairs (named surfaces — primary, P0)
- [x] T005 Author stateful-upload public (`sk-design-craft-stateful-upload-holdout-001.public.json`) — domain prompt for a multi-state upload component, `tier: "T2"`, `blindToRouterKeywords: true` [20m] — authored; parses
- [x] T006 Author stateful-upload private gold (`sk-design-craft-stateful-upload-holdout-001.private.json`) — expected mode bundle + `forbiddenWorkflowModes` + rubric [15m] — route-gold `expected` block authored
- [x] T007 Author dense-dashboard public (`sk-design-craft-dense-dashboard-holdout-001.public.json`) — domain prompt for an information-dense dashboard, `tier: "T2"` [20m] — authored; parses
- [x] T008 Author dense-dashboard private gold (`sk-design-craft-dense-dashboard-holdout-001.private.json`) — expected mode bundle + forbidden + rubric [15m] — route-gold `expected` block authored
- [x] T009 Author locale-component public (`sk-design-craft-locale-component-holdout-001.public.json`) — domain prompt for a localized component, `tier: "T2"` [20m] — authored; parses
- [x] T010 Author locale-component private gold (`sk-design-craft-locale-component-holdout-001.private.json`) — expected mode bundle + forbidden + rubric [15m] — route-gold `expected` block authored

### T1 Derived Twins (publish the circularity meter — P1)
- [x] T011 [P] Author stateful-upload T1 derived pair (`sk-design-craft-stateful-upload-derived-001.{public,private}.json`) — paraphrased + decontaminated, `tier: "T1"`, gold mechanically derived [15m] — twin authored
- [x] T012 [P] Author dense-dashboard T1 derived pair (`sk-design-craft-dense-dashboard-derived-001.{public,private}.json`) [15m] — twin authored
- [x] T013 [P] Author locale-component T1 derived pair (`sk-design-craft-locale-component-derived-001.{public,private}.json`) [15m] — twin authored

### Lint & Route-Bind
- [x] T014 Run `contamination-lint.cjs` on every new public prompt; revise until each is clean (`scripts/skill-benchmark/contamination-lint.cjs`) [20m] — every public prompt clean
- [x] T015 Router-replay each prompt; for each fixture set gold to clean-pass OR `knownRouteGap: true` when the router silently defaults (`[]`) — confirm each admits to exactly one router key [25m] — six new scenarios set to clean-pass

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Scorer & Floor
- [x] T016 Run the scorer; confirm the prior 23 pass rows still pass and the 5 known-gaps are unchanged [15m] — prior 23 still pass; 5 known-gaps unchanged
- [x] T017 Confirm `hubRoute.regressions === 0` and gate `failed === false` after adding the new fixtures [10m] — `regressions===0`; no prior gold row flipped

### Guard Test & Suite
- [x] T018 Reconcile the headline guard test numerics (`routeRows` length + `passed`) to the new totals; leave `knownGaps`/`regressions` unchanged unless a new gap was deliberately recorded (`scripts/skill-benchmark/tests/design-token-lint.vitest.ts`) [15m] — `toHaveLength(28)→(34)`, `passed.toBe(23)→(29)`; 5/0 unchanged
- [x] T019 Run the full skill-benchmark vitest suite green (`scripts/skill-benchmark/tests/*.vitest.ts`) [10m] — suite green against the grown corpus
- [x] T020 Compute and publish the T1↔T2 score-gap circularity meter; confirm within authoring bounds; log a corpus finding if the gap is large [15m] — meter within authoring bounds
- [x] T021 Grep every new fixture for spec IDs/paths (e.g. `039`, `D6-R3`, `.opencode/specs`) → confirm NONE present (evergreen) [10m] — evergreen scan clean

### Documentation
- [x] T022 Mark all checklist items with evidence; set spec/plan/tasks status from `planned` to the executed state [15m] — checklist verified; spec/plan/tasks status `complete`

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Prior 23 pass + 5 known-gaps unchanged, 0 regressions (now 34/29/5/0)
- [x] Each new fixture admits to one router key; gold set correctly
- [x] Headline guard test + full vitest suite green
- [x] Circularity meter published within authoring bounds
- [x] Evergreen verified (no spec IDs/paths in fixtures)
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
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
