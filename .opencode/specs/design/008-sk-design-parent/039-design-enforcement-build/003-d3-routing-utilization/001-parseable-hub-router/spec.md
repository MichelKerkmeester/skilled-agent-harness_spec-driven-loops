---
title: "D3-R1 — Parseable hub-router projection"
description: "Add routerPolicy + routerSignals + typed vocabulary classes as a new sibling sk-design/hub-router.json, plus an additive presence-gated router-replay.cjs reader, so the parent hub parses to parseable:true with zero regression for every other skill."
trigger_phrases:
  - "d3-r1 hub-router projection"
  - "parseable hub router design build"
  - "hub-router.json projection"
  - "router-replay parseable"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/001-parseable-hub-router"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the hub-router projection build and mark the phase spec complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D3-R1 — Parseable hub-router projection

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
`router-replay.cjs` returns `parseable:false` on the `sk-design` parent hub. The hub's smart-routing section is prose ("registry-driven"), so there is no inline `INTENT_SIGNALS`/`RESOURCE_MAP` block and no referenced `references/smart_routing.md` to fall back to. With nothing to project, the whole hub selection layer is unscored and roughly 46.5% of the raw hub keywords are uncovered and untyped, so routing decisions rest on un-projectable prose.

### Purpose
Project the hub's routing intent into a new sibling `hub-router.json` that carries `routerPolicy`, `routerSignals` (per-mode weighted keyword groups), and typed `vocabularyClasses` that assign every currently-untyped hub keyword to a class. A second deliverable teaches `router-replay.cjs` to read that sibling file and project it into the scorer's existing `intentSignals`/`resourceMap` shape so `parseable` becomes `true`. This is the SELECTION layer that the gated hub-route scorer (a later phase) will run against; this phase makes the hub parseable, it does not build the scorer.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `hub-router.json` with `routerPolicy` (defaultMode, ambiguityDelta, tieBreak, outcomes single/orderedBundle/defer), `routerSignals` per mode, and typed `vocabularyClasses`
- Typing the currently-untyped hub keywords so each lives in exactly one `vocabularyClasses` entry (single home, no drift)
- A surgical, additive, presence-gated reader branch in `router-replay.cjs` that projects the sibling file into the scorer shapes
- Acceptance and no-regression verification

### Out of Scope
- Building the gated hub-route scorer lane that consumes the typed per-class weights (a later phase)
- Any change to `mode-registry.json` (stays identity-only) or to `sk-design/SKILL.md`
- Collapsing or rewriting the existing inline and referenced-doc parse paths

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/hub-router.json` | Create | Sibling routing projection: `routerPolicy` + `routerSignals` + typed `vocabularyClasses` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | Additive, presence-gated `projectHubRouter` branch in `parseRouter` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The parent hub parses | `router-replay.cjs` reports `parseable:true` for `sk-design` (was `false`) |
| REQ-002 | The hub routes the acceptance prompt | `"animate the menu"` resolves to intent `motion` |
| REQ-003 | Zero regression for other skills | sk-code, sk-design/design-interface, and sk-doc parse identically before and after |
| REQ-004 | The reader change is additive and presence-gated | The branch is a true no-op for any skill without a `hub-router.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `mode-registry.json` stays identity-only | No `routerPolicy`/`routerSignals` added to the registry; `git diff` shows no change |
| REQ-006 | Evergreen body | `hub-router.json` and any edited code comments carry no spec/packet/phase IDs or spec paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node router-replay.cjs --skill .opencode/skills/sk-design --task "animate the menu"` returns `parseable:true` with exit 0.
- **SC-002**: The same replay reports `intents` of `['motion']` for the acceptance prompt.
- **SC-003**: An in-place HEAD-vs-new swap shows sk-code, design-interface, and sk-doc parse identically and still route correctly.
- **SC-004**: The change set is limited to the new `hub-router.json` and the modified `router-replay.cjs`; `mode-registry.json` and `SKILL.md` are untouched.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reader branch alters other skills | Existing skills mis-parse or mis-route | Gate the branch on `fs.existsSync(hub-router.json)` so it is a no-op elsewhere |
| Risk | A keyword lives in two classes | Class drift and ambiguous routing | Each keyword has exactly one `vocabularyClasses` home |
| Dependency | `router-replay.cjs` parse ladder (inline → ref → sibling) | Reader branch needs an insertion point | Insert AFTER the referenced-doc block; first two paths still win |
| Dependency | `mode-registry.json` aliases + hub keyword block | Seed source for typed keywords | Seed `vocabularyClasses` from both, keeping the registry unmodified |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: For a skill without a `hub-router.json`, the new branch is never reached, so parse output is byte-identical to the prior baseline.

### Backward Compatibility
- **NFR-B01**: Inline dictionaries still win, then the referenced doc, then the sibling projection; the precedence ladder is preserved.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Presence Boundaries
- **Sibling absent**: When no `hub-router.json` exists, `parseRouter` behaves exactly as before (true no-op).
- **Inline or referenced present**: The sibling branch is not reached because an earlier path already populated the router.

### Routing Boundaries
- **Empty intent**: A prompt that matches no class scores no intent, matching the scorer's existing empty-intent behavior.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One new sibling data file plus one additive reader branch in a single benchmark script.
- **Risk concentration**: Regression risk is contained by the presence gate; the no-regression swap is the controlling check.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where does the router policy live: `mode-registry.json.router` or a sibling `hub-router.json`? **RESOLVED: the sibling `hub-router.json`; the registry stays identity-only.**
- Do the typed per-class weights get scored in this phase? **RESOLVED: No; the projection collapses them to the scorer's flat `{weight, keywords}` shape, and the gated scorer lane is a later phase.**

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
- Evidence: router-replay.cjs parseable:false baseline on the sk-design parent hub and the ~46.5% untyped hub keyword set this projection types
-->
