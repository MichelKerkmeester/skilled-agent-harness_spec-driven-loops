---
title: "D3-R3 — Standing route-gold corpus + minimal pairs"
description: "Extend the private gold with workflow-route fields and author 18 sk-design alias/holdout/adversarial fixture pairs the gated hubRoute stage scores against; deterministic keyword routing is measured, hint-free silent-default is recorded as a standing gap."
trigger_phrases:
  - "d3-r3 route gold corpus"
  - "route minimal pairs design build"
  - "sk-design routing fixtures"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/003-route-gold-corpus"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the route-gold corpus build and mark the phase spec complete"
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
# D3-R3 — Standing route-gold corpus + minimal pairs

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
| **Enforcement class** | hybrid |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
There was no standing corpus of hint-free prompts to score sk-design routing against, so the gated `hubRoute` stage (D3-R2) had nothing concrete to fail against. Without minimal pairs, near-identical prompts that flip workflow mode or collapse into a silent-default `[]` could not be caught, and a route that quietly returns nothing was indistinguishable from a route that returns the right mode.

### Purpose
Stand up a fixed gold corpus that measures routing behavior deterministically. The private gold gains four workflow-route fields (`workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, `minimalPairGroup`), and 18 sk-design fixture pairs exercise alias keywords, hint-free holdouts, and adversarial minimal pairs. Routing is verified by replaying every fixture through `router-replay.cjs` against the projected `hub-router.json`; hint-freeness is gated by the existing contamination lint scoped to identity tokens only. The corpus is the standing measure the next-phase gated `hubRoute` scorer (D3-R2) consumes; the scorer itself is NOT built here. The corpus is deliberately honest about where routing fails: keyword/alias routing is deterministic, but hint-free or arbitrarily phrased prompts fall to silent-default `[]`, and those cases are gold-labeled as standing gaps so the D3-R2 scorer can gate on them rather than mislabel them as passing.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four additive workflow-route fields on the private `expected` block (`workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, `minimalPairGroup`), documented additively in the fixture-authoring contract
- 18 sk-design fixture pairs (public/private) across three tiers: alias (one per mode), hint-free holdout (one per mode), and adversarial minimal pairs
- Reuse of the exported `lintFixture` with an identity-scoped vocabulary (skill id + five mode names + resource basenames), not the full keyword vocab
- Routing replay + contamination + evergreen verification, with the five hint-free/silent-default cases recorded as gold-labeled standing gaps

### Out of Scope
- The gated `hubRoute` scorer (D3-R2) that consumes this corpus; only the coupling is recorded here
- Any edit to `router-replay.cjs`, `contamination-lint.cjs`, `score-skill-benchmark.cjs`, `hub-router.json`, or any live sk-design skill file
- Widening `routerSignals` to close the hint-free holdouts (a later phase may do this)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md` | Modify | Document the four workflow-route fields additively in the fixture-structure section (+17 lines) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/*.json` | Create | 18 public/private fixture pairs (36 files): 5 alias, 5 holdout, 8 minimal-pair arms |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The private gold carries the four route fields with valid enums | `workflowMode` ∈ {interface,foundations,motion,audit,md-generator} (array for `orderedBundle`); `routeOutcome` ∈ {single,orderedBundle,defer}; fields live only in `*.private.json` |
| REQ-002 | Every alias fixture routes to its mode under `router-replay.cjs` | interface/foundations/motion/audit/md-generator each land on `expected.workflowMode` (single) |
| REQ-003 | Must-pass minimal pairs route to distinct outcomes | `redesign the ui`→interface vs `review the ui`→audit; `ui build`→interface vs `ui critique`→audit; `design tokens`→foundations single vs `design tokens from url`→orderedBundle[foundations,md-generator] |
| REQ-004 | `forbiddenWorkflowModes` never appears in any fixture's selected route | Replay shows zero forbidden-mode intents across the corpus |
| REQ-005 | Standing gaps are gold-labeled, not mislabeled as passing | `redesign the menu` + the four hint-free holdouts carry correct-mode gold while routing `[]` today; recorded as the measure the gated `hubRoute` stage fails against |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Contamination lint clean on every public prompt | Identity-scoped `lintFixture` returns `passed: true` for all 18 scenarios (no skill id / mode names / resource basenames leaked) |
| REQ-007 | Schema doc edit is additive and confined | Only the fixture-structure section of `scenario_authoring.md` gains the route fields; no scorer/router behavior changed |
| REQ-008 | Evergreen body | No spec/packet/phase IDs or `specs/` paths in any fixture or in the schema-doc edit |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Replaying all 18 fixtures through `router-replay.cjs` against `hub-router.json`, 13 route to their `expected.workflowMode` — every alias fixture, every must-pass minimal-pair arm, and the one holdout (`fix the visual hierarchy of the dashboard`→foundations) that routes deterministically today.
- **SC-002**: The token-source bundle pair flips correctly: `design tokens`→foundations `single` and `design tokens from url`→`orderedBundle` [foundations, md-generator].
- **SC-003**: The five intentional standing gaps route `[]` (`redesign the menu` plus the four hint-free holdouts for motion/interface/audit/md-generator), and each carries correct-mode gold so the D3-R2 scorer fails against them rather than passing them.
- **SC-004**: Identity-scoped contamination lint reports clean on every public prompt; the four route fields appear only in `*.private.json`.
- **SC-005**: The change set is the schema-doc edit plus the new `sk-design/` fixture directory; no scorer, router, or live sk-design skill file is touched.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Route-vs-lint tension: the full lint bans the very alias keywords the router needs | "Routes correctly AND lint clean" becomes unsatisfiable | Scope the lint to identity tokens (skill id + 5 mode names + resource basenames); domain keywords are the legitimate routing surface |
| Risk | Standing gaps mislabeled as passing | The D3-R2 scorer would gate against a false baseline | Gold-label the 5 silent-default cases with their correct mode and `[]` observed route; do not claim full routing coverage |
| Risk | Hint-free prompts fall to silent-default `[]` | Arbitrary phrasing is not routed by keyword/alias matching | This is the advisory residual the research identified; the corpus MEASURES it; a later phase widening `routerSignals` could close some holdouts |
| Dependency | `hub-router.json` (projected by `router-replay.cjs`) | Routing target to score against | Read-only; unchanged |
| Dependency | `router-replay.cjs` + `contamination-lint.cjs` (`lintFixture`) | Replay + identity-scoped lint | Read-only; reused, not edited |
| Dependency | D3-R2 gated `hubRoute` scorer | Consumes this corpus | Not built here; coupling recorded only |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Replaying a fixture prompt twice against the same `hub-router.json` yields the same intents; routing is a pure lowercased-substring keyword projection with no randomness.

### Additivity
- **NFR-A01**: The four route fields are additive to the private `expected` block; existing fixtures and the `score-skill-benchmark.cjs` consumer keep their prior shape and behavior.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Routing Boundaries
- **Silent-default `[]`**: A hint-free prompt that matches no router keyword returns no intents; gold-labeled with the intended mode, not silently dropped.
- **Ordered bundle**: A prompt that matches two modes (`design tokens from url`) returns an ordered array honoring `routerPolicy.tieBreak`; `workflowMode` is stored as an array for `orderedBundle`.

### Contamination Boundaries
- **Alias prompts under identity vocab**: Alias prompts avoid mode-name substrings, so they stay lint-clean even though the router matches their domain keywords.
- **Domain keywords are allowed**: For router-scoring corpora, the domain keyword under test is not a leak; only identity tokens are banned.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One additive schema-doc section plus 18 static JSON fixture pairs in a single new directory; no executable code authored.
- **Risk concentration**: The load-bearing decision is the identity-scoped lint reconciliation; routing correctness is verified by deterministic replay, and the standing gaps are the deliberate, gold-labeled residual rather than a defect.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the four hint-free holdouts be made to route in this phase? **RESOLVED: No; they are intentional standing gaps. Keyword/alias routing is deterministic, but hint-free phrasing falls to silent-default `[]`. The gold corpus measures this gap and the D3-R2 scorer gates on it; a later phase widening `routerSignals` could close some holdouts.**
- Should `redesign the menu` route to interface now? **RESOLVED: No; it is the canonical silent-default arm of `mp-menu-animate-vs-redesign`. `animate the menu`→motion routes today; `redesign the menu` is gold-labeled interface with an observed `[]` route, recorded as a standing gap.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Fixture authoring contract**: `scenario_authoring.md` (fixture-structure section)

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: 18 fixture pairs replayed through router-replay.cjs against hub-router.json; 13/18 route to expected.workflowMode, 5/18 are gold-labeled standing gaps routing [] (four hint-free holdouts + "redesign the menu")
-->
