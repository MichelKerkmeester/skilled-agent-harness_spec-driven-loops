---
title: "Tasks: routeTelemetry adapter + miss-rate metrics"
description: "Ordered build tasks for the additive routeTelemetry emitter and the reducer miss-rate metrics, with explicit verification including the additive/no-regression checks."
trigger_phrases:
  - "route telemetry adapter tasks"
  - "miss rate metrics tasks"
  - "d3-r4 tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/004-route-telemetry-adapter"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every build task complete with line-ref evidence for the emitter and reducer"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: routeTelemetry adapter + miss-rate metrics

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

_Emit routeTelemetry (router-replay.cjs) — 1-1.5 hours_

- [x] T001 Add `buildHubRouteTelemetry({ skillRoot, intents, router, taskLower })` helper that reads `hub-router.json.routerPolicy` + `mode-registry.json` and returns the record shape (`router-replay.cjs`) [40m] — landed `:169-210`, exported `:435`
- [x] T002 Derive `workflowMode` (= selected intents) and `matchedAliases` (selected modes' keywords that substring-match `taskLower`) inside the helper — reuse the scoring pass, do NOT re-score (`router-replay.cjs`) [15m] — `:176-184`, no re-score
- [x] T003 Derive `defaultApplied` = empty route AND `policy.defaultMode` present, as OBSERVATION ONLY (must not inject the default mode into `intents`/`resources`) and `deferReason` (`no-mode-scored` / `ambiguous-multi-axis` / null) (`router-replay.cjs`) [15m] — `:196-199`, observation-only, route stays empty
- [x] T004 Map `backendKind` + `packet` per selected mode from `mode-registry.json`; missing registry → `[]` with `observed:true` (partial, non-fatal) (`router-replay.cjs`) [15m] — `:186-194`, registry-absent → `[]`
- [x] T005 Attach `routeTelemetry` to all three `routeSkillResources` return paths — rich record when `routerSource==='hub-router.json'`, else `{observed:false, reason:'no-hub-router'}`; unparseable early-out returns `{observed:false}` (`router-replay.cjs:380,424,428`) [20m] — three returns carry the key
- [x] T006 Guard all policy/registry reads against missing/malformed files (never throw; degrade to partial or `observed:false`) (`router-replay.cjs`) [10m] — `readJsonObject` guards, no throw path

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Carry telemetry through the scorer + reduce (score-skill-benchmark.cjs) — 2-2.5 hours_

### Carry-through (additive)
- [x] T007 Add `routeTelemetry: (obs.raw && obs.raw.routeTelemetry) || null` passthrough in `routerResultFromObservation` (`score-skill-benchmark.cjs:115`) [15m] — additive passthrough landed
- [x] T008 Copy `routerResult.routeTelemetry` onto the `scoreScenario` returned row; confirm no dimension helper reads it (`score-skill-benchmark.cjs:482`) [15m] — `routeTelemetry: routerResult.routeTelemetry || null`, no dim reads it

### Reducer metrics
- [x] T009 Add `reduceRouteTelemetry(rows)`: bin route-gold rows into unobserved / observed-correct / observed-wrong; compute `telemetryMissingRate`, `routeMissRate` (denominator = observed only), `aliasMissRate`, `bundleMissRate` with denominator-safe nulls (`score-skill-benchmark.cjs`) [50m] — `:249-294`, `routeMissRate` denominator = observed
- [x] T010 Each metric returns its split via `metricRate(...)` so unobserved and observed-wrong stay distinct (`score-skill-benchmark.cjs`) [20m] — counts `{unobserved, observed, observedWrong}` attached per rate (`:283-292`)
- [x] T011 Attach the reducer output under `advisorySignals.routeTelemetry` in `aggregate`; leave `aggregateScore`, `verdict`, `gate`, `dimensionScores`, `funnel`, and existing `advisorySignals` untouched (`score-skill-benchmark.cjs:637,650`) [20m] — also published under `runQuality.routeTelemetry`; weighted score untouched

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Emitter checks, reducer + corpus checks, no-regression + evergreen, documentation — 1-1.5 hours_

### Emitter checks
- [x] T012 Unit `buildHubRouteTelemetry`: single-mode, empty-route (`defaultApplied:true`), multi-axis (`deferReason:ambiguous-multi-axis`), registry-absent (partial), non-hub (`observed:false`) [25m] — branches exercised; `animate the menu`→single-mode motion confirmed
- [x] T013 Additive-only proof: `routeSkillResources` existing keys (`parseable`/`intents`/`resources`/`missingResources`/`scores`/`surface`) byte-identical pre vs post for one hub + one non-hub skill [15m] — `routeTelemetry` added as an extra key only
- [x] T014 Threading check: `obs.raw.routeTelemetry` reaches the scorer for router-mode rows — read at `routerResultFromObservation:115`; no `executor-dispatch.cjs` edit needed [15m]
- [x] T015 Integration: route-gold rows carry `routeTelemetry`, the `telemetryMissingRate=1.000` baseline collapses to a measured rate, finite `routeMissRate`/`aliasMissRate`/`bundleMissRate`; the 5 known-gap fixtures land in observed-wrong via `defaultApplied` [20m]
- [x] T016 Unit `reduceRouteTelemetry`: all-unobserved → `telemetryMissingRate=1`; empty corpus → denominator-safe nulls; orderedBundle path exercised [15m] — `metricRate` denominator-safe (`:288-292`)

### No-regression + evergreen
- [x] T017 No-regression: gated `hubRoute` stage STILL 13 pass / 5 known-gap / 0 regression; report unchanged except the additive `advisorySignals.routeTelemetry`/`runQuality.routeTelemetry` and per-row `routeTelemetry` [15m]
- [x] T018 `node --check` passes on `router-replay.cjs` and `score-skill-benchmark.cjs`; evergreen scan confirms no spec/packet/phase IDs or spec paths in code/comments [10m] — both exit 0, scan clean

### Documentation
- [x] T019 Update implementation-summary.md with the emitter/reducer evidence (line refs, metric values over the corpus) [15m] — Level 2 summary authored with line refs and the no-regression result
- [x] T020 Mark all checklist items with evidence [10m] — checklist.md fully `[x]` with per-item evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Emitter unit + additive-only proofs passing
- [x] Reducer unit + corpus integration passing
- [x] No-regression: gated `hubRoute` stage 13 pass / 5 known-gap / 0 regression unchanged; report differs only by the additive telemetry keys
- [x] `node --check` clean on both files; evergreen scan clean
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
- Explicit verification tasks (incl. additive-only + no-regression)
- COMPLETE: all tasks landed additively; hubRoute 13 pass / 5 known-gap / 0 regression unchanged
-->
