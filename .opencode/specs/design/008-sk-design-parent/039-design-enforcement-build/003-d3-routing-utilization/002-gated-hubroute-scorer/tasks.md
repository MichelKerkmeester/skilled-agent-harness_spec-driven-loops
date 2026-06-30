---
title: "Tasks: Gated hubRoute scorer lane"
description: "Ordered implementer items to add a fail-closed hubRoute stage before routed-intra in score-skill-benchmark.cjs, with verification including the no-op-on-other-skill control."
trigger_phrases:
  - "hubroute scorer tasks"
  - "gated hub route tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/002-gated-hubroute-scorer"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all hubRoute scorer work items and verification tasks complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Gated hubRoute scorer lane

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

All code edits land in a single file unless explicitly noted:
`.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Capture route gold (no behavior change yet)
- [x] T001 Read the target fully and capture a baseline scorer report for the sk-design corpus and for one non-sk-design fixture (`scratch/` only) [15m]
  - **Evidence**: baseline captured pre-edit; the non-sk-design report is the byte-identical reference used by T018
- [x] T002 Surface the known-gap marker so the scorer reads it on the canonical call shape (`score-skill-benchmark.cjs`) [15m]
  - **Evidence**: LOGIC-SYNC found — the canonical runner `run-skill-benchmark.cjs` threads `expected` but NOT top-level `notes`, so a `notes.status` marker is invisible on the real call path; resolved by promoting the marker to the first-class gold field `expected.knownRouteGap: true` on the 5 standing-gap fixtures
- [x] T003 Extend `expectedFromScenario` to copy `workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, and `knownRouteGap` from `scenario.expected` (`score-skill-benchmark.cjs`) [10m]
  - **Evidence**: route-gold fields plus `knownRouteGap` surfaced onto `expected`; `scoreHubRoute` reads `expected.knownRouteGap` as authoritative
- [x] T004 Confirm the legacy `arg.expected` shape already carries the route fields and fold `knownRouteGap` centrally so both input shapes agree (`score-skill-benchmark.cjs`) [5m]
  - **Evidence**: both the shaped and legacy passthrough resolve `expected.knownRouteGap` identically; no shape-specific branch needed

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Comparator helper
- [x] T005 Add `scoreHubRoute({ expected, routerResult })` implementing the strict-precedence algorithm: not-applicable → defer → silent-default → single → orderedBundle, with `forbiddenWorkflowModes` folded into the single/bundle checks; return `{ applicable, pass, firstFailingStage, knownGap }` (`score-skill-benchmark.cjs`) [45m]
  - **Evidence**: pure helper landed before the funnel; `single` miss → `wrong-mode`, empty route → `silent-default`, `orderedBundle` miss → `bundle-mismatch`
- [x] T006 Ensure the not-applicable branch (`routeOutcome` missing OR `workflowMode == null`) returns `{ applicable: false, pass: true }` — the no-op guarantee (`score-skill-benchmark.cjs`) [10m]
  - **Evidence**: no-route-gold fixtures return `{ applicable: false, pass: true }`; the no-op control (T018) is byte-identical

### Wiring
- [x] T007 Compute `dims.hubRoute = scoreHubRoute({ expected, routerResult })` in `scoreScenario` before the `firstFailingStage` call (`score-skill-benchmark.cjs`) [10m]
  - **Evidence**: `dims.hubRoute` computed and exposed on the returned scenario row
- [x] T008 Insert the `hubRoute` branch in `firstFailingStage` immediately BEFORE the `routed-intra` branch, guarded by `dims.hubRoute && dims.hubRoute.applicable && !dims.hubRoute.pass` (`score-skill-benchmark.cjs`) [10m]
  - **Evidence**: the `hubRoute` label surfaces ahead of the advisory `routed-intra` attrition label; funnel order verified by T019
- [x] T009 Expose `dims.hubRoute` on the row returned by `scoreScenario` so `aggregate` can read it (`score-skill-benchmark.cjs`) [5m]
  - **Evidence**: `aggregate` reads `dims.hubRoute` per row to build the suite gate

### Aggregate routing gate
- [x] T010 In `aggregate`, iterate rows for applicable `hubRoute` failures and split into `regressions` (`knownGap !== true`) and `knownGaps` (`knownGap === true`) (`score-skill-benchmark.cjs`) [20m]
  - **Evidence**: applicable failures split correctly; canonical run yields `regressions=0`, `knownGaps=5`
- [x] T011 Add `gate.hubRoute = { failed: regressions > 0, regressions, knownGaps, reason }` to the report object (`score-skill-benchmark.cjs`) [15m]
  - **Evidence**: `gate.hubRoute` emitted on the report; `gate.hubRoute.failed=false` when only known gaps fail
- [x] T012 Set verdict `BLOCKED-BY-ROUTING` when `regressions > 0`; leave verdict unchanged when only known gaps fail; keep the D5 `BLOCKED-BY-STRUCTURE` precedence intact (`score-skill-benchmark.cjs`) [15m]
  - **Evidence**: synthetic real mis-route → `regressions=1` + verdict `BLOCKED-BY-ROUTING`; `BLOCKED-BY-STRUCTURE` precedence preserved
- [x] T013 Surface the measured known-gap count in `runQuality` (and/or `bottlenecks` as a non-regression note) so the suite distinguishes the standing gap from a regression (`score-skill-benchmark.cjs`) [10m]
  - **Evidence**: `runQuality.hubRouteKnownGaps` carries the count; the headline bottleneck reclassifies to `routing_known_gap` (P3) when only known gaps fail

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Corpus replay
- [x] T014 Replay the full sk-design gold corpus; assert exactly 13 fixtures pass the `hubRoute` stage (no `hubRoute` label) [20m]
  - **Evidence**: canonical no-notes call shape — 13 fixtures pass the `hubRoute` stage
- [x] T015 Assert the 5 standing-gap fixtures (`holdout-audit-001`, `holdout-interface-001`, `holdout-motion-001`, `holdout-mdgen-001`, `mp-menu-002`) each report `firstFailingStage='silent-default'` [15m]
  - **Evidence**: all 5 report `firstFailingStage='silent-default'` (the measure working)
- [x] T016 Assert the 5 flagged fixtures are classified `knownGap` and do NOT push the verdict to `BLOCKED-BY-ROUTING` [10m]
  - **Evidence**: `knownGaps=5`, `regressions=0`, `gate.hubRoute.failed=false`; suite NOT blocked by the standing gaps
- [x] T017 Confirm replayed-route source: verify `routerResult.intents` (a.k.a. `observedIntents`) carries workflow modes for sk-design fixtures; if not, flag the `routeSkillResources` fallback before adopting it [15m]
  - **Evidence**: `routerResult.intents` carries the hub-router projection in-place; no `routeSkillResources` fallback needed, no new `skillRoot` coupling

### No-op control (the no-op-on-other-skill check)
- [x] T018 Run the scorer on one non-sk-design fixture (no `workflowMode`/`routeOutcome`) before and after the change; assert byte-identical report fields: `aggregateScore`, `verdict`, `funnel`, every per-row `firstFailingStage`, and `dimensionScores` [20m]
  - **Evidence**: non-sk-design fixture scores byte-identical pre/post — the no-op guarantee holds
- [x] T019 Seed a synthetic `single` miss (route gold present, replayed intents wrong) and assert `firstFailingStage='wrong-mode'` is returned ahead of any `routed-intra` label (funnel order) [10m]
  - **Evidence**: synthetic mis-route returns `wrong-mode` ahead of `routed-intra`; verdict `BLOCKED-BY-ROUTING`

### Hygiene
- [x] T020 Confirm the diff contains no spec/packet/phase IDs or spec paths in code or comments; comments state the durable WHY only [10m]
  - **Evidence**: evergreen scan over the scorer diff and the 5 fixture edits found no IDs or `specs/` paths; `node --check` passes on `score-skill-benchmark.cjs` and `run-skill-benchmark.cjs`

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 13 correct fixtures pass; 5 standing-gap fixtures flagged `silent-default`
- [x] No-op control report identical pre/post on a non-sk-design fixture
- [x] Suite gate blocks routing regressions but not the measured known-gap count
- [x] `checklist.md` fully verified

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
- Explicit verification tasks incl. the no-op-on-other-skill control
- Logic-sync resolved by promoting the known-gap marker to expected.knownRouteGap on 5 fixtures
-->
