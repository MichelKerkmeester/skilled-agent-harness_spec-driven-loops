---
title: "Feature Specification: Phase 4: the cli-hermes skill packet and hub mode"
description: "Build the cli-hermes packet with sk-create-skill, carrying eight hard rules, the agent and command bridge and the MCP operator policy, and register it as the seventh mode of cli-external-orchestration on every routing surface."
trigger_phrases:
  - "cli-hermes skill packet"
  - "cli-hermes hub mode"
  - "register cli-hermes"
  - "hermes hard rules"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: the cli-hermes skill packet and hub mode

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

`cli-hermes` is the seventh mode of `cli-external-orchestration`, documented at the depth of `cli-pi` and reachable through both routing stages. The packet carries eight hard rules with implemented checks, seven references including the agent and command bridge and the MCP operator policy that two candidate phases folded into, and it is registered on the registry, router, surface router, hub contract, description, graph metadata and leaf manifest. Completed 2026-09-14.

**Key Decisions**: personas inlined and commands as prompt templates rather than any Hermes-native surface; MCP as an operator step; no packet-local advisor identity.

**Critical Dependencies**: phase 003's executor kind (a test couples kinds and modes); the graduated hub's compiled-routing harness, which enumerates packet sources by hand.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete — packet built and registered 2026-09-14; claims marked source-read until phase 002 |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 |
| **Predecessor** | 003-deep-loop-executor-support |
| **Successor** | 005-hermes-runtime-folder |
| **Handoff Criteria** | The seventh mode is registered on every hub surface and both skill checkers pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the cli-hermes creation packet; its durable directive and closure criteria are in `goal.md`, derived from the phase 001 synthesis and confirmed by the operator on 2026-09-14.

**Scope Boundary**: Build the `cli-hermes` packet with `sk-create-skill` and register the seventh hub mode; absorbs the agent and command bridge and the MCP operator policy as packet content.

**Dependencies**:
- Phase 003's executor kind; phase 002's evidence for every reference claim (marked source-read until recorded)

**Deliverables**:
- `.opencode/skills/cli-external-orchestration/cli-hermes/**` and the hub registration surfaces; the compiled-routing harness and manifest refreshed
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No packet described how to dispatch Hermes, which flags a dispatch must carry, which operator steps the repo cannot perform, or which models are allowed. The hub could not route a Hermes request anywhere.

### Purpose
A Hermes request reaches a documented, checker-validated contract through the advisor, the hub router and the surface router.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The packet: `SKILL.md`, `README.md`, two assets, seven references, changelog, benchmark index, playbook root.
- Registration on every hub surface: registry, router signals and vocabulary and tie-break, `ROUTER.md` intent and resource map, hub `SKILL.md` table and layout, `description.json`, `graph-metadata.json` (with the intent-signal projection regenerated), `leaf-manifest.json` regenerated.
- Compiled routing: the graduated hub's harness source list and canary fixture extended, the manifest refreshed.

### Out of Scope
- Playbook scenarios and the feature catalog - phase 008
- The repo-root `.hermes/` folder - phase 005
- Prompt-models profiles - phase 007

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-hermes/**` | Create | 14 packet files |
| `.opencode/skills/cli-external-orchestration/{mode-registry,hub-router,description,graph-metadata,leaf-manifest}.json`, `ROUTER.md`, `SKILL.md` | Modify | Seventh-mode registration |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs`, `fixtures/canary-cases.v1.json` | Modify | Source list and canary |
| `.opencode/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Regenerate | Fresh manifest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `parent-skill-check.cjs` and `validate_skill_package.py` pass for the hub with the seventh mode |
| REQ-002 | A Hermes request resolves to the hub at stage one and to `cli-hermes` at stage two |
| REQ-003 | Every leaf the manifest lists exists and every hard rule has an implemented check |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The six existing modes still resolve for their own prompts |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both hub checkers exit 0 with seven modes.
- **SC-002**: The compiled front door routes "delegate to hermes" to `cli-hermes` and the advisor scores the hub above threshold for a Hermes request.
- **SC-003**: The vocabulary-reach check reports no unreachable keyword for the hub.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled-routing harness source list | The hub stops compiling when a mode is missing from it | Entry added; freshness probe confirms |
| Risk | An alias that catches unrelated traffic | Misroute to the hub | Aliases name Hermes explicitly; reach check clean |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The packet loads progressively; only the CLI reference and quality card are always-load.

### Security
- **NFR-S01**: No provider key, no secret, and no operator config content appears in the packet.

### Reliability
- **NFR-R01**: Every claim that only a live run can confirm is marked source-read.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a request with no executor vocabulary defers at the hub, as before.
- Maximum length: not applicable.

### Error Scenarios
- External service failure: not applicable to routing.
- Network timeout: not applicable to routing.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 24, Systems: hub, compiled routing |
| Risk | 6/25 | Routing surfaces, all checker-covered |
| Research | 4/20 | Settled in phase 001 |
| Multi-Agent | 3/15 | None |
| Coordination | 8/15 | Coupled to phase 003 |
| **Total** | **33/100** | **Level 3** (parent-inherited) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Packet claims diverge from the live contract | M | M | Phase 002 records the pin; the packet cites it |

---

## 11. USER STORIES

### US-001: Route a Hermes request (Priority: P0)

**As a** calling agent, **I want** "delegate to hermes" to reach the `cli-hermes` contract, **so that** the dispatch I compose carries the right flags.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep the siblings intact (Priority: P1)

**As a** calling agent, **I want** the six existing modes to resolve as before, **so that** adding Hermes changes nothing for them.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- The nested-packet reference names a stage-two replay script that does not exist at its documented path; its owner decides the amendment.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`

---
