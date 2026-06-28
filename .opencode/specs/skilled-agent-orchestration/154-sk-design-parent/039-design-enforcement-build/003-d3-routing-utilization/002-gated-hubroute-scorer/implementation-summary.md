---
title: "Implementation Summary: D3-R2 Gated hubRoute scorer lane"
description: "Post-build record for the fail-closed hubRoute stage in score-skill-benchmark.cjs and the suite-level routing gate: what was built, the logic-sync that moved the known-gap marker to expected.knownRouteGap, the canonical-path acceptance (13 pass / 5 known-gap / 0 regression), and the honest framing that the gate hard-blocks real routing regressions while treating the 5 hint-free holdouts as a measured known-gap, not a claim that they now route."
trigger_phrases:
  - "gated hubroute scorer implementation summary"
  - "hubroute selection hard gate build record"
  - "known route gap scorer summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/002-gated-hubroute-scorer"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the hubRoute stage, suite gate, and 13/5/0 acceptance"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-gated-hubroute-scorer |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | Fail-closed `hubRoute` stage in `score-skill-benchmark.cjs` + suite-level `gate.hubRoute`; `expected.knownRouteGap` marker added to 5 standing-gap fixtures |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The selection layer now has a hard, fail-closed routing gate. Before this phase the scorer judged hub routing only through the advisory `modePrecision` signal, which never set `firstFailingStage`, never entered the weighted aggregate, and never moved the verdict, so a wrong hub route could pass the suite. This phase inserts a `hubRoute` stage into the scoring funnel and a suite-level gate that blocks the verdict on real routing regressions, while honestly treating the five hint-free standing gaps as a measured known-gap rather than a block. This is the selection-layer hard gate that the D3-R3 route-gold corpus feeds.

### Fail-closed hubRoute stage

`scoreHubRoute({ expected, routerResult })` (a new pure helper) compares the replayed workflow-mode route against the scenario's route gold with strict precedence: not-applicable (no route gold) returns `{ applicable: false, pass: true }` — the no-op guarantee for every non-route-gold fixture; then `defer`, then silent-default (`actual` empty → `firstFailingStage='silent-default'`), then `orderedBundle` (set equality → `bundle-mismatch` on miss), then `single` (exact single-mode match → `wrong-mode` on miss). `forbiddenWorkflowModes` is folded into the single and bundle checks. The stage is wired into `firstFailingStage` immediately BEFORE the advisory `routed-intra` branch, guarded by `dims.hubRoute.applicable && !dims.hubRoute.pass`, so a mis-route surfaces ahead of the soft attrition label. It rides its own lane out of the weighted `modeAScore`, so the v1 dimension weights and every per-scenario soft score are unchanged.

### Suite-level routing gate

`aggregate` collects the applicable `hubRoute` failures and splits them into routing **regressions** (`knownGap !== true`) and **known gaps** (`knownGap === true`). It emits `gate.hubRoute = { failed, regressions, knownGaps, reason }` and sets verdict `BLOCKED-BY-ROUTING` only when `regressions > 0`. The D5 `BLOCKED-BY-STRUCTURE` precedence is kept intact (structure blocks before routing). The measured known-gap count is surfaced in `runQuality.hubRouteKnownGaps` and the headline bottleneck is reclassified to `routing_known_gap` (severity P3) when only known gaps fail, so a standing gap reads as a measured signal, never as a regression.

### Logic-sync resolution: the known-gap marker

A LOGIC-SYNC was found and resolved during the build. The canonical runner `run-skill-benchmark.cjs` threads `expected: fx.expected` into `scoreScenario` but does NOT thread the top-level fixture `notes`, so a known-gap marker read from `notes.status` would be invisible on the canonical path. Rather than silently widen scope, the marker was promoted to a first-class gold field `expected.knownRouteGap: true` on the five standing-gap fixtures, and the scorer reads `expected.knownRouteGap` as authoritative. This keeps the known-gap split computable on the exact call shape the runner uses.

### Honest known-gap framing

This gate hard-blocks real routing regressions but treats the five hint-free holdouts as a measured known-gap, not a block. It does NOT claim those holdouts now route. Each known-gap fixture still reports `firstFailingStage='silent-default'` (the measure working), and the gate counts it as a `knownGap` so the suite is not blocked by a standing gap that the corpus already documents.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modified | Added `scoreHubRoute()` helper, the `hubRoute` funnel branch before `routed-intra`, `dims.hubRoute` wiring, and the suite-level `gate.hubRoute` with `BLOCKED-BY-ROUTING` verdict + `runQuality.hubRouteKnownGaps` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/{holdout-audit,holdout-interface,holdout-motion,holdout-mdgen}-001.private.json` + `sk-design-mp-menu-002.private.json` | Modified | Added the first-class gold field `expected.knownRouteGap: true` to the 5 standing-gap fixtures so the scorer reads the marker on the canonical no-notes call shape |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) added the `hubRoute` stage and suite gate, hit the logic-sync on the runner's no-notes threading, and resolved it by promoting the marker to `expected.knownRouteGap`. The orchestrator then verified acceptance INDEPENDENTLY using the CANONICAL no-notes call shape (`scoreScenario({ ..., expected: fx.expected })`, exactly as `run-skill-benchmark.cjs` calls it) rather than trusting the claim: 13 fixtures pass the `hubRoute` stage; the 5 `knownRouteGap` fixtures are counted as `knownGaps` (each reporting `firstFailingStage='silent-default'`, NOT regressions); the regression count is 0 and `gate.hubRoute.failed=false`, so the suite is NOT blocked by the standing gaps. A synthetic real mis-route (route gold present, replayed intents wrong, `knownRouteGap` absent) yields `regressions=1` and verdict `BLOCKED-BY-ROUTING`. A non-sk-design fixture (no route gold) scores byte-identical before and after — the no-op guarantee holds. `node --check` passes on both `score-skill-benchmark.cjs` and `run-skill-benchmark.cjs`, and an evergreen scan over the diff found no spec/packet/phase IDs or `specs/` paths. Scope crossed into the five D3-R3 fixtures only to land the logic-sync fix; that deviation is documented and approved.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Promote the known-gap marker to `expected.knownRouteGap` instead of reading `notes.status` | The canonical runner threads `expected` but not top-level `notes`, so a `notes`-based marker is invisible on the real call path; a first-class gold field is the narrow, sanctioned fix the plan named for exactly this logic-sync |
| Keep `hubRoute` out of the weighted `modeAScore` | The stage is a hard gate, not a soft dimension; folding it into the aggregate would silently shift v1 weights and double-count routing against the soft per-scenario score |
| Insert `hubRoute` BEFORE `routed-intra` in `firstFailingStage` | A mis-route is the root failure; reporting it ahead of the advisory `routed-intra` attrition label keeps the funnel honest about why a scenario failed |
| Block the verdict only on `regressions > 0`, never on known gaps | The five hint-free holdouts are a documented standing gap, not a defect of this phase; blocking on them would gate the suite against a baseline the corpus already measures |
| Preserve `BLOCKED-BY-STRUCTURE` precedence over `BLOCKED-BY-ROUTING` | A structural D5 failure is more fundamental than a routing miss; the routing gate must not mask a structural block |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ACCEPTANCE: 13 fixtures pass the `hubRoute` stage (canonical no-notes call) | PASS, no `hubRoute` label on the 13 correctly-routing scenarios |
| ACCEPTANCE: 5 `knownRouteGap` fixtures counted as `knownGaps` | PASS, holdout-audit/interface/motion/mdgen + mp-menu-002 each report `firstFailingStage='silent-default'` and are classified `knownGap`, NOT regressions |
| ACCEPTANCE: regression count 0, suite not blocked by standing gaps | PASS, `gate.hubRoute.regressions=0` and `gate.hubRoute.failed=false`; verdict not forced to `BLOCKED-BY-ROUTING` |
| Fail-closed: synthetic real mis-route blocks | PASS, route gold present + wrong replayed intents + no `knownRouteGap` → `regressions=1` and verdict `BLOCKED-BY-ROUTING` |
| No-op on a non-sk-design fixture | PASS, report byte-identical pre/post (aggregateScore, verdict, funnel, per-row `firstFailingStage`, dimensionScores) — `scoreHubRoute` returns `{ applicable: false, pass: true }` without route gold |
| `hubRoute` not folded into `modeAScore` | PASS, the weighted aggregate and v1 dimension weights are unchanged; the stage rides its own gate lane |
| Funnel order | PASS, `hubRoute` branch sits ahead of `routed-intra` in `firstFailingStage` |
| Syntax | PASS, `node --check` clean on `score-skill-benchmark.cjs` and `run-skill-benchmark.cjs` |
| Evergreen scan (no spec/packet/phase IDs) | PASS, no identifiers or `specs/` paths in the scorer diff or the 5 fixture edits |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate does not claim the hint-free holdouts now route.** It hard-blocks real routing regressions but treats the five standing gaps (`holdout-audit/interface/motion/mdgen` + `mp-menu-002`) as a measured known-gap. Each still routes `[]` and reports `silent-default`; the gate counts them rather than failing on them. Closing those holdouts is a separate change (widening `routerSignals`), out of scope here.
2. **Known-gap status is data-driven by `expected.knownRouteGap`.** A future fixture that should be a standing gap MUST carry `expected.knownRouteGap: true` in its private gold, or the gate will treat its silent-default as a real regression and block the suite. This is intentional fail-closed behavior.
3. **Scope crossed into the 5 D3-R3 fixtures.** Adding `expected.knownRouteGap` to the five `*.private.json` files is outside this packet's primary target (`score-skill-benchmark.cjs`). It was the sanctioned narrow resolution to the runner no-notes logic-sync and is recorded here as a documented, approved deviation.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the fail-closed hubRoute stage + suite gate in score-skill-benchmark.cjs; logic-sync resolved by promoting the known-gap marker to expected.knownRouteGap on 5 fixtures; canonical no-notes acceptance is 13 pass / 5 known-gap / 0 regression; honest framing keeps the holdouts a measured known-gap, not a routing claim
-->
</content>
</invoke>
