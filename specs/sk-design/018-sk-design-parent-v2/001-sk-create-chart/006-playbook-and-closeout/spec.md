---
title: "Feature Specification: Phase 6: playbook-and-closeout"
description: "The manual testing playbook says what the skill doing its job looks like, written to the operator-scenario contract. Then the fleet gates run, and the packet closes on their output rather than on a reading."
trigger_phrases:
  - "chart manual testing playbook"
  - "operator scenario contract"
  - "fleet gate closeout"
  - "lane c fields skip trap"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: playbook-and-closeout

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A playbook to the operator-scenario contract, then the whole-fleet gates. The contract detail that matters: adding routing-gold frontmatter fields makes the package a declared corpus, which excludes it from the operator contract and reports SKIP at exit zero.

**Key Decisions**: Which scenarios earn a place, and where the playbook sits

**Critical Dependencies**: Every earlier phase, since the playbook describes the finished skill

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-routing-integration |
| **Successor** | None |
| **Handoff Criteria** | The playbook validates under the operator-scenario contract with a nonzero operator count, and the fleet gates pass from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Bring the lieflat-charts skill into this repository as sk-create-chart specification.

**Scope Boundary**: The playbook and the closing gates. No new capability is added at this point.

**Dependencies**:
- All five earlier phases. The playbook describes what they produced

**Deliverables**:
- A manual testing playbook with real scenarios
- A passing operator-contract check with a nonzero scenario count
- Fleet gate output from the final state

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nothing yet states what this skill doing its job looks like, so nothing can tell a later reader whether a change broke it. Every other mode in this area carries a manual testing playbook, and this one arrives without one because the source never had the concept.

The contract has a trap worth naming before anyone writes a scenario. Playbook scenario frontmatter is a title, a description, a stage and a four-part version. The routing-gold fields, the expected intent and the expected resources and their siblings, are required only when a playbook is a declared corpus for a hub. Adding them to a playbook that is not one excludes the package from the operator contract, which then reports an operator count of zero and a status of SKIP, at exit zero. A check that only greps for a failure reads that as clean.

### Purpose

A reader can tell whether the chart skill still works, and the gates that judge the packet have run from its final state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A manual testing playbook covering the chart families and the colour system
- Scenario frontmatter to the operator contract, and nothing beyond it
- The whole-fleet gates run from the final state, with their output read
- Reconciling the packet's completion metadata against what actually shipped

### Out of Scope

- Routing-gold frontmatter fields. This playbook is not a declared corpus, and adding them turns a pass into a silent skip
- New capability. Anything discovered here that the skill should do is a finding for a later packet
- Re-running earlier phases' proofs as a substitute for the fleet gates

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The package's manual testing playbook | Create | Scenarios covering the chart families and the colour system |
| specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout/implementation-summary.md | Modify | Final state, evidence and anything left open |
| The packet's checklist and status fields | Modify | Reconciled against what shipped |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The playbook validates under the operator-scenario contract, with an operator scenario count above zero. |
| REQ-002 | No scenario carries a routing-gold field, since the package is not a declared corpus. |
| REQ-003 | `validate.sh --strict --recursive` over the packet prints an explicit RESULT: PASSED, and the rule output is present rather than absent. |
| REQ-004 | `ci-skill-root-metadata.cjs` reports no violation across the fleet, not only for this root. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Scenarios cover each chart family and the colour system rather than one representative case. |
| REQ-006 | Completion metadata across the packet's documents agrees, with no document claiming a state another contradicts. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator-contract check reports a nonzero scenario count and a status that is not SKIP.
- **SC-002**: `validate.sh --strict --recursive` prints RESULT: PASSED with rule lines present.
- **SC-003**: The fleet metadata check passes across all roots, so this adoption did not break a neighbour.
- **SC-004**: No packet document claims a completion state that another document contradicts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator-scenario contract | Misreading it produces a playbook that reports SKIP at exit zero and looks clean | Require a nonzero count, not an exit status |
| Risk | A validate run that never validated anything | High. A stale compiled orchestrator exits 3 with no rule output, and a failure grep reads silence as a pass | Require an explicit RESULT: PASSED line |
| Risk | Scenarios written to pass rather than to catch | Medium | Each scenario names what it would catch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable.

### Security
- **NFR-S01**: Not applicable.

### Reliability
- **NFR-R01**: A scenario is only worth its place if a plausible break makes it fail. That is the bar for inclusion.

---

## 8. EDGE CASES

### Data Boundaries
- A chart family with no meaningful failure mode still gets a scenario, or its absence is explained.
- A scenario that cannot be run without the desktop rendering it needs states that as its precondition.

### Error Scenarios
- The contract check reports SKIP: look for routing-gold fields before looking anywhere else.
- `validate.sh` exits 0 with no rule output: the orchestrator is stale, and nothing has been validated yet.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: the playbook, the summary and the packet's status fields. |
| Risk | 14/25 | Auth: N, API: N, Breaking: N. The risk is a false green rather than a break. |
| Research | 8/20 | The contract is written down. Reading it correctly is the work. |
| Multi-Agent | 4/15 | Workstreams: 1. |
| Coordination | 14/15 | Dependencies: every earlier phase, plus the fleet gates. |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Routing-gold fields added, package silently excluded, reported as passing | H | M | Require a nonzero operator scenario count as the evidence |
| R-002 | A stale orchestrator turns a non-run into a pass | H | M | Require the explicit RESULT line and visible rule output |
| R-003 | Completion metadata disagrees across documents | M | M | Reconcile before the completion claim, not after |

---

## 11. USER STORIES

### US-001: A way to tell it still works (Priority: P0)

**As a** maintainer, **I want** scenarios that fail when the skill breaks, **so that** a later change cannot quietly regress the charts.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: An honest close (Priority: P1)

**As a** operator, **I want** a packet that closes on gate output, **so that** the completion claim means something.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

Both questions are answered, and two new items close as recorded unknowns rather than as answers.

**Does each chart family need its own scenario?** No. The failure modes cut across families
rather than along them, so a per-family set would produce six documents failing for the same
reason. Every family is still named in the root playbook's coverage table, mapped to the
scenario that carries it and the reason that scenario is the one.

**Which scenarios can run headless?** Five of the eight need nothing but Node. `CHT-004` needs a
Chrome or Chromium binary and says so in its own preconditions. `CHT-003` needs a desktop
browser a person can read, which is the one scenario that cannot be graded from markup at all.
Each records a `SKIP` naming its blocker rather than a pass.

**Recorded unknowns:**

- The packet changelog still describes the scaffold release, so it tells a reader the corpus is
  empty and nothing routes to the packet. Both statements are false in the tree that reader is
  holding. The fix is a new changelog entry plus a matching `SKILL.md` version bump, which
  belongs to the phases that shipped the corpus and the routing.
- A bare two-word chart form name scores below the mandatory-invoke bar at the first routing
  stage, while a full request carrying the same name clears it. The measurement and the check
  that would settle it are in `implementation-summary.md`.
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
