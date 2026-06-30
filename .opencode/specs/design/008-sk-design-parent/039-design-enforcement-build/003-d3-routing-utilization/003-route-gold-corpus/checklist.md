---
title: "Verification Checklist: Standing route-gold corpus + minimal pairs"
description: "Verification evidence for the sk-design route-gold fixtures, schema extension, routing replay, contamination lint, and evergreen constraint."
trigger_phrases:
  - "route gold corpus checklist"
  - "sk-design fixtures verification"
  - "minimal pair checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/003-route-gold-corpus"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered route-gold corpus"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Standing route-gold corpus + minimal pairs

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

- [x] CHK-001 [P0] Schema extension documented in spec.md and plan.md
  - **Evidence**: `expected.workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`minimalPairGroup` shape captured in plan.md §3 and the `scenario_authoring.md` fixture-structure section
- [x] CHK-002 [P0] Real fixture corpus root confirmed
  - **Evidence**: `assets/skill_benchmark/fixtures/` is the root; new `sk-design/` subdir holds the 36 fixture files (18 pairs)
- [x] CHK-003 [P1] Route-vs-lint reconciliation decided
  - **Evidence**: routing-corpus gate reuses `lintFixture` with identity-scoped vocab (skill id + 5 mode names + resource basenames), not full keyword vocab

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every fixture is a valid public/private JSON pair sharing one `scenarioId`
  - **Evidence**: 18 pairs (36 files) under `sk-design/`; each `*.public.json` has a matching `*.private.json`
- [x] CHK-011 [P0] Private gold carries the four new route fields with valid enums
  - **Evidence**: `workflowMode` ∈ {interface,foundations,motion,audit,md-generator} (array for `orderedBundle`); `routeOutcome` ∈ {single,orderedBundle,defer}
- [x] CHK-012 [P1] `minimalPairGroup` shared across both arms of each pair; null otherwise
  - **Evidence**: `mp-tokens-002` carries `mp-tokens-single-vs-bundle`; `mp-menu-002` carries `mp-menu-animate-vs-redesign`; alias/holdout fixtures use null
- [x] CHK-013 [P1] Schema doc edit confined to the `scenario_authoring.md` fixture-structure section
  - **Evidence**: the +17 additive lines sit only in the fixture-structure section; scorer/router behavior unchanged

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Alias fixtures route to their mode (single) under `router-replay.cjs`
  - **Evidence**: interface/foundations/motion/audit/md-generator each land on `expected.workflowMode` (e.g. `ui build`→interface, `oklch palette`→foundations)
- [x] CHK-021 [P0] Must-pass minimal pairs route to distinct outcomes
  - **Evidence**: replay confirms `redesign the ui`→interface vs `review the ui`→audit; `ui build`→interface vs `ui critique`→audit; `design tokens`→foundations single vs `design tokens from url`→orderedBundle[foundations,md-generator]
- [x] CHK-022 [P0] `forbiddenWorkflowModes` never selected in any fixture's route
  - **Evidence**: replay output shows zero forbidden-mode intents across the corpus
- [x] CHK-023 [P1] Standing-gap fixtures recorded, not gated
  - **Evidence**: `redesign the menu` (interface gold) and the 4 hint-free holdouts (motion/interface/audit/md-generator) route `[]` now; correct-mode gold retained as the measure the gated `hubRoute` stage fails against — full routing coverage is NOT claimed

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: matrix/evidence; this phase produces a gold corpus and a schema-doc note, not code-defect findings — the deliverable is the 18-fixture routing matrix
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the only mutations are `scenario_authoring.md` and the new `sk-design/` fixtures; an evergreen grep over both found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the four new route fields are consumed only by the next-phase gated `hubRoute` scorer (D3-R2); existing `score-skill-benchmark.cjs` reads no new field and is unchanged
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: adversarial minimal pairs executed — redesign-vs-review, ui-build-vs-critique, tokens-single-vs-bundle flip correctly; menu-animate-vs-redesign and the 4 hint-free holdouts record the silent-default `[]` fallback
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix is 18 fixtures over `expected.workflowMode`/`routeOutcome`: 13 route to gold, 5 are gold-labeled standing gaps routing `[]`
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; `router-replay.cjs` is a pure keyword projection over the prompt and `hub-router.json`, reading no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the `scenario_authoring.md` fixture-structure edit and the 36 files under `fixtures/sk-design/`, replayed against `hub-router.json`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Contamination lint clean on every public prompt
  - **Evidence**: identity-scoped `lintFixture` returns `passed: true` for all 18 scenarios (no skill id / mode names / resource basenames leaked)
- [x] CHK-031 [P0] Private gold never duplicated into the public half
  - **Evidence**: `workflowMode`/`routeOutcome`/forbidden/group live only in `*.private.json`; public halves carry the prompt only
- [x] CHK-032 [P1] No scorer modification in this phase
  - **Evidence**: `score-skill-benchmark.cjs` and `router-replay.cjs` unchanged; change is additive corpus + doc only

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: spec.md, plan.md, tasks.md, and this checklist all reflect the 18-fixture set, the four route fields, and the 13-route / 5-standing-gap result
- [x] CHK-041 [P1] D3-R2 coupling noted without building the scorer
  - **Evidence**: implementation-summary.md states the corpus is consumed by the gated `hubRoute` stage (next phase) and the scorer is NOT built here
- [x] CHK-042 [P2] Per-skill fixture index/README updated if present
  - **Evidence**: not applicable — no per-skill fixture index/README exists under `fixtures/`; the `sk-design/` directory is self-describing via scenario ids

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Evergreen: no spec/packet/phase IDs in any fixture or schema-doc file
  - **Evidence**: `rg` for `D3-R3`/`039`/`003-`/`.opencode/specs/` across `sk-design/` + `scenario_authoring.md` → zero hits
- [x] CHK-051 [P1] Fixtures live only under the corpus root
  - **Evidence**: all 36 new files under `assets/skill_benchmark/fixtures/sk-design/`; no fixture written elsewhere

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the route-gold corpus, independent `router-replay.cjs` replay, and identity-scoped contamination lint)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
