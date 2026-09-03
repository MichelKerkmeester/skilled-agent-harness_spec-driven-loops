---
title: "Feature Specification: routing completeness and findings closure [template:level-3/spec.md]"
description: "Routing was measured rather than assumed and came back at 21 of 48 realistic phrasings. Around thirty further findings sit diagnosed and unfixed across one hub, three of its modes, a tooling skill and the spec-kit suite. This packet closes them against numbers rather than impressions."
trigger_phrases:
  - "routing completeness"
  - "gate a signal closure"
  - "gate b realistic corpus"
  - "advisor transport disagreement"
  - "close the routing findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: routing completeness and findings closure

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `scaffold/052-routing-completeness-and` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A hub can be complete in every registry and still not be reachable. That is not a
hypothesis here, it is a measurement: 21 of 48 phrasings a person would actually type
reached the right mode, six modes scored zero of three, and one mode was reachable at stage
one and dropped at stage two.

Around thirty further findings sit alongside it, each already diagnosed and evidenced during
the session that produced them. They are unfixed rather than unknown, which is a different
and more tractable problem.

The reason all of this survived is worth stating, because it shapes the work. Every
automated gate reads the registries. Nothing reads the README, nothing reads a link label
against its target, nothing checks whether a declared phrase resolves to anything, and
nothing compares a document's claim against the tree it describes.

### Purpose

Routing is provable rather than asserted, and every open finding is fixed, planned with an
owner, or closed as a recorded decision.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Two measurable routing gates, defined so the word complete has a number behind it.
- The cross-hub vocabulary collision, which no single hub can fix alone.
- The hub surfaces that contradict their own registries and have no gate.
- The document-validator and template debt that lets a clean score hide a seeded defect.
- The spec-kit residue, its never-typechecked tests, and the five calls that need a human.

### Out of Scope

- Rewriting the advisor scoring engine. The two transports disagree and that is recorded as
  a finding rather than repaired here, because changing a scorer invalidates every number in
  this packet.
- The voice backlogs. They are measured in the thousands, they are a writing job rather than
  a substitution, and folding them in would bury the routing work.
- Anything that would edit a shipped rule or planning document purely to quiet a command
  that gates nothing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | [Requirement description] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | [Requirement description] |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

Two, and both are decisions rather than unknowns.

Whether the two scorers should be reconciled at all, or whether one is simply the automatic
path and the other a manual command that should stop being documented as equivalent. They
disagree on roughly a third of prompts, which is too much to leave undescribed and too
invasive to repair inside a packet whose every number depends on the scorer holding still.

Whether a request that genuinely spans two hubs should resolve to one of them or surface as
ambiguous. The runtime already surfaces ambiguity, so the honest answer may be that a tie is
the correct outcome and the target should exclude those rows rather than counting them as
misses.
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

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-transport-and-baseline/ | Settle which scorer governs automatic routing, then freeze the baseline every later number is measured against | Pending |
| 2 | 002-gate-a-signal-closure/ | Every declared signal across all five hubs resolves to exactly one mode | Pending |
| 3 | 003-gate-b-realistic-corpus/ | A committed corpus of phrasings people actually type, and the rate at which they land | Pending |
| 4 | 004-cross-hub-vocabulary/ | The collision no single hub can fix, decided jointly and re-measured | Pending |
| 5 | 005-hub-surface-truth/ | The hub documents that contradict their own registries, and a gate so they cannot again | Pending |
| 6 | 006-validator-and-template-debt/ | The fixture exemption, the template scanning gap, and the boilerplate a template keeps seeding | Pending |
| 7 | 007-spec-kit-residue/ | The remaining suite failures, the untypechecked tests, and the five calls that need a human | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | The governing transport is named with the code path that proves it, and a baseline is recorded | The named path is read end to end, and re-running the baseline reproduces its numbers |
| 002 | 003 | Every declared signal is classified, and none sits in an unexplained bucket | A fresh sweep reproduces the counts, and each unresolved signal has a decision beside it |
| 003 | 004 | The corpus is committed and re-runnable, and its rate is recorded | A second run of the same corpus returns the same rate |
| 004 | 005 | The collision is decided, both hubs re-measured, canaries green and manifests fresh | Neither hub lost a prompt it owned, shown by the before and after tables |
| 005 | 006 | Every hub surface agrees with its registries, and a check exists that fails when they diverge | Removing an entry makes the new check fail |
| 006 | 007 | The validator exempts what the packaging gate already exempts, and templates scan their own payload | A template with a seeded blocker is caught rather than scoring clean |
<!-- /ANCHOR:phase-map -->
