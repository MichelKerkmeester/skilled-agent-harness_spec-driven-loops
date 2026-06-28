---
title: "D3-R2 — Gated hubRoute scorer lane"
description: "Insert a fail-closed hubRoute stage before routed-intra in score-skill-benchmark.cjs plus a suite-level routing gate so wrong-mode/silent-default/bundle-mismatch routing fails closed; the 5 hint-free standing gaps are a gold-labeled known-gap, not a block."
trigger_phrases:
  - "d3-r2 hubroute scorer"
  - "gated hub route design build"
  - "selection layer routing hard gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/002-gated-hubroute-scorer"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and mark the hubRoute gate phase complete"
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
# D3-R2 — Gated hubRoute scorer lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scorer judged hub routing only through the advisory `modePrecision` signal, which never sets `firstFailingStage`, never enters the weighted aggregate, and never moves the verdict. A wrong hub route therefore passed the suite, so the selection layer had no fail-closed gate. A route that quietly returns nothing was indistinguishable, at the verdict level, from a route that returns the right mode.

### Purpose
Insert a hard `hubRoute` stage into the scoring funnel, ordered immediately before the advisory `routed-intra` stage, that compares the replayed workflow-mode route against the scenario's route gold and emits `firstFailingStage` of `wrong-mode`, `silent-default`, or `bundle-mismatch` on a miss. A suite-level `gate.hubRoute` then sets verdict `BLOCKED-BY-ROUTING` on real routing regressions while reporting the five hint-free standing-gap fixtures as a measured known-gap rather than a block. The stage is strictly additive: it is inert for every scenario without route gold, so existing benchmark outcomes are unchanged. This is the selection-layer hard gate that the D3-R3 route-gold corpus feeds; it does NOT claim the hint-free holdouts now route.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `scoreHubRoute({ expected, routerResult })` pure helper with strict precedence: not-applicable → defer → silent-default → orderedBundle → single, with `forbiddenWorkflowModes` folded into the single/bundle checks
- Insertion of the `hubRoute` branch in `firstFailingStage` immediately before `routed-intra`, guarded by `dims.hubRoute.applicable && !dims.hubRoute.pass`, kept out of the weighted `modeAScore`
- A suite-level `gate.hubRoute = { failed, regressions, knownGaps, reason }` that splits regressions (`knownGap !== true`) from known gaps and sets verdict `BLOCKED-BY-ROUTING` only on regressions, preserving `BLOCKED-BY-STRUCTURE` precedence
- The logic-sync resolution: promote the known-gap marker to the first-class gold field `expected.knownRouteGap: true` on the 5 standing-gap fixtures so the scorer reads it on the canonical no-notes call shape

### Out of Scope
- Closing the hint-free holdouts (widening `routerSignals`); this phase gates the gap, it does not route it
- Any edit to `router-replay.cjs`, `hub-router.json`, the route-gold prompts themselves, or any live sk-design skill file
- Folding `hubRoute` into the weighted aggregate or changing the v1 dimension weights

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | `scoreHubRoute()` helper, the funnel branch before `routed-intra`, `dims.hubRoute` wiring, suite-level `gate.hubRoute`, `BLOCKED-BY-ROUTING` verdict, `runQuality.hubRouteKnownGaps` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/{holdout-audit,holdout-interface,holdout-motion,holdout-mdgen}-001.private.json` + `sk-design-mp-menu-002.private.json` | Modify | Add `expected.knownRouteGap: true` so the marker is readable on the canonical no-notes call shape (documented, approved scope deviation — see RISKS) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `hubRoute` stage fails closed against route gold | `single` miss → `wrong-mode`; empty route → `silent-default`; `orderedBundle` miss → `bundle-mismatch`; `forbiddenWorkflowModes` member present → fail |
| REQ-002 | The stage is a no-op without route gold | `routeOutcome == null` OR `workflowMode == null` → `{ applicable: false, pass: true }`; non-route-gold report byte-identical pre/post |
| REQ-003 | `hubRoute` is ordered before `routed-intra` and out of `modeAScore` | `firstFailingStage` returns the `hubRoute` label ahead of `routed-intra`; the weighted aggregate and v1 weights are unchanged |
| REQ-004 | The suite gate blocks real routing regressions only | `gate.hubRoute.failed === regressions > 0`; verdict `BLOCKED-BY-ROUTING` when a non-known-gap miss exists; `BLOCKED-BY-STRUCTURE` precedence preserved |
| REQ-005 | The 5 standing gaps are a counted known-gap, not a block | The `knownRouteGap` fixtures report `firstFailingStage='silent-default'`, are classified `knownGaps`, and do NOT force `BLOCKED-BY-ROUTING` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Known-gap marker reachable on the canonical call shape | `expected.knownRouteGap: true` present on the 5 standing-gap private fixtures; scorer reads `expected.knownRouteGap` as authoritative |
| REQ-007 | Measured known-gap count is surfaced | `runQuality.hubRouteKnownGaps` carries the count; the headline bottleneck reclassifies to `routing_known_gap` (P3) when only known gaps fail |
| REQ-008 | Evergreen body | No spec/packet/phase IDs or `specs/` paths in the scorer diff or the fixture edits; `node --check` clean |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the canonical no-notes call shape (`scoreScenario({ ..., expected: fx.expected })`), 13 fixtures pass the `hubRoute` stage with no `hubRoute` label.
- **SC-002**: The 5 `knownRouteGap` fixtures (`holdout-audit/interface/motion/mdgen` + `mp-menu-002`) each report `firstFailingStage='silent-default'`, are counted as `knownGaps`, and yield `regressions=0` with `gate.hubRoute.failed=false`.
- **SC-003**: A synthetic real mis-route (route gold present, replayed intents wrong, no `knownRouteGap`) yields `regressions=1` and verdict `BLOCKED-BY-ROUTING`.
- **SC-004**: A non-sk-design fixture with no route gold scores byte-identical before and after (aggregateScore, verdict, funnel, per-row `firstFailingStage`, dimensionScores).
- **SC-005**: The change set is `score-skill-benchmark.cjs` plus the 5 `*.private.json` `knownRouteGap` edits; `node --check` passes and the diff is evergreen-clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk (resolved) | LOGIC-SYNC: the canonical runner `run-skill-benchmark.cjs` threads `expected` but not top-level `notes` | A `notes.status` known-gap marker is invisible on the real call path, so the known-gap split could not be computed | RESOLVED: promote the marker to the first-class gold field `expected.knownRouteGap: true` on the 5 standing-gap fixtures; the scorer reads `expected.knownRouteGap` as authoritative. Escalated and resolved rather than silently widened |
| Risk | Standing gaps mistaken for routing regressions | The suite would block on the 5 hint-free holdouts that the corpus already documents | Split applicable failures into `regressions` (`knownGap !== true`) vs `knownGaps`; block only on regressions; surface the known-gap count in `runQuality` |
| Risk | A future standing-gap fixture missing `expected.knownRouteGap` | Its silent-default is treated as a real regression and blocks the suite | Intentional fail-closed default; documented in Known Limitations so authors set the gold field explicitly |
| Risk | Scope deviation into the 5 D3-R3 fixtures | Edits land outside the primary target file | Documented, approved deviation: the fixture edits are the sanctioned narrow resolution to the runner no-notes logic-sync, recorded in implementation-summary.md |
| Dependency | `router-replay.cjs` `routerResult.intents` projection | Replayed-route source the stage compares against | Read-only; reused in-place, no new filesystem/`skillRoot` coupling |
| Dependency | D3-R3 route-gold corpus (`fixtures/sk-design/*.private.json`) | Supplies `workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`knownRouteGap` | Landed; this stage consumes it as the standing input |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Additivity
- **NFR-A01**: The `hubRoute` stage is inert for every scenario without route gold; existing benchmark reports are byte-identical pre/post for non-route-gold fixtures.

### Determinism
- **NFR-D01**: Given the same `expected` and `routerResult`, `scoreHubRoute` returns the same verdict; the comparator is a pure function of its inputs with no randomness and no process-wide state.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Routing Boundaries
- **Silent default `[]`**: An empty replayed route under present route gold returns `firstFailingStage='silent-default'`; with `knownRouteGap: true` it is a counted known-gap, otherwise a blocking regression.
- **Ordered bundle**: `orderedBundle` requires set equality of the replayed intents with `workflowMode[]`; a near-miss returns `bundle-mismatch`.
- **Forbidden mode**: A `forbiddenWorkflowModes` member appearing in the route fails the single/bundle check even when the expected mode is also present.

### Gate Boundaries
- **Structure-over-routing**: A D5 structural failure sets `BLOCKED-BY-STRUCTURE` and takes precedence over `BLOCKED-BY-ROUTING`.
- **Known-gap-only suite**: When `regressions=0` and `knownGaps>0`, the verdict is NOT forced to `BLOCKED-BY-ROUTING`; the headline bottleneck reclassifies to `routing_known_gap` (P3).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One pure helper, one funnel branch, one aggregate gate block in a single scorer file, plus a one-field gold addition on 5 fixtures.
- **Risk concentration**: The load-bearing decision is the logic-sync resolution (marker on `expected`, not `notes`); correctness is verified on the canonical no-notes call shape so the gate is exercised exactly as the runner drives it.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the known-gap marker be read from fixture `notes` to avoid touching the gold? **RESOLVED: No. The canonical runner threads `expected` but not top-level `notes`, so a `notes`-based marker is invisible on the real call path. The marker was promoted to `expected.knownRouteGap: true` on the 5 fixtures; this is a documented, approved scope deviation into the D3-R3 fixtures.**
- Should the 5 hint-free holdouts be made to route in this phase? **RESOLVED: No. They are gold-labeled standing gaps. The gate counts them as a measured known-gap and does NOT claim they now route; closing them (widening `routerSignals`) is a separate, larger change.**
- Should `hubRoute` contribute to the weighted score? **RESOLVED: No. It is a hard gate, not a soft dimension; it stays out of `modeAScore` so the v1 weights are unchanged and routing is not double-counted.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Route-gold corpus (input)**: D3-R3 `fixtures/sk-design/*.private.json`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: hubRoute stage + suite gate in score-skill-benchmark.cjs; canonical no-notes acceptance is 13 pass / 5 known-gap / 0 regression; synthetic mis-route → BLOCKED-BY-ROUTING; non-sk-design fixture byte-identical; logic-sync resolved via expected.knownRouteGap on 5 fixtures (documented, approved deviation)
-->
</content>
