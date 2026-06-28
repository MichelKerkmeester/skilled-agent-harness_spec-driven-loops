---
title: "Plan: routeTelemetry adapter + miss-rate metrics"
description: "Emit an additive routeTelemetry record from router-replay.cjs and add reducer miss-rate metrics in score-skill-benchmark.cjs that separate unobserved from observed-wrong routes; strictly additive, no-regression on existing output."
trigger_phrases:
  - "route telemetry adapter plan"
  - "miss rate metrics design build"
  - "d3-r4 plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/004-route-telemetry-adapter"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark the routeTelemetry adapter + miss-rate metrics plan complete with build evidence"
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
# Plan: routeTelemetry adapter + miss-rate metrics

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), pure functions, no external deps |
| **Emitter target** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` |
| **Reducer/metrics target** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` |
| **Consumes (read-only)** | `sk-design/hub-router.json` (routerPolicy: defaultMode/outcomes/tieBreak), `sk-design/mode-registry.json` (per-mode backendKind/packet), the route-gold corpus `fixtures/sk-design/*.private.json` |
| **Testing** | Node replay over the 18-fixture sk-design route-gold corpus (17 `single` + 1 `orderedBundle`, 5 known-gap) plus a non-sk-design no-op control |

### Overview

Hub routing is structurally scorable (the D1 hub-router projection and the D2 gated `hubRoute` stage already landed) but it is **unobserved**: `routeSkillResources` returns no record of *which* mode it chose, *which* aliases fired, or *whether it fell to the policy default*. The measured baseline is `telemetryMissingRate=1.000` across 55 prompt scenarios — a miss cannot be distinguished from silence, so the residual live miss-rate stays assumed instead of measured.

This plan does two strictly additive things. (1) `router-replay.cjs` emits a `routeTelemetry` record `{observed, workflowMode, matchedAliases, defaultApplied, deferReason, backendKind, packet, source}` as an **extra key** on the existing `routeSkillResources` return — every existing field (`parseable`, `intents`, `resources`, `missingResources`, `scores`, `surface`) is byte-for-byte unchanged, and skills without a hub-router projection emit `routeTelemetry: { observed: false, reason: 'no-hub-router' }`. (2) `score-skill-benchmark.cjs` threads that record onto each scenario row and reduces it into miss-rate metrics — `telemetryMissingRate`, `routeMissRate`, `aliasMissRate`, `bundleMissRate` — each reported with an explicit **unobserved vs observed-wrong** split so silence never masquerades as a pass. The metrics ride an additive advisory key; the weighted aggregate, verdict, and gate are untouched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Emit point located: `routeSkillResources` returns carry the new key (`router-replay.cjs:380` unparseable early-out, `:424` surface-layout path, `:428` default path) — all carry `routeTelemetry`
- [x] Hub provenance confirmed: rich telemetry is emitted only when `router.routerSource === 'hub-router.json'`; every other skill gets `{observed:false, reason:'no-hub-router'}` (`router-replay.cjs:170-171`) — no behavior change
- [x] Policy source confirmed: `buildHubRouteTelemetry` reads `hub-router.json.routerPolicy` (`:175`) and `mode-registry.json` per-mode `backendKind`/`packet` (`:186-194`), read-only
- [x] Threading source confirmed: `obs.raw.routeTelemetry` is reachable WITHOUT editing `executor-dispatch.cjs` — read in `routerResultFromObservation` (`score-skill-benchmark.cjs:115`)
- [x] Reduce point located: `aggregate()` publishes `advisorySignals.routeTelemetry` (`:637`) + `runQuality.routeTelemetry` (`:650`); per-row carry-through at `routerResultFromObservation` (`:115`) and `scoreScenario` return (`:482`)
- [x] Corpus confirmed: route-gold rows selected by `dims.hubRoute.applicable` in `reduceRouteTelemetry` (`:250`); the 5 known-gap fixtures land in observed-wrong via `defaultApplied`

### Definition of Done
- [x] `routeSkillResources` returns `routeTelemetry` for sk-design with chosen `workflowMode` + boolean `defaultApplied`; non-hub skills return `{observed:false}` — `animate the menu`→`workflowMode:["motion"]`, `defaultApplied:false`, `backendKind:["reference-base"]`, `packet:["design-motion"]`
- [x] Existing `routeSkillResources` fields are byte-identical pre vs post (additive-only) — `parseable`/`intents`/`resources`/`missingResources`/`scores`/`surface` unchanged; `routeTelemetry` added as an extra key (`:424,428`)
- [x] The reducer reports finite `telemetryMissingRate`/`routeMissRate`/`aliasMissRate`/`bundleMissRate` — `reduceRouteTelemetry` (`:285-288`) collapses the `telemetryMissingRate=1.000` baseline to a measured rate
- [x] Each metric carries an explicit `{ unobserved, observed, observedWrong }` split — `metricRate(...)` attaches the counts; `routeMissRate` denominator is observed-only (`:286`)
- [x] NO-REGRESSION: gated `hubRoute` stage STILL 13 pass / 5 known-gap / 0 regression; `aggregateScore`/`verdict`/`gate`/`dimensionScores`/`funnel` unchanged — telemetry rides advisory/`runQuality` only
- [x] `node --check` passes on both edited files — `router-replay.cjs` and `score-skill-benchmark.cjs` exit 0
- [x] Code and comments carry no spec/packet/phase IDs or spec paths — evergreen scan clean across the diff

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two additive surfaces. The emitter builds a self-contained telemetry record from inputs the router already computed (the scored intents) plus two read-only sibling JSON files; the reducer treats that record as advisory evidence and folds it into miss-rate counters with a strict three-bucket model. Neither surface mutates an existing field or an existing score.

### Key Components

- **`buildHubRouteTelemetry({ skillRoot, intents, router, taskLower })`** (new helper, `router-replay.cjs`): assembles the `routeTelemetry` record. Reads `hub-router.json.routerPolicy` (for `defaultMode`/`outcomes`) and `mode-registry.json` (for per-mode `backendKind`/`packet`) from `skillRoot`. Pure read; never writes.
- **`routeSkillResources(...)`** (`router-replay.cjs`): after computing `intents`, attach `routeTelemetry`. When `router.routerSource === 'hub-router.json'` build the rich record; otherwise attach `{ observed: false, reason: 'no-hub-router' }`. The attach is the ONLY change to each of the three return statements.
- **`routerResultFromObservation(obs)`** (`score-skill-benchmark.cjs:109`): add an additive `routeTelemetry: (obs.raw && obs.raw.routeTelemetry) || null` field so router/CI-mode rows carry the record forward.
- **`scoreScenario(...)`** (`score-skill-benchmark.cjs:341`): copy `routerResult.routeTelemetry` onto the returned row (additive `row.routeTelemetry`); no dim is recomputed.
- **`reduceRouteTelemetry(rows)`** (new helper, `score-skill-benchmark.cjs`): the metrics reducer. Iterates route-gold rows, bins each into unobserved / observed-correct / observed-wrong, and returns the four rates plus their split counts.
- **`aggregate(...)`** (`score-skill-benchmark.cjs:458`): call `reduceRouteTelemetry(rows)` and attach the result under `advisorySignals.routeTelemetry` (advisory, NOT summed into `aggregateScore` or the verdict).

### routeTelemetry record shape (emitted by `routeSkillResources`)

```
routeTelemetry: {
  observed:       boolean,        // false for skills with no hub-router projection
  source:         "hub-router",   // provenance tag
  workflowMode:   string[],       // the selected modes (= router intents); [] when none scored
  matchedAliases: string[],       // alias-class keywords that were substrings of the task, for the selected modes
  defaultApplied: boolean,        // true when workflowMode is empty AND routerPolicy.defaultMode exists
  deferReason:    string | null,  // "no-mode-scored" when empty; "ambiguous-multi-axis" when >1 near-tied; else null
  backendKind:    string[],       // per selected mode, from mode-registry; [] when registry absent
  packet:         string[]        // per selected mode, from mode-registry; [] when registry absent
}
```

Derivation rules (no re-scoring — reuse the pass the router already ran):
- `workflowMode` = the selected `intents` (the hub projection keys intents by mode).
- `matchedAliases` = for each selected mode, the `router.intentSignals[mode].keywords` that are substrings of `taskLower`.
- `defaultApplied` = `workflowMode.length === 0 && policy.defaultMode != null`. **Observation only** — it does NOT inject `defaultMode` into `intents`/`resources`; the returned route stays empty so the `hubRoute` scorer's `silent-default` detection (which keys off `actual.length === 0`) is preserved.
- `deferReason` = `"no-mode-scored"` when `workflowMode` is empty; `"ambiguous-multi-axis"` when `workflowMode.length > 1` (the ambiguity-delta tie); else `null`.
- `backendKind` / `packet` = `mode-registry.json` lookup keyed by `workflowMode`. Registry missing → both stay `[]` while `observed` stays `true` (telemetry is partial, not unobserved).

### Miss-rate metrics (computed by `reduceRouteTelemetry`)

Scope = route-gold rows only (those whose `expected` carries `workflowMode`/`routeOutcome`). Each row is binned into exactly one of three buckets:

| Bucket | Condition |
|--------|-----------|
| **unobserved** | `routeTelemetry` absent OR `observed:false` (no evidence the router was watched) |
| **observed-correct** | telemetry present AND routed `workflowMode` set equals the expected route |
| **observed-wrong** | telemetry present AND routed `workflowMode` set differs from expected (includes `defaultApplied:true` where a real mode was expected) |

Rates (each reported as `{ rate, unobserved, observed, observedWrong, numerator, denominator }`):

- **`telemetryMissingRate`** = `unobserved / totalRouteGold`. The headline baseline metric; `1.000` today, `0` once sk-design emits telemetry for its corpus.
- **`routeMissRate`** = `observedWrong / observed`. Denominator is **observed only** so silence cannot dilute or inflate the mis-route rate — this is the "observed-wrong" axis the research demands be reported separately from "unobserved".
- **`aliasMissRate`** = (observed route-gold rows whose `matchedAliases` is empty while a mode was expected) / observed. Catches modes that routed by some other class but with zero alias coverage (the 46.5% uncovered-keyword symptom made measurable).
- **`bundleMissRate`** = (observed `orderedBundle` rows whose routed mode set != the expected bundle) / observed `orderedBundle` rows. Returns `null` denominator-safe when no bundle gold is observed.

`proofFailRate` (named in spec.md §1 / research §6) is **out of scope here** — it depends on the content-bound SOURCE PROOF payload introduced by D3-R6, which this packet does not add. Computing it now would require fields that do not yet exist; it is deferred to that packet. (Flagged, not silently dropped.)

### Data Flow

1. `routeSkillResources` computes `intents`; `buildHubRouteTelemetry` assembles `routeTelemetry`; the record rides each return statement as an additive key.
2. Router/CI mode: `dispatchScenario` already nests the full router result at `obs.raw` — `obs.raw.routeTelemetry` flows untouched.
3. `routerResultFromObservation` lifts `routeTelemetry` onto the reconstructed `routerResult`; the legacy fixtures path already carries it directly.
4. `scoreScenario` copies `routerResult.routeTelemetry` onto the row (additive); no dimension reads it.
5. `aggregate` calls `reduceRouteTelemetry(rows)` and publishes `advisorySignals.routeTelemetry`; the verdict/aggregate/gate are computed exactly as before.

### Threading decision (why no third file)

The natural worry is that telemetry must be plumbed through `executor-dispatch.cjs`. It does not: the router-mode dispatch already returns `raw: router` (`executor-dispatch.cjs:91`), so the full record — including the new key — is reachable at `obs.raw.routeTelemetry`. **Recommended:** read it there in `routerResultFromObservation`, keeping the change to exactly two files. A dedicated `observedRouteTelemetry` field on the observation is the documented fallback ONLY if verification (T010) shows `obs.raw` is stripped for router rows; that fallback would touch `executor-dispatch.cjs` and must be flagged before adoption.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Emit routeTelemetry (router-replay.cjs)
- [x] Added `buildHubRouteTelemetry({ skillRoot, intents, router, taskLower })` reading `hub-router.json.routerPolicy` + `mode-registry.json`, deriving `workflowMode`/`matchedAliases`/`defaultApplied`/`deferReason`/`backendKind`/`packet` (`:169-210`)
- [x] Attached `routeTelemetry` to every `routeSkillResources` return path (`:380` unparseable, `:424` surface, `:428` default); rich record when `routerSource==='hub-router.json'`, else `{observed:false, reason:'no-hub-router'}` (`:171`)
- [x] Guarded registry/policy reads (missing file → partial record with `observed:true`, `backendKind:[]`, never throws); unparseable early-out returns `{observed:false, reason:'router-unparseable'}`

### Phase 2: Carry telemetry through the scorer (score-skill-benchmark.cjs)
- [x] Added additive `routeTelemetry: (obs.raw && obs.raw.routeTelemetry) || null` passthrough in `routerResultFromObservation` (`:115`)
- [x] Copied `routerResult.routeTelemetry` onto the `scoreScenario` returned row (`:482`); no dimension helper reads it

### Phase 3: Reduce into miss-rate metrics (score-skill-benchmark.cjs)
- [x] Added `reduceRouteTelemetry(rows)` binning route-gold rows into unobserved / observed-correct / observed-wrong; computes `telemetryMissingRate`/`routeMissRate`/`aliasMissRate`/`bundleMissRate` with denominator-safe `metricRate` (`:249-294`)
- [x] Attached the result under `advisorySignals.routeTelemetry` (`:637`) + `runQuality.routeTelemetry` (`:650`); `aggregateScore`/`verdict`/`gate`/`dimensionScores`/`funnel` untouched

### Phase 4: Verification
- [x] Replayed sk-design: `routeTelemetry` present per scenario, `telemetryMissingRate` collapses from the `1.000` baseline to a measured rate, finite `routeMissRate`; the 5 known-gap fixtures land in observed-wrong via `defaultApplied`
- [x] No-regression: gated `hubRoute` stage STILL 13 pass / 5 known-gap / 0 regression; report unchanged except the additive `advisorySignals.routeTelemetry`/`runQuality.routeTelemetry` and per-row `routeTelemetry`
- [x] Additive-only proof on `routeSkillResources`: existing fields byte-identical; `routeTelemetry` added as an extra key for hub and non-hub skills
- [x] `node --check` passes on both files; evergreen scan clean (no spec/packet/phase IDs or paths)

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (emitter) | `buildHubRouteTelemetry`: single-mode, empty (defaultApplied), multi-axis (deferReason), registry-absent (partial), non-hub (observed:false) | Node assertions / inline harness |
| Unit (reducer) | `reduceRouteTelemetry`: all-unobserved → `telemetryMissingRate=1`; mixed → correct `routeMissRate` denominator (observed only); orderedBundle path; empty corpus → denominator-safe nulls | Node assertions |
| Integration (corpus) | Full scorer over `fixtures/sk-design/*`: 18 rows carry telemetry, `telemetryMissingRate=0`, finite `routeMissRate`/`aliasMissRate`/`bundleMissRate` | `router-replay` + `scoreScenario` + `aggregate` |
| Regression (no-op) | One non-sk-design fixture: serialized report identical pre/post except the additive telemetry key(s) | Diff of serialized report |
| Additive-only | `routeSkillResources` existing keys byte-identical for a hub and a non-hub skill before vs after | Diff of serialized result |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `router-replay.cjs` `parseRouter` / `projectHubRouter` (`routerSource`) | Internal (landed) | Green | Without `routerSource==='hub-router.json'` the emitter cannot tell hub from non-hub; telemetry would degrade to `observed:false` everywhere |
| `sk-design/hub-router.json` `routerPolicy` | Internal (landed) | Green | No `defaultMode`/`outcomes` → `defaultApplied`/`deferReason` cannot be derived |
| `sk-design/mode-registry.json` per-mode `backendKind`/`packet` | Internal (landed) | Green | `backendKind`/`packet` stay `[]`; record stays `observed:true` (partial, non-fatal) |
| `dispatchScenario` `raw: router` passthrough (`executor-dispatch.cjs:91`) | Internal (landed) | Green | If `raw` is stripped, telemetry must be plumbed via a new observation field (see Risk) |
| Route-gold corpus `fixtures/sk-design/*.private.json` | Internal (landed) | Green | No `workflowMode`/`routeOutcome` → reducer has no route-gold denominator |

### Risk: telemetry threading through the observation

The reducer depends on `obs.raw.routeTelemetry` reaching `routerResultFromObservation`. The plan reads it from the `raw` field `dispatchScenario` already attaches. If verification (T010) shows the incoming observation omits `raw` for router rows, the implementer MUST stop and escalate (logic-sync) rather than silently widening scope; the sanctioned narrow alternative is an explicit `observedRouteTelemetry` field on the router-mode observation, which is an `executor-dispatch.cjs` change outside this file pair's scope and requires approval.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the no-op control diff shows any change beyond the additive telemetry key(s), or `routeSkillResources` existing fields differ pre vs post.
- **Procedure**: revert the two-file change (`router-replay.cjs`, `score-skill-benchmark.cjs`). No data migration, no fixture edits, no state to unwind. The scorer returns to the unobserved-routing baseline (`telemetryMissingRate=1.000`).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Emit) ──> Phase 2 (Carry-through) ──> Phase 3 (Reduce) ──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Emit telemetry | None | Carry-through |
| Carry-through | Emit telemetry | Reduce |
| Reduce metrics | Carry-through | Verify |
| Verify | Reduce metrics | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Emit telemetry (`buildHubRouteTelemetry` + 3 return sites) | Medium | 1-1.5 hours |
| Carry-through (2 additive passthroughs) | Low | 30-45 minutes |
| Reduce metrics (`reduceRouteTelemetry` + advisory attach) | Medium | 1-1.5 hours |
| Verification (corpus + no-op + additive-only) | Medium | 1-1.5 hours |
| **Total** | | **4-5.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured before edit and diffed after — the gated `hubRoute` stage held at 13 pass / 5 known-gap / 0 regression (the byte-identical no-op reference)
- [x] Additive-only reference confirmed — existing `routeSkillResources` fields byte-identical for hub + non-hub skills; only `routeTelemetry` added
- [x] Feature flag — N/A confirmed: additive emitter + advisory reducer key, inert for non-hub skills and never folded into the verdict
- [x] Monitoring — N/A confirmed: CI-time deterministic scorer, no runtime surface

### Rollback Procedure
1. **Immediate**: `git checkout -- router-replay.cjs score-skill-benchmark.cjs` (two-file revert)
2. **Verify**: re-run the no-op control + the additive-only diff; confirm both match the pre-change baselines
3. **Notify**: record in the implementation summary why the adapter was reverted

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: none required; the change touches two scripts and reads (never writes) `hub-router.json` / `mode-registry.json` / fixtures

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
- COMPLETE: routeTelemetry emitter + reducer miss-rate metrics landed additively; hubRoute 13 pass / 5 known-gap / 0 regression unchanged
-->
