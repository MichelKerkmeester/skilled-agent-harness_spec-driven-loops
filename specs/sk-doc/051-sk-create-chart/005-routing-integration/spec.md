---
title: "Feature Specification: Phase 5: routing-integration [template:level-3/spec.md]"
description: "Registration is the easy half and it is not the deliverable. The skill has to be reachable through both routing stages, which means the advisor selects it and the router resolves it, with a canary that fails when either stops being true."
trigger_phrases:
  - "chart skill routing"
  - "advisor vocabulary chart"
  - "two stage routing"
  - "compiled route manifest refresh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 5: routing-integration

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Wire the skill into both routing stages and prove each one separately. Vocabulary is unioned from two files, so editing one alone changes nothing, and editing a compiled-policy input without refreshing the manifest drops the hub to legacy.

**Key Decisions**: Which vocabulary the skill answers to, and its weight against the modes it sits nearest

**Critical Dependencies**: Phase 3's root metadata and phase 4's ported content

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-content-migration |
| **Successor** | 006-playbook-and-closeout |
| **Handoff Criteria** | The advisor selects the skill for its own vocabulary, the router resolves it to leaves that exist on disk, and a canary covers the route |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Bring the lieflat-charts skill into this repository as sk-create-chart specification.

**Scope Boundary**: Routing surfaces only. No ported content is edited to make a route work.

**Dependencies**:
- Phase 3's root metadata, which is what gets registered
- Phase 4's content, since a route to an empty package proves nothing
- Phase 1's placement, which decides which routing surfaces apply at all

**Deliverables**:
- Registry and router entries for the skill
- Advisor vocabulary that reaches it
- A canary fixture covering the route
- Compiled routing refreshed and verified

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A registry entry is not a route. The advisor picks a hub from its own vocabulary, and only then does the hub's router pick a mode. A skill can be registered, listed and visible in every file a reader would check, and still be unreachable because no request scores high enough to select it.

Two mechanics make this worse than it sounds. Mode vocabulary is unioned from the mode registry and from the router's class keywords, so a careful edit to one file has exactly no effect. And the hub compiles its policy into a manifest pinned by hash, so touching a compiled-policy input without refreshing drops the whole hub to a legacy path, which keeps working and stops being what the files say.

### Purpose

A request for a chart reaches the chart skill, and a check fails if that stops being true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The registry entry, the router entry and the vocabulary that reaches them
- Both routing stages verified separately, since one passing says nothing about the other
- A canary fixture covering the new route
- Compiled routing refreshed, synced and verified after any change to a policy input

### Out of Scope

- Re-weighting neighbouring modes to make room. If the skill only routes by starving a sibling, the vocabulary is wrong
- Editing ported content to suit a route. The route adapts to the skill
- The advisor's scoring logic. It is what it is, and this phase works inside it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The hub registry and router, if the placement is a hub mode | Modify | Registration and stage-two resolution |
| Advisor vocabulary sources | Modify | Stage-one selection |
| Canary fixtures and their pinned digests | Modify | Coverage for the new route |
| The compiled route manifest | Modify | Refreshed after any policy-input change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The advisor selects the skill for its own vocabulary, shown by a run rather than by a registry entry. |
| REQ-002 | The router resolves the skill to leaves that exist on disk. |
| REQ-003 | Vocabulary is edited in every file that contributes to it, since the effective set is a union. |
| REQ-004 | Compiled routing reports the hub as compiled rather than legacy or stale after the change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A canary fixture covers the route and fails when either stage stops resolving. |
| REQ-006 | Neighbouring modes are re-checked after the vocabulary change, so the new entry did not take requests that belong elsewhere. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An advisor run for the skill's own vocabulary returns it above the invocation threshold.
- **SC-002**: A router resolution returns leaves, and each named leaf exists on disk.
- **SC-003**: `compiled-route-sync.cjs status --all` reports the hub compiled, not legacy and not stale-manifest.
- **SC-004**: Removing the registry entry makes the canary fail, which is what proves the canary covers anything.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled routing manifest | Editing a policy input without refreshing silently drops the hub to legacy | Refresh, sync, then check status before claiming anything |
| Risk | Reporting routed on the strength of a registry entry | High. It is the exact failure this repository has recorded before | Both stages get their own evidence |
| Risk | The new vocabulary takes requests that belong to a neighbouring mode | Medium | Re-run the neighbours after the change, not only the new entry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: An added mode must not change resolution for existing routes. The neighbours are re-checked to prove it.

### Security
- **NFR-S01**: No credential surface. Routing files are policy inputs, so changes to them get the manifest treatment.

### Reliability
- **NFR-R01**: The canary is the reliability check, and it is only worth having if a negative control shows it can fail.

---

## 8. EDGE CASES

### Data Boundaries
- A request that sits between the chart skill and a neighbouring mode: the tie behaviour is checked rather than assumed.
- Vocabulary that is a substring of a common word scores on requests that have nothing to do with charts.

### Error Scenarios
- The hub reports legacy after the change: refresh the manifest before touching anything else, since every later reading is now unreliable.
- The advisor scores the skill below threshold: widen the vocabulary, do not lower the threshold.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: registry, router, vocabulary, canary and manifest. |
| Risk | 22/25 | Auth: N, API: N, Breaking: Y. A hub dropped to legacy affects every mode under it. |
| Research | 10/20 | The mechanics are known and written down. Applying them correctly is the work. |
| Multi-Agent | 4/15 | Workstreams: 1. The stages are sequential. |
| Coordination | 12/15 | Dependencies: reads three phases, and its failure mode reaches unrelated modes. |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Routed claimed from a registry entry alone | H | H | Separate evidence per stage, and the claim names both |
| R-002 | A policy input edited without a manifest refresh drops the hub to legacy | H | M | Status check after the change, before any completion claim |
| R-003 | Vocabulary edited in one of the two contributing files | M | H | Edit both, then verify by an advisor run rather than by reading |

---

## 11. USER STORIES

### US-001: Reachable, not merely present (Priority: P0)

**As a** user asking for a chart, **I want** the request to reach the chart skill, **so that** the adoption produced a capability rather than a directory.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A canary that can fail (Priority: P1)

**As a** maintainer, **I want** coverage that breaks when the route breaks, **so that** a later refactor cannot silently unwire this.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- What weight does the skill carry against its nearest neighbours, and what evidence sets it?
- If the placement is standalone rather than a hub mode, which of these surfaces still apply?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
