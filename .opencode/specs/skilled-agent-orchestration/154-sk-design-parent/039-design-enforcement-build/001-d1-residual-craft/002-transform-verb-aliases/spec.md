---
title: "Feature Specification: Transform-Verb Hub Routing"
description: "Transform verbs had no parseable route into the sk-design hub and no interface lane to land on. This registers the five verbs in the registry, syncs the router vocabulary, and adds the interface application lane with paired gold prompts."
trigger_phrases:
  - "d1-r2 transform verbs"
  - "transform verb aliases design build"
  - "make it should it be routing split"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/002-transform-verb-aliases"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgraded spec to Level 2; recorded registry-SSOT vs hub-router split and scope amendment"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Owner of the verb set resolved to the registry as SSOT, with hub-router.json as the consumed copy synced by the drift guard"
---
# Feature Specification: Transform-Verb Hub Routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `002-transform-verb-aliases` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The transform verbs bolder, quieter, distill, clarify and delight had no parseable route into the sk-design hub. They were absent from every mode's routing vocabulary, so a bare natural-language request like "make this bolder" resolved to no deterministic mode, and the interface mode had no authoring lane where such a request could land once selected.

### Purpose
Give each transform verb a deterministic hub route and an interface landing contract. A "make it" request applies the transform through `interface`, a "should it be" question routes to `audit` to judge whether the transform is warranted, and a drift guard keeps the registry, the router vocabulary and the command layer in agreement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five transform-verb aliases on the `interface` mode plus a `transformVerbRouting` contract block in `mode-registry.json`.
- A synced router vocabulary in `hub-router.json`: the five verbs on the interface vocabulary and a new `audit-transform-question` class for "should it be ..." framing.
- A new interface lane `design-interface/references/design-process/transform_application.md` with the routing rule, the shared application contract and one lane per verb.
- Twenty paired router-replay gold fixtures: an alias arm and an audit arm per verb.

### Out of Scope
- Foundations transform verbs (`typeset/colorize`) and audit transform verbs (`harden/polish`), which stay command-surface task projections only.
- Any taste or quality judgment on whether a transform was applied well. The lane guides application but proves no craft.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/mode-registry.json` | Modify | Five interface aliases plus the `transformVerbRouting` contract block |
| `sk-design/hub-router.json` | Modify | Five verbs on interface vocabulary plus the `audit-transform-question` class |
| `sk-design/design-interface/references/design-process/transform_application.md` | Create | Interface landing lane with routing rule, application contract and per-verb lanes |
| skill-benchmark `fixtures/sk-design/sk-design-transform-*` | Create | Twenty gold fixtures, ten paired arms |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each verb's "make it ..." arm resolves to `interface` and its "should it be ..." arm resolves to `audit` | The hubRoute scorer routes all ten transform arms correctly with no regression to the prior passing routes |
| REQ-002 | The registry, the router vocabulary and the command layer agree on the verb set | `parent-hub-vocab-sync.cjs` passes with `driftDetected=false`, zero orphan aliases and zero collisions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The four shared verbs reconcile with their command task projections, and `clarify` is alias-only | `bolder/quieter/distill/delight` owner is `interface` in both layers, `clarify` carries no command projection |
| REQ-004 | Additive and evergreen | Only the four named targets change, and no shipped artifact embeds spec, packet or phase identifiers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hubRoute scorer over the full sk-design corpus shows 0 regression while the pass count grows by the ten new transform arms, and the drift guard passes at score 100.
- **SC-002**: Both edited JSON files parse, the interface lane carries a complete lane per verb, and the D2 reconciliation against `command-metadata.json` holds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Registry is the SSOT but the live router consumes `hub-router.json`, so editing only the registry ships a dead route | High | Sync both files and let `parent-hub-vocab-sync.cjs` enforce agreement, with the registry held as the single source of truth |
| Risk | A reader treats a growing pass count as a regression signal | Med | The invariant is 0 regression, not a frozen count. New routes are expected to grow the pass total, so the gate checks that prior passes hold rather than that the number is fixed |
| Risk | `clarify` has no command projection and could be mistaken for an omission | Low | Record `clarify` as deliberately alias-only in `transformVerbRouting.aliasOnly` and the lane doc |
| Dependency | `command-metadata.json` task projections (owner reconciliation) | D2 reconciliation cannot be verified if the projections move | Reconcile against the live projections and use evergreen verb names, never line numbers |
| Dependency | `parent-hub-vocab-sync.cjs` and the hubRoute scorer over the skill-benchmark corpus | Acceptance cannot be proven deterministically without them | Run both as the acceptance gate before any completion claim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The additions are routing data and reference prose only, so resolution cost is unchanged for every non-transform prompt.

### Security
- **NFR-S01**: No secrets, credentials or executable logic are introduced. The changed files carry routing vocabulary and prose.

### Reliability
- **NFR-R01**: Routing is deterministic. Identical prompts yield identical mode resolution across runs, proven by the paired gold fixtures.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A transform verb with no framing defaults to the interface alias, since the audit reroute requires the "should it be" question.
- A prompt carrying both an interface alias and the audit question frame routes to audit, matching the `audit-transform-question` class.

### Error Scenarios
- A verb added to the registry but missing from `hub-router.json` would route nothing. The drift guard catches this as an orphan alias before completion.
- A collision between a transform verb and an existing alias would fail the drift guard at the collision check.

### State Transitions
- The verb set is authored once in the registry. The router copy is a synced consumer, so a registry edit without a matching router edit is a drift failure, not a silent divergence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two JSON edits, one new lane doc, twenty gold fixtures |
| Risk | 7/25 | Additive routing data, reversible by revert, but the registry/router split required a mid-phase amendment |
| Research | 6/20 | Confirming the live router consumer and reconciling shared verbs against the command projections |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should `clarify` gain a `/design:interface` command projection so all five verbs reach the hub through both a bare prompt and an explicit command? Today it is alias-only, and the `commandProjectionParity` list must grow with it if that changes.
- Should the registry-to-router sync become a build step rather than a drift check? The guard catches divergence today, but a generator would remove the manual second edit that the scope amendment exposed.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
