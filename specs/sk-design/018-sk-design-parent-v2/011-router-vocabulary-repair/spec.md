---
title: "Feature Specification: Make the phrases the router declares actually reach the hub"
description: "The sk-design router declares 55 keywords its own scoring vocabulary never sees. Probing fifteen of them found eleven that do not reach the hub: eight reach nobody at all, including `what should this look like`, which is the canonical design question"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Make the phrases the router declares actually reach the hub

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A router's `INTENT_SIGNALS` and a hub's `graph-metadata.json` `intent_signals` do different jobs, so
they are not meant to be identical: one resolves an intent inside a chosen hub, the other decides
which hub is chosen. That is why 55 differences are not automatically defects. Eleven of them are:
distinctive multi-word phrases that should select this hub and do not.

**Key Decisions**: add only distinctive multi-word phrases, since a bare common word over-triggers; remove the chart vocabulary sk-doc kept

**Critical Dependencies**: a baseline for the fifteen probed phrases, captured before any edit

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | `010-readme-human-voice` |
| **Successor** | `012-template-screenshots` |
| **Handoff Criteria** | Every distinctive phrase the router declares reaches the hub, and both control sets hold |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the router vocabulary repair and template screenshots specification.

**Scope Boundary**: The two hubs' `intent_signals` and `sk-doc`'s description keywords. No router restructuring, no
new mode, no change to weights.

**Dependencies**:
- The distinction between stage-one hub selection and stage-two intent resolution
- A pre-edit baseline for the probed phrases
- `004`'s cutover, which moved the modes but left two chart phrases behind

**Deliverables**:
- Eleven previously-broken phrases measured before and after
- `sk-doc` no longer claiming `data visualization`
- Seventeen distinctive phrases added to the hub that owns them
- A record of which two remain broken and why

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design router declares 55 keywords its own scoring vocabulary never sees. Probing fifteen of
them found eleven that do not reach the hub: eight reach nobody at all, including
`what should this look like`, which is the canonical design question, and two reach `sk-doc`, which
still carried chart vocabulary the cutover was supposed to move. The packet's sixteen-phrase baseline
never contained any of them, so every replay in this packet passed while they were broken.

### Purpose
A phrase the router declares reaches the hub, or is not declared.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Distinctive multi-word phrases the router declares and the scorer never sees
- Chart vocabulary `sk-doc` retained after the cutover

### Out of Scope
- The 44 router keywords that are bare common words: `padding`, `color`, `shadow` and the like. They
  belong to stage-two intent resolution inside a chosen hub, where a common word is safe
- Any change to scoring weights or thresholds
- `review this screen`, which loses to `sk-code` for the same reason the deck-review case does

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/graph-metadata.json` | Modify | 17 distinctive phrases the router declared and the scorer never saw |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modify | Remove two chart phrases the cutover left behind |
| `.opencode/skills/sk-doc/description.json` | Modify | Same, in the description keywords |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A phrase the router declares as distinctive reaches this hub, or is removed from the router. |
| REQ-002 | `sk-doc` no longer wins on chart vocabulary the cutover moved. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The packet's sixteen-phrase set and the surface set from the preceding phase both hold. |
| REQ-004 | Anything still broken is named with its cause rather than left silent. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Of eleven broken probed phrases, at least nine reach `sk-design` above the bar.
- **SC-002**: `data visualization` names `sk-design` ahead of `sk-doc`.
- **SC-003**: The sixteen-phrase set is unchanged from the closing-phase capture.
- **SC-004**: The twelve surface phrases are unchanged from the preceding phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The two-stage routing model | Treating the two vocabularies as one produces false defects | Probe each candidate rather than diffing the lists |
| Risk | A bare common word over-triggers the hub | High | Add only distinctive multi-word phrases |
| Risk | Adding vocabulary steals a phrase from a sibling | High | Replay the packet set and the surface set as controls |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime target; the measured quantity is advisor confidence per phrase.

### Security
- **NFR-S01**: No credential, dependency or network call is added.

### Reliability
- **NFR-R01**: Every number is quoted with the daemon generation it was measured at.

---

## 8. EDGE CASES

### Data Boundaries
- A two-word phrase such as `critique this` or `plot this`: too short to clear the bar even when present in the vocabulary. Reported as a length limit, not a membership gap.
- A phrase declared in the router but meant for stage two: left alone, because adding it would over-trigger hub selection.

### Error Scenarios
- A phrase that improves but still loses an ordering: reported as improved-not-won, never rounded up to fixed.
- A control that moves: treated as a regression regardless of direction.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 3, all vocabulary |
| Risk | 14/25 | Auth: N, API: N, Breaking: routing on two hubs at once |
| Research | 10/20 | Distinguishing a real gap from the two-stage design took the probing |
| Multi-Agent | 1/15 | Single workstream |
| Coordination | 6/15 | Touches `sk-doc` as well as `sk-design` |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A common word over-triggers hub selection | H | H | Only distinctive multi-word phrases added |
| R-002 | A sibling loses a phrase it owned | M | H | Both prior phrase sets replayed as controls |
| R-003 | The 44 stage-two keywords are read as defects later | M | M | The distinction is written into the spec |

---

## 11. USER STORIES

### US-001: A phrase the router advertises actually reaches the hub (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A chart question stops reaching the documentation hub (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the router's stage-two keyword list and the hub's stage-one vocabulary should be
  cross-checked by a gate. Nothing compares them, and eleven declared phrases were dead.
- Whether `review this screen` and `design review of this slide deck` losing to `sk-code` is correct.
  Both are design reviews of non-code artifacts.
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
