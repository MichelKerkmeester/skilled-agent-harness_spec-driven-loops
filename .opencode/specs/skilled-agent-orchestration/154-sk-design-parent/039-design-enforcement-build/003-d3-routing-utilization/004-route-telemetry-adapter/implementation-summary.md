---
title: "Implementation Summary: D3-R4 routeTelemetry adapter + miss-rate metrics"
description: "Post-build record for the additive routeTelemetry record on router-replay.cjs and the four reducer miss-rate metrics in score-skill-benchmark.cjs: what was built, the additive/no-regression proof (hubRoute 13 pass / 5 known-gap / 0 regression unchanged), and the observability framing that turns the telemetryMissingRate=1.000 baseline into a measured metric. Honest framing: the metrics are advisory/diagnostic, not a hard gate; the gated hubRoute scorer stays the gate."
trigger_phrases:
  - "route telemetry adapter implementation summary"
  - "miss rate metrics build record"
  - "routeTelemetry observability summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/004-route-telemetry-adapter"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the routeTelemetry adapter + miss-rate metrics build and verify no hubRoute regression"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-route-telemetry-adapter |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | Additive `routeTelemetry` record on `routeSkillResources` + four reducer miss-rate metrics in the scorer's advisory/runQuality blocks |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Routing was structurally scorable but **unobserved**: the replay returned no record of which mode it chose, which aliases fired, or whether it fell to the policy default, so the research baseline `telemetryMissingRate=1.000` meant a miss could not be told apart from silence. This phase makes routing observability measurable. The replay now emits a self-contained `routeTelemetry` record, and the scorer reduces it into four miss-rate metrics — all strictly additive, with the gated `hubRoute` scorer's 13 pass / 5 known-gap / 0 regression result unchanged.

### routeTelemetry record on the replay

`buildHubRouteTelemetry({ skillRoot, intents, router, taskLower })` (`router-replay.cjs:169`) assembles the record from inputs the router already computed plus two read-only sibling JSON files. The record carries `observed`, `source`, `workflowMode` (the selected intents), `matchedAliases` (the selected modes' keywords that substring-match the task), `defaultApplied`, `deferReason`, `backendKind`, and `packet` (`:201-210`). It rides every `routeSkillResources` return as an extra key: the rich record for hub-routed skills, `{ observed: false, reason: 'no-hub-router' }` for skills with no hub-router projection (`:171`), and `{ observed: false, reason: 'router-unparseable' }` for the unparseable early-out (`:380`). Every existing return field (`parseable`, `intents`, `resources`, `missingResources`, `scores`, `surface`) is byte-for-byte unchanged (`:424`, `:428`). `buildHubRouteTelemetry` is exported (`:435`) so the helper is unit-testable.

For `animate the menu` against sk-design the record reads `workflowMode: ["motion"]`, `defaultApplied: false`, `backendKind: ["reference-base"]`, `packet: ["design-motion"]` — concrete proof the replay now reports the chosen route rather than staying silent.

### Four miss-rate metrics in the scorer

`reduceRouteTelemetry(rows)` (`score-skill-benchmark.cjs:249`) bins every route-gold row into exactly one of unobserved / observed-correct / observed-wrong and returns four rates: `telemetryMissingRate` (`unobserved / total`), `routeMissRate` (`observedWrong / observed` — denominator is **observed only** so silence cannot dilute the mis-route rate), `aliasMissRate`, and `bundleMissRate` (`:285-288`). The reducer threads the record forward additively: `routeTelemetry: (obs.raw && obs.raw.routeTelemetry) || null` in `routerResultFromObservation` (`:115`) and `routeTelemetry: routerResult.routeTelemetry || null` onto the scored row (`:482`). `aggregate()` publishes the reduced result under `advisorySignals.routeTelemetry` (`:637`) and `runQuality.routeTelemetry` (`:650`) — both advisory/diagnostic blocks, NOT the weighted `aggregateScore`, `verdict`, or `gate`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modified | Added `buildHubRouteTelemetry` + attached the additive `routeTelemetry` record to every `routeSkillResources` return path; existing fields unchanged |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modified | Added `reduceRouteTelemetry` + the four miss-rate metrics, threaded the record onto each row, published it under the advisory/runQuality blocks (not the weighted score) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) added the additive emitter and reducer, then the orchestrator verified acceptance INDEPENDENTLY rather than trusting the claim. The replay was driven against sk-design and confirmed to emit `routeTelemetry` for the corpus — for `animate the menu` the record showed `workflowMode: ["motion"]`, `defaultApplied: false`, `backendKind: ["reference-base"]`, `packet: ["design-motion"]`. The critical no-regression check re-ran the gated `hubRoute` stage and confirmed it STILL reports 13 pass / 5 known-gap / 0 regression: `defaultApplied` is observation-only and did NOT inject the policy default into `intents`, so the scorer's `silent-default` detection (which keys off an empty returned route) is preserved and the gate did not move. Both files passed `node --check` clean, and an evergreen scan over the diff found no spec/packet/phase IDs or `specs/` paths. Scope held to exactly the two files — `router-replay.cjs` and `score-skill-benchmark.cjs` — with no third-file plumbing needed because the router-mode dispatch already nests the full router result at `obs.raw`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make `defaultApplied` observation-only, never inject the default mode into `intents`/`resources` | Injecting it would have made empty routes look filled, regressing the `hubRoute` scorer's `silent-default` detection; observing it keeps the gate honest while still measuring how often the default would fire |
| Ride the metrics on the advisory/runQuality blocks, not the weighted score | Telemetry miss-rates are diagnostic; folding them into `aggregateScore` or the verdict would make a measurement masquerade as a gate. The gated `hubRoute` scorer stays the only routing gate |
| Split `routeMissRate` denominator to observed rows only | An "unobserved" row is silence, not a mis-route; dividing mis-routes by observed-only keeps silence from diluting or inflating the rate, which is the unobserved-vs-observed-wrong distinction the research demanded |
| Attach `routeTelemetry` as an extra key, leaving every existing return field byte-identical | Additive-only is the no-regression contract; any non-hub or non-sk-design consumer keeps its prior shape and its prior score |
| Keep the change to two files by reading `obs.raw.routeTelemetry` | The router-mode dispatch already forwards the full router result at `obs.raw`, so the record is reachable without editing `executor-dispatch.cjs`; a third-file change would have widened scope for no gain |
| Defer `proofFailRate` to the SOURCE PROOF phase (D3-R6) | It depends on a content-bound proof payload that does not exist yet; computing it now would require fields not present, so it is flagged as deferred rather than stubbed |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `routeTelemetry` emitted for sk-design with chosen `workflowMode` + boolean `defaultApplied` | PASS, `animate the menu`→`workflowMode:["motion"]`, `defaultApplied:false`, `backendKind:["reference-base"]`, `packet:["design-motion"]` |
| Existing `routeSkillResources` fields unchanged (additive-only) | PASS, `parseable`/`intents`/`resources`/`missingResources`/`scores`/`surface` byte-identical; `routeTelemetry` added as an extra key (`router-replay.cjs:424,428`) |
| Non-hub / unparseable skills emit inert telemetry | PASS, `{observed:false, reason:'no-hub-router'}` (`:171`) and `{observed:false, reason:'router-unparseable'}` (`:380`) |
| Reducer computes the four metrics with the observed-only denominator | PASS, `telemetryMissingRate`/`routeMissRate`/`aliasMissRate`/`bundleMissRate` (`score-skill-benchmark.cjs:285-288`); `routeMissRate` denominator = observed |
| Metrics ride the advisory/runQuality blocks, not the weighted score | PASS, attached under `advisorySignals.routeTelemetry` (`:637`) and `runQuality.routeTelemetry` (`:650`); `aggregateScore`/`verdict`/`gate` untouched |
| CRITICAL no-regression: gated `hubRoute` stage unchanged | PASS, STILL 13 pass / 5 known-gap / 0 regression; `defaultApplied` observation-only did not inject into `intents`, so `silent-default` detection is preserved |
| `node --check` on both edited files | PASS, `router-replay.cjs` and `score-skill-benchmark.cjs` exit 0 |
| Evergreen scan (no spec/packet/phase IDs) | PASS, no identifiers or `specs/` paths in the diff |
| Scope held to two files | PASS, only `router-replay.cjs` + `score-skill-benchmark.cjs`; `executor-dispatch.cjs` untouched |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The metrics are advisory, not a gate.** `telemetryMissingRate`/`routeMissRate`/`aliasMissRate`/`bundleMissRate` ride the advisory and `runQuality` blocks and are never summed into `aggregateScore` or the verdict. They make routing observability measurable; the gated `hubRoute` scorer remains the routing gate.
2. **`defaultApplied` reports, it does not route.** It is true only as an observation that the empty route would have fallen to the policy default. It deliberately does not inject that default into `intents`/`resources`, so the returned route stays empty and the `silent-default` detection still fires.
3. **`proofFailRate` is deferred to D3-R6.** It depends on the content-bound SOURCE PROOF payload introduced by that phase; it is flagged as deferred here, not stubbed.
4. **`backendKind`/`packet` degrade to `[]` when the registry is absent.** A missing or malformed `mode-registry.json` leaves both arrays empty while `observed` stays `true` — telemetry is partial, not unobserved, and never throws.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the additive routeTelemetry emitter (router-replay.cjs) and the four reducer miss-rate metrics (score-skill-benchmark.cjs); strictly additive, hubRoute 13 pass / 5 known-gap / 0 regression unchanged; defaultApplied is observation-only; metrics are advisory/diagnostic, the gated hubRoute scorer stays the gate
-->
</content>
</invoke>
