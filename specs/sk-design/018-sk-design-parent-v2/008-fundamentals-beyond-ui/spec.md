---
title: "Feature Specification: Fundamentals covers every surface a design decision lands on, not only UI"
description: "`sk-design-fundamentals` reads as a UI skill. Its vocabulary, examples and references talk about buttons, padding and contrast, so a request about a slide deck, a printed page or a document layout either misses it or arrives and finds advice written "
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Fundamentals covers every surface a design decision lands on, not only UI

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Fundamentals holds surface-agnostic design judgment behind UI-specific language. This phase names
the surfaces it actually serves - screen UI, slide decks, printed and document layouts, and diagram
and chart canvases already owned by sibling modes - and makes each one reachable and answerable.
Vocabulary goes in the hub's `intent_signals`, because that is the only file the advisor reads.

**Key Decisions**: broaden the surface vocabulary rather than fork a second mode; measure each new surface phrase before and after

**Critical Dependencies**: a recorded baseline for the new surface phrases, captured before any edit, since it cannot be recaptured

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | `007-close-inherited-failures` |
| **Successor** | None |
| **Handoff Criteria** | Nothing follows; this phase closes the packet's second arc |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the design command surface and inherited failure closure specification.

**Scope Boundary**: `sk-design-fundamentals` content and the hub vocabulary that reaches it. No new mode, no change to
the other three modes, and no change to what `016` retired.

**Dependencies**:
- The hub's `graph-metadata.json` `intent_signals`, the only vocabulary surface the advisor reads
- A baseline for the new surface phrases, captured before anything changes
- The sibling modes, whose boundaries must stay legible once fundamentals speaks about canvases too

**Deliverables**:
- A named surface list in the fundamentals contract, with what changes per surface and what does not
- Guidance that answers a non-UI surface question as well as it answers a UI one
- Hub vocabulary that routes surface-specific phrasings
- A before-and-after replay for the new phrases alongside the packet's sixteen

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-design-fundamentals` reads as a UI skill. Its vocabulary, examples and references talk about
buttons, padding and contrast, so a request about a slide deck, a printed page or a document layout
either misses it or arrives and finds advice written for a screen component. The design judgment it
carries - hierarchy, spacing, type scale, colour, restraint - is not UI-specific, but the skill has
never said so.

### Purpose
A design question about any surface reaches fundamentals and finds guidance written for that surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Naming the surfaces fundamentals serves and what differs between them
- Rewriting UI-only framing where the underlying judgment is surface-agnostic
- Adding surface vocabulary to the hub's `intent_signals`
- Recording a baseline for the new phrases before any edit

### Out of Scope
- A separate slide-deck or print mode - the judgment is shared, and a fork would duplicate it
- The design-taste layer `016` retired, which stays retired
- Any change to chart or diagram, which own their own canvases

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-fundamentals/SKILL.md` | Modify | Name the surfaces and what differs |
| `.opencode/skills/sk-design/sk-design-fundamentals/references/` | Modify | De-UI the framing where the judgment is shared |
| `.opencode/skills/sk-design/graph-metadata.json` | Modify | Surface vocabulary in `intent_signals` |
| `.opencode/skills/sk-design/ROUTER.md`, `SKILL.md` | Modify | The intent description a reader sees |
| `specs/sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui/scratch/` | Create | Baseline and replay for the new phrases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The fundamentals contract names the surfaces it serves and says what differs between them. |
| REQ-002 | A surface-specific phrase for a slide deck, a printed page and a document layout each reach `sk-design` above the bar. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | No existing phrase in the packet's sixteen-phrase baseline drops. |
| REQ-004 | The boundary between fundamentals and the chart and diagram modes stays legible: a canvas question still reaches the mode that owns that canvas. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three new surface phrases reach `sk-design` above 0.8, measured after an explicit daemon rebuild.
- **SC-002**: All sixteen baseline phrases hold at or above their recorded scores.
- **SC-003**: A chart phrase still reaches the chart mode and a diagram phrase the diagram mode, not fundamentals.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The hub's `intent_signals` | Keywords in `description.json` move no score, measured twice in this packet | Put every routing phrase in `graph-metadata.json` |
| Dependency | A baseline for the new phrases | Without it there is nothing to compare against, and it cannot be recaptured | Capture it before any edit |
| Risk | Broadening the vocabulary pulls chart and diagram phrases into fundamentals | High | Replay the chart and diagram phrases as controls, not only the new ones |
| Risk | Surface-agnostic framing becomes vague framing | Medium | Say what differs per surface, not only what is shared |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target; the measured quantity is advisor confidence per phrase.

### Security
- **NFR-S01**: No credential, dependency or network call is added.

### Reliability
- **NFR-R01**: Every routing claim is quoted with the daemon generation it was measured at.

---

## 8. EDGE CASES

### Data Boundaries
- A surface nobody named: the contract says which surfaces it covers, so an unlisted one is a clean gap rather than a silent wrong answer.
- A phrase that spans two surfaces: routed to fundamentals, which is where shared judgment lives.

### Error Scenarios
- A new phrase that pulls a chart or diagram phrase off its mode: caught by replaying those as controls.
- A phrase that still reaches nobody after the vocabulary edit: reported as an open gap, not rounded up.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: one contract, its references, hub vocabulary and router prose |
| Risk | 12/25 | Auth: N, API: N, Breaking: routing, since vocabulary changes can pull sibling phrases |
| Research | 9/20 | What differs per surface needs deciding, not looking up |
| Multi-Agent | 2/15 | Single workstream |
| Coordination | 7/15 | Depends on the renames landing so the contract names final mode names |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | New vocabulary pulls chart or diagram phrases into fundamentals | H | H | Replay those as controls in the same measurement |
| R-002 | De-UI framing loses the specificity that made the guidance useful | M | H | Say what differs per surface, not only what is shared |
| R-003 | A new phrase still reaches nobody | M | M | Report it as an open gap rather than tuning until it moves |

---

## 11. USER STORIES

### US-001: A slide-deck design question reaches the same judgment a UI question does (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A canvas question still reaches the mode that owns that canvas (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Which surfaces to name. Screen UI, slide decks, and printed or document layouts are clear; whether
  email, dashboards and data-dense reports are separate surfaces or variants of the three is not.
- Whether any existing reference is genuinely UI-only rather than UI-framed, and should stay that way.
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
