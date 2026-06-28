---
title: "D3-R4 — routeTelemetry adapter + miss-rate metrics"
description: "Extend router-replay.cjs with an additive routeTelemetry record and add four reducer miss-rate metrics in score-skill-benchmark.cjs that separate unobserved from observed-wrong routes; strictly additive, hubRoute 13 pass / 5 known-gap / 0 regression unchanged. defaultApplied is observation-only; the metrics are advisory/diagnostic, not a hard gate."
trigger_phrases:
  - "d3-r4 route telemetry adapter"
  - "route miss rate design build"
  - "routeTelemetry observability metrics"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/004-route-telemetry-adapter"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the phase complete"
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
# D3-R4 — routeTelemetry adapter + miss-rate metrics

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hub routing was structurally scorable (the D1 hub-router projection and the D2 gated `hubRoute` stage already landed) but it was **unobserved**: `routeSkillResources` returned no record of which mode it chose, which aliases fired, or whether it fell to the policy default. The measured baseline was `telemetryMissingRate=1.000` — a miss could not be distinguished from silence, so the residual live miss-rate stayed assumed instead of measured.

### Purpose
Make routing observability measurable through two strictly additive surfaces. `router-replay.cjs` emits a `routeTelemetry` record `{observed, source, workflowMode, matchedAliases, defaultApplied, deferReason, backendKind, packet}` as an extra key on the existing `routeSkillResources` return — every existing field is byte-for-byte unchanged, and skills with no hub-router projection emit `{observed:false}`. `score-skill-benchmark.cjs` threads that record onto each scenario row and reduces it into four miss-rate metrics — `telemetryMissingRate`, `routeMissRate`, `aliasMissRate`, `bundleMissRate` — each reported with an explicit unobserved-vs-observed-wrong split so silence never masquerades as a pass. The metrics ride the advisory/`runQuality` blocks; the weighted aggregate, verdict, and gate are untouched. The honest framing: this turns the `telemetryMissingRate=1.000` baseline into a computed metric, but the metrics are advisory/diagnostic — the gated `hubRoute` scorer remains the routing gate, and its 13 pass / 5 known-gap / 0 regression result is unchanged.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `buildHubRouteTelemetry({ skillRoot, intents, router, taskLower })` helper in `router-replay.cjs` that assembles the additive `routeTelemetry` record from the already-computed intents plus read-only `hub-router.json` / `mode-registry.json`
- Attaching `routeTelemetry` to every `routeSkillResources` return path (rich record for hub skills; `{observed:false}` for non-hub and unparseable)
- `reduceRouteTelemetry(rows)` in `score-skill-benchmark.cjs` computing the four miss-rate metrics with an observed-only `routeMissRate` denominator
- Threading the record additively onto each scored row and publishing it under `advisorySignals.routeTelemetry` + `runQuality.routeTelemetry`

### Out of Scope
- Any change to the weighted `aggregateScore`, `verdict`, `gate`, `dimensionScores`, or `funnel`
- Any edit to `executor-dispatch.cjs` (the router result is already reachable at `obs.raw`)
- `proofFailRate` — it depends on the content-bound SOURCE PROOF payload introduced by D3-R6; deferred, not stubbed
- Widening `routerSignals` to close the hint-free holdouts (a later phase may do this)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | Add `buildHubRouteTelemetry`; attach the additive `routeTelemetry` record to every `routeSkillResources` return path; existing fields unchanged |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Add `reduceRouteTelemetry` + the four miss-rate metrics; thread the record onto each row; publish under the advisory/`runQuality` blocks (not the weighted score) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `routeSkillResources` emits `routeTelemetry` for hub-routed skills | Record carries `observed:true`, `workflowMode`, `matchedAliases`, boolean `defaultApplied`, `deferReason`, `backendKind`, `packet` (`router-replay.cjs:201-210`) |
| REQ-002 | Existing `routeSkillResources` fields are byte-identical pre vs post | `parseable`/`intents`/`resources`/`missingResources`/`scores`/`surface` unchanged; `routeTelemetry` added as an extra key only (`:424,428`) |
| REQ-003 | The reducer reports finite miss-rate metrics with an unobserved-vs-observed-wrong split | `telemetryMissingRate`/`routeMissRate`/`aliasMissRate`/`bundleMissRate`; `routeMissRate` denominator = observed only (`score-skill-benchmark.cjs:285-288`) |
| REQ-004 | NO-REGRESSION on the gated `hubRoute` stage | Stage STILL reports 13 pass / 5 known-gap / 0 regression; `defaultApplied` observation-only did not inject into `intents`, so `silent-default` detection is preserved |
| REQ-005 | The metrics are advisory, never folded into the weighted score | Attached under `advisorySignals.routeTelemetry` (`:637`) + `runQuality.routeTelemetry` (`:650`); `aggregateScore`/`verdict`/`gate` untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Non-hub / unparseable skills emit inert telemetry | `{observed:false, reason:'no-hub-router'}` (`:171`) and `{observed:false, reason:'router-unparseable'}` (`:380`) |
| REQ-007 | The emitter degrades, never throws, on missing/malformed policy or registry | Missing `mode-registry.json` → `backendKind`/`packet` stay `[]` with `observed:true` (partial, non-fatal) |
| REQ-008 | `node --check` clean on both files; evergreen body | Both files exit 0 under `node --check`; no spec/packet/phase IDs or `specs/` paths in the diff |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Replaying sk-design emits `routeTelemetry` per scenario — `animate the menu`→`workflowMode:["motion"]`, `defaultApplied:false`, `backendKind:["reference-base"]`, `packet:["design-motion"]`.
- **SC-002**: `reduceRouteTelemetry` collapses the `telemetryMissingRate=1.000` baseline into a measured rate and reports a finite `routeMissRate`/`aliasMissRate`/`bundleMissRate`, each carrying its `{unobserved, observed, observedWrong}` split.
- **SC-003**: The gated `hubRoute` scorer still reports 13 pass / 5 known-gap / 0 regression after the change.
- **SC-004**: The two-file diff is additive: existing `routeSkillResources` fields and the weighted `aggregateScore`/`verdict`/`gate` are unchanged; only the `routeTelemetry` key and the advisory metrics are added.
- **SC-005**: Both files pass `node --check`; the diff is evergreen (no spec/packet/phase IDs or `specs/` paths) and scoped to the two files only.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `defaultApplied` could inject the policy default into the returned route | Filling an empty route would regress the `hubRoute` scorer's `silent-default` detection and move the gate | `defaultApplied` is **observation-only** — it records that the empty route would fall to the default but never writes the default into `intents`/`resources`; the returned route stays empty and the gate is preserved |
| Risk | The miss-rate metrics could be read as a gate | A diagnostic measurement masquerading as a pass/fail would conflict with the gated `hubRoute` scorer | The metrics ride `advisorySignals`/`runQuality` only and are never summed into `aggregateScore`/`verdict`/`gate`; the framing is explicitly advisory/diagnostic |
| Risk | Silence diluting the mis-route rate | An unobserved row counted as a route would inflate or deflate `routeMissRate` | `routeMissRate` denominator is observed-only; unobserved rows are binned separately so silence never masquerades as a route |
| Risk | Threading telemetry might appear to need a third file | Editing `executor-dispatch.cjs` would widen scope | The router-mode dispatch already nests the full router result at `obs.raw`, so `obs.raw.routeTelemetry` is reachable without a third-file change |
| Dependency | `hub-router.json` `routerPolicy` + `mode-registry.json` | Source of `defaultApplied`/`deferReason`/`backendKind`/`packet` | Read-only; missing registry degrades to `[]` with `observed:true`, never throws |
| Dependency | Gated `hubRoute` scorer (D3-R2) | The routing gate the metrics sit beside | Unchanged; this phase is additive observability, not a new gate |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Additivity
- **NFR-A01**: `routeTelemetry` is an extra key on `routeSkillResources`; every existing field stays byte-identical, and the advisory metrics never touch the weighted score.

### Determinism
- **NFR-D01**: The record is derived from the pass the router already ran (selected intents + read-only sibling JSON); replaying the same prompt against the same policy/registry yields the same telemetry, with no re-scoring.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Telemetry Boundaries
- **Non-hub skill**: `{observed:false, reason:'no-hub-router'}` — inert, no behavior change.
- **Unparseable router**: the early-out return carries `{observed:false, reason:'router-unparseable'}`.
- **Registry absent**: `backendKind`/`packet` stay `[]` while `observed` stays `true` — telemetry is partial, not unobserved.

### Reducer Boundaries
- **All-unobserved corpus**: `telemetryMissingRate=1`; `routeMissRate` denominator is zero, returned denominator-safe.
- **Observed-wrong via default**: an empty route where a real mode was expected (and `defaultApplied:true`) bins as observed-wrong, not unobserved.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Two additive helpers (`buildHubRouteTelemetry`, `reduceRouteTelemetry`) plus three return-site attaches and two passthroughs across two files; no new file, no third-file plumbing.
- **Risk concentration**: The load-bearing constraint is that `defaultApplied` stays observation-only so the `hubRoute` gate does not move; correctness is proven by the unchanged 13 pass / 5 known-gap / 0 regression result and the additive-only byte-identity of the existing return fields.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `defaultApplied` inject the policy default into the returned route so empty routes resolve? **RESOLVED: No — it is observation-only. Injecting the default would fill empty routes and regress the gated `hubRoute` scorer's `silent-default` detection, which keys off `actual.length === 0`. The record reports that the default would fire without changing the returned route, so the gate stays at 13 pass / 5 known-gap / 0 regression.**
- Should the miss-rate metrics become a gate themselves? **RESOLVED: No — they are advisory/diagnostic. They ride `advisorySignals`/`runQuality` and are never summed into `aggregateScore`/`verdict`/`gate`. They make the `telemetryMissingRate=1.000` baseline measurable; the gated `hubRoute` scorer remains the routing gate.**
- Should `proofFailRate` be computed here? **RESOLVED: No — it depends on the content-bound SOURCE PROOF payload introduced by D3-R6 and would require fields that do not yet exist. It is flagged as deferred, not stubbed.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: additive routeTelemetry emitter (router-replay.cjs:169-210, returns 380/386/424/428) + four reducer miss-rate metrics (score-skill-benchmark.cjs:249-294, advisory attach 637/650); hubRoute 13 pass / 5 known-gap / 0 regression unchanged; defaultApplied observation-only; metrics advisory/diagnostic
-->
</content>
