---
title: "Checklist: Gated hubRoute scorer lane"
description: "Verification checklist for the fail-closed hubRoute stage: acceptance, backward-compat no-op, known-gap gating, and evergreen hygiene."
trigger_phrases:
  - "hubroute scorer checklist"
  - "gated hub route checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/002-gated-hubroute-scorer"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered hubRoute gate"
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
# Checklist: Gated hubRoute scorer lane

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

- [x] CHK-001 [P0] Insertion point confirmed in `firstFailingStage()` — `hubRoute` branch lands immediately before the `routed-intra` branch
  - **Evidence**: the `hubRoute` branch sits ahead of `routed-intra` in `firstFailingStage`; funnel order confirmed by the synthetic mis-route returning `wrong-mode` ahead of `routed-intra`
- [x] CHK-002 [P0] Route-gold contract honored: `single` compares against `[workflowMode]`, `orderedBundle` against `set(workflowMode[])`, `forbiddenWorkflowModes` rejected
  - **Evidence**: `scoreHubRoute` precedence verified — `single` against `[workflowMode]`, `orderedBundle` set-equality, a `forbiddenWorkflowModes` member fails the single/bundle check
- [x] CHK-003 [P1] Baseline reports captured (sk-design corpus + one non-sk-design fixture) before any edit
  - **Evidence**: pre-edit sk-design and non-sk-design reports captured; the non-sk-design baseline is the byte-identical reference for the no-op control

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Change is confined to `score-skill-benchmark.cjs` (plus a justified in-file helper only)
  - **Evidence**: the scorer change is one file plus the in-file `scoreHubRoute` helper; the only other edits are `expected.knownRouteGap` on 5 fixtures (documented, approved deviation)
- [x] CHK-011 [P0] `scoreHubRoute` is a pure function of `{ expected, routerResult }`; no new filesystem/`skillRoot` coupling unless the fallback is explicitly flagged
  - **Evidence**: `scoreHubRoute` adds no `require`, no filesystem read, no `skillRoot` coupling; it reuses `routerResult.intents` in-place
- [x] CHK-012 [P1] `hubRoute` is NOT folded into the weighted `modeAScore`; the v1 dimension weights are unchanged
  - **Evidence**: the stage rides its own gate lane; the weighted `modeAScore` and v1 dimension weights are untouched
- [x] CHK-013 [P1] Comments state the durable WHY of the gate; no ephemeral artifact labels
  - **Evidence**: comment review plus an evergreen scan found no spec/packet/phase IDs; comments carry the gate's durable WHY only

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE — the `hubRoute` stage passes the 13 correctly-routing fixtures (no `hubRoute` label)
  - **Evidence**: canonical no-notes call (`scoreScenario({ ..., expected: fx.expected })`) — 13 fixtures pass the `hubRoute` stage
- [x] CHK-021 [P0] ACCEPTANCE — the 5 standing-gap fixtures are flagged with `firstFailingStage='silent-default'`
  - **Evidence**: holdout-audit/interface/motion/mdgen + mp-menu-002 each report `firstFailingStage='silent-default'`
- [x] CHK-022 [P0] ACCEPTANCE — verified no-op on a non-sk-design fixture: report identical pre/post (`aggregateScore`, `verdict`, `funnel`, per-row `firstFailingStage`, `dimensionScores`)
  - **Evidence**: non-sk-design report byte-identical pre/post — `scoreHubRoute` returns `{ applicable: false, pass: true }` without route gold
- [x] CHK-023 [P1] Funnel order: a seeded `single` miss reports `wrong-mode` ahead of any `routed-intra` label
  - **Evidence**: the synthetic `single` miss returns `wrong-mode` ahead of `routed-intra`
- [x] CHK-024 [P1] Replayed-route source verified: `routerResult.intents` carries workflow modes for sk-design fixtures (else fallback flagged)
  - **Evidence**: `routerResult.intents` carries the hub-router projection for sk-design fixtures; no `routeSkillResources` fallback needed

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase adds one fail-closed gate stage plus a gold field on 5 fixtures and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; `firstFailingStage` is the single producer of stage labels and the `hubRoute` branch is the only new stage; an evergreen grep over the scorer diff and 5 fixture edits found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: consumers of the new fields verified — `aggregate` reads `dims.hubRoute`; the runner threads `expected` (hence `expected.knownRouteGap`); `gate.hubRoute`/`runQuality.hubRouteKnownGaps` are report-only with no other reader
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: the comparator cases are exercised — silent-default, wrong-mode, bundle-mismatch, forbidden-mode, the no-op (no route gold), and the known-gap path; the no-op control is byte-identical
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: axes are route outcome (single / orderedBundle / defer / none) × result (pass / silent-default / wrong-mode / bundle-mismatch) × `knownGap` (true/false); rows are 13 pass + 5 known-gap + 1 synthetic regression + 1 no-op control
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; `scoreHubRoute` is a pure function of `{ expected, routerResult }` with no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the `score-skill-benchmark.cjs` scorer diff and the 5 `*.private.json` `expected.knownRouteGap` edits

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The stage fails closed: a routing regression (`knownGap !== true` miss) sets verdict `BLOCKED-BY-ROUTING`
  - **Evidence**: a synthetic real mis-route (route gold present, replayed intents wrong, `knownRouteGap` absent) → `regressions=1` and verdict `BLOCKED-BY-ROUTING`
- [x] CHK-031 [P0] Known-gap split is correct: the 5 standing gaps are counted as `knownGaps`, not `regressions`, and do NOT block the verdict
  - **Evidence**: `gate.hubRoute` payload — `knownGaps=5`, `regressions=0`, `failed=false`; the suite is NOT forced to `BLOCKED-BY-ROUTING`
- [x] CHK-032 [P1] No unintended mutation: the scorer reads fixtures and emits a report only; no fixture or source file is written
  - **Evidence**: the scorer writes nothing; the only working-tree changes are the intended scorer edit plus the 5 fixture gold-field edits
- [x] CHK-033 [P1] Known-gap marker threading confirmed reachable by the scorer; if absent, escalated as logic-sync rather than scope-widened
  - **Evidence**: LOGIC-SYNC — the canonical runner threads `expected` but not top-level `notes`; escalated and resolved by promoting the marker to `expected.knownRouteGap` rather than silently widening scope

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md` / `plan.md` / `tasks.md` / `checklist.md` synchronized with the final stage behavior
  - **Evidence**: all four docs carry the `hubRoute` stage + suite gate, the logic-sync resolution (`expected.knownRouteGap`), and the 13/5/0 acceptance
- [x] CHK-041 [P1] Evergreen [HARD]: no spec/packet/phase IDs or spec paths in code or comments
  - **Evidence**: evergreen grep over the scorer diff and the 5 fixture edits returned no spec paths or packet-phase IDs
- [x] CHK-042 [P2] `implementation-summary.md` records the verdict-gate behavior and the measured known-gap count
  - **Evidence**: implementation-summary.md records the `gate.hubRoute` verdict behavior and `runQuality.hubRouteKnownGaps`

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files (baselines, replay output) in `scratch/` only
  - **Evidence**: baselines and replay output were kept under scratch/; none committed to the packet
- [x] CHK-051 [P1] `scratch/` cleaned before completion
  - **Evidence**: the working tree carries only the scorer edit and the 5 fixture edits; no stray artifacts

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered hubRoute gate stage and suite gate)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
