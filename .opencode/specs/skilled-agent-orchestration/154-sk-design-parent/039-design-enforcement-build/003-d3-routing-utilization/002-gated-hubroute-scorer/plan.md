---
title: "Plan: Gated hubRoute scorer lane"
description: "Insert a fail-closed hubRoute stage before routed-intra in score-skill-benchmark.cjs; additive no-op for non-route-gold fixtures; known-gap-aware suite gate."
trigger_phrases:
  - "hubroute scorer plan"
  - "gated hub route stage"
  - "d3-r2 plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/002-gated-hubroute-scorer"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan phases and DoD complete with build evidence"
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
# Plan: Gated hubRoute scorer lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), pure functions, no external deps |
| **Target file** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` |
| **Consumes (read-only)** | `sk-design/hub-router.json` projection via `router-replay.cjs` `routeSkillResources`; gold corpus `fixtures/sk-design/*.private.json` route-gold `expected` blocks |
| **Testing** | Node replay against the sk-design gold corpus (13 correct + 5 standing-gap) plus a non-sk-design no-op control |

### Overview

The scorer currently judges hub routing only through the advisory `modePrecision` signal, which never sets `firstFailingStage` and never enters the weighted aggregate or the verdict. A wrong hub route therefore passes the suite. This plan inserts a hard `hubRoute` stage into the funnel, ordered immediately before the advisory `routed-intra` stage, that compares the replayed workflow-mode route against the scenario's route gold and emits `firstFailingStage` of `wrong-mode`, `silent-default`, or `bundle-mismatch` on a miss. The stage fails closed at the suite-gate level for regressions while reporting the five known standing-gap fixtures as a measured known-gap count rather than as blocking failures.

The change is strictly additive: the stage is inert for every scenario whose `expected` block carries no `workflowMode`/`routeOutcome` (every non-route-gold fixture), so existing benchmark outcomes are unchanged.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Insertion point located: `firstFailingStage()` at `score-skill-benchmark.cjs:188-195`; the `routed-intra` branch is line 192
- [x] Route-gold contract confirmed: `expected.workflowMode` (string for `single`/`defer`, array for `orderedBundle`), `expected.routeOutcome`, `expected.forbiddenWorkflowModes`, `expected.minimalPairGroup`
- [x] Known-gap marker confirmed: `notes.status === "known silent-default gap"` present on exactly 5 fixtures
- [x] Replayed-route source confirmed: `routerResult.intents` already carries the hub-router projection for sk-design scenarios (`router-replay.cjs` `projectHubRouter`)

### Definition of Done
- [x] `hubRoute` stage passes the 13 correctly-routing fixtures (no `hubRoute` label, route gold met) — canonical no-notes acceptance: 13 pass
- [x] `hubRoute` stage flags the 5 standing-gap fixtures with `firstFailingStage='silent-default'` — holdout-audit/interface/motion/mdgen + mp-menu-002
- [x] Verified no-op on a non-sk-design fixture: identical report before vs after (aggregateScore, verdict, funnel, per-row `firstFailingStage`) — byte-identical
- [x] Suite gate distinguishes routing regressions (blocking) from the measured known-gap count (non-blocking) — `gate.hubRoute` regressions=0/knownGaps=5; synthetic mis-route → regressions=1 + BLOCKED-BY-ROUTING
- [x] Code and comments carry no spec/packet/phase IDs or spec paths — evergreen scan clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pure-function stage addition mirroring the existing dimension helpers. The new stage rides its own lane (like `modePrecision`) but, unlike `modePrecision`, it sets `firstFailingStage` and contributes a suite-level hard gate (mirroring how D5 `connectivity.gateFailed` blocks the verdict). It is NOT folded into the weighted `modeAScore`, so the v1 dimension weights and the soft per-scenario score are unchanged.

### Key Components

- **Route-gold capture** (`normalizeScenarioInput` / `expectedFromScenario`): surface `workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, and a derived `knownRouteGap` boolean into the `expected` object for BOTH the shaped (`{scenario, observed}`) and legacy (`{...,expected}`) input shapes.
- **`scoreHubRoute({ expected, routerResult })`** (new helper): the fail-closed comparator. Returns `{ applicable, pass, firstFailingStage, knownGap }`. Returns `{ applicable: false, pass: true }` whenever route gold is absent — the no-op guarantee.
- **`firstFailingStage({ dims, routerResult, surfaceMatch })`**: insert a `hubRoute` branch BEFORE the `routed-intra` branch (line 192). Inert when `dims.hubRoute.applicable` is false.
- **`scoreScenario`**: compute `dims.hubRoute` before calling `firstFailingStage`; expose it on the returned row.
- **`aggregate(...)`**: split applicable `hubRoute` failures into routing regressions (`knownGap !== true`) and known gaps (`knownGap === true`); add a `gate.hubRoute` block; set verdict `BLOCKED-BY-ROUTING` when regressions exist; report the known-gap count without blocking.

### Data Flow

1. Orchestrator joins public + private fixture halves into the scenario/arg passed to `scoreScenario`.
2. `normalizeScenarioInput` surfaces the route-gold fields and `knownRouteGap` onto `expected`.
3. `scoreScenario` calls `scoreHubRoute({ expected, routerResult })` → `dims.hubRoute`.
4. `firstFailingStage` returns the `hubRoute` label (`wrong-mode` | `silent-default` | `bundle-mismatch`) before `routed-intra`, but only when `dims.hubRoute.applicable && !dims.hubRoute.pass`.
5. `aggregate` reads `dims.hubRoute` from each row, splits regressions vs known gaps, sets `gate.hubRoute` and verdict.
6. Report carries `gate.hubRoute = { failed, regressions, knownGaps, reason }` plus the per-row `firstFailingStage`.

### Stage algorithm (`scoreHubRoute`)

Precedence is strict; the first matching rule wins:

1. **Not applicable** — `routeOutcome` missing OR `workflowMode == null` → `{ applicable: false, pass: true }`. (No-op for every non-route-gold fixture.)
2. **`defer`** (not exercised by the current corpus; specified for forward-compat) — pass iff the replayed route is empty (router declined) and no forbidden mode is present; otherwise `firstFailingStage='wrong-mode'`.
3. **Silent default** — replayed route is empty → `firstFailingStage='silent-default'`.
4. **`single`** — replayed set must equal `{ workflowMode }` (exactly one element, matching) AND contain no `forbiddenWorkflowModes` member → pass; otherwise `firstFailingStage='wrong-mode'`.
5. **`orderedBundle`** — replayed set must equal `set(workflowMode[])` AND contain no `forbiddenWorkflowModes` member → pass; otherwise `firstFailingStage='bundle-mismatch'`.

`replayed` is the de-duplicated `routerResult.intents`. `knownGap` is carried through unchanged from `expected.knownRouteGap` and only affects the aggregate gate, never the per-scenario `firstFailingStage` label (the five gaps still report `silent-default`, which is the measure working).

### Replayed-route source decision

`routerResult.intents` already holds the hub-router projection for sk-design scenarios (`router-replay.cjs` falls back to `hub-router.json` and `projectHubRouter` keys intents by workflow mode). **Recommended:** reuse `routerResult.intents` in-place — it keeps `score-skill-benchmark.cjs` a pure function of its inputs, adds no filesystem/`skillRoot` coupling, and stays deterministic. A fresh `routeSkillResources({ skillRoot, taskText })` call is the documented fallback ONLY if verification (T011) shows `observedIntents` does not carry workflow modes for sk-design fixtures; that fallback would be the brief's justified "minimal helper" and must be flagged before adoption.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Capture route gold (no behavior change yet)
- [x] Surface the known-gap marker so the scorer reads it — LOGIC-SYNC found the canonical runner threads `expected` not top-level `notes`; resolved by the first-class `expected.knownRouteGap` field
- [x] Extend `expectedFromScenario` to copy `workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, `knownRouteGap` from `scenario.expected` — `expected.knownRouteGap === true` carried through
- [x] Confirm the legacy `arg.expected` passthrough already carries the route fields; fold `knownRouteGap` in centrally so both shapes agree — `scoreHubRoute` reads `expected.knownRouteGap` as authoritative

### Phase 2: hubRoute stage + funnel insertion
- [x] Add the `scoreHubRoute({ expected, routerResult })` helper (Section 3 algorithm) — `score-skill-benchmark.cjs:234`
- [x] Compute `dims.hubRoute` in `scoreScenario` before the `firstFailingStage` call — `score-skill-benchmark.cjs:400`
- [x] Insert the `hubRoute` branch in `firstFailingStage` immediately before the `routed-intra` branch — `score-skill-benchmark.cjs:302` (ahead of `routed-intra` at 303)
- [x] Expose `dims.hubRoute` on the returned scenario row — read by `aggregate` at lines 483-485

### Phase 3: Aggregate routing gate
- [x] In `aggregate`, count applicable `hubRoute` failures, split into `regressions` (`knownGap !== true`) and `knownGaps` — `score-skill-benchmark.cjs:486-487`
- [x] Add `gate.hubRoute = { failed, regressions, knownGaps, reason }` to the report — `score-skill-benchmark.cjs:488-492`, surfaced at 549
- [x] Set verdict `BLOCKED-BY-ROUTING` when `regressions > 0`; leave verdict unchanged when only known gaps fail — `score-skill-benchmark.cjs:516`, BLOCKED-BY-STRUCTURE precedence kept at 515
- [x] Surface the known-gap count in `runQuality` / `bottlenecks` as a measured signal, not a regression — `runQuality.hubRouteKnownGaps` (583), `routing_known_gap`/P3 reclass (529)

### Phase 4: Verification
- [x] Replay the sk-design gold corpus: assert 13 fixtures pass the stage, 5 flag `silent-default` — canonical no-notes call: 13 pass, 5 `silent-default`
- [x] Assert the 5 flagged fixtures are the known-gap set and do NOT set verdict `BLOCKED-BY-ROUTING` — `knownGaps=5`, `regressions=0`, `gate.hubRoute.failed=false`
- [x] No-op control: run a non-sk-design fixture before/after; assert byte-identical report fields — byte-identical (no route gold → `{ applicable: false, pass: true }`)
- [x] Confirm no spec/packet/phase IDs or spec paths in the diff (code + comments) — evergreen scan clean; `node --check` passes

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (helper) | `scoreHubRoute` precedence: not-applicable, silent-default, single match/miss, orderedBundle match/miss, forbidden-mode hit, defer branch | Node assertions / inline harness |
| Integration (corpus) | Full scorer over `fixtures/sk-design/*`: 13 pass, 5 flagged `silent-default`, verdict not blocked by known gaps | `router-replay` + `scoreScenario` + `aggregate` |
| Regression (no-op) | One non-sk-design fixture (e.g. an sk-doc/sk-code fixture with no `workflowMode`): report identical pre/post | Diff of serialized report |
| Funnel order | A seeded `single` miss reports `firstFailingStage='wrong-mode'` ahead of any `routed-intra` label | `scoreScenario` row inspection |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `router-replay.cjs` `routeSkillResources` / `projectHubRouter` | Internal (landed) | Green | Fallback replayed-route source unavailable; reuse of `routerResult.intents` still works |
| `sk-design/hub-router.json` | Internal (landed) | Green | No workflow-mode projection → stage cannot route |
| `fixtures/sk-design/*.private.json` route gold | Internal (landed) | Green | No `workflowMode`/`routeOutcome` → stage stays inert |
| Known-gap marker (`notes.status`) reaching the scorer | Internal | Amber | If the scenario object passed to `scoreScenario` omits `notes`, the known-gap split cannot be computed (see Rollback / risk) |

### Risk: known-gap marker threading

The known-gap split depends on the scorer seeing the fixture marker. The plan reads it from the scenario object the scorer already receives (`notes.status`) and folds `knownRouteGap` into `expected` centrally in `normalizeScenarioInput`. If verification shows the incoming scenario object does not carry `notes`, the implementer MUST stop and escalate (logic-sync) rather than silently widening scope to the orchestrator; the sanctioned narrow alternative is an explicit `expected.knownRouteGap` field, which would be a fixture-data change outside this file's scope and requires approval.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the no-op control diff is non-empty (existing benchmark outcomes changed), or the 13 correct fixtures regress at the `hubRoute` stage.
- **Procedure**: revert the single-file change to `score-skill-benchmark.cjs`. No data migration, no fixture edits, no state to unwind. The scorer returns to advisory-only `modePrecision` behavior.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Capture route gold) ──> Phase 2 (hubRoute stage + funnel) ──> Phase 3 (Aggregate gate) ──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Capture route gold | None | hubRoute stage |
| hubRoute stage + funnel | Capture route gold | Aggregate gate |
| Aggregate gate | hubRoute stage | Verify |
| Verify | Aggregate gate | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Capture route gold | Low | 30-45 minutes |
| hubRoute stage + funnel | Medium | 1-1.5 hours |
| Aggregate gate | Medium | 1 hour |
| Verification (corpus + no-op control) | Medium | 1-1.5 hours |
| **Total** | | **3.5-4.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline report captured for the sk-design corpus AND one non-sk-design fixture before any edit — non-sk-design baseline is the byte-identical no-op reference
- [x] Feature flag configured — N/A: additive gate, inert without route gold (no-op for non-route-gold fixtures)
- [x] Monitoring — N/A: CI-time deterministic scorer, no runtime surface

### Rollback Procedure
1. **Immediate**: `git checkout -- score-skill-benchmark.cjs` (single-file revert)
2. **Verify**: re-run the no-op control; confirm the report matches the pre-change baseline
3. **Notify**: record in the implementation summary why the gate was reverted

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: none required; the change touches one script and reads (never writes) fixtures

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
- PLANNING ONLY: live target file not edited in this packet
-->
