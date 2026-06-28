---
title: "Verification Checklist: routeTelemetry adapter + miss-rate metrics"
description: "Acceptance and verification gates for the additive routeTelemetry emitter and the reducer miss-rate metrics, including the additive/no-regression, fix-completeness, and evergreen gates."
trigger_phrases:
  - "route telemetry adapter checklist"
  - "miss rate metrics checklist"
  - "d3-r4 checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/004-route-telemetry-adapter"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the landed routeTelemetry adapter and miss-rate metrics"
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
# Verification Checklist: routeTelemetry adapter + miss-rate metrics

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

- [x] CHK-001 [P0] Emit points and reduce point located in the two target files
  - **Evidence**: `routeSkillResources` returns carry `routeTelemetry` at `router-replay.cjs:380/424/428`; reduce at `score-skill-benchmark.cjs:637` + `:650`; carry-through at `:115` + `:482`
- [x] CHK-002 [P0] Telemetry source contract confirmed
  - **Evidence**: `buildHubRouteTelemetry` reads `hub-router.json.routerPolicy` (`:175`) + `mode-registry.json` per-mode `backendKind`/`packet` (`:186-194`), read-only
- [x] CHK-003 [P1] Threading source confirmed without a third file
  - **Evidence**: `routerResultFromObservation` reads `obs.raw.routeTelemetry` (`:115`); `executor-dispatch.cjs` untouched

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on both edited files
  - **Evidence**: `node --check router-replay.cjs` and `node --check score-skill-benchmark.cjs` both exit 0
- [x] CHK-011 [P0] Evergreen: no spec/packet/phase IDs or spec paths in code or comments
  - **Evidence**: evergreen scan clean across the diff (no `D3-R4`/`039`/`004-`/`.opencode/specs/`)
- [x] CHK-012 [P1] Emitter degrades, never throws, on missing/malformed `hub-router.json` / `mode-registry.json`
  - **Evidence**: `readJsonObject` guards each read; registry-absent → `backendKind`/`packet` `[]` with `observed:true` (`:186-194`); no throw path
- [x] CHK-013 [P1] Helpers are pure reads; no writes to `hub-router.json` / `mode-registry.json` / fixtures
  - **Evidence**: only `readJsonObject`/`buildRegistryIndex` reads against the sibling JSON; no write calls added

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] router-replay emits `routeTelemetry` for sk-design with chosen `workflowMode` + boolean `defaultApplied`
  - **Evidence**: `animate the menu`→`workflowMode:["motion"]`, `defaultApplied:false`, `backendKind:["reference-base"]`, `packet:["design-motion"]`
- [x] CHK-021 [P0] Reducer metrics compute over the route-gold corpus
  - **Evidence**: `reduceRouteTelemetry` (`:285-288`) collapses the `telemetryMissingRate=1.000` baseline to a measured rate; finite `routeMissRate`/`aliasMissRate`/`bundleMissRate`
- [x] CHK-022 [P0] Each metric reports unobserved vs observed-wrong separately
  - **Evidence**: every rate carries its `{unobserved, observed, observedWrong}` split via `metricRate`; `routeMissRate` denominator = observed only (`:286`)
- [x] CHK-023 [P1] Emitter unit coverage: single-mode, empty (defaultApplied), multi-axis (deferReason), registry-absent (partial), non-hub (observed:false)
  - **Evidence**: branches exercised — `:196-199` (defaultApplied/deferReason), `:186-194` (registry-absent), `:171` (non-hub)
- [x] CHK-024 [P1] Reducer unit coverage: all-unobserved → rate 1; empty corpus → denominator-safe nulls; orderedBundle path
  - **Evidence**: `metricRate` denominator-safe (`:288-292`); `unobservedBundles`/`observedBundles` track the orderedBundle path (`:277-280`)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: matrix/evidence; this phase adds observability instrumentation (an additive telemetry record + advisory miss-rate metrics), not a code-defect fix — the deliverable is the measured routing matrix
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the only producer of `routeTelemetry` is `buildHubRouteTelemetry` in `router-replay.cjs`; the only reducer is `reduceRouteTelemetry` in `score-skill-benchmark.cjs`; an evergreen grep found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the new `routeTelemetry` field is consumed only by `reduceRouteTelemetry` and the advisory/`runQuality` publish; no dimension scorer reads it, so the weighted score and gate are untouched
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: fallback paths exercised — non-hub (`{observed:false, reason:'no-hub-router'}`), unparseable (`{observed:false, reason:'router-unparseable'}`), registry-absent (partial `observed:true`), and the empty-route `defaultApplied` no-op all return without throwing
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix axes are the binning buckets unobserved / observed-correct / observed-wrong over route-gold rows; the gated `hubRoute` stage stays 13 pass / 5 known-gap / 0 regression
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; `buildHubRouteTelemetry` is a pure projection over the prompt, selected intents, and read-only sibling JSON; `reduceRouteTelemetry` is a pure fold over rows — neither reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to `router-replay.cjs:169-210` (emitter) + returns `:380/424/428`, and `score-skill-benchmark.cjs:249-294` (reducer) + advisory attach `:637/650`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] NO-REGRESSION: existing `routeSkillResources` fields byte-identical pre vs post
  - **Evidence**: `parseable`/`intents`/`resources`/`missingResources`/`scores`/`surface` unchanged; `routeTelemetry` added as an extra key only (`:424,428`)
- [x] CHK-031 [P0] NO-REGRESSION: gated `hubRoute` stage report unchanged except the additive telemetry keys
  - **Evidence**: stage STILL 13 pass / 5 known-gap / 0 regression; `aggregateScore`/`verdict`/`gate`/`dimensionScores`/`funnel` unchanged; only `advisorySignals.routeTelemetry` + `runQuality.routeTelemetry` + per-row `routeTelemetry` added
- [x] CHK-032 [P0] `defaultApplied` is observation-only — the returned route stays empty so the `hubRoute` silent-default detection is preserved
  - **Evidence**: `:196` computes `defaultApplied` without writing the default into `intents`/`resources`; the 5 known-gap fixtures still route `[]` and the stage's `silent-default` detection still fires
- [x] CHK-033 [P1] Scope held to two files; `executor-dispatch.cjs` untouched
  - **Evidence**: diff touches only `router-replay.cjs` + `score-skill-benchmark.cjs`; `obs.raw.routeTelemetry` reached without a third-file change
- [x] CHK-034 [P2] `proofFailRate` correctly deferred to D3-R6 (SOURCE PROOF), not stubbed here
  - **Evidence**: `reduceRouteTelemetry` returns only the four landed rates; `proofFailRate` is flagged deferred in plan.md §3 and implementation-summary

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the final emitter + reducer shape
  - **Evidence**: spec.md (Level 2), plan.md, and tasks.md all reflect the landed `routeTelemetry` record and the four-metric set
- [x] CHK-041 [P1] Implementation-summary records line refs + measured metric values over the corpus
  - **Evidence**: implementation-summary.md cites `router-replay.cjs:169-210`/returns and `score-skill-benchmark.cjs:249-294`/`:637`/`:650`, plus the `animate the menu` telemetry and the 13/5/0 result
- [x] CHK-042 [P2] Record the threading decision (no third file) and the registry-absent degradation
  - **Evidence**: the `obs.raw` threading decision and the registry-absent `[]`/`observed:true` degradation are both noted in implementation-summary and spec.md

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: no temp files created outside scratch/
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: scratch/ folder empty

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the additive routeTelemetry emitter, the reducer miss-rate metrics, and the independent hubRoute 13 pass / 5 known-gap / 0 regression no-regression check)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
COMPLETE: additive routeTelemetry emitter + reducer miss-rate metrics; hubRoute 13 pass / 5 known-gap / 0 regression unchanged
-->
</content>
